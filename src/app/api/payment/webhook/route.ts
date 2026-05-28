import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { sendOrderConfirmEmail } from '@/lib/email'

const POINT_RATE = 0.01

/** TossPayments 웹훅 페이로드 */
interface TossWebhookPayload {
  createdAt: string
  secret: string          // 대시보드에서 설정한 웹훅 시크릿
  status: string          // DONE | CANCELED | PARTIAL_CANCELED | ABORTED | EXPIRED
  transactionKey: string
  paymentKey: string
  orderId: string
}

async function processConfirm(orderId: string, paymentKey: string) {
  const supabase = createServiceClient()

  /* ── 1. 주문 조회 ── */
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .select('id, total_price, payment_status, user_id')
    .eq('id', orderId)
    .single()

  if (orderErr || !order) {
    console.error('[webhook] 주문 없음:', orderId)
    return
  }

  /* ── 2. 멱등성: 이미 처리된 주문은 스킵 ── */
  if (order.payment_status === 'paid') {
    console.log('[webhook] 이미 처리된 주문:', orderId)
    return
  }

  /* ── 3. 주문 상태 업데이트 ── */
  await supabase
    .from('orders')
    .update({ payment_status: 'paid', status: 'confirmed', payment_method: 'card' })
    .eq('id', orderId)

  /* ── 4. 재고 차감 ── */
  const { data: orderItems } = await supabase
    .from('order_items')
    .select('product_id, quantity')
    .eq('order_id', orderId)

  if (orderItems?.length) {
    await Promise.all(
      orderItems.map((item) =>
        supabase.rpc('decrement_stock', {
          p_product_id: item.product_id,
          p_quantity: item.quantity,
        })
      )
    )
  }

  /* ── 5. 포인트 적립 ── */
  const { data: profile } = await supabase
    .from('profiles')
    .select('point_balance')
    .eq('id', order.user_id)
    .single()

  const earnedPoints = Math.floor(order.total_price * POINT_RATE)
  if (earnedPoints > 0) {
    await Promise.all([
      supabase.from('points').insert({
        user_id: order.user_id,
        amount: earnedPoints,
        reason: '주문 적립 (1%)',
        order_id: orderId,
      }),
      supabase
        .from('profiles')
        .update({ point_balance: (profile?.point_balance ?? 0) + earnedPoints })
        .eq('id', order.user_id),
    ])
  }

  /* ── 6. 확인 이메일 ── */
  const { data: authUser } = await supabase.auth.admin.getUserById(order.user_id)
  if (authUser?.user?.email) {
    const [itemsResult, profileResult, orderResult] = await Promise.all([
      supabase.from('order_items').select('quantity, price_at_purchase, products(name)').eq('order_id', orderId),
      supabase.from('profiles').select('name').eq('id', order.user_id).single(),
      supabase.from('orders').select('total_price, addresses(address)').eq('id', orderId).single(),
    ])

    sendOrderConfirmEmail({
      to: authUser.user.email,
      orderId,
      customerName: profileResult.data?.name ?? '',
      items: (itemsResult.data ?? []).map((oi: any) => ({
        name: oi.products?.name ?? '상품',
        quantity: oi.quantity,
        price: oi.price_at_purchase * oi.quantity,
      })),
      totalPrice: orderResult.data?.total_price ?? order.total_price,
      address: (orderResult.data?.addresses as any)?.address ?? '',
      earnedPoints,
    }).catch(console.error)
  }

  console.log('[webhook] 결제 완료 처리:', orderId)
}

async function processCanceled(orderId: string) {
  const supabase = createServiceClient()

  const { data: order } = await supabase
    .from('orders')
    .select('id, payment_status')
    .eq('id', orderId)
    .single()

  if (!order || order.payment_status === 'cancelled') return

  await supabase
    .from('orders')
    .update({ payment_status: 'cancelled', status: 'cancelled' })
    .eq('id', orderId)

  /* 재고 복구 */
  const { data: orderItems } = await supabase
    .from('order_items')
    .select('product_id, quantity')
    .eq('order_id', orderId)

  if (orderItems?.length) {
    await Promise.all(
      orderItems.map((item) =>
        supabase.rpc('increment_stock', {
          p_product_id: item.product_id,
          p_quantity: item.quantity,
        })
      )
    )
  }

  console.log('[webhook] 결제 취소 처리:', orderId)
}

export async function POST(req: NextRequest) {
  let body: TossWebhookPayload

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  /* ── 웹훅 시크릿 검증 ── */
  const webhookSecret = process.env.TOSS_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('[webhook] TOSS_WEBHOOK_SECRET 환경변수 미설정')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }
  if (body.secret !== webhookSecret) {
    console.error('[webhook] 시크릿 불일치')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { status, orderId, paymentKey } = body

  try {
    switch (status) {
      case 'DONE':
        await processConfirm(orderId, paymentKey)
        break
      case 'CANCELED':
      case 'PARTIAL_CANCELED':
        await processCanceled(orderId)
        break
      case 'ABORTED':
      case 'EXPIRED':
        /* 결제 실패 — 주문 상태만 업데이트 */
        await createServiceClient()
          .from('orders')
          .update({ payment_status: 'failed', status: 'cancelled' })
          .eq('id', orderId)
        break
      default:
        console.log('[webhook] 알 수 없는 status:', status)
    }
  } catch (err) {
    console.error('[webhook] 처리 중 오류:', err)
    /* Toss는 200이 아니면 재시도하므로 오류 시 500 반환 */
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }

  /* 반드시 200 반환 — Toss가 재시도하지 않게 */
  return NextResponse.json({ ok: true })
}

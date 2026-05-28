import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendOrderConfirmEmail } from '@/lib/email'

const POINT_RATE = 0.01

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  const { paymentKey, orderId, amount, usedPoints = 0 } = await req.json() as {
    paymentKey: string
    orderId: string
    amount: number
    usedPoints?: number
  }

  if (!paymentKey || !orderId || !amount) {
    return NextResponse.json({ error: '필수 파라미터가 누락되었습니다.' }, { status: 400 })
  }

  // ── 1) DB에서 주문 조회 (Toss 호출 전 먼저 검증) ──────────────────────────
  const { data: order } = await supabase
    .from('orders')
    .select('id, total_price, payment_status, user_id')
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single()

  if (!order) {
    return NextResponse.json({ error: '주문을 찾을 수 없습니다.' }, { status: 404 })
  }

  // ── 2) 중복 confirm 방지 ──────────────────────────────────────────────────
  if (order.payment_status === 'paid') {
    return NextResponse.json({ success: true, orderId, earnedPoints: 0, alreadyConfirmed: true })
  }

  // ── 3) 결제 금액 검증 (±1원 허용: 부동소수점 오차 대비) ──────────────────
  if (Math.abs(order.total_price - amount) > 1) {
    console.error(`[payment/confirm] 금액 불일치 orderId=${orderId} DB=${order.total_price} Toss=${amount}`)
    return NextResponse.json(
      { error: '결제 금액이 주문 금액과 일치하지 않습니다.' },
      { status: 400 }
    )
  }

  // ── 4) TossPayments 결제 승인 API 호출 ────────────────────────────────────
  const secretKey = process.env.TOSS_SECRET_KEY
  if (!secretKey) {
    return NextResponse.json({ error: '결제 키가 설정되지 않았습니다.' }, { status: 500 })
  }

  const encodedKey = Buffer.from(`${secretKey}:`).toString('base64')
  const tossRes = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${encodedKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  })

  if (!tossRes.ok) {
    const errBody = await tossRes.json().catch(() => ({}))
    console.error('[payment/confirm] TossPayments error:', errBody)
    return NextResponse.json(
      { error: errBody?.message ?? '결제 승인에 실패했습니다.' },
      { status: tossRes.status }
    )
  }

  const tossData = await tossRes.json()

  // ── 5) 주문 상태 업데이트 ─────────────────────────────────────────────────
  await supabase
    .from('orders')
    .update({
      payment_status: 'paid',
      status: 'confirmed',
      payment_method: tossData.method ?? 'card',
    })
    .eq('id', orderId)

  // ── 6) 재고 차감 ──────────────────────────────────────────────────────────
  const { data: orderItems } = await supabase
    .from('order_items')
    .select('product_id, quantity')
    .eq('order_id', orderId)

  if (orderItems && orderItems.length > 0) {
    await Promise.all(
      orderItems.map((item) =>
        supabase.rpc('decrement_stock', {
          p_product_id: item.product_id,
          p_quantity: item.quantity,
        })
      )
    )
  }

  // ── 7) 포인트 처리 (적립 + 사용 차감) ───────────────────────────────────
  const { data: profile } = await supabase
    .from('profiles')
    .select('point_balance')
    .eq('id', user.id)
    .single()

  const currentBalance = profile?.point_balance ?? 0
  // usedPoints를 실제 잔액·결제금액 범위로 제한 (클라이언트 조작 방어)
  const safeUsedPoints = Math.min(Math.max(0, usedPoints), currentBalance, amount)
  // 적립: 실결제금액(amount)의 1% — 포인트 사용 후 실제 결제한 금액 기준
  const earnedPoints = Math.floor(amount * POINT_RATE)
  const pointRows: { user_id: string; amount: number; reason: string; order_id: string }[] = []

  if (safeUsedPoints > 0) {
    pointRows.push({ user_id: user.id, amount: -safeUsedPoints, reason: '포인트 사용', order_id: orderId })
  }
  if (earnedPoints > 0) {
    pointRows.push({ user_id: user.id, amount: earnedPoints, reason: '주문 적립 (1%)', order_id: orderId })
  }

  const newBalance = Math.max(0, currentBalance - safeUsedPoints + earnedPoints)

  if (pointRows.length > 0 || currentBalance !== newBalance) {
    await Promise.all([
      pointRows.length > 0
        ? supabase.from('points').insert(pointRows)
        : Promise.resolve(),
      supabase.from('profiles').update({ point_balance: newBalance }).eq('id', user.id),
    ])
  }

  // ── 8) 주문 확인 이메일 (비동기) ──────────────────────────────────────────
  if (user.email) {
    const { data: fullOrderItems } = await supabase
      .from('order_items')
      .select('quantity, price_at_purchase, products(name)')
      .eq('order_id', orderId)

    const { data: profileData } = await supabase
      .from('profiles').select('name').eq('id', user.id).single()

    const { data: orderData } = await supabase
      .from('orders').select('total_price, addresses(address)').eq('id', orderId).single()

    sendOrderConfirmEmail({
      to: user.email,
      orderId,
      customerName: profileData?.name ?? '',
      items: (fullOrderItems ?? []).map((oi: any) => ({
        name: oi.products?.name ?? '상품',
        quantity: oi.quantity,
        price: oi.price_at_purchase * oi.quantity,
      })),
      totalPrice: orderData?.total_price ?? order.total_price,
      address: (orderData?.addresses as any)?.address ?? '',
      earnedPoints,
    }).catch(console.error)
  }

  return NextResponse.json({ success: true, orderId, earnedPoints })
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type RouteContext = { params: Promise<{ orderId: string }> }

// 취소 가능한 주문 상태
const CANCELLABLE_STATUSES = ['pending', 'confirmed']

// ── PATCH /api/orders/[orderId] — 주문 취소 ────────────────────────────────
export async function PATCH(_req: NextRequest, { params }: RouteContext) {
  const { orderId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  // 주문 조회 (본인 주문만)
  const { data: order, error: fetchErr } = await supabase
    .from('orders')
    .select('id, status, payment_status, total_price')
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single()

  if (fetchErr || !order) {
    return NextResponse.json({ error: '주문을 찾을 수 없습니다.' }, { status: 404 })
  }

  // 취소 가능 상태 검증
  if (!CANCELLABLE_STATUSES.includes(order.status)) {
    return NextResponse.json(
      { error: '이미 처리 중인 주문은 취소할 수 없어요. 고객센터로 문의해주세요.' },
      { status: 400 }
    )
  }

  // TODO: orders 테이블에 payment_key(toss_payment_key) 컬럼이 추가되면
  //       아래 로직으로 Toss 환불 API를 호출하세요.
  //
  // const { data: orderWithKey } = await supabase
  //   .from('orders')
  //   .select('payment_key')
  //   .eq('id', orderId)
  //   .single()
  //
  // if (orderWithKey?.payment_key && order.payment_status === 'paid') {
  //   const cancelRes = await fetch(
  //     `https://api.tosspayments.com/v1/payments/${orderWithKey.payment_key}/cancel`,
  //     {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': `Basic ${Buffer.from(process.env.TOSS_SECRET_KEY + ':').toString('base64')}`,
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ cancelReason: '고객 요청 취소' }),
  //     }
  //   )
  //   if (!cancelRes.ok) {
  //     return NextResponse.json(
  //       { error: '결제 취소에 실패했어요. 고객센터로 문의해주세요.' },
  //       { status: 400 }
  //     )
  //   }
  // }

  // 주문 상태를 cancelled로 변경
  const { error: updateErr } = await supabase
    .from('orders')
    .update({ status: 'cancelled' })
    .eq('id', orderId)
    .eq('user_id', user.id)

  if (updateErr) {
    return NextResponse.json({ error: '주문 취소 처리에 실패했습니다.' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

// ── DELETE /api/orders/[orderId] — 결제 실패 시 pending 주문 삭제 ──────────
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { orderId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  // pending 상태인 본인 주문만 삭제 (이미 처리된 주문은 조용히 무시)
  const { data: order } = await supabase
    .from('orders')
    .select('id, status')
    .eq('id', orderId)
    .eq('user_id', user.id)
    .eq('status', 'pending')
    .single()

  if (!order) {
    // 없거나 이미 처리된 주문 — 조용히 성공 응답
    return NextResponse.json({ success: true })
  }

  await supabase.from('order_items').delete().eq('order_id', orderId)
  await supabase.from('orders').delete().eq('id', orderId).eq('user_id', user.id)

  return NextResponse.json({ success: true })
}

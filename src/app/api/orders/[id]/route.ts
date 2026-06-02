import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/orders/[id] — 주문 상세 조회
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })

  const { data: order, error } = await supabase
    .from('orders')
    .select('id, total_price, status, created_at, order_items(id, quantity, price_at_purchase, products(name, image_url))')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !order) return NextResponse.json({ error: '주문을 찾을 수 없습니다.' }, { status: 404 })

  return NextResponse.json({ order })
}

// PATCH /api/orders/[id] — 주문 취소 (사용자)
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })

  // 취소 사유 파싱 (선택사항)
  let cancelReason: string | null = null
  try {
    const body = await req.json()
    cancelReason = body?.reason ?? null
  } catch { /* body 없으면 무시 */ }

  // 본인 주문인지 + 취소 가능한 상태인지 확인
  const { data: order } = await supabase
    .from('orders')
    .select('id, status, order_items(product_id, quantity)')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!order) return NextResponse.json({ error: '주문을 찾을 수 없습니다.' }, { status: 404 })
  if (!['pending', 'confirmed'].includes(order.status)) {
    return NextResponse.json({ error: '이미 준비 중인 주문은 취소할 수 없어요.' }, { status: 400 })
  }

  // 상태 변경 + 취소 사유 저장
  const updatePayload: Record<string, string | null> = { status: 'cancelled' }
  if (cancelReason) updatePayload.cancel_reason = cancelReason

  const { error } = await supabase
    .from('orders')
    .update(updatePayload)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // 재고 복구
  const items = (order.order_items ?? []) as { product_id: string; quantity: number }[]
  await Promise.all(
    items.map(({ product_id, quantity }) =>
      supabase.rpc('increment_stock', { p_product_id: product_id, p_quantity: quantity })
        .then(({ error: rpcErr }) => {
          if (rpcErr) {
            return supabase
              .from('products')
              .select('stock')
              .eq('id', product_id)
              .single()
              .then(({ data }) => {
                if (data) {
                  return supabase.from('products').update({ stock: data.stock + quantity }).eq('id', product_id)
                }
              })
          }
        })
    )
  )

  // 포인트 환불 (구매 시 차감된 포인트 복구)
  const { data: pointTxns } = await supabase
    .from('points')
    .select('amount')
    .eq('order_id', id)
    .eq('user_id', user.id)

  if (pointTxns && pointTxns.length > 0) {
    const netPoints = pointTxns.reduce((sum: number, t: { amount: number }) => sum + t.amount, 0)
    if (netPoints < 0) {
      const refundAmount = -netPoints
      const { data: profile } = await supabase
        .from('profiles')
        .select('point_balance')
        .eq('id', user.id)
        .single()
      const newBalance = Math.max(0, (profile?.point_balance ?? 0) + refundAmount)
      await Promise.all([
        supabase.from('points').insert({
          user_id: user.id,
          amount: refundAmount,
          reason: '주문 취소 포인트 환불',
          order_id: id,
        }),
        supabase.from('profiles').update({ point_balance: newBalance }).eq('id', user.id),
      ])
    }
  }

  return NextResponse.json({ ok: true })
}

// DELETE /api/orders/[id] — pending 주문 취소 (결제창 닫거나 실패 시 호출)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // 본인 주문이며 pending 상태인 것만 삭제
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)
    .eq('payment_status', 'pending')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

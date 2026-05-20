import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// PATCH /api/orders/[id] — 주문 취소 (사용자)
export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })

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

  // 상태 변경
  const { error } = await supabase
    .from('orders')
    .update({ status: 'cancelled' })
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

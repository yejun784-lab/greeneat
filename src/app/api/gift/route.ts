import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })

  const {
    product_id,
    quantity,
    recipient_name,
    recipient_phone,
    recipient_address,
    recipient_address_detail,
    gift_message,
  } = await req.json()

  if (!product_id || !recipient_name || !recipient_phone || !recipient_address) {
    return NextResponse.json({ error: '받는 분 정보를 모두 입력해주세요.' }, { status: 400 })
  }

  const safeQty = quantity ?? 1
  if (!Number.isInteger(safeQty) || safeQty < 1 || safeQty > 10) {
    return NextResponse.json({ error: '수량은 1~10 사이여야 합니다.' }, { status: 400 })
  }

  if (gift_message && gift_message.length > 200) {
    return NextResponse.json({ error: '선물 메시지는 200자 이내로 입력해주세요.' }, { status: 400 })
  }

  // 상품 조회
  const { data: product } = await supabase
    .from('products')
    .select('id, name, price, stock, is_active')
    .eq('id', product_id)
    .single()

  if (!product) return NextResponse.json({ error: '존재하지 않는 상품입니다.' }, { status: 404 })
  if (!product.is_active) return NextResponse.json({ error: '현재 판매 중이 아닙니다.' }, { status: 400 })
  if (product.stock < safeQty) {
    return NextResponse.json({ error: `재고가 부족합니다. (잔여: ${product.stock}개)` }, { status: 400 })
  }

  const qty = safeQty
  const totalPrice = product.price * qty

  // 배송지 저장 (수신자 주소)
  const { data: savedAddress } = await supabase
    .from('addresses')
    .insert({
      user_id: user.id,
      label: `${recipient_name}님 선물`,
      address: recipient_address,
      detail: recipient_address_detail ?? null,
    })
    .select()
    .single()

  // 주문 생성
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      total_price: totalPrice,
      payment_method: 'card',
      payment_status: 'paid',
      status: 'confirmed',
      address_id: savedAddress?.id ?? null,
      is_gift: true,
      gift_message: gift_message ?? null,
      recipient_name,
      recipient_phone,
    })
    .select()
    .single()

  if (orderErr || !order) {
    return NextResponse.json({ error: '주문 생성에 실패했습니다.' }, { status: 500 })
  }

  // 주문 상품
  await supabase.from('order_items').insert({
    order_id: order.id,
    product_id: product.id,
    quantity: qty,
    price_at_purchase: product.price,
  })

  // 재고 차감
  const { error: rpcErr } = await supabase.rpc('decrement_stock', {
    p_product_id: product.id,
    p_quantity: qty,
  })
  if (rpcErr) {
    await supabase.from('products').update({ stock: product.stock - qty }).eq('id', product.id)
  }

  return NextResponse.json({ orderId: order.id })
}

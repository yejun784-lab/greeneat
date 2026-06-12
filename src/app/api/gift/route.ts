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
  // 선물은 배송비 무료 (UI와 일치). 서버가 가격의 단일 출처.
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

  // ── 주문 생성 (결제 미확정: pending) ──────────────────────────────────────
  // 보안: 토스 결제 승인 전에는 절대 'paid'로 만들지 않는다. /api/payment/confirm 이
  // 금액 검증 후 'paid'/'confirmed'로 전환하고 재고를 차감한다. (결제 없는 무료 선물주문 차단)
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      total_price: totalPrice,
      payment_method: 'card',
      payment_status: 'pending',
      status: 'pending',
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

  // 주문 상품 (가격은 DB의 실제 가격 사용)
  await supabase.from('order_items').insert({
    order_id: order.id,
    product_id: product.id,
    quantity: qty,
    price_at_purchase: product.price,
  })

  // 재고 차감은 결제 승인(confirm) 시점에 수행 — 여기서는 차감하지 않는다.
  return NextResponse.json({ orderId: order.id, amount: totalPrice })
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const POINT_RATE = 0.01  // 주문금액의 1% 적립

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  const body = await req.json()
  const {
    items,
    address,
    totalPrice,
    usedPoints = 0,
    couponId = null,
    deliveryDate = null,
  } = body as {
    items: { product_id: string; quantity: number; price: number }[]
    address: { address: string; detail?: string }
    totalPrice: number
    usedPoints?: number
    couponId?: string | null
    deliveryDate?: string | null
  }

  // ── 보안 불변식 ────────────────────────────────────────────────────────────
  // 주문은 이 엔드포인트에서 절대 'paid'로 생성하지 않는다. 항상 결제 미확정(pending)으로만
  // 만들고, 'paid'/'confirmed' 전환은 오직 /api/payment/confirm(토스 승인 검증) 또는
  // 결제 웹훅에서만 일어난다. (클라이언트가 pending:false를 보내 결제 없이 주문을
  // 확정시키던 우회 경로 차단)
  const pending = true

  if (!items || items.length === 0) {
    return NextResponse.json({ error: '주문 상품이 없습니다.' }, { status: 400 })
  }

  // quantity 양수 검증
  for (const item of items) {
    if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) {
      return NextResponse.json({ error: '수량은 1~99 사이여야 합니다.' }, { status: 400 })
    }
  }

  // usedPoints 음수 방지
  if (usedPoints < 0) {
    return NextResponse.json({ error: '포인트 값이 올바르지 않습니다.' }, { status: 400 })
  }

  // ── 1) 재고 검증 ──────────────────────────────────────────────────────────
  const productIds = items.map((i) => i.product_id)
  const { data: products, error: stockErr } = await supabase
    .from('products')
    .select('id, name, stock, is_active')
    .in('id', productIds)

  if (stockErr || !products) {
    return NextResponse.json({ error: '상품 정보를 불러오지 못했습니다.' }, { status: 500 })
  }

  const productMap = Object.fromEntries(products.map((p) => [p.id, p]))

  for (const item of items) {
    const product = productMap[item.product_id]
    if (!product) {
      return NextResponse.json({ error: '존재하지 않는 상품입니다.' }, { status: 400 })
    }
    if (!product.is_active) {
      return NextResponse.json({ error: `"${product.name}"은(는) 현재 판매 중이 아닙니다.` }, { status: 400 })
    }
    if (product.stock < item.quantity) {
      return NextResponse.json({
        error: `"${product.name}" 재고가 부족합니다. (잔여: ${product.stock}개)`,
      }, { status: 400 })
    }
  }

  // ── 2) 포인트 잔액 조회 ───────────────────────────────────────────────────
  const { data: profile } = await supabase
    .from('profiles')
    .select('point_balance')
    .eq('id', user.id)
    .single()
  const currentBalance = profile?.point_balance ?? 0

  // usedPoints는 serverTotal 계산 후 조정되므로 여기서는 잔액만 확인
  if (usedPoints > currentBalance) {
    return NextResponse.json({ error: '포인트가 부족합니다.' }, { status: 400 })
  }

  // ── 3) 배송지 저장 ────────────────────────────────────────────────────────
  let addressId: string | null = null
  if (address?.address) {
    const { data: savedAddress } = await supabase
      .from('addresses')
      .insert({ user_id: user.id, address: address.address, detail: address.detail ?? null })
      .select()
      .single()
    addressId = savedAddress?.id ?? null
  }

  // ── 4) 주문 생성 (totalPrice 서버에서 재계산) ────────────────────────────
  const serverTotal = items.reduce((sum, item) => {
    const p = productMap[item.product_id]
    return sum + (p?.price ?? 0) * item.quantity
  }, 0)
  // 사용 포인트는 실제 금액 초과 불가
  const safeUsedPoints = Math.min(usedPoints, serverTotal, currentBalance)

  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      total_price: Math.max(0, serverTotal - safeUsedPoints),
      payment_method: 'card',
      payment_status: pending ? 'pending' : 'paid',
      status: pending ? 'pending' : 'confirmed',
      address_id: addressId,
      delivery_date: deliveryDate ?? null,
    })
    .select()
    .single()

  if (error || !order) {
    return NextResponse.json({ error: '주문 생성에 실패했습니다.' }, { status: 500 })
  }

  // ── 5) 주문 상품 저장 (price_at_purchase는 DB의 실제 가격 사용) ──────────
  await supabase.from('order_items').insert(
    items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_purchase: productMap[item.product_id]?.price ?? 0,
    }))
  )

  // ── 6) 재고 차감 (pending이 아닌 경우 즉시, pending은 confirm 시 처리) ──
  if (!pending) {
    await Promise.all(
      items.map((item) =>
        supabase.rpc('decrement_stock', {
          p_product_id: item.product_id,
          p_quantity: item.quantity,
        }).then(({ error: rpcErr }) => {
          if (rpcErr) {
            // RPC 없을 경우 직접 차감
            return supabase
              .from('products')
              .update({ stock: productMap[item.product_id].stock - item.quantity })
              .eq('id', item.product_id)
          }
        })
      )
    )
  }

  // ── 7-a) 쿠폰 사용 횟수 증가 (결제 완료된 경우만) ──────────────────────
  if (!pending && couponId) {
    const { data: couponRow } = await supabase
      .from('coupons')
      .select('used_count')
      .eq('id', couponId)
      .single()
    if (couponRow != null) {
      await supabase
        .from('coupons')
        .update({ used_count: (couponRow.used_count ?? 0) + 1 })
        .eq('id', couponId)
    }
  }

  // ── 7-b) 포인트 처리 (결제 완료된 경우만) ─────────────────────────────────
  if (!pending) {
    const earnedPoints = Math.floor(serverTotal * POINT_RATE)
    const newBalance = currentBalance - safeUsedPoints + earnedPoints

    const pointRows = []
    if (safeUsedPoints > 0) {
      pointRows.push({ user_id: user.id, amount: -safeUsedPoints, reason: '포인트 사용', order_id: order.id })
    }
    if (earnedPoints > 0) {
      pointRows.push({ user_id: user.id, amount: earnedPoints, reason: '주문 적립 (1%)', order_id: order.id })
    }
    await Promise.all([
      pointRows.length > 0 ? supabase.from('points').insert(pointRows) : Promise.resolve(),
      supabase.from('profiles').update({ point_balance: newBalance }).eq('id', user.id),
    ])

    return NextResponse.json({ orderId: order.id, earnedPoints })
  }

  return NextResponse.json({ orderId: order.id })
}

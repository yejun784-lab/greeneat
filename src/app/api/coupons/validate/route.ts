import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  const { code, orderAmount } = await req.json() as { code: string; orderAmount: number }

  if (!code) {
    return NextResponse.json({ valid: false, reason: '쿠폰 코드를 입력해주세요.' })
  }

  const { data: coupon, error } = await supabase
    .from('coupons')
    .select('id, code, discount_type, discount_value, is_active, expires_at, used_count, max_uses, min_order_amount')
    .eq('code', code)
    .single()

  if (error || !coupon) {
    return NextResponse.json({ valid: false, reason: '없는 코드입니다.' })
  }

  if (!coupon.is_active) {
    return NextResponse.json({ valid: false, reason: '만료됨' })
  }

  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return NextResponse.json({ valid: false, reason: '만료됨' })
  }

  if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) {
    return NextResponse.json({ valid: false, reason: '사용횟수초과' })
  }

  if (coupon.min_order_amount !== null && orderAmount < coupon.min_order_amount) {
    return NextResponse.json({ valid: false, reason: '최소주문금액미달' })
  }

  const discount_amount =
    coupon.discount_type === 'percent'
      ? Math.floor((orderAmount * coupon.discount_value) / 100)
      : coupon.discount_value

  return NextResponse.json({
    valid: true,
    coupon: {
      id: coupon.id,
      code: coupon.code,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      discount_amount,
    },
  })
}

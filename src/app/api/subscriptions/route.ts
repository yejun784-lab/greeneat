import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendSubscriptionEmail } from '@/lib/email'

function nextDeliveryDate(deliveryDay: number): string {
  const today = new Date()
  const dayOfWeek = today.getDay() // 0=일, 1=월...
  const target = deliveryDay % 7   // 1=월...5=금, 0=일
  let diff = target - dayOfWeek
  if (diff <= 0) diff += 7
  const next = new Date(today)
  next.setDate(today.getDate() + diff)
  next.setHours(10, 0, 0, 0)
  return next.toISOString()
}

// 구독 생성
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })

  const { plan_type, delivery_day, product_ids } = await req.json()
  if (!plan_type || !delivery_day) {
    return NextResponse.json({ error: '플랜과 배송 요일을 선택해주세요.' }, { status: 400 })
  }

  // 기존 활성 구독 취소
  await supabase
    .from('subscriptions')
    .update({ status: 'cancelled' })
    .eq('user_id', user.id)
    .eq('status', 'active')

  const { data, error } = await supabase
    .from('subscriptions')
    .insert({
      user_id: user.id,
      plan_type,
      delivery_day,
      status: 'active',
      next_delivery_at: nextDeliveryDate(delivery_day),
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // 선택된 상품 저장
  if (product_ids && product_ids.length > 0) {
    await supabase.from('subscription_items').insert(
      product_ids.map((pid: string) => ({
        subscription_id: data.id,
        product_id: pid,
        quantity: 1,
      }))
    )
  }

  // 구독 시작 이메일 (비동기) — user는 위에서 이미 조회됨
  if (user.email) {
    const { data: profile } = await supabase.from('profiles').select('name').eq('id', user.id).single()
    const nextDate = new Date(data.next_delivery_at ?? '')
    const formatted = isNaN(nextDate.getTime())
      ? ''
      : nextDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })
    sendSubscriptionEmail({
      to: user.email,
      customerName: profile?.name ?? '',
      planType: plan_type,
      nextDelivery: formatted,
    }).catch(console.error)
  }

  return NextResponse.json({ subscription: data })
}

// 구독 취소 / 일시정지
export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })

  const { action } = await req.json() // 'pause' | 'cancel'
  const status = action === 'pause' ? 'paused' : 'cancelled'

  const { error } = await supabase
    .from('subscriptions')
    .update({ status })
    .eq('user_id', user.id)
    .eq('status', 'active')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

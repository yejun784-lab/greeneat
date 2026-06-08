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
  if (!plan_type || delivery_day == null) {
    return NextResponse.json({ error: '플랜과 배송 요일을 선택해주세요.' }, { status: 400 })
  }
  const VALID_PLAN_TYPES = ['basic', 'standard', 'premium']
  if (!VALID_PLAN_TYPES.includes(plan_type)) {
    return NextResponse.json({ error: '유효하지 않은 플랜 타입입니다.' }, { status: 400 })
  }
  const dayNum = Number(delivery_day)
  if (!Number.isInteger(dayNum) || dayNum < 0 || dayNum > 6) {
    return NextResponse.json({ error: '배송 요일은 0(일)~6(토) 사이여야 합니다.' }, { status: 400 })
  }
  if (product_ids !== undefined && !Array.isArray(product_ids)) {
    return NextResponse.json({ error: '상품 목록 형식이 올바르지 않습니다.' }, { status: 400 })
  }

  // 기존 활성/일시중지 구독 취소
  await supabase
    .from('subscriptions')
    .update({ status: 'cancelled' })
    .eq('user_id', user.id)
    .in('status', ['active', 'paused'])

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

// 구독 상태 변경 / 메뉴 변경 / 배송 요일 변경
export async function PATCH(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })

  const body = await req.json()
  const { action } = body

  // ── 상태 변경 (pause / cancel / resume) ────────────────────────────────────
  if (action === 'pause' || action === 'cancel' || action === 'resume') {
    const status = action === 'pause' ? 'paused' : action === 'resume' ? 'active' : 'cancelled'
    const fromStatus = action === 'resume' ? 'paused' : action === 'cancel' ? ['active', 'paused'] : 'active'

    let query = supabase.from('subscriptions').update({ status }).eq('user_id', user.id)
    if (Array.isArray(fromStatus)) query = query.in('status', fromStatus)
    else query = query.eq('status', fromStatus)

    const { error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  // ── 메뉴(상품 목록) 변경 ─────────────────────────────────────────────────
  if (action === 'update_items') {
    const { subscription_id, product_ids } = body as { subscription_id: string; product_ids: string[] }
    if (!subscription_id || !product_ids) {
      return NextResponse.json({ error: '필수 파라미터 누락' }, { status: 400 })
    }
    // 본인 구독인지 확인
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('id', subscription_id)
      .eq('user_id', user.id)
      .single()
    if (!sub) return NextResponse.json({ error: '구독을 찾을 수 없습니다.' }, { status: 404 })

    // 기존 아이템 삭제 후 재삽입
    await supabase.from('subscription_items').delete().eq('subscription_id', subscription_id)
    if (product_ids.length > 0) {
      await supabase.from('subscription_items').insert(
        product_ids.map((pid) => ({ subscription_id, product_id: pid, quantity: 1 }))
      )
    }
    return NextResponse.json({ ok: true })
  }

  // ── 배송 요일 변경 ─────────────────────────────────────────────────────────
  if (action === 'update_delivery_day') {
    const { subscription_id, delivery_day } = body as { subscription_id: string; delivery_day: number }
    if (!subscription_id || delivery_day == null) {
      return NextResponse.json({ error: '필수 파라미터 누락' }, { status: 400 })
    }
    const { error } = await supabase
      .from('subscriptions')
      .update({ delivery_day, next_delivery_at: nextDeliveryDate(delivery_day) })
      .eq('id', subscription_id)
      .eq('user_id', user.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  // ── 다음 배송일 변경 ────────────────────────────────────────────────────────
  if (action === 'update_next_delivery') {
    const { subscription_id, next_delivery_at } = body as { subscription_id: string; next_delivery_at: string }
    if (!subscription_id || !next_delivery_at) {
      return NextResponse.json({ error: '필수 파라미터 누락' }, { status: 400 })
    }
    const date = new Date(next_delivery_at)
    if (isNaN(date.getTime()) || date <= new Date()) {
      return NextResponse.json({ error: '유효하지 않은 날짜입니다.' }, { status: 400 })
    }
    const { error } = await supabase
      .from('subscriptions')
      .update({ next_delivery_at: date.toISOString() })
      .eq('id', subscription_id)
      .eq('user_id', user.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  // ── 배송 시간대 변경 ──────────────────────────────────────────────────────
  if (action === 'update_time_slot') {
    const { subscription_id, time_slot } = body as { subscription_id: string; time_slot: string }
    if (!subscription_id || !time_slot) {
      return NextResponse.json({ error: '필수 파라미터 누락' }, { status: 400 })
    }
    const VALID_SLOTS = ['morning', 'afternoon', 'evening']
    if (!VALID_SLOTS.includes(time_slot)) {
      return NextResponse.json({ error: '유효하지 않은 시간대입니다.' }, { status: 400 })
    }
    const { error } = await supabase
      .from('subscriptions')
      .update({ delivery_time_slot: time_slot } as Record<string, unknown>)
      .eq('id', subscription_id)
      .eq('user_id', user.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  // ── 자동 결제 ON/OFF ──────────────────────────────────────────────────────
  if (action === 'update_auto_renew') {
    const { subscription_id, auto_renew } = body as { subscription_id: string; auto_renew: boolean }
    if (!subscription_id || auto_renew == null) {
      return NextResponse.json({ error: '필수 파라미터 누락' }, { status: 400 })
    }
    const { error } = await supabase
      .from('subscriptions')
      .update({ auto_renew } as Record<string, unknown>)
      .eq('id', subscription_id)
      .eq('user_id', user.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  // ── 기간 지정 일시정지 ────────────────────────────────────────────────────
  if (action === 'pause_until') {
    const { subscription_id, pause_until } = body as { subscription_id: string; pause_until: string }
    if (!subscription_id || !pause_until) {
      return NextResponse.json({ error: '필수 파라미터 누락' }, { status: 400 })
    }
    const untilDate = new Date(pause_until)
    if (isNaN(untilDate.getTime()) || untilDate <= new Date()) {
      return NextResponse.json({ error: '유효하지 않은 날짜입니다.' }, { status: 400 })
    }
    const { error } = await supabase
      .from('subscriptions')
      .update({ status: 'paused', paused_until: untilDate.toISOString() } as Record<string, unknown>)
      .eq('id', subscription_id)
      .eq('user_id', user.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ error: '알 수 없는 action' }, { status: 400 })
}

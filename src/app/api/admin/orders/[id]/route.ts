import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdmin } from '@supabase/supabase-js'
import { sendShippingEmail } from '@/lib/email'
import { sendShippingAlimtalk } from '@/lib/kakao'

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()

  // 어드민 권한 확인
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return NextResponse.json({ error: '권한이 없습니다.' }, { status: 403 })

  const { id: orderId } = await params
  let body: { status: string; trackingNumber?: string; carrier?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 })
  }
  const { status, trackingNumber, carrier } = body

  const ALLOWED_STATUSES = ['confirmed', 'preparing', 'shipped', 'delivered', 'cancelled']
  if (!ALLOWED_STATUSES.includes(status)) {
    return NextResponse.json({ error: '유효하지 않은 주문 상태입니다.' }, { status: 400 })
  }

  // 배송 중 상태에는 운송장 번호 필수
  if (status === 'shipped' && !trackingNumber?.trim()) {
    return NextResponse.json({ error: '배송 중 상태에는 운송장 번호가 필요합니다.' }, { status: 400 })
  }

  // 운송장 번호 길이 제한
  if (trackingNumber && trackingNumber.length > 50) {
    return NextResponse.json({ error: '운송장 번호가 너무 깁니다.' }, { status: 400 })
  }

  // 주문 상태 업데이트 (배송 중이면 운송장 정보도 저장)
  const updatePayload: Record<string, string | undefined> = { status }
  if (status === 'shipped' && trackingNumber) {
    updatePayload.tracking_number = trackingNumber
    updatePayload.carrier = carrier ?? 'CJ대한통운'
  }

  const { data: order, error } = await supabase
    .from('orders')
    .update(updatePayload)
    .eq('id', orderId)
    .select('*, profiles(name), addresses(address)')
    .single()

  if (error || !order) {
    return NextResponse.json({ error: '주문 업데이트에 실패했습니다.' }, { status: 500 })
  }

  // 배송 시작 상태로 변경될 때 이메일 + 알림톡 발송
  if (status === 'shipped') {
    // auth.admin API는 service-role 키 필요
    const adminClient = createAdmin(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data: authData } = await adminClient.auth.admin.getUserById(order.user_id)
    const customerName = (order as any).profiles?.name ?? ''
    const email = authData?.user?.email
    const phone = authData?.user?.phone

    if (email) {
      sendShippingEmail({ to: email, orderId, customerName, trackingNumber, carrier }).catch(console.error)
    }
    if (phone) {
      sendShippingAlimtalk({ phone, customerName, orderId, trackingNumber, carrier }).catch(console.error)
    }
  }

  return NextResponse.json({ ok: true })
}

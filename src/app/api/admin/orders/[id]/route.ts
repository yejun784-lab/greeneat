import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendShippingEmail } from '@/lib/email'

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
  const { status, trackingNumber, carrier } = await req.json() as {
    status: string
    trackingNumber?: string
    carrier?: string
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

  // 배송 시작 상태로 변경될 때 이메일 발송
  if (status === 'shipped') {
    // 주문한 사용자의 이메일 조회
    const { data: authData } = await supabase.auth.admin.getUserById(order.user_id)
    const email = authData?.user?.email
    if (email) {
      sendShippingEmail({
        to: email,
        orderId,
        customerName: (order as any).profiles?.name ?? '',
        trackingNumber,
        carrier,
      }).catch(console.error)
    }
  }

  return NextResponse.json({ ok: true })
}

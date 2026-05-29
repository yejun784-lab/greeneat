import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'
import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'

const VAPID_PUBLIC  = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY!
const VAPID_SUBJECT = process.env.VAPID_SUBJECT ?? 'mailto:admin@greeneat.kr'

/**
 * POST /api/push/send
 * 특정 상품의 재입고 알림 신청자에게 Web Push 발송
 * 어드민 로그인 사용자만 호출 가능
 */
export async function POST(req: NextRequest) {
  // 어드민 권한 확인
  const userClient = await createServerClient()
  const { data: { user } } = await userClient.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await userClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const { productId, productName } = body as { productId: string; productName: string }

  if (!VAPID_PUBLIC || !VAPID_PRIVATE) {
    return NextResponse.json({ error: 'VAPID keys not configured' }, { status: 500 })
  }

  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE)

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 해당 상품 재입고 알림 신청자 조회
  const { data: alerts } = await supabase
    .from('restock_alerts')
    .select('user_id')
    .eq('product_id', productId)

  if (!alerts || alerts.length === 0) {
    return NextResponse.json({ sent: 0, message: 'No subscribers' })
  }

  const userIds = alerts.map((a) => a.user_id)

  // 구독 정보 조회
  const { data: subscriptions } = await supabase
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth_key')
    .in('user_id', userIds)

  if (!subscriptions || subscriptions.length === 0) {
    return NextResponse.json({ sent: 0, message: 'No push subscriptions' })
  }

  const payload = JSON.stringify({
    title: '재입고 알림 🌿',
    body: `"${productName}"이 다시 입고됐어요!`,
    url: `/products`,
  })

  let sent = 0
  const staleEndpoints: string[] = []

  await Promise.allSettled(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth_key } },
          payload
        )
        sent++
      } catch (err: unknown) {
        if (err && typeof err === 'object' && 'statusCode' in err && (err as { statusCode: number }).statusCode === 410) {
          staleEndpoints.push(sub.endpoint)
        }
      }
    })
  )

  // 만료된 구독 정리
  if (staleEndpoints.length > 0) {
    await supabase.from('push_subscriptions').delete().in('endpoint', staleEndpoints)
  }

  // 알림 신청 목록에서 제거
  await supabase.from('restock_alerts').delete().eq('product_id', productId)

  return NextResponse.json({ sent, staleRemoved: staleEndpoints.length })
}

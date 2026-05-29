import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'
import { createClient } from '@supabase/supabase-js'

const VAPID_PUBLIC  = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY!
const VAPID_SUBJECT = process.env.VAPID_SUBJECT ?? 'mailto:admin@greeneat.kr'

/**
 * POST /api/push/send
 * 특정 상품의 재입고 알림 신청자에게 Web Push 발송
 * Body: { productId: string, productName: string, secret: string }
 * secret: SUPABASE_SERVICE_ROLE_KEY (내부 호출 전용)
 */
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { productId, productName, secret } = body as {
    productId: string
    productName: string
    secret?: string
  }

  // 내부 호출 인증 (service role key)
  if (secret !== process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

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
        // 410 Gone = 구독 만료 → 삭제
        if (err && typeof err === 'object' && 'statusCode' in err && (err as { statusCode: number }).statusCode === 410) {
          staleEndpoints.push(sub.endpoint)
        }
      }
    })
  )

  // 만료된 구독 정리
  if (staleEndpoints.length > 0) {
    await supabase
      .from('push_subscriptions')
      .delete()
      .in('endpoint', staleEndpoints)
  }

  // 알림 신청 목록에서 제거 (재입고 완료)
  await supabase
    .from('restock_alerts')
    .delete()
    .eq('product_id', productId)

  return NextResponse.json({ sent, staleRemoved: staleEndpoints.length })
}

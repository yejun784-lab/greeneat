import { NextRequest, NextResponse } from 'next/server'
import webpush from 'web-push'
import { createClient } from '@supabase/supabase-js'
import { createClient as createServerClient } from '@/lib/supabase/server'

const VAPID_PUBLIC  = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY!
const VAPID_SUBJECT = process.env.VAPID_SUBJECT ?? 'mailto:admin@greeneat.kr'

/**
 * POST /api/notify-answer
 * 1:1 문의 / 상품 Q&A 답변 등록 시 작성자에게 알림 발송
 * - 알림 센터(notifications) 기록 + 웹푸시 발송
 * - 어드민만 호출 가능
 */
export async function POST(req: NextRequest) {
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
  const { userId, kind, subject, link } = body as {
    userId: string
    kind: 'qa' | 'inquiry'
    subject: string   // 상품명 또는 문의 제목
    link: string      // 클릭 시 이동 경로
  }
  if (!userId || !kind || !link) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const title = kind === 'qa' ? '상품 문의 답변 도착 💬' : '1:1 문의 답변 도착 💬'
  const notifBody = kind === 'qa'
    ? `"${subject}" 상품 문의에 답변이 달렸어요.`
    : `"${subject}" 문의에 답변이 달렸어요.`

  // 1. 알림 센터 기록
  await admin.from('notifications').insert({
    user_id: userId,
    type: 'system',
    title,
    body: notifBody,
    link,
  })

  // 2. 웹푸시 발송 (구독자에 한해, 실패는 무시)
  let pushed = 0
  if (VAPID_PUBLIC && VAPID_PRIVATE) {
    webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE)
    const { data: subs } = await admin
      .from('push_subscriptions')
      .select('endpoint, p256dh, auth_key')
      .eq('user_id', userId)

    const payload = JSON.stringify({ title, body: notifBody, url: link })
    for (const s of subs ?? []) {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth_key } },
          payload
        )
        pushed += 1
      } catch {
        // 만료된 구독 등 — 무시
      }
    }
  }

  return NextResponse.json({ ok: true, pushed })
}

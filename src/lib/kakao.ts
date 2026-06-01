/**
 * 카카오 알림톡 발송 (솔라피 게이트웨이)
 * 환경변수:
 *   SOLAPI_API_KEY      - 솔라피 API 키 (solapi.com → 계정 → 개발자 설정)
 *   SOLAPI_API_SECRET   - 솔라피 API 시크릿
 *   SOLAPI_SENDER_PHONE - 발신번호 (사전 등록 필요)
 *   SOLAPI_PFID         - 카카오 채널 ID (@ 로 시작)
 *   KAKAO_TMPL_ORDER    - 주문확인 템플릿 코드
 *   KAKAO_TMPL_SHIP     - 배송시작 템플릿 코드
 */

const SOLAPI_BASE = 'https://api.solapi.com'

function makeHmacSignature(apiKey: string, apiSecret: string): { date: string; salt: string; signature: string } {
  const date = new Date().toISOString()
  const salt = Math.random().toString(36).substring(2, 12)
  // Node.js crypto (서버 사이드)
  const crypto = require('crypto') as typeof import('crypto')
  const signature = crypto
    .createHmac('sha256', apiSecret)
    .update(date + salt)
    .digest('hex')
  return { date, salt, signature }
}

async function sendAlimtalk(to: string, templateCode: string, variables: Record<string, string>) {
  const apiKey    = process.env.SOLAPI_API_KEY
  const apiSecret = process.env.SOLAPI_API_SECRET
  const pfId      = process.env.SOLAPI_PFID
  const from      = process.env.SOLAPI_SENDER_PHONE

  if (!apiKey || !apiSecret || !pfId || !from) {
    console.warn('[kakao] SOLAPI 환경변수가 설정되지 않아 알림톡을 건너뜁니다.')
    return
  }
  if (!templateCode) {
    console.warn('[kakao] 템플릿 코드가 설정되지 않아 알림톡을 건너뜁니다.')
    return
  }

  const { date, salt, signature } = makeHmacSignature(apiKey, apiSecret)

  const body = {
    message: {
      to,
      from,
      kakaoOptions: {
        pfId,
        templateId: templateCode,
        variables,
      },
    },
  }

  try {
    const res = await fetch(`${SOLAPI_BASE}/messages/v4/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`,
      },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const err = await res.text()
      console.error('[kakao] 알림톡 발송 실패:', err)
    }
  } catch (err) {
    console.error('[kakao] 알림톡 발송 오류:', err)
  }
}

// ── 주문 확인 알림톡 ──────────────────────────────────────────────────────────
export async function sendOrderAlimtalk({
  phone,
  customerName,
  orderId,
  totalPrice,
  itemSummary,
}: {
  phone: string
  customerName: string
  orderId: string
  totalPrice: number
  itemSummary: string   // 예: "그린 도시락 외 2건"
}) {
  await sendAlimtalk(phone, process.env.KAKAO_TMPL_ORDER ?? '', {
    '#{고객명}': customerName,
    '#{주문번호}': orderId.slice(-8).toUpperCase(),
    '#{상품명}': itemSummary,
    '#{결제금액}': totalPrice.toLocaleString('ko-KR') + '원',
  })
}

// ── 배송 시작 알림톡 ──────────────────────────────────────────────────────────
export async function sendShippingAlimtalk({
  phone,
  customerName,
  orderId,
  trackingNumber,
  carrier,
}: {
  phone: string
  customerName: string
  orderId: string
  trackingNumber?: string
  carrier?: string
}) {
  await sendAlimtalk(phone, process.env.KAKAO_TMPL_SHIP ?? '', {
    '#{고객명}': customerName,
    '#{주문번호}': orderId.slice(-8).toUpperCase(),
    '#{택배사}': carrier ?? '택배사 미지정',
    '#{운송장번호}': trackingNumber ?? '-',
  })
}

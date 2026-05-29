import { Resend } from 'resend'

const FROM = process.env.RESEND_FROM_EMAIL ?? 'GreenEat <noreply@greeneat.kr>'

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

// ── 공통 래퍼 — Resend 인스턴스를 런타임에 lazy 생성하여 빌드 오류 방지 ────────
async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey || apiKey.startsWith('여기에') || !/^re_/.test(apiKey)) {
    console.warn('[email] RESEND_API_KEY가 설정되지 않아 이메일을 건너뜁니다.')
    return
  }
  try {
    const resend = new Resend(apiKey)
    await resend.emails.send({ from: FROM, to, subject, html })
  } catch (err) {
    console.error('[email] 전송 실패:', err)
  }
}

// ── HTML 공통 래퍼 ─────────────────────────────────────────────────────────────
function layout(content: string) {
  return `
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<style>
  body { margin:0; padding:0; background:#f5f5f5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif; }
  .wrap { max-width:600px; margin:32px auto; background:#fff; border-radius:16px; overflow:hidden; }
  .header { background:#2d7a4f; padding:32px 40px; }
  .header h1 { margin:0; color:#fff; font-size:24px; font-weight:700; }
  .header p  { margin:4px 0 0; color:rgba(255,255,255,.75); font-size:14px; }
  .body { padding:32px 40px; }
  .section { margin-bottom:28px; }
  .section h2 { font-size:16px; font-weight:600; color:#1a1a1a; margin:0 0 12px; }
  .row { display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #f0f0f0; font-size:14px; }
  .row:last-child { border-bottom:none; }
  .label { color:#888; }
  .value { color:#1a1a1a; font-weight:500; }
  .total-row { border-top:2px solid #e5e7eb; padding-top:12px; font-weight:700; font-size:16px; }
  .badge { display:inline-block; padding:4px 10px; border-radius:20px; font-size:12px; font-weight:600; }
  .badge-green { background:#e8f5ee; color:#2d7a4f; }
  .badge-blue  { background:#eff6ff; color:#2563eb; }
  .cta { display:block; text-align:center; background:#2d7a4f; color:#fff !important; padding:14px 24px; border-radius:12px; text-decoration:none; font-weight:600; font-size:15px; margin:24px 0 0; }
  .footer { background:#f9fafb; padding:20px 40px; text-align:center; font-size:12px; color:#aaa; }
</style>
</head>
<body>
<div class="wrap">
  <div class="header">
    <h1>🥗 GreenEat</h1>
    <p>건강한 한 끼의 시작</p>
  </div>
  <div class="body">
    ${content}
  </div>
  <div class="footer">
    © 2026 GreenEat. 본 메일은 발신 전용입니다.
  </div>
</div>
</body>
</html>`
}

// ── 주문 확인 이메일 ───────────────────────────────────────────────────────────
export interface OrderEmailData {
  to: string
  orderId: string
  customerName: string
  items: { name: string; quantity: number; price: number }[]
  totalPrice: number
  address: string
  earnedPoints?: number
}

export async function sendOrderConfirmEmail(data: OrderEmailData) {
  const itemRows = data.items.map((item) => `
    <div class="row">
      <span class="label">${item.name} × ${item.quantity}</span>
      <span class="value">${item.price.toLocaleString()}원</span>
    </div>`).join('')

  const html = layout(`
    <div class="section">
      <h2>주문이 완료됐습니다 🎉</h2>
      <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 16px">
        ${data.customerName || '고객'}님, 주문해 주셔서 감사합니다.<br/>
        주문이 정상적으로 접수되었으며 곧 준비를 시작하겠습니다.
      </p>
      <span class="badge badge-green">주문 확인</span>
    </div>

    <div class="section">
      <h2>주문 정보</h2>
      <div class="row">
        <span class="label">주문번호</span>
        <span class="value" style="font-family:monospace;font-size:13px">${data.orderId}</span>
      </div>
      <div class="row">
        <span class="label">배송지</span>
        <span class="value">${data.address}</span>
      </div>
    </div>

    <div class="section">
      <h2>주문 상품</h2>
      ${itemRows}
      <div class="row total-row">
        <span class="label">총 결제 금액</span>
        <span class="value" style="color:#2d7a4f">${data.totalPrice.toLocaleString()}원</span>
      </div>
    </div>

    ${data.earnedPoints && data.earnedPoints > 0 ? `
    <div class="section">
      <div style="background:#fffbeb;border-radius:12px;padding:16px;font-size:14px;color:#92400e">
        🎁 이번 주문으로 <strong>${data.earnedPoints.toLocaleString()}P</strong>가 적립됐어요!
      </div>
    </div>` : ''}

    <a href="${SITE_URL}/my/orders" class="cta">주문 내역 확인하기</a>
  `)

  await sendEmail(data.to, `[GreenEat] 주문이 완료되었습니다 (#${data.orderId.slice(-8)})`, html)
}

// ── 배송 시작 이메일 ───────────────────────────────────────────────────────────
export interface ShippingEmailData {
  to: string
  orderId: string
  customerName: string
  trackingNumber?: string
  carrier?: string
}

export async function sendShippingEmail(data: ShippingEmailData) {
  const html = layout(`
    <div class="section">
      <h2>배송이 시작됐습니다 🚚</h2>
      <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 16px">
        ${data.customerName || '고객'}님의 주문 상품이 출발했습니다.<br/>
        맛있게 드시길 바랍니다!
      </p>
      <span class="badge badge-blue">배송 중</span>
    </div>

    <div class="section">
      <h2>배송 정보</h2>
      <div class="row">
        <span class="label">주문번호</span>
        <span class="value" style="font-family:monospace;font-size:13px">${data.orderId}</span>
      </div>
      ${data.carrier ? `<div class="row">
        <span class="label">택배사</span>
        <span class="value">${data.carrier}</span>
      </div>` : ''}
      ${data.trackingNumber ? `<div class="row">
        <span class="label">운송장 번호</span>
        <span class="value" style="font-family:monospace">${data.trackingNumber}</span>
      </div>` : ''}
    </div>

    <a href="${SITE_URL}/my/orders" class="cta">주문 내역 확인하기</a>
  `)

  await sendEmail(data.to, `[GreenEat] 주문하신 상품이 출발했습니다 🚚`, html)
}

// ── 구독 시작 이메일 ───────────────────────────────────────────────────────────
export interface SubscriptionEmailData {
  to: string
  customerName: string
  planType: string
  nextDelivery: string
}

const PLAN_LABELS: Record<string, string> = {
  basic: '베이직',
  standard: '스탠다드',
  premium: '프리미엄',
}

export async function sendSubscriptionEmail(data: SubscriptionEmailData) {
  const html = layout(`
    <div class="section">
      <h2>구독이 시작됐습니다 🌿</h2>
      <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 16px">
        ${data.customerName || '고객'}님, GreenEat 구독 서비스에 오신 것을 환영합니다.<br/>
        매주 신선한 밀키트를 정기적으로 받아보세요.
      </p>
      <span class="badge badge-green">${PLAN_LABELS[data.planType] ?? data.planType} 플랜</span>
    </div>

    <div class="section">
      <h2>구독 정보</h2>
      <div class="row">
        <span class="label">플랜</span>
        <span class="value">${PLAN_LABELS[data.planType] ?? data.planType}</span>
      </div>
      <div class="row">
        <span class="label">첫 배송 예정일</span>
        <span class="value">${data.nextDelivery}</span>
      </div>
    </div>

    <a href="${SITE_URL}/subscription" class="cta">구독 관리하기</a>
  `)

  await sendEmail(data.to, `[GreenEat] 구독이 시작됐습니다 🌿`, html)
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Groq from 'groq-sdk'

type Role = 'bot' | 'user'
interface HistoryItem { role: Role; text: string }

const SYSTEM_PROMPT = `너는 그린잇(GreenEat)의 공식 챗봇 도우미야. 이름은 '토마토'야 🍅
그린잇은 건강한 밀키트를 정기구독으로 배송해주는 이커머스 서비스야.

[그린잇 핵심 정보]
- 배송: 주문 확인 후 1~2일, 수도권 당일 출고(오후 2시 이전), 3만원 이상 무료배송
- 구독 플랜: 베이직(주 1회) / 스탠다드(주 2회) / 프리미엄(주 3회 + 할인)
- 구독 변경·해지: 마이페이지 → 구독 관리, 다음 배송일 3일 전까지
- 주문 취소: '주문 접수' 또는 '주문 확인' 상태일 때, 마이페이지 → 주문 내역
- 환불·교환: 수령 후 7일 이내, 불량·파손 시 무료교환, support@greeneat.kr
- 포인트: 결제 금액의 1% 자동 적립, 1포인트=1원, 최소 1,000포인트부터 사용
- 결제 수단: 신용·체크카드, 카카오페이, 네이버페이, 토스페이
- 고객센터: support@greeneat.kr, 평일 09:00~18:00
- 재입고 알림: 품절 상품 페이지에서 신청 가능
- 선물하기: 상품 상세 페이지 하단 '선물하기' 버튼

[말투 규칙]
- 친근하고 짧게 답해. 딱딱하게 말하지 마.
- 이모지를 적절히 써서 생동감 있게.
- 모르는 건 솔직하게 말하고 고객센터로 안내해.
- 그린잇 서비스 외 주제(정치, 연예 등)는 정중히 거절해.
- 답변은 3~5줄 이내로 짧게. 길면 나눠서 설명해.`

export async function POST(req: NextRequest) {
  const { message, history = [] } = await req.json()
  if (!message?.trim()) {
    return NextResponse.json({ error: '메시지를 입력해주세요.' }, { status: 400 })
  }

  // 유저 이름
  let userName: string | null = null
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('name').eq('id', user.id).single()
      userName = profile?.name ?? null
    }
  } catch {}

  // Groq API 키 없으면 폴백
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ reply: 'AI 연결이 준비 중이에요 🔧\n잠시 후 다시 시도해주세요!', userName })
  }

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

    // 대화 히스토리 변환
    const historyMessages = (history as HistoryItem[]).slice(-8).map((m) => ({
      role: m.role === 'user' ? 'user' as const : 'assistant' as const,
      content: m.text,
    }))

    // 유저 이름이 있으면 시스템 프롬프트에 추가
    const systemWithName = userName
      ? SYSTEM_PROMPT + `\n\n현재 대화 중인 고객 이름은 "${userName}"이야. 자연스럽게 이름을 불러줘.`
      : SYSTEM_PROMPT

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemWithName },
        ...historyMessages,
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      max_tokens: 300,
    })

    const reply = completion.choices[0]?.message?.content ?? '잠깐 오류가 생겼어요. 다시 시도해주세요 😅'
    return NextResponse.json({ reply, userName })

  } catch (err) {
    console.error('[Groq Error]', err)
    return NextResponse.json({
      reply: '잠깐 오류가 생겼어요. 다시 시도해주세요 😅',
      userName,
    })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type Role = 'bot' | 'user'
interface HistoryItem { role: Role; text: string }

const BASE_SYSTEM_PROMPT = `너는 그린잇(GreenEat)의 공식 챗봇 도우미야. 이름은 '토마토'야 🍅
그린잇은 건강한 냉동 도시락을 정기구독으로 배송해주는 이커머스 서비스야.

[그린잇 핵심 정보]
- 배송: 주문 확인 후 1~2일, 수도권 당일 출고(오후 2시 이전), 3만원 이상 무료배송
- 구독 플랜: 베이직(주 1회) / 스탠다드(주 2회) / 프리미엄(주 3회 + 할인)
- 구독 변경·해지: 마이페이지 → 구독 관리, 다음 배송일 3일 전까지
- 주문 취소: '주문 접수' 또는 '주문 확인' 상태일 때, 마이페이지 → 주문 내역
- 환불·교환: 수령 후 7일 이내, 불량·파손 시 무료교환, support@greeneat.kr
- 포인트: 결제 금액의 1% 자동 적립, 1포인트=1원, 최소 1,000포인트부터 사용
- 결제 수단: 신용·체크카드, 카카오페이, 네이버페이, 토스페이
- 고객센터: 1555-5952, 평일 09:30~17:30 (점심 12:00~13:00), 토·일·공휴일 휴무
- 재입고 알림: 품절 상품 페이지에서 신청 가능
- 선물하기: 상품 상세 페이지 하단 '선물하기' 버튼

[상품 추천 규칙]
- 반드시 [현재 판매 중인 상품 목록]에 있는 상품만 추천해.
- 목록에 없는 상품은 절대 언급하거나 만들어내지 마.
- 상품 이름은 목록에 있는 그대로 정확히 사용해.
- 알레르기 성분이 포함된 상품은 절대 추천하지 마.

[말투 규칙]
- 친근하고 짧게 답해. 딱딱하게 말하지 마.
- 이모지를 적절히 써서 생동감 있게.
- 모르는 건 솔직하게 말하고 고객센터(1555-5952)로 안내해.
- 그린잇 서비스 외 주제(정치, 연예, 일반 상식 등)는 정중히 거절해.
- 답변은 3~5줄 이내로 짧게. 길면 나눠서 설명해.
- 반드시 한국어로만 답해.
- 영어나 다른 언어로 절대 답하지 마.`

export async function POST(req: NextRequest) {
  const { message, history = [] } = await req.json()
  if (!message?.trim()) {
    return NextResponse.json({ error: '메시지를 입력해주세요.' }, { status: 400 })
  }

  const supabase = await createClient()

  // 유저 정보 + 건강 프로필
  let userName: string | null = null
  let healthContext = ''
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('name, nutrition_goal, allergen_profile, height_cm, weight_kg')
        .eq('id', user.id)
        .single()
      userName = profile?.name ?? null
      if (profile) {
        const goalMap: Record<string, string> = {
          diet: '다이어트', muscle: '근육 증가', maintain: '체중 유지',
          health: '건강 관리', balanced: '균형식',
        }
        const parts: string[] = []
        if (profile.height_cm && profile.weight_kg) parts.push(`키/몸무게: ${profile.height_cm}cm / ${profile.weight_kg}kg`)
        if (profile.nutrition_goal) parts.push(`건강 목표: ${goalMap[profile.nutrition_goal] ?? profile.nutrition_goal}`)
        if (Array.isArray(profile.allergen_profile) && profile.allergen_profile.length > 0) {
          parts.push(`알레르기: ${profile.allergen_profile.join(', ')}`)
        }
        if (parts.length > 0) {
          healthContext = `\n\n[현재 고객 건강 프로필]\n${parts.join('\n')}\n이 정보를 바탕으로 상품 추천 시 고객에게 맞는 상품을 우선 추천해줘.`
        }
      }
    }
  } catch {}

  // 실제 상품 목록
  let productListText = ''
  try {
    const { data: products } = await supabase
      .from('products')
      .select('name, price, calories, protein, is_subscription')
      .eq('is_active', true)
      .order('display_group', { ascending: true })

    if (products && products.length > 0) {
      const lines = products.map((p) =>
        `- ${p.name} (${p.price.toLocaleString()}원${p.calories ? `, ${p.calories}kcal` : ''}${p.protein ? `, 단백질 ${p.protein}g` : ''}${p.is_subscription ? ', 구독 가능' : ''})`
      )
      productListText = `\n\n[현재 판매 중인 상품 목록 — ${products.length}개]\n` + lines.join('\n')
    }
  } catch {}

  const systemPrompt = BASE_SYSTEM_PROMPT
    + productListText
    + healthContext
    + (userName ? `\n\n현재 대화 중인 고객 이름은 "${userName}"이야. 자연스럽게 이름을 불러줘.` : '')

  // 대화 히스토리 변환 (최근 10턴)
  const messages = [
    ...(history as HistoryItem[]).slice(-10).map((m) => ({
      role: m.role === 'user' ? 'user' as const : 'assistant' as const,
      content: m.text,
    })),
    { role: 'user' as const, content: message },
  ]

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        max_tokens: 400,
        temperature: 0.7,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[Groq Error]', err)
      throw new Error(err)
    }

    const data = await res.json()
    const reply = data.choices?.[0]?.message?.content ?? '잠깐 오류가 생겼어요. 다시 시도해주세요 😅'

    return NextResponse.json({ reply, userName })
  } catch (err) {
    console.error('[Chatbot Error]', err)
    return NextResponse.json({
      reply: '잠깐 오류가 생겼어요. 다시 시도해주세요 😅',
      userName,
    })
  }
}

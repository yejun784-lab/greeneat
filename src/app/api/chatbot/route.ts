import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Groq from 'groq-sdk'

type Role = 'bot' | 'user'
interface HistoryItem { role: Role; text: string }

const BASE_SYSTEM_PROMPT = `너는 그린잇(GreenEat)의 공식 챗봇 도우미야. 이름은 '토마토'야 🍅
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

[상품 추천 규칙]
- 반드시 아래 [현재 판매 중인 상품 목록]에 있는 상품만 추천해.
- 목록에 없는 상품은 절대 언급하거나 만들어내지 마.
- 상품 이름은 목록에 있는 그대로 정확히 사용해.

[말투 규칙]
- 친근하고 짧게 답해. 딱딱하게 말하지 마.
- 이모지를 적절히 써서 생동감 있게.
- 모르는 건 솔직하게 말하고 고객센터로 안내해.
- 그린잇 서비스 외 주제(정치, 연예 등)는 정중히 거절해.
- 답변은 3~5줄 이내로 짧게. 길면 나눠서 설명해.
- 반드시 한국어로만 답해. 한자(漢字)나 중국어 절대 사용 금지. 예: 米→밥, 飯→밥, 麵→면.`

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
        .select('name, health_goal, activity_level, diet_type, allergen_profile, age, gender, height_cm, weight_kg')
        .eq('id', user.id)
        .single()
      userName = profile?.name ?? null
      if (profile) {
        const goalMap: Record<string, string> = { diet: '다이어트', muscle: '근육 증가', maintain: '체중 유지', health: '건강 관리' }
        const actMap: Record<string, string> = { low: '낮음', medium: '보통', high: '높음' }
        const dietMap: Record<string, string> = { none: '제한 없음', vegetarian: '채식', vegan: '비건', halal: '할랄' }
        const parts: string[] = []
        if (profile.age) parts.push(`나이: ${profile.age}세`)
        if (profile.gender) parts.push(`성별: ${profile.gender === 'male' ? '남성' : profile.gender === 'female' ? '여성' : '기타'}`)
        if (profile.height_cm && profile.weight_kg) parts.push(`키/몸무게: ${profile.height_cm}cm / ${profile.weight_kg}kg`)
        if (profile.health_goal) parts.push(`건강 목표: ${goalMap[profile.health_goal] ?? profile.health_goal}`)
        if (profile.activity_level) parts.push(`활동량: ${actMap[profile.activity_level] ?? profile.activity_level}`)
        if (profile.diet_type && profile.diet_type !== 'none') parts.push(`식단 유형: ${dietMap[profile.diet_type] ?? profile.diet_type}`)
        if (Array.isArray(profile.allergen_profile) && profile.allergen_profile.length > 0) {
          parts.push(`알레르기: ${profile.allergen_profile.join(', ')}`)
        }
        if (parts.length > 0) {
          healthContext = `\n\n[현재 고객 건강 프로필]\n${parts.join('\n')}\n이 정보를 바탕으로 상품 추천 시 고객에게 맞는 상품을 우선 추천해줘. 알레르기 성분이 포함된 상품은 추천하지 마.`
        }
      }
    }
  } catch {}

  // 실제 상품 목록 가져오기
  let productListText = ''
  try {
    const { data: products } = await supabase
      .from('products')
      .select('name, price, calories, category_id, is_subscription')
      .eq('is_active', true)
      .order('name')

    if (products && products.length > 0) {
      const lines = products.map((p) =>
        `- ${p.name} (${p.price.toLocaleString()}원, ${p.calories}kcal${p.is_subscription ? ', 구독 가능' : ''})`
      )
      productListText = `\n\n[현재 판매 중인 상품 목록 - 총 ${products.length}개]\n` + lines.join('\n')
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

    // 시스템 프롬프트 조합
    let systemPrompt = BASE_SYSTEM_PROMPT + productListText + healthContext
    if (userName) {
      systemPrompt += `\n\n현재 대화 중인 고객 이름은 "${userName}"이야. 자연스럽게 이름을 불러줘.`
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        ...historyMessages,
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      max_tokens: 400,
    })

    const raw = completion.choices[0]?.message?.content ?? '잠깐 오류가 생겼어요. 다시 시도해주세요 😅'
    // 한자 치환 필터
    const reply = raw
      .replace(/米/g, '밥').replace(/飯/g, '밥').replace(/麵/g, '면').replace(/麺/g, '면')
      .replace(/肉/g, '고기').replace(/魚/g, '생선').replace(/菜/g, '채소').replace(/湯/g, '국')
      .replace(/茶/g, '차').replace(/水/g, '물').replace(/食/g, '식사').replace(/料/g, '요리')
      .replace(/[一-鿿]/g, '')

    return NextResponse.json({ reply, userName })

  } catch (err) {
    console.error('[Groq Error]', err)
    return NextResponse.json({
      reply: '잠깐 오류가 생겼어요. 다시 시도해주세요 😅',
      userName,
    })
  }
}

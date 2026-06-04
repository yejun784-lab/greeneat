import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// ── 간단한 인메모리 Rate Limiter ───────────────────────────────────────────
// 분당 최대 15회 / IP or 유저 기준
const RATE_WINDOW_MS = 60_000
const RATE_LIMIT     = 15
const rateLimitMap   = new Map<string, { count: number; windowStart: number }>()

function checkRateLimit(key: string): boolean {
  const now  = Date.now()
  const slot = rateLimitMap.get(key)
  if (!slot || now - slot.windowStart >= RATE_WINDOW_MS) {
    rateLimitMap.set(key, { count: 1, windowStart: now })
    return true
  }
  if (slot.count >= RATE_LIMIT) return false
  slot.count++
  return true
}

// 메모리 누수 방지 — 오래된 항목 주기적으로 정리 (서버리스 환경에서 최선)
if (rateLimitMap.size > 500) {
  const cutoff = Date.now() - RATE_WINDOW_MS
  for (const [k, v] of rateLimitMap.entries()) {
    if (v.windowStart < cutoff) rateLimitMap.delete(k)
  }
}

type Role = 'bot' | 'user'
interface HistoryItem { role: Role; text: string }

type CharKey = 'tomato' | 'broccoli' | 'carrot' | 'corn' | 'avocado' | 'strawberry'

const CHAR_PERSONALITY: Record<CharKey, string> = {
  tomato: `
[캐릭터 — 토마토 🍅]
이름은 '토마토'. 발랄하고 친근한 청년 느낌이야.
- 말투: "~해요", "~이에요" 기본. 가끔 "ㅎㅎ", "ㅋㅋ" 섞어도 OK.
- 긍정적이고 에너지 넘침. 토마토 관련 드립 가끔 날려줘 ("저도 토마토처럼 빨갛게 응원할게요 🍅").
- 짧고 경쾌하게 답해.`,

  broccoli: `
[캐릭터 — 브로콜리 🥦]
이름은 '브로콜리'. 건강 전도사 선배 느낌이야.
- 말투: "~습니다", "~드립니다" 정중하지만 따뜻함.
- 건강·영양 관련 언급이 나오면 눈을 반짝이며 적극 도움.
- "파이팅!", "건강이 최고예요 💪" 같은 격려를 잘 씀.
- 조금 진지하지만 절대 딱딱하지 않음. 응원을 아끼지 마.`,

  carrot: `
[캐릭터 — 당근이 🥕]
이름은 '당근이'. 초고에너지 아이돌 스타일이야.
- 말투: "~요!", "대박!", "완전!", "헐~" 자주 씀.
- 문장 끝에 느낌표 많고 이모지 풍부하게 🎉🥕✨
- 뭐든 최선을 다해 빠르게 도와주려 함.
- 항상 신나고 밝은 에너지. 절대 우울하게 답하지 마.`,

  corn: `
[캐릭터 — 옥수수 🌽]
이름은 '옥수수'. 따뜻한 시골 어르신 느낌이야.
- 말투: "~허이", "~그려", "~허구먼" 같은 구수한 사투리 어미를 살짝 섞어.
- 느긋하고 여유롭고 정감 있음. 음식 얘기 나오면 더 반김.
- "잘 먹는 게 최고여~", "몸 좀 챙겨야 허이~" 같은 말 자주 씀.
- 따뜻하고 든든한 조언자 느낌으로 답해.`,

  avocado: `
[캐릭터 — 아보카 🥑]
이름은 '아보카'. 트렌디한 MZ 세대 느낌이야.
- 말투: "~잖아요", "그니까요", "레알", "찐으로" 가끔 씀.
- 쿨하게, 너무 힘주지 않는 스타일. 근데 속은 따뜻함.
- 건강한 라이프스타일·다이어트 토픽에 유독 눈을 빛냄.
- 유행어·신조어 살짝 섞되 과하지 않게. 세련되게 도와줘.`,

  strawberry: `
[캐릭터 — 딸기 🍓]
이름은 '딸기'. 달콤하고 귀여운 애교 캐릭터야.
- 말투: "~해요~", "~죠?", "~걸요?" 같은 부드럽고 달달한 어미.
- 이모지를 듬뿍 써줘 🍓✨💕😊
- 칭찬과 응원을 아끼지 않음. 뭐든 달콤하게 포장해서 전달.
- 절대 딱딱하거나 차갑게 답하지 마. 항상 따뜻하고 사랑스럽게.`,
}

const BASE_SYSTEM_PROMPT = `[언어 규칙 — 절대 원칙]
반드시 한국어로만 답해야 해. 영어·중국어·일본어·독일어 등 어떤 외국어도 절대 사용 금지. 외래어조차 쓰지 마.
한자(漢字) 사용 절대 금지. 예: 配送(×) → 배송(○), 注文(×) → 주문(○). 무조건 한글로만 써.

너는 그린잇(GreenEat)의 공식 챗봇 도우미야. 아래 [캐릭터] 섹션에 정의된 이름과 말투를 반드시 따라야 해.
그린잇은 건강한 냉동 도시락을 정기구독으로 배송해주는 이커머스 서비스야.

[그린잇 서비스 전체 기능]
■ 쇼핑
- 상품 목록: /products 에서 카테고리·칼로리·난이도 필터로 탐색
- 장바구니: 상품 상세에서 담기 → /cart
- 결제: 토스페이먼츠 연동, 카드/카카오페이/네이버페이/토스페이

■ 구독
- 플랜: 베이직(주 1회) / 스탠다드(주 2회) / 프리미엄(주 3회 + 할인)
- 변경·해지: 마이페이지 → 구독 관리, 다음 배송일 3일 전까지

■ 배송
- 주문 확인 후 1~2일 이내, 수도권 당일 출고(오후 2시 이전)
- 3만원 이상 무료배송

■ 건강관리 (밥로그) — /health 페이지
- 오늘의 영양 현황: 칼로리·단백질·탄수화물·지방 링 차트
- 식사 사진 분석: 음식 사진 찍으면 AI가 칼로리 자동 계산
- 직접 입력: 칼로리·영양소 수동 기록
- 이번 주 칼로리 추이 차트
- 체중 기록 및 그래프
- AI 주간 식단 추천: 건강 목표에 맞는 7일 식단
- 이번 주 리포트: 평균 칼로리·단백질 달성일·연속 기록

■ 이벤트 (/events)
- 현재 진행 중인 이벤트는 상단 메뉴 '이벤트'에서 확인 가능
- 구체적인 이벤트 내용은 이벤트 페이지에서 직접 확인하도록 안내해

■ 마이페이지 (/my)
- 주문 내역, 구독 현황, 배달 캘린더, 건강 프로필 수정

■ 포인트
- 결제 금액의 1% 자동 적립, 1포인트=1원, 최소 1,000포인트부터 사용

■ 주문 취소·환불
- 취소: '주문 접수' 또는 '주문 확인' 상태일 때, 마이페이지 → 주문 내역
- 환불·교환: 수령 후 7일 이내, 불량·파손 시 무료교환, support@greeneat.kr

■ 고객센터: 1555-5952, 평일 09:30~17:30 (점심 12:00~13:00), 토·일·공휴일 휴무

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
- 답변은 3~5줄 이내로 짧게.`

export async function POST(req: NextRequest) {
  // ── Rate Limit 체크 ──────────────────────────────────────────────────────
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
         ?? req.headers.get('x-real-ip')
         ?? 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { reply: '잠시 후 다시 시도해주세요. (1분에 최대 15회 이용 가능해요)' },
      { status: 429 }
    )
  }

  const { message, history = [], charKey = 'tomato' } = await req.json()
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

  const personality = CHAR_PERSONALITY[charKey as CharKey] ?? CHAR_PERSONALITY.tomato

  const systemPrompt = BASE_SYSTEM_PROMPT
    + personality
    + productListText
    + healthContext
    + (userName ? `\n\n현재 대화 중인 고객 이름은 "${userName}"이야. 자연스럽게 이름을 불러줘.` : '')
    + `\n\n[최종 언어 확인 — 이 규칙이 가장 높은 우선순위]\n답변 전체를 반드시 한국어로만 작성해. 영어 단어, 영문 약어, 영어 문장은 단 한 글자도 쓰지 마. 위반 시 답변 전체를 다시 한국어로 번역해서 제출해.`

  // 대화 히스토리 변환 (최근 10턴)
  const messages = [
    ...(history as HistoryItem[]).slice(-10).map((m) => ({
      role: m.role === 'user' ? 'user' as const : 'assistant' as const,
      content: m.text,
    })),
    { role: 'user' as const, content: `${message}\n\n(반드시 한국어로만 답해줘)` },
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
        temperature: 0.5,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[Groq Error]', err)
      throw new Error(err)
    }

    const data = await res.json()
    let raw = data.choices?.[0]?.message?.content ?? '잠깐 오류가 생겼어요. 다시 시도해주세요 😅'

    // 영어 비율 15% 초과 시 한국어 재번역 요청 (1회)
    const englishChars = (raw.match(/[a-zA-Z]/g) ?? []).length
    const totalChars   = raw.replace(/\s/g, '').length
    if (totalChars > 0 && englishChars / totalChars > 0.15) {
      try {
        const retryRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: '너는 번역가야. 아래 텍스트를 100% 한국어로 번역해. 영어·한자는 모두 한국어로 바꿔. 이모지는 그대로 둬.' },
              { role: 'user', content: raw },
            ],
            max_tokens: 400,
            temperature: 0.3,
          }),
        })
        if (retryRes.ok) {
          const retryData = await retryRes.json()
          raw = retryData.choices?.[0]?.message?.content ?? raw
        }
      } catch {}
    }

    // 한자(CJK)만 제거 — 한글(AC00-D7A3) 보호
    const reply = raw.replace(/[一-鿿㐀-䶿豈-﫿]/g, '')
    return NextResponse.json({ reply, userName })
  } catch (err) {
    console.error('[Chatbot Error]', err)
    return NextResponse.json({
      reply: '잠깐 오류가 생겼어요. 다시 시도해주세요 😅',
      userName,
    })
  }
}

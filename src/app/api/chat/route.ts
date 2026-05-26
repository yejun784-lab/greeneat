import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `당신은 GreenEat의 마스코트 "그리니"입니다. 건강한 밀키트 구독 서비스 GreenEat를 돕는 귀엽고 친근한 AI 도우미입니다.

GreenEat 서비스 정보:
- 신선한 밀키트를 정기 구독 또는 단품으로 주문할 수 있는 서비스
- 카테고리: 한식, 양식, 샐러드, 비건
- 구독 플랜: 베이직(주 2회, ₩39,900), 스탠다드(주 4회, ₩69,900), 프리미엄(주 6회, ₩99,900)
- 배송: 5만원 이상 무료 배송, 미만 시 3,000원
- 식단 목표: 다이어트(저칼로리), 균형식, 근육 증가(고단백)
- 쿠폰: WELCOME10(10% 할인), FIRST5000(5000원 할인), GREEN20(20% 할인)

주요 메뉴:
- 한식: 비빔밥, 불고기, 된장찌개, 부대찌개
- 양식: 토마토 볼로네제, 크림 리조또
- 샐러드: 그린 샐러드, 두부 샐러드
- 비건: 비건 두부스테이크

사이트 링크 안내:
- 전체 메뉴 보기: /products
- 구독 플랜: /subscription
- 장바구니: /cart
- 마이페이지: /my

말투 규칙:
- 친근하고 밝게, 가끔 🌿🥗💚 같은 이모지 사용
- 짧고 명확하게 (3문장 이내 권장)
- 이름은 "그리니"로 소개
- 모르는 건 솔직히 모른다고 하기`

// ── 규칙 기반 폴백 응답 ──────────────────────────────────────────
type FallbackRule = { patterns: RegExp[]; reply: string }

const FALLBACK_RULES: FallbackRule[] = [
  {
    patterns: [/안녕|hello|hi|반가|처음/i],
    reply: '안녕하세요! 저는 GreenEat 도우미 **그리니**예요 🌿\n메뉴 추천, 구독 플랜, 쿠폰까지 뭐든 물어보세요!',
  },
  {
    patterns: [/인기|추천|뭐가 좋|어떤 메뉴|메뉴 추천/i],
    reply: '지금 가장 인기 있는 메뉴는 **비빔밥**과 **토마토 볼로네제**예요 🍝\n/products 에서 전체 메뉴를 확인해보세요!',
  },
  {
    patterns: [/다이어트|저칼로리|살|체중|diet/i],
    reply: '다이어트엔 **그린 샐러드**와 **비건 두부스테이크**를 추천해요 🥗\n칼로리가 낮고 단백질이 풍부하답니다!',
  },
  {
    patterns: [/단백질|근육|muscle|고단백/i],
    reply: '근육 증가엔 **불고기**와 **비건 두부스테이크**가 딱이에요 💪\n둘 다 단백질이 듬뿍! /products에서 확인해보세요.',
  },
  {
    patterns: [/한식|Korean/i],
    reply: '한식 메뉴로는 **비빔밥, 불고기, 된장찌개, 부대찌개**가 있어요 🍲\n/products?category=korean 에서 구경해보세요!',
  },
  {
    patterns: [/양식|파스타|pasta|western/i],
    reply: '양식 메뉴는 **토마토 볼로네제**와 **크림 리조또**가 있어요 🍝\n/products?category=western 에서 확인해보세요!',
  },
  {
    patterns: [/샐러드|salad/i],
    reply: '신선한 샐러드 메뉴로 **그린 샐러드**와 **두부 샐러드**가 있어요 🥗\n/products?category=salad 에서 보실 수 있어요!',
  },
  {
    patterns: [/채식|vegan|비건/i],
    reply: '비건 메뉴는 **비건 두부스테이크**가 있어요 🌿\n식물성 재료만 사용한 건강식이에요! /products?category=vegan 확인해보세요.',
  },
  {
    patterns: [/구독|플랜|plan|정기/i],
    reply: '구독 플랜은 세 가지예요 📦\n- **베이직** 주 2회 ₩39,900\n- **스탠다드** 주 4회 ₩69,900\n- **프리미엄** 주 6회 ₩99,900\n/subscription 에서 시작하세요!',
  },
  {
    patterns: [/쿠폰|할인|coupon|discount/i],
    reply: '사용 가능한 쿠폰이에요 🎟️\n- **WELCOME10** — 10% 할인\n- **FIRST5000** — 5,000원 할인\n- **GREEN20** — 20% 할인\n결제 시 입력해보세요!',
  },
  {
    patterns: [/배송|delivery|언제|얼마나/i],
    reply: '5만원 이상 주문 시 **무료 배송**이에요 🚚\n미만이면 배송비 3,000원이 추가돼요.\n구독하시면 항상 무료 배송!',
  },
  {
    patterns: [/가격|얼마|price|비용/i],
    reply: '메뉴 가격은 종류마다 달라요 💰\n/products 에서 각 메뉴의 가격을 확인해보세요!\n구독하시면 최대 20% 할인도 받을 수 있어요.',
  },
  {
    patterns: [/로그인|회원가입|계정|login|signup/i],
    reply: '로그인은 오른쪽 위 버튼을 눌러주세요 👆\n회원가입도 같은 곳에서 할 수 있어요!',
  },
  {
    patterns: [/장바구니|cart|담기/i],
    reply: '마음에 드는 상품에서 **담기** 버튼을 누르면 장바구니에 추가돼요 🛒\n/cart 에서 확인하고 결제할 수 있어요!',
  },
  {
    patterns: [/결제|주문|order|payment/i],
    reply: '장바구니에서 결제하기를 누르면 주문할 수 있어요 💳\n신용/체크카드로 간편하게 결제 가능해요!',
  },
  {
    patterns: [/고마워|감사|thank|ㄱㅅ/i],
    reply: '천만에요! 맛있는 식사 되세요 🌿💚\n또 궁금한 게 있으면 언제든 불러주세요!',
  },
  {
    patterns: [/너|그리니|이름|who|mascot/i],
    reply: '저는 **그리니**예요 🌱\nGreenEat의 마스코트 도우미로, 메뉴 추천부터 구독 안내까지 도와드려요!',
  },
]

function fallbackReply(userMessage: string): string | null {
  const msg = userMessage.toLowerCase()
  for (const rule of FALLBACK_RULES) {
    if (rule.patterns.some((p) => p.test(msg))) {
      return rule.reply
    }
  }
  return null
}

// ── 메시지 타입 ──────────────────────────────────────────────────
type Message = { role: 'user' | 'assistant'; content: string }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const messages: Message[] = body.messages ?? []

    if (messages.length === 0) {
      return NextResponse.json({ message: '메시지를 입력해주세요!' })
    }

    if (messages[0].role !== 'user') {
      return NextResponse.json({
        message: '대화를 다시 시작해볼까요? 초기화 버튼(↺)을 눌러주세요!',
      })
    }

    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content ?? ''

    // ── Anthropic API 사용 가능하면 AI로 응답 ──
    const apiKey = process.env.GREENEAT_ANTHROPIC_KEY
    const hasValidKey = apiKey && apiKey.trim() !== '' && apiKey !== '여기에_API_키_입력'

    if (hasValidKey) {
      try {
        const { default: Anthropic } = await import('@anthropic-ai/sdk')
        const client = new Anthropic({ apiKey })
        const response = await client.messages.create({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 400,
          system: SYSTEM_PROMPT,
          messages: messages.slice(-10),
        })
        const text =
          response.content[0].type === 'text'
            ? response.content[0].text
            : '죄송해요, 다시 한번 말씀해주세요!'
        return NextResponse.json({ message: text })
      } catch (aiErr) {
        console.error('[Anthropic API error]', aiErr)
        // AI 실패 시 폴백으로 내려감
      }
    }

    // ── 규칙 기반 폴백 ──
    const matched = fallbackReply(lastUserMessage)
    if (matched) {
      return NextResponse.json({ message: matched })
    }

    // ── 기본 응답 ──
    return NextResponse.json({
      message:
        '음… 제가 잘 모르는 질문이에요 🤔\n**인기 메뉴, 구독 플랜, 쿠폰, 배송** 관련 질문은 잘 대답할 수 있어요!\n다시 한번 물어봐주세요 🌿',
    })
  } catch (err) {
    console.error('[chat route error]', err)
    return NextResponse.json({
      message: '잠깐 문제가 생겼어요 🙈 조금 뒤에 다시 시도해주세요!',
    })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const FAQ: { keywords: string[]; answer: string }[] = [
  {
    keywords: ['배송', '언제', '며칠', '얼마나'],
    answer: '주문 확인 후 보통 1~2일 안에 배송돼요! 🚚\n배송지 지역에 따라 다를 수 있어요.',
  },
  {
    keywords: ['구독', '정기', '플랜'],
    answer: '구독 플랜은 베이직·스탠다드·프리미엄 3가지가 있어요! 🌿\n/subscription 에서 자세한 내용을 확인하실 수 있어요.',
  },
  {
    keywords: ['취소', '환불', '반품'],
    answer: '주문 취소는 주문 내역 페이지에서 \'주문 접수\' 또는 \'주문 확인\' 상태일 때 가능해요.\n결제 취소·환불은 고객센터(support@greeneat.kr)로 문의 주세요 😊',
  },
  {
    keywords: ['포인트', '적립'],
    answer: '주문 금액의 1%가 포인트로 적립돼요! 💚\n적립된 포인트는 다음 주문 시 사용할 수 있어요.',
  },
  {
    keywords: ['알레르기', '알러지', '성분'],
    answer: '각 상품 상세 페이지에 알레르기 유발 성분이 표시돼 있어요.\n마이페이지에서 알레르기 프로필을 등록하시면 맞춤 추천도 해드려요 🥗',
  },
  {
    keywords: ['칼로리', '영양', '단백질'],
    answer: '모든 상품의 칼로리·단백질·탄수화물·지방 정보가 상세 페이지에 나와 있어요!\nAI 추천 기능으로 목표에 맞는 메뉴도 찾아드릴 수 있어요 💪',
  },
  {
    keywords: ['선물', '기프트'],
    answer: '상품 상세 페이지 하단에 \'선물하기\' 버튼이 있어요! 🎁\n받는 분 주소와 메시지를 입력하면 바로 보낼 수 있어요.',
  },
  {
    keywords: ['쿠폰', '할인'],
    answer: '이벤트 페이지(/notice)에서 쿠폰을 받을 수 있어요! 🎉\n결제 시 쿠폰 코드를 입력하면 할인이 적용돼요.',
  },
  {
    keywords: ['안녕', '하이', 'hi', 'hello', '반가워'],
    answer: '안녕하세요! 저는 그린잇 도우미 그린이예요 🌿\n배송, 구독, 상품, 포인트 등 뭐든 물어보세요!',
  },
]

function getBotResponse(message: string): string {
  const lower = message.toLowerCase()
  for (const faq of FAQ) {
    if (faq.keywords.some((kw) => lower.includes(kw))) {
      return faq.answer
    }
  }
  return '흠, 정확한 답변이 어려운 질문이에요 🤔\n더 자세한 문의는 고객센터(support@greeneat.kr)로 보내주세요!\n제가 알 수 있는 건 배송, 구독, 취소/환불, 포인트 등이에요 😊'
}

export async function POST(req: NextRequest) {
  const { message } = await req.json()
  if (!message?.trim()) {
    return NextResponse.json({ error: '메시지를 입력해주세요.' }, { status: 400 })
  }

  // 로그인 유저면 이름 가져오기
  let userName: string | null = null
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('name').eq('id', user.id).single()
      userName = profile?.name ?? null
    }
  } catch {}

  const reply = getBotResponse(message)
  return NextResponse.json({ reply, userName })
}

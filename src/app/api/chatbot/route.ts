import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type Role = 'bot' | 'user'
interface HistoryItem { role: Role; text: string }

/* ------------------------------------------------------------------ */
/*  유틸                                                                 */
/* ------------------------------------------------------------------ */
function normalize(str: string) {
  return str
    .toLowerCase()
    .replace(/[\s\-_]/g, '')
    .replace(/[?!.~ㅠㅜㅡ,。]/g, '')
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function withName(text: string, name: string | null) {
  return name ? text.replace('{name}', name + '님') : text.replace('{name} ', '').replace('{name}', '')
}

/* ------------------------------------------------------------------ */
/*  FAQ                                                                  */
/* ------------------------------------------------------------------ */
interface FAQ { keywords: string[]; answers: string[]; topic: string }

const FAQS: FAQ[] = [
  {
    topic: 'greeting',
    keywords: ['안녕', '하이', 'hi', 'hello', '반가워', '처음', 'ㅎㅇ', '왔어요', '있나요'],
    answers: [
      '안녕하세요{name}! 그린잇 도우미예요 🍅\n배송·구독·주문·포인트 뭐든 물어보세요!',
      '어서오세요{name}! 저는 그린잇 도우미예요 🌿\n궁금한 게 있으면 말씀해주세요!',
    ],
  },
  {
    topic: 'delivery_time',
    keywords: ['배송', '언제', '며칠', '얼마나', '도착', '배달', '며칠걸려', '빨리'],
    answers: [
      '주문 확인 후 1~2일 내 출발이에요 🚚\n수도권은 보통 다음날, 지방은 1~2일 추가 소요돼요!\n오후 2시 전 주문하시면 당일 출고도 가능해요.',
      '보통 1~2일이면 받으실 수 있어요 📦\n수도권 기준 오후 2시 이전 주문은 당일 출고예요!',
    ],
  },
  {
    topic: 'delivery_track',
    keywords: ['배송조회', '송장', '운송장', '어디쯤', '위치', '추적'],
    answers: [
      '마이페이지 → 주문 내역에서 실시간 배송 조회가 가능해요 🔍\nCJ대한통운 사이트에서 송장번호로도 확인하실 수 있어요.',
    ],
  },
  {
    topic: 'delivery_fee',
    keywords: ['배송비', '무료배송', '배달비', '얼마'],
    answers: [
      '3만원 이상 구매하시면 무료배송이에요 🎉\n그 미만은 배송비 3,000원이 붙어요.',
    ],
  },
  {
    topic: 'delivery_address',
    keywords: ['주소', '배송지', '주소변경', '배송지변경', '바꾸고싶'],
    answers: [
      '마이페이지 → 배송지 관리에서 언제든 변경 가능해요 🏠\n이미 출고된 주문은 변경이 어려우니 빠르게 문의 주세요!',
    ],
  },
  {
    topic: 'subscription',
    keywords: ['구독', '정기', '플랜', '멤버십', '구독권', '구독하면'],
    answers: [
      '구독 플랜은 3가지예요 🌿\n• 베이직: 주 1회\n• 스탠다드: 주 2회\n• 프리미엄: 주 3회 + 추가 할인\n자세한 건 /subscription 에서 확인해보세요!',
      '정기구독하면 매주 신선한 밀키트를 받으실 수 있어요 🥗\n베이직(주 1회)부터 프리미엄(주 3회)까지 선택 가능해요!',
    ],
  },
  {
    topic: 'subscription_change',
    keywords: ['구독변경', '구독해지', '구독취소', '플랜변경', '해지하고싶', '바꾸고싶'],
    answers: [
      '마이페이지 → 구독 관리에서 언제든 변경·해지 가능해요.\n다음 배송일 3일 전까지 변경하시면 즉시 반영돼요 😊',
    ],
  },
  {
    topic: 'subscription_pause',
    keywords: ['정지', '일시정지', '멈춤', '휴가', '잠깐', '쉬고싶'],
    answers: [
      '구독 일시정지도 가능해요 ⏸\n마이페이지 → 구독 관리 → 일시정지를 선택해주세요.\n최대 30일까지 정지할 수 있어요!',
    ],
  },
  {
    topic: 'cancel',
    keywords: ['취소', '주문취소', '캔슬', '취소하고싶', '취소할수있어'],
    answers: [
      '\'주문 접수\' 또는 \'주문 확인\' 상태일 때 취소 가능해요.\n마이페이지 → 주문 내역에서 직접 취소 버튼을 눌러주세요 🙏',
      '배송 시작 전이라면 마이페이지 → 주문 내역에서 취소하실 수 있어요!\n이미 출고됐다면 고객센터로 문의 주세요.',
    ],
  },
  {
    topic: 'refund',
    keywords: ['환불', '반품', '교환', '불량', '파손', '잘못왔', '다른거'],
    answers: [
      '수령 후 7일 이내 환불·교환 신청 가능해요.\n불량·파손은 100% 무료 교환이에요 📸\n사진과 함께 support@greeneat.kr 로 문의 주세요!',
    ],
  },
  {
    topic: 'payment',
    keywords: ['결제', '카드', '페이', '계좌', '토스', '카카오페이', '네이버페이'],
    answers: [
      '신용·체크카드, 카카오페이, 네이버페이, 토스페이 모두 가능해요 💳\n무통장 입금은 현재 지원하지 않아요.',
    ],
  },
  {
    topic: 'point',
    keywords: ['포인트', '적립', '리워드', '포인트어디'],
    answers: [
      '주문 금액의 1%가 자동 적립돼요 💚\n마이페이지에서 보유 포인트 확인 후 다음 주문 시 사용 가능해요!',
      '결제할 때마다 1%씩 쌓여요 💚\n마이페이지 → 포인트 내역에서 확인해보세요!',
    ],
  },
  {
    topic: 'coupon',
    keywords: ['쿠폰', '할인', '프로모', '이벤트', '코드', '할인받고'],
    answers: [
      '이벤트 페이지(/notice)에서 쿠폰을 받을 수 있어요 🎉\n결제 화면에서 코드 입력하면 즉시 할인 적용돼요!',
    ],
  },
  {
    topic: 'restock',
    keywords: ['재입고', '품절', '알림', '입고', '언제들어', '다시살수있'],
    answers: [
      '품절 상품 페이지의 \'재입고 알림 신청\' 버튼을 누르면\n재입고 시 바로 알림을 보내드려요 🔔',
    ],
  },
  {
    topic: 'nutrition',
    keywords: ['칼로리', '영양', '단백질', '탄수화물', '지방', '다이어트', '저칼로리', '헬스'],
    answers: [
      '모든 상품 상세 페이지에 칼로리·단백질·탄수화물·지방이 표시돼 있어요 💪\n상품 목록에서 영양 필터로 목표에 맞게 고를 수 있어요!',
      '상품 목록에서 칼로리·단백질 기준으로 필터링할 수 있어요 🥗\n다이어트 중이시면 350kcal 이하 상품을 추천드려요!',
    ],
  },
  {
    topic: 'allergy',
    keywords: ['알레르기', '알러지', '성분', '글루텐', '유제품', '견과', '못먹'],
    answers: [
      '각 상품 상세 페이지에 알레르기 유발 성분이 표시돼 있어요.\n마이페이지 → 알레르기 프로필 등록하면 맞춤 상품만 보여드려요 🥗',
    ],
  },
  {
    topic: 'gift',
    keywords: ['선물', '기프트', '증정', '보내기', '선물하기', '선물할수있'],
    answers: [
      '상품 상세 페이지 하단 \'선물하기\' 버튼으로 바로 보낼 수 있어요 🎁\n받는 분 주소와 메시지를 입력하면 완료예요!',
    ],
  },
  {
    topic: 'recommend',
    keywords: ['추천', '어떤거', '뭐살', '뭐먹', '인기', '베스트', '맛있는거'],
    answers: [
      '상품 목록에서 인기순 정렬을 해보세요 🥗\n칼로리·단백질 필터로 목표에 맞는 메뉴도 찾을 수 있어요!',
      '이번 주 인기 상품은 상품 목록 인기순에서 확인해보세요 🔥\n건강한 한 끼로는 고단백 샐러드나 저칼로리 도시락을 추천드려요!',
    ],
  },
  {
    topic: 'account',
    keywords: ['가입', '회원가입', '로그인', '비밀번호', '계정', '이메일', '아이디'],
    answers: [
      '이메일로 간편하게 가입할 수 있어요!\n비밀번호를 잊으셨다면 로그인 화면에서 \'비밀번호 찾기\'를 눌러주세요 🔑',
    ],
  },
  {
    topic: 'withdraw',
    keywords: ['탈퇴', '회원탈퇴', '계정삭제', '탈퇴하고싶'],
    answers: [
      '마이페이지 → 설정 → 회원 탈퇴에서 진행하실 수 있어요.\n탈퇴 전 잔여 포인트와 구독은 자동 소멸되니 참고해주세요 😢',
    ],
  },
  {
    topic: 'compare',
    keywords: ['비교', '차이', '어떻게달라', '비교하기', '뭐가달라'],
    answers: [
      '상품 카드 하단 비교 아이콘으로 최대 3개까지 비교할 수 있어요 📊\n칼로리·영양소·가격을 한눈에 볼 수 있어요!',
    ],
  },
  {
    topic: 'cs',
    keywords: ['고객센터', '문의', '연락', '전화', 'cs', '상담'],
    answers: [
      '고객센터 운영시간은 평일 09:00~18:00이에요 📧\n이메일: support@greeneat.kr\n간단한 건 저한테 물어봐도 돼요!',
    ],
  },
  {
    topic: 'app',
    keywords: ['앱', '다운로드', '설치', '아이폰', '안드로이드', '홈화면'],
    answers: [
      '그린잇은 PWA 앱으로 설치 가능해요 📱\n브라우저 주소창 설치 버튼 또는 공유 → \'홈 화면에 추가\'를 눌러주세요!',
    ],
  },
  {
    topic: 'thanks',
    keywords: ['고마워', '감사', '도움됐', '최고', '좋아', '짱', 'ㄳ', '굿'],
    answers: [
      '도움이 됐다니 저도 기뻐요 🍅💚 또 궁금한 게 있으면 말해주세요!',
      '천만에요{name}! 언제든 다시 와요 😊',
      '감사해요{name}! 맛있는 그린잇 즐겨주세요 🌿',
    ],
  },
  /* 잡담 */
  {
    topic: 'small_talk_hungry',
    keywords: ['배고파', '배고프다', '뭐먹지', '점심', '저녁', '아침', '밥'],
    answers: [
      '배고프시군요 😋 그린잇 밀키트 어때요?\n상품 목록에서 오늘 먹을 메뉴 골라보세요!',
      '마침 잘 오셨어요! 🍅 인기 상품 목록에서 오늘의 한 끼를 골라보세요.',
    ],
  },
  {
    topic: 'small_talk_health',
    keywords: ['건강', '다이어트', '운동', '체중', '살빼기', '건강식'],
    answers: [
      '건강 관리 중이시군요 💪\n그린잇에서 저칼로리·고단백 메뉴만 골라서 주문할 수 있어요!\n상품 목록에서 칼로리 필터를 써보세요.',
      '저칼로리 식단은 저한테 맡겨주세요 🥗\n350kcal 이하 상품들이 꽤 많이 있어요!',
    ],
  },
  {
    topic: 'small_talk_taste',
    keywords: ['맛있어', '맛있겠다', '먹어봤어', '어때', '어떤맛', '맛은'],
    answers: [
      '저도 먹고 싶어요 😋 실제 고객 리뷰는 상품 상세 페이지에서 확인해보세요!',
      '상품 상세 페이지 리뷰 탭에 솔직한 후기들이 많아요 🌟 참고해보세요!',
    ],
  },
  {
    topic: 'small_talk_bye',
    keywords: ['bye', '바이', '안녕히', '잘있어', '끊을게', '갈게', '나중에'],
    answers: [
      '또 와요{name}! 맛있는 한 끼 되세요 🍅',
      '다음에 또 봐요{name} 👋 건강한 하루 되세요!',
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  맥락 기반 후속 처리                                                  */
/* ------------------------------------------------------------------ */
const FOLLOWUP_KEYWORDS = ['더', '자세히', '어떻게', '그럼', '그거', '그게', '더알려줘', '추가로', '?']

function getLastBotTopic(history: HistoryItem[]): string | null {
  // 마지막 bot 메시지를 보고 어떤 topic이었는지 역추적
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].role === 'bot') {
      const text = normalize(history[i].text)
      if (text.includes('배송')) return 'delivery_time'
      if (text.includes('구독')) return 'subscription'
      if (text.includes('포인트')) return 'point'
      if (text.includes('취소')) return 'cancel'
      if (text.includes('환불')) return 'refund'
      if (text.includes('쿠폰')) return 'coupon'
    }
  }
  return null
}

const TOPIC_DETAIL: Record<string, string> = {
  delivery_time: '배송은 CJ대한통운으로 발송돼요 🚚\n주말·공휴일은 배송이 없으니 참고해주세요!\n제주·도서산간 지역은 1~2일 추가 소요될 수 있어요.',
  subscription: '구독 결제는 매월 자동으로 이루어져요.\n원하는 상품을 미리 골라두면 정기적으로 배송돼요 🥗\n언제든 마이페이지에서 상품 변경도 가능해요!',
  point: '포인트는 주문 완료 후 7일 뒤 자동 확정돼요.\n1포인트 = 1원으로 사용 가능하고, 최소 사용 금액은 1,000포인트예요 💚',
  cancel: '취소 후 환불은 결제 수단에 따라 1~5영업일 소요돼요.\n카드 취소는 보통 3~5일, 카카오·토스페이는 1~2일이에요.',
  refund: '교환·반품 배송비는 고객 귀책 시 편도 3,000원이에요.\n불량·오배송의 경우 배송비 전액 무료예요 📦',
  coupon: '쿠폰은 1회 주문에 1개만 사용 가능해요.\n포인트와 쿠폰을 동시에 사용할 수 있어요 🎉',
}

/* ------------------------------------------------------------------ */
/*  메인 응답 함수                                                        */
/* ------------------------------------------------------------------ */
function getBotResponse(message: string, history: HistoryItem[], userName: string | null): string {
  const norm = normalize(message)
  const lower = message.toLowerCase()

  // 1. 후속 질문 감지 (짧고 "더", "자세히" 등 포함)
  const isFollowup = message.length < 20 && FOLLOWUP_KEYWORDS.some((kw) => norm.includes(kw))
  if (isFollowup) {
    const lastTopic = getLastBotTopic(history)
    if (lastTopic && TOPIC_DETAIL[lastTopic]) {
      return withName(TOPIC_DETAIL[lastTopic], userName)
    }
  }

  // 2. FAQ 매칭
  for (const faq of FAQS) {
    if (faq.keywords.some((kw) => norm.includes(normalize(kw)) || lower.includes(kw))) {
      return withName(pick(faq.answers), userName)
    }
  }

  // 3. 폴백
  const fallbacks = [
    '흠, 그 질문은 제가 잘 모르겠어요 🤔\n배송·구독·포인트·취소 등은 바로 답할 수 있어요!\n더 자세한 문의는 support@greeneat.kr 로 해주세요.',
    '아직 배우는 중이라 그 부분은 어렵네요 😅\n배송, 구독, 주문취소, 환불, 포인트 관련 질문이라면 바로 도와드릴 수 있어요!',
  ]
  return withName(pick(fallbacks), userName)
}

/* ------------------------------------------------------------------ */
/*  핸들러                                                               */
/* ------------------------------------------------------------------ */
export async function POST(req: NextRequest) {
  const { message, history = [] } = await req.json()
  if (!message?.trim()) {
    return NextResponse.json({ error: '메시지를 입력해주세요.' }, { status: 400 })
  }

  let userName: string | null = null
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('name').eq('id', user.id).single()
      userName = profile?.name ?? null
    }
  } catch {}

  const reply = getBotResponse(message, history as HistoryItem[], userName)
  return NextResponse.json({ reply, userName })
}

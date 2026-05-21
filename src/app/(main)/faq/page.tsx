'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronLeft, Mail } from 'lucide-react'

type FAQItem = {
  q: string
  a: string
}

type FAQCategory = {
  label: string
  items: FAQItem[]
}

const FAQ_DATA: FAQCategory[] = [
  {
    label: '배송',
    items: [
      {
        q: '배송은 얼마나 걸리나요?',
        a: '주문 확정 후 평균 1~2 영업일 이내에 출고되며, 출고 후 1~2일 내 수령 가능합니다. 제주·도서산간 지역은 1~2일 추가 소요될 수 있습니다.',
      },
      {
        q: '배송비는 얼마인가요?',
        a: '3만 원 이상 구매 시 무료배송이 적용됩니다. 미만 주문의 경우 3,000원의 배송비가 부과됩니다.',
      },
      {
        q: '배송지를 변경할 수 있나요?',
        a: '주문 완료 후 배송 준비 단계(confirmed) 이전까지만 배송지 변경이 가능합니다. 변경이 필요하시면 고객센터(support@greeneat.kr)로 빠르게 연락해 주세요.',
      },
      {
        q: '배송 추적은 어떻게 하나요?',
        a: '마이페이지 > 주문 내역에서 운송장 번호를 확인하실 수 있으며, 배송사 앱이나 사이트에서 실시간 추적이 가능합니다.',
      },
      {
        q: '새벽 배송이 가능한가요?',
        a: '현재 새벽배송 서비스는 수도권 일부 지역에서만 제공됩니다. 가능 지역은 주문 시 배송지 입력 단계에서 안내됩니다.',
      },
    ],
  },
  {
    label: '결제·환불',
    items: [
      {
        q: '어떤 결제 수단을 사용할 수 있나요?',
        a: '신용카드(국내 전 카드사), 카카오페이, 네이버페이, 토스페이, 무통장 입금을 지원합니다.',
      },
      {
        q: '환불은 어떻게 신청하나요?',
        a: '마이페이지 > 반품·교환 신청 메뉴에서 환불 신청이 가능합니다. 접수 후 영업일 기준 3~5일 이내 처리됩니다.',
      },
      {
        q: '환불 금액은 언제 입금되나요?',
        a: '반품 상품 수거 확인 후 2~3 영업일 이내 원결제 수단으로 환불됩니다. 카드 취소의 경우 카드사 정책에 따라 3~5 영업일이 소요될 수 있습니다.',
      },
      {
        q: '식품도 환불·교환이 되나요?',
        a: '단순 변심에 의한 환불은 미개봉·미사용 상태에 한해 수령 후 7일 이내 가능합니다. 상품 불량·오배송의 경우 수령일로부터 30일 이내 신청하실 수 있습니다.',
      },
      {
        q: '부분 취소가 가능한가요?',
        a: '출고 전 주문에 한해 주문 상품의 일부 취소가 가능합니다. 출고 이후에는 전체 취소 또는 반품 신청으로 처리해 드립니다.',
      },
    ],
  },
  {
    label: '구독',
    items: [
      {
        q: '구독 서비스란 무엇인가요?',
        a: '그린잇 구독 서비스는 매주 또는 매월 원하는 밀키트를 정기 배송받는 서비스입니다. 단건 구매 대비 최대 15% 할인 혜택이 적용됩니다.',
      },
      {
        q: '구독을 일시 중지할 수 있나요?',
        a: '마이페이지 > 구독 현황에서 언제든지 일시 중지가 가능합니다. 중지 기간 동안은 결제 및 배송이 이루어지지 않습니다.',
      },
      {
        q: '구독 메뉴는 변경할 수 있나요?',
        a: '다음 배송일 3일 전까지 마이페이지 > 구독 메뉴 변경에서 수정 가능합니다. 이후에는 다다음 회차부터 적용됩니다.',
      },
      {
        q: '구독 해지 시 위약금이 있나요?',
        a: '위약금은 없습니다. 언제든지 자유롭게 해지하실 수 있으며, 해지 신청 후 다음 결제일부터 청구가 중단됩니다.',
      },
      {
        q: '구독 할인과 쿠폰을 함께 사용할 수 있나요?',
        a: '네, 구독 할인 적용 후 추가로 쿠폰 할인이 가능합니다. 단, 일부 쿠폰은 구독 주문에 적용이 제한될 수 있습니다.',
      },
    ],
  },
  {
    label: '상품',
    items: [
      {
        q: '밀키트 유통기한은 어떻게 되나요?',
        a: '상품에 따라 다르지만 냉장 제품은 배송일 기준 3~5일, 냉동 제품은 30~90일입니다. 각 상품 상세 페이지에서 확인하실 수 있습니다.',
      },
      {
        q: '알레르기 정보는 어디서 확인하나요?',
        a: '각 상품 상세 페이지 내 영양 정보 섹션에서 알레르기 유발 성분을 확인할 수 있습니다. 또한 마이페이지에서 알레르기 프로필을 설정하면 해당 성분이 포함된 상품에 경고 표시가 표시됩니다.',
      },
      {
        q: '상품이 품절되었을 때 재입고 알림을 받을 수 있나요?',
        a: '상품 상세 페이지의 "재입고 알림" 버튼을 클릭하면 재입고 시 푸시 알림 및 이메일로 안내해 드립니다.',
      },
      {
        q: '칼로리 정보는 정확한가요?',
        a: '모든 영양 정보는 식품의약품안전처 기준에 따라 검증된 값입니다. 다만 재료 자연 편차로 ±10% 내외 차이가 발생할 수 있습니다.',
      },
      {
        q: '밀키트 조리 난이도는 어떻게 구분되나요?',
        a: '쉬움(Easy): 5분 이내, 보통(Medium): 10~20분, 어려움(Hard): 30분 이상으로 구분됩니다. 상품 카드 및 상세 페이지에서 확인할 수 있습니다.',
      },
    ],
  },
]

function AccordionItem({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-line last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left gap-4 hover:text-[#2d7a4f] transition-colors"
      >
        <span className="text-sm font-medium text-ink leading-relaxed">{item.q}</span>
        <ChevronDown
          size={16}
          className={`flex-shrink-0 text-ink-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="pb-4 pr-8">
          <p className="text-sm text-ink-3 leading-relaxed">{item.a}</p>
        </div>
      )}
    </div>
  )
}

export default function FAQPage() {
  const [openKey, setOpenKey] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>(FAQ_DATA[0].label)

  function toggle(key: string) {
    setOpenKey((prev) => (prev === key ? null : key))
  }

  const currentCategory = FAQ_DATA.find((c) => c.label === activeCategory)!

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-2">
        <Link href="/" className="p-1 text-ink-4 hover:text-ink-2 transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-ink">고객센터 · FAQ</h1>
      </div>

      {/* 이메일 안내 */}
      <div className="flex items-center gap-2.5 bg-green-tint rounded-xl px-4 py-3 mb-8 mt-4">
        <Mail size={15} className="text-[#2d7a4f] flex-shrink-0" />
        <p className="text-sm text-[#2d7a4f]">
          더 궁금한 점은{' '}
          <a href="mailto:support@greeneat.kr" className="font-semibold underline underline-offset-2 hover:opacity-80">
            support@greeneat.kr
          </a>
          로 문의해 주세요.
        </p>
      </div>

      {/* 카테고리 탭 */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {FAQ_DATA.map((cat) => (
          <button
            key={cat.label}
            onClick={() => { setActiveCategory(cat.label); setOpenKey(null) }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat.label
                ? 'bg-[#2d7a4f] text-white'
                : 'bg-surface border border-line text-ink-3 hover:border-[#2d7a4f]/40 hover:text-[#2d7a4f]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* FAQ 아코디언 */}
      <div className="bg-surface rounded-2xl border border-line px-5 divide-y divide-line">
        {currentCategory.items.map((item, i) => {
          const key = `${activeCategory}-${i}`
          return (
            <AccordionItem
              key={key}
              item={item}
              isOpen={openKey === key}
              onToggle={() => toggle(key)}
            />
          )
        })}
      </div>

      {/* 하단 안내 */}
      <div className="mt-8 text-center">
        <p className="text-sm text-ink-5">원하는 답변을 찾지 못하셨나요?</p>
        <a
          href="mailto:support@greeneat.kr"
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-[#2d7a4f] hover:underline"
        >
          <Mail size={14} />
          이메일로 문의하기
        </a>
      </div>
    </div>
  )
}

'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronLeft, Mail, Bot, Search, Clock, Phone, ChevronRight, MessageCircleQuestion } from 'lucide-react'

type FAQItem  = { q: string; a: string }
type FAQCategory = { label: string; emoji: string; items: FAQItem[] }

const FAQ_DATA: FAQCategory[] = [
  {
    label: '배송',
    emoji: '🚚',
    items: [
      { q: '배송은 얼마나 걸리나요?',   a: '주문 확정 후 평균 1~2 영업일 이내에 출고되며, 출고 후 1~2일 내 수령 가능합니다. 제주·도서산간 지역은 1~2일 추가 소요될 수 있습니다.' },
      { q: '배송비는 얼마인가요?',       a: '3만 원 이상 구매 시 무료 배송이 적용됩니다. 미만 주문의 경우 3,000원의 배송비가 부과됩니다.' },
      { q: '배송지를 변경할 수 있나요?', a: '주문 완료 후 배송 준비 단계(confirmed) 이전까지만 배송지 변경이 가능합니다. 변경이 필요하시면 고객센터(support@greeneat.kr)로 빠르게 연락해 주세요.' },
      { q: '배송 추적은 어떻게 하나요?', a: '마이페이지 > 주문 내역에서 운송장 번호를 확인하실 수 있으며, 배송사 앱이나 사이트에서 실시간 추적이 가능합니다.' },
      { q: '새벽 배송이 가능한가요?',    a: '현재 새벽배송 서비스는 수도권 일부 지역에서만 제공됩니다. 가능 지역은 주문 시 배송지 입력 단계에서 안내됩니다.' },
      { q: '배송 시간대를 선택할 수 있나요?', a: '결제 시 오전(7~12시), 오후(12~18시), 저녁(18~22시) 중 선택이 가능합니다. 정기구독은 마이페이지에서 언제든지 변경하실 수 있습니다.' },
    ],
  },
  {
    label: '결제·환불',
    emoji: '💳',
    items: [
      { q: '어떤 결제 수단을 사용할 수 있나요?', a: '신용카드(국내 전 카드사), 카카오페이, 네이버페이, 토스페이, 무통장 입금을 지원합니다.' },
      { q: '환불은 어떻게 신청하나요?',           a: '마이페이지 > 반품·교환 신청 메뉴에서 환불 신청이 가능합니다. 접수 후 영업일 기준 3~5일 이내 처리됩니다.' },
      { q: '환불 금액은 언제 입금되나요?',         a: '반품 상품 수거 확인 후 2~3 영업일 이내 원결제 수단으로 환불됩니다. 카드 취소의 경우 카드사 정책에 따라 3~5 영업일이 소요될 수 있습니다.' },
      { q: '식품도 환불·교환이 되나요?',           a: '단순 변심에 의한 환불은 미개봉·미사용 상태에 한해 수령 후 7일 이내 가능합니다. 상품 불량·오배송의 경우 수령일로부터 30일 이내 신청하실 수 있습니다.' },
      { q: '부분 취소가 가능한가요?',              a: '출고 전 주문에 한해 주문 상품의 일부 취소가 가능합니다. 출고 이후에는 전체 취소 또는 반품 신청으로 처리해 드립니다.' },
    ],
  },
  {
    label: '구독',
    emoji: '🔄',
    items: [
      { q: '구독 서비스란 무엇인가요?',         a: '그린잇 구독 서비스는 매주 또는 매월 원하는 밀키트를 정기 배송받는 서비스입니다. 단건 구매 대비 최대 15% 할인 혜택이 적용됩니다.' },
      { q: '구독을 일시 중지할 수 있나요?',     a: '마이페이지 > 구독 현황에서 언제든지 일시 중지가 가능합니다. 1주/2주/1개월/2개월 중 기간을 선택해 중지할 수 있으며, 중지 기간 동안은 결제 및 배송이 이루어지지 않습니다.' },
      { q: '구독 메뉴는 변경할 수 있나요?',     a: '다음 배송일 3일 전까지 마이페이지 > 구독 메뉴 변경에서 수정 가능합니다. 이후에는 다다음 회차부터 적용됩니다.' },
      { q: '구독 해지 시 위약금이 있나요?',     a: '위약금은 없습니다. 언제든지 자유롭게 해지하실 수 있으며, 해지 신청 후 다음 결제일부터 청구가 중단됩니다.' },
      { q: '자동 결제를 끌 수 있나요?',         a: '마이페이지 > 구독 현황에서 자동결제 토글을 OFF로 설정하시면, 매월 직접 결제하는 방식으로 변경됩니다.' },
      { q: '구독 할인과 쿠폰을 함께 사용할 수 있나요?', a: '네, 구독 할인 적용 후 추가로 쿠폰 할인이 가능합니다. 단, 일부 쿠폰은 구독 주문에 적용이 제한될 수 있습니다.' },
    ],
  },
  {
    label: '상품',
    emoji: '🍱',
    items: [
      { q: '밀키트 유통기한은 어떻게 되나요?',         a: '상품에 따라 다르지만 냉장 제품은 배송일 기준 3~5일, 냉동 제품은 30~90일입니다. 각 상품 상세 페이지에서 확인하실 수 있습니다.' },
      { q: '알레르기 정보는 어디서 확인하나요?',       a: '각 상품 상세 페이지 내 영양 정보 섹션에서 알레르기 유발 성분을 확인할 수 있습니다. 마이페이지에서 알레르기 프로필을 설정하면 해당 성분 포함 상품에 경고 표시가 나타납니다.' },
      { q: '상품이 품절되었을 때 재입고 알림을 받을 수 있나요?', a: '상품 상세 페이지의 "재입고 알림" 버튼을 클릭하면 재입고 시 푸시 알림 및 이메일로 안내해 드립니다.' },
      { q: '칼로리 정보는 정확한가요?',               a: '모든 영양 정보는 식품의약품안전처 기준에 따라 검증된 값입니다. 다만 재료 자연 편차로 ±10% 내외 차이가 발생할 수 있습니다.' },
      { q: '신상품은 얼마나 자주 출시되나요?',         a: '매주 1~2종의 신상품을 출시하고 있습니다. 홈 화면 "이번 주 신상품" 섹션에서 최신 메뉴를 바로 확인하실 수 있어요.' },
    ],
  },
  {
    label: '회원',
    emoji: '👤',
    items: [
      { q: '회원가입 없이 주문할 수 있나요?',   a: '비회원 주문은 현재 지원하지 않습니다. 간편 회원가입(이메일 또는 소셜 로그인) 후 이용하실 수 있습니다.' },
      { q: '비밀번호를 잊어버렸어요.',           a: '로그인 페이지의 "비밀번호 찾기"를 클릭하면 가입한 이메일로 재설정 링크가 발송됩니다.' },
      { q: '회원 탈퇴는 어떻게 하나요?',         a: '마이페이지 > 계정 설정에서 탈퇴 신청을 하실 수 있습니다. 탈퇴 후 30일간 데이터가 보관되며 이후 영구 삭제됩니다.' },
      { q: '개인정보는 안전하게 관리되나요?',   a: '모든 개인정보는 암호화 저장되며 외부에 제공하지 않습니다. 자세한 내용은 개인정보처리방침에서 확인하세요.' },
      { q: '포인트나 적립금 제도가 있나요?',     a: '현재 적립금 제도를 준비 중입니다. 출시 시 앱 푸시 알림 및 이메일로 안내해 드릴 예정입니다.' },
    ],
  },
  {
    label: '건강관리',
    emoji: '💪',
    items: [
      { q: '건강 목표는 어디서 설정하나요?',           a: '마이페이지 > 건강 목표에서 다이어트/근육증가/건강유지 등 목표를 설정할 수 있습니다. 설정 후 AI 식단 추천이 목표에 맞게 최적화됩니다.' },
      { q: 'AI 식단 추천은 어떻게 작동하나요?',       a: 'Mifflin-St Jeor 공식으로 개인 TDEE를 계산하고, 건강 목표·알레르기 정보를 반영해 아침·점심·저녁 3끼 식단을 매일 자동 추천합니다.' },
      { q: '운동 계획도 제공되나요?',                 a: '건강관리 탭의 운동 탭에서 건강 목표별 주간 운동 계획을 확인하실 수 있습니다. 완료한 운동은 체크하여 기록할 수 있어요.' },
      { q: '영양소 분석 결과가 이상해요.',             a: '7일간의 식사 기록이 충분하지 않으면 분석 정확도가 낮을 수 있습니다. 3일 이상 식사를 기록하신 후 다시 확인해 보세요.' },
      { q: '알레르기 정보는 어디서 설정하나요?',       a: '마이페이지 > 건강 프로필에서 알레르기 유발 식품을 선택하면 해당 재료가 포함된 상품에 경고 뱃지가 표시됩니다.' },
    ],
  },
]

/* ── 아코디언 아이템 ──────────────────────────────────────────── */
function AccordionItem({ item, isOpen, onToggle, highlight = '' }: {
  item: FAQItem; isOpen: boolean; onToggle: () => void; highlight?: string
}) {
  function highlightText(text: string, query: string) {
    if (!query) return <>{text}</>
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    return <>{parts.map((p, i) => regex.test(p) ? <mark key={i} className="bg-yellow-100 text-yellow-800 rounded">{p}</mark> : p)}</>
  }

  return (
    <div className="border-b border-line last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left gap-4 hover:text-[#2d7a4f] transition-colors"
      >
        <span className="text-sm font-medium text-ink leading-relaxed">
          {highlightText(item.q, highlight)}
        </span>
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

/* ── 메인 페이지 ─────────────────────────────────────────────── */
export default function FAQPage() {
  const [openKey,         setOpenKey]         = useState<string | null>(null)
  const [activeCategory,  setActiveCategory]  = useState<string>(FAQ_DATA[0].label)
  const [query,           setQuery]           = useState('')

  const trimmedQuery = query.trim()

  /* 검색 결과 */
  const searchResults = useMemo(() => {
    if (!trimmedQuery) return []
    const q = trimmedQuery.toLowerCase()
    const results: { catLabel: string; item: FAQItem; idx: number }[] = []
    for (const cat of FAQ_DATA) {
      cat.items.forEach((item, idx) => {
        if (item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)) {
          results.push({ catLabel: cat.label, item, idx })
        }
      })
    }
    return results
  }, [trimmedQuery])

  const currentCategory = FAQ_DATA.find((c) => c.label === activeCategory)!

  function toggle(key: string) {
    setOpenKey(prev => prev === key ? null : key)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-6">
        <Link href="/" className="p-1 text-ink-4 hover:text-ink-2 transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-ink">고객센터 · FAQ</h1>
      </div>

      {/* ── AI 24시간 상담 배너 ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#2d7a4f] to-[#1a5c38] rounded-2xl p-5 mb-6 text-white">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Bot size={18} className="text-white/90" />
              <span className="text-xs font-semibold tracking-wide text-white/80 uppercase">AI 챗봇 상담</span>
            </div>
            <h2 className="text-lg font-bold mb-1">24시간 언제든지 물어보세요</h2>
            <p className="text-[13px] text-white/75 leading-relaxed">
              주문·배송·건강 식단 등 모든 질문에<br/>AI가 즉시 답변해 드립니다.
            </p>
          </div>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('greeni:open-chat'))}
            className="shrink-0 flex items-center gap-1.5 bg-white text-[#2d7a4f] font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-[#f0faf4] transition-colors shadow-sm"
          >
            상담 시작 <ChevronRight size={14} />
          </button>
        </div>
        {/* 장식 원 */}
        <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute -right-2 -bottom-8 w-24 h-24 rounded-full bg-white/5" />
      </div>

      {/* ── 운영시간 + 이메일 ── */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="flex items-start gap-3 bg-surface border border-line rounded-2xl px-4 py-3.5">
          <Clock size={15} className="text-[#2d7a4f] mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-ink-3 mb-0.5">운영시간</p>
            <p className="text-[11px] text-ink-4 leading-relaxed">
              AI 챗봇 <span className="font-semibold text-[#2d7a4f]">24시간</span><br/>
              담당자 평일 <span className="font-medium">09:00~18:00</span>
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 bg-surface border border-line rounded-2xl px-4 py-3.5">
          <Mail size={15} className="text-[#2d7a4f] mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-semibold text-ink-3 mb-0.5">이메일 문의</p>
            <a
              href="mailto:support@greeneat.kr"
              className="text-[11px] text-[#2d7a4f] font-semibold hover:underline underline-offset-2 leading-relaxed block"
            >
              support@greeneat.kr
            </a>
            <p className="text-[11px] text-ink-5">1~2 영업일 이내 답변</p>
          </div>
        </div>
      </div>

      {/* ── 검색창 ── */}
      <div className="relative mb-6">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-4 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={e => { setQuery(e.target.value); setOpenKey(null) }}
          placeholder="궁금한 내용을 검색해 보세요 (예: 배송비, 환불)"
          className="w-full pl-10 pr-4 py-3 bg-surface border border-line rounded-2xl text-sm text-ink placeholder:text-ink-5 focus:outline-none focus:ring-2 focus:ring-[#2d7a4f]/30 focus:border-[#2d7a4f] transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-5 hover:text-ink-3 transition-colors text-lg leading-none"
          >
            ×
          </button>
        )}
      </div>

      {/* ── 검색 결과 ── */}
      {trimmedQuery ? (
        <div>
          <p className="text-xs text-ink-4 mb-3">
            "{trimmedQuery}" 검색 결과 <span className="font-semibold text-ink-2">{searchResults.length}건</span>
          </p>
          {searchResults.length > 0 ? (
            <div className="bg-surface rounded-2xl border border-line px-5 divide-y divide-line">
              {searchResults.map(({ catLabel, item, idx }) => {
                const key = `search-${catLabel}-${idx}`
                return (
                  <div key={key}>
                    <span className="text-[10px] font-semibold text-[#2d7a4f] bg-green-tint px-2 py-0.5 rounded-full inline-block mt-4">
                      {FAQ_DATA.find(c => c.label === catLabel)?.emoji} {catLabel}
                    </span>
                    <AccordionItem
                      item={item}
                      isOpen={openKey === key}
                      onToggle={() => toggle(key)}
                      highlight={trimmedQuery}
                    />
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-surface rounded-2xl border border-line px-5 py-10 text-center">
              <p className="text-sm text-ink-4 mb-2">검색 결과가 없어요.</p>
              <p className="text-xs text-ink-5">다른 키워드로 검색하거나, AI 챗봇에 직접 물어보세요.</p>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('greeni:open-chat'))}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#2d7a4f] hover:underline"
              >
                <Bot size={13} /> AI 챗봇 바로가기
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* 카테고리 탭 */}
          <div className="flex gap-2 mb-5 flex-wrap">
            {FAQ_DATA.map((cat) => (
              <button
                key={cat.label}
                onClick={() => { setActiveCategory(cat.label); setOpenKey(null) }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat.label
                    ? 'bg-[#2d7a4f] text-white'
                    : 'bg-surface border border-line text-ink-3 hover:border-[#2d7a4f]/40 hover:text-[#2d7a4f]'
                }`}
              >
                <span>{cat.emoji}</span>
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
        </>
      )}

      {/* 하단 안내 */}
      <div className="mt-8 p-5 bg-tint rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-ink-2">원하는 답변을 찾지 못하셨나요?</p>
          <p className="text-xs text-ink-4 mt-0.5">AI 챗봇이 24시간 실시간으로 도와드립니다.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('greeni:open-chat'))}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#2d7a4f] text-white text-sm font-semibold rounded-xl hover:bg-[#235f3d] transition-colors"
          >
            <Bot size={13} /> AI 상담
          </button>
          <Link
            href="/my/inquiries"
            className="flex items-center gap-1.5 px-4 py-2 bg-surface border border-line text-ink-3 text-sm font-semibold rounded-xl hover:border-[#2d7a4f]/50 hover:text-[#2d7a4f] transition-colors"
          >
            <MessageCircleQuestion size={13} /> 1:1 문의
          </Link>
          <a
            href="mailto:support@greeneat.kr"
            className="flex items-center gap-1.5 px-4 py-2 bg-surface border border-line text-ink-3 text-sm font-semibold rounded-xl hover:border-[#2d7a4f]/50 hover:text-[#2d7a4f] transition-colors"
          >
            <Mail size={13} /> 이메일
          </a>
        </div>
      </div>
    </div>
  )
}

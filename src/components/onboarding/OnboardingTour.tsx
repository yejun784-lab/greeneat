'use client'

import { useState, useEffect } from 'react'
import { X, ChevronRight, ChevronLeft } from 'lucide-react'

const STEPS = [
  {
    emoji: '🥗',
    title: 'GreenEat에 오신 것을 환영해요!',
    desc: '신선한 재료로 만드는 건강한 밀키트를 구독으로 더 편리하게 즐겨보세요.',
  },
  {
    emoji: '🔍',
    title: '원하는 밀키트를 쉽게 찾아보세요',
    desc: '상단 검색창에서 이름으로 검색하거나, 카테고리/칼로리/난이도로 필터링할 수 있어요.',
  },
  {
    emoji: '⚖️',
    title: '상품을 나란히 비교해보세요',
    desc: '카드의 비교 버튼으로 최대 3개 상품을 한눈에 비교할 수 있어요. 하단 트레이에서 확인하세요.',
  },
  {
    emoji: '🔔',
    title: '품절 상품도 놓치지 마세요',
    desc: '품절된 상품 상세 페이지에서 재입고 알림을 신청하면 다시 들어왔을 때 알려드려요.',
  },
  {
    emoji: '🎯',
    title: '나만의 영양 목표를 설정하세요',
    desc: '마이페이지에서 다이어트 / 균형식 / 근육 증가 중 목표를 선택하면 맞춤 영양 정보를 보여드려요.',
  },
  {
    emoji: '♻️',
    title: '구독으로 더 스마트하게!',
    desc: '정기 구독을 이용하면 원하는 날짜에 자동으로 배송받을 수 있어요. 언제든지 변경 가능해요.',
  },
]

const STORAGE_KEY = 'greeneat_onboarding_done'

export function OnboardingTour() {
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY)
    if (!done) {
      // 약간의 딜레이 후 표시 (페이지 로드 완료 후)
      const t = setTimeout(() => setVisible(true), 800)
      return () => clearTimeout(t)
    }
  }, [])

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
  }

  function next() {
    if (step < STEPS.length - 1) setStep(step + 1)
    else dismiss()
  }

  function prev() {
    if (step > 0) setStep(step - 1)
  }

  if (!visible) return null

  const current = STEPS[step]

  return (
    // 오버레이
    <div
      className="fixed inset-0 z-[9980] flex items-end sm:items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) dismiss() }}
    >
      {/* 카드 */}
      <div className="relative bg-surface rounded-3xl shadow-2xl w-full max-w-sm p-7 animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* 닫기 */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 text-ink-5 hover:text-ink-3 transition-colors"
          aria-label="닫기"
        >
          <X size={18} />
        </button>

        {/* 이모지 */}
        <div className="text-5xl mb-5 text-center">{current.emoji}</div>

        {/* 내용 */}
        <h2 className="text-lg font-bold text-ink text-center mb-2">{current.title}</h2>
        <p className="text-sm text-ink-4 text-center leading-relaxed">{current.desc}</p>

        {/* 진행 점 */}
        <div className="flex items-center justify-center gap-1.5 mt-6 mb-5">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`rounded-full transition-all ${
                i === step ? 'w-5 h-2 bg-[#2d7a4f]' : 'w-2 h-2 bg-line-2'
              }`}
            />
          ))}
        </div>

        {/* 버튼 */}
        <div className="flex gap-2">
          {step > 0 && (
            <button
              onClick={prev}
              className="flex-1 flex items-center justify-center gap-1 py-2.5 border border-line-2 rounded-xl text-sm text-ink-3 hover:border-line-3 transition-colors"
            >
              <ChevronLeft size={15} />
              이전
            </button>
          )}
          <button
            onClick={next}
            className="flex-1 flex items-center justify-center gap-1 py-2.5 bg-[#2d7a4f] text-white rounded-xl text-sm font-medium hover:bg-[#235f3d] transition-colors"
          >
            {step < STEPS.length - 1 ? (
              <>다음 <ChevronRight size={15} /></>
            ) : (
              '시작하기 🚀'
            )}
          </button>
        </div>

        {/* 건너뛰기 */}
        {step < STEPS.length - 1 && (
          <button
            onClick={dismiss}
            className="w-full text-center text-xs text-ink-5 hover:text-ink-4 mt-3 transition-colors"
          >
            건너뛰기
          </button>
        )}
      </div>
    </div>
  )
}

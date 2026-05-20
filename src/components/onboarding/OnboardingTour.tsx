'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'

export function OnboardingTour() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const done = localStorage.getItem('greeneat-onboarding-done')
    if (!done) setShow(true)
  }, [])

  const dismiss = () => {
    localStorage.setItem('greeneat-onboarding-done', '1')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 relative">
        <button onClick={dismiss} className="absolute top-4 right-4 text-ink-5 hover:text-ink-3">
          <X size={18} />
        </button>
        <div className="text-4xl mb-3 text-center">🌿</div>
        <h2 className="text-xl font-bold text-center text-ink mb-2">GreenEat에 오신 것을 환영해요!</h2>
        <p className="text-sm text-ink-4 text-center mb-5 leading-relaxed">
          진정성 있는 건강한 도시락을 매일 즐겨보세요.<br />정기구독으로 더 알뜰하게!
        </p>
        <div className="flex flex-col gap-2">
          <Link
            href="/products"
            onClick={dismiss}
            className="w-full py-3 bg-[#2d7a4f] text-white text-sm font-semibold rounded-xl text-center hover:bg-[#235f3d] transition-colors"
          >
            도시락 구경하기 🍱
          </Link>
          <button onClick={dismiss} className="w-full py-2.5 text-sm text-ink-4 hover:text-ink-3 transition-colors">
            나중에 볼게요
          </button>
        </div>
      </div>
    </div>
  )
}
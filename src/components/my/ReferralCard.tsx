'use client'

import { useState } from 'react'
import { Gift, Copy, Check } from 'lucide-react'

interface Props {
  code: string | null
}

export function ReferralCard({ code }: Props) {
  const [copied, setCopied] = useState(false)
  const displayCode = code ?? 'GREENEAT'

  async function copyCode() {
    await navigator.clipboard.writeText(displayCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-surface rounded-2xl border border-line p-5">
      <div className="flex items-center gap-2 mb-3">
        <Gift size={16} className="text-[#2d7a4f]" />
        <h2 className="font-semibold text-ink">친구 초대</h2>
      </div>
      <p className="text-xs text-ink-5 mb-4">
        친구가 초대 코드로 첫 주문 시 양쪽 모두 <span className="font-semibold text-ink">1,000P</span> 적립!
      </p>
      <div className="flex items-center gap-2 bg-cream rounded-xl px-4 py-3">
        <span className="flex-1 font-mono text-lg font-bold text-[#2d7a4f] tracking-widest">
          {displayCode}
        </span>
        <button
          onClick={copyCode}
          className={`flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
            copied
              ? 'bg-[#2d7a4f] text-white'
              : 'bg-white border border-line-2 text-ink-3 hover:border-[#2d7a4f] hover:text-[#2d7a4f]'
          }`}
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? '복사됨!' : '복사'}
        </button>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface Props { code: string | null }

export function ReferralCard({ code }: Props) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    if (!code) return
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!code) return null

  return (
    <div className="bg-surface rounded-2xl border border-line p-5">
      <p className="text-sm font-semibold text-ink mb-1">친구 초대 코드</p>
      <p className="text-xs text-ink-4 mb-3">친구가 가입하면 양쪽 모두 포인트를 드려요!</p>
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-tint rounded-xl px-4 py-2.5 font-mono text-sm font-bold text-[#2d7a4f] tracking-widest">
          {code}
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 px-3.5 py-2.5 bg-[#2d7a4f] text-white text-xs font-semibold rounded-xl hover:bg-[#235f3d] transition-colors"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? '복사됨!' : '복사'}
        </button>
      </div>
    </div>
  )
}
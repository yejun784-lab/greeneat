'use client'

import { useState } from 'react'
import { Copy, Check, Gift } from 'lucide-react'
import { toast } from '@/lib/toast-store'

export function ReferralCard({ code }: { code: string | null }) {
  const [copied, setCopied] = useState(false)

  if (!code) return null

  const referralUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/signup?ref=${code}`
    : `/signup?ref=${code}`

  async function handleCopy() {
    await navigator.clipboard.writeText(referralUrl)
    setCopied(true)
    toast.success('초대 링크가 복사됐어요! 친구에게 공유해보세요 🎉')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-gradient-to-br from-[#1a4a2e] to-[#2d7a4f] rounded-2xl p-5 text-white">
      <div className="flex items-center gap-2 mb-3">
        <Gift size={16} className="text-green-300" />
        <h3 className="font-semibold text-sm">친구 초대하기</h3>
      </div>
      <p className="text-green-100 text-xs mb-4 leading-relaxed">
        친구가 내 링크로 가입하면<br />
        <strong className="text-white">나 +2,000P · 친구 +1,000P</strong> 적립!
      </p>
      <div className="bg-white/15 rounded-xl px-3 py-2 flex items-center justify-between gap-2 mb-3">
        <span className="font-mono text-sm font-bold tracking-widest">{code}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 text-xs bg-white/20 hover:bg-white/30 px-2.5 py-1.5 rounded-lg transition-colors shrink-0"
        >
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? '복사됨' : '링크 복사'}
        </button>
      </div>
      <p className="text-green-200 text-xs">초대 코드: <strong>{code}</strong></p>
    </div>
  )
}

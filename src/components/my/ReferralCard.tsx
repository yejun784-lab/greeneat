'use client'

import { useState } from 'react'
import { Copy, Check, Link } from 'lucide-react'

interface Props { code: string | null }

export function ReferralCard({ code }: Props) {
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const copyCode = async () => {
    if (!code) return
    await navigator.clipboard.writeText(code)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const copyLink = async () => {
    if (!code) return
    const url = `${window.location.origin}/signup?ref=${code}`
    await navigator.clipboard.writeText(url)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  if (!code) return null

  return (
    <div className="bg-surface rounded-2xl border border-line p-5 space-y-4">
      <div>
        <p className="text-sm font-semibold text-ink mb-1">친구 초대 코드</p>
        <p className="text-xs text-ink-4 mb-1">친구가 가입하면 양쪽 모두 포인트를 드려요!</p>
        <p className="text-xs text-[#2d7a4f] font-medium">초대한 친구 첫 주문 시 2,000P + 친구에게 1,000P</p>
      </div>

      {/* 코드 복사 */}
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-tint rounded-xl px-4 py-2.5 font-mono text-sm font-bold text-[#2d7a4f] tracking-widest">
          {code}
        </div>
        <button
          onClick={copyCode}
          className="flex items-center gap-1.5 px-3.5 py-2.5 bg-[#2d7a4f] text-white text-xs font-semibold rounded-xl hover:bg-[#235f3d] transition-colors"
        >
          {copiedCode ? <Check size={13} /> : <Copy size={13} />}
          {copiedCode ? '복사됨!' : '복사'}
        </button>
      </div>

      {/* 초대 링크 복사 */}
      <button
        onClick={copyLink}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-[#2d7a4f] text-[#2d7a4f] text-xs font-semibold rounded-xl hover:bg-green-50 transition-colors"
      >
        {copiedLink ? <Check size={13} /> : <Link size={13} />}
        {copiedLink ? '링크 복사됨!' : '초대 링크 복사'}
      </button>
    </div>
  )
}

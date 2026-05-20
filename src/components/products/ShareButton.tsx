'use client'

import { Share2, Check } from 'lucide-react'
import { useState } from 'react'

export function ShareButton({ name, productName, productId }: { name?: string; productName?: string; productId?: string }) {
  name = name ?? productName ?? ''
  const [done, setDone] = useState(false)
  const share = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    if (navigator.share) {
      await navigator.share({ title: name, url }).catch(() => {})
    } else {
      await navigator.clipboard.writeText(url)
    }
    setDone(true)
    setTimeout(() => setDone(false), 2000)
  }
  return (
    <button onClick={share} className="flex items-center gap-1.5 text-xs text-ink-4 hover:text-ink-3 transition-colors">
      {done ? <Check size={13} className="text-[#2d7a4f]" /> : <Share2 size={13} />}
      {done ? '링크 복사됨!' : '공유'}
    </button>
  )
}
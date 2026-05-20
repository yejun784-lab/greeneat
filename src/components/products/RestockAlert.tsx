'use client'

import { useState } from 'react'
import { Bell } from 'lucide-react'

export function RestockAlert({ productId, productName }: { productId: string; productName?: string }) {
  const [done, setDone] = useState(false)
  return done ? (
    <p className="text-sm text-[#2d7a4f] text-center py-2">재입고 알림이 신청됐어요 ✓</p>
  ) : (
    <button
      onClick={() => setDone(true)}
      className="w-full flex items-center justify-center gap-2 py-3 border border-line-2 rounded-xl text-sm font-medium text-ink-3 hover:border-[#2d7a4f] hover:text-[#2d7a4f] transition-colors"
    >
      <Bell size={15} /> 재입고 알림 신청
    </button>
  )
}
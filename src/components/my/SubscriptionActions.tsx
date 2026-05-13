'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PauseCircle, XCircle } from 'lucide-react'
import { toast } from '@/lib/toast-store'

export function SubscriptionActions() {
  const router = useRouter()
  const [loading, setLoading] = useState<'pause' | 'cancel' | null>(null)

  async function handleAction(action: 'pause' | 'cancel') {
    const label = action === 'pause' ? '일시정지' : '해지'
    const confirmed = window.confirm(`구독을 ${label}하시겠습니까?`)
    if (!confirmed) return

    setLoading(action)
    try {
      const res = await fetch('/api/subscriptions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      if (!res.ok) {
        const { error } = await res.json()
        toast.error(error || `구독 ${label}에 실패했습니다.`)
        return
      }
      toast.success(`구독이 ${label}되었습니다.`)
      router.refresh()
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="flex gap-2 mt-3">
      <button
        onClick={() => handleAction('pause')}
        disabled={loading !== null}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-ink-3 border border-line-2 rounded-lg hover:bg-wash transition-colors disabled:opacity-50"
      >
        <PauseCircle size={13} />
        {loading === 'pause' ? '처리 중...' : '일시정지'}
      </button>
      <button
        onClick={() => handleAction('cancel')}
        disabled={loading !== null}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
      >
        <XCircle size={13} />
        {loading === 'cancel' ? '처리 중...' : '구독 해지'}
      </button>
    </div>
  )
}

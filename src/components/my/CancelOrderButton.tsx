'use client'

import { useState } from 'react'
import { XCircle, Loader2 } from 'lucide-react'
import { toast } from '@/lib/toast-store'

interface Props {
  orderId: string
  status: string
}

export function CancelOrderButton({ orderId, status }: Props) {
  const [step, setStep] = useState<'idle' | 'confirm' | 'loading'>('idle')

  if (!['pending', 'confirmed'].includes(status)) return null

  async function handleCancel() {
    setStep('loading')
    const res = await fetch(`/api/orders/${orderId}`, { method: 'PATCH' })
    if (res.ok) {
      toast.success('주문이 취소됐어요.')
      // 페이지 새로고침으로 목록 갱신
      window.location.reload()
    } else {
      const { error } = await res.json().catch(() => ({ error: '오류' }))
      toast.error(error ?? '취소 처리 중 오류가 발생했어요.')
      setStep('idle')
    }
  }

  if (step === 'confirm') {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-ink-4">취소할까요?</span>
        <button
          onClick={() => setStep('idle')}
          className="text-xs text-ink-5 hover:text-ink-3 transition-colors"
        >
          아니오
        </button>
        <button
          onClick={handleCancel}
          disabled={step === 'loading'}
          className="text-xs text-red-500 font-semibold hover:text-red-600 transition-colors disabled:opacity-40"
        >
          네, 취소
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setStep('confirm')}
      disabled={step === 'loading'}
      className="flex items-center gap-1 text-xs text-ink-5 hover:text-red-400 transition-colors disabled:opacity-40"
    >
      {step === 'loading'
        ? <Loader2 size={12} className="animate-spin" />
        : <XCircle size={12} />
      }
      주문 취소
    </button>
  )
}

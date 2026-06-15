'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { XCircle, Loader2, X, ChevronRight } from 'lucide-react'
import { toast } from '@/lib/toast-store'

const CANCEL_REASONS = [
  '단순 변심',
  '배송 지연',
  '상품 정보 상이',
  '중복 주문',
  '잘못된 상품 선택',
  '기타',
]

interface Props {
  orderId: string
  status: string
}

export function CancelOrderButton({ orderId, status }: Props) {
  const router = useRouter()
  const [step, setStep] = useState<'idle' | 'reason' | 'loading'>('idle')
  const [selectedReason, setSelectedReason] = useState('')

  if (!['pending', 'confirmed'].includes(status)) return null

  async function handleCancel() {
    if (!selectedReason) { toast.error('취소 사유를 선택해주세요.'); return }
    setStep('loading')
    const res = await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: selectedReason }),
    })
    if (res.ok) {
      toast.success('주문이 취소됐어요.')
      handleClose()
      router.refresh()
    } else {
      const { error } = await res.json().catch(() => ({ error: '오류' }))
      toast.error(error ?? '취소 처리 중 오류가 발생했어요.')
      setStep('reason')
    }
  }

  function handleClose() {
    setStep('idle')
    setSelectedReason('')
  }

  if (step === 'loading') {
    return (
      <span className="flex items-center gap-1 text-xs text-ink-5">
        <Loader2 size={12} className="animate-spin" />
        취소 중...
      </span>
    )
  }

  return (
    <>
      <button
        onClick={() => setStep('reason')}
        className="flex items-center gap-1 text-xs text-ink-5 hover:text-red-400 transition-colors"
      >
        <XCircle size={12} />
        주문 취소
      </button>

      {/* 취소 사유 모달 */}
      {step === 'reason' && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-4 pb-4 sm:pb-0"
          onClick={handleClose}
        >
          <div
            className="w-full max-w-sm bg-surface rounded-2xl border border-line shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-line">
              <h3 className="font-semibold text-ink">주문 취소 사유</h3>
              <button onClick={handleClose} className="text-ink-5 hover:text-ink-3">
                <X size={18} />
              </button>
            </div>

            {/* 사유 목록 */}
            <div className="py-2">
              {CANCEL_REASONS.map((reason) => (
                <button
                  key={reason}
                  onClick={() => setSelectedReason(reason)}
                  className={`w-full flex items-center justify-between px-5 py-3.5 text-sm transition-colors ${
                    selectedReason === reason
                      ? 'bg-green-tint text-[#2d7a4f] font-medium'
                      : 'text-ink-2 hover:bg-wash'
                  }`}
                >
                  {reason}
                  {selectedReason === reason && <ChevronRight size={14} />}
                </button>
              ))}
            </div>

            {/* 하단 버튼 */}
            <div className="px-5 py-4 border-t border-line flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 py-2.5 border border-line-2 rounded-xl text-sm text-ink-2 hover:bg-wash transition-colors"
              >
                닫기
              </button>
              <button
                onClick={handleCancel}
                disabled={!selectedReason}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-40"
              >
                취소 확정
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

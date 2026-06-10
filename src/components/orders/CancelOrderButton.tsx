'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, AlertTriangle } from 'lucide-react'

interface Props {
  orderId: string
  status: string
}

// pending / confirmed 상태에서만 취소 가능
const CANCELLABLE = new Set(['pending', 'confirmed'])

export function CancelOrderButton({ orderId, status }: Props) {
  const router = useRouter()
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!CANCELLABLE.has(status)) return null

  async function handleCancel() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled', reason: '고객 요청' }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? '취소에 실패했습니다.')
      }
      router.refresh()
      setShowConfirm(false)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="flex-1 text-center py-3 border border-red-200 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
      >
        주문 취소
      </button>

      {/* 확인 모달 */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-dim-in">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setShowConfirm(false)} />
          <div className="relative bg-surface rounded-2xl border border-line p-6 w-full max-w-sm shadow-2xl animate-pop-in">
            <button
              onClick={() => setShowConfirm(false)}
              className="absolute top-4 right-4 text-ink-4 hover:text-ink-2"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
                <AlertTriangle size={18} className="text-red-500" />
              </div>
              <div>
                <p className="font-semibold text-ink">주문을 취소할까요?</p>
                <p className="text-xs text-ink-4 mt-0.5">취소 후 되돌릴 수 없어요</p>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 mb-3 bg-red-50 px-3 py-2 rounded-xl">{error}</p>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 border border-line-2 rounded-xl text-sm font-medium text-ink-3 hover:bg-tint transition-colors"
                disabled={loading}
              >
                유지하기
              </button>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {loading ? '취소 중...' : '취소 확인'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

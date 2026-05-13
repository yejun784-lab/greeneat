'use client'

import { useState } from 'react'
import { toast } from '@/lib/toast-store'
import { Truck } from 'lucide-react'

const STATUSES = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled']

interface Props {
  orderId: string
  currentStatus: string
  statusLabel: Record<string, string>
  statusColor: Record<string, string>
}

export function OrderStatusSelect({ orderId, currentStatus, statusLabel, statusColor }: Props) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)
  const [pendingStatus, setPendingStatus] = useState<string | null>(null)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [carrier, setCarrier] = useState('CJ대한통운')

  async function doUpdate(newStatus: string, extra?: { trackingNumber?: string; carrier?: string }) {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, ...extra }),
      })
      if (!res.ok) {
        toast.error('상태 변경에 실패했습니다.')
      } else {
        setStatus(newStatus)
        toast.success(`${statusLabel[newStatus]}(으)로 변경됐어요.`)
      }
    } catch {
      toast.error('네트워크 오류가 발생했습니다.')
    }
    setLoading(false)
  }

  async function handleChange(newStatus: string) {
    if (newStatus === status) return
    // 배송 시작 시 운송장 입력 모달
    if (newStatus === 'shipped') {
      setPendingStatus(newStatus)
      return
    }
    await doUpdate(newStatus)
  }

  async function confirmShipping() {
    await doUpdate('shipped', { trackingNumber, carrier })
    setPendingStatus(null)
    setTrackingNumber('')
  }

  return (
    <>
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value)}
        disabled={loading}
        className={`text-xs font-medium px-2.5 py-1.5 rounded-lg border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2d7a4f] disabled:opacity-50 ${statusColor[status] ?? 'bg-tint text-ink-4'}`}
      >
        {STATUSES.map((s) => (
          <option key={s} value={s} className="bg-surface text-ink">
            {statusLabel[s] ?? s}
          </option>
        ))}
      </select>

      {/* 운송장 입력 모달 */}
      {pendingStatus === 'shipped' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => setPendingStatus(null)}
        >
          <div
            className="bg-surface rounded-2xl border border-line p-6 w-full max-w-sm shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-4">
              <Truck size={18} className="text-blue-500" />
              <h3 className="font-bold text-ink">배송 시작</h3>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-ink-3 mb-1">택배사</label>
                <select
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  className="w-full px-3 py-2.5 border border-line-2 rounded-lg text-sm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f]"
                >
                  {['CJ대한통운', '롯데택배', '한진택배', '우체국택배', 'GS Postbox', 'KG로지스', '로젠택배'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-ink-3 mb-1">운송장 번호 (선택)</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="123456789012"
                  className="w-full px-3 py-2.5 border border-line-2 rounded-lg text-sm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f]"
                />
              </div>
            </div>
            <p className="text-xs text-ink-5 mt-3">
              배송 시작으로 변경 시 고객에게 이메일 알림이 발송됩니다.
            </p>
            <div className="flex gap-3 justify-end mt-5">
              <button
                onClick={() => setPendingStatus(null)}
                className="px-4 py-2 border border-line-2 rounded-xl text-sm text-ink-2 hover:bg-wash transition-colors"
              >
                취소
              </button>
              <button
                onClick={confirmShipping}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                배송 시작
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

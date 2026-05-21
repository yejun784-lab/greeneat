'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import { RefreshCw, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react'

type Order = {
  id: string
  total_price: number
  status: string
  payment_status: string
  created_at: string
  updated_at: string
  profiles: { name: string } | { name: string }[] | null
}

function getProfileName(profiles: Order['profiles']): string {
  if (!profiles) return '회원'
  if (Array.isArray(profiles)) return profiles[0]?.name ?? '회원'
  return profiles.name ?? '회원'
}

const REFUND_STATUS_LABEL: Record<string, string> = {
  cancelled: '환불 대기',
  refunded: '환불 완료',
}

export default function AdminRefundsPage() {
  const supabase = createClient()

  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const [processing, setProcessing] = useState<string | null>(null)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
      if (profile?.role !== 'admin') { window.location.href = '/'; return }
      setAuthChecked(true)
    }
    checkAuth()
  }, [])

  useEffect(() => {
    if (!authChecked) return
    fetchOrders()
  }, [authChecked])

  async function fetchOrders() {
    setLoading(true)
    // 결제됐는데 취소된 주문 (환불 대기) + 이미 환불 처리된 주문
    const { data } = await supabase
      .from('orders')
      .select('id, total_price, status, payment_status, created_at, updated_at, profiles(name)')
      .eq('status', 'cancelled')
      .in('payment_status', ['paid', 'refunded'])
      .order('updated_at', { ascending: false })
      .limit(100)
    setOrders((data ?? []) as Order[])
    setLoading(false)
  }

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }

  async function handleRefund(orderId: string) {
    setProcessing(orderId)
    const { error } = await supabase
      .from('orders')
      .update({ payment_status: 'refunded' })
      .eq('id', orderId)
    if (error) {
      showToast('error', '환불 처리에 실패했습니다.')
    } else {
      setOrders((prev) =>
        prev.map((o) => o.id === orderId ? { ...o, payment_status: 'refunded' } : o)
      )
      showToast('success', '환불 처리가 완료됐습니다.')
    }
    setProcessing(null)
  }

  const pendingRefunds = orders.filter((o) => o.payment_status === 'paid')
  const completedRefunds = orders.filter((o) => o.payment_status === 'refunded')

  if (!authChecked || loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="h-7 w-48 bg-line-2 rounded animate-pulse mb-4" />
        <div className="h-4 w-32 bg-line-2 rounded animate-pulse mb-8" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface rounded-2xl border border-line p-5 mb-3 h-16 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* 토스트 */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium ${
          toast.type === 'success' ? 'bg-[#2d7a4f] text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ink">환불·교환 관리</h1>
          <p className="text-sm text-ink-4 mt-1">
            환불 대기 {pendingRefunds.length}건 · 환불 완료 {completedRefunds.length}건
          </p>
        </div>
        <a href="/admin" className="text-sm text-[#2d7a4f] hover:underline">← 대시보드</a>
      </div>

      {/* 환불 대기 */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={16} className="text-orange-500" />
          <h2 className="font-semibold text-ink">환불 대기</h2>
          {pendingRefunds.length > 0 && (
            <span className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full font-medium">
              {pendingRefunds.length}건
            </span>
          )}
        </div>

        {pendingRefunds.length === 0 ? (
          <div className="bg-surface rounded-2xl border border-line p-10 text-center text-sm text-ink-5">
            환불 대기 중인 주문이 없습니다.
          </div>
        ) : (
          <div className="bg-surface rounded-2xl border border-line overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-wash border-b border-line">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">주문번호</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">고객</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">금액</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">취소일</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">환불 상태</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">처리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {pendingRefunds.map((order) => (
                    <tr key={order.id} className="hover:bg-wash/50">
                      <td className="px-4 py-3 font-mono text-xs text-ink-4">{order.id.slice(0, 8)}…</td>
                      <td className="px-4 py-3 font-medium text-ink">{getProfileName(order.profiles)}</td>
                      <td className="px-4 py-3 font-semibold text-ink">{formatPrice(order.total_price)}</td>
                      <td className="px-4 py-3 text-xs text-ink-5">
                        {new Date(order.updated_at).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-orange-50 text-orange-600">
                          환불 대기
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleRefund(order.id)}
                          disabled={processing === order.id}
                          className="text-xs bg-[#2d7a4f] text-white px-3 py-1.5 rounded-lg hover:bg-[#245f3e] transition-colors disabled:opacity-50 flex items-center gap-1.5"
                        >
                          {processing === order.id ? (
                            <>
                              <RefreshCw size={12} className="animate-spin" />
                              처리 중…
                            </>
                          ) : (
                            <>
                              <CheckCircle2 size={12} />
                              환불 완료 처리
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* 환불 완료 */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 size={16} className="text-green-500" />
          <h2 className="font-semibold text-ink">환불 완료</h2>
          <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">{completedRefunds.length}건</span>
        </div>

        {completedRefunds.length === 0 ? (
          <div className="bg-surface rounded-2xl border border-line p-10 text-center text-sm text-ink-5">
            환불 완료 내역이 없습니다.
          </div>
        ) : (
          <div className="bg-surface rounded-2xl border border-line overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-wash border-b border-line">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">주문번호</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">고객</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">금액</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">취소일</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">환불 상태</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {completedRefunds.map((order) => (
                    <tr key={order.id} className="hover:bg-wash/50 opacity-75">
                      <td className="px-4 py-3 font-mono text-xs text-ink-4">{order.id.slice(0, 8)}…</td>
                      <td className="px-4 py-3 font-medium text-ink">{getProfileName(order.profiles)}</td>
                      <td className="px-4 py-3 font-semibold text-ink">{formatPrice(order.total_price)}</td>
                      <td className="px-4 py-3 text-xs text-ink-5">
                        {new Date(order.updated_at).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-600">
                          환불 완료
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

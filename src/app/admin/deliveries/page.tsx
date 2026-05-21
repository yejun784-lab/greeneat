'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import { Truck, Package, CheckCircle2, AlertCircle } from 'lucide-react'

type Order = {
  id: string
  total_price: number
  status: string
  created_at: string
  tracking_number: string | null
  carrier: string | null
  address_id: string | null
  profiles: { name: string } | { name: string }[] | null
  addresses: { address: string; detail: string | null } | null
}

const STATUS_LABEL: Record<string, string> = {
  confirmed: '주문 확인',
  preparing: '준비 중',
  shipped: '배송 중',
  delivered: '배송 완료',
}
const STATUS_COLOR: Record<string, string> = {
  confirmed: 'text-blue-600 bg-blue-50',
  preparing: 'text-purple-600 bg-purple-50',
  shipped: 'text-indigo-600 bg-indigo-50',
  delivered: 'text-green-600 bg-green-50',
}

const CARRIER_OPTIONS = [
  '대한통운',
  '우체국택배',
  '로젠택배',
  'CJ대한통운',
  '한진택배',
  '롯데택배',
  '경동택배',
]

function getProfileName(profiles: Order['profiles']): string {
  if (!profiles) return '회원'
  if (Array.isArray(profiles)) return profiles[0]?.name ?? '회원'
  return profiles.name ?? '회원'
}

export default function AdminDeliveriesPage() {
  const supabase = createClient()

  const [pendingOrders, setPendingOrders] = useState<Order[]>([])
  const [shippedOrders, setShippedOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [trackingInputs, setTrackingInputs] = useState<Record<string, { tracking_number: string; carrier: string }>>({})
  const [submitting, setSubmitting] = useState<string | null>(null)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [authChecked, setAuthChecked] = useState(false)

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
    const [{ data: pending }, { data: shipped }] = await Promise.all([
      supabase
        .from('orders')
        .select('id, total_price, status, created_at, tracking_number, carrier, address_id, profiles(name), addresses(address, detail)')
        .in('status', ['confirmed', 'preparing'])
        .order('created_at', { ascending: true }),
      supabase
        .from('orders')
        .select('id, total_price, status, created_at, tracking_number, carrier, address_id, profiles(name), addresses(address, detail)')
        .eq('status', 'shipped')
        .order('created_at', { ascending: false })
        .limit(50),
    ])
    setPendingOrders((pending ?? []) as unknown as Order[])
    setShippedOrders((shipped ?? []) as unknown as Order[])
    // initialise tracking input state for pending orders
    const inputs: Record<string, { tracking_number: string; carrier: string }> = {}
    for (const o of pending ?? []) {
      inputs[o.id] = { tracking_number: '', carrier: CARRIER_OPTIONS[0] }
    }
    setTrackingInputs(inputs)
    setLoading(false)
  }

  function showToast(type: 'success' | 'error', message: string) {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }

  async function handleShip(orderId: string) {
    const input = trackingInputs[orderId]
    if (!input?.tracking_number.trim()) {
      showToast('error', '운송장 번호를 입력해주세요.')
      return
    }
    setSubmitting(orderId)
    const { error } = await supabase
      .from('orders')
      .update({
        status: 'shipped',
        tracking_number: input.tracking_number.trim(),
        carrier: input.carrier,
      })
      .eq('id', orderId)
    if (error) {
      showToast('error', '배송 처리에 실패했습니다.')
    } else {
      showToast('success', '배송 처리가 완료됐습니다.')
      await fetchOrders()
    }
    setSubmitting(null)
  }

  if (!authChecked || loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="h-7 w-48 bg-line-2 rounded animate-pulse mb-4" />
        <div className="h-4 w-32 bg-line-2 rounded animate-pulse mb-8" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface rounded-2xl border border-line p-5 mb-4 h-20 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* 토스트 */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
          toast.type === 'success' ? 'bg-[#2d7a4f] text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {toast.message}
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ink">배송 관리</h1>
          <p className="text-sm text-ink-4 mt-1">출고 대기 {pendingOrders.length}건 · 배송 중 {shippedOrders.length}건</p>
        </div>
        <a href="/admin" className="text-sm text-[#2d7a4f] hover:underline">← 대시보드</a>
      </div>

      {/* 출고 대기 */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Package size={16} className="text-[#2d7a4f]" />
          <h2 className="font-semibold text-ink">출고 대기</h2>
          <span className="text-xs bg-yellow-50 text-yellow-600 px-2 py-0.5 rounded-full">{pendingOrders.length}건</span>
        </div>

        {pendingOrders.length === 0 ? (
          <div className="bg-surface rounded-2xl border border-line p-10 text-center text-sm text-ink-5">
            출고 대기 주문이 없습니다.
          </div>
        ) : (
          <div className="bg-surface rounded-2xl border border-line overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-wash border-b border-line">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">주문번호</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">고객</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">주소</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">금액</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">상태</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-ink-4 w-80">운송장 입력</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {pendingOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-wash/50">
                      <td className="px-4 py-3 font-mono text-xs text-ink-4">{order.id.slice(0, 8)}…</td>
                      <td className="px-4 py-3 font-medium text-ink">{getProfileName(order.profiles)}</td>
                      <td className="px-4 py-3 text-xs text-ink-4 max-w-[180px]">
                        {order.addresses
                          ? `${order.addresses.address}${order.addresses.detail ? ' ' + order.addresses.detail : ''}`
                          : '—'}
                      </td>
                      <td className="px-4 py-3 font-semibold text-ink">{formatPrice(order.total_price)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLOR[order.status] ?? 'bg-tint text-ink-4'}`}>
                          {STATUS_LABEL[order.status] ?? order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <select
                            value={trackingInputs[order.id]?.carrier ?? CARRIER_OPTIONS[0]}
                            onChange={(e) => setTrackingInputs((prev) => ({
                              ...prev,
                              [order.id]: { ...prev[order.id], carrier: e.target.value },
                            }))}
                            className="text-xs border border-line rounded-lg px-2 py-1.5 bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-[#2d7a4f]"
                          >
                            {CARRIER_OPTIONS.map((c) => (
                              <option key={c} value={c}>{c}</option>
                            ))}
                          </select>
                          <input
                            type="text"
                            placeholder="운송장 번호"
                            value={trackingInputs[order.id]?.tracking_number ?? ''}
                            onChange={(e) => setTrackingInputs((prev) => ({
                              ...prev,
                              [order.id]: { ...prev[order.id], tracking_number: e.target.value },
                            }))}
                            className="text-xs border border-line rounded-lg px-2 py-1.5 bg-surface text-ink focus:outline-none focus:ring-1 focus:ring-[#2d7a4f] w-32"
                          />
                          <button
                            onClick={() => handleShip(order.id)}
                            disabled={submitting === order.id}
                            className="text-xs bg-[#2d7a4f] text-white px-3 py-1.5 rounded-lg hover:bg-[#245f3e] transition-colors disabled:opacity-50 whitespace-nowrap"
                          >
                            {submitting === order.id ? '처리 중…' : '배송 처리'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* 배송 중 */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Truck size={16} className="text-indigo-500" />
          <h2 className="font-semibold text-ink">배송 중</h2>
          <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{shippedOrders.length}건</span>
        </div>

        {shippedOrders.length === 0 ? (
          <div className="bg-surface rounded-2xl border border-line p-10 text-center text-sm text-ink-5">
            배송 중인 주문이 없습니다.
          </div>
        ) : (
          <div className="bg-surface rounded-2xl border border-line overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-wash border-b border-line">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">주문번호</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">고객</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">주소</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">금액</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">택배사</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">운송장</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">날짜</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {shippedOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-wash/50">
                      <td className="px-4 py-3 font-mono text-xs text-ink-4">{order.id.slice(0, 8)}…</td>
                      <td className="px-4 py-3 font-medium text-ink">{getProfileName(order.profiles)}</td>
                      <td className="px-4 py-3 text-xs text-ink-4 max-w-[180px] truncate">
                        {order.addresses
                          ? `${order.addresses.address}${order.addresses.detail ? ' ' + order.addresses.detail : ''}`
                          : '—'}
                      </td>
                      <td className="px-4 py-3 font-semibold text-ink">{formatPrice(order.total_price)}</td>
                      <td className="px-4 py-3 text-xs text-ink-4">{order.carrier ?? '—'}</td>
                      <td className="px-4 py-3 font-mono text-xs text-ink">{order.tracking_number ?? '—'}</td>
                      <td className="px-4 py-3 text-xs text-ink-5">
                        {new Date(order.created_at).toLocaleDateString('ko-KR')}
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

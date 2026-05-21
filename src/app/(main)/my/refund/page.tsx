'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ChevronLeft, CheckCircle2 } from 'lucide-react'

type OrderItem = {
  id: string
  order_id: string
  quantity: number
  price_at_purchase: number
  products: { name: string; image_url: string | null } | null
}

type Order = {
  id: string
  created_at: string
  status: string
  order_items: OrderItem[]
}

const REFUND_REASONS = [
  { value: 'change_of_mind', label: '단순 변심' },
  { value: 'defective', label: '상품 불량' },
  { value: 'wrong_delivery', label: '오배송' },
  { value: 'other', label: '기타' },
]

export default function RefundPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [selectedOrderId, setSelectedOrderId] = useState('')
  const [selectedItemId, setSelectedItemId] = useState('')
  const [type, setType] = useState<'refund' | 'exchange'>('refund')
  const [reason, setReason] = useState('')
  const [detail, setDetail] = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

      const { data } = await supabase
        .from('orders')
        .select('id, created_at, status, order_items(id, order_id, quantity, price_at_purchase, products(name, image_url))')
        .eq('user_id', user.id)
        .eq('status', 'delivered')
        .gte('created_at', thirtyDaysAgo)
        .order('created_at', { ascending: false })

      setOrders((data ?? []) as Order[])
      setLoading(false)
    }
    load()
  }, [router])

  const selectedOrder = orders.find((o) => o.id === selectedOrderId)
  const selectedItems = selectedOrder?.order_items ?? []

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedOrderId || !selectedItemId || !reason) {
      setError('모든 필수 항목을 선택해 주세요.')
      return
    }
    setSubmitting(true)
    setError(null)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { error: insertError } = await supabase.from('refund_requests').insert({
      user_id: user.id,
      order_id: selectedOrderId,
      order_item_id: selectedItemId,
      type,
      reason,
      detail: detail.trim() || null,
      status: 'pending',
    })

    if (insertError) {
      setError('신청 중 오류가 발생했습니다. 다시 시도해 주세요.')
      setSubmitting(false)
      return
    }

    setSubmitted(true)
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="h-8 w-48 bg-line-2 rounded animate-pulse mb-8" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-line-2 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex flex-col items-center justify-center py-20 gap-5">
          <div className="w-16 h-16 rounded-full bg-green-tint flex items-center justify-center">
            <CheckCircle2 size={36} className="text-[#2d7a4f]" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold text-ink">신청이 완료되었습니다</h2>
            <p className="text-sm text-ink-4 mt-2">
              영업일 기준 1~2일 이내 처리 현황을 이메일로 안내드립니다.
            </p>
          </div>
          <div className="flex gap-3 mt-2">
            <Link
              href="/my/orders"
              className="px-5 py-2.5 rounded-xl border border-line text-sm font-medium text-ink hover:bg-wash transition-colors"
            >
              주문 내역 보기
            </Link>
            <Link
              href="/my"
              className="px-5 py-2.5 rounded-xl bg-[#2d7a4f] text-white text-sm font-medium hover:bg-[#246040] transition-colors"
            >
              마이페이지
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-2 mb-8">
        <Link href="/my" className="p-1 text-ink-4 hover:text-ink-2 transition-colors">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-ink">반품·교환 신청</h1>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-24 bg-surface rounded-2xl border border-line">
          <p className="text-ink-4 text-sm">최근 30일 이내 배송 완료된 주문이 없습니다.</p>
          <Link href="/products" className="mt-3 inline-block text-sm text-[#2d7a4f] hover:underline">
            밀키트 둘러보기 →
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 주문 선택 */}
          <div className="bg-surface rounded-2xl border border-line p-5">
            <label className="block text-sm font-semibold text-ink mb-3">주문 선택 *</label>
            <div className="space-y-2">
              {orders.map((order) => {
                const itemNames = order.order_items.map((i) => i.products?.name ?? '상품').join(', ')
                const date = new Date(order.created_at).toLocaleDateString('ko-KR')
                return (
                  <label
                    key={order.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      selectedOrderId === order.id
                        ? 'border-[#2d7a4f] bg-green-tint'
                        : 'border-line hover:border-[#2d7a4f]/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="order"
                      value={order.id}
                      checked={selectedOrderId === order.id}
                      onChange={() => { setSelectedOrderId(order.id); setSelectedItemId('') }}
                      className="mt-0.5 accent-[#2d7a4f]"
                    />
                    <div>
                      <p className="text-sm font-medium text-ink line-clamp-1">{itemNames}</p>
                      <p className="text-xs text-ink-5 mt-0.5">{date} 배송 완료</p>
                    </div>
                  </label>
                )
              })}
            </div>
          </div>

          {/* 상품 선택 */}
          {selectedItems.length > 0 && (
            <div className="bg-surface rounded-2xl border border-line p-5">
              <label className="block text-sm font-semibold text-ink mb-3">상품 선택 *</label>
              <div className="space-y-2">
                {selectedItems.map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      selectedItemId === item.id
                        ? 'border-[#2d7a4f] bg-green-tint'
                        : 'border-line hover:border-[#2d7a4f]/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="item"
                      value={item.id}
                      checked={selectedItemId === item.id}
                      onChange={() => setSelectedItemId(item.id)}
                      className="accent-[#2d7a4f]"
                    />
                    <span className="text-sm text-ink">
                      {item.products?.name ?? '상품'} × {item.quantity}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* 신청 유형 */}
          <div className="bg-surface rounded-2xl border border-line p-5">
            <label className="block text-sm font-semibold text-ink mb-3">신청 유형 *</label>
            <div className="flex gap-3">
              {(['refund', 'exchange'] as const).map((t) => (
                <label
                  key={t}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border cursor-pointer text-sm font-medium transition-colors ${
                    type === t
                      ? 'border-[#2d7a4f] bg-green-tint text-[#2d7a4f]'
                      : 'border-line text-ink-3 hover:border-[#2d7a4f]/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={t}
                    checked={type === t}
                    onChange={() => setType(t)}
                    className="sr-only"
                  />
                  {t === 'refund' ? '반품 (환불)' : '교환'}
                </label>
              ))}
            </div>
          </div>

          {/* 사유 선택 */}
          <div className="bg-surface rounded-2xl border border-line p-5">
            <label className="block text-sm font-semibold text-ink mb-3">사유 선택 *</label>
            <div className="grid grid-cols-2 gap-2">
              {REFUND_REASONS.map((r) => (
                <label
                  key={r.value}
                  className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer text-sm transition-colors ${
                    reason === r.value
                      ? 'border-[#2d7a4f] bg-green-tint text-[#2d7a4f] font-medium'
                      : 'border-line text-ink-3 hover:border-[#2d7a4f]/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={r.value}
                    checked={reason === r.value}
                    onChange={() => setReason(r.value)}
                    className="accent-[#2d7a4f]"
                  />
                  {r.label}
                </label>
              ))}
            </div>
          </div>

          {/* 상세 내용 */}
          <div className="bg-surface rounded-2xl border border-line p-5">
            <label className="block text-sm font-semibold text-ink mb-3">
              상세 내용 <span className="font-normal text-ink-5">(선택)</span>
            </label>
            <textarea
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="추가로 전달할 내용을 입력해 주세요."
              rows={4}
              className="w-full px-3 py-2.5 border border-line-2 rounded-lg text-sm bg-surface text-ink placeholder-ink-5 focus:outline-none focus:ring-2 focus:ring-[#2d7a4f] focus:border-transparent resize-none"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">{error}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-[#2d7a4f] text-white rounded-xl text-sm font-semibold hover:bg-[#246040] disabled:opacity-60 transition-colors"
          >
            {submitting ? '제출 중...' : '신청하기'}
          </button>
        </form>
      )}
    </div>
  )
}

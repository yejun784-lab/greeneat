'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/lib/toast-store'
import { formatPrice, SUBSCRIPTION_PLAN_LABEL } from '@/lib/utils'
import { ChevronLeft, RefreshCw, Plus, X, Loader2, Check } from 'lucide-react'

type SubProduct = {
  id: string
  name: string
  price: number
  image_url: string | null
  calories: number | null
  protein: number | null
}

type Subscription = {
  id: string
  plan_type: string
  status: string
  delivery_day: number
  next_delivery_at: string | null
  subscription_items?: { product_id: string; products: SubProduct | null }[]
}

const DAY_LABELS: Record<number, string> = { 1: '월', 2: '화', 3: '수', 4: '목', 5: '금', 6: '토', 0: '일' }

export default function SubscriptionManagePage() {
  const router = useRouter()
  const [sub, setSub]           = useState<Subscription | null>(null)
  const [allProducts, setAllProducts] = useState<SubProduct[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [deliveryDay, setDeliveryDay] = useState<number>(1)
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState<'items' | 'day' | null>(null)
  const [showPicker, setShowPicker] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const [{ data: subData }, { data: products }] = await Promise.all([
      supabase
        .from('subscriptions')
        .select('*, subscription_items(product_id, products(id, name, price, image_url, calories, protein))')
        .eq('user_id', user.id)
        .in('status', ['active', 'paused'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from('products')
        .select('id, name, price, image_url, calories, protein')
        .eq('is_subscription', true)
        .eq('is_active', true)
        .gt('stock', 0)
        .order('name'),
    ])

    setSub(subData as Subscription | null)
    setAllProducts((products ?? []) as SubProduct[])
    if (subData) {
      const items = (subData.subscription_items ?? []) as { product_id: string }[]
      setSelectedIds(items.map((i) => i.product_id))
      setDeliveryDay(subData.delivery_day)
    }
    setLoading(false)
  }

  function toggleProduct(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  async function saveItems() {
    if (!sub) return
    setSaving('items')
    const res = await fetch('/api/subscriptions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_items', subscription_id: sub.id, product_ids: selectedIds }),
    })
    setSaving(null)
    if (res.ok) {
      toast.success('구독 메뉴가 변경됐어요!')
      await load()
    } else {
      toast.error('변경에 실패했어요.')
    }
  }

  async function saveDeliveryDay() {
    if (!sub) return
    setSaving('day')
    const res = await fetch('/api/subscriptions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_delivery_day', subscription_id: sub.id, delivery_day: deliveryDay }),
    })
    setSaving(null)
    if (res.ok) {
      toast.success('배송 요일이 변경됐어요!')
      await load()
    } else {
      toast.error('변경에 실패했어요.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={28} className="animate-spin text-[#2d7a4f]" />
      </div>
    )
  }

  if (!sub) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <RefreshCw size={40} className="mx-auto text-line-2 mb-4" />
        <p className="text-ink-4 mb-4">활성 구독이 없어요.</p>
        <Link href="/subscription" className="text-sm font-medium text-[#2d7a4f] hover:underline">
          구독 시작하기 →
        </Link>
      </div>
    )
  }

  const currentItems = (sub.subscription_items ?? [])
    .map((i) => i.products)
    .filter(Boolean) as SubProduct[]

  const itemsChanged =
    JSON.stringify([...selectedIds].sort()) !==
    JSON.stringify([...currentItems.map((p) => p.id)].sort())

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-8">
        <Link href="/my" className="p-1.5 text-ink-5 hover:text-ink-2">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-ink">구독 관리</h1>
          <p className="text-xs text-ink-5 mt-0.5">
            {SUBSCRIPTION_PLAN_LABEL[sub.plan_type] ?? sub.plan_type} 플랜 ·{' '}
            <span className={sub.status === 'active' ? 'text-[#2d7a4f]' : 'text-yellow-500'}>
              {sub.status === 'active' ? '구독 중' : '일시 중지'}
            </span>
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* 배송 요일 변경 */}
        <div className="bg-surface rounded-2xl border border-line p-5">
          <h2 className="text-sm font-semibold text-ink mb-4">배송 요일</h2>
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4, 5].map((d) => (
              <button
                key={d}
                onClick={() => setDeliveryDay(d)}
                className={`w-10 h-10 rounded-full text-sm font-semibold transition-colors ${
                  deliveryDay === d
                    ? 'bg-[#2d7a4f] text-white'
                    : 'bg-tint text-ink-3 hover:bg-green-tint hover:text-[#2d7a4f]'
                }`}
              >
                {DAY_LABELS[d]}
              </button>
            ))}
          </div>
          {deliveryDay !== sub.delivery_day && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-line">
              <p className="text-xs text-ink-4">
                {DAY_LABELS[sub.delivery_day]}요일 → {DAY_LABELS[deliveryDay]}요일
              </p>
              <button
                onClick={saveDeliveryDay}
                disabled={saving !== null}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#2d7a4f] text-white text-xs font-semibold rounded-lg hover:bg-[#235f3d] transition-colors disabled:opacity-50"
              >
                {saving === 'day' ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                저장
              </button>
            </div>
          )}
        </div>

        {/* 현재 구독 메뉴 */}
        <div className="bg-surface rounded-2xl border border-line p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-ink">
              구독 메뉴 <span className="text-ink-5 font-normal">({selectedIds.length}개 선택)</span>
            </h2>
            <button
              onClick={() => setShowPicker((v) => !v)}
              className="flex items-center gap-1 text-xs text-[#2d7a4f] hover:underline font-medium"
            >
              <Plus size={12} />
              {showPicker ? '닫기' : '메뉴 변경'}
            </button>
          </div>

          {/* 현재 선택된 상품 */}
          {selectedIds.length === 0 ? (
            <p className="text-sm text-ink-5 text-center py-4">선택된 메뉴가 없어요.</p>
          ) : (
            <div className="space-y-2 mb-4">
              {allProducts
                .filter((p) => selectedIds.includes(p.id))
                .map((p) => (
                  <div key={p.id} className="flex items-center gap-3 bg-tint rounded-xl px-3 py-2.5">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-wash shrink-0">
                      {p.image_url && (
                        <Image src={p.image_url} alt={p.name} width={40} height={40} className="object-cover w-full h-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-ink truncate">{p.name}</p>
                      <p className="text-[10px] text-ink-5">{formatPrice(p.price)}</p>
                    </div>
                    <button
                      onClick={() => toggleProduct(p.id)}
                      className="p-1 text-ink-5 hover:text-red-400 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
            </div>
          )}

          {/* 상품 선택 피커 */}
          {showPicker && (
            <div className="border-t border-line pt-4 space-y-2 max-h-72 overflow-y-auto">
              <p className="text-xs text-ink-5 mb-3">구독 가능한 상품을 선택하세요</p>
              {allProducts.map((p) => {
                const selected = selectedIds.includes(p.id)
                return (
                  <button
                    key={p.id}
                    onClick={() => toggleProduct(p.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-colors ${
                      selected
                        ? 'border-[#2d7a4f] bg-green-tint'
                        : 'border-line-2 hover:border-[#2d7a4f]/40'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-wash shrink-0">
                      {p.image_url && (
                        <Image src={p.image_url} alt={p.name} width={40} height={40} className="object-cover w-full h-full" />
                      )}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-xs font-medium text-ink truncate">{p.name}</p>
                      <p className="text-[10px] text-ink-5">
                        {formatPrice(p.price)}
                        {p.calories && ` · ${p.calories}kcal`}
                      </p>
                    </div>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                      selected ? 'bg-[#2d7a4f] border-[#2d7a4f]' : 'border-line-2'
                    }`}>
                      {selected && <Check size={11} className="text-white" strokeWidth={3} />}
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {/* 저장 버튼 */}
          {itemsChanged && (
            <div className="mt-4 pt-4 border-t border-line flex items-center justify-between">
              <p className="text-xs text-ink-4">변경사항이 있어요</p>
              <button
                onClick={saveItems}
                disabled={saving !== null}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#2d7a4f] text-white text-xs font-semibold rounded-lg hover:bg-[#235f3d] transition-colors disabled:opacity-50"
              >
                {saving === 'items' ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                저장하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

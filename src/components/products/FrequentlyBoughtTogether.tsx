'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Plus, Loader2, PackagePlus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useCartStore } from '@/lib/cart-store'
import { formatPrice } from '@/lib/utils'
import { toast } from '@/lib/toast-store'
import type { Product } from '@/types'

/* ── 상품 썸네일 ── */
function ItemThumb({
  product, isMain, checked, onToggle,
}: { product: Product; isMain: boolean; checked: boolean; onToggle: () => void }) {
  return (
    <div
      role={isMain ? undefined : 'checkbox'}
      aria-checked={isMain ? true : checked}
      tabIndex={isMain ? -1 : 0}
      onClick={() => !isMain && onToggle()}
      onKeyDown={e => !isMain && (e.key === ' ' || e.key === 'Enter') && onToggle()}
      className={`relative w-[76px] h-[76px] rounded-xl overflow-hidden border-2 shrink-0 transition-all duration-200 ${
        isMain
          ? 'border-[#2d7a4f] cursor-default'
          : checked
          ? 'border-[#2d7a4f] cursor-pointer hover:opacity-90'
          : 'border-line opacity-45 cursor-pointer hover:opacity-70'
      }`}
    >
      {product.image_url ? (
        <Image src={product.image_url} alt={product.name} fill className="object-cover" sizes="76px" />
      ) : (
        <div className="w-full h-full bg-tint flex items-center justify-center text-lg">🍱</div>
      )}
      {isMain && (
        <div className="absolute inset-x-0 bottom-0 bg-[#2d7a4f]/80 text-white text-[8px] text-center py-0.5 font-bold tracking-wide">
          현재 상품
        </div>
      )}
      {!isMain && checked && (
        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#2d7a4f] flex items-center justify-center shadow">
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
            <path d="M1 3l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      )}
    </div>
  )
}

/* ── 메인 컴포넌트 ── */
export function FrequentlyBoughtTogether({
  productId,
  currentProduct,
}: {
  productId: string
  currentProduct?: Product | null
}) {
  const [coItems, setCoItems]   = useState<Product[]>([])
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [loading, setLoading]   = useState(true)
  const addItem = useCartStore(s => s.addItem)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const supabase = createClient()
      const since = new Date(Date.now() - 90 * 86400000).toISOString()

      /* 1. 이 상품이 포함된 주문 ID 수집 */
      const { data: orderRows } = await supabase
        .from('order_items')
        .select('order_id')
        .eq('product_id', productId)
        .gte('created_at', since)
        .limit(300)

      const orderIds = [...new Set((orderRows ?? []).map(r => String(r.order_id)))]
      if (orderIds.length === 0 || cancelled) { setLoading(false); return }

      /* 2. 동일 주문에 담긴 다른 상품 빈도 집계 */
      const { data: coRows } = await supabase
        .from('order_items')
        .select('product_id')
        .in('order_id', orderIds.slice(0, 150))
        .neq('product_id', productId)
        .gte('created_at', since)
        .limit(1000)

      const freq: Record<string, number> = {}
      for (const r of coRows ?? []) {
        const pid = String(r.product_id)
        freq[pid] = (freq[pid] ?? 0) + 1
      }

      const topIds = Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([id]) => id)

      if (topIds.length === 0 || cancelled) { setLoading(false); return }

      /* 3. 상품 상세 조회 */
      const { data: products } = await supabase
        .from('products')
        .select('id, name, price, image_url, calories, protein, stock, is_active, is_subscription, category_id, description, carbs, fat, servings, cook_time, difficulty, display_group, created_at')
        .in('id', topIds)
        .eq('is_active', true)

      if (!cancelled) {
        const sorted = (products ?? []).sort(
          (a, b) => (freq[String(b.id)] ?? 0) - (freq[String(a.id)] ?? 0)
        ) as Product[]
        setCoItems(sorted)
        setSelected(new Set(sorted.map(p => p.id)))
      }
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [productId])

  if (loading) return (
    <div className="mt-10 flex items-center gap-2 text-xs text-ink-5">
      <Loader2 size={12} className="animate-spin" /> 함께 구매 데이터 불러오는 중…
    </div>
  )
  if (coItems.length === 0) return null

  /* 전체 목록 (현재 상품 + 연관 상품) */
  const allItems: { product: Product; isMain: boolean }[] = [
    ...(currentProduct ? [{ product: currentProduct, isMain: true }] : []),
    ...coItems.map(p => ({ product: p, isMain: false })),
  ]

  const selectedProducts = allItems.filter(({ product, isMain }) => isMain || selected.has(product.id))
  const totalPrice = selectedProducts.reduce((s, { product }) => s + product.price, 0)

  function toggle(id: string) {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  function addSelected() {
    const toAdd = coItems.filter(p => selected.has(p.id))
    if (toAdd.length === 0) { toast.error('추가할 상품을 선택해 주세요.'); return }
    toAdd.forEach(p => addItem(p))
    toast.success(`${toAdd.length}가지 상품을 함께 담았어요! 🛒`)
  }

  return (
    <div className="mt-10">
      <div className="flex items-center gap-2 mb-4">
        <PackagePlus size={16} className="text-[#2d7a4f]" />
        <h3 className="font-semibold text-ink text-sm">함께 자주 구매하는 상품</h3>
      </div>

      {/* 썸네일 행 */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {allItems.map(({ product, isMain }, i) => (
          <div key={product.id} className="flex items-center gap-2">
            {i > 0 && <Plus size={14} className="text-ink-4 shrink-0" />}
            <ItemThumb
              product={product}
              isMain={isMain}
              checked={isMain || selected.has(product.id)}
              onToggle={() => toggle(product.id)}
            />
          </div>
        ))}
      </div>

      {/* 상품 리스트 */}
      <div className="space-y-2 mb-4">
        {allItems.map(({ product, isMain }) => (
          <label
            key={product.id}
            className={`flex items-center gap-2.5 text-xs transition-opacity ${
              !isMain && !selected.has(product.id) ? 'opacity-40' : ''
            }`}
          >
            <input
              type="checkbox"
              checked
              disabled={isMain}
              onChange={() => !isMain && toggle(product.id)}
              className="accent-[#2d7a4f] w-3.5 h-3.5 shrink-0"
            />
            <Link
              href={`/products/${product.id}`}
              className="flex-1 truncate text-ink hover:text-[#2d7a4f] transition-colors"
              onClick={e => e.stopPropagation()}
            >
              {product.name}
              {product.calories && (
                <span className="ml-1.5 text-ink-5">({product.calories}kcal)</span>
              )}
            </Link>
            <span className="font-semibold text-ink shrink-0">{formatPrice(product.price)}</span>
          </label>
        ))}
      </div>

      {/* 합계 + 담기 */}
      <div className="flex items-center gap-3 bg-tint rounded-2xl px-4 py-3">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] text-ink-5">
            {selectedProducts.length}가지 합계
            {currentProduct && <span className="text-ink-5"> (현재 상품 포함)</span>}
          </p>
          <p className="text-base font-black text-ink tracking-tight">
            {formatPrice(totalPrice)}
          </p>
        </div>
        <button
          onClick={addSelected}
          disabled={selected.size === 0}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#2d7a4f] text-white text-[13px] font-semibold rounded-xl hover:bg-[#235f3d] disabled:opacity-50 transition-colors shrink-0"
        >
          <ShoppingCart size={13} />
          함께 담기
        </button>
      </div>
    </div>
  )
}

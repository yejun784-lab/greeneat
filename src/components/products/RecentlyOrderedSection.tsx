'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { RotateCcw, ShoppingBag, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useCartStore } from '@/lib/cart-store'
import { useOrderedStore } from '@/lib/ordered-store'
import { formatPrice } from '@/lib/utils'
import { toast } from '@/lib/toast-store'
import type { Product } from '@/types'

function RecentlyOrderedCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem)
  const outOfStock = product.stock <= 0

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    if (outOfStock) { toast.error('품절된 상품입니다.'); return }
    addItem(product)
    toast.success(`${product.name}을(를) 담았어요 🛒`)
  }

  return (
    <div className="flex-none w-[116px]">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative w-[116px] h-[116px] rounded-2xl overflow-hidden bg-wash mb-2">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
              sizes="116px"
            />
          ) : (
            <div className="w-full h-full bg-[#f0faf4]" />
          )}
          {outOfStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white text-xs font-semibold">품절</span>
            </div>
          )}
        </div>
        <p className="text-[11px] font-medium text-ink line-clamp-2 leading-snug mb-1 min-h-[30px]">
          {product.name}
        </p>
        <p className="text-[12px] font-bold text-ink mb-2">{formatPrice(product.price)}</p>
      </Link>
      <button
        onClick={handleAdd}
        disabled={outOfStock}
        className={`w-full flex items-center justify-center gap-1 py-1.5 rounded-xl text-[11px] font-semibold transition-colors ${
          outOfStock
            ? 'bg-tint text-ink-5 cursor-not-allowed'
            : 'bg-[#2d7a4f] text-white hover:bg-[#235f3d]'
        }`}
      >
        <ShoppingBag size={10} />
        {outOfStock ? '품절' : '담기'}
      </button>
    </div>
  )
}

export function RecentlyOrderedSection() {
  const [products, setProducts] = useState<Product[]>([])
  const setIds = useOrderedStore((s) => s.setIds)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // 최근 결제 완료 주문 5건
      const { data: orders } = await supabase
        .from('orders')
        .select('id')
        .eq('user_id', user.id)
        .eq('payment_status', 'paid')
        .order('created_at', { ascending: false })
        .limit(5)

      const orderIds = (orders ?? []).map((o: { id: string }) => o.id)
      if (!orderIds.length) return

      // 주문한 product_id 수집
      const { data: items } = await supabase
        .from('order_items')
        .select('product_id')
        .in('order_id', orderIds)

      if (!items?.length) return

      // 중복 제거 (구매 순서 유지)
      const seen = new Set<string>()
      const productIds: string[] = []
      for (const item of items) {
        if (!seen.has(item.product_id)) {
          seen.add(item.product_id)
          productIds.push(item.product_id)
        }
      }

      // 전체 ordered store 업데이트 (카드 배지용)
      setIds(productIds)

      // 섹션에 표시할 최대 8개 상품 상세 fetch
      const { data: prods } = await supabase
        .from('products')
        .select('*, product_categories(id, name, slug, description)')
        .in('id', productIds.slice(0, 8))
        .eq('is_active', true)

      if (!prods?.length) return

      // 구매 순서대로 정렬
      const sorted = productIds
        .slice(0, 8)
        .map((id) => (prods as Product[]).find((p) => p.id === id))
        .filter(Boolean) as Product[]

      setProducts(sorted)
    }

    load()
  }, [setIds])

  if (products.length === 0) return null

  return (
    <div className="mb-8 bg-[#f8faf8] rounded-2xl p-4 border border-[#e8f5ee]">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#e8f5ee] flex items-center justify-center">
            <RotateCcw size={12} className="text-[#2d7a4f]" />
          </div>
          <span className="text-sm font-semibold text-ink">지난 주문 메뉴</span>
          <span className="text-[11px] text-ink-5 bg-surface px-1.5 py-0.5 rounded-full border border-line">
            {products.length}개
          </span>
        </div>
        <Link
          href="/my/orders"
          className="flex items-center gap-0.5 text-[11px] text-ink-4 hover:text-[#2d7a4f] transition-colors"
        >
          전체 주문 <ChevronRight size={11} />
        </Link>
      </div>

      {/* 가로 스크롤 */}
      <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {products.map((product) => (
          <RecentlyOrderedCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { X, Trash2 } from 'lucide-react'
import { useRecentlyViewedStore } from '@/lib/recently-viewed-store'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

export function RecentlyViewed() {
  const { items, remove, clear } = useRecentlyViewedStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted || items.length === 0) return null

  return (
    <section className="py-12 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-ink">최근 본 상품</h2>
        <button
          onClick={clear}
          className="flex items-center gap-1 text-xs text-ink-5 hover:text-red-400 transition-colors"
        >
          <Trash2 size={13} />
          전체 삭제
        </button>
      </div>

      {/* 상품 리스트 */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
        {items.map((product: Product) => (
          <div key={product.id} className="shrink-0 w-36 group relative">
            {/* 개별 삭제 버튼 */}
            <button
              onClick={(e) => {
                e.preventDefault()
                remove(product.id)
              }}
              className="absolute top-1.5 right-1.5 z-10 w-5 h-5 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="삭제"
            >
              <X size={10} />
            </button>

            <Link href={`/products/${product.id}`}>
              <div className="relative aspect-square rounded-xl overflow-hidden bg-tint mb-2">
                {product.image_url && (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="144px"
                  />
                )}
              </div>
              <p className="text-xs font-medium text-ink truncate">{product.name}</p>
              <p className="text-xs text-[#2d7a4f] font-semibold mt-0.5">{formatPrice(product.price)}</p>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

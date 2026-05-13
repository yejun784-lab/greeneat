'use client'

import { useRecentlyViewedStore } from '@/lib/recently-viewed-store'
import { ProductCard } from './ProductCard'

export function RecentlyViewed() {
  const items = useRecentlyViewedStore((s) => s.items)

  if (items.length === 0) return null

  return (
    <section className="py-12 border-t border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold text-ink mb-6">최근 본 상품</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} compact />
          ))}
        </div>
      </div>
    </section>
  )
}

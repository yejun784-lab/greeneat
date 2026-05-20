'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRecentlyViewedStore } from '@/lib/recently-viewed-store'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

export function RecentlyViewed() {
  const { items } = useRecentlyViewedStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted || items.length === 0) return null

  return (
    <section className="py-12 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
      <h2 className="text-lg font-semibold text-ink mb-5">최근 본 상품</h2>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {items.map((product: Product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            className="shrink-0 w-36 group"
          >
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
        ))}
      </div>
    </section>
  )
}
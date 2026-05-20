'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'

type Item = { id: string; name: string; price: number; image_url: string | null }

export function RelatedProducts({ categoryId, excludeId, productId }: { categoryId: string | null; excludeId?: string; productId?: string }) {
  excludeId = excludeId ?? productId ?? ''
  const [items, setItems] = useState<Item[]>([])

  useEffect(() => {
    if (!categoryId) return
    const supabase = createClient()
    supabase.from('products').select('id, name, price, image_url')
      .eq('category_id', categoryId).neq('id', excludeId).limit(4)
      .then(({ data }) => setItems((data ?? []) as Item[]))
  }, [categoryId, excludeId])

  if (!items.length) return null

  return (
    <div className="mt-12">
      <h3 className="font-semibold text-ink mb-4">관련 상품</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map((p) => (
          <Link key={p.id} href={`/products/${p.id}`} className="group">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-tint mb-2">
              {p.image_url && (
                <Image
                  src={p.image_url}
                  alt={p.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                  sizes="200px"
                />
              )}
            </div>
            <p className="text-xs font-medium text-ink truncate">{p.name}</p>
            <p className="text-xs text-[#2d7a4f] font-semibold">{formatPrice(p.price)}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

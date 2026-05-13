'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ProductCard } from '@/components/products/ProductCard'
import type { Product } from '@/types'

interface Props {
  productId: string
  categoryId: string | null | undefined
}

export function RelatedProducts({ productId, categoryId }: Props) {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    if (!categoryId) return
    const supabase = createClient()
    supabase
      .from('products')
      .select('*, product_categories(id, name, slug, description)')
      .eq('category_id', categoryId)
      .neq('id', productId)
      .limit(4)
      .then(({ data }) => {
        setProducts((data as Product[]) ?? [])
      })
  }, [productId, categoryId])

  if (products.length === 0) return null

  return (
    <section className="mt-16">
      <h2 className="text-xl font-bold text-ink mb-6">같은 카테고리 상품</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} compact />
        ))}
      </div>
    </section>
  )
}

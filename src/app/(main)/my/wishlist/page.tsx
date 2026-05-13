'use client'

import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useWishlistStore } from '@/lib/wishlist-store'
import { useWishlist } from '@/hooks/useWishlist'
import { ProductCard } from '@/components/products/ProductCard'
import type { Product } from '@/types'

export default function WishlistPage() {
  const ids = useWishlistStore((s) => s.ids)
  const { toggle } = useWishlist()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (ids.length === 0) { setLoading(false); return }
    const supabase = createClient()
    supabase
      .from('products')
      .select('*, product_categories(id, name, slug, description)')
      .in('id', ids)
      .then(({ data }) => {
        setProducts((data as Product[]) ?? [])
        setLoading(false)
      })
  }, [ids])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-[#2d7a4f] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Heart size={22} className="text-red-500" fill="currentColor" />
        <h1 className="text-2xl font-bold text-ink">찜 목록</h1>
        <span className="text-sm text-ink-5">({ids.length}개)</span>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-24">
          <Heart size={48} className="mx-auto text-line-2 mb-4" />
          <p className="text-ink-5 mb-2">찜한 상품이 없어요.</p>
          <p className="text-sm text-ink-5 mb-8">마음에 드는 밀키트에 ♥ 버튼을 눌러보세요!</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2d7a4f] text-white rounded-xl text-sm font-medium hover:bg-[#235f3d] transition-colors"
          >
            밀키트 둘러보기
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { Heart, Share2 } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useWishlistStore } from '@/lib/wishlist-store'
import { useWishlist } from '@/hooks/useWishlist'
import { ProductCard } from '@/components/products/ProductCard'
import { toast } from '@/lib/toast-store'
import type { Product } from '@/types'

function KakaoShareButton({ products }: { products: Product[] }) {
  function handleShare() {
    const text = products.slice(0, 3).map((p) => `• ${p.name} — ${p.price.toLocaleString()}원`).join('\n')
    const shareText = `🥗 GreenEat 찜 목록 (${products.length}개)\n\n${text}${products.length > 3 ? `\n...외 ${products.length - 3}개` : ''}\n\n👉 ${window.location.origin}/products`

    if (navigator.share) {
      navigator.share({ title: 'GreenEat 찜 목록', text: shareText, url: window.location.origin + '/products' }).catch(() => {})
      return
    }
    navigator.clipboard.writeText(shareText).then(() => {
      toast.success('찜 목록이 클립보드에 복사됐어요! 🔗')
    }).catch(() => toast.error('복사에 실패했어요.'))
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2 bg-[#FEE500] text-[#3C1E1E] rounded-xl text-sm font-semibold hover:bg-[#F0D900] transition-colors"
    >
      <Share2 size={15} />
      공유하기
    </button>
  )
}

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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Heart size={22} className="text-red-500" fill="currentColor" />
          <h1 className="text-2xl font-bold text-ink">찜 목록</h1>
          <span className="text-sm text-ink-5">({ids.length}개)</span>
        </div>
        {products.length > 0 && <KakaoShareButton products={products} />}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-24">
          <Heart size={48} className="mx-auto text-line-2 mb-4" />
          <p className="text-ink-5 mb-2">찜한 상품이 없어요.</p>
          <p className="text-sm text-ink-5 mb-8">마음에 드는 도시락에 ♥ 버튼을 눌러보세요!</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2d7a4f] text-white rounded-xl text-sm font-medium hover:bg-[#235f3d] transition-colors"
          >
            도시락 둘러보기
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

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Plus, Heart, GitCompare } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import { useWishlist } from '@/hooks/useWishlist'
import { useWishlistStore } from '@/lib/wishlist-store'
import { useCompareStore } from '@/lib/compare-store'
import { formatPrice } from '@/lib/utils'
import { NutritionBadge } from './NutritionBadge'
import { toast } from '@/lib/toast-store'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  compact?: boolean
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem)
  const { toggle } = useWishlist()
  const wished = useWishlistStore((s) => s.has(product.id))
  const { add: addCompare, remove: removeCompare, has: inCompare } = useCompareStore()
  const compared = inCompare(product.id)

  const outOfStock = product.stock <= 0

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    if (outOfStock) {
      toast.error('품절된 상품입니다.')
      return
    }
    addItem(product)
    toast.success(`${product.name}이(가) 장바구니에 담겼습니다. 🛒`)
  }

  function handleWish(e: React.MouseEvent) {
    e.preventDefault()
    toggle(product.id)
  }

  function handleCompare(e: React.MouseEvent) {
    e.preventDefault()
    if (compared) {
      removeCompare(product.id)
    } else {
      const store = useCompareStore.getState()
      if (store.items.length >= 3) {
        toast.error('최대 3개까지 비교할 수 있습니다.')
        return
      }
      addCompare(product)
    }
  }

  return (
    <div className="group bg-surface rounded-2xl border border-line shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* 이미지 */}
      <Link href={`/products/${product.id}`} className="block">
        <div className={`relative ${compact ? 'aspect-square' : 'aspect-[4/3]'} bg-wash overflow-hidden`}>
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
            />
          ) : (
            <div className="w-full h-full bg-tint flex items-center justify-center">
              <span className="text-ink-5 text-sm">이미지 없음</span>
            </div>
          )}
          {outOfStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-black/70 text-white text-sm font-bold px-3 py-1 rounded-full">품절</span>
            </div>
          )}
          {!outOfStock && product.stock < 10 && (
            <span className="absolute bottom-2 left-2 bg-orange-500 text-white text-xs font-medium px-2 py-0.5 rounded-full">
              잔여 {product.stock}개
            </span>
          )}
          {product.is_subscription && !outOfStock && (
            <span className="absolute top-2 left-2 bg-[#2d7a4f] text-white text-xs font-medium px-2 py-1 rounded-full">
              구독 가능
            </span>
          )}
          {/* 찜 버튼 */}
          <button
            onClick={handleWish}
            className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-sm transition-all ${
              wished ? 'bg-red-500 text-white' : 'bg-surface/80 text-ink-5 hover:text-red-400'
            }`}
            aria-label={wished ? '찜 취소' : '찜하기'}
          >
            <Heart size={13} fill={wished ? 'currentColor' : 'none'} />
          </button>
          {/* 비교 버튼 */}
          {!compact && (
            <button
              onClick={handleCompare}
              className={`absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center shadow-sm transition-all ${
                compared ? 'bg-[#2d7a4f] text-white' : 'bg-surface/80 text-ink-5 hover:text-[#2d7a4f]'
              }`}
              aria-label={compared ? '비교 제거' : '비교 추가'}
              title={compared ? '비교 제거' : '비교에 추가'}
            >
              <GitCompare size={13} />
            </button>
          )}
        </div>
      </Link>

      {/* 정보 */}
      <div className={compact ? 'p-3' : 'p-4'}>
        <Link href={`/products/${product.id}`}>
          <h3 className={`font-semibold text-ink mb-1 hover:text-[#2d7a4f] transition-colors line-clamp-1 ${compact ? 'text-sm' : ''}`}>
            {product.name}
          </h3>
          {!compact && product.description && (
            <p className="text-xs text-ink-4 mb-2 line-clamp-2">{product.description}</p>
          )}
        </Link>

        {!compact && <NutritionBadge product={product} />}

        <div className={`flex items-center justify-between ${compact ? '' : 'mt-3'}`}>
          <span className={`font-bold text-ink ${compact ? 'text-sm' : 'text-base'}`}>
            {formatPrice(product.price)}
          </span>
          <button
            onClick={handleAdd}
            disabled={outOfStock}
            aria-label={outOfStock ? '품절' : `${product.name} 장바구니에 담기`}
            className={`flex items-center gap-1 font-medium rounded-lg transition-colors ${compact ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'} ${
              outOfStock
                ? 'bg-tint text-ink-5 cursor-not-allowed'
                : 'bg-[#2d7a4f] text-white hover:bg-[#235f3d]'
            }`}
          >
            <Plus size={compact ? 12 : 14} />
            {outOfStock ? '품절' : '담기'}
          </button>
        </div>
      </div>
    </div>
  )
}

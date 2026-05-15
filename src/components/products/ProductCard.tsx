'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag, Zap, Leaf, Dumbbell, Users } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import { useWishlist } from '@/hooks/useWishlist'
import { useWishlistStore } from '@/lib/wishlist-store'
import { formatPrice } from '@/lib/utils'
import { toast } from '@/lib/toast-store'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  compact?: boolean
}

type Highlight = { label: string; Icon: React.ElementType; className: string }

function getHighlight(p: Product): Highlight | null {
  if (p.calories && p.calories < 350)
    return { label: `${p.calories} kcal`, Icon: Leaf,     className: 'bg-emerald-50 text-emerald-600' }
  if (p.protein  && p.protein >= 30)
    return { label: `단백질 ${p.protein}g`, Icon: Dumbbell, className: 'bg-blue-50 text-blue-500' }
  if (p.cook_time && p.cook_time <= 3)
    return { label: `${p.cook_time}분 완성`, Icon: Zap,      className: 'bg-amber-50 text-amber-500' }
  if (p.servings  && p.servings >= 2)
    return { label: `${p.servings}인분`,    Icon: Users,    className: 'bg-purple-50 text-purple-500' }
  return null
}

export function ProductCard({ product, compact = false }: ProductCardProps) {
  const addItem    = useCartStore((s) => s.addItem)
  const { toggle } = useWishlist()
  const wished     = useWishlistStore((s) => s.has(product.id))
  const outOfStock = product.stock <= 0
  const highlight  = compact ? null : getHighlight(product)

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    if (outOfStock) { toast.error('품절된 상품입니다.'); return }
    addItem(product)
    toast.success('장바구니에 담았어요 🛒')
  }

  function handleWish(e: React.MouseEvent) {
    e.preventDefault()
    toggle(product.id)
  }

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-[#f0f0ee] shadow-sm hover:shadow-md transition-shadow duration-200">

      {/* 이미지 */}
      <div className="relative">
        <Link href={`/products/${product.id}`} className="block">
          <div className="relative aspect-square overflow-hidden bg-tint">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-ink-5">🍽</div>
            )}

            {/* 품절 */}
            {outOfStock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white text-sm font-semibold">품절</span>
              </div>
            )}

            {/* 구독 / 잔여 뱃지 */}
            {!outOfStock && product.stock < 10 && (
              <span className="absolute top-2.5 left-2.5 bg-[#e8734a] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                잔여 {product.stock}개
              </span>
            )}
            {product.is_subscription && !outOfStock && product.stock >= 10 && (
              <span className="absolute top-2.5 left-2.5 bg-[#2d7a4f]/85 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                구독
              </span>
            )}

            {/* hover 담기 */}
            {!outOfStock && (
              <div className="absolute inset-x-3 bottom-3 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out pointer-events-none group-hover:pointer-events-auto">
                <button
                  onClick={handleAdd}
                  className="w-full flex items-center justify-center gap-1.5 bg-white/95 backdrop-blur-sm text-ink font-semibold text-[13px] py-2.5 rounded-xl shadow-md hover:bg-white transition-colors"
                >
                  <ShoppingBag size={13} />
                  담기
                </button>
              </div>
            )}
          </div>
        </Link>

        {/* 찜 버튼 */}
        <button
          onClick={handleWish}
          aria-label={wished ? '찜 취소' : '찜하기'}
          className={`absolute top-2.5 right-2.5 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
            wished
              ? 'bg-white text-red-500 shadow-sm'
              : 'bg-black/15 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100'
          }`}
        >
          <Heart size={12} fill={wished ? 'currentColor' : 'none'} strokeWidth={wished ? 0 : 2} />
        </button>
      </div>

      {/* 텍스트 — 고정 높이로 카드 통일 */}
      <Link href={`/products/${product.id}`} className="block px-3.5 pt-3 pb-3.5">

        <h3 className={`font-medium text-ink leading-snug tracking-tight line-clamp-1 ${compact ? 'text-sm' : 'text-[13px]'}`}>
          {product.name}
        </h3>

        {/* 뱃지 슬롯 — 없어도 동일한 높이 유지 */}
        {!compact && (
          <div className="mt-1.5 h-[20px] flex items-center">
            {highlight && (
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${highlight.className}`}>
                <highlight.Icon size={9} />
                {highlight.label}
              </div>
            )}
          </div>
        )}

        <p className={`font-bold text-ink tracking-tight mt-1 ${compact ? 'text-sm' : 'text-[14px]'}`}>
          {formatPrice(product.price)}
        </p>

      </Link>
    </div>
  )
}

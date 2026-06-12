'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag, Zap, Leaf, Dumbbell, Users, GitCompareArrows, RotateCcw } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import { useWishlist } from '@/hooks/useWishlist'
import { useWishlistStore } from '@/lib/wishlist-store'
import { useCompareStore } from '@/components/products/CompareTray'
import { useOrderedStore } from '@/lib/ordered-store'
import { formatPrice } from '@/lib/utils'
import { toast } from '@/lib/toast-store'
import { GreeniAvatar } from '@/components/mascot/GreeniAvatar'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  compact?: boolean
  priority?: boolean
}

type Highlight = { label: string; Icon: React.ElementType; className: string }

function getHighlight(p: Product): Highlight | null {
  if (p.calories && p.calories < 350)
    return { label: `${p.calories} kcal`, Icon: Leaf,     className: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' }
  if (p.protein  && p.protein >= 30)
    return { label: `단백질 ${p.protein}g`, Icon: Dumbbell, className: 'bg-blue-50 dark:bg-blue-950/40 text-blue-500 dark:text-blue-400' }
  if (p.cook_time && p.cook_time <= 3)
    return { label: `${p.cook_time}분 완성`, Icon: Zap,      className: 'bg-amber-50 dark:bg-amber-950/40 text-amber-500 dark:text-amber-400' }
  if (p.servings  && p.servings >= 2)
    return { label: `${p.servings}인분`,    Icon: Users,    className: 'bg-purple-50 dark:bg-purple-950/40 text-purple-500 dark:text-purple-400' }
  return null
}

function isNewProduct(createdAt?: string | null): boolean {
  if (!createdAt) return false
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
  return new Date(createdAt).getTime() >= sevenDaysAgo
}

/* 탄소발자국 추정 — 상품명/카테고리 키워드 기반 */
function isEcoFriendly(product: Product): boolean {
  const text = `${product.name} ${product.description ?? ''} ${(product as any).product_categories?.name ?? ''}`.toLowerCase()
  const ecoKeywords = ['샐러드', '채소', '그래놀라', '비건', '두부', '콩', '견과', '현미', '통곡물', '귀리', '퀴노아', '렌틸']
  return ecoKeywords.some(k => text.includes(k))
}

export function ProductCard({ product, compact = false, priority = false }: ProductCardProps) {
  const addItem      = useCartStore((s) => s.addItem)
  const { toggle }   = useWishlist()
  const wished       = useWishlistStore((s) => s.has(product.id))
  const { add: addCompare, remove: removeCompare, has: inCompare } = useCompareStore()
  const ordered      = useOrderedStore((s) => s.ids.has(product.id))
  const compared     = inCompare(product.id)
  const outOfStock   = product.stock <= 0
  const highlight    = compact ? null : getHighlight(product)
  const isNew        = isNewProduct((product as any).created_at)
  const isEco        = !compact && isEcoFriendly(product)

  // 하트 팝 애니메이션 트리거
  const [heartPop, setHeartPop] = React.useState(false)

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    if (outOfStock) { toast.error('품절된 상품입니다.'); return }
    addItem(product)
    toast.success('장바구니에 담았어요 🛒')
  }

  function handleWish(e: React.MouseEvent) {
    e.preventDefault()
    toggle(product.id)
    setHeartPop(true)
    setTimeout(() => setHeartPop(false), 420)
  }

  function handleCompare(e: React.MouseEvent) {
    e.preventDefault()
    if (compared) {
      removeCompare(product.id)
    } else {
      const store = useCompareStore.getState()
      if (store.items.length >= 3) { toast.error('최대 3개까지 비교할 수 있어요.'); return }
      addCompare({ id: product.id, name: product.name })
    }
  }

  return (
    <div className="group bg-surface rounded-2xl overflow-hidden border border-line shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 ease-out">

      {/* 이미지 */}
      <div className="relative">
        <Link href={`/products/${product.id}`} className="block">
          <div className="relative aspect-square overflow-hidden bg-[#f5f5f3]">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                priority={priority}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-[#f0faf4]">
                <GreeniAvatar size={56} />
                <span className="text-[11px] text-[#2d7a4f]/60 font-medium">준비 중</span>
              </div>
            )}

            {/* 품절 */}
            {outOfStock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white text-sm font-semibold">품절</span>
              </div>
            )}

            {/* NEW 뱃지 — 7일 이내 신상품 */}
            {isNew && !outOfStock && (
              <span className="absolute top-2.5 left-2.5 z-10 bg-[#2d7a4f] text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide shadow-sm">
                NEW
              </span>
            )}

            {/* 구독 / 잔여 뱃지 */}
            {!outOfStock && product.stock < 10 && (
              <span className={`absolute text-white text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#e8734a] ${isNew ? 'top-2.5 left-[52px]' : 'top-2.5 left-2.5'}`}>
                잔여 {product.stock}개
              </span>
            )}
            {product.is_subscription && !outOfStock && product.stock >= 10 && !isNew && (
              <span className="absolute top-2.5 left-2.5 bg-[#2d7a4f]/85 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                구독
              </span>
            )}

            {/* 재주문 배지 — 이미 주문한 적 있는 상품 */}
            {ordered && !outOfStock && (
              <span className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-0.5 bg-surface/90 backdrop-blur-sm text-[#2d7a4f] text-[10px] font-semibold px-1.5 py-0.5 rounded-full shadow-sm">
                <RotateCcw size={8} />
                재주문
              </span>
            )}

            {/* hover 담기 */}
            {!outOfStock && (
              <div className="absolute inset-x-3 bottom-3 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out pointer-events-none group-hover:pointer-events-auto">
                <button
                  onClick={handleAdd}
                  className="w-full flex items-center justify-center gap-1.5 bg-surface/95 backdrop-blur-sm text-ink font-semibold text-[13px] py-2.5 rounded-xl shadow-md hover:bg-surface transition-colors"
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
              ? 'bg-surface text-red-500 shadow-sm'
              : 'bg-black/15 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100'
          }`}
        >
          <Heart
            size={12}
            fill={wished ? 'currentColor' : 'none'}
            strokeWidth={wished ? 0 : 2}
            className={heartPop ? 'animate-heart-pop' : ''}
          />
        </button>
      </div>

      {/* 텍스트 — 고정 높이로 카드 통일 */}
      <Link href={`/products/${product.id}`} className="block px-3.5 pt-3 pb-3.5">

        <h3 className={`font-medium text-ink leading-snug tracking-tight line-clamp-1 ${compact ? 'text-sm' : 'text-[13px]'}`}>
          {product.name}
        </h3>

        {/* 뱃지 슬롯 — 없어도 동일한 높이 유지 */}
        {!compact && (
          <div className="mt-1.5 h-[20px] flex items-center gap-1.5">
            {highlight && (
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${highlight.className}`}>
                <highlight.Icon size={9} />
                {highlight.label}
              </div>
            )}
            {isEco && (
              <div className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-green-50 text-green-600"
                title="친환경 저탄소 식품">
                🌿 에코
              </div>
            )}
          </div>
        )}

        {/* 별점 */}
        {!compact && (product as any).review_count > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="#facc15" stroke="#facc15" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span className="text-[11px] text-ink-4 font-medium">{(product as any).avg_rating?.toFixed(1)}</span>
            <span className="text-[10px] text-ink-5">({(product as any).review_count})</span>
          </div>
        )}

        <div className="flex items-center justify-between mt-1">
          <p className={`font-bold text-ink tracking-tight ${compact ? 'text-sm' : 'text-[14px]'}`}>
            {formatPrice(product.price)}
          </p>
          {!compact && (
            <button
              onClick={handleCompare}
              aria-label="비교 담기"
              className={`p-1 rounded-md transition-colors ${
                compared
                  ? 'text-[#2d7a4f] bg-green-tint'
                  : 'text-ink-5 hover:text-[#2d7a4f] hover:bg-green-tint'
              }`}
            >
              <GitCompareArrows size={13} />
            </button>
          )}
        </div>

      </Link>
    </div>
  )
}

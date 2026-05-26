'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/types'

type Props = {
  products: Product[]
  goal: string
  allergens: string[]
}

const WEEKDAYS = ['월', '화', '수', '목', '금', '토', '일']

function filterAndSort(products: Product[], goal: string, allergens: string[]): Product[] {
  // Filter active products (allergen filtering would need product allergen data)
  let filtered = products.filter((p) => p.is_active)

  // Goal-based sort/filter
  if (goal === 'diet') {
    filtered = filtered
      .filter((p) => (p.calories ?? 9999) <= 500)
      .sort((a, b) => (a.calories ?? 9999) - (b.calories ?? 9999))
  } else if (goal === 'muscle') {
    filtered = filtered.sort((a, b) => (b.protein ?? 0) - (a.protein ?? 0))
  } else {
    // health / maintain / balanced / default
    filtered = filtered
      .filter((p) => (p.calories ?? 9999) <= 700)
      .sort((a, b) => (b.protein ?? 0) - (a.protein ?? 0))
  }

  return filtered
}

function assignWeek(products: Product[]): (Product | null)[] {
  if (products.length === 0) return Array(7).fill(null)
  return WEEKDAYS.map((_, i) => products[i % products.length])
}

export function AIMealPlan({ products, goal, allergens }: Props) {
  const [offset, setOffset] = useState(0)

  const filtered = filterAndSort(products, goal, allergens)
  const baseList = filtered.length > 0 ? filtered : products.slice(0, 7)

  const rotated = baseList.length > 0
    ? WEEKDAYS.map((_, i) => baseList[(i + offset) % baseList.length])
    : Array(7).fill(null)

  const handleShuffle = () => {
    setOffset((prev) => (prev + 1) % Math.max(baseList.length, 1))
  }

  async function handleAddToCart(product: Product) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('로그인이 필요해요.')
      return
    }
    await supabase.from('cart_items').upsert(
      {
        user_id: user.id,
        product_id: product.id,
        quantity: 1,
        is_subscription: false,
        display_group: product.display_group ?? 1,
      },
      { onConflict: 'user_id,product_id' }
    )
    alert(`"${product.name}"을(를) 장바구니에 담았어요!`)
  }

  const goalLabel: Record<string, string> = {
    diet: '다이어트 (저칼로리 우선)',
    muscle: '근육 증가 (고단백 우선)',
    maintain: '체중 유지 (균형식)',
    health: '건강 관리 (균형식)',
    balanced: '균형식',
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-ink-4">
          기준: {goalLabel[goal] ?? goal}
        </p>
        <button
          onClick={handleShuffle}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#2d7a4f] border border-[#2d7a4f]/30 rounded-xl hover:bg-green-tint transition-colors"
        >
          식단 새로 짜기 ↻
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {WEEKDAYS.map((day, i) => {
          const product = rotated[i]
          return (
            <div
              key={day}
              className="bg-surface rounded-2xl border border-line overflow-hidden flex flex-col"
            >
              {/* Day label */}
              <div className="px-3 pt-3 pb-1">
                <span className="text-xs font-bold text-[#2d7a4f]">{day}요일</span>
              </div>

              {/* Product image */}
              <div className="relative w-full aspect-square bg-tint">
                {product?.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl text-ink-5">
                    🍱
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3 flex-1 flex flex-col gap-2">
                {product ? (
                  <>
                    <p className="text-xs font-semibold text-ink line-clamp-2 leading-tight">
                      {product.name}
                    </p>
                    <div className="flex gap-2 text-[11px] text-ink-4">
                      {product.calories && <span>{product.calories}kcal</span>}
                      {product.protein && <span>단백질 {product.protein}g</span>}
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="mt-auto w-full py-1.5 text-xs font-medium text-white bg-[#2d7a4f] rounded-lg hover:bg-[#235f3d] transition-colors"
                    >
                      담기
                    </button>
                  </>
                ) : (
                  <p className="text-xs text-ink-5 text-center mt-2">상품 없음</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

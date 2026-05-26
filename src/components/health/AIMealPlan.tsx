'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { GOAL_LABEL } from '@/lib/health-types'
import type { Product } from '@/types'

type Props = {
  products: Product[]
  goal: string
  allergens: string[]
  userId: string
}

const WEEKDAYS = ['월', '화', '수', '목', '금', '토', '일']

const GOAL_SORT_LABEL: Record<string, string> = {
  diet:     '저칼로리 우선',
  muscle:   '고단백 우선',
  maintain: '균형식',
  health:   '균형식',
  balanced: '균형식',
}

function filterAndSort(products: Product[], goal: string): Product[] {
  // TODO: allergen filtering needs product.allergens column data
  const active = products.filter((p) => p.is_active)
  if (goal === 'diet') {
    return active
      .filter((p) => (p.calories ?? 9999) <= 500)
      .sort((a, b) => (a.calories ?? 9999) - (b.calories ?? 9999))
  }
  if (goal === 'muscle') {
    return active.sort((a, b) => (b.protein ?? 0) - (a.protein ?? 0))
  }
  return active
    .filter((p) => (p.calories ?? 9999) <= 700)
    .sort((a, b) => (b.protein ?? 0) - (a.protein ?? 0))
}

export function AIMealPlan({ products, goal, userId }: Props) {
  const [offset, setOffset] = useState(0)

  const baseList = useMemo(() => {
    const filtered = filterAndSort(products, goal)
    return filtered.length > 0 ? filtered : products.slice(0, 7)
  }, [products, goal])

  const rotated = baseList.length > 0
    ? WEEKDAYS.map((_, i) => baseList[(i + offset) % baseList.length])
    : Array(7).fill(null)

  async function handleAddToCart(product: Product) {
    const supabase = createClient()
    await supabase.from('cart_items').upsert(
      { user_id: userId, product_id: product.id, quantity: 1, is_subscription: false, display_group: product.display_group ?? 1 },
      { onConflict: 'user_id,product_id' }
    )
    alert(`"${product.name}"을(를) 장바구니에 담았어요!`)
  }

  const goalMeta = GOAL_LABEL[goal]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-ink-4">
          기준: {goalMeta ? `${goalMeta.label} (${GOAL_SORT_LABEL[goal]})` : goal}
        </p>
        <button
          onClick={() => setOffset((prev) => (prev + 1) % Math.max(baseList.length, 1))}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#2d7a4f] border border-[#2d7a4f]/30 rounded-xl hover:bg-green-tint transition-colors"
        >
          식단 새로 짜기 ↻
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {WEEKDAYS.map((day, i) => {
          const product = rotated[i]
          return (
            <div key={day} className="bg-surface rounded-2xl border border-line overflow-hidden flex flex-col">
              <div className="px-3 pt-3 pb-1">
                <span className="text-xs font-bold text-[#2d7a4f]">{day}요일</span>
              </div>

              <div className="relative w-full aspect-square bg-tint">
                {product?.image_url ? (
                  <Image src={product.image_url} alt={product.name} fill className="object-cover" sizes="(max-width: 640px) 50vw, 25vw" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl text-ink-5">🍱</div>
                )}
              </div>

              <div className="p-3 flex-1 flex flex-col gap-2">
                {product ? (
                  <>
                    <p className="text-xs font-semibold text-ink line-clamp-2 leading-tight">{product.name}</p>
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

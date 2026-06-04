'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, TrendingUp } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import { toast } from '@/lib/toast-store'
import { formatPrice } from '@/lib/utils'
import type { DayNutrition, GoalInfo } from '@/lib/health-types'
import type { Product } from '@/types'

interface Props {
  today: DayNutrition
  goal: GoalInfo
  products: Product[]
}

export function NutritionRecommend({ today, goal, products }: Props) {
  const addItem = useCartStore(s => s.addItem)

  const { deficits, recommendations } = useMemo(() => {
    const defs: { nutrient: string; amount: number; unit: string; emoji: string }[] = []

    const calGap = goal.calTarget - today.cal
    const protGap = goal.proteinTarget - today.protein
    const carbGap = goal.carbsTarget - today.carbs

    if (calGap > 200) defs.push({ nutrient: '칼로리', amount: Math.round(calGap), unit: 'kcal', emoji: '🔥' })
    if (protGap > 15) defs.push({ nutrient: '단백질', amount: Math.round(protGap), unit: 'g', emoji: '💪' })
    if (carbGap > 30) defs.push({ nutrient: '탄수화물', amount: Math.round(carbGap), unit: 'g', emoji: '🌾' })

    if (defs.length === 0) return { deficits: [], recommendations: [] }

    // 부족 영양소 기준 상품 점수 계산
    const scored = products
      .filter(p => p.is_active && (p.stock ?? 0) > 0 && p.calories)
      .map(p => {
        let score = 0
        if (protGap > 15 && (p.protein ?? 0) > 15) score += 3
        if (calGap > 200 && (p.calories ?? 0) > 200) score += 2
        if (carbGap > 30 && (p.carbs ?? 0) > 30) score += 1
        return { product: p, score }
      })
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(x => x.product)

    return { deficits: defs, recommendations: scored }
  }, [today, goal, products])

  if (deficits.length === 0) {
    return (
      <div className="bg-surface rounded-2xl border border-line p-5">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp size={16} className="text-[#2d7a4f]" />
          <span className="font-semibold text-ink">오늘의 영양 추천</span>
        </div>
        <p className="text-sm text-ink-4 text-center py-4">
          🎉 오늘 영양 목표를 잘 달성하고 있어요!
        </p>
      </div>
    )
  }

  return (
    <div className="bg-surface rounded-2xl border border-line p-5 space-y-4">
      {/* 부족 영양소 */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={16} className="text-[#2d7a4f]" />
          <span className="font-semibold text-ink">오늘의 영양 추천</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {deficits.map(d => (
            <span key={d.nutrient} className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 bg-red-50 text-red-600 rounded-full">
              {d.emoji} {d.nutrient} {d.amount}{d.unit} 부족
            </span>
          ))}
        </div>
      </div>

      {/* 추천 상품 */}
      {recommendations.length > 0 && (
        <div>
          <p className="text-xs text-ink-5 mb-3">부족한 영양소를 채울 수 있는 GreenEat 도시락</p>
          <div className="space-y-2.5">
            {recommendations.map(p => (
              <div key={p.id} className="flex items-center gap-3 p-3 bg-wash rounded-xl">
                {p.image_url && (
                  <Link href={`/products/${p.id}`}>
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                      <Image src={p.image_url} alt={p.name} width={56} height={56} className="object-cover w-full h-full" />
                    </div>
                  </Link>
                )}
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${p.id}`}>
                    <p className="text-sm font-medium text-ink truncate hover:text-[#2d7a4f] transition-colors">{p.name}</p>
                  </Link>
                  <div className="flex gap-2 mt-0.5 text-[10px] text-ink-5">
                    {p.calories && <span>🔥{p.calories}kcal</span>}
                    {p.protein && <span>💪{p.protein}g</span>}
                    {p.carbs && <span>🌾{p.carbs}g</span>}
                  </div>
                  <p className="text-xs font-semibold text-[#2d7a4f] mt-0.5">{formatPrice(p.price)}</p>
                </div>
                <button
                  onClick={() => {
                    addItem(p as Parameters<typeof addItem>[0])
                    toast.success(`${p.name} 장바구니에 담았어요!`)
                  }}
                  className="shrink-0 p-2 bg-[#2d7a4f] text-white rounded-xl hover:bg-[#235f3d] transition-colors"
                >
                  <ShoppingCart size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

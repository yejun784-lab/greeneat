'use client'

import { useState } from 'react'

import type { Product } from '@/types'

interface Props { calories?: number | null; protein?: number | null; carbs?: number | null; fat?: number | null; product?: Product }

export function CalcNutrition({ calories, protein, carbs, fat, product }: Props) {
  calories = calories ?? product?.calories ?? null
  protein  = protein  ?? product?.protein  ?? null
  carbs    = carbs    ?? product?.carbs     ?? null
  fat      = fat      ?? product?.fat       ?? null
  const [qty, setQty] = useState(1)
  const calc = (v: number | null) => v ? Math.round(v * qty) : '-'
  return (
    <div className="bg-tint rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-sm text-ink-3">수량</span>
        <div className="flex items-center gap-2">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-7 h-7 rounded-full bg-white border border-line-2 flex items-center justify-center text-ink-3 hover:border-[#2d7a4f]">-</button>
          <span className="text-sm font-semibold w-6 text-center">{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} className="w-7 h-7 rounded-full bg-white border border-line-2 flex items-center justify-center text-ink-3 hover:border-[#2d7a4f]">+</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {[['칼로리', calc(calories), 'kcal'], ['단백질', calc(protein), 'g'], ['탄수화물', calc(carbs), 'g'], ['지방', calc(fat), 'g']].map(([label, value, unit]) => (
          <div key={label as string} className="bg-white rounded-xl p-3 text-center">
            <p className="text-xs text-ink-4 mb-1">{label}</p>
            <p className="font-bold text-ink">{value}<span className="text-xs text-ink-4 font-normal ml-0.5">{unit}</span></p>
          </div>
        ))}
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { Calculator } from 'lucide-react'
import type { Product } from '@/types'

interface Props { product: Product }

const GOALS = [
  { key: 'diet',     label: '다이어트',   cal: 1500, protein: 80 },
  { key: 'balanced', label: '균형식',      cal: 2000, protein: 100 },
  { key: 'muscle',   label: '근육 증가',   cal: 2500, protein: 150 },
]

export function CalcNutrition({ product }: Props) {
  const [servings, setServings] = useState(1)
  const [goal, setGoal] = useState('balanced')

  const g = GOALS.find((g) => g.key === goal) ?? GOALS[1]
  const cal     = (product.calories ?? 0) * servings
  const protein = (product.protein  ?? 0) * servings
  const carbs   = (product.carbs    ?? 0) * servings
  const fat     = (product.fat      ?? 0) * servings

  const calPct     = Math.min(100, Math.round((cal / g.cal) * 100))
  const proteinPct = Math.min(100, Math.round((protein / g.protein) * 100))

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Calculator size={16} className="text-[#2d7a4f]" />
        <h4 className="font-semibold text-ink">영양 계산기</h4>
      </div>

      {/* 목표 선택 */}
      <div>
        <p className="text-xs text-ink-4 mb-2">내 식단 목표</p>
        <div className="flex gap-2">
          {GOALS.map((g) => (
            <button
              key={g.key}
              onClick={() => setGoal(g.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                goal === g.key
                  ? 'bg-[#2d7a4f] text-white border-[#2d7a4f]'
                  : 'border-line-2 text-ink-3 hover:border-line-3'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* 인분 조절 */}
      <div className="flex items-center gap-4">
        <p className="text-xs text-ink-4">인분 수</p>
        <div className="flex items-center gap-2 border border-line-2 rounded-lg overflow-hidden">
          <button
            onClick={() => setServings((s) => Math.max(1, s - 1))}
            className="w-8 h-8 flex items-center justify-center hover:bg-wash text-ink-3"
          >−</button>
          <span className="w-6 text-center text-sm font-semibold text-ink">{servings}</span>
          <button
            onClick={() => setServings((s) => Math.min(6, s + 1))}
            className="w-8 h-8 flex items-center justify-center hover:bg-wash text-ink-3"
          >+</button>
        </div>
        <span className="text-xs text-ink-5">({product.servings}인분 × {servings})</span>
      </div>

      {/* 영양소 바 */}
      <div className="space-y-3">
        {[
          { label: '칼로리', val: cal, unit: 'kcal', pct: calPct, color: 'bg-orange-400', daily: g.cal },
          { label: '단백질', val: protein, unit: 'g', pct: proteinPct, color: 'bg-[#2d7a4f]', daily: g.protein },
        ].map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-ink-2 font-medium">{item.label}</span>
              <span className="text-ink-4">
                <strong className="text-ink">{item.val}</strong>{item.unit} / 일일 목표 {item.daily}{item.unit}
                <span className="ml-1 text-[#2d7a4f] font-bold">{item.pct}%</span>
              </span>
            </div>
            <div className="w-full h-2 bg-tint rounded-full overflow-hidden">
              <div
                className={`h-full ${item.color} rounded-full transition-all duration-300`}
                style={{ width: `${item.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 전체 영양소 표 */}
      <div className="grid grid-cols-4 gap-2 bg-wash rounded-xl p-3">
        {[
          { label: '칼로리', value: `${cal}kcal` },
          { label: '단백질', value: `${protein}g` },
          { label: '탄수화물', value: `${carbs}g` },
          { label: '지방', value: `${fat}g` },
        ].map((n) => (
          <div key={n.label} className="text-center">
            <p className="text-xs text-ink-5">{n.label}</p>
            <p className="text-sm font-bold text-ink mt-0.5">{n.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

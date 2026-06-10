'use client'

import { useEffect, useState } from 'react'
import type { DayNutrition, GoalInfo } from '@/lib/health-types'

type Props = {
  today: DayNutrition
  goal: GoalInfo
}

type RingConfig = {
  label: string
  value: number
  target: number
  unit: string
  color: string
}

// r=15.9 기준 실제 둘레 (2πr ≈ 99.9)
const CIRCUMFERENCE = 2 * Math.PI * 15.9

function DonutRing({ label, value, target, unit, color, index }: RingConfig & { index: number }) {
  const [mounted, setMounted] = useState(false)
  const pct = target > 0 ? (value / target) * 100 : 0
  const capped = Math.min(pct, 100)
  const over = pct > 100
  const strokeColor = over ? '#ef4444' : color

  // 각 링을 순서대로 채우기 위해 index별 딜레이
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80 + index * 110)
    return () => clearTimeout(t)
  }, [index])

  // mounted 전: 완전히 숨겨진 상태 (dashoffset = CIRCUMFERENCE)
  // mounted 후: 목표 비율만큼 채워진 상태
  const dashoffset = mounted
    ? CIRCUMFERENCE * (1 - capped / 100)
    : CIRCUMFERENCE

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20">
        <svg viewBox="0 0 36 36" className="-rotate-90 w-full h-full">
          {/* 배경 트랙 */}
          <circle
            cx="18"
            cy="18"
            r="15.9"
            fill="none"
            stroke="#f0f0ee"
            strokeWidth="3"
          />
          {/* 진행 링 — stroke-dashoffset 트랜지션으로 부드럽게 채워짐 */}
          <circle
            cx="18"
            cy="18"
            r="15.9"
            fill="none"
            stroke={strokeColor}
            strokeWidth="3"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(0.16, 1, 0.3, 1)' }}
          />
        </svg>

        {/* 중앙 % 텍스트 — 링이 차오를 때 같이 나타남 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-xs font-bold text-ink tabular-nums"
            style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.5s ease 0.3s' }}
          >
            {Math.round(pct)}%
          </span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs font-semibold text-ink-2">{label}</p>
        <p className="text-[11px] text-ink-4 mt-0.5">
          {Math.round(value)} / {target} {unit}
        </p>
      </div>
    </div>
  )
}

export function NutritionRings({ today, goal }: Props) {
  const rings: RingConfig[] = [
    { label: '칼로리',   value: today.cal,     target: goal.calTarget,     unit: 'kcal', color: '#e8734a' },
    { label: '단백질',   value: today.protein, target: goal.proteinTarget, unit: 'g',    color: '#2d7a4f' },
    { label: '탄수화물', value: today.carbs,   target: goal.carbsTarget,   unit: 'g',    color: '#4a6fa5' },
    { label: '지방',     value: today.fat,     target: goal.fatTarget,     unit: 'g',    color: '#c2762a' },
  ]

  return (
    <div className="grid grid-cols-4 gap-4">
      {rings.map((ring, i) => (
        <DonutRing key={ring.label} {...ring} index={i} />
      ))}
    </div>
  )
}

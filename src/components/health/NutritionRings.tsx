import type { DayNutrition } from '@/app/(main)/health/page'

type GoalInfo = {
  calTarget: number
  proteinTarget: number
  carbsTarget: number
  fatTarget: number
}

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

function DonutRing({ label, value, target, unit, color }: RingConfig) {
  const pct = target > 0 ? (value / target) * 100 : 0
  const capped = Math.min(pct, 100)
  const over = pct > 100
  const strokeColor = over ? '#ef4444' : color
  const circumference = 100

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-20 h-20">
        <svg viewBox="0 0 36 36" className="-rotate-90 w-full h-full">
          {/* background */}
          <circle
            cx="18"
            cy="18"
            r="15.9"
            fill="none"
            stroke="#f0f0ee"
            strokeWidth="3"
          />
          {/* progress */}
          <circle
            cx="18"
            cy="18"
            r="15.9"
            fill="none"
            stroke={strokeColor}
            strokeWidth="3"
            strokeDasharray={`${(capped / 100) * circumference} ${circumference - (capped / 100) * circumference}`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs font-bold text-ink">{Math.round(pct)}%</span>
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
    { label: '칼로리', value: today.cal, target: goal.calTarget, unit: 'kcal', color: '#e8734a' },
    { label: '단백질', value: today.protein, target: goal.proteinTarget, unit: 'g', color: '#2d7a4f' },
    { label: '탄수화물', value: today.carbs, target: goal.carbsTarget, unit: 'g', color: '#4a6fa5' },
    { label: '지방', value: today.fat, target: goal.fatTarget, unit: 'g', color: '#c2762a' },
  ]

  return (
    <div className="grid grid-cols-4 gap-4">
      {rings.map((ring) => (
        <DonutRing key={ring.label} {...ring} />
      ))}
    </div>
  )
}

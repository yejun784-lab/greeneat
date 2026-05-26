import type { DayNutrition } from '@/app/(main)/health/page'

type WeightLog = { date: string; weight_kg: number }

type Props = {
  weekData: DayNutrition[]
  goal: { calTarget: number; proteinTarget: number }
  weightLogs: WeightLog[]
}

function calAchievement(avgPct: number): string {
  if (avgPct >= 95) return '완벽해요 🎯'
  if (avgPct >= 70) return '잘 하고 있어요 👍'
  if (avgPct >= 40) return '조금 더 힘내요 💪'
  return '시작이 반이에요 🌱'
}

function consecutiveDays(weekData: DayNutrition[]): number {
  const today = new Date().toISOString().slice(0, 10)
  const dateset = new Set(weekData.filter((d) => d.cal > 0).map((d) => d.date))
  let streak = 0
  const cur = new Date(today)
  while (true) {
    const ds = cur.toISOString().slice(0, 10)
    if (dateset.has(ds)) {
      streak++
      cur.setDate(cur.getDate() - 1)
    } else {
      break
    }
  }
  return streak
}

export function HealthReport({ weekData, goal, weightLogs }: Props) {
  // 1. 이번 주 평균 칼로리
  const daysWithData = weekData.filter((d) => d.cal > 0)
  const avgCal =
    daysWithData.length > 0
      ? daysWithData.reduce((s, d) => s + d.cal, 0) / daysWithData.length
      : 0
  const avgCalPct = goal.calTarget > 0 ? (avgCal / goal.calTarget) * 100 : 0

  // 2. 단백질 목표 달성일
  const proteinDays = weekData.filter((d) => d.protein >= goal.proteinTarget).length

  // 3. 체중 변화 (이번 주 범위)
  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - 6)
  const weekStartStr = weekStart.toISOString().slice(0, 10)
  const weekLogs = weightLogs.filter((l) => l.date >= weekStartStr)
  const weightChange =
    weekLogs.length >= 2
      ? weekLogs[weekLogs.length - 1].weight_kg - weekLogs[0].weight_kg
      : null

  // 4. 연속 식단 기록
  const streak = consecutiveDays(weekData)

  const cards = [
    {
      title: '이번 주 평균 칼로리',
      value: avgCal > 0 ? `${Math.round(avgCal).toLocaleString()} kcal` : '데이터 없음',
      sub: avgCal > 0 ? calAchievement(avgCalPct) : '주문 내역이 없어요',
      accent: '#e8734a',
    },
    {
      title: '단백질 목표 달성일',
      value: `${proteinDays} / 7일 💪`,
      sub: proteinDays >= 5 ? '훌륭해요!' : proteinDays >= 3 ? '꾸준히 해요' : '단백질을 더 섭취해보세요',
      accent: '#2d7a4f',
    },
    {
      title: '체중 변화',
      value:
        weightChange !== null
          ? weightChange > 0
            ? `+${weightChange.toFixed(1)} kg`
            : weightChange < 0
            ? `${weightChange.toFixed(1)} kg`
            : '변화 없음'
          : '기록 없음',
      sub:
        weightChange !== null
          ? weightChange > 0
            ? '이번 주 증가'
            : weightChange < 0
            ? '이번 주 감소'
            : '유지 중이에요'
          : '체중을 기록해보세요',
      accent: '#4a6fa5',
    },
    {
      title: '연속 식단 기록',
      value: `${streak}일 연속 🔥`,
      sub: streak >= 7 ? '완벽한 한 주!' : streak >= 3 ? '좋은 흐름이에요' : '꾸준함이 힘이에요',
      accent: '#c2762a',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-surface rounded-2xl border border-line p-4 flex flex-col gap-1"
        >
          <p className="text-[11px] font-semibold text-ink-4 uppercase tracking-wide">
            {card.title}
          </p>
          <p
            className="text-lg font-bold mt-1"
            style={{ color: card.accent }}
          >
            {card.value}
          </p>
          <p className="text-xs text-ink-4">{card.sub}</p>
        </div>
      ))}
    </div>
  )
}

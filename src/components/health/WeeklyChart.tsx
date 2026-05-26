import type { DayNutrition } from '@/app/(main)/health/page'

type Props = {
  data: DayNutrition[]
  calTarget: number
}

function formatMMDD(dateStr: string): string {
  const d = new Date(dateStr)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${mm}/${dd}`
}

function getLast7Days(): string[] {
  const days: string[] = []
  const today = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    days.push(d.toISOString().slice(0, 10))
  }
  return days
}

export function WeeklyChart({ data, calTarget }: Props) {
  const days = getLast7Days()
  const todayStr = days[6]
  const dataMap = new Map(data.map((d) => [d.date, d]))

  return (
    <div className="w-full">
      {/* Chart area */}
      <div className="relative h-36 flex items-end gap-2 px-1 mb-1">
        {/* Goal line (dashed) */}
        <div
          className="absolute left-0 right-0 border-t-2 border-dashed border-red-400/60 pointer-events-none"
          style={{ bottom: '0%', top: calTarget > 0 ? 'auto' : '0%' }}
          aria-hidden
        >
          <span className="absolute -top-4 right-0 text-[10px] text-red-400 font-medium">
            목표 {calTarget.toLocaleString()}kcal
          </span>
        </div>

        {days.map((day) => {
          const entry = dataMap.get(day)
          const cal = entry?.cal ?? 0
          const heightPct = calTarget > 0 ? Math.min((cal / calTarget) * 100, 100) : 0
          const isToday = day === todayStr

          return (
            <div
              key={day}
              className="relative flex-1 flex flex-col items-center justify-end h-full group"
            >
              {/* Tooltip */}
              {cal > 0 && (
                <div className="absolute bottom-full mb-1 hidden group-hover:flex bg-ink text-surface text-[10px] px-2 py-1 rounded-lg whitespace-nowrap z-10 shadow-lg">
                  {cal.toLocaleString()} kcal
                </div>
              )}
              {/* Bar */}
              <div
                className={`w-full rounded-t-md transition-all ${
                  isToday
                    ? 'bg-[#2d7a4f]'
                    : cal > 0
                    ? 'bg-[#2d7a4f]/40'
                    : 'bg-line-2'
                }`}
                style={{ height: cal > 0 ? `${Math.max(heightPct, 4)}%` : '4%' }}
              />
            </div>
          )
        })}
      </div>

      {/* X axis labels */}
      <div className="flex gap-2 px-1">
        {days.map((day) => {
          const isToday = day === todayStr
          return (
            <div key={day} className="flex-1 text-center">
              <span
                className={`text-[10px] font-medium ${
                  isToday ? 'text-[#2d7a4f] font-bold' : 'text-ink-4'
                }`}
              >
                {formatMMDD(day)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

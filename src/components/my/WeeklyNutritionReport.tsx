import { createClient } from '@/lib/supabase/server'
import { BarChart2 } from 'lucide-react'

interface Props {
  userId: string
}

export async function WeeklyNutritionReport({ userId }: Props) {
  const supabase = await createClient()

  const since = new Date()
  since.setDate(since.getDate() - 6)
  since.setHours(0, 0, 0, 0)

  const { data: orders } = await supabase
    .from('orders')
    .select('created_at, order_items(quantity, products(calories, protein))')
    .eq('user_id', userId)
    .gte('created_at', since.toISOString())
    .eq('payment_status', 'paid')

  // 날짜별 집계
  const dayMap: Record<string, { cal: number; protein: number }> = {}
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    dayMap[d.toISOString().slice(0, 10)] = { cal: 0, protein: 0 }
  }

  for (const order of orders ?? []) {
    const date = order.created_at.slice(0, 10)
    if (!dayMap[date]) continue
    for (const item of (order.order_items as any[]) ?? []) {
      const cal = (item.products?.calories ?? 0) * item.quantity
      const protein = (item.products?.protein ?? 0) * item.quantity
      dayMap[date].cal += cal
      dayMap[date].protein += protein
    }
  }

  const days = Object.entries(dayMap)
  const maxCal = Math.max(...days.map(([, v]) => v.cal), 500)
  const avgCal = Math.round(days.reduce((s, [, v]) => s + v.cal, 0) / 7)
  const avgProtein = Math.round(days.reduce((s, [, v]) => s + v.protein, 0) / 7)

  const weekdayLabels = ['일', '월', '화', '수', '목', '금', '토']

  return (
    <div className="bg-surface rounded-2xl border border-line p-5">
      <div className="flex items-center gap-2 mb-4">
        <BarChart2 size={16} className="text-[#2d7a4f]" />
        <h2 className="font-semibold text-ink">주간 영양 리포트</h2>
        <span className="text-xs text-ink-5 ml-auto">최근 7일</span>
      </div>

      {/* 바 차트 */}
      <div className="flex items-end gap-1.5 h-20 mb-2">
        {days.map(([date, v]) => {
          const d = new Date(date)
          const label = weekdayLabels[d.getDay()]
          const height = v.cal > 0 ? Math.max(8, (v.cal / maxCal) * 100) : 4
          const isToday = date === new Date().toISOString().slice(0, 10)
          return (
            <div key={date} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex items-end justify-center" style={{ height: '60px' }}>
                <div
                  className={`w-full rounded-t-md transition-all ${isToday ? 'bg-[#2d7a4f]' : 'bg-green-tint'}`}
                  style={{ height: `${height}%` }}
                />
              </div>
              <span className={`text-[10px] ${isToday ? 'font-bold text-[#2d7a4f]' : 'text-ink-5'}`}>
                {label}
              </span>
            </div>
          )
        })}
      </div>

      {/* 요약 */}
      <div className="flex gap-4 pt-3 border-t border-line mt-2">
        <div>
          <p className="text-[10px] text-ink-5">평균 칼로리</p>
          <p className="text-sm font-bold text-ink">{avgCal > 0 ? `${avgCal} kcal` : '-'}</p>
        </div>
        <div>
          <p className="text-[10px] text-ink-5">평균 단백질</p>
          <p className="text-sm font-bold text-ink">{avgProtein > 0 ? `${avgProtein} g` : '-'}</p>
        </div>
        {avgCal === 0 && (
          <p className="text-xs text-ink-5 self-center ml-2">이번 주 결제 완료 주문이 없습니다.</p>
        )}
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { BarChart2 } from 'lucide-react'

type DayData = { day: string; cal: number; protein: number }

const DAYS = ['일', '월', '화', '수', '목', '금', '토']

export function WeeklyNutritionReport({ userId }: { userId: string }) {
  const [data, setData] = useState<DayData[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'cal' | 'protein'>('cal')

  useEffect(() => {
    const supabase = createClient()
    const since = new Date(Date.now() - 7 * 86400000).toISOString()

    supabase
      .from('orders')
      .select('created_at, order_items(quantity, products(calories, protein))')
      .eq('user_id', userId)
      .gte('created_at', since)
      .order('created_at', { ascending: true })
      .then(({ data: orders }) => {
        const map: Record<string, { cal: number; protein: number }> = {}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(orders ?? []).forEach((o: any) => {
          const d = DAYS[new Date(o.created_at).getDay()]
          if (!map[d]) map[d] = { cal: 0, protein: 0 }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ;(o.order_items ?? []).forEach((item: any) => {
            map[d].cal += (item.products?.calories ?? 0) * item.quantity
            map[d].protein += (item.products?.protein ?? 0) * item.quantity
          })
        })

        const result: DayData[] = Array.from({ length: 7 }).map((_, i) => {
          const d = new Date(Date.now() - (6 - i) * 86400000)
          const label = DAYS[d.getDay()]
          return { day: label, cal: map[label]?.cal ?? 0, protein: map[label]?.protein ?? 0 }
        })
        setData(result)
        setLoading(false)
      })
  }, [userId])

  if (loading) return <div className="h-40 animate-pulse bg-tint rounded-2xl" />

  const maxCal = Math.max(...data.map((d) => d.cal), 500)
  const maxProtein = Math.max(...data.map((d) => d.protein), 50)
  const totalCal = data.reduce((s, d) => s + d.cal, 0)
  const totalProtein = data.reduce((s, d) => s + d.protein, 0)

  return (
    <div className="bg-surface rounded-2xl border border-line p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BarChart2 size={16} className="text-[#2d7a4f]" />
          <h3 className="font-semibold text-ink">주간 영양 리포트</h3>
        </div>
        <div className="flex gap-1">
          {(['cal', 'protein'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                view === v ? 'bg-[#2d7a4f] text-white' : 'bg-tint text-ink-4 hover:bg-line-2'
              }`}
            >
              {v === 'cal' ? '칼로리' : '단백질'}
            </button>
          ))}
        </div>
      </div>

      {/* 막대 그래프 */}
      <div className="flex items-end gap-2 h-28">
        {data.map((d, i) => {
          const val = view === 'cal' ? d.cal : d.protein
          const max = view === 'cal' ? maxCal : maxProtein
          const pct = max > 0 ? (val / max) * 100 : 0
          const isToday = i === 6
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[10px] text-ink-5">{val > 0 ? (view === 'cal' ? val : `${val}g`) : ''}</span>
              <div className="w-full flex items-end" style={{ height: '72px' }}>
                <div
                  className={`w-full rounded-t-lg transition-all duration-500 ${
                    isToday ? 'bg-[#2d7a4f]' : 'bg-[#a8d5b8]'
                  }`}
                  style={{ height: `${Math.max(4, pct)}%` }}
                />
              </div>
              <span className={`text-[10px] font-medium ${isToday ? 'text-[#2d7a4f]' : 'text-ink-5'}`}>
                {d.day}
              </span>
            </div>
          )
        })}
      </div>

      {/* 주간 요약 */}
      <div className="mt-4 pt-3 border-t border-line grid grid-cols-2 gap-3">
        <div className="bg-orange-50 rounded-xl p-3 text-center">
          <p className="text-xs text-ink-4 mb-0.5">주간 총 칼로리</p>
          <p className="text-lg font-bold text-orange-500">{totalCal.toLocaleString()}</p>
          <p className="text-xs text-ink-5">kcal</p>
        </div>
        <div className="bg-green-tint rounded-xl p-3 text-center">
          <p className="text-xs text-ink-4 mb-0.5">주간 총 단백질</p>
          <p className="text-lg font-bold text-[#2d7a4f]">{totalProtein.toLocaleString()}</p>
          <p className="text-xs text-ink-5">g</p>
        </div>
      </div>
    </div>
  )
}

import Image from 'next/image'
import { Flame, Dumbbell, Wheat, Droplets, UtensilsCrossed } from 'lucide-react'
import { MEAL_TYPE_META } from '@/lib/utils'
import type { MealLogRow } from '@/lib/health-types'

export function TodayMealList({ logs }: { logs: MealLogRow[] }) {
  const total = logs.reduce(
    (acc, l) => ({
      cal: acc.cal + (l.calories ?? 0),
      protein: acc.protein + (l.protein ?? 0),
      carbs: acc.carbs + (l.carbs ?? 0),
      fat: acc.fat + (l.fat ?? 0),
    }),
    { cal: 0, protein: 0, carbs: 0, fat: 0 }
  )

  return (
    <div className="bg-white rounded-2xl border border-[#f0f0ee] overflow-hidden">
      {/* 헤더 */}
      <div className="px-5 py-4 border-b border-[#f0f0ee] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#fff7ed] flex items-center justify-center">
            <UtensilsCrossed size={15} className="text-amber-500" />
          </div>
          <div>
            <p className="font-semibold text-[#111] text-sm">오늘 먹은 것</p>
            <p className="text-xs text-[#999]">사진 분석으로 기록된 식단</p>
          </div>
        </div>
        {/* 오늘 합산 */}
        <div className="text-right">
          <p className="text-lg font-bold text-[#111]">{total.cal}<span className="text-xs font-normal text-[#999] ml-1">kcal</span></p>
          <p className="text-[10px] text-[#aaa]">{logs.length}끼 기록</p>
        </div>
      </div>

      {/* 합산 영양 바 */}
      <div className="px-5 py-3 bg-[#fafaf8] border-b border-[#f0f0ee]">
        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: Flame,    label: '칼로리', value: total.cal,     unit: 'kcal', color: 'text-orange-500' },
            { icon: Dumbbell, label: '단백질', value: Math.round(total.protein), unit: 'g', color: 'text-blue-500' },
            { icon: Wheat,    label: '탄수화물', value: Math.round(total.carbs), unit: 'g', color: 'text-amber-500' },
            { icon: Droplets, label: '지방',   value: Math.round(total.fat),   unit: 'g', color: 'text-purple-500' },
          ].map(({ icon: Icon, label, value, unit, color }) => (
            <div key={label} className="text-center">
              <div className="flex items-center justify-center gap-0.5 mb-0.5">
                <Icon size={10} className={color} />
                <span className="text-[10px] text-[#999]">{label}</span>
              </div>
              <p className="text-sm font-bold text-[#333]">{value}<span className="text-[10px] font-normal text-[#aaa] ml-0.5">{unit}</span></p>
            </div>
          ))}
        </div>
      </div>

      {/* 식사 목록 */}
      <div className="divide-y divide-[#f5f5f3]">
        {logs.map((log, i) => {
          const meta = MEAL_TYPE_META[log.meal_type as keyof typeof MEAL_TYPE_META] ?? { label: log.meal_type, color: 'bg-gray-50 text-gray-500' }
          return (
            <div key={i} className="flex items-center gap-3 px-5 py-3.5">
              {/* 식사 이미지 */}
              {log.image_url ? (
                <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-[#f5f5f3]">
                  <Image src={log.image_url} alt={log.description ?? '식단'} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-xl bg-[#f0faf4] flex items-center justify-center shrink-0">
                  <UtensilsCrossed size={18} className="text-[#2d7a4f]/40" />
                </div>
              )}

              {/* 내용 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${meta.color}`}>
                    {meta.label}
                  </span>
                  <span className="text-[10px] text-[#bbb]">
                    {new Date(log.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-[#333] leading-snug line-clamp-1">{log.description ?? '기록된 식단'}</p>
              </div>

              {/* 칼로리 */}
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-[#111]">{log.calories ?? '–'}</p>
                <p className="text-[10px] text-[#aaa]">kcal</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

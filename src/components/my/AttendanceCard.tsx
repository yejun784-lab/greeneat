'use client'

import { useEffect, useState } from 'react'
import { CalendarCheck, Flame } from 'lucide-react'
import { toast } from '@/lib/toast-store'

type AttendanceState = {
  dates: string[]
  checkedToday: boolean
  streak: number
  today: string
}

const WEEKDAY_LABEL = ['일', '월', '화', '수', '목', '금', '토']

/** 오늘 포함 최근 7일 (KST) — 과거 → 오늘 순 */
function last7Days(today: string): string[] {
  const base = new Date(today + 'T00:00:00Z')
  return Array.from({ length: 7 }, (_, i) =>
    new Date(base.getTime() - (6 - i) * 86_400_000).toISOString().slice(0, 10)
  )
}

export function AttendanceCard() {
  const [state, setState] = useState<AttendanceState | null>(null)
  const [checking, setChecking] = useState(false)
  const [justChecked, setJustChecked] = useState(false)

  useEffect(() => {
    fetch('/api/attendance')
      .then(r => (r.ok ? r.json() : null))
      .then(setState)
      .catch(() => setState(null))
  }, [])

  async function handleCheck() {
    if (!state || state.checkedToday || checking) return
    setChecking(true)
    try {
      const res = await fetch('/api/attendance', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? '출석 처리에 실패했어요.')
        if (res.status === 409) {
          setState(s => (s ? { ...s, checkedToday: true } : s))
        }
        return
      }
      setState(s => s ? {
        ...s,
        checkedToday: true,
        dates: [s.today, ...s.dates],
        streak: data.streak,
      } : s)
      setJustChecked(true)
      toast.success(
        data.bonus
          ? `🎉 ${data.streak}일 연속 출석! +${data.awarded}P 보너스 지급!`
          : `출석 완료! +${data.awarded}P 적립`
      )
    } catch {
      toast.error('네트워크 오류가 발생했어요.')
    } finally {
      setChecking(false)
    }
  }

  if (!state) return null

  const week = last7Days(state.today)
  const checkedSet = new Set(state.dates)

  return (
    <div className="bg-surface rounded-2xl border border-line p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarCheck size={15} className="text-[#2d7a4f]" />
          <p className="text-sm font-semibold text-ink">출석체크</p>
          {state.streak > 1 && (
            <span className="flex items-center gap-0.5 text-[11px] font-bold text-orange-500 bg-orange-50 dark:bg-orange-950/30 px-2 py-0.5 rounded-full">
              <Flame size={10} fill="currentColor" />
              {state.streak}일 연속
            </span>
          )}
        </div>
        <p className="text-xs text-ink-5">매일 50P · 7일 연속 +200P</p>
      </div>

      {/* 최근 7일 */}
      <div className="grid grid-cols-7 gap-1.5 mb-4">
        {week.map(d => {
          const isToday = d === state.today
          const checked = checkedSet.has(d)
          const day = WEEKDAY_LABEL[new Date(d + 'T00:00:00Z').getUTCDay()]
          return (
            <div key={d} className="flex flex-col items-center gap-1">
              <span className={`text-[10px] ${isToday ? 'text-[#2d7a4f] font-bold' : 'text-ink-5'}`}>
                {isToday ? '오늘' : day}
              </span>
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-all ${
                  checked
                    ? 'bg-[#2d7a4f] text-white' + (isToday && justChecked ? ' animate-pop-in' : '')
                    : isToday
                    ? 'bg-green-tint border-2 border-dashed border-[#2d7a4f]/40'
                    : 'bg-tint'
                }`}
              >
                {checked ? '✓' : ''}
              </div>
            </div>
          )
        })}
      </div>

      <button
        onClick={handleCheck}
        disabled={state.checkedToday || checking}
        className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${
          state.checkedToday
            ? 'bg-tint text-ink-5 cursor-default'
            : 'bg-[#2d7a4f] text-white hover:bg-[#235f3d]'
        }`}
      >
        {state.checkedToday ? '오늘 출석 완료 ✓' : checking ? '처리 중...' : '출석하고 50P 받기'}
      </button>
    </div>
  )
}

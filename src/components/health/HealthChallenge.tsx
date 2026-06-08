'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Trophy, Lock } from 'lucide-react'
import type { DayNutrition, GoalInfo } from '@/lib/health-types'

/* ── 스트릭 계산 ── */
function calcStreak(dateStrings: string[]): number {
  if (dateStrings.length === 0) return 0
  const dateSet = new Set(dateStrings)

  const todayDate = new Date()
  todayDate.setHours(0, 0, 0, 0)
  const fmt = (d: Date) => d.toISOString().split('T')[0]

  const todayStr     = fmt(todayDate)
  const yesterdayStr = fmt(new Date(todayDate.getTime() - 86400000))

  // 연속 시작점 결정 (오늘 또는 어제)
  if (!dateSet.has(todayStr) && !dateSet.has(yesterdayStr)) return 0

  const cursor = new Date(todayDate)
  if (!dateSet.has(todayStr)) cursor.setDate(cursor.getDate() - 1)

  let streak = 0
  while (dateSet.has(fmt(cursor))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

function calcGoalDays(weekData: DayNutrition[], calTarget: number): number {
  return weekData.filter(d => calTarget > 0 && d.cal >= calTarget * 0.85 && d.cal <= calTarget * 1.1).length
}

/* ── 배지 정의 ── */
const BADGE_DEFS = [
  { id: 'first_meal',   emoji: '🌱', title: '첫 발걸음',    desc: '첫 식단 기록',               check: (m: number, e: number, c: number) => m >= 1     },
  { id: 'meal_3',       emoji: '🔥', title: '3일 연속',     desc: '3일 연속 식단 기록',         check: (m: number, e: number, c: number) => m >= 3     },
  { id: 'meal_7',       emoji: '🏅', title: '일주일 완주',  desc: '7일 연속 식단 기록',         check: (m: number, e: number, c: number) => m >= 7     },
  { id: 'exercise_3',   emoji: '💪', title: '운동 습관',    desc: '3일 연속 운동 기록',         check: (m: number, e: number, c: number) => e >= 3     },
  { id: 'exercise_7',   emoji: '🏆', title: '운동 마스터',  desc: '7일 연속 운동 기록',         check: (m: number, e: number, c: number) => e >= 7     },
  { id: 'calorie_5',    emoji: '🎯', title: '목표 달인',    desc: '5일 칼로리 목표 달성',       check: (m: number, e: number, c: number) => c >= 5     },
  { id: 'perfect_week', emoji: '⭐', title: '완벽한 한 주', desc: '식단·운동·목표 모두 달성',   check: (m: number, e: number, c: number) => m >= 7 && e >= 7 && c >= 5 },
] as const

/* ── 챌린지 카드 ── */
function ChallengeCard({
  emoji, title, current, target, colorClass, done,
}: { emoji: string; title: string; current: number; target: number; colorClass: string; done: boolean }) {
  const pct = Math.min(Math.round((current / target) * 100), 100)
  return (
    <div className={`rounded-2xl p-3.5 border transition-all ${done ? 'border-[#2d7a4f]/25 shadow-sm' : 'border-line bg-surface'}`}
      style={{ background: done ? undefined : undefined }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xl">{emoji}</span>
        {done && (
          <span className="text-[9px] font-bold text-white bg-[#2d7a4f] px-1.5 py-0.5 rounded-full">완료 ✓</span>
        )}
      </div>
      <p className="text-[11px] font-bold text-ink leading-tight mb-0.5">{title}</p>
      <p className={`text-xl font-black tracking-tight ${done ? colorClass : 'text-ink'}`}>
        {current}
        <span className="text-xs font-normal text-ink-5 ml-0.5">/{target}일</span>
      </p>
      <div className="h-1.5 bg-line-2 rounded-full mt-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${done ? 'bg-[#2d7a4f]' : 'bg-[#2d7a4f]/40'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

/* ── 메인 컴포넌트 ── */
type Props = {
  userId: string | null
  weekData?: DayNutrition[]
  goal?: GoalInfo
}

export function HealthChallenge({ userId, weekData = [], goal }: Props) {
  const [mealStreak, setMealStreak]         = useState(0)
  const [exerciseStreak, setExerciseStreak] = useState(0)
  const [loading, setLoading]               = useState(true)
  const [tooltip, setTooltip]               = useState<string | null>(null)

  const loadStreaks = useCallback(async () => {
    if (!userId) { setLoading(false); return }
    const supabase = createClient()
    const since = new Date(Date.now() - 14 * 86400000).toISOString().split('T')[0]

    const [{ data: meals }, { data: exercises }] = await Promise.all([
      supabase.from('meal_logs').select('date').eq('user_id', userId).gte('date', since),
      supabase.from('exercise_logs').select('date').eq('user_id', userId).gte('date', since),
    ])

    setMealStreak(calcStreak([...new Set((meals ?? []).map(m => String(m.date)))]))
    setExerciseStreak(calcStreak([...new Set((exercises ?? []).map(e => String(e.date)))]))
    setLoading(false)
  }, [userId])

  useEffect(() => { loadStreaks() }, [loadStreaks])

  const goalDays = goal ? calcGoalDays(weekData, goal.calTarget) : 0

  const challenges = [
    { emoji: '🔥', title: '식단 연속',       current: mealStreak,     target: 7, colorClass: 'text-orange-500' },
    { emoji: '💪', title: '운동 연속',       current: exerciseStreak, target: 7, colorClass: 'text-blue-500'   },
    { emoji: '🎯', title: '칼로리 목표',     current: goalDays,       target: 7, colorClass: 'text-green-600'  },
  ]

  const badges = BADGE_DEFS.map(b => ({
    ...b,
    earned: b.check(mealStreak, exerciseStreak, goalDays),
  }))
  const earnedCount = badges.filter(b => b.earned).length

  return (
    <div className="space-y-5">
      {/* 헤더 */}
      <div className="flex items-center gap-2">
        <Trophy size={15} className="text-[#2d7a4f]" />
        <h3 className="text-sm font-bold text-ink">건강 챌린지</h3>
        <span className="ml-auto text-[11px] font-medium text-ink-5">
          배지 <span className="text-[#2d7a4f] font-bold">{earnedCount}</span>/{badges.length}
        </span>
      </div>

      {/* 챌린지 카드 */}
      {loading ? (
        <div className="grid grid-cols-3 gap-3">
          {[0,1,2].map(i => <div key={i} className="h-28 rounded-2xl bg-tint animate-pulse" />)}
        </div>
      ) : !userId ? (
        <div className="text-center py-6 bg-tint rounded-2xl">
          <p className="text-sm text-ink-4 mb-3">로그인하면 챌린지에 참여할 수 있어요!</p>
          <a href="/login" className="text-sm font-semibold text-[#2d7a4f] hover:underline">로그인하기 →</a>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {challenges.map(c => (
            <ChallengeCard key={c.title} {...c} done={c.current >= c.target} />
          ))}
        </div>
      )}

      {/* 진행 팁 */}
      {userId && !loading && (
        <div className="text-xs text-ink-5 bg-tint rounded-xl px-3 py-2 space-y-0.5">
          {mealStreak === 0     && <p>🍱 오늘 식단을 기록하면 연속 기록이 시작돼요!</p>}
          {mealStreak > 0 && mealStreak < 7 && <p>🔥 {mealStreak}일째 연속 중! 7일까지 {7 - mealStreak}일 남았어요.</p>}
          {exerciseStreak === 0 && <p>💪 운동 탭에서 오늘 운동을 기록해 보세요!</p>}
          {mealStreak >= 7 && exerciseStreak >= 7 && <p>🏆 완벽한 한 주! 이번 주도 훌륭해요.</p>}
        </div>
      )}

      {/* 배지 그리드 */}
      <div>
        <p className="text-xs font-semibold text-ink-3 mb-3">획득 배지</p>
        <div className="grid grid-cols-4 gap-2">
          {badges.map(b => (
            <button
              key={b.id}
              onClick={() => setTooltip(tooltip === b.id ? null : b.id)}
              className={`relative flex flex-col items-center gap-1 p-2.5 rounded-2xl border transition-all text-center ${
                b.earned
                  ? 'bg-surface border-[#2d7a4f]/20 shadow-sm hover:shadow-md'
                  : 'bg-tint border-transparent opacity-45 grayscale'
              }`}
            >
              <span className="text-[22px] leading-none">
                {b.earned ? b.emoji : <Lock size={16} className="text-ink-5" />}
              </span>
              <p className="text-[9px] font-semibold text-ink-3 leading-tight">{b.title}</p>

              {/* 툴팁 */}
              {tooltip === b.id && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-20 w-28 bg-ink text-white text-[10px] rounded-lg px-2 py-1.5 shadow-lg leading-snug text-center pointer-events-none">
                  {b.desc}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-ink" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

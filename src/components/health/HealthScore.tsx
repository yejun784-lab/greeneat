'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { DayNutrition, GoalInfo } from '@/lib/health-types'

interface ScoreDetail {
  nutrition: number   // /35
  exercise:  number   // /25
  water:     number   // /20
  sleep:     number   // /20
}

function calcNutritionScore(today: DayNutrition, goal: GoalInfo): number {
  if (goal.calTarget === 0) return 0

  // 칼로리 (15점): 목표의 80~110% = 만점
  const calPct = today.cal / goal.calTarget
  const calScore = calPct >= 0.8 && calPct <= 1.1 ? 15
    : calPct >= 0.65 && calPct <= 1.2 ? 8 : calPct > 0 ? 3 : 0

  // 단백질 (12점): 목표 80%+ = 만점
  const protPct = goal.proteinTarget > 0 ? today.protein / goal.proteinTarget : 0
  const protScore = protPct >= 0.8 ? 12 : protPct >= 0.5 ? 7 : protPct > 0 ? 3 : 0

  // 탄수화물·지방 균형 (8점): 각각 목표의 70%+ = 4점
  const carbOk = goal.carbsTarget > 0 && today.carbs / goal.carbsTarget >= 0.7 ? 4 : today.carbs > 0 ? 2 : 0
  const fatOk  = goal.fatTarget > 0  && today.fat  / goal.fatTarget  >= 0.7 ? 4 : today.fat  > 0 ? 2 : 0

  return Math.min(35, calScore + protScore + carbOk + fatOk)
}

function calcExerciseScore(totalMin: number, totalCal: number): number {
  if (totalMin === 0) return 0
  const timeScore = totalMin >= 60 ? 18 : totalMin >= 30 ? 14 : totalMin >= 15 ? 8 : 4
  // 칼로리 소모 보너스: 300kcal 이상이면 +7점
  const calBonus = totalCal >= 300 ? 7 : totalCal >= 150 ? 4 : totalCal > 0 ? 2 : 0
  return Math.min(25, timeScore + calBonus)
}

function calcWaterScore(totalMl: number, goalMl: number): number {
  if (goalMl === 0) return 0
  const pct = totalMl / goalMl
  return Math.min(20, Math.round(pct * 20))
}

function calcSleepScore(hours: number, quality: number): number {
  // 수면 시간 (15점): 7~9시간 만점
  const timeScore = hours >= 7 && hours <= 9 ? 15
    : hours >= 6 && hours < 7  ? 10
    : hours > 9 && hours <= 10 ? 10
    : hours >= 5 ? 5 : hours > 0 ? 2 : 0
  // 품질 (5점): 1~5 → 0~5점
  const qualityScore = quality > 0 ? Math.round((quality - 1) * 1.25) : 0
  return Math.min(20, timeScore + qualityScore)
}

function getScoreColor(score: number) {
  if (score >= 90) return { text: 'text-emerald-500', bg: 'bg-emerald-500', label: '최상', emoji: '🏆' }
  if (score >= 75) return { text: 'text-[#2d7a4f]', bg: 'bg-[#2d7a4f]', label: '좋음', emoji: '😊' }
  if (score >= 55) return { text: 'text-orange-500', bg: 'bg-orange-500', label: '보통', emoji: '😐' }
  return { text: 'text-red-400', bg: 'bg-red-400', label: '노력 필요', emoji: '💪' }
}

interface Props {
  userId: string | null
  date: string
  today: DayNutrition
  goal: GoalInfo
  waterGoalMl: number
}

export function HealthScore({ userId, date, today, goal, waterGoalMl }: Props) {
  const [detail, setDetail] = useState<ScoreDetail>({ nutrition: 0, exercise: 0, water: 0, sleep: 0 })
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!userId) { setLoaded(true); return }
    const supabase = createClient()

    Promise.all([
      supabase.from('exercise_logs').select('duration_min, calories_burned').eq('user_id', userId).eq('date', date),
      supabase.from('water_logs').select('amount_ml').eq('user_id', userId).eq('date', date),
      supabase.from('sleep_logs').select('sleep_start, sleep_end, quality').eq('user_id', userId).eq('date', date).maybeSingle(),
    ]).then(([{ data: ex }, { data: wa }, { data: sl }]) => {
      const totalMin = (ex ?? []).reduce((s: number, r: { duration_min: number }) => s + r.duration_min, 0)
      const totalCal = (ex ?? []).reduce((s: number, r: { calories_burned: number | null }) => s + (r.calories_burned ?? 0), 0)
      const totalWater = (wa ?? []).reduce((s: number, r: { amount_ml: number }) => s + r.amount_ml, 0)

      let sleepHours = 0, sleepQuality = 0
      if (sl) {
        const [sh, sm] = (sl.sleep_start ?? '').split(':').map(Number)
        const [eh, em] = (sl.sleep_end ?? '').split(':').map(Number)
        let mins = (eh * 60 + em) - (sh * 60 + sm)
        if (mins < 0) mins += 24 * 60
        sleepHours = Math.round(mins / 6) / 10
        sleepQuality = sl.quality ?? 0
      }

      setDetail({
        nutrition: calcNutritionScore(today, goal),
        exercise:  calcExerciseScore(totalMin, totalCal),
        water:     calcWaterScore(totalWater, waterGoalMl),
        sleep:     calcSleepScore(sleepHours, sleepQuality),
      })
      setLoaded(true)
    })
  }, [userId, date, today, goal, waterGoalMl])

  const total = detail.nutrition + detail.exercise + detail.water + detail.sleep
  const color = getScoreColor(total)
  const circumference = 2 * Math.PI * 54
  const dashOffset = circumference - (circumference * total) / 100

  const breakdown = [
    { label: '영양', score: detail.nutrition, max: 35, emoji: '🥗' },
    { label: '운동', score: detail.exercise,  max: 25, emoji: '🏋️' },
    { label: '수분', score: detail.water,     max: 20, emoji: '💧' },
    { label: '수면', score: detail.sleep,     max: 20, emoji: '🌙' },
  ]

  if (!loaded) {
    return <div className="h-48 bg-surface rounded-2xl border border-line animate-pulse" />
  }

  return (
    <div className="bg-surface rounded-2xl border border-line p-5">
      <div className="flex items-center gap-2 mb-5">
        <span className="text-lg">⭐</span>
        <h2 className="font-semibold text-ink">GreenEat Score</h2>
        <span className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full ${color.text} bg-opacity-10`}
          style={{ backgroundColor: 'transparent', border: `1.5px solid currentColor` }}>
          {color.emoji} {color.label}
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* 원형 게이지 */}
        <div className="relative shrink-0">
          <svg width="128" height="128" viewBox="0 0 128 128">
            {/* 배경 트랙 */}
            <circle cx="64" cy="64" r="54" fill="none" stroke="currentColor"
              className="text-line-2" strokeWidth="10" />
            {/* 진행 바 */}
            <circle cx="64" cy="64" r="54" fill="none"
              stroke="currentColor" className={color.text} strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 64 64)"
              style={{ transition: 'stroke-dashoffset 1s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-black ${color.text}`}>{total}</span>
            <span className="text-xs text-ink-5 font-medium">/ 100</span>
          </div>
        </div>

        {/* 세부 점수 */}
        <div className="flex-1 space-y-2.5">
          {breakdown.map(({ label, score, max, emoji }) => (
            <div key={label}>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-ink-3">{emoji} {label}</span>
                <span className="font-semibold text-ink">{score}<span className="text-ink-5 font-normal">/{max}</span></span>
              </div>
              <div className="w-full h-1.5 bg-line-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${color.bg}`}
                  style={{ width: `${(score / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 하단 메시지 */}
      <div className="mt-4 pt-4 border-t border-line">
        {total === 0 && !userId ? (
          <p className="text-xs text-ink-5 text-center">
            <a href="/login" className="text-[#2d7a4f] font-medium underline">로그인</a>하면 오늘의 건강 점수를 확인할 수 있어요
          </p>
        ) : total < 40 ? (
          <p className="text-xs text-ink-4 text-center">오늘 데이터를 기록하면 점수가 올라가요 📝</p>
        ) : total >= 90 ? (
          <p className="text-xs text-emerald-600 text-center font-medium">🏆 오늘 완벽한 하루예요!</p>
        ) : (
          <p className="text-xs text-ink-4 text-center">
            {detail.exercise === 0 ? '운동을 기록하면 점수가 올라가요 💪' :
             detail.water < 15 ? '물을 조금 더 마셔보세요 💧' :
             detail.sleep === 0 ? '수면을 기록하면 점수가 올라가요 🌙' :
             '잘 하고 있어요! 조금만 더 💚'}
          </p>
        )}
      </div>
    </div>
  )
}

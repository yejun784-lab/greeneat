'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Target, Trophy } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

/* ── 운동 플랜 데이터 ─────────────────────────────────────────── */
type ExItem = {
  name: string
  emoji: string
  duration: number
  detail: string
  intensity: '저강도' | '중강도' | '고강도'
}
type DayPlan = { day: string; rest: boolean; items: ExItem[] }
type Plan = { label: string; description: string; weeklyGoal: string; days: DayPlan[] }

const PLANS: Record<string, Plan> = {
  diet: {
    label: '다이어트',
    description: '칼로리 소모를 극대화하는 유산소 중심 플랜이에요.',
    weeklyGoal: '주 4~5일 · 총 150분 이상',
    days: [
      { day: '월', rest: false, items: [{ name: '달리기', emoji: '🏃', duration: 30, detail: '6~8km/h 속도로 꾸준히 유지하세요. 대화 가능한 강도가 적당해요.', intensity: '중강도' }] },
      { day: '화', rest: false, items: [{ name: '헬스', emoji: '🏋️', duration: 40, detail: '전신 근력 서킷 — 스쿼트·푸시업·런지 각 12회 × 3세트', intensity: '중강도' }] },
      { day: '수', rest: true, items: [] },
      { day: '목', rest: false, items: [
        { name: '자전거', emoji: '🚴', duration: 30, detail: '인터벌 방식 — 2분 빠르게 / 1분 천천히 반복', intensity: '중강도' },
        { name: '요가', emoji: '🧘', duration: 20, detail: '운동 후 스트레칭 + 코어 안정화 자세', intensity: '저강도' },
      ]},
      { day: '금', rest: false, items: [{ name: 'HIIT', emoji: '🔥', duration: 25, detail: '20초 전력 운동 / 10초 휴식 — 8세트 × 2라운드', intensity: '고강도' }] },
      { day: '토', rest: false, items: [{ name: '달리기', emoji: '🏃', duration: 40, detail: '낮은 강도로 긴 거리 조깅 — LSD(Long Slow Distance)', intensity: '저강도' }] },
      { day: '일', rest: true, items: [] },
    ],
  },
  muscle: {
    label: '근육 증가',
    description: '점진적 과부하 원칙의 근력 중심 분할 플랜이에요.',
    weeklyGoal: '주 4~5일 · 총 200분 이상',
    days: [
      { day: '월', rest: false, items: [{ name: '헬스', emoji: '🏋️', duration: 60, detail: '가슴·삼두 — 벤치프레스 4세트, 딥스 3세트, 케이블 플라이 3세트', intensity: '고강도' }] },
      { day: '화', rest: false, items: [{ name: '헬스', emoji: '🏋️', duration: 60, detail: '등·이두 — 랫풀다운 4세트, 바벨로우 4세트, 바이셉컬 3세트', intensity: '고강도' }] },
      { day: '수', rest: true, items: [] },
      { day: '목', rest: false, items: [{ name: '헬스', emoji: '🏋️', duration: 60, detail: '하체 — 바벨스쿼트 5세트, 레그프레스 4세트, 루마니안 데드 3세트', intensity: '고강도' }] },
      { day: '금', rest: false, items: [{ name: '헬스', emoji: '🏋️', duration: 50, detail: '어깨·전신 — 오버헤드프레스 4세트, 데드리프트 3세트, 플랭크 3×60초', intensity: '고강도' }] },
      { day: '토', rest: false, items: [{ name: '달리기', emoji: '🏃', duration: 30, detail: '가벼운 유산소로 회복 촉진 + 폼롤러 스트레칭', intensity: '저강도' }] },
      { day: '일', rest: true, items: [] },
    ],
  },
  maintain: {
    label: '체중 유지',
    description: '현재 체중과 체력을 유지하는 균형 플랜이에요.',
    weeklyGoal: '주 3~4일 · 총 120분 이상',
    days: [
      { day: '월', rest: false, items: [{ name: '달리기', emoji: '🏃', duration: 30, detail: '편안한 속도로 유산소 — 심박수 130~150 유지', intensity: '중강도' }] },
      { day: '화', rest: true, items: [] },
      { day: '수', rest: false, items: [{ name: '헬스', emoji: '🏋️', duration: 40, detail: '전신 근력 유지 — 주요 근육군 각 2세트, 12~15회', intensity: '중강도' }] },
      { day: '목', rest: true, items: [] },
      { day: '금', rest: false, items: [
        { name: '자전거', emoji: '🚴', duration: 25, detail: '가벼운 유산소 또는 빠른 걷기', intensity: '저강도' },
        { name: '요가', emoji: '🧘', duration: 20, detail: '유연성 + 이완 자세 중심', intensity: '저강도' },
      ]},
      { day: '토', rest: false, items: [{ name: '등산', emoji: '🧗', duration: 60, detail: '주말 아웃도어 활동 — 경사로 걷기로 자연스러운 근력·유산소 복합', intensity: '중강도' }] },
      { day: '일', rest: true, items: [] },
    ],
  },
  health: {
    label: '건강 관리',
    description: '심폐 기능과 근력을 함께 기르는 건강 중심 플랜이에요.',
    weeklyGoal: '주 3~4일 · 총 130분 이상',
    days: [
      { day: '월', rest: false, items: [{ name: '달리기', emoji: '🏃', duration: 30, detail: '중간 강도 유산소 — 심폐 기능 향상에 효과적', intensity: '중강도' }] },
      { day: '화', rest: true, items: [] },
      { day: '수', rest: false, items: [{ name: '헬스', emoji: '🏋️', duration: 40, detail: '기능성 전신 운동 — 데드리프트·스쿼트·푸시업 각 8~12회 × 3세트', intensity: '중강도' }] },
      { day: '목', rest: true, items: [] },
      { day: '금', rest: false, items: [{ name: 'HIIT', emoji: '🔥', duration: 20, detail: '타바타 프로토콜 — 20초 전력 / 10초 휴식 × 8라운드 × 2세트', intensity: '고강도' }] },
      { day: '토', rest: false, items: [{ name: '수영', emoji: '🏊', duration: 40, detail: '전신 운동 + 관절 부담 최소화 — 자유형·배영 번갈아 수영', intensity: '중강도' }] },
      { day: '일', rest: true, items: [] },
    ],
  },
  balanced: {
    label: '균형식',
    description: '활동량을 꾸준히 유지하는 기본 균형 플랜이에요.',
    weeklyGoal: '주 3일 · 총 100분 이상',
    days: [
      { day: '월', rest: false, items: [{ name: '걷기', emoji: '🚶', duration: 40, detail: '빠른 걸음 — 6,000~8,000보 이상, 체중 관리의 기본', intensity: '저강도' }] },
      { day: '화', rest: true, items: [] },
      { day: '수', rest: false, items: [{ name: '헬스', emoji: '🏋️', duration: 30, detail: '기본 전신 운동 — 머신 위주로 부상 위험 낮게', intensity: '중강도' }] },
      { day: '목', rest: true, items: [] },
      { day: '금', rest: false, items: [{ name: '요가', emoji: '🧘', duration: 30, detail: '유연성 향상 + 스트레스 해소 — 흐름 요가 권장', intensity: '저강도' }] },
      { day: '토', rest: false, items: [{ name: '달리기', emoji: '🏃', duration: 30, detail: '주말 가벼운 조깅 — 5~7km 목표', intensity: '중강도' }] },
      { day: '일', rest: true, items: [] },
    ],
  },
}

const INTENSITY_STYLE = {
  '저강도': { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', badge: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300' },
  '중강도': { bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400', badge: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300' },
  '고강도': { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400', badge: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300' },
}

const DAY_NAMES_KR = ['일', '월', '화', '수', '목', '금', '토'] as const

function getWeekDateMap(dateStr: string): Record<string, string> {
  const map: Record<string, string> = {}
  const today = new Date(dateStr + 'T12:00:00')
  const dow = today.getDay() // 0=일
  const monday = new Date(today)
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1))
  const dayNames = ['월', '화', '수', '목', '금', '토', '일']
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    map[dayNames[i]] = d.toISOString().slice(0, 10)
  }
  return map
}

interface Props {
  goal: string
  userId: string | null
  date: string
}

export function ExercisePlan({ goal, userId, date }: Props) {
  const [exercisedDates, setExercisedDates] = useState<Set<string>>(new Set())
  const [expanded, setExpanded] = useState<string | null>(null)

  const plan = PLANS[goal] ?? PLANS.balanced
  const weekDateMap = getWeekDateMap(date)
  const todayDayName = DAY_NAMES_KR[new Date(date + 'T12:00:00').getDay()]

  /* 이번 주 운동 기록 fetch */
  useEffect(() => {
    if (!userId) return
    const supabase = createClient()
    const weekDates = Object.values(weekDateMap)
    const weekStart = weekDates[0]
    const weekEnd = weekDates[weekDates.length - 1]
    supabase
      .from('exercise_logs')
      .select('date')
      .eq('user_id', userId)
      .gte('date', weekStart)
      .lte('date', weekEnd)
      .then(({ data }) => {
        setExercisedDates(new Set((data ?? []).map((r: { date: string }) => r.date)))
      })
  }, [userId, date]) // eslint-disable-line react-hooks/exhaustive-deps

  const activeDays = plan.days.filter(d => !d.rest)
  const completedCount = activeDays.filter(d => exercisedDates.has(weekDateMap[d.day] ?? '')).length
  const completionPct = activeDays.length > 0 ? Math.round((completedCount / activeDays.length) * 100) : 0

  return (
    <div className="bg-surface rounded-2xl border border-line p-5 space-y-5">
      {/* 헤더 */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Target size={16} className="text-[#2d7a4f]" />
            <span className="font-semibold text-ink">주간 운동 플랜</span>
            <span className="text-xs font-semibold px-2 py-0.5 bg-green-tint text-[#2d7a4f] rounded-full">
              {plan.label}
            </span>
          </div>
          <p className="text-xs text-ink-4">{plan.description}</p>
        </div>

        {/* 달성률 원형 */}
        <div className="relative w-12 h-12 shrink-0">
          <svg className="w-12 h-12 -rotate-90" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="18" fill="none" stroke="currentColor" strokeWidth="4" className="text-line-2" />
            <circle
              cx="22" cy="22" r="18" fill="none"
              stroke="#2d7a4f" strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${completionPct * 1.13} 113`}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-ink">
            {completionPct}%
          </span>
        </div>
      </div>

      {/* 주간 목표 칩 */}
      <div className="flex items-center gap-2 px-3 py-2 bg-tint rounded-xl text-xs text-ink-4">
        <Trophy size={12} className="text-[#c2762a] shrink-0" />
        <span>목표: <strong className="text-ink-3">{plan.weeklyGoal}</strong></span>
        <span className="ml-auto text-ink-5">
          {completedCount}/{activeDays.length}일 완료
        </span>
      </div>

      {/* 요일별 플랜 */}
      <div className="space-y-2">
        {plan.days.map((day) => {
          const dayDate = weekDateMap[day.day] ?? ''
          const isCompleted = !day.rest && exercisedDates.has(dayDate)
          const isToday = day.day === todayDayName
          const isFuture = dayDate > date
          const isExpanded = expanded === day.day

          return (
            <div
              key={day.day}
              className={`rounded-xl border transition-all ${
                isToday
                  ? 'border-[#2d7a4f]/40 bg-[#e8f5ee] dark:bg-[#1e2e1a]'
                  : 'border-line bg-wash/40'
              }`}
            >
              <button
                className="w-full flex items-center gap-3 px-4 py-3 text-left"
                onClick={() => !day.rest && setExpanded(isExpanded ? null : day.day)}
                disabled={day.rest}
              >
                {/* 완료 아이콘 */}
                {day.rest ? (
                  <span className="text-lg shrink-0">😴</span>
                ) : isCompleted ? (
                  <CheckCircle2 size={18} className="text-[#2d7a4f] shrink-0" />
                ) : (
                  <Circle size={18} className={`shrink-0 ${isFuture ? 'text-ink-5/40' : isToday ? 'text-[#2d7a4f]' : 'text-ink-5'}`} />
                )}

                {/* 요일 */}
                <span className={`text-sm font-bold w-5 shrink-0 ${isToday ? 'text-[#2d7a4f]' : 'text-ink-3'}`}>
                  {day.day}
                </span>

                {day.rest ? (
                  <span className="text-xs text-ink-5 flex-1">휴식일 — 가벼운 스트레칭 · 충분한 수면</span>
                ) : (
                  <>
                    <div className="flex-1 flex flex-wrap items-center gap-x-3 gap-y-1 min-w-0">
                      {day.items.map((item, i) => (
                        <span key={i} className="flex items-center gap-1 text-xs">
                          <span>{item.emoji}</span>
                          <span className={`font-medium ${isToday ? 'text-ink' : isFuture ? 'text-ink-4' : 'text-ink-3'}`}>
                            {item.name}
                          </span>
                          <span className="text-ink-5">{item.duration}분</span>
                        </span>
                      ))}
                    </div>
                    {isExpanded
                      ? <ChevronUp size={14} className="text-ink-5 shrink-0" />
                      : <ChevronDown size={14} className="text-ink-5 shrink-0" />
                    }
                  </>
                )}

                {isToday && !day.rest && (
                  <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 bg-[#2d7a4f] text-white rounded-full">
                    오늘
                  </span>
                )}
                {isCompleted && !isToday && (
                  <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 bg-green-tint text-[#2d7a4f] rounded-full">
                    완료 ✓
                  </span>
                )}
              </button>

              {/* 확장 상세 */}
              {isExpanded && !day.rest && (
                <div className="px-4 pb-4 space-y-2.5 border-t border-line pt-3">
                  {day.items.map((item, i) => {
                    const style = INTENSITY_STYLE[item.intensity]
                    return (
                      <div key={i} className={`p-3 rounded-xl ${style.bg}`}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-sm font-semibold text-ink">
                            {item.emoji} {item.name} · {item.duration}분
                          </span>
                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${style.badge}`}>
                            {item.intensity}
                          </span>
                        </div>
                        <p className="text-xs text-ink-4 leading-relaxed">{item.detail}</p>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <p className="text-[11px] text-ink-5 text-center pt-1">
        💡 운동 후 &lsquo;오늘의 운동&rsquo; 탭에서 기록하면 달성 현황이 반영돼요
      </p>
    </div>
  )
}

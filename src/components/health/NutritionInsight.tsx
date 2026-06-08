'use client'

import { useState, useMemo } from 'react'
import { TrendingUp, ChevronDown, ChevronUp, Info, Lightbulb } from 'lucide-react'
import type { DayNutrition, GoalInfo } from '@/lib/health-types'

/* ── 상태 판정 ─────────────────────────────────────────────────── */
type Status = 'great' | 'good' | 'low' | 'very_low' | 'excess'

function getStatus(pct: number): Status {
  if (pct > 115) return 'excess'
  if (pct >= 90) return 'great'
  if (pct >= 70) return 'good'
  if (pct >= 45) return 'low'
  return 'very_low'
}

const STATUS_META: Record<Status, { label: string; textColor: string; bgColor: string; barColor: string }> = {
  great:    { label: '적정',       textColor: 'text-green-700 dark:text-green-400',   bgColor: 'bg-green-50 dark:bg-green-900/25',   barColor: 'bg-green-500' },
  good:     { label: '양호',       textColor: 'text-sky-700 dark:text-sky-400',       bgColor: 'bg-sky-50 dark:bg-sky-900/25',       barColor: 'bg-sky-500' },
  low:      { label: '부족',       textColor: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-50 dark:bg-orange-900/25', barColor: 'bg-orange-400' },
  very_low: { label: '크게 부족',  textColor: 'text-red-600 dark:text-red-400',       bgColor: 'bg-red-50 dark:bg-red-900/25',       barColor: 'bg-red-500' },
  excess:   { label: '초과',       textColor: 'text-violet-600 dark:text-violet-400', bgColor: 'bg-violet-50 dark:bg-violet-900/25', barColor: 'bg-violet-500' },
}

/* ── 목표별 영양소 팁 ──────────────────────────────────────────── */
type NutrientTip = { deficit: string; excess: string; great: string; foods: string[] }
type TipMap = Record<string, NutrientTip>

const TIPS: Record<string, TipMap> = {
  diet: {
    cal: {
      deficit: '칼로리가 너무 낮으면 근육이 손실되고 기초대사량이 떨어질 수 있어요. 최소 1,200kcal는 유지하세요.',
      excess:  '칼로리 초과가 지속되면 지방으로 저장돼요. 다음 끼니를 가볍게 조정하거나 운동량을 늘려보세요.',
      great:   '칼로리 섭취가 목표 범위에 맞게 잘 조절되고 있어요! 이 패턴을 유지하세요.',
      foods:   ['닭가슴살', '두부', '계란흰자', '브로콜리', '고구마', '현미밥'],
    },
    protein: {
      deficit: '다이어트 중 단백질 부족은 근육 손실로 이어져요. 매 끼니 손바닥 크기의 단백질 식품을 챙기세요.',
      excess:  '단백질 초과는 크게 걱정 없어요. 다만 신장 부담을 줄이려면 수분을 충분히 마셔주세요.',
      great:   '단백질 목표를 잘 달성하고 있어요! 근육 유지와 포만감에 모두 도움이 돼요.',
      foods:   ['닭가슴살', '참치캔', '그릭요거트', '두부', '계란', '저지방 치즈'],
    },
    carbs: {
      deficit: '탄수화물이 부족하면 에너지 부족과 집중력 저하가 생겨요. 통곡물 위주로 섭취하세요.',
      excess:  '탄수화물 초과가 반복되면 다이어트 효율이 떨어져요. 정제 탄수화물(흰쌀·빵·과자)을 줄여보세요.',
      great:   '탄수화물 섭취가 균형 잡혀 있어요. 통곡물 비중이 높다면 더욱 좋아요!',
      foods:   ['현미밥', '고구마', '오트밀', '통밀빵', '퀴노아'],
    },
    fat: {
      deficit: '지방이 너무 적으면 지용성 비타민(A·D·E·K) 흡수가 어려워요. 건강한 불포화지방을 섭취하세요.',
      excess:  '지방은 칼로리 밀도가 가장 높아요(9kcal/g). 볶음·튀김 조리법을 굽기·찌기로 바꿔보세요.',
      great:   '지방 섭취가 적절해요. 불포화지방산 비율이 높을수록 더 건강해요.',
      foods:   ['아보카도', '아몬드', '연어', '올리브유', '들기름'],
    },
  },
  muscle: {
    cal: {
      deficit: '근육 증가를 위해서는 칼로리 잉여 상태가 필요해요. 운동 전후로 탄수화물+단백질을 챙기세요.',
      excess:  '잉여 칼로리가 근육 성장을 돕지만, 너무 많으면 체지방도 늘어요. 주 0.3~0.5kg 증가를 목표로 하세요.',
      great:   '칼로리가 적절히 잉여 상태를 유지하고 있어요. 린벌크에 최적인 수준이에요!',
      foods:   ['현미밥', '고구마', '바나나', '닭가슴살', '소고기', '아보카도'],
    },
    protein: {
      deficit: '근육 합성에 단백질이 가장 중요해요. 체중 1kg당 1.8~2.2g을 목표로 하세요. 운동 후 30분 이내 섭취가 효과적이에요.',
      excess:  '단백질을 많이 먹는 건 괜찮아요! 다만 수분을 하루 2L 이상 마셔서 신장을 보호하세요.',
      great:   '단백질 목표를 잘 채우고 있어요. 근육 단백질 합성에 충분한 원료가 공급되고 있어요!',
      foods:   ['닭가슴살', '소고기(안심)', '참치', '연어', '유청 단백질', '그릭요거트'],
    },
    carbs: {
      deficit: '탄수화물은 근력 운동의 에너지원이에요. 부족하면 세트 후반 퍼포먼스가 떨어져요. 운동 1~2시간 전에 섭취하세요.',
      excess:  '탄수화물이 많으면 글리코겐 탱크가 가득 차요. 훈련 볼륨을 높여 소비량을 늘려보세요.',
      great:   '근력 운동에 필요한 탄수화물이 잘 공급되고 있어요. 훈련 퍼포먼스를 최대로 낼 수 있어요.',
      foods:   ['흰밥', '파스타', '바나나', '고구마', '오트밀', '통밀빵'],
    },
    fat: {
      deficit: '건강한 지방은 테스토스테론 같은 동화 호르몬 생성에 필요해요. 너무 적지 않게 유지하세요.',
      excess:  '지방 칼로리 비중이 높아요. 단백질과 탄수화물 비중을 높이는 방향으로 조절해보세요.',
      great:   '지방 섭취가 호르몬 균형 유지에 적합한 수준이에요.',
      foods:   ['아보카도', '견과류', '연어', '달걀노른자', '올리브유'],
    },
  },
  health: {
    cal: {
      deficit: '건강 유지를 위해 적절한 칼로리 섭취가 필요해요. 에너지 부족은 면역 기능 저하로 이어질 수 있어요.',
      excess:  '칼로리가 조금 높아요. 가공식품·단 음료 대신 자연식품 위주로 바꿔보세요.',
      great:   '건강한 칼로리 균형을 유지하고 있어요!',
      foods:   ['현미밥', '채소', '두부', '닭가슴살', '생선', '과일'],
    },
    protein: {
      deficit: '면역 세포, 효소, 호르몬 모두 단백질로 만들어져요. 다양한 식물성+동물성 단백질을 섭취해보세요.',
      excess:  '단백질 섭취가 충분해요. 균형 잡힌 영양소 배분을 유지하세요.',
      great:   '단백질이 잘 공급되고 있어요. 신체 기능 유지에 충분한 원료가 있어요!',
      foods:   ['닭가슴살', '계란', '두부', '콩류', '그릭요거트', '생선'],
    },
    carbs: {
      deficit: '뇌와 신경계는 탄수화물(포도당)을 주 에너지원으로 사용해요. 통곡물로 꾸준히 공급하세요.',
      excess:  '탄수화물 과잉은 혈당 스파이크를 유발할 수 있어요. GI 지수가 낮은 식품을 선택하세요.',
      great:   '탄수화물이 적절히 공급되고 있어요. 통곡물 비중을 높이면 더욱 좋아요!',
      foods:   ['현미밥', '잡곡밥', '고구마', '오트밀', '통밀빵', '퀴노아'],
    },
    fat: {
      deficit: '오메가3 지방산은 항염증 효과가 있어요. 생선·들기름·견과류로 불포화지방을 섭취하세요.',
      excess:  '포화지방 섭취를 줄이고 불포화지방 비중을 높여보세요.',
      great:   '건강한 지방 균형을 유지하고 있어요!',
      foods:   ['연어', '고등어', '들기름', '아보카도', '아몬드', '호두'],
    },
  },
  maintain: {
    cal: {
      deficit: '체중 유지를 위해 소비 칼로리에 맞는 섭취가 필요해요. 조금 더 드셔도 괜찮아요.',
      excess:  '조금씩 칼로리가 초과되면 서서히 체중이 늘 수 있어요. 간식·음료 칼로리를 체크해보세요.',
      great:   '체중 유지에 딱 맞는 칼로리 균형이에요! 이 패턴을 유지하세요.',
      foods:   ['잡곡밥', '닭가슴살', '채소', '과일', '견과류'],
    },
    protein: {
      deficit: '근육 손실 없이 체중을 유지하려면 적절한 단백질이 필요해요.',
      excess:  '단백질이 충분해요. 균형 잡힌 식사를 이어가세요.',
      great:   '단백질 목표를 잘 달성하고 있어요!',
      foods:   ['닭가슴살', '두부', '계란', '그릭요거트', '콩류'],
    },
    carbs: {
      deficit: '일상적인 활동 에너지를 위해 탄수화물을 조금 더 챙기세요.',
      excess:  '탄수화물이 약간 높아요. 정제 탄수화물보다 통곡물을 선택하면 혈당이 안정돼요.',
      great:   '탄수화물 균형이 잘 잡혀 있어요!',
      foods:   ['현미밥', '고구마', '통밀빵', '오트밀'],
    },
    fat: {
      deficit: '건강한 지방을 챙겨서 지용성 비타민을 흡수하세요.',
      excess:  '지방 섭취가 약간 높아요. 조리법을 가볍게 바꿔보세요.',
      great:   '지방 섭취가 균형 잡혀 있어요!',
      foods:   ['아보카도', '올리브유', '연어', '견과류'],
    },
  },
}

// 없는 goal은 health로 fallback
function getTip(goalType: string, key: string): NutrientTip {
  const map = TIPS[goalType] ?? TIPS.health
  return map[key] ?? TIPS.health[key]
}

/* ── 컴포넌트 ──────────────────────────────────────────────────── */
interface Props {
  weekData: DayNutrition[]
  goal: GoalInfo
  goalType: string
}

export function NutritionInsight({ weekData, goal, goalType }: Props) {
  const [expandedKey, setExpandedKey] = useState<string | null>(null)

  const { daysCount, nutrients, overallMessage } = useMemo(() => {
    const days = weekData.filter(d => d.cal > 0)
    const count = days.length

    if (count === 0) return { daysCount: 0, nutrients: [], overallMessage: '' }

    const avg = {
      cal:     days.reduce((s, d) => s + d.cal, 0)     / count,
      protein: days.reduce((s, d) => s + d.protein, 0) / count,
      carbs:   days.reduce((s, d) => s + d.carbs, 0)   / count,
      fat:     days.reduce((s, d) => s + d.fat, 0)     / count,
    }

    const list = [
      { key: 'cal',     label: '칼로리',   emoji: '🔥', avg: avg.cal,     target: goal.calTarget,     unit: 'kcal', round: true },
      { key: 'protein', label: '단백질',   emoji: '💪', avg: avg.protein, target: goal.proteinTarget, unit: 'g',    round: false },
      { key: 'carbs',   label: '탄수화물', emoji: '🌾', avg: avg.carbs,   target: goal.carbsTarget,   unit: 'g',    round: false },
      { key: 'fat',     label: '지방',     emoji: '🥑', avg: avg.fat,     target: goal.fatTarget,     unit: 'g',    round: false },
    ].map(n => {
      const pct = n.target > 0 ? (n.avg / n.target) * 100 : 0
      return { ...n, pct, status: getStatus(pct) as Status }
    })

    // 전체 요약 메시지
    const great = list.filter(n => n.status === 'great' || n.status === 'good').length
    const poor  = list.filter(n => n.status === 'very_low' || n.status === 'low').length
    const msg = great === 4
      ? '이번 주 영양 균형이 훌륭해요! 이 패턴을 유지하세요 🎉'
      : poor >= 3
      ? '전반적인 식사량이 부족해요. 조금씩 더 드셔보세요.'
      : poor > 0
      ? `${list.filter(n => n.status === 'very_low' || n.status === 'low').map(n => n.label).join('·')}을 보충하면 더 좋아질 거예요!`
      : '전반적으로 균형 잡힌 식단이에요 👍'

    return { daysCount: count, nutrients: list, overallMessage: msg }
  }, [weekData, goal])

  if (daysCount === 0) {
    return (
      <div className="bg-surface rounded-2xl border border-line p-5">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={16} className="text-[#2d7a4f]" />
          <span className="font-semibold text-ink">맞춤 영양 분석</span>
        </div>
        <div className="py-8 flex flex-col items-center gap-3 text-center">
          <span className="text-4xl">📊</span>
          <p className="text-sm text-ink-4">식단 기록이 없어요</p>
          <p className="text-xs text-ink-5">식사 사진을 올리거나 직접 입력하면<br/>7일 평균 영양 분석을 제공해드려요.</p>
        </div>
      </div>
    )
  }

  const priorityNutrient = nutrients
    .filter(n => n.status === 'very_low' || n.status === 'low')
    .sort((a, b) => a.pct - b.pct)[0]

  return (
    <div className="bg-surface rounded-2xl border border-line p-5 space-y-5">
      {/* 헤더 */}
      <div className="flex items-center gap-2">
        <TrendingUp size={16} className="text-[#2d7a4f]" />
        <span className="font-semibold text-ink">맞춤 영양 분석</span>
        <span className="ml-auto text-xs text-ink-5">{daysCount}일 평균</span>
      </div>

      {/* 전체 요약 배너 */}
      {priorityNutrient ? (
        <div className="flex items-start gap-2.5 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <Info size={14} className="text-amber-500 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">{overallMessage}</p>
        </div>
      ) : (
        <div className="flex items-center gap-2.5 p-3 bg-green-tint border border-primary/20 rounded-xl">
          <span className="text-base">🎉</span>
          <p className="text-xs text-[#2d7a4f] font-medium">{overallMessage}</p>
        </div>
      )}

      {/* 영양소 카드 목록 */}
      <div className="space-y-2.5">
        {nutrients.map(n => {
          const meta = STATUS_META[n.status]
          const tip = getTip(goalType, n.key)
          const isExpanded = expandedKey === n.key
          const barPct = Math.min(n.pct, 100)

          const tipText = n.status === 'excess' ? tip.excess
            : n.status === 'great' || n.status === 'good' ? null
            : tip.deficit

          return (
            <div key={n.key} className="border border-line rounded-xl overflow-hidden">
              {/* 메인 행 */}
              <button
                className="w-full px-4 py-3 text-left hover:bg-wash/50 transition-colors"
                onClick={() => setExpandedKey(isExpanded ? null : n.key)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{n.emoji}</span>
                    <span className="text-sm font-medium text-ink">{n.label}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${meta.textColor} ${meta.bgColor}`}>
                      {meta.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-right">
                      <span className="text-sm font-bold text-ink">
                        {n.round ? Math.round(n.avg).toLocaleString() : n.avg.toFixed(1)}
                      </span>
                      <span className="text-xs text-ink-5">/{n.target.toLocaleString()}{n.unit}</span>
                    </span>
                    <span className={`text-xs font-bold ${meta.textColor}`}>{Math.round(n.pct)}%</span>
                    {isExpanded
                      ? <ChevronUp size={13} className="text-ink-5" />
                      : <ChevronDown size={13} className="text-ink-5" />
                    }
                  </div>
                </div>

                {/* 프로그레스 바 */}
                <div className="h-1.5 bg-line-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${meta.barColor}`}
                    style={{ width: `${barPct}%` }}
                  />
                </div>
              </button>

              {/* 확장 패널 */}
              {isExpanded && (
                <div className={`px-4 pb-4 space-y-3 border-t border-line ${meta.bgColor}`}>
                  {/* 팁 텍스트 */}
                  <p className="text-xs text-ink-3 leading-relaxed pt-3">
                    {tipText ?? tip.great}
                  </p>

                  {/* 추천 식품 */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Lightbulb size={12} className="text-ink-4" />
                      <span className="text-[11px] font-semibold text-ink-4">추천 식품</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {tip.foods.map(f => (
                        <span key={f} className="text-xs px-2.5 py-1 bg-surface rounded-full border border-line text-ink-3">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 이번 주 개선 우선순위 */}
      {priorityNutrient && (
        <div className="p-4 bg-tint rounded-xl space-y-2">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-sm">🎯</span>
            <span className="text-xs font-bold text-ink-3">이번 주 집중 보완</span>
          </div>
          <p className="text-sm font-semibold text-ink">
            {priorityNutrient.emoji} {priorityNutrient.label} 목표 대비 {Math.round(priorityNutrient.pct)}% 달성
          </p>
          <p className="text-xs text-ink-4 leading-relaxed">
            {getTip(goalType, priorityNutrient.key).deficit}
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {getTip(goalType, priorityNutrient.key).foods.map(f => (
              <span key={f} className="text-xs px-2.5 py-1 bg-surface rounded-full border border-line text-ink-3">{f}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

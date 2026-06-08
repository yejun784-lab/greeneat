'use client'

import { useState } from 'react'
import { Salad, Dumbbell, Moon, Trophy } from 'lucide-react'
import { ExerciseLogger } from './ExerciseLogger'
import { ExercisePlan } from './ExercisePlan'
import { WaterSleepTracker } from './WaterSleepTracker'
import { NutritionRecommend } from './NutritionRecommend'
import { NutritionInsight } from './NutritionInsight'
import { WeatherRecommend } from './WeatherRecommend'
import { HealthChallenge } from './HealthChallenge'
import type { DayNutrition, GoalInfo } from '@/lib/health-types'
import type { Product } from '@/types'

type Tab = 'nutrition' | 'exercise' | 'sleep' | 'challenge'

interface Props {
  userId: string | null
  date: string
  weightKg?: number | null
  today?: DayNutrition
  goal?: GoalInfo
  goalType?: string          // 'diet' | 'muscle' | 'maintain' | 'health' | 'balanced'
  weekData?: DayNutrition[]  // 맞춤 영양 분석용 7일 데이터
  products?: Product[]
  nutritionContent: React.ReactNode
}

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: 'nutrition',  label: '영양',    icon: Salad    },
  { key: 'exercise',   label: '운동',    icon: Dumbbell },
  { key: 'sleep',      label: '수면·수분', icon: Moon   },
  { key: 'challenge',  label: '챌린지',  icon: Trophy   },
]

export function HealthTabNav({
  userId, date, weightKg, today, goal, goalType = 'balanced',
  weekData, products, nutritionContent,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('nutrition')

  return (
    <div>
      {/* 탭 바 */}
      <div className="flex gap-1 bg-tint p-1 rounded-2xl mb-6 overflow-x-auto">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 min-w-[72px] flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === key
                ? 'bg-surface text-[#2d7a4f] shadow-sm'
                : 'text-ink-4 hover:text-ink-2'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* ── 영양 탭 ── */}
      {activeTab === 'nutrition' && (
        <div className="flex flex-col gap-6">
          {/* 날씨 맞춤 추천 */}
          <WeatherRecommend products={products ?? []} />

          {/* 기존 영양 콘텐츠 (링·BMI·사진·로그 등) */}
          {nutritionContent}

          {/* 맞춤 영양소 추천 (부족 상품 추천) */}
          {today && goal && products && (
            <NutritionRecommend today={today} goal={goal} products={products} />
          )}

          {/* 7일 맞춤 영양 인사이트 */}
          {weekData && goal && (
            <NutritionInsight weekData={weekData} goal={goal} goalType={goalType} />
          )}
        </div>
      )}

      {/* ── 운동 탭 ── */}
      {activeTab === 'exercise' && (
        <div className="flex flex-col gap-6">
          {/* 주간 운동 플랜 */}
          <ExercisePlan goal={goalType} userId={userId} date={date} />

          {/* 오늘의 운동 기록 */}
          <ExerciseLogger userId={userId} date={date} weightKg={weightKg} />

          {!weightKg && (
            <p className="text-center text-xs text-ink-5">
              💡{' '}
              <a href="/my" className="underline hover:text-[#2d7a4f]">마이페이지</a>
              에서 체중을 입력하면 더 정확한 칼로리 소모가 계산돼요.
            </p>
          )}
        </div>
      )}

      {/* ── 수면·수분 탭 ── */}
      {activeTab === 'sleep' && (
        <div className="flex flex-col gap-6">
          <WaterSleepTracker userId={userId} date={date} weightKg={weightKg} />
          {!weightKg && (
            <p className="text-center text-xs text-ink-5">
              💡{' '}
              <a href="/my" className="underline hover:text-[#2d7a4f]">마이페이지</a>
              에서 체중을 입력하면 맞춤 수분 목표가 설정돼요.
            </p>
          )}
        </div>
      )}

      {/* ── 챌린지 탭 ── */}
      {activeTab === 'challenge' && (
        <div className="flex flex-col gap-6">
          <HealthChallenge userId={userId} weekData={weekData} goal={goal} />
        </div>
      )}
    </div>
  )
}

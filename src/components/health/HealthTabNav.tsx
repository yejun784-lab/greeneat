'use client'

import { useState } from 'react'
import { Salad, Dumbbell, Moon } from 'lucide-react'
import { ExerciseLogger } from './ExerciseLogger'
import { WaterSleepTracker } from './WaterSleepTracker'

type Tab = 'nutrition' | 'exercise' | 'sleep'

interface Props {
  userId: string | null
  date: string
  weightKg?: number | null
  nutritionContent: React.ReactNode
}

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: 'nutrition', label: '영양',     icon: Salad    },
  { key: 'exercise',  label: '운동',     icon: Dumbbell },
  { key: 'sleep',     label: '수면·수분', icon: Moon     },
]

export function HealthTabNav({ userId, date, weightKg, nutritionContent }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('nutrition')

  return (
    <div>
      {/* 탭 바 */}
      <div className="flex gap-1 bg-tint p-1 rounded-2xl mb-6">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === key
                ? 'bg-surface text-[#2d7a4f] shadow-sm'
                : 'text-ink-4 hover:text-ink-2'
            }`}
          >
            <Icon size={15} />
            {label}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      {activeTab === 'nutrition' && (
        <div className="flex flex-col gap-6">
          {nutritionContent}
        </div>
      )}

      {activeTab === 'exercise' && (
        <div className="flex flex-col gap-6">
          <ExerciseLogger userId={userId} date={date} weightKg={weightKg} />
          {!weightKg && (
            <p className="text-center text-xs text-ink-5">
              💡 <a href="/my" className="underline hover:text-[#2d7a4f]">마이페이지</a>에서 체중을 입력하면 더 정확한 칼로리가 계산됩니다.
            </p>
          )}
        </div>
      )}

      {activeTab === 'sleep' && (
        <div className="flex flex-col gap-6">
          <WaterSleepTracker userId={userId} date={date} weightKg={weightKg} />
          {!weightKg && (
            <p className="text-center text-xs text-ink-5">
              💡 <a href="/my" className="underline hover:text-[#2d7a4f]">마이페이지</a>에서 체중을 입력하면 수분 목표가 맞춤 설정됩니다.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const GOALS = [
  { value: 'diet',     label: '다이어트', emoji: '🥗', color: 'bg-green-100 text-green-700' },
  { value: 'balanced', label: '균형식',   emoji: '⚖️', color: 'bg-blue-100 text-blue-700' },
  { value: 'muscle',   label: '근육 증가', emoji: '💪', color: 'bg-orange-100 text-orange-700' },
]

export function GoalEditor({ current, userId }: { current: string; userId: string }) {
  const [goal, setGoal] = useState(current)
  const [open, setOpen] = useState(false)
  const currentGoal = GOALS.find((g) => g.value === goal) ?? GOALS[1]

  const select = async (value: string) => {
    setGoal(value)
    setOpen(false)
    const supabase = createClient()
    await supabase.from('profiles').update({ nutrition_goal: value }).eq('id', userId)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${currentGoal.color}`}
      >
        <span>{currentGoal.emoji}</span>
        <span>{currentGoal.label}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-8 bg-white border border-line shadow-lg rounded-xl p-1.5 z-10 min-w-[120px]">
          {GOALS.map((g) => (
            <button
              key={g.value}
              onClick={() => select(g.value)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs hover:bg-tint transition-colors ${goal === g.value ? 'font-semibold text-[#2d7a4f]' : 'text-ink-3'}`}
            >
              <span>{g.emoji}</span>{g.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

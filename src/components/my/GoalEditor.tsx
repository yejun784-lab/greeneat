'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ChevronDown } from 'lucide-react'

const GOALS = [
  { value: 'diet',     label: '다이어트', emoji: '🥗' },
  { value: 'balanced', label: '균형식',   emoji: '⚖️' },
  { value: 'muscle',   label: '근육 증가', emoji: '💪' },
]

interface Props {
  current: string
  userId: string
}

export function GoalEditor({ current, userId }: Props) {
  const [goal, setGoal] = useState(current)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const currentGoal = GOALS.find((g) => g.value === goal) ?? GOALS[1]

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function select(value: string) {
    setGoal(value)
    setOpen(false)
    const supabase = createClient()
    await supabase.from('profiles').update({ nutrition_goal: value }).eq('id', userId)
  }

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 bg-green-tint text-[#2d7a4f] text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-[#d0ead9] transition-colors"
      >
        <span>{currentGoal.emoji}</span>
        <span>{currentGoal.label}</span>
        <ChevronDown size={11} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-line rounded-xl shadow-lg z-20 overflow-hidden w-36">
          {GOALS.map((g) => (
            <button
              key={g.value}
              onClick={() => select(g.value)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-wash transition-colors ${
                goal === g.value ? 'font-semibold text-[#2d7a4f]' : 'text-ink-3'
              }`}
            >
              <span>{g.emoji}</span>
              <span>{g.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/lib/toast-store'

const GOALS = [
  { value: 'diet',     label: '다이어트',  emoji: '🥗', desc: '1,500 kcal / 단백질 80g' },
  { value: 'balanced', label: '균형식',    emoji: '⚖️', desc: '2,000 kcal / 단백질 100g' },
  { value: 'muscle',   label: '근육 증가', emoji: '💪', desc: '2,500 kcal / 단백질 150g' },
]

export function GoalEditor({ current, userId }: { current: string; userId: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  async function handleSelect(value: string) {
    if (value === current) { setOpen(false); return }
    setSaving(true)
    const supabase = createClient()
    await supabase
      .from('profiles')
      .update({ nutrition_goal: value })
      .eq('id', userId)
    setSaving(false)
    setOpen(false)
    const label = GOALS.find((g) => g.value === value)?.label ?? ''
    toast.success(`식단 목표를 "${label}"(으)로 변경했어요!`)
    router.refresh()
  }

  const currentGoal = GOALS.find((g) => g.value === current) ?? GOALS[1]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-xs text-ink-4 hover:text-[#2d7a4f] transition-colors border border-line-2 rounded-lg px-2 py-1 hover:border-[#2d7a4f]"
      >
        <span>{currentGoal.emoji}</span>
        <span>{currentGoal.label}</span>
        <span className="text-ink-5">변경</span>
      </button>

      {open && (
        <>
          {/* 오버레이 */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          {/* 드롭다운 */}
          <div className="absolute right-0 top-full mt-2 w-56 bg-surface border border-line-2 rounded-2xl shadow-xl z-50 overflow-hidden">
            {GOALS.map((g) => (
              <button
                key={g.value}
                onClick={() => handleSelect(g.value)}
                disabled={saving}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-wash ${
                  g.value === current ? 'bg-green-tint' : ''
                }`}
              >
                <span className="text-xl mt-0.5">{g.emoji}</span>
                <div>
                  <p className={`text-sm font-medium ${g.value === current ? 'text-[#2d7a4f]' : 'text-ink'}`}>
                    {g.label}
                    {g.value === current && <span className="ml-1 text-xs">✓</span>}
                  </p>
                  <p className="text-xs text-ink-5 mt-0.5">{g.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

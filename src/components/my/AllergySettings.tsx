'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const ALLERGENS = [
  { id: 'gluten', label: '글루텐' },
  { id: 'dairy',  label: '유제품' },
  { id: 'egg',    label: '달걀'   },
  { id: 'soy',    label: '대두'   },
  { id: 'pork',   label: '돼지고기' },
  { id: 'sesame', label: '참깨'   },
]

export function AllergySettings({ userId, initial }: { userId: string; initial: string[] }) {
  const [selected, setSelected] = useState(initial)
  const [saved, setSaved] = useState(false)

  const toggle = (id: string) =>
    setSelected((s) => s.includes(id) ? s.filter((x) => x !== id) : [...s, id])

  const save = async () => {
    const supabase = createClient()
    await supabase.from('profiles').update({ allergen_profile: selected }).eq('id', userId)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="bg-surface rounded-2xl border border-line p-5">
      <p className="text-sm font-semibold text-ink mb-1">알레르기 프로필</p>
      <p className="text-xs text-ink-4 mb-4">해당 성분이 포함된 상품은 목록에서 자동으로 필터링돼요.</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {ALLERGENS.map((a) => {
          const active = selected.includes(a.id)
          return (
            <button
              key={a.id}
              onClick={() => toggle(a.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                active
                  ? 'bg-red-50 border-red-300 text-red-600'
                  : 'bg-tint border-line-2 text-ink-3 hover:border-line-3'
              }`}
            >
              {active ? '⚠️ ' : ''}{a.label}
            </button>
          )
        })}
      </div>
      <button
        onClick={save}
        className="text-xs px-4 py-2 bg-[#2d7a4f] text-white rounded-lg hover:bg-[#235f3d] transition-colors"
      >
        {saved ? '저장됨 ✓' : '저장하기'}
      </button>
    </div>
  )
}

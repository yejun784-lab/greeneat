'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ShieldCheck } from 'lucide-react'

const ALLERGENS = [
  { value: 'gluten',  label: '글루텐' },
  { value: 'dairy',   label: '유제품' },
  { value: 'egg',     label: '달걀' },
  { value: 'soy',     label: '대두' },
  { value: 'pork',    label: '돼지고기' },
  { value: 'sesame',  label: '참깨' },
]

interface Props {
  userId: string
  initial: string[]
}

export function AllergySettings({ userId, initial }: Props) {
  const [selected, setSelected] = useState<string[]>(initial)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  function toggle(value: string) {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  async function save() {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('profiles').update({ allergen_profile: selected }).eq('id', userId)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="bg-surface rounded-2xl border border-line p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-[#2d7a4f]" />
          <h2 className="font-semibold text-ink">알레르기 프로필</h2>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
            saved
              ? 'bg-[#2d7a4f] text-white'
              : 'border border-line-2 text-ink-3 hover:border-[#2d7a4f] hover:text-[#2d7a4f]'
          } disabled:opacity-50`}
        >
          {saved ? '저장됨 ✓' : saving ? '저장 중...' : '저장'}
        </button>
      </div>
      <p className="text-xs text-ink-5 mb-3">선택한 성분이 포함된 상품은 필터링됩니다.</p>
      <div className="flex flex-wrap gap-2">
        {ALLERGENS.map((a) => (
          <button
            key={a.value}
            onClick={() => toggle(a.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              selected.includes(a.value)
                ? 'bg-red-50 border-red-200 text-red-600'
                : 'border-line-2 text-ink-4 hover:border-line-3'
            }`}
          >
            {selected.includes(a.value) ? '✗ ' : ''}{a.label}
          </button>
        ))}
      </div>
    </div>
  )
}

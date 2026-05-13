'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldCheck, AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/lib/toast-store'

const ALLERGENS = [
  { value: 'gluten',  label: '글루텐',   emoji: '🌾' },
  { value: 'dairy',   label: '유제품',   emoji: '🥛' },
  { value: 'egg',     label: '달걀',     emoji: '🥚' },
  { value: 'soy',     label: '대두',     emoji: '🫘' },
  { value: 'pork',    label: '돼지고기', emoji: '🐷' },
  { value: 'sesame',  label: '참깨',     emoji: '🌱' },
]

export function AllergySettings({
  userId,
  initial,
}: {
  userId: string
  initial: string[]
}) {
  const router = useRouter()
  const [selected, setSelected] = useState<string[]>(initial)
  const [saving, setSaving] = useState(false)

  function toggle(value: string) {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    )
  }

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({ allergen_profile: selected })
      .eq('id', userId)

    if (error) {
      toast.error('저장에 실패했습니다.')
    } else {
      toast.success('알레르기 설정을 저장했습니다. 상품 목록에 자동 적용돼요!')
      router.refresh()
    }
    setSaving(false)
  }

  const changed =
    selected.length !== initial.length ||
    selected.some((v) => !initial.includes(v))

  return (
    <div className="bg-surface rounded-2xl border border-line p-5">
      <div className="flex items-center gap-2 mb-1">
        <ShieldCheck size={17} className="text-[#2d7a4f]" />
        <h2 className="font-semibold text-ink">알레르기 프로필</h2>
      </div>
      <p className="text-xs text-ink-5 mb-4">
        선택한 성분이 포함된 상품은 상품 목록에서 자동으로 제외됩니다.
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {ALLERGENS.map((a) => {
          const on = selected.includes(a.value)
          return (
            <button
              key={a.value}
              onClick={() => toggle(a.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border-2 transition-all ${
                on
                  ? 'bg-red-50 border-red-300 text-red-600 font-medium'
                  : 'border-line-2 text-ink-4 hover:border-line-3'
              }`}
            >
              <span>{a.emoji}</span>
              {a.label}
            </button>
          )
        })}
      </div>

      {selected.length > 0 && (
        <div className="flex items-start gap-2 bg-red-50 rounded-xl p-3 mb-4">
          <AlertTriangle size={14} className="text-red-400 mt-0.5 shrink-0" />
          <p className="text-xs text-red-500">
            <span className="font-semibold">{selected.map((v) => ALLERGENS.find((a) => a.value === v)?.label).join(', ')}</span>
            {' '}포함 상품이 자동 제외됩니다.
          </p>
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving || !changed}
        className="w-full py-2.5 bg-[#2d7a4f] text-white text-sm font-medium rounded-xl hover:bg-[#235f3d] disabled:opacity-40 transition-colors"
      >
        {saving ? '저장 중...' : '설정 저장'}
      </button>
    </div>
  )
}

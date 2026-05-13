'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, GripVertical, Loader2, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/lib/toast-store'

type Step = {
  id?: string
  step_number: number
  title: string
  description: string
  duration_minutes: number | null
}

interface Props {
  productId: string
  productName: string
  initialSteps: Step[]
}

export function RecipeStepForm({ productId, productName, initialSteps }: Props) {
  const router = useRouter()
  const [steps, setSteps] = useState<Step[]>(
    initialSteps.length > 0
      ? initialSteps
      : [{ step_number: 1, title: '', description: '', duration_minutes: null }]
  )
  const [saving, setSaving] = useState(false)

  function addStep() {
    setSteps((prev) => [
      ...prev,
      { step_number: prev.length + 1, title: '', description: '', duration_minutes: null },
    ])
  }

  function removeStep(index: number) {
    setSteps((prev) =>
      prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, step_number: i + 1 }))
    )
  }

  function update(index: number, key: keyof Step, value: string | number | null) {
    setSteps((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [key]: value } : s))
    )
  }

  async function handleSave() {
    for (const [i, step] of steps.entries()) {
      if (!step.title.trim()) { toast.error(`${i + 1}단계 제목을 입력해주세요.`); return }
      if (!step.description.trim()) { toast.error(`${i + 1}단계 설명을 입력해주세요.`); return }
    }

    setSaving(true)
    const supabase = createClient()

    // 기존 스텝 전체 삭제 후 재삽입 (간단하고 확실한 방법)
    const { error: delErr } = await supabase
      .from('recipe_steps')
      .delete()
      .eq('product_id', productId)

    if (delErr) {
      toast.error('저장 실패: ' + delErr.message)
      setSaving(false)
      return
    }

    if (steps.length > 0) {
      const { error: insErr } = await supabase.from('recipe_steps').insert(
        steps.map((s, i) => ({
          product_id: productId,
          step_number: i + 1,
          title: s.title.trim(),
          description: s.description.trim(),
          duration_minutes: s.duration_minutes ? Number(s.duration_minutes) : null,
        }))
      )
      if (insErr) {
        toast.error('저장 실패: ' + insErr.message)
        setSaving(false)
        return
      }
    }

    toast.success('레시피를 저장했습니다.')
    router.refresh()
    setSaving(false)
  }

  const inputCls = 'w-full px-3 py-2 border border-line-2 rounded-lg text-sm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f]'

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-4">{productName} — 레시피 단계</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={addStep}
            className="flex items-center gap-1.5 px-3 py-2 border border-line-2 rounded-xl text-sm text-ink-2 hover:bg-wash transition-colors"
          >
            <Plus size={14} /> 단계 추가
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#2d7a4f] text-white rounded-xl text-sm font-medium hover:bg-[#235f3d] transition-colors disabled:opacity-50"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? '저장 중...' : '전체 저장'}
          </button>
        </div>
      </div>

      {steps.length === 0 && (
        <div className="text-center py-10 border-2 border-dashed border-line-2 rounded-2xl text-ink-5 text-sm">
          레시피 단계가 없습니다. 단계를 추가해주세요.
        </div>
      )}

      <div className="space-y-3">
        {steps.map((step, i) => (
          <div key={i} className="bg-surface rounded-2xl border border-line p-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center gap-2 shrink-0 mt-1">
                <GripVertical size={16} className="text-ink-5 cursor-grab" />
                <span className="w-6 h-6 rounded-full bg-[#2d7a4f] text-white text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <div className="flex-1 space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => update(i, 'title', e.target.value)}
                      placeholder="단계 제목 (예: 재료 손질하기)"
                      className={inputCls}
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={step.duration_minutes ?? ''}
                      onChange={(e) => update(i, 'duration_minutes', e.target.value ? Number(e.target.value) : null)}
                      placeholder="소요 시간 (분)"
                      min={0}
                      className={inputCls}
                    />
                  </div>
                </div>
                <textarea
                  value={step.description}
                  onChange={(e) => update(i, 'description', e.target.value)}
                  placeholder="단계 설명을 입력하세요..."
                  rows={2}
                  className={`${inputCls} resize-none`}
                />
              </div>
              <button
                type="button"
                onClick={() => removeStep(i)}
                disabled={steps.length === 1}
                className="p-1.5 text-ink-5 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30 shrink-0 mt-1"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

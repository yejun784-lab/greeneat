'use client'

import { useState, useEffect } from 'react'
import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-react'

// 외부에서 열 수 있는 store
type QuestionnaireStore = { isOpen: boolean; openQuestionnaire: () => void; closeQuestionnaire: () => void }
export const useQuestionnaireStore = create<QuestionnaireStore>((set) => ({
  isOpen: false,
  openQuestionnaire: () => set({ isOpen: true }),
  closeQuestionnaire: () => set({ isOpen: false }),
}))

type Step = 1 | 2 | 3 | 4

interface FormData {
  age: string
  gender: string
  height_cm: string
  weight_kg: string
  health_goal: string
  activity_level: string
  diet_type: string
  allergen_profile: string[]
}

const INITIAL: FormData = {
  age: '', gender: '', height_cm: '', weight_kg: '',
  health_goal: '', activity_level: '', diet_type: 'none', allergen_profile: [],
}

const ALLERGENS = ['글루텐', '갑각류', '난류', '우유', '견과류', '대두', '돼지고기', '복숭아']

const HEALTH_GOALS = [
  { id: 'diet',     emoji: '🔥', label: '다이어트',   desc: '체지방 감소·칼로리 관리' },
  { id: 'muscle',   emoji: '💪', label: '근육 증가',  desc: '단백질 위주 고영양 식단' },
  { id: 'maintain', emoji: '⚖️', label: '체중 유지',  desc: '균형 잡힌 일반 식단' },
  { id: 'health',   emoji: '🌿', label: '건강 관리',  desc: '저염·저당 건강식 위주' },
]

const ACTIVITY_LEVELS = [
  { id: 'low',    emoji: '🛋️', label: '낮음', desc: '주로 앉아서 생활' },
  { id: 'medium', emoji: '🚶', label: '보통', desc: '가벼운 운동 주 1~3회' },
  { id: 'high',   emoji: '🏃', label: '높음', desc: '활발한 운동 주 4회 이상' },
]

const DIET_TYPES = [
  { id: 'none',       emoji: '🍗', label: '제한 없음' },
  { id: 'vegetarian', emoji: '🥗', label: '채식 (유제품·달걀 가능)' },
  { id: 'vegan',      emoji: '🌱', label: '비건 (완전 채식)' },
  { id: 'halal',      emoji: '☪️', label: '할랄 식단' },
]

export function HealthQuestionnaire() {
  const { isOpen, closeQuestionnaire } = useQuestionnaireStore()
  const [show, setShow] = useState(false)
  const [step, setStep] = useState<Step>(1)
  const [form, setForm] = useState<FormData>(INITIAL)
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      setUserId(user.id)
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single()
      if (!profile?.onboarding_completed) setShow(true)
    })
  }, [])

  // store에서 열기 요청 오면 표시
  useEffect(() => {
    if (isOpen) { setStep(1); setForm(INITIAL); setShow(true) }
  }, [isOpen])

  const toggleAllergen = (a: string) => {
    setForm((f) => ({
      ...f,
      allergen_profile: f.allergen_profile.includes(a)
        ? f.allergen_profile.filter((x) => x !== a)
        : [...f.allergen_profile, a],
    }))
  }

  const canNext = () => {
    if (step === 1) return form.age && form.gender
    if (step === 2) return form.height_cm && form.weight_kg
    if (step === 3) return form.health_goal && form.activity_level
    return true
  }

  async function handleComplete() {
    if (!userId) return
    setSaving(true)
    const supabase = createClient()
    await supabase.from('profiles').update({
      age: parseInt(form.age) || null,
      gender: form.gender || null,
      height_cm: parseInt(form.height_cm) || null,
      weight_kg: parseInt(form.weight_kg) || null,
      health_goal: form.health_goal || 'maintain',
      activity_level: form.activity_level || 'medium',
      diet_type: form.diet_type,
      allergen_profile: form.allergen_profile,
      onboarding_completed: true,
    }).eq('id', userId)
    setSaving(false)
    setShow(false)
    closeQuestionnaire()
  }

  async function handleSkip() {
    if (!userId) { setShow(false); closeQuestionnaire(); return }
    const supabase = createClient()
    await supabase.from('profiles').update({ onboarding_completed: true }).eq('id', userId)
    setShow(false)
    closeQuestionnaire()
  }

  if (!show) return null

  const TOTAL = 4

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-surface rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-[#2d7a4f] to-[#4caf72] px-6 pt-6 pb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-white/70">{step} / {TOTAL}</span>
            <button onClick={handleSkip} className="text-white/60 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>
          {/* 진행 바 */}
          <div className="h-1.5 bg-surface/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-surface rounded-full transition-all duration-300"
              style={{ width: `${(step / TOTAL) * 100}%` }}
            />
          </div>
        </div>

        {/* 콘텐츠 */}
        <div className="px-6 py-5 min-h-[300px]">
          {step === 1 && (
            <div>
              <p className="text-xs text-[#2d7a4f] font-semibold mb-1">기본 정보</p>
              <h2 className="text-xl font-bold text-ink mb-5">간단한 정보를 알려주세요 👋</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-ink-3 mb-1.5 block">나이</label>
                  <input
                    type="number"
                    value={form.age}
                    onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
                    placeholder="나이를 입력해주세요"
                    className="w-full px-4 py-3 border border-line-2 rounded-xl text-sm focus:outline-none focus:border-[#2d7a4f] transition-colors"
                    min={1} max={120}
                  />
                </div>
                <div>
                  <label className="text-xs text-ink-3 mb-1.5 block">성별</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[{ id: 'male', label: '남성', emoji: '👨' }, { id: 'female', label: '여성', emoji: '👩' }, { id: 'other', label: '기타', emoji: '🙂' }].map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, gender: g.id }))}
                        className={`py-3 rounded-xl border text-sm font-medium transition-all ${
                          form.gender === g.id ? 'border-[#2d7a4f] bg-[#f0faf4] text-[#2d7a4f]' : 'border-line-2 text-ink-3 hover:border-line'
                        }`}
                      >
                        <div className="text-lg mb-0.5">{g.emoji}</div>
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="text-xs text-[#2d7a4f] font-semibold mb-1">신체 정보</p>
              <h2 className="text-xl font-bold text-ink mb-5">키와 몸무게를 알려주세요 📏</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-ink-3 mb-1.5 block">키 (cm)</label>
                  <input
                    type="number"
                    value={form.height_cm}
                    onChange={(e) => setForm((f) => ({ ...f, height_cm: e.target.value }))}
                    placeholder="예: 170"
                    className="w-full px-4 py-3 border border-line-2 rounded-xl text-sm focus:outline-none focus:border-[#2d7a4f] transition-colors"
                    min={100} max={250}
                  />
                </div>
                <div>
                  <label className="text-xs text-ink-3 mb-1.5 block">몸무게 (kg)</label>
                  <input
                    type="number"
                    value={form.weight_kg}
                    onChange={(e) => setForm((f) => ({ ...f, weight_kg: e.target.value }))}
                    placeholder="예: 65"
                    className="w-full px-4 py-3 border border-line-2 rounded-xl text-sm focus:outline-none focus:border-[#2d7a4f] transition-colors"
                    min={20} max={300}
                  />
                </div>
                {form.height_cm && form.weight_kg && (
                  <div className="bg-[#f0faf4] rounded-xl p-3 text-sm text-[#2d7a4f] text-center">
                    BMI: <strong>{(parseInt(form.weight_kg) / Math.pow(parseInt(form.height_cm) / 100, 2)).toFixed(1)}</strong>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <p className="text-xs text-[#2d7a4f] font-semibold mb-1">건강 목표</p>
              <h2 className="text-xl font-bold text-ink mb-5">어떤 목표가 있으신가요? 🎯</h2>
              <div className="space-y-2 mb-5">
                {HEALTH_GOALS.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, health_goal: g.id }))}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all ${
                      form.health_goal === g.id ? 'border-[#2d7a4f] bg-[#f0faf4]' : 'border-line-2 hover:border-line'
                    }`}
                  >
                    <span className="text-2xl">{g.emoji}</span>
                    <div>
                      <p className={`text-sm font-semibold ${form.health_goal === g.id ? 'text-[#2d7a4f]' : 'text-ink-2'}`}>{g.label}</p>
                      <p className="text-xs text-ink-4">{g.desc}</p>
                    </div>
                    {form.health_goal === g.id && <Check size={16} className="ml-auto text-[#2d7a4f] shrink-0" />}
                  </button>
                ))}
              </div>
              <p className="text-xs text-ink-3 mb-2">평소 활동량</p>
              <div className="grid grid-cols-3 gap-2">
                {ACTIVITY_LEVELS.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, activity_level: a.id }))}
                    className={`py-2.5 rounded-xl border text-xs font-medium transition-all ${
                      form.activity_level === a.id ? 'border-[#2d7a4f] bg-[#f0faf4] text-[#2d7a4f]' : 'border-line-2 text-ink-3 hover:border-line'
                    }`}
                  >
                    <div className="text-base mb-0.5">{a.emoji}</div>
                    {a.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <p className="text-xs text-[#2d7a4f] font-semibold mb-1">식단 정보</p>
              <h2 className="text-xl font-bold text-ink mb-4">식단 유형을 선택해주세요 🥦</h2>
              <div className="grid grid-cols-2 gap-2 mb-5">
                {DIET_TYPES.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, diet_type: d.id }))}
                    className={`py-3 px-3 rounded-xl border text-xs font-medium text-left transition-all ${
                      form.diet_type === d.id ? 'border-[#2d7a4f] bg-[#f0faf4] text-[#2d7a4f]' : 'border-line-2 text-ink-3 hover:border-line'
                    }`}
                  >
                    <span className="text-lg block mb-1">{d.emoji}</span>
                    {d.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-ink-3 mb-2">알레르기 (해당 항목 선택)</p>
              <div className="flex flex-wrap gap-2">
                {ALLERGENS.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggleAllergen(a)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      form.allergen_profile.includes(a) ? 'bg-red-50 border-red-300 text-red-600' : 'border-line-2 text-ink-3 hover:border-line'
                    }`}
                  >
                    {form.allergen_profile.includes(a) ? '✕ ' : ''}{a}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 하단 버튼 */}
        <div className="px-6 pb-6 flex gap-3">
          {step > 1 && (
            <button
              onClick={() => setStep((s) => (s - 1) as Step)}
              className="flex items-center gap-1 px-4 py-3 border border-line-2 rounded-xl text-sm text-ink-3 hover:border-line transition-colors"
            >
              <ChevronLeft size={16} />
              이전
            </button>
          )}
          {step < TOTAL ? (
            <button
              onClick={() => setStep((s) => (s + 1) as Step)}
              disabled={!canNext()}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#2d7a4f] text-white text-sm font-semibold rounded-xl hover:bg-[#235f3d] disabled:opacity-40 transition-colors"
            >
              다음
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#2d7a4f] text-white text-sm font-semibold rounded-xl hover:bg-[#235f3d] disabled:opacity-50 transition-colors"
            >
              <Check size={16} />
              {saving ? '저장 중...' : '완료! 맞춤 추천 받기 🎉'}
            </button>
          )}
        </div>

        {/* 건너뛰기 */}
        <div className="text-center pb-4">
          <button onClick={handleSkip} className="text-xs text-ink-4 hover:text-ink-3 transition-colors">
            나중에 작성할게요
          </button>
        </div>
      </div>
    </div>
  )
}

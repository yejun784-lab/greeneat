'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PenLine, Plus, Loader2, ScanBarcode, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { type MealType, MEAL_TYPE_META } from '@/lib/utils'
import { toast } from '@/lib/toast-store'
import type { BarcodeResult } from '@/app/api/barcode/route'

export function ManualMealLogger({ userId }: { userId?: string | null }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(today)
  const [mealType, setMealType] = useState<MealType>('lunch')
  const [description, setDescription] = useState('')
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [carbs, setCarbs] = useState('')
  const [fat, setFat] = useState('')
  const [saving, setSaving] = useState(false)
  const [showScanner, setShowScanner] = useState(false)
  const [scannedName, setScannedName] = useState('')   // 스캔된 상품명 표시용

  function handleScanResult(result: BarcodeResult) {
    setShowScanner(false)
    setScannedName(result.name)
    if (result.name)     setDescription(result.name)
    if (result.calories) setCalories(String(Math.round(result.calories)))
    if (result.protein)  setProtein(String(Math.round(result.protein * 10) / 10))
    if (result.carbs)    setCarbs(String(Math.round(result.carbs * 10) / 10))
    if (result.fat)      setFat(String(Math.round(result.fat * 10) / 10))
    toast.success(`"${result.name || '상품'}" 영양 정보를 불러왔어요 🔍`)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const cal = parseInt(calories)
    if (!description.trim()) { toast.error('음식 이름을 입력해주세요.'); return }
    if (isNaN(cal) || cal <= 0) { toast.error('칼로리를 입력해주세요.'); return }

    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { toast.error('로그인이 필요해요.'); setSaving(false); return }

    const { error } = await supabase.from('meal_logs').insert({
      user_id: user.id,
      date,
      meal_type: mealType,
      description: description.trim(),
      calories: cal,
      protein: protein ? parseFloat(protein) : null,
      carbs: carbs ? parseFloat(carbs) : null,
      fat: fat ? parseFloat(fat) : null,
    })

    setSaving(false)
    if (error) { toast.error('저장에 실패했어요.'); return }

    toast.success('식단이 기록됐어요! 📝')
    setOpen(false)
    setDescription('')
    setCalories('')
    setProtein('')
    setCarbs('')
    setFat('')
    setScannedName('')
    router.refresh()
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-[#f0f0ee] overflow-hidden">
        {/* 헤더 */}
        <button
          onClick={() => {
            if (!userId) {
              toast.info('로그인 후 식단을 기록할 수 있어요.', { action: { label: '로그인', href: '/login' } })
              return
            }
            setOpen((o) => !o)
          }}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#fafaf8] transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#f0f4ff] flex items-center justify-center">
              <PenLine size={15} className="text-blue-500" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-[#111] text-sm">직접 입력</p>
              <p className="text-xs text-[#999]">사진 없이 칼로리를 수동으로 기록해요</p>
            </div>
          </div>
          <Plus size={18} className={`text-[#999] transition-transform ${open ? 'rotate-45' : ''}`} />
        </button>

        {/* 폼 */}
        {open && (
          <form onSubmit={handleSave} className="px-5 pb-5 space-y-3 border-t border-[#f0f0ee] pt-4">
            {/* 날짜 + 식사 유형 */}
            <div className="flex gap-2">
              <input
                type="date"
                value={date}
                max={today}
                onChange={(e) => setDate(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-[#e8e8e6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d7a4f] text-[#333]"
              />
              <div className="flex gap-1">
                {(Object.keys(MEAL_TYPE_META) as MealType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setMealType(t)}
                    className={`px-2.5 py-2 text-xs rounded-xl font-medium transition-colors ${
                      mealType === t ? 'bg-[#2d7a4f] text-white' : 'bg-[#f5f5f3] text-[#666] hover:bg-[#e8f5ee] hover:text-[#2d7a4f]'
                    }`}
                  >
                    {MEAL_TYPE_META[t].label}
                  </button>
                ))}
              </div>
            </div>

            {/* 바코드 스캔 버튼 */}
            <button
              type="button"
              onClick={() => setShowScanner(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-[#2d7a4f]/40 rounded-xl text-sm font-medium text-[#2d7a4f] hover:border-[#2d7a4f] hover:bg-[#f0faf5] transition-colors"
            >
              <ScanBarcode size={16} />
              바코드 스캔으로 자동 입력
            </button>

            {/* 스캔 성공 배지 */}
            {scannedName && (
              <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700">
                <CheckCircle2 size={13} className="shrink-0" />
                <span className="truncate">"{scannedName}" 영양 정보 자동 입력됨</span>
              </div>
            )}

            {/* 음식 이름 */}
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="음식 이름 (예: 된장찌개, 삼겹살 200g)"
              className="w-full px-3 py-2.5 text-sm border border-[#e8e8e6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d7a4f] text-[#333] placeholder:text-[#bbb]"
            />

            {/* 칼로리 (필수) + 영양소 (선택) */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { key: 'calories', label: '칼로리*', unit: 'kcal', value: calories, setter: setCalories },
                { key: 'protein',  label: '단백질',  unit: 'g',    value: protein,  setter: setProtein  },
                { key: 'carbs',    label: '탄수화물', unit: 'g',    value: carbs,    setter: setCarbs    },
                { key: 'fat',      label: '지방',    unit: 'g',    value: fat,      setter: setFat      },
              ].map(({ key, label, unit, value, setter }) => (
                <div key={key}>
                  <label className="block text-[10px] text-[#999] mb-1">{label} <span className="text-[#ccc]">({unit})</span></label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    placeholder="0"
                    className="w-full px-2 py-2 text-sm border border-[#e8e8e6] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d7a4f] text-[#333] text-center"
                  />
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#2d7a4f] text-white text-sm font-semibold rounded-xl hover:bg-[#235f3d] transition-colors disabled:opacity-60"
            >
              {saving ? <Loader2 size={15} className="animate-spin" /> : <PenLine size={15} />}
              기록하기
            </button>
          </form>
        )}
      </div>

      {/* 바코드 스캐너 (전체화면 오버레이) */}
      {showScanner && (
        <BarcodeScannerLazy
          onResult={handleScanResult}
          onClose={() => setShowScanner(false)}
        />
      )}
    </>
  )
}

// lazy import — 카메라 열 때만 @zxing/browser 번들 로드
function BarcodeScannerLazy({ onResult, onClose }: { onResult: (r: BarcodeResult) => void; onClose: () => void }) {
  const [Component, setComponent] = useState<React.ComponentType<{ onResult: (r: BarcodeResult) => void; onClose: () => void }> | null>(null)

  if (!Component) {
    import('@/components/health/BarcodeScanner').then((m) => setComponent(() => m.BarcodeScanner))
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
        <Loader2 size={32} className="text-white animate-spin" />
      </div>
    )
  }

  return <Component onResult={onResult} onClose={onClose} />
}

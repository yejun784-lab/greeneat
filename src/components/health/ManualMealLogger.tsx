'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { PenLine, Plus, Loader2, ScanBarcode, CheckCircle2, Search, Leaf, Store, Minus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { type MealType, MEAL_TYPE_META } from '@/lib/utils'
import { toast } from '@/lib/toast-store'
import type { BarcodeResult } from '@/app/api/barcode/route'
import type { FoodSearchItem } from '@/app/api/food-search/route'
import { searchBuiltinFoods, normalizeFoodName } from '@/lib/food-db'

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
  const [scannedName, setScannedName] = useState('')
  const [scannedSource, setScannedSource] = useState<'openfoodfacts' | 'foodsafety' | null>(null)

  // 수량 & 기준 영양소 (음식 선택 시 저장)
  const [quantity, setQuantity] = useState(1)
  const [baseNutrition, setBaseNutrition] = useState<{
    calories: number | null
    protein: number | null
    carbs: number | null
    fat: number | null
    servingSize: string | null
  } | null>(null)

  // 음식 검색
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<FoodSearchItem[]>([])
  const [searching, setSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleScanResult(result: BarcodeResult) {
    setShowScanner(false)
    setScannedName(result.name)
    setScannedSource(result.source)
    setQuantity(1)
    setBaseNutrition({
      calories: result.calories ?? null,
      protein:  result.protein  ?? null,
      carbs:    result.carbs    ?? null,
      fat:      result.fat      ?? null,
      servingSize: null,
    })
    if (result.name)     setDescription(result.name)
    if (result.calories) setCalories(String(Math.round(result.calories)))
    if (result.protein)  setProtein(String(Math.round(result.protein * 10) / 10))
    if (result.carbs)    setCarbs(String(Math.round(result.carbs * 10) / 10))
    if (result.fat)      setFat(String(Math.round(result.fat * 10) / 10))
    toast.success(`"${result.name || '상품'}" 영양 정보를 불러왔어요 🔍`)
  }

  // 수량 변경 → 영양소 비례 재계산
  function handleQuantityChange(q: number) {
    const next = Math.max(0.5, Math.round(q * 2) / 2) // 0.5 단위
    setQuantity(next)
    if (!baseNutrition) return
    const { calories: bc, protein: bp, carbs: bca, fat: bf } = baseNutrition
    if (bc  != null) setCalories(String(Math.round(bc  * next)))
    if (bp  != null) setProtein(String(Math.round(bp  * next * 10) / 10))
    if (bca != null) setCarbs(String(Math.round(bca * next * 10) / 10))
    if (bf  != null) setFat(String(Math.round(bf  * next * 10) / 10))
  }

  // 검색어 변경 → 내장 DB 즉시 + GreenEat 상품 200ms 디바운스
  function handleSearchChange(value: string) {
    setSearchQuery(value)
    setShowDropdown(true)
    if (searchTimer.current) clearTimeout(searchTimer.current)

    if (!value.trim()) {
      setSearchResults([])
      setSearching(false)
      return
    }

    // ① 내장 DB: 즉시 결과 표시 (0ms, 네트워크 없음)
    const builtin: FoodSearchItem[] = searchBuiltinFoods(value.trim(), 8).map(f => ({
      id: f.id,
      name: f.name,
      calories: f.calories,
      protein: f.protein,
      carbs: f.carbs,
      fat: f.fat,
      servingSize: f.servingSize,
      source: 'foodsafety' as const,
    }))
    setSearchResults(builtin)

    // ② GreenEat 상품: 200ms 디바운스 후 서버 요청
    setSearching(true)
    searchTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/food-search?q=${encodeURIComponent(value.trim())}`)
        const greeneat: FoodSearchItem[] = await res.json()
        // GreenEat 상품 앞에, 중복 제거한 내장 결과 뒤에 합산
        // 정규화 비교: "김치찌개(돼지고기류)" ↔ "김치찌개" 동일 처리
        const seenNorm = new Set(greeneat.map(i => normalizeFoodName(i.name)))
        const deduped = builtin.filter(b => {
          const norm = normalizeFoodName(b.name)
          return !seenNorm.has(norm) &&
            !Array.from(seenNorm).some(s => s.includes(norm) || norm.includes(s))
        })
        setSearchResults([...greeneat, ...deduped].slice(0, 10))
      } catch { /* 서버 실패 시 내장 결과 유지 */ }
      setSearching(false)
    }, 200)
  }

  // 결과 선택 → 모든 필드 자동 채우기 + 기준 영양소 저장
  function selectFood(item: FoodSearchItem) {
    setDescription(item.name)
    setQuantity(1)
    setBaseNutrition({
      calories: item.calories,
      protein:  item.protein,
      carbs:    item.carbs,
      fat:      item.fat,
      servingSize: item.servingSize,
    })
    if (item.calories != null) setCalories(String(Math.round(item.calories)))
    if (item.protein  != null) setProtein(String(Math.round(item.protein * 10) / 10))
    if (item.carbs    != null) setCarbs(String(Math.round(item.carbs * 10) / 10))
    if (item.fat      != null) setFat(String(Math.round(item.fat * 10) / 10))
    setScannedName(item.name)
    setScannedSource('foodsafety')
    setSearchQuery('')
    setSearchResults([])
    setShowDropdown(false)
    toast.success(`"${item.name}" 영양 정보를 불러왔어요 🍽️`)
  }

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

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
    setQuantity(1)
    setBaseNutrition(null)
    router.refresh()
  }

  return (
    <>
      <div className="bg-surface rounded-2xl border border-line overflow-hidden">
        {/* 헤더 */}
        <button
          onClick={() => {
            if (!userId) {
              toast.info('로그인 후 식단을 기록할 수 있어요.', { action: { label: '로그인', href: '/login' } })
              return
            }
            setOpen((o) => !o)
          }}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-wash transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center">
              <PenLine size={15} className="text-blue-500" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-ink text-sm">직접 입력</p>
              <p className="text-xs text-ink-4">사진 없이 칼로리를 수동으로 기록해요</p>
            </div>
          </div>
          <Plus size={18} className={`text-ink-4 transition-transform ${open ? 'rotate-45' : ''}`} />
        </button>

        {/* 폼 */}
        {open && (
          <form onSubmit={handleSave} className="px-5 pb-5 space-y-3 border-t border-line pt-4">
            {/* 날짜 + 식사 유형 */}
            <div className="flex gap-2">
              <input
                type="date"
                value={date}
                max={today}
                onChange={(e) => setDate(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-line-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d7a4f] text-ink-2"
              />
              <div className="flex gap-1">
                {(Object.keys(MEAL_TYPE_META) as MealType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setMealType(t)}
                    className={`px-2.5 py-2 text-xs rounded-xl font-medium transition-colors ${
                      mealType === t ? 'bg-[#2d7a4f] text-white' : 'bg-tint text-ink-3 hover:bg-green-tint hover:text-[#2d7a4f]'
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
              className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-[#2d7a4f]/40 rounded-xl text-sm font-medium text-[#2d7a4f] hover:border-[#2d7a4f] hover:bg-green-tint-2 transition-colors"
            >
              <ScanBarcode size={16} />
              바코드 스캔으로 자동 입력
            </button>

            {/* ── 음식 검색 ── */}
            <div ref={searchRef} className="relative">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-4 pointer-events-none" />
                {searching && (
                  <Loader2 size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-4 animate-spin pointer-events-none" />
                )}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => searchQuery && setShowDropdown(true)}
                  placeholder="음식 검색 (예: 김치찌개, 닭가슴살)"
                  className="w-full pl-8 pr-8 py-2.5 text-sm border border-line-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d7a4f] text-ink-2 placeholder:text-ink-5"
                />
              </div>

              {/* 드롭다운 결과 */}
              {showDropdown && (searchResults.length > 0 || searching) && (
                <div className="absolute z-30 top-full mt-1 w-full bg-surface border border-line rounded-2xl shadow-xl overflow-hidden">
                  {searching && searchResults.length === 0 ? (
                    <div className="px-4 py-3 text-xs text-ink-4 flex items-center gap-2">
                      <Loader2 size={12} className="animate-spin" /> 검색 중...
                    </div>
                  ) : (
                    <ul>
                      {searchResults.map((item) => (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => selectFood(item)}
                            className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-tint transition-colors text-left"
                          >
                            {/* 아이콘 */}
                            {item.source === 'greeneat' ? (
                              item.imageUrl ? (
                                <img src={item.imageUrl} alt="" className="w-8 h-8 rounded-lg object-cover shrink-0" />
                              ) : (
                                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                                  <Store size={13} className="text-[#2d7a4f]" />
                                </div>
                              )
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                <Leaf size={13} className="text-blue-500" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-ink truncate">{item.name}</p>
                              <p className="text-[10px] text-ink-4">
                                {item.calories != null ? `${Math.round(item.calories)} kcal` : '칼로리 정보 없음'}
                                {item.servingSize ? ` · ${item.servingSize}` : ''}
                              </p>
                            </div>
                            <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ${
                              item.source === 'greeneat'
                                ? 'bg-[#2d7a4f]/10 text-[#2d7a4f]'
                                : 'bg-blue-50 text-blue-500'
                            }`}>
                              {item.source === 'greeneat' ? 'GreenEat' : '식품DB'}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* 스캔/선택 성공 배지 + 수량 조절 */}
            {scannedName && (
              <div className="space-y-2">
                {/* 배지 */}
                <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700">
                  <CheckCircle2 size={13} className="shrink-0" />
                  <span className="truncate flex-1">"{scannedName}" 영양 정보 자동 입력됨</span>
                  <span className="text-[10px] text-green-500 shrink-0">
                    {scannedSource === 'foodsafety' ? '식품안전처' : 'OFF'}
                  </span>
                </div>

                {/* 수량 조절 */}
                {baseNutrition && (
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-tint border border-line rounded-xl">
                    <span className="text-xs text-ink-4 shrink-0">수량</span>
                    <div className="flex items-center gap-1.5 ml-auto">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(quantity - 0.5)}
                        disabled={quantity <= 0.5}
                        className="w-7 h-7 rounded-lg bg-surface border border-line-2 flex items-center justify-center text-ink-3 hover:border-[#2d7a4f] hover:text-[#2d7a4f] disabled:opacity-30 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <input
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(parseFloat(e.target.value) || 0.5)}
                        className="w-12 text-center text-sm font-semibold text-ink border border-line-2 rounded-lg py-1 bg-surface focus:outline-none focus:ring-2 focus:ring-[#2d7a4f]"
                      />
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(quantity + 0.5)}
                        className="w-7 h-7 rounded-lg bg-surface border border-line-2 flex items-center justify-center text-ink-3 hover:border-[#2d7a4f] hover:text-[#2d7a4f] transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                      {baseNutrition.servingSize && (
                        <span className="text-xs text-ink-4 ml-1">× {baseNutrition.servingSize}</span>
                      )}
                    </div>
                    {baseNutrition.calories != null && (
                      <span className="text-xs font-semibold text-[#2d7a4f] shrink-0 ml-2">
                        = {Math.round(baseNutrition.calories * quantity)} kcal
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* 음식 이름 */}
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="음식 이름 (예: 된장찌개, 삼겹살 200g)"
              className="w-full px-3 py-2.5 text-sm border border-line-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d7a4f] text-ink-2 placeholder:text-ink-5"
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
                  <label className="block text-[10px] text-ink-4 mb-1">{label} <span className="text-ink-5">({unit})</span></label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    placeholder="0"
                    className="w-full px-2 py-2 text-sm border border-line-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d7a4f] text-ink-2 text-center"
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

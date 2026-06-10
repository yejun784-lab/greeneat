'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  PenLine, Plus, Loader2, ScanBarcode, CheckCircle2, Search,
  Leaf, Store, Minus, X, Flame, Dumbbell, Wheat, Droplets,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { type MealType, MEAL_TYPE_META } from '@/lib/utils'
import { toast } from '@/lib/toast-store'
import type { BarcodeResult } from '@/app/api/barcode/route'
import type { FoodSearchItem } from '@/app/api/food-search/route'
import { searchBuiltinFoods, normalizeFoodName } from '@/lib/food-db'

/* ── 퀵 카테고리 칩 ─────────────────────────────────────── */
const QUICK_CATS = [
  { label: '🍚 밥류', query: '밥' },
  { label: '🍜 면류', query: '라면' },
  { label: '🥗 샐러드', query: '샐러드' },
  { label: '🍗 치킨', query: '치킨' },
  { label: '🍕 피자', query: '피자' },
  { label: '☕ 카페', query: '카페' },
  { label: '🍣 초밥', query: '초밥' },
  { label: '🥩 구이', query: '구이' },
  { label: '🍞 빵', query: '빵' },
  { label: '🍫 과자', query: '과자' },
  { label: '🍎 과일', query: '과일' },
  { label: '🏋️ 건강식', query: '건강식' },
]

/* ── 최근 먹은 음식 (localStorage) ──────────────────────── */
function getRecentFoods(): FoodSearchItem[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem('ge_recent_foods') ?? '[]') } catch { return [] }
}
function saveRecentFood(item: FoodSearchItem) {
  if (typeof window === 'undefined') return
  try {
    const prev = getRecentFoods().filter(f => f.id !== item.id)
    localStorage.setItem('ge_recent_foods', JSON.stringify([item, ...prev].slice(0, 8)))
  } catch {}
}

/* ── 매크로 미니 바 ──────────────────────────────────────── */
function MacroBar({ protein, carbs, fat }: { protein: number | null; carbs: number | null; fat: number | null }) {
  const p = (protein ?? 0) * 4
  const c = (carbs ?? 0) * 4
  const f = (fat ?? 0) * 9
  const total = p + c + f
  if (total === 0) return null
  return (
    <div className="flex h-1 w-20 rounded-full overflow-hidden gap-[1px] shrink-0">
      <div style={{ width: `${(p / total) * 100}%` }} className="bg-blue-400" />
      <div style={{ width: `${(c / total) * 100}%` }} className="bg-amber-400" />
      <div style={{ width: `${(f / total) * 100}%` }} className="bg-rose-400" />
    </div>
  )
}

/* ── 소스 뱃지 ───────────────────────────────────────────── */
function SourceBadge({ source }: { source: FoodSearchItem['source'] }) {
  if (source === 'greeneat') return (
    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#2d7a4f]/10 text-[#2d7a4f]">GreenEat</span>
  )
  if (source === 'ai') return (
    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-violet-50 text-violet-500">AI</span>
  )
  return (
    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-sky-50 text-sky-500">식품DB</span>
  )
}

/* ── 음식 아이콘 ─────────────────────────────────────────── */
function FoodIcon({ item }: { item: FoodSearchItem }) {
  if (item.source === 'greeneat' && item.imageUrl) {
    return <img src={item.imageUrl} alt="" className="w-9 h-9 rounded-xl object-cover shrink-0" />
  }
  const bg = item.source === 'greeneat' ? 'bg-green-50' : item.source === 'ai' ? 'bg-violet-50' : 'bg-sky-50'
  const Icon = item.source === 'greeneat' ? Store : Leaf
  const color = item.source === 'greeneat' ? 'text-[#2d7a4f]' : item.source === 'ai' ? 'text-violet-400' : 'text-sky-500'
  return (
    <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
      <Icon size={14} className={color} />
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
 * Main Component
 * ══════════════════════════════════════════════════════════ */
export function ManualMealLogger({ userId }: { userId?: string | null }) {
  const router = useRouter()

  /* sheet 상태 */
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<'search' | 'form'>('search')

  /* 폼 */
  const today = new Date().toISOString().split('T')[0]
  const [date, setDate] = useState(today)
  const [mealType, setMealType] = useState<MealType>('lunch')
  const [description, setDescription] = useState('')
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [carbs, setCarbs] = useState('')
  const [fat, setFat] = useState('')
  const [saving, setSaving] = useState(false)

  /* 바코드 */
  const [showScanner, setShowScanner] = useState(false)
  const [scannedName, setScannedName] = useState('')

  /* 수량 */
  const [quantity, setQuantity] = useState(1)
  const [baseNutrition, setBaseNutrition] = useState<{
    calories: number | null; protein: number | null
    carbs: number | null; fat: number | null; servingSize: string | null
  } | null>(null)

  /* 검색 */
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<FoodSearchItem[]>([])
  const [searching, setSearching] = useState(false)
  const [recentFoods, setRecentFoods] = useState<FoodSearchItem[]>([])
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  /* sheet 열릴 때 최근 음식 로드 */
  useEffect(() => {
    if (open) {
      setRecentFoods(getRecentFoods())
      setTimeout(() => searchInputRef.current?.focus(), 100)
    }
  }, [open])

  /* body scroll lock */
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  function openSheet() {
    if (!userId) {
      toast.info('로그인 후 식단을 기록할 수 있어요.', { action: { label: '로그인', href: '/login' } })
      return
    }
    setStep('search')
    setOpen(true)
  }
  function closeSheet() {
    setOpen(false)
    setSearchQuery('')
    setSearchResults([])
  }

  /* 검색 */
  function handleSearchChange(value: string) {
    setSearchQuery(value)
    if (searchTimer.current) clearTimeout(searchTimer.current)
    if (!value.trim()) { setSearchResults([]); setSearching(false); return }
    const builtin: FoodSearchItem[] = searchBuiltinFoods(value.trim(), 10).map(f => ({
      id: f.id, name: f.name, calories: f.calories,
      protein: f.protein, carbs: f.carbs, fat: f.fat,
      servingSize: f.servingSize, source: 'foodsafety' as const,
    }))
    setSearchResults(builtin)
    setSearching(true)
    searchTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/food-search?q=${encodeURIComponent(value.trim())}`)
        const server: FoodSearchItem[] = await res.json()
        const seenNorm = new Set(server.map(i => normalizeFoodName(i.name)))
        const deduped = builtin.filter(b => {
          const n = normalizeFoodName(b.name)
          return !seenNorm.has(n) && !Array.from(seenNorm).some(s => s.includes(n) || n.includes(s))
        })
        setSearchResults([...server, ...deduped].slice(0, 12))
      } catch { /* 로컬 결과 유지 */ }
      setSearching(false)
    }, 200)
  }

  function handleCatClick(query: string) {
    setSearchQuery(query)
    handleSearchChange(query)
    searchInputRef.current?.focus()
  }

  /* 음식 선택 */
  function selectFood(item: FoodSearchItem) {
    saveRecentFood(item)
    setRecentFoods(getRecentFoods())
    setDescription(item.name)
    setQuantity(1)
    setBaseNutrition({
      calories: item.calories, protein: item.protein,
      carbs: item.carbs, fat: item.fat, servingSize: item.servingSize,
    })
    if (item.calories != null) setCalories(String(Math.round(item.calories)))
    if (item.protein  != null) setProtein(String(Math.round(item.protein * 10) / 10))
    if (item.carbs    != null) setCarbs(String(Math.round(item.carbs * 10) / 10))
    if (item.fat      != null) setFat(String(Math.round(item.fat * 10) / 10))
    setScannedName(item.name)
    setStep('form')
  }

  /* 바코드 결과 */
  function handleScanResult(result: BarcodeResult) {
    setShowScanner(false)
    setScannedName(result.name)
    setQuantity(1)
    setBaseNutrition({
      calories: result.calories ?? null, protein: result.protein ?? null,
      carbs: result.carbs ?? null, fat: result.fat ?? null, servingSize: null,
    })
    if (result.name)     setDescription(result.name)
    if (result.calories) setCalories(String(Math.round(result.calories)))
    if (result.protein)  setProtein(String(Math.round(result.protein * 10) / 10))
    if (result.carbs)    setCarbs(String(Math.round(result.carbs * 10) / 10))
    if (result.fat)      setFat(String(Math.round(result.fat * 10) / 10))
    setStep('form')
    toast.success(`"${result.name || '상품'}" 영양 정보 로드 완료`)
  }

  /* 수량 */
  function handleQuantityChange(q: number) {
    const next = Math.max(0.5, Math.round(q * 2) / 2)
    setQuantity(next)
    if (!baseNutrition) return
    const { calories: bc, protein: bp, carbs: bca, fat: bf } = baseNutrition
    if (bc  != null) setCalories(String(Math.round(bc  * next)))
    if (bp  != null) setProtein(String(Math.round(bp  * next * 10) / 10))
    if (bca != null) setCarbs(String(Math.round(bca * next * 10) / 10))
    if (bf  != null) setFat(String(Math.round(bf  * next * 10) / 10))
  }

  /* 저장 */
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
      user_id: user.id, date, meal_type: mealType,
      description: description.trim(), calories: cal,
      protein: protein ? parseFloat(protein) : null,
      carbs: carbs ? parseFloat(carbs) : null,
      fat: fat ? parseFloat(fat) : null,
    })
    setSaving(false)
    if (error) { toast.error('저장에 실패했어요.'); return }
    toast.success('식단이 기록됐어요! 📝')
    closeSheet()
    setDescription(''); setCalories(''); setProtein(''); setCarbs(''); setFat('')
    setScannedName(''); setQuantity(1); setBaseNutrition(null)
    router.refresh()
  }

  const mealTypes = Object.keys(MEAL_TYPE_META) as MealType[]

  /* ── 렌더 ──────────────────────────────────────────────── */
  return (
    <>
      {/* ── 트리거 카드 ── */}
      <button
        onClick={openSheet}
        className="w-full flex items-center gap-4 bg-surface border border-line rounded-2xl px-5 py-4 hover:border-primary/30 hover:bg-green-tint/30 transition-all group"
      >
        <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
          <PenLine size={17} className="text-blue-500" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-semibold text-ink">식단 직접 기록</p>
          <p className="text-xs text-ink-4 mt-0.5">음식 검색 또는 직접 입력으로 기록해요</p>
        </div>
        <div className="w-7 h-7 rounded-xl bg-tint flex items-center justify-center shrink-0">
          <Plus size={14} className="text-ink-3" />
        </div>
      </button>

      {/* ── 바코드 스캐너 ── */}
      {showScanner && (
        <BarcodeScannerLazy onResult={handleScanResult} onClose={() => setShowScanner(false)} />
      )}

      {/* ── Bottom Sheet ── */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end">
          {/* 딤 */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={closeSheet}
          />

          {/* 시트 */}
          <div className="relative bg-surface rounded-t-3xl max-h-[92dvh] flex flex-col shadow-2xl">
            {/* 핸들 */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-line-2" />
            </div>

            {/* 헤더 */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-line shrink-0">
              <div className="flex items-center gap-3">
                {step === 'form' && (
                  <button
                    type="button"
                    onClick={() => setStep('search')}
                    className="w-7 h-7 rounded-full bg-tint flex items-center justify-center"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-ink-3">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                  </button>
                )}
                <div>
                  <p className="font-bold text-ink text-sm">
                    {step === 'search' ? '음식 검색' : '영양 정보 입력'}
                  </p>
                  {step === 'search' && (
                    <p className="text-[11px] text-ink-4">음식 이름 또는 카테고리로 검색하세요</p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={closeSheet}
                className="w-8 h-8 rounded-full bg-tint flex items-center justify-center hover:bg-line transition-colors"
              >
                <X size={15} className="text-ink-3" />
              </button>
            </div>

            {/* ── Step 1: 검색 ── */}
            {step === 'search' && (
              <div className="flex flex-col flex-1 overflow-hidden">
                {/* 검색 입력 */}
                <div className="px-4 pt-3 pb-2 shrink-0">
                  <div className="relative">
                    <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-4 pointer-events-none" />
                    {searching && (
                      <Loader2 size={13} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-4 animate-spin pointer-events-none" />
                    )}
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      placeholder="예: 김치찌개, 삼겹살, 아이스아메리카노"
                      className="w-full pl-9 pr-9 py-3 text-sm bg-tint border border-line-2 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-surface text-ink-2 placeholder:text-ink-5 transition-colors"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => { setSearchQuery(''); setSearchResults([]) }}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-4 hover:text-ink-2"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>

                  {/* 바코드 버튼 */}
                  <button
                    type="button"
                    onClick={() => setShowScanner(true)}
                    className="w-full mt-2 flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-ink-3 border border-dashed border-line-2 rounded-xl hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    <ScanBarcode size={13} />
                    바코드 스캔
                  </button>
                </div>

                {/* 결과 / 카테고리 / 최근 */}
                <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-6">
                  {searchQuery.trim() === '' ? (
                    /* 검색 전: 카테고리 + 최근 */
                    <div className="space-y-4">
                      {/* 카테고리 칩 */}
                      <div>
                        <p className="text-[11px] font-semibold text-ink-4 mb-2">카테고리 빠른 검색</p>
                        <div className="flex flex-wrap gap-1.5">
                          {QUICK_CATS.map((c) => (
                            <button
                              key={c.query}
                              type="button"
                              onClick={() => handleCatClick(c.query)}
                              className="px-3 py-1.5 text-xs font-medium bg-tint text-ink-3 border border-line-2 rounded-full hover:bg-green-tint hover:text-primary hover:border-primary/30 transition-colors"
                            >
                              {c.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 최근 먹은 음식 */}
                      {recentFoods.length > 0 && (
                        <div>
                          <p className="text-[11px] font-semibold text-ink-4 mb-2">최근 기록한 음식</p>
                          <div className="space-y-1">
                            {recentFoods.map((item) => (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => selectFood(item)}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-tint transition-colors text-left"
                              >
                                <FoodIcon item={item} />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-ink truncate">{item.name}</p>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    {item.calories != null && (
                                      <span className="text-[10px] text-ink-4">{Math.round(item.calories)} kcal</span>
                                    )}
                                    {item.servingSize && (
                                      <span className="text-[10px] text-ink-5">· {item.servingSize}</span>
                                    )}
                                  </div>
                                </div>
                                <MacroBar protein={item.protein} carbs={item.carbs} fat={item.fat} />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {recentFoods.length === 0 && (
                        <div className="text-center py-8 text-ink-4">
                          <Search size={28} className="mx-auto mb-2 opacity-20" />
                          <p className="text-xs">위에서 검색하거나 카테고리를 눌러보세요</p>
                        </div>
                      )}
                    </div>
                  ) : searchResults.length === 0 && !searching ? (
                    /* 결과 없음 */
                    <div className="py-10 text-center">
                      <div className="w-14 h-14 rounded-2xl bg-tint flex items-center justify-center mx-auto mb-3">
                        <Search size={22} className="text-ink-4" />
                      </div>
                      <p className="text-sm font-semibold text-ink mb-1">검색 결과가 없어요</p>
                      <p className="text-xs text-ink-4 mb-4">AI가 영양 정보를 찾는 중이에요...<br />또는 아래 직접 입력을 이용해보세요</p>
                      <button
                        type="button"
                        onClick={() => {
                          setDescription(searchQuery)
                          setStep('form')
                        }}
                        className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl"
                      >
                        "{searchQuery}" 직접 입력하기
                      </button>
                    </div>
                  ) : (
                    /* 검색 결과 */
                    <div className="space-y-1 mt-1">
                      {searching && searchResults.length === 0 ? (
                        <div className="flex items-center gap-2 py-4 px-2 text-xs text-ink-4">
                          <Loader2 size={13} className="animate-spin" />
                          검색 중...
                        </div>
                      ) : (
                        searchResults.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => selectFood(item)}
                            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-tint active:bg-tint transition-colors text-left"
                          >
                            <FoodIcon item={item} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <p className="text-sm font-semibold text-ink truncate">{item.name}</p>
                                <SourceBadge source={item.source} />
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] text-ink-3 font-medium">
                                  {item.calories != null ? `${Math.round(item.calories)} kcal` : '–'}
                                </span>
                                {item.servingSize && (
                                  <span className="text-[10px] text-ink-5">{item.servingSize}</span>
                                )}
                              </div>
                              {/* 매크로 뱃지 */}
                              <div className="flex items-center gap-1 mt-1">
                                {item.protein != null && (
                                  <span className="text-[9px] px-1 py-0.5 rounded bg-blue-50 text-blue-500 font-medium">P {Math.round(item.protein)}g</span>
                                )}
                                {item.carbs != null && (
                                  <span className="text-[9px] px-1 py-0.5 rounded bg-amber-50 text-amber-500 font-medium">C {Math.round(item.carbs)}g</span>
                                )}
                                {item.fat != null && (
                                  <span className="text-[9px] px-1 py-0.5 rounded bg-rose-50 text-rose-500 font-medium">F {Math.round(item.fat)}g</span>
                                )}
                              </div>
                            </div>
                            <MacroBar protein={item.protein} carbs={item.carbs} fat={item.fat} />
                          </button>
                        ))
                      )}
                      {/* 직접 입력 버튼 */}
                      <button
                        type="button"
                        onClick={() => {
                          setDescription(searchQuery)
                          setStep('form')
                        }}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl border border-dashed border-line-2 hover:border-primary/40 hover:bg-green-tint/30 transition-colors mt-2"
                      >
                        <div className="w-9 h-9 rounded-xl bg-tint flex items-center justify-center shrink-0">
                          <PenLine size={14} className="text-ink-3" />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-semibold text-ink">"{searchQuery}" 직접 입력</p>
                          <p className="text-[10px] text-ink-4">칼로리를 수동으로 기록해요</p>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── Step 2: 폼 ── */}
            {step === 'form' && (
              <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
                <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4 space-y-4 pb-6">

                  {/* 선택된 음식 카드 */}
                  {scannedName && (
                    <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-100 dark:border-green-900/40 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <CheckCircle2 size={13} className="text-primary shrink-0" />
                            <span className="text-[10px] font-semibold text-primary">선택된 음식</span>
                          </div>
                          <p className="font-semibold text-ink text-sm leading-snug">{scannedName}</p>
                          {baseNutrition?.servingSize && (
                            <p className="text-[10px] text-ink-4 mt-0.5">기준: {baseNutrition.servingSize}</p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-2xl font-bold text-primary leading-none">
                            {baseNutrition?.calories != null ? Math.round(baseNutrition.calories * quantity) : calories || '–'}
                          </p>
                          <p className="text-[10px] text-ink-4">kcal</p>
                        </div>
                      </div>

                      {/* 매크로 바 */}
                      {baseNutrition && (
                        <div className="mt-3">
                          <div className="grid grid-cols-3 gap-2 mb-2">
                            {[
                              { label: '단백질', val: baseNutrition.protein, mul: quantity, color: 'text-blue-500', bg: 'bg-blue-50', icon: Dumbbell },
                              { label: '탄수화물', val: baseNutrition.carbs, mul: quantity, color: 'text-amber-500', bg: 'bg-amber-50', icon: Wheat },
                              { label: '지방', val: baseNutrition.fat, mul: quantity, color: 'text-rose-500', bg: 'bg-rose-50', icon: Droplets },
                            ].map(({ label, val, mul, color, bg, icon: Icon }) => (
                              <div key={label} className={`${bg} rounded-xl p-2 text-center`}>
                                <Icon size={10} className={`${color} mx-auto mb-0.5`} />
                                <p className={`text-xs font-bold ${color}`}>{val != null ? Math.round(val * mul * 10) / 10 : '–'}g</p>
                                <p className="text-[9px] text-ink-4">{label}</p>
                              </div>
                            ))}
                          </div>

                          {/* 수량 조절 */}
                          <div className="flex items-center gap-2 mt-2 px-1">
                            <span className="text-[11px] text-ink-4 shrink-0">수량</span>
                            <div className="flex items-center gap-2 ml-auto bg-white dark:bg-surface-dark rounded-xl border border-line px-2 py-1">
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(quantity - 0.5)}
                                disabled={quantity <= 0.5}
                                className="w-6 h-6 rounded-lg flex items-center justify-center text-ink-3 hover:text-primary disabled:opacity-30"
                              >
                                <Minus size={11} />
                              </button>
                              <input
                                type="number"
                                min="0.5"
                                step="0.5"
                                value={quantity}
                                onChange={(e) => handleQuantityChange(parseFloat(e.target.value) || 0.5)}
                                className="w-10 text-center text-sm font-bold text-ink bg-transparent focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(quantity + 0.5)}
                                className="w-6 h-6 rounded-lg flex items-center justify-center text-ink-3 hover:text-primary"
                              >
                                <Plus size={11} />
                              </button>
                            </div>
                            {baseNutrition.servingSize && (
                              <span className="text-[10px] text-ink-4">× {baseNutrition.servingSize}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 날짜 + 식사 유형 */}
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-ink-3">날짜 & 식사 유형</p>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={date}
                        max={today}
                        onChange={(e) => setDate(e.target.value)}
                        className="flex-1 min-w-0 px-3 py-2.5 text-sm border border-line-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-ink-2 bg-surface"
                      />
                      <div className="flex gap-1 shrink-0">
                        {mealTypes.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setMealType(t)}
                            className={`px-2.5 py-2 text-xs rounded-xl font-semibold transition-all ${
                              mealType === t
                                ? 'bg-primary text-white shadow-sm'
                                : 'bg-tint text-ink-3 hover:bg-green-tint hover:text-primary'
                            }`}
                          >
                            {MEAL_TYPE_META[t].label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 음식 이름 */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-ink-3">음식 이름</label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="예: 된장찌개, 삼겹살 200g"
                      className="w-full px-3 py-2.5 text-sm border border-line-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-ink-2 placeholder:text-ink-5 bg-surface"
                    />
                  </div>

                  {/* 영양소 입력 */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-ink-3">영양소 <span className="text-ink-5 font-normal">(칼로리는 필수)</span></label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { key: 'calories', label: '칼로리', unit: 'kcal', value: calories, setter: setCalories, color: 'focus:ring-orange-400/40', icon: Flame, iconColor: 'text-orange-400' },
                        { key: 'protein',  label: '단백질',  unit: 'g',    value: protein,  setter: setProtein,  color: 'focus:ring-blue-400/40',   icon: Dumbbell, iconColor: 'text-blue-400' },
                        { key: 'carbs',    label: '탄수화물', unit: 'g',   value: carbs,    setter: setCarbs,    color: 'focus:ring-amber-400/40',  icon: Wheat,    iconColor: 'text-amber-400' },
                        { key: 'fat',      label: '지방',    unit: 'g',    value: fat,      setter: setFat,      color: 'focus:ring-rose-400/40',   icon: Droplets, iconColor: 'text-rose-400' },
                      ].map(({ key, label, unit, value, setter, color, icon: Icon, iconColor }) => (
                        <div key={key} className="flex flex-col gap-1">
                          <div className="flex items-center justify-center gap-0.5">
                            <Icon size={9} className={iconColor} />
                            <span className="text-[9px] text-ink-4 font-medium">{label}</span>
                          </div>
                          <input
                            type="number"
                            min="0"
                            step="0.1"
                            value={value}
                            onChange={(e) => setter(e.target.value)}
                            placeholder="0"
                            className={`w-full px-1 py-2 text-sm border border-line-2 rounded-xl focus:outline-none focus:ring-2 ${color} text-ink-2 text-center bg-surface`}
                          />
                          <span className="text-[9px] text-ink-5 text-center">{unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 저장 버튼 */}
                <div className="px-4 pb-6 pt-2 border-t border-line shrink-0">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white text-sm font-bold rounded-2xl hover:bg-primary-hover active:scale-[0.98] transition-all disabled:opacity-60 shadow-md shadow-primary/20"
                  >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
                    {saving ? '기록 중...' : '식단 기록하기'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}

/* ── 바코드 스캐너 lazy ─────────────────────────────────── */
function BarcodeScannerLazy({
  onResult,
  onClose,
}: {
  onResult: (r: BarcodeResult) => void
  onClose: () => void
}) {
  const [Component, setComponent] = useState<React.ComponentType<{
    onResult: (r: BarcodeResult) => void
    onClose: () => void
  }> | null>(null)

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

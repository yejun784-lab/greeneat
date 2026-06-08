'use client'

import { useState, useMemo, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Loader2, RefreshCw, Check, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { GOAL_LABEL, type GoalInfo } from '@/lib/health-types'
import { toast } from '@/lib/toast-store'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

/* ── 타입 ──────────────────────────────────────────────────────── */
type MealSlot = 'breakfast' | 'lunch' | 'dinner'
type DayPlan = Record<MealSlot, Product | null>

type Props = {
  products: Product[]
  goal: string
  goalInfo?: GoalInfo
  allergens: string[]
  userId: string | null
}

/* ── 상수 ──────────────────────────────────────────────────────── */
const WEEKDAYS = ['월', '화', '수', '목', '금', '토', '일']
const MEAL_SLOTS: { key: MealSlot; label: string; emoji: string; desc: string }[] = [
  { key: 'breakfast', label: '아침', emoji: '🌅', desc: '가볍게 시작' },
  { key: 'lunch',     label: '점심', emoji: '☀️', desc: '든든한 한 끼'  },
  { key: 'dinner',    label: '저녁', emoji: '🌙', desc: '균형 있는 마무리' },
]

/* ── 영양소 점수 계산 (목표별 슬롯 배정) ──────────────────────── */
function score(p: Product, slot: MealSlot, goal: string): number {
  const cal  = p.calories ?? 400
  const prot = p.protein  ?? 0
  let s = 0
  if (slot === 'breakfast') {
    // 아침: 적당한 칼로리(200~500), 단백질 약간
    if (cal >= 200 && cal <= 500) s += 3
    if (prot >= 10 && prot <= 25) s += 2
    if (goal === 'diet' && cal <= 400) s += 2
  } else if (slot === 'lunch') {
    // 점심: 메인 식사 (400~700kcal)
    if (cal >= 350 && cal <= 700) s += 3
    if (goal === 'muscle' && prot >= 25) s += 3
    if (goal === 'diet' && cal <= 550) s += 2
  } else {
    // 저녁: 고단백, 중간 칼로리
    if (prot >= 20) s += 3
    if (cal >= 300 && cal <= 600) s += 2
    if (goal === 'muscle' && prot >= 30) s += 3
    if (goal === 'diet' && cal <= 450) s += 2
  }
  return s
}

/* ── 상품 슬롯 배정 ──────────────────────────────────────────── */
function buildWeekPlan(products: Product[], goal: string, allergens: string[], seed: number): DayPlan[] {
  // 알레르기 필터
  const safe = products.filter(p => {
    if (!p.is_active) return false
    if (allergens.length === 0) return true
    const text = `${p.name} ${p.description ?? ''}`.toLowerCase()
    return !allergens.some(a => text.includes(a.toLowerCase()))
  })
  if (safe.length === 0) return WEEKDAYS.map(() => ({ breakfast: null, lunch: null, dinner: null }))

  return WEEKDAYS.map((_, dayIdx) => {
    const plan: DayPlan = { breakfast: null, lunch: null, dinner: null }
    const used = new Set<string>()

    for (const slot of (['breakfast', 'lunch', 'dinner'] as MealSlot[])) {
      const sorted = [...safe]
        .map(p => ({ p, s: score(p, slot, goal) + ((p.id.charCodeAt(0) + dayIdx + seed) % 5) }))
        .sort((a, b) => b.s - a.s)
      const pick = sorted.find(x => !used.has(x.p.id))
      if (pick) { plan[slot] = pick.p; used.add(pick.p.id) }
      else if (safe.length > 0) { plan[slot] = safe[(dayIdx + seed) % safe.length] }
    }
    return plan
  })
}

/* ── 하루 영양소 합계 ──────────────────────────────────────────── */
function dayTotal(plan: DayPlan) {
  const meals = Object.values(plan).filter(Boolean) as Product[]
  return {
    cal:     meals.reduce((s, p) => s + (p.calories ?? 0), 0),
    protein: meals.reduce((s, p) => s + (p.protein  ?? 0), 0),
    carbs:   meals.reduce((s, p) => s + (p.carbs    ?? 0), 0),
    fat:     meals.reduce((s, p) => s + (p.fat      ?? 0), 0),
  }
}

/* ── 서브 컴포넌트 ─────────────────────────────────────────────── */
function MealCard({
  product, slot, onAdd,
}: { product: Product | null; slot: typeof MEAL_SLOTS[number]; onAdd: (p: Product) => void }) {
  if (!product) return (
    <div className="flex-1 rounded-2xl border-2 border-dashed border-line flex items-center justify-center min-h-[160px]">
      <p className="text-xs text-ink-5">준비 중</p>
    </div>
  )
  return (
    <div className="flex-1 rounded-2xl border border-line overflow-hidden bg-surface hover:shadow-md transition-shadow group">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-video bg-tint overflow-hidden">
          {product.image_url
            ? <Image src={product.image_url} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="200px" />
            : <div className="w-full h-full flex items-center justify-center text-2xl">🍱</div>
          }
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-0.5">
            <span className="text-[11px]">{slot.emoji}</span>
            <span className="text-[10px] text-white font-medium">{slot.label}</span>
          </div>
        </div>
      </Link>
      <div className="p-2.5">
        <p className="text-xs font-semibold text-ink line-clamp-1 mb-1">{product.name}</p>
        <div className="flex gap-2 text-[10px] text-ink-5 mb-2">
          {product.calories && <span>🔥{product.calories}kcal</span>}
          {product.protein  && <span>💪{product.protein}g</span>}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-[#2d7a4f]">{formatPrice(product.price)}</span>
          <button
            onClick={() => onAdd(product)}
            className="flex items-center gap-1 px-2 py-1 bg-[#2d7a4f] text-white rounded-lg text-[10px] font-semibold hover:bg-[#235f3d] transition-colors"
          >
            <ShoppingCart size={9} /> 담기
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── 메인 컴포넌트 ─────────────────────────────────────────────── */
export function AIMealPlan({ products, goal, goalInfo, allergens, userId }: Props) {
  const [seed,       setSeed]       = useState(0)
  const [dayIdx,     setDayIdx]     = useState(0)
  const [savedDays,  setSavedDays]  = useState<Set<number>>(new Set())
  const [addingAll,  setAddingAll]  = useState(false)

  const weekPlan = useMemo(
    () => buildWeekPlan(products, goal, allergens, seed),
    [products, goal, allergens, seed]
  )
  const currentPlan = weekPlan[dayIdx]
  const total       = dayTotal(currentPlan)
  const goalMeta    = GOAL_LABEL[goal]

  async function addProductToCart(product: Product) {
    if (!userId) {
      toast.info('로그인 후 장바구니를 이용할 수 있어요.', { action: { label: '로그인', href: '/login' } })
      return
    }
    const supabase = createClient()
    await supabase.from('cart_items').upsert(
      { user_id: userId, product_id: product.id, quantity: 1, is_subscription: false, display_group: product.display_group ?? 1 },
      { onConflict: 'user_id,product_id' }
    )
    toast.success(`"${product.name}" 장바구니에 담았어요!`)
  }

  const addAllToCart = useCallback(async () => {
    if (!userId) {
      toast.info('로그인 후 장바구니를 이용할 수 있어요.', { action: { label: '로그인', href: '/login' } })
      return
    }
    const items = Object.values(currentPlan).filter(Boolean) as Product[]
    if (items.length === 0) return
    setAddingAll(true)
    try {
      const supabase = createClient()
      await supabase.from('cart_items').upsert(
        items.map(p => ({ user_id: userId, product_id: p.id, quantity: 1, is_subscription: false, display_group: p.display_group ?? 1 })),
        { onConflict: 'user_id,product_id' }
      )
      toast.success(`${WEEKDAYS[dayIdx]}요일 식단 ${items.length}가지를 담았어요! 🛒`)
    } finally {
      setAddingAll(false)
    }
  }, [userId, currentPlan, dayIdx])

  function saveDay() {
    setSavedDays(prev => {
      const next = new Set(prev)
      next.has(dayIdx) ? next.delete(dayIdx) : next.add(dayIdx)
      return next
    })
    if (!savedDays.has(dayIdx)) toast.success(`${WEEKDAYS[dayIdx]}요일 식단을 저장했어요!`)
  }

  /* 영양소 바 */
  function NutrientBar({ label, current, target, color }: { label: string; current: number; target: number; color: string }) {
    const pct = target > 0 ? Math.min(Math.round((current / target) * 100), 100) : 0
    return (
      <div>
        <div className="flex justify-between text-[10px] mb-1">
          <span className="text-ink-5">{label}</span>
          <span className="text-ink-4 font-medium">{Math.round(current)}<span className="text-ink-5">/{target}</span></span>
        </div>
        <div className="h-1.5 bg-line-2 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">

      {/* ── 헤더 ── */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Sparkles size={15} className="text-[#2d7a4f]" />
          <span className="text-xs font-semibold text-ink-3">
            {goalMeta ? `${goalMeta.label} 맞춤 · 3끼 식단` : '맞춤 식단'}
          </span>
          {allergens.length > 0 && (
            <span className="text-[10px] text-ink-5 bg-tint px-2 py-0.5 rounded-full">
              알레르기 {allergens.length}종 제외
            </span>
          )}
        </div>
        <button
          onClick={() => setSeed(s => s + 1)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#2d7a4f] border border-[#2d7a4f]/30 rounded-xl hover:bg-green-tint transition-colors"
        >
          <RefreshCw size={11} />새로 추천
        </button>
      </div>

      {/* ── 요일 탭 ── */}
      <div className="flex gap-1 bg-tint p-1 rounded-2xl overflow-x-auto">
        {WEEKDAYS.map((day, i) => {
          const saved = savedDays.has(i)
          return (
            <button
              key={day}
              onClick={() => setDayIdx(i)}
              className={`relative flex-1 min-w-[40px] flex flex-col items-center py-2 rounded-xl text-xs font-semibold transition-all ${
                dayIdx === i
                  ? 'bg-surface text-[#2d7a4f] shadow-sm'
                  : 'text-ink-5 hover:text-ink-3'
              }`}
            >
              {day}
              {saved && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#2d7a4f] rounded-full border border-surface" />
              )}
            </button>
          )
        })}
      </div>

      {/* ── 3끼 카드 ── */}
      <div className="flex flex-col gap-3">
        {MEAL_SLOTS.map(slot => (
          <div key={slot.key} className="flex items-center gap-3">
            {/* 슬롯 레이블 */}
            <div className="w-12 shrink-0 flex flex-col items-center gap-0.5">
              <span className="text-lg">{slot.emoji}</span>
              <span className="text-[10px] font-semibold text-ink-4">{slot.label}</span>
            </div>

            {/* 상품 카드 */}
            {currentPlan[slot.key] ? (
              <div className="flex-1 flex items-center gap-3 bg-surface rounded-2xl border border-line p-3 hover:shadow-md transition-shadow group">
                <Link href={`/products/${currentPlan[slot.key]!.id}`} className="shrink-0">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-tint">
                    {currentPlan[slot.key]!.image_url
                      ? <Image src={currentPlan[slot.key]!.image_url!} alt={currentPlan[slot.key]!.name} width={64} height={64} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" />
                      : <div className="w-full h-full flex items-center justify-center text-xl">🍱</div>
                    }
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${currentPlan[slot.key]!.id}`}>
                    <p className="text-sm font-semibold text-ink line-clamp-1 hover:text-[#2d7a4f] transition-colors">
                      {currentPlan[slot.key]!.name}
                    </p>
                  </Link>
                  <div className="flex gap-2 mt-1 text-[11px] text-ink-5">
                    {currentPlan[slot.key]!.calories && <span>🔥 {currentPlan[slot.key]!.calories}kcal</span>}
                    {currentPlan[slot.key]!.protein  && <span>💪 단백질 {currentPlan[slot.key]!.protein}g</span>}
                  </div>
                  <p className="text-xs font-bold text-[#2d7a4f] mt-1">{formatPrice(currentPlan[slot.key]!.price)}</p>
                </div>
                <button
                  onClick={() => addProductToCart(currentPlan[slot.key]!)}
                  className="shrink-0 p-2 bg-[#2d7a4f] text-white rounded-xl hover:bg-[#235f3d] transition-colors"
                >
                  <ShoppingCart size={13} />
                </button>
              </div>
            ) : (
              <div className="flex-1 h-[74px] rounded-2xl border-2 border-dashed border-line flex items-center justify-center">
                <p className="text-xs text-ink-5">준비 중</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── 오늘 영양 합계 ── */}
      {goalInfo && (
        <div className="bg-tint rounded-2xl p-4 space-y-2.5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-semibold text-ink-3">
              {WEEKDAYS[dayIdx]}요일 예상 영양 합계
            </p>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              total.cal >= goalInfo.calTarget * 0.8 && total.cal <= goalInfo.calTarget * 1.1
                ? 'bg-green-tint text-[#2d7a4f]'
                : 'bg-amber-50 text-amber-600'
            }`}>
              {total.cal} / {goalInfo.calTarget} kcal
            </span>
          </div>
          <NutrientBar label="칼로리" current={total.cal}     target={goalInfo.calTarget}     color="bg-orange-400" />
          <NutrientBar label="단백질" current={total.protein} target={goalInfo.proteinTarget} color="bg-blue-500"   />
          <NutrientBar label="탄수화물" current={total.carbs}  target={goalInfo.carbsTarget}   color="bg-amber-400"  />
          <NutrientBar label="지방"   current={total.fat}     target={goalInfo.fatTarget}     color="bg-green-500"  />
        </div>
      )}

      {/* ── 액션 버튼 ── */}
      <div className="flex gap-2">
        <button
          onClick={saveDay}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border-2 transition-all ${
            savedDays.has(dayIdx)
              ? 'border-[#2d7a4f] bg-green-tint text-[#2d7a4f]'
              : 'border-line-2 text-ink-4 hover:border-[#2d7a4f]/50 hover:text-[#2d7a4f]'
          }`}
        >
          <Check size={12} strokeWidth={savedDays.has(dayIdx) ? 3 : 2} />
          {savedDays.has(dayIdx) ? '저장됨' : '식단 저장'}
        </button>
        <button
          onClick={addAllToCart}
          disabled={addingAll}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold text-white bg-[#2d7a4f] rounded-xl hover:bg-[#235f3d] disabled:opacity-60 transition-colors"
        >
          {addingAll ? <Loader2 size={12} className="animate-spin" /> : <ShoppingCart size={12} />}
          {WEEKDAYS[dayIdx]}요일 3끼 전체 담기
        </button>
      </div>

      {/* ── 주간 탐색 ── */}
      <div className="flex items-center justify-between text-xs text-ink-5 pt-1">
        <button
          onClick={() => setDayIdx(i => (i + 6) % 7)}
          className="flex items-center gap-1 hover:text-ink-3 transition-colors"
        >
          <ChevronLeft size={13} /> 이전 날
        </button>
        <span className="font-medium text-ink-4">{WEEKDAYS[dayIdx]}요일 식단</span>
        <button
          onClick={() => setDayIdx(i => (i + 1) % 7)}
          className="flex items-center gap-1 hover:text-ink-3 transition-colors"
        >
          다음 날 <ChevronRight size={13} />
        </button>
      </div>
    </div>
  )
}

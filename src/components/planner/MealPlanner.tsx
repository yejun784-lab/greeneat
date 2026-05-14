'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Plus, X, ShoppingCart, ChevronDown, ChevronUp, Flame, Dumbbell, Save, RotateCcw, Loader2 } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import { formatPrice } from '@/lib/utils'
import { toast } from '@/lib/toast-store'
import { createClient } from '@/lib/supabase/client'
import type { Product } from '@/types'

const DAYS = ['월', '화', '수', '목', '금', '토', '일']
const MEALS = ['아침', '점심', '저녁']
const MEAL_TYPES = ['breakfast', 'lunch', 'dinner'] as const

type PlanCell = { product: Product } | null
type Plan = PlanCell[][]  // [day][meal]

/** 이번 주 월요일 날짜를 YYYY-MM-DD 형식으로 반환 */
function getWeekStart(): string {
  const now = new Date()
  const day = now.getDay() // 0=일 ~ 6=토
  const diff = day === 0 ? -6 : 1 - day // 월요일로
  const monday = new Date(now)
  monday.setDate(now.getDate() + diff)
  return monday.toISOString().split('T')[0]
}

export function MealPlanner({ products, userId }: { products: Product[]; userId?: string }) {
  const { addItem } = useCartStore()

  const emptyPlan: Plan = Array.from({ length: 7 }, () => Array(3).fill(null))
  const [plan, setPlan] = useState<Plan>(emptyPlan)
  const [picking, setPicking] = useState<{ day: number; meal: number } | null>(null)
  const [search, setSearch] = useState('')
  const [expandedDay, setExpandedDay] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(!!userId)

  const weekStart = useMemo(() => getWeekStart(), [])

  // 상품 id → 객체 맵
  const productMap = useMemo(() => {
    const m = new Map<string, Product>()
    products.forEach((p) => m.set(p.id, p))
    return m
  }, [products])

  // ── 이번 주 식단 불러오기 ─────────────────────────────────
  const loadPlan = useCallback(async () => {
    if (!userId) return
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: planData } = await supabase
        .from('meal_plans')
        .select('id, meal_plan_items(product_id, day_of_week, meal_type)')
        .eq('user_id', userId)
        .eq('week_start', weekStart)
        .maybeSingle()

      if (planData?.meal_plan_items) {
        const next: Plan = Array.from({ length: 7 }, () => Array(3).fill(null))
        for (const item of planData.meal_plan_items as { product_id: string; day_of_week: number; meal_type: string }[]) {
          const mealIdx = MEAL_TYPES.indexOf(item.meal_type as typeof MEAL_TYPES[number])
          const product = productMap.get(item.product_id)
          if (mealIdx !== -1 && product && item.day_of_week >= 0 && item.day_of_week <= 6) {
            next[item.day_of_week][mealIdx] = { product }
          }
        }
        setPlan(next)
      }
    } catch {
      // 네트워크 오류 등은 조용히 무시
    } finally {
      setLoading(false)
    }
  }, [userId, weekStart, productMap])

  useEffect(() => {
    loadPlan()
  }, [loadPlan])

  // ── 식단 저장 ────────────────────────────────────────────
  async function savePlan() {
    if (!userId) {
      toast.error('로그인 후 식단을 저장할 수 있어요.')
      return
    }
    setSaving(true)
    try {
      const supabase = createClient()

      // upsert meal_plans
      const { data: planRow, error: planErr } = await supabase
        .from('meal_plans')
        .upsert({ user_id: userId, week_start: weekStart }, { onConflict: 'user_id,week_start' })
        .select('id')
        .single()

      if (planErr || !planRow) throw planErr

      // 기존 items 삭제 후 재삽입
      await supabase.from('meal_plan_items').delete().eq('plan_id', planRow.id)

      const items: { plan_id: string; product_id: string; day_of_week: number; meal_type: string }[] = []
      plan.forEach((row, di) => {
        row.forEach((cell, mi) => {
          if (cell) {
            items.push({
              plan_id: planRow.id,
              product_id: cell.product.id,
              day_of_week: di,
              meal_type: MEAL_TYPES[mi],
            })
          }
        })
      })

      if (items.length > 0) {
        await supabase.from('meal_plan_items').insert(items)
      }

      toast.success('이번 주 식단이 저장됐어요!')
    } catch {
      toast.error('저장에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setSaving(false)
    }
  }

  function setMeal(day: number, meal: number, product: Product | null) {
    setPlan((prev) => {
      const next = prev.map((row) => [...row])
      next[day][meal] = product ? { product } : null
      return next
    })
  }

  function handlePick(product: Product) {
    if (!picking) return
    setMeal(picking.day, picking.meal, product)
    setPicking(null)
    setSearch('')
  }

  function resetPlan() {
    setPlan(emptyPlan)
    toast.info('식단이 초기화됐어요.')
  }

  // 전체 영양 합산
  const totals = useMemo(() => {
    let cal = 0, protein = 0, cost = 0
    plan.forEach((row) => row.forEach((cell) => {
      if (cell) {
        cal += cell.product.calories ?? 0
        protein += cell.product.protein ?? 0
        cost += cell.product.price
      }
    }))
    return { cal, protein, cost }
  }, [plan])

  const filtered = useMemo(() =>
    products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())),
    [products, search]
  )

  // 장바구니에 전체 추가
  function addAllToCart() {
    const items: Product[] = []
    plan.forEach((row) => row.forEach((cell) => { if (cell) items.push(cell.product) }))
    if (items.length === 0) { toast.error('식단 계획이 비어있어요.'); return }
    items.forEach((p) => addItem(p, false))
    toast.success(`${items.length}개 밀키트를 장바구니에 담았어요!`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-[#2d7a4f]" />
      </div>
    )
  }

  return (
    <div>
      {/* 요약 카드 */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-surface rounded-2xl border border-line p-4 text-center">
          <p className="text-xs text-ink-5 mb-1">주간 총 칼로리</p>
          <p className="text-xl font-bold text-orange-500">{totals.cal.toLocaleString()}</p>
          <p className="text-xs text-ink-5">kcal</p>
        </div>
        <div className="bg-surface rounded-2xl border border-line p-4 text-center">
          <p className="text-xs text-ink-5 mb-1">주간 총 단백질</p>
          <p className="text-xl font-bold text-[#2d7a4f]">{totals.protein.toLocaleString()}</p>
          <p className="text-xs text-ink-5">g</p>
        </div>
        <div className="bg-surface rounded-2xl border border-line p-4 text-center">
          <p className="text-xs text-ink-5 mb-1">예상 식재료비</p>
          <p className="text-xl font-bold text-ink">{formatPrice(totals.cost)}</p>
          <p className="text-xs text-ink-5">원</p>
        </div>
      </div>

      {/* 플래너 그리드 */}
      <div className="bg-surface rounded-2xl border border-line overflow-hidden mb-4">
        {/* 헤더 */}
        <div className="grid grid-cols-4 border-b border-line bg-wash">
          <div className="px-3 py-2.5 text-xs font-medium text-ink-4" />
          {MEALS.map((m) => (
            <div key={m} className="px-3 py-2.5 text-xs font-medium text-ink-3 text-center">{m}</div>
          ))}
        </div>

        {/* 행 */}
        {DAYS.map((day, di) => (
          <div key={day} className="border-b border-line last:border-0">
            <button
              type="button"
              className="w-full grid grid-cols-4 items-start hover:bg-wash/50 transition-colors"
              onClick={() => setExpandedDay(expandedDay === di ? null : di)}
            >
              <div className="px-3 py-3 flex items-center gap-1.5">
                <span className="text-sm font-semibold text-ink">{day}</span>
                {expandedDay === di
                  ? <ChevronUp size={12} className="text-ink-5" />
                  : <ChevronDown size={12} className="text-ink-5" />
                }
              </div>
              {MEALS.map((_, mi) => {
                const cell = plan[di][mi]
                return (
                  <div key={mi} className="px-2 py-2">
                    {cell ? (
                      <div className="relative group">
                        <div className="flex items-center gap-1.5 bg-green-tint rounded-lg px-2 py-1.5">
                          {cell.product.image_url && (
                            <div className="w-6 h-6 rounded overflow-hidden shrink-0">
                              <Image src={cell.product.image_url} alt="" width={24} height={24} className="object-cover w-full h-full" />
                            </div>
                          )}
                          <span className="text-xs text-[#2d7a4f] font-medium truncate">{cell.product.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setMeal(di, mi, null) }}
                          className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-ink-3 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={8} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setPicking({ day: di, meal: mi }) }}
                        className="w-full flex items-center justify-center h-9 rounded-lg border-2 border-dashed border-line-2 hover:border-[#2d7a4f]/40 hover:bg-green-tint/50 transition-all text-ink-5 hover:text-[#2d7a4f]"
                      >
                        <Plus size={14} />
                      </button>
                    )}
                  </div>
                )
              })}
            </button>

            {/* 요일 상세 (확장 시) */}
            {expandedDay === di && (
              <div className="px-4 pb-3 grid grid-cols-3 gap-2">
                {MEALS.map((meal, mi) => {
                  const cell = plan[di][mi]
                  return (
                    <div key={mi} className="bg-wash rounded-xl p-3">
                      <p className="text-xs font-medium text-ink-4 mb-2">{meal}</p>
                      {cell ? (
                        <div>
                          <p className="text-sm font-medium text-ink mb-1">{cell.product.name}</p>
                          <div className="flex items-center gap-2 text-xs text-ink-5">
                            <span className="flex items-center gap-0.5"><Flame size={10} className="text-orange-400" />{cell.product.calories ?? 0}kcal</span>
                            <span className="flex items-center gap-0.5"><Dumbbell size={10} className="text-[#2d7a4f]" />{cell.product.protein ?? 0}g</span>
                          </div>
                          <p className="text-xs font-semibold text-[#2d7a4f] mt-1">{formatPrice(cell.product.price)}</p>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setPicking({ day: di, meal: mi })}
                          className="w-full text-xs text-ink-5 hover:text-[#2d7a4f] flex items-center gap-1"
                        >
                          <Plus size={12} /> 추가
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 하단 버튼 */}
      <div className="flex gap-2 mb-3">
        {userId && (
          <button
            type="button"
            onClick={savePlan}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-surface border border-[#2d7a4f] text-[#2d7a4f] rounded-2xl font-medium hover:bg-green-tint transition-colors disabled:opacity-60"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            식단 저장
          </button>
        )}
        <button
          type="button"
          onClick={resetPlan}
          className="px-4 flex items-center justify-center gap-1.5 py-3.5 bg-surface border border-line text-ink-4 rounded-2xl font-medium hover:bg-wash transition-colors"
        >
          <RotateCcw size={15} />
          초기화
        </button>
      </div>

      <button
        type="button"
        onClick={addAllToCart}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#2d7a4f] text-white rounded-2xl font-medium hover:bg-[#235f3d] transition-colors"
      >
        <ShoppingCart size={18} />
        식단 전체 장바구니 담기
      </button>

      {/* 비로그인 안내 */}
      {!userId && (
        <p className="text-center text-xs text-ink-5 mt-3">
          <a href="/login" className="text-[#2d7a4f] hover:underline">로그인</a>하면 식단을 저장하고 다음에도 불러올 수 있어요.
        </p>
      )}

      {/* 상품 선택 모달 */}
      {picking && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-4"
          onClick={() => { setPicking(null); setSearch('') }}
        >
          <div
            className="w-full max-w-md bg-surface rounded-t-2xl sm:rounded-2xl border border-line max-h-[70vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-line">
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-ink">
                  {DAYS[picking.day]}요일 {MEALS[picking.meal]} 선택
                </p>
                <button onClick={() => { setPicking(null); setSearch('') }} className="text-ink-5 hover:text-ink-2">
                  <X size={18} />
                </button>
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="밀키트 검색..."
                autoFocus
                className="w-full px-3 py-2 border border-line-2 rounded-lg text-sm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f]"
              />
            </div>
            <div className="overflow-y-auto flex-1 p-3 space-y-1.5">
              {filtered.length === 0 && (
                <p className="text-center text-sm text-ink-5 py-8">검색 결과가 없습니다.</p>
              )}
              {filtered.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handlePick(p)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-green-tint/60 transition-colors text-left group"
                >
                  {p.image_url && (
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-wash">
                      <Image src={p.image_url} alt={p.name} width={48} height={48} className="object-cover w-full h-full" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink group-hover:text-[#2d7a4f] truncate">{p.name}</p>
                    <div className="flex items-center gap-2 text-xs text-ink-5 mt-0.5">
                      {p.calories && <span><Flame size={10} className="inline text-orange-400 mr-0.5" />{p.calories}kcal</span>}
                      {p.protein && <span><Dumbbell size={10} className="inline text-[#2d7a4f] mr-0.5" />{p.protein}g</span>}
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-[#2d7a4f] shrink-0">{formatPrice(p.price)}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

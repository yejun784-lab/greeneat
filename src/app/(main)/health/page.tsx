import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { NutritionRings } from '@/components/health/NutritionRings'
import { WeeklyChart } from '@/components/health/WeeklyChart'
import { WeightTracker } from '@/components/health/WeightTracker'
import { AIMealPlan } from '@/components/health/AIMealPlan'
import { HealthReport } from '@/components/health/HealthReport'
import { MealPhotoLogger } from '@/components/health/MealPhotoLogger'
import { TodayMealList } from '@/components/health/TodayMealList'
import type { Product } from '@/types'

export const dynamic = 'force-dynamic'

export type DayNutrition = {
  date: string
  cal: number
  protein: number
  carbs: number
  fat: number
}

type GoalInfo = {
  calTarget: number
  proteinTarget: number
  carbsTarget: number
  fatTarget: number
}

const GOAL_INFO: Record<string, GoalInfo> = {
  diet:     { calTarget: 1500, proteinTarget: 80,  carbsTarget: 150, fatTarget: 40 },
  muscle:   { calTarget: 2500, proteinTarget: 150, carbsTarget: 280, fatTarget: 70 },
  maintain: { calTarget: 2000, proteinTarget: 100, carbsTarget: 220, fatTarget: 55 },
  health:   { calTarget: 1800, proteinTarget: 90,  carbsTarget: 200, fatTarget: 50 },
  balanced: { calTarget: 2000, proteinTarget: 100, carbsTarget: 220, fatTarget: 55 },
}

const GOAL_LABEL: Record<string, { label: string; emoji: string }> = {
  diet:     { label: '다이어트',   emoji: '🥗' },
  muscle:   { label: '근육 증가',  emoji: '💪' },
  maintain: { label: '체중 유지',  emoji: '⚖️' },
  health:   { label: '건강 관리',  emoji: '🌿' },
  balanced: { label: '균형식',     emoji: '⚖️' },
}

function getLast7Days(): string[] {
  const days: string[] = []
  const today = new Date()
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    days.push(d.toISOString().slice(0, 10))
  }
  return days
}

function getLast30Days(): { start: string; end: string } {
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - 29)
  return {
    start: start.toISOString().slice(0, 10),
    end: end.toISOString().slice(0, 10),
  }
}

export default async function HealthPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('nutrition_goal, allergen_profile')
    .eq('id', user.id)
    .maybeSingle()

  const goal = profile?.nutrition_goal ?? 'balanced'
  const goalInfo: GoalInfo = GOAL_INFO[goal] ?? GOAL_INFO.balanced
  const goalMeta = GOAL_LABEL[goal] ?? GOAL_LABEL.balanced
  const allergens: string[] = (profile?.allergen_profile as string[]) ?? []

  // Last 7 days orders (paid) with nutrition
  const last7 = getLast7Days()
  const sevenDaysAgo = last7[0]

  const { data: orders } = await supabase
    .from('orders')
    .select('created_at, order_items(quantity, products(calories, protein, carbs, fat))')
    .eq('user_id', user.id)
    .eq('payment_status', 'paid')
    .gte('created_at', sevenDaysAgo + 'T00:00:00')
    .order('created_at', { ascending: true })

  // Aggregate by date
  const dayMap = new Map<string, DayNutrition>()
  for (const day of last7) {
    dayMap.set(day, { date: day, cal: 0, protein: 0, carbs: 0, fat: 0 })
  }

  type NutrientProduct = {
    calories: number | null
    protein: number | null
    carbs: number | null
    fat: number | null
  }
  type OrderItem = { quantity: number; products: NutrientProduct | NutrientProduct[] | null }
  type OrderRow = { created_at: string; order_items: OrderItem[] | null }

  for (const order of (orders as unknown as OrderRow[] | null) ?? []) {
    const dateKey = order.created_at.slice(0, 10)
    const entry = dayMap.get(dateKey)
    if (!entry) continue
    for (const item of order.order_items ?? []) {
      const raw = item.products
      if (!raw) continue
      const p: NutrientProduct = Array.isArray(raw) ? raw[0] : raw
      if (!p) continue
      entry.cal += (p.calories ?? 0) * item.quantity
      entry.protein += (p.protein ?? 0) * item.quantity
      entry.carbs += (p.carbs ?? 0) * item.quantity
      entry.fat += (p.fat ?? 0) * item.quantity
    }
  }

  const weekData: DayNutrition[] = last7.map((d) => dayMap.get(d)!)
  const todayStr = last7[6]

  // meal_logs (사진 분석 기록) — 7일치 합산
  const { data: rawMealLogs } = await supabase
    .from('meal_logs')
    .select('date, calories, protein, carbs, fat, meal_type, description, image_url, created_at')
    .eq('user_id', user.id)
    .gte('date', sevenDaysAgo)
    .order('created_at', { ascending: true })

  type MealLogRow = {
    date: string
    calories: number | null
    protein: number | null
    carbs: number | null
    fat: number | null
    meal_type: string
    description: string | null
    image_url: string | null
    created_at: string
  }

  const mealLogs: MealLogRow[] = (rawMealLogs ?? []).map((l) => ({
    date: String(l.date),
    calories: l.calories ? Number(l.calories) : null,
    protein: l.protein ? Number(l.protein) : null,
    carbs: l.carbs ? Number(l.carbs) : null,
    fat: l.fat ? Number(l.fat) : null,
    meal_type: String(l.meal_type),
    description: l.description ? String(l.description) : null,
    image_url: l.image_url ? String(l.image_url) : null,
    created_at: String(l.created_at),
  }))

  // meal_logs도 dayMap에 합산
  for (const log of mealLogs) {
    const entry = dayMap.get(log.date)
    if (!entry) continue
    entry.cal += log.calories ?? 0
    entry.protein += log.protein ?? 0
    entry.carbs += log.carbs ?? 0
    entry.fat += log.fat ?? 0
  }

  // weekData는 meal_logs 합산 후 다시 만들어야 함
  const weekDataFinal: DayNutrition[] = last7.map((d) => dayMap.get(d)!)
  const todayData: DayNutrition = dayMap.get(todayStr) ?? { date: todayStr, cal: 0, protein: 0, carbs: 0, fat: 0 }
  const todayMealLogs = mealLogs.filter((l) => l.date === todayStr)

  // Weight logs (last 30 days)
  const { start: wStart, end: wEnd } = getLast30Days()
  const { data: rawWeightLogs } = await supabase
    .from('weight_logs')
    .select('date, weight_kg')
    .eq('user_id', user.id)
    .gte('date', wStart)
    .lte('date', wEnd)
    .order('date', { ascending: true })

  const weightLogs: { date: string; weight_kg: number }[] = (rawWeightLogs ?? []).map((l) => ({
    date: String(l.date),
    weight_kg: Number(l.weight_kg),
  }))

  // Products for AI meal plan
  const { data: productsRaw } = await supabase
    .from('products')
    .select('id, name, description, price, category_id, calories, protein, carbs, fat, servings, cook_time, difficulty, image_url, display_group, is_subscription, is_active, stock, created_at')
    .eq('is_active', true)
    .limit(30)

  const products: Product[] = (productsRaw ?? []) as Product[]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-ink">건강관리</h1>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full bg-green-tint text-[#2d7a4f] border border-[#2d7a4f]/20">
          {goalMeta.emoji} {goalMeta.label}
        </span>
      </div>

      <div className="flex flex-col gap-6">
        {/* Section 1: 오늘의 영양 현황 */}
        <section className="bg-surface rounded-2xl border border-line p-5">
          <h2 className="text-base font-semibold text-ink mb-4">오늘의 영양 현황</h2>
          <NutritionRings today={todayData} goal={goalInfo} />
          {todayData.cal === 0 && (
            <p className="mt-4 text-center text-sm text-ink-5">
              오늘 주문 데이터가 없어요. GreenEat 도시락을 주문하면 영양이 자동으로 반영돼요.
            </p>
          )}
        </section>

        {/* Section 1.5: 식단 사진 분석 */}
        <MealPhotoLogger />

        {/* Section 1.7: 오늘 먹은 것 */}
        {todayMealLogs.length > 0 && (
          <TodayMealList logs={todayMealLogs} />
        )}

        {/* Section 2: 이번 주 칼로리 추이 */}
        <section className="bg-surface rounded-2xl border border-line p-5">
          <h2 className="text-base font-semibold text-ink mb-4">이번 주 칼로리 추이</h2>
          <WeeklyChart data={weekDataFinal} calTarget={goalInfo.calTarget} />
        </section>

        {/* Section 3: 체중 기록 */}
        <section className="bg-surface rounded-2xl border border-line p-5">
          <h2 className="text-base font-semibold text-ink mb-4">체중 기록</h2>
          <WeightTracker
            initialLogs={weightLogs}
            userId={user.id}
          />
        </section>

        {/* Section 4: AI 추천 주간 식단 */}
        <section className="bg-surface rounded-2xl border border-line p-5">
          <h2 className="text-base font-semibold text-ink mb-1">AI 추천 주간 식단</h2>
          <p className="text-xs text-ink-4 mb-4">건강 목표에 맞게 자동으로 구성된 7일 식단이에요.</p>
          <AIMealPlan products={products} goal={goal} allergens={allergens} />
        </section>

        {/* Section 5: 이번 주 리포트 */}
        <section className="bg-surface rounded-2xl border border-line p-5">
          <h2 className="text-base font-semibold text-ink mb-4">이번 주 리포트</h2>
          <HealthReport weekData={weekDataFinal} goal={goalInfo} weightLogs={weightLogs} />
        </section>
      </div>
    </div>
  )
}

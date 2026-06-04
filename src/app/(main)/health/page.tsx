import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: '건강관리',
  description: '매일의 식단과 영양소를 기록하고 AI 맞춤 식단 플랜을 받아보세요.',
}
import { NutritionRings } from '@/components/health/NutritionRings'
import { WeeklyChart } from '@/components/health/WeeklyChart'
import { WeightTracker } from '@/components/health/WeightTracker'
import { AIMealPlan } from '@/components/health/AIMealPlan'
import { HealthReport } from '@/components/health/HealthReport'
import { MealPhotoLogger } from '@/components/health/MealPhotoLogger'
import { ManualMealLogger } from '@/components/health/ManualMealLogger'
import { TodayMealList } from '@/components/health/TodayMealList'
import { getLastNDays, getDateRange } from '@/lib/utils'
import { WithErrorBoundary } from '@/components/ui/ErrorBoundary'
import { GOAL_INFO, GOAL_LABEL, type DayNutrition, type GoalInfo, type MealLogRow } from '@/lib/health-types'
import { GoalEditor } from '@/components/my/GoalEditor'
import { HealthTabNav } from '@/components/health/HealthTabNav'
import type { Product } from '@/types'

export const dynamic = 'force-dynamic'

type NutrientProduct = { calories: number | null; protein: number | null; carbs: number | null; fat: number | null }
type OrderItem = { quantity: number; products: NutrientProduct | NutrientProduct[] | null }
type OrderRow = { created_at: string; order_items: OrderItem[] | null }

export default async function HealthPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  // 비로그인도 페이지 진입 허용 — 기능 사용 시 로그인 유도

  const last7 = getLastNDays(7)
  const sevenDaysAgo = last7[0]
  const { start: wStart, end: wEnd } = getDateRange(30)

  // 로그인 상태에 따라 쿼리 분기
  let profile = null, orders = null, rawMealLogs = null, rawWeightLogs = null
  let productsRaw = null

  if (user) {
    const results = await Promise.all([
      supabase.from('profiles').select('nutrition_goal, allergen_profile, height_cm, weight_kg').eq('id', user.id).maybeSingle(),
      supabase.from('orders')
        .select('created_at, order_items(quantity, products(calories, protein, carbs, fat))')
        .eq('user_id', user.id).eq('payment_status', 'paid')
        .gte('created_at', sevenDaysAgo + 'T00:00:00').order('created_at', { ascending: true }),
      supabase.from('meal_logs')
        .select('date, calories, protein, carbs, fat, meal_type, description, image_url, created_at')
        .eq('user_id', user.id).gte('date', sevenDaysAgo).order('created_at', { ascending: true }),
      supabase.from('weight_logs')
        .select('date, weight_kg').eq('user_id', user.id)
        .gte('date', wStart).lte('date', wEnd).order('date', { ascending: true }),
      supabase.from('products')
        .select('id, name, description, price, category_id, calories, protein, carbs, fat, servings, cook_time, difficulty, image_url, display_group, is_subscription, is_active, stock, created_at')
        .eq('is_active', true).limit(30),
    ])
    profile      = results[0].data
    orders       = results[1].data
    rawMealLogs  = results[2].data
    rawWeightLogs= results[3].data
    productsRaw  = results[4].data
  } else {
    const { data } = await supabase.from('products')
      .select('id, name, description, price, category_id, calories, protein, carbs, fat, servings, cook_time, difficulty, image_url, display_group, is_subscription, is_active, stock, created_at')
      .eq('is_active', true).limit(30)
    productsRaw = data
  }

  const goal = profile?.nutrition_goal ?? 'balanced'
  const heightCm = profile?.height_cm ? Number(profile.height_cm) : null
  const weightKg = profile?.weight_kg ? Number(profile.weight_kg) : null
  const bmi = heightCm && weightKg ? weightKg / Math.pow(heightCm / 100, 2) : null
  const bmiMeta = bmi === null ? null
    : bmi < 18.5 ? { label: '저체중', color: 'text-blue-500',   bg: 'bg-blue-50',   bar: 'bg-blue-400'   }
    : bmi < 23   ? { label: '정상',   color: 'text-green-600',  bg: 'bg-green-50',  bar: 'bg-green-500'  }
    : bmi < 25   ? { label: '과체중', color: 'text-orange-500', bg: 'bg-orange-50', bar: 'bg-orange-400' }
    :              { label: '비만',   color: 'text-red-500',    bg: 'bg-red-50',    bar: 'bg-red-400'    }
  const goalInfo: GoalInfo = GOAL_INFO[goal] ?? GOAL_INFO.balanced
  const goalMeta = GOAL_LABEL[goal] ?? GOAL_LABEL.balanced
  const allergens: string[] = (profile?.allergen_profile as string[]) ?? []

  // 날짜별 영양 집계 맵 초기화
  const dayMap = new Map<string, DayNutrition>()
  for (const day of last7) dayMap.set(day, { date: day, cal: 0, protein: 0, carbs: 0, fat: 0 })

  // 주문 데이터 합산
  for (const order of (orders as unknown as OrderRow[] | null) ?? []) {
    const entry = dayMap.get(order.created_at.slice(0, 10))
    if (!entry) continue
    for (const item of order.order_items ?? []) {
      const raw = item.products
      if (!raw) continue
      const p: NutrientProduct = Array.isArray(raw) ? raw[0] : raw
      if (!p) continue
      entry.cal     += (p.calories ?? 0) * item.quantity
      entry.protein += (p.protein  ?? 0) * item.quantity
      entry.carbs   += (p.carbs    ?? 0) * item.quantity
      entry.fat     += (p.fat      ?? 0) * item.quantity
    }
  }

  // 사진 분석 기록 합산
  const mealLogs: MealLogRow[] = (rawMealLogs ?? []).map((l) => ({
    date:        String(l.date),
    calories:    l.calories  ? Number(l.calories)  : null,
    protein:     l.protein   ? Number(l.protein)   : null,
    carbs:       l.carbs     ? Number(l.carbs)     : null,
    fat:         l.fat       ? Number(l.fat)       : null,
    meal_type:   String(l.meal_type),
    description: l.description ? String(l.description) : null,
    image_url:   l.image_url   ? String(l.image_url)   : null,
    created_at:  String(l.created_at),
  }))

  for (const log of mealLogs) {
    const entry = dayMap.get(log.date)
    if (!entry) continue
    entry.cal     += log.calories ?? 0
    entry.protein += log.protein  ?? 0
    entry.carbs   += log.carbs    ?? 0
    entry.fat     += log.fat      ?? 0
  }

  const todayStr = last7[last7.length - 1]
  const weekData: DayNutrition[] = last7.map((d) => dayMap.get(d)!)
  const todayData: DayNutrition = dayMap.get(todayStr) ?? { date: todayStr, cal: 0, protein: 0, carbs: 0, fat: 0 }
  const todayMealLogs = mealLogs.filter((l) => l.date === todayStr)

  const weightLogs = (rawWeightLogs ?? []).map((l) => ({
    date: String(l.date), weight_kg: Number(l.weight_kg),
  }))

  const products: Product[] = (productsRaw ?? []) as Product[]

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* 비로그인 안내 배너 */}
      {!user && (
        <div className="mb-6 flex items-center justify-between gap-4 bg-green-tint border border-primary/20 rounded-2xl px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-primary">로그인하면 건강 데이터를 기록할 수 있어요</p>
            <p className="text-xs text-ink-4 mt-0.5">식단 기록, 체중 추적, AI 식단 플랜 등 모든 기능을 이용해보세요.</p>
          </div>
          <a
            href="/login"
            className="shrink-0 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary-hover transition-colors"
          >
            로그인
          </a>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-ink">건강관리</h1>
        <GoalEditor current={goal} userId={user?.id ?? null} />
      </div>

      <HealthTabNav userId={user?.id ?? null} date={todayStr} nutritionContent={<>
        <div className="flex flex-col gap-6">
        <section className="bg-surface rounded-2xl border border-line p-5">
          <h2 className="text-base font-semibold text-ink mb-4">오늘의 영양 현황</h2>
          <NutritionRings today={todayData} goal={goalInfo} />
          {todayData.cal === 0 && (
            <p className="mt-4 text-center text-sm text-ink-5">
              오늘 주문 데이터가 없어요. GreenEat 도시락을 주문하면 영양이 자동으로 반영돼요.
            </p>
          )}
        </section>

        {/* BMI 카드 */}
        {bmi !== null && bmiMeta !== null ? (
          <section className="bg-surface rounded-2xl border border-line p-5">
            <h2 className="text-base font-semibold text-ink mb-3">BMI 체질량지수</h2>
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl font-bold text-ink">{bmi.toFixed(1)}</span>
              <span className={`text-sm font-semibold px-3 py-1 rounded-full ${bmiMeta.color} ${bmiMeta.bg}`}>{bmiMeta.label}</span>
            </div>
            {/* 바 */}
            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="absolute inset-0 flex">
                <div className="flex-none w-[23.5%] bg-blue-200 rounded-l-full" />
                <div className="flex-none w-[22.5%] bg-green-200" />
                <div className="flex-none w-[10%] bg-orange-200" />
                <div className="flex-1 bg-red-200 rounded-r-full" />
              </div>
              <div
                className={`absolute top-0 h-2 w-1.5 rounded-full ${bmiMeta.bar} -translate-x-1/2`}
                style={{ left: `${Math.min(Math.max(((bmi - 15) / 20) * 100, 2), 98)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-ink-4 mt-1">
              <span>15</span><span>저체중</span><span>정상</span><span>과체중</span><span>35</span>
            </div>
            <p className="text-xs text-ink-4 mt-3">
              {heightCm}cm · {weightKg}kg — 마이페이지에서 수정할 수 있어요
            </p>
          </section>
        ) : (
          <section className="bg-surface rounded-2xl border border-line p-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-ink">BMI 체질량지수</p>
              <p className="text-xs text-ink-4 mt-0.5">키와 몸무게를 입력하면 BMI를 확인할 수 있어요</p>
            </div>
            <a href="/my" className="text-xs font-medium text-primary border border-primary/30 px-3 py-1.5 rounded-full hover:bg-green-tint transition-colors">
              입력하기
            </a>
          </section>
        )}

        <WithErrorBoundary label="식사 사진 분석">
          <MealPhotoLogger userId={user?.id ?? null} />
        </WithErrorBoundary>
        <ManualMealLogger userId={user?.id ?? null} />

        {todayMealLogs.length > 0 && (
          <WithErrorBoundary label="오늘의 식단">
            <TodayMealList logs={todayMealLogs} />
          </WithErrorBoundary>
        )}

        <section className="bg-surface rounded-2xl border border-line p-5">
          <h2 className="text-base font-semibold text-ink mb-4">이번 주 칼로리 추이</h2>
          <WithErrorBoundary label="주간 차트">
            <WeeklyChart data={weekData} calTarget={goalInfo.calTarget} />
          </WithErrorBoundary>
        </section>

        <section className="bg-surface rounded-2xl border border-line p-5">
          <h2 className="text-base font-semibold text-ink mb-4">체중 기록</h2>
          <WithErrorBoundary label="체중 추적">
            <WeightTracker initialLogs={weightLogs} userId={user?.id ?? null} heightCm={heightCm} />
          </WithErrorBoundary>
        </section>

        <section className="bg-surface rounded-2xl border border-line p-5">
          <h2 className="text-base font-semibold text-ink mb-1">AI 추천 주간 식단</h2>
          <p className="text-xs text-ink-4 mb-4">건강 목표에 맞게 자동으로 구성된 7일 식단이에요.</p>
          <WithErrorBoundary label="AI 식단 플랜">
            <AIMealPlan products={products} goal={goal} allergens={allergens} userId={user?.id ?? null} />
          </WithErrorBoundary>
        </section>

        <section className="bg-surface rounded-2xl border border-line p-5">
          <h2 className="text-base font-semibold text-ink mb-4">이번 주 리포트</h2>
          <WithErrorBoundary label="건강 리포트">
            <HealthReport weekData={weekData} goal={goalInfo} weightLogs={weightLogs} />
          </WithErrorBoundary>
        </section>
      </div>
      </>} />
    </div>
  )
}

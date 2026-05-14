import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { MealPlanner } from '@/components/planner/MealPlanner'
import type { Product } from '@/types'

export const metadata: Metadata = {
  title: '식단 플래너 — GreenEat',
  description: '한 주 식단을 미리 계획하고 칼로리·단백질을 관리해보세요. 선택한 메뉴를 바로 장바구니에 담을 수 있어요.',
}

export default async function PlannerPage() {
  const supabase = await createClient()

  const [{ data }, { data: { user } }] = await Promise.all([
    supabase
      .from('products')
      .select('id, name, price, image_url, calories, protein, carbs, fat, servings')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(30),
    supabase.auth.getUser(),
  ])

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink">식단 플래너</h1>
        <p className="text-ink-4 mt-1">한 주 식단을 미리 계획하고 영양을 관리해보세요</p>
      </div>
      <MealPlanner products={(data ?? []) as Product[]} userId={user?.id} />
    </div>
  )
}

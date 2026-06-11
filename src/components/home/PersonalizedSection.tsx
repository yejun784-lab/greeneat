import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/products/ProductCard'
import type { Product } from '@/types'

type GoalKey = 'diet' | 'muscle' | 'balanced'

const GOAL_META: Record<GoalKey, { label: string; moreHref: string }> = {
  diet:     { label: '저칼로리 픽',     moreHref: '/products?maxCal=450&sort=cal_asc' },
  muscle:   { label: '고단백 픽',       moreHref: '/products?sort=newest' },
  balanced: { label: '균형 잡힌 한 끼', moreHref: '/products?sort=newest' },
}

export async function PersonalizedSection() {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase
      .from('profiles')
      .select('name, nutrition_goal, allergen_profile')
      .eq('id', user.id)
      .maybeSingle()

    const goal: GoalKey =
      profile?.nutrition_goal === 'diet' || profile?.nutrition_goal === 'muscle'
        ? profile.nutrition_goal
        : 'balanced'
    const allergens: string[] = Array.isArray(profile?.allergen_profile)
      ? (profile.allergen_profile as string[]).filter(Boolean)
      : []

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query: any = supabase
      .from('products')
      .select('*, product_categories(id, name, slug, description)')
      .eq('is_active', true)

    if (goal === 'diet') {
      query = query
        .not('calories', 'is', null)
        .lte('calories', 450)
        .order('calories', { ascending: true })
    } else if (goal === 'muscle') {
      query = query
        .gte('protein', 25)
        .order('protein', { ascending: false })
    } else {
      query = query.order('created_at', { ascending: false })
    }

    // 알레르기 성분 제외 (products/page.tsx 패턴과 동일)
    for (const allergen of allergens) {
      query = query.not('allergens', 'cs', `{${allergen}}`)
    }

    const { data } = await query.limit(4)
    const products = (data as Product[]) ?? []
    if (products.length === 0) return null

    const meta = GOAL_META[goal]
    const moreHref = allergens.length > 0
      ? `${meta.moreHref}&${allergens.map((a) => `exclude=${encodeURIComponent(a)}`).join('&')}`
      : meta.moreHref

    return (
      <section className="py-10 pb-4 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-display text-2xl md:text-3xl text-[#111]">
                {profile?.name ? `${profile.name}님을 위한 추천 ✨` : '당신을 위한 추천 ✨'}
              </h2>
              <span className="text-xs bg-green-tint text-[#2d7a4f] rounded-full px-2.5 py-1 font-medium">
                {meta.label}
              </span>
            </div>
            {allergens.length > 0 && (
              <p className="text-xs text-ink-5 mt-1.5">내 알레르기 성분을 제외한 추천이에요</p>
            )}
          </div>
          <Link
            href={moreHref}
            className="text-sm font-medium text-[#999] hover:text-[#111] transition-colors pb-1 border-b border-[#ddd] hover:border-[#111] shrink-0"
          >
            더보기
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    )
  } catch {
    // 추천 섹션 실패가 홈 전체를 깨뜨리지 않도록
    return null
  }
}

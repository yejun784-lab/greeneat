import type { Metadata } from 'next'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: '도시락 — GreenEat',
  description: '간편식, 베이커리&샐러드, 건강식품, 맞춤식단까지. 진정성 있는 GreenEat 도시락을 만나보세요.',
  openGraph: {
    title: '도시락 — GreenEat',
    description: '진정성 있는 건강한 선택, GreenEat 도시락.',
    type: 'website',
  },
}
import { ProductFilter } from '@/components/products/ProductFilter'
import { ProductGridSkeleton } from '@/components/products/ProductCardSkeleton'
import { InfiniteProductGrid } from '@/components/products/InfiniteProductGrid'
import type { Product } from '@/types'

const PAGE_SIZE = 9

type SearchParams = Promise<{
  category?: string
  difficulty?: string
  servings?: string
  sort?: string
  search?: string
  exclude?: string
  minCal?: string
  maxCal?: string
}>

async function getProfileAllergens(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []
  const { data: profile } = await supabase
    .from('profiles')
    .select('allergen_profile')
    .eq('id', user.id)
    .maybeSingle()
  return (profile?.allergen_profile as string[]) ?? []
}


async function ProductListServer({ params }: { params: Awaited<SearchParams> }) {
  const supabase = await createClient()
  const profileAllergens = await getProfileAllergens(supabase)

  const selectClause = params.category
    ? '*, product_categories!inner(id, name, slug, description)'
    : '*, product_categories(id, name, slug, description)'

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabase.from('products').select(selectClause, { count: 'exact' })

  if (params.category)   query = query.eq('product_categories.slug', params.category)
  if (params.difficulty) query = query.eq('difficulty', params.difficulty)
  if (params.servings)   query = query.eq('servings', Number(params.servings))
  if (params.search)     query = query.ilike('name', `%${params.search}%`)
  if (params.minCal)     query = query.gte('calories', Number(params.minCal))
  if (params.maxCal)     query = query.lte('calories', Number(params.maxCal))

  // 알레르기 필터: URL exclude 우선, 없으면 프로필 자동 적용
  const excludeList = params.exclude ? [params.exclude] : profileAllergens
  for (const allergen of excludeList) {
    query = query.not('allergens', 'cs', `{${allergen}}`)
  }

  const sort = params.sort ?? 'newest'
  if (sort === 'price_asc')  query = query.order('price', { ascending: true })
  else if (sort === 'price_desc') query = query.order('price', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  query = query.range(0, PAGE_SIZE - 1)

  const { data, count } = await query
  const products = (data as Product[]) ?? []
  const total = count ?? 0

  const autoFiltered = !params.exclude && profileAllergens.length > 0

  return (
    <>
      {autoFiltered && (
        <div className="flex items-center gap-2 mb-4 px-1 text-xs text-ink-4">
          <span className="w-2 h-2 rounded-full bg-red-300 inline-block" />
          알레르기 프로필({profileAllergens.map((v) => {
            const MAP: Record<string, string> = { gluten:'글루텐', dairy:'유제품', egg:'달걀', soy:'대두', pork:'돼지고기', sesame:'참깨' }
            return MAP[v] ?? v
          }).join(', ')}) 자동 적용 중
        </div>
      )}
      <InfiniteProductGrid
        initialProducts={products}
        initialHasMore={total > PAGE_SIZE}
        total={total}
        filters={params}
      />
    </>
  )
}

async function ProductCount({ params }: { params: Awaited<SearchParams> }) {
  const supabase = await createClient()
  const profileAllergens = await getProfileAllergens(supabase)
  const selectClause = params.category
    ? '*, product_categories!inner(id, name, slug, description)'
    : '*, product_categories(id, name, slug, description)'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabase.from('products').select(selectClause, { count: 'exact', head: true })
  if (params.category)   query = query.eq('product_categories.slug', params.category)
  if (params.difficulty) query = query.eq('difficulty', params.difficulty)
  if (params.servings)   query = query.eq('servings', Number(params.servings))
  if (params.search)     query = query.ilike('name', `%${params.search}%`)
  const excludeList = params.exclude ? [params.exclude] : profileAllergens
  for (const allergen of excludeList) {
    query = query.not('allergens', 'cs', `{${allergen}}`)
  }
  const { count } = await query
  return <span className="font-medium text-ink">{count ?? 0}</span>
}

const SORT_OPTIONS = [
  { value: 'newest', label: '신상품순' },
  { value: 'price_asc', label: '낮은 가격순' },
  { value: 'price_desc', label: '높은 가격순' },
]

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const currentSort = params.sort ?? 'newest'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink">밀키트</h1>
        <p className="text-ink-4 mt-1">신선한 재료로 만드는 건강한 한 끼</p>
      </div>

      {/* 검색 바 */}
      <form method="GET" className="mb-6">
        {params.category && <input type="hidden" name="category" value={params.category} />}
        {params.difficulty && <input type="hidden" name="difficulty" value={params.difficulty} />}
        {params.servings && <input type="hidden" name="servings" value={params.servings} />}
        {params.sort && <input type="hidden" name="sort" value={params.sort} />}
        <div className="relative max-w-md">
          <input
            type="text"
            name="search"
            defaultValue={params.search ?? ''}
            placeholder="밀키트 검색 (예: 비빔밥, 파스타...)"
            className="w-full pl-10 pr-4 py-2.5 border border-line-2 rounded-xl text-sm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f] focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-5"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          {params.search && (
            <a
              href={`?${new URLSearchParams({ ...params, search: '' }).toString()}`}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-5 hover:text-ink-3"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </a>
          )}
        </div>
      </form>

      <div className="flex gap-8">
        {/* 필터 사이드바 */}
        <Suspense>
          <ProductFilter />
        </Suspense>

        {/* 상품 그리드 */}
        <div className="flex-1 min-w-0">
          {/* 정렬 바 */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-ink-4">
              총{' '}
              <Suspense fallback={<span className="font-medium text-ink">...</span>}>
                <ProductCount params={params} />
              </Suspense>
              개
              {params.search && (
                <span className="ml-2 text-[#2d7a4f] font-medium">"{params.search}" 검색 결과</span>
              )}
            </p>
            <div className="flex gap-2">
              {SORT_OPTIONS.map((opt) => (
                <a
                  key={opt.value}
                  href={`?${new URLSearchParams({ ...params, sort: opt.value }).toString()}`}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                    currentSort === opt.value
                      ? 'border-[#2d7a4f] bg-green-tint text-[#2d7a4f] font-medium'
                      : 'border-line-2 text-ink-3 hover:border-line-3'
                  }`}
                >
                  {opt.label}
                </a>
              ))}
            </div>
          </div>

          <Suspense fallback={<ProductGridSkeleton count={9} />}>
            <ProductListServer params={params} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

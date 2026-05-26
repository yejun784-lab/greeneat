import type { Metadata } from 'next'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: '도시락 — GreenEat',
  description: '간편식, 베이커리&샐러드, 건강식품, 맞춤식단까지. 진정성 있는 GreenEat 도시락을 만나보세요.',
}
import { ProductFilter } from '@/components/products/ProductFilter'
import { ProductGridSkeleton } from '@/components/products/ProductCardSkeleton'
import { InfiniteProductGrid } from '@/components/products/InfiniteProductGrid'
import { RecentlyOrderedSection } from '@/components/products/RecentlyOrderedSection'
import type { ProductFilters } from '@/components/products/InfiniteProductGrid'
import type { Product } from '@/types'

const PAGE_SIZE = 9

type SearchParams = Promise<{
  category?: string
  difficulty?: string
  servings?: string
  sort?: string
  search?: string
  exclude?: string | string[]  // 다중 알레르기 지원
  minCal?: string
  maxCal?: string
}>

async function buildQuery(supabase: Awaited<ReturnType<typeof createClient>>, params: Awaited<SearchParams>, countOnly = false) {
  // 카테고리 slug → id 변환
  let categoryId: string | null = null
  if (params.category) {
    const { data: cat } = await supabase
      .from('product_categories')
      .select('id')
      .eq('slug', params.category)
      .single()
    categoryId = cat?.id ?? null
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabase
    .from('products')
    .select('*, product_categories(id, name, slug)', countOnly ? { count: 'exact', head: true } : { count: 'exact' })
    .eq('is_active', true)

  if (categoryId)        query = query.eq('category_id', categoryId)
  if (params.difficulty) query = query.eq('difficulty', params.difficulty)
  if (params.servings)   query = query.eq('servings', Number(params.servings))
  if (params.search)     query = query.ilike('name', `%${params.search}%`)
  if (params.minCal)     query = query.gte('calories', Number(params.minCal))
  if (params.maxCal)     query = query.lte('calories', Number(params.maxCal))

  // 알레르기 다중 제외 (URL: exclude=글루텐&exclude=달걀 or exclude=글루텐)
  const excludeRaw = params.exclude
  const excludeList: string[] = excludeRaw
    ? Array.isArray(excludeRaw) ? excludeRaw : [excludeRaw]
    : []
  for (const allergen of excludeList) {
    if (allergen) query = query.not('allergens', 'cs', `{${allergen}}`)
  }

  const sort = params.sort ?? 'newest'
  if (sort === 'price_asc')   query = query.order('price', { ascending: true })
  else if (sort === 'price_desc') query = query.order('price', { ascending: false })
  else if (sort === 'cal_asc')    query = query.order('calories', { ascending: true, nullsFirst: false })
  else query = query.order('display_group', { ascending: true }).order('created_at', { ascending: false })

  return { query, categoryId }
}

async function ProductListServer({ params }: { params: Awaited<SearchParams> }) {
  const supabase = await createClient()
  const { query } = await buildQuery(supabase, params)
  const { data, count } = await query.range(0, PAGE_SIZE - 1)

  const products = (data as Product[]) ?? []
  const total = count ?? 0

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-3">🔍</p>
        <p className="text-sm font-medium text-ink-3">검색 결과가 없어요</p>
        <p className="text-xs text-ink-5 mt-1">필터를 초기화하거나 다른 검색어를 사용해보세요</p>
      </div>
    )
  }

  // 필터가 바뀔 때마다 InfiniteProductGrid를 완전히 리마운트 (stale state 방지)
  const gridKey = JSON.stringify({
    category: params.category,
    difficulty: params.difficulty,
    servings: params.servings,
    sort: params.sort,
    search: params.search,
    exclude: params.exclude,
    minCal: params.minCal,
    maxCal: params.maxCal,
  })

  return (
    <InfiniteProductGrid
      key={gridKey}
      initialProducts={products}
      initialHasMore={total > PAGE_SIZE}
      total={total}
      filters={params as ProductFilters}
    />
  )
}

async function ProductCount({ params }: { params: Awaited<SearchParams> }) {
  const supabase = await createClient()
  const { query } = await buildQuery(supabase, params, true)
  const { count } = await query
  return <span className="font-medium text-ink">{count ?? 0}</span>
}

const SORT_OPTIONS = [
  { value: 'newest',     label: '최신순' },
  { value: 'price_asc',  label: '낮은 가격' },
  { value: 'price_desc', label: '높은 가격' },
  { value: 'cal_asc',    label: '낮은 칼로리' },
]

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams
  const currentSort = params.sort ?? 'newest'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink">도시락</h1>
        <p className="text-ink-4 mt-1">진정성 있는 건강한 한 끼를 간편하게</p>
      </div>

      {/* 검색 바 */}
      <form method="GET" className="mb-6">
        {params.category   && <input type="hidden" name="category"   value={params.category} />}
        {params.difficulty && <input type="hidden" name="difficulty" value={params.difficulty} />}
        {params.servings   && <input type="hidden" name="servings"   value={params.servings} />}
        {params.sort       && <input type="hidden" name="sort"       value={params.sort} />}
        {params.minCal     && <input type="hidden" name="minCal"     value={params.minCal} />}
        {params.maxCal     && <input type="hidden" name="maxCal"     value={params.maxCal} />}
        {/* 다중 알레르기 */}
        {(Array.isArray(params.exclude) ? params.exclude : params.exclude ? [params.exclude] : []).map((v) => (
          <input key={v} type="hidden" name="exclude" value={v} />
        ))}
        <div className="relative max-w-md">
          <input
            type="text"
            name="search"
            defaultValue={params.search ?? ''}
            placeholder="도시락 검색 (예: 닭가슴살, 그래놀라...)"
            className="w-full pl-10 pr-4 py-2.5 border border-line-2 rounded-xl text-sm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f] focus:border-transparent"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-5" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          {params.search && (
            <a href={`?${new URLSearchParams({ ...params as Record<string,string>, search: '' }).toString()}`} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-5 hover:text-ink-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
            </a>
          )}
        </div>
      </form>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        <Suspense>
          <ProductFilter />
        </Suspense>

        <div className="flex-1 min-w-0">
          {/* 지난 주문 메뉴 — 검색/필터 없을 때만 표시 */}
          {!params.search && !params.category && !params.difficulty && !params.servings && !params.exclude && (
            <RecentlyOrderedSection />
          )}

          {/* 정렬 + 카운트 */}
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
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
            <div className="flex gap-1.5 flex-wrap">
              {SORT_OPTIONS.map((opt) => (
                <a
                  key={opt.value}
                  href={`?${new URLSearchParams({ ...params as Record<string,string>, sort: opt.value }).toString()}`}
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

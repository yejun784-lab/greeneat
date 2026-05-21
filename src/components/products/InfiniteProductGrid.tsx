'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ProductCard } from './ProductCard'
import { ProductCardSkeleton } from './ProductCardSkeleton'
import type { Product } from '@/types'

const PAGE_SIZE = 9

export interface ProductFilters {
  category?: string
  difficulty?: string
  servings?: string
  sort?: string
  search?: string
  exclude?: string | string[]
  minCal?: string
  maxCal?: string
}

interface Props {
  initialProducts: Product[]
  initialHasMore: boolean
  total: number
  filters: ProductFilters
}

export function InfiniteProductGrid({ initialProducts, initialHasMore, total, filters }: Props) {
  const [products, setProducts] = useState(initialProducts)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)

  const loadMore = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()

    // 카테고리 slug → id 변환
    let categoryId: string | null = null
    if (filters.category) {
      const { data: cat } = await supabase
        .from('product_categories')
        .select('id')
        .eq('slug', filters.category)
        .single()
      categoryId = cat?.id ?? null
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query: any = supabase
      .from('products')
      .select('*, product_categories(id, name, slug)')
      .eq('is_active', true)

    if (categoryId)          query = query.eq('category_id', categoryId)
    if (filters.difficulty)  query = query.eq('difficulty', filters.difficulty)
    if (filters.servings)    query = query.eq('servings', Number(filters.servings))
    if (filters.search)      query = query.ilike('name', `%${filters.search}%`)
    if (filters.minCal)      query = query.gte('calories', Number(filters.minCal))
    if (filters.maxCal)      query = query.lte('calories', Number(filters.maxCal))

    // 알레르기 다중 제외
    const excludeRaw = filters.exclude
    const excludeList: string[] = excludeRaw
      ? Array.isArray(excludeRaw) ? excludeRaw : [excludeRaw]
      : []
    for (const allergen of excludeList) {
      if (allergen) query = query.not('allergens', 'cs', `{${allergen}}`)
    }

    const sort = filters.sort ?? 'newest'
    if (sort === 'price_asc')        query = query.order('price', { ascending: true })
    else if (sort === 'price_desc')  query = query.order('price', { ascending: false })
    else if (sort === 'cal_asc')     query = query.order('calories', { ascending: true, nullsFirst: false })
    else  query = query.order('display_group', { ascending: true }).order('created_at', { ascending: false })

    const from = (page + 1) * PAGE_SIZE - PAGE_SIZE
    query = query.range(from, from + PAGE_SIZE - 1)

    const { data } = await query
    const newProducts = (data as Product[]) ?? []
    const nextPage = page + 1
    setProducts((p) => [...p, ...newProducts])
    setPage(nextPage)
    setHasMore(nextPage * PAGE_SIZE < total)
    setLoading(false)
  }, [page, filters, total])

  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-ink-5 text-sm">
        검색 결과가 없어요.
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
        {loading && [...Array(3)].map((_, i) => <ProductCardSkeleton key={i} />)}
      </div>
      {hasMore && !loading && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            className="px-8 py-3 border border-line-2 rounded-xl text-sm font-medium text-ink-3 hover:border-[#2d7a4f] hover:text-[#2d7a4f] transition-colors"
          >
            더 보기
          </button>
        </div>
      )}
    </div>
  )
}

'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ProductCard } from './ProductCard'
import { ProductCardSkeleton } from './ProductCardSkeleton'
import type { Product } from '@/types'

const PAGE_SIZE = 9

interface Props {
  initialProducts: Product[]
  initialHasMore: boolean
  total: number
  filters: Record<string, string | undefined>
}

export function InfiniteProductGrid({ initialProducts, initialHasMore, total, filters }: Props) {
  const [products, setProducts] = useState(initialProducts)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)

  const loadMore = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const selectClause = filters.category
      ? '*, product_categories!inner(id, name, slug, description)'
      : '*, product_categories(id, name, slug, description)'

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query: any = supabase.from('products').select(selectClause)
    if (filters.category)   query = query.eq('product_categories.slug', filters.category)
    if (filters.difficulty) query = query.eq('difficulty', filters.difficulty)
    if (filters.servings)   query = query.eq('servings', Number(filters.servings))
    if (filters.search)     query = query.ilike('name', `%${filters.search}%`)
    if (filters.minCal)     query = query.gte('calories', Number(filters.minCal))
    if (filters.maxCal)     query = query.lte('calories', Number(filters.maxCal))
    if (filters.exclude)    query = query.not('allergens', 'cs', `{${filters.exclude}}`)

    const sort = filters.sort ?? 'newest'
    if (sort === 'price_asc')  query = query.order('display_group', { ascending: true }).order('price', { ascending: true })
    else if (sort === 'price_desc') query = query.order('display_group', { ascending: true }).order('price', { ascending: false })
    else query = query.order('display_group', { ascending: true }).order('created_at', { ascending: false })

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

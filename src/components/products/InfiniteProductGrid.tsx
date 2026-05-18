'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { ProductCard } from './ProductCard'
import { ProductCardSkeleton } from './ProductCardSkeleton'
import type { Product } from '@/types'

interface Props {
  initialProducts: Product[]
  initialHasMore: boolean
  total: number
  filters: {
    category?: string
    difficulty?: string
    servings?: string
    sort?: string
    search?: string
    exclude?: string
  }
}

const PAGE_SIZE = 9

export function InfiniteProductGrid({ initialProducts, initialHasMore, total, filters }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [loading, setLoading] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const loadingRef = useRef(false) // 레이스 컨디션 방지용 ref

  // filters 변경 시 초기화
  useEffect(() => {
    // ID 기준 중복 제거
    const unique = Array.from(new Map(initialProducts.map(p => [p.id, p])).values())
    setProducts(unique)
    setPage(1)
    setHasMore(initialHasMore)
    loadingRef.current = false
  }, [initialProducts, initialHasMore])

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return
    loadingRef.current = true
    setLoading(true)

    const nextPage = page + 1
    const params = new URLSearchParams({
      page: String(nextPage),
      limit: String(PAGE_SIZE),
      ...(filters.category   && { category: filters.category }),
      ...(filters.difficulty && { difficulty: filters.difficulty }),
      ...(filters.servings   && { servings: filters.servings }),
      ...(filters.sort       && { sort: filters.sort }),
      ...(filters.search     && { search: filters.search }),
      ...(filters.exclude    && { exclude: filters.exclude }),
    })

    try {
      const res = await fetch(`/api/products?${params}`)
      const json = await res.json()
      setProducts((prev) => {
        const existingIds = new Set(prev.map(p => p.id))
        const newItems = (json.products ?? []).filter((p: Product) => !existingIds.has(p.id))
        return [...prev, ...newItems]
      })
      setPage(nextPage)
      setHasMore(json.hasMore ?? false)
    } catch {
      // 에러 시 그냥 더 보기 중단
      setHasMore(false)
    } finally {
      loadingRef.current = false
      setLoading(false)
    }
  }, [hasMore, page, filters])

  // IntersectionObserver로 sentinel 감지
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore()
      },
      { rootMargin: '200px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [loadMore])

  if (products.length === 0) {
    return (
      <div className="text-center py-24 text-ink-5">
        <p className="text-lg">
          {filters.search
            ? `"${filters.search}"에 해당하는 상품이 없습니다.`
            : '해당 조건의 상품이 없습니다.'}
        </p>
        <p className="text-sm mt-2">
          {filters.search ? '다른 검색어를 입력해보세요.' : '필터를 변경해보세요.'}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        {loading && (
          <>
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </>
        )}
      </div>

      {/* 스크롤 감지 sentinel */}
      {hasMore && <div ref={sentinelRef} className="h-4" />}

      {/* 전체 로드 완료 메시지 */}
      {!hasMore && products.length > 0 && products.length >= total && (
        <p className="text-center text-xs text-ink-5 mt-8 pb-2">
          총 {total}개 상품을 모두 불러왔습니다.
        </p>
      )}
    </>
  )
}

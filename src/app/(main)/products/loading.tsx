import { ProductGridSkeleton } from '@/components/products/ProductCardSkeleton'

export default function ProductsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="h-8 w-24 bg-line-2 rounded-lg animate-pulse" />
        <div className="h-4 w-48 bg-line-2 rounded mt-2 animate-pulse" />
      </div>
      {/* 검색바 스켈레톤 */}
      <div className="mb-6 h-11 max-w-md bg-line-2 rounded-xl animate-pulse" />

      <div className="flex gap-8">
        {/* 필터 사이드바 스켈레톤 */}
        <div className="hidden lg:block w-48 shrink-0 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <div className="h-4 w-20 bg-line-2 rounded animate-pulse mb-2" />
              <div className="space-y-1.5">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="h-8 bg-line-2 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
        {/* 그리드 */}
        <div className="flex-1">
          <div className="h-6 w-32 bg-line-2 rounded animate-pulse mb-5" />
          <ProductGridSkeleton count={9} />
        </div>
      </div>
    </div>
  )
}

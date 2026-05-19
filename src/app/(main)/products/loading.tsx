import { ProductCardSkeleton } from '@/components/products/ProductCardSkeleton'
import { Skeleton } from '@/components/ui/Skeleton'

export default function ProductsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
        {/* 필터 스켈레톤 (데스크톱만) */}
        <aside className="hidden lg:block w-44 shrink-0 space-y-4 pt-1">
          <Skeleton className="h-5 w-16" />
          <div className="space-y-2 pt-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
          </div>
          <Skeleton className="h-5 w-16 mt-4" />
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
          </div>
        </aside>

        {/* 상품 그리드 스켈레톤 */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-28 rounded-full" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[...Array(9)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
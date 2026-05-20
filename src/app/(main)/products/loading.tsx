import { ProductGridSkeleton } from '@/components/products/ProductCardSkeleton'

export default function ProductsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="h-7 bg-tint rounded w-24 animate-pulse mb-2" />
        <div className="h-4 bg-tint rounded w-48 animate-pulse" />
      </div>
      <div className="flex gap-8">
        <div className="hidden lg:block w-48 space-y-3">
          {[...Array(6)].map((_, i) => <div key={i} className="h-8 bg-tint rounded-lg animate-pulse" />)}
        </div>
        <div className="flex-1">
          <ProductGridSkeleton count={9} />
        </div>
      </div>
    </div>
  )
}
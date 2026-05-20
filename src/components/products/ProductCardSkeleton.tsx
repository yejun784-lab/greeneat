export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-line animate-pulse">
      <div className="aspect-square bg-tint" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-tint rounded w-3/4" />
        <div className="h-3 bg-tint rounded w-1/2" />
        <div className="h-4 bg-tint rounded w-1/3" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {[...Array(count)].map((_, i) => <ProductCardSkeleton key={i} />)}
    </div>
  )
}
export function ProductCardSkeleton() {
  return (
    <div className="bg-surface rounded-2xl border border-line overflow-hidden animate-pulse">
      {/* 이미지 */}
      <div className="aspect-[4/3] bg-line-2" />
      {/* 텍스트 */}
      <div className="p-4 space-y-3">
        <div className="h-3 bg-line-2 rounded w-1/3" />
        <div className="h-4 bg-line-2 rounded w-3/4" />
        <div className="flex gap-2">
          <div className="h-5 bg-line-2 rounded-full w-16" />
          <div className="h-5 bg-line-2 rounded-full w-14" />
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="h-5 bg-line-2 rounded w-20" />
          <div className="h-8 bg-line-2 rounded-lg w-24" />
        </div>
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

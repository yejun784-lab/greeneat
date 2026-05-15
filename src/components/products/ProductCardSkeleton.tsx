export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-[#f0f0ee] overflow-hidden shadow-sm animate-pulse">
      {/* 이미지 */}
      <div className="aspect-square bg-[#f0f0ee]" />
      {/* 텍스트 — ProductCard와 동일한 구조/높이 */}
      <div className="px-3.5 pt-3 pb-3.5">
        <div className="h-3.5 bg-[#f0f0ee] rounded w-3/4" />
        <div className="mt-1.5 h-[20px] flex items-center">
          <div className="h-4 bg-[#f0f0ee] rounded-md w-20" />
        </div>
        <div className="h-4 bg-[#f0f0ee] rounded w-1/2 mt-1" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

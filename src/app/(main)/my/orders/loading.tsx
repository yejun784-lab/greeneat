export default function OrdersLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-line-2 rounded-lg animate-pulse" />
        <div className="h-7 w-24 bg-line-2 rounded animate-pulse" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-surface rounded-2xl border border-line p-5">
            <div className="flex justify-between mb-3">
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-line-2 rounded-full animate-pulse" />
                <div className="h-6 w-24 bg-line-2 rounded animate-pulse" />
              </div>
              <div className="h-6 w-20 bg-line-2 rounded animate-pulse" />
            </div>
            <div className="space-y-1.5">
              <div className="h-4 w-full bg-line-2 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-line-2 rounded animate-pulse" />
            </div>
            <div className="mt-4 h-10 bg-line-2 rounded-xl animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Loading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="h-7 w-32 bg-tint rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-20 bg-tint rounded animate-pulse" />
        </div>
        <div className="h-10 w-28 bg-tint rounded-xl animate-pulse" />
      </div>
      <div className="bg-surface rounded-2xl border border-line overflow-hidden">
        <div className="h-10 bg-wash border-b border-line" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 py-3 border-b border-line last:border-0">
            <div className="h-4 w-28 bg-tint rounded animate-pulse" />
            <div className="h-4 w-16 bg-tint rounded animate-pulse" />
            <div className="h-4 w-20 bg-tint rounded animate-pulse ml-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}

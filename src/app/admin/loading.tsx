export default function AdminLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="h-7 w-48 bg-line-2 rounded animate-pulse" />
          <div className="h-4 w-32 bg-line-2 rounded mt-2 animate-pulse" />
        </div>
      </div>
      {/* 통계 카드 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-surface rounded-2xl border border-line p-5 h-28 animate-pulse" />
        ))}
      </div>
      {/* 콘텐츠 */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface rounded-2xl border border-line p-5 h-96 animate-pulse" />
        <div className="bg-surface rounded-2xl border border-line p-5 h-96 animate-pulse" />
      </div>
    </div>
  )
}

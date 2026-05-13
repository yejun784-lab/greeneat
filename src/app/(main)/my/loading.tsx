export default function MyPageLoading() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="h-8 w-28 bg-line-2 rounded-lg animate-pulse mb-8" />
      <div className="grid gap-5">
        {/* 프로필 카드 */}
        <div className="bg-surface rounded-2xl border border-line p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-line-2 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 bg-line-2 rounded animate-pulse" />
              <div className="h-3 w-48 bg-line-2 rounded animate-pulse" />
            </div>
          </div>
          <div className="h-24 bg-line-2 rounded-xl animate-pulse" />
        </div>
        {/* 나머지 카드들 */}
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-surface rounded-2xl border border-line p-5 h-32 animate-pulse" />
        ))}
      </div>
    </div>
  )
}

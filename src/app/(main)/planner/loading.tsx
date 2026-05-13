export default function PlannerLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="h-8 w-32 bg-line-2 rounded-lg animate-pulse" />
        <div className="h-4 w-64 bg-line-2 rounded mt-2 animate-pulse" />
      </div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-surface rounded-2xl border border-line p-4 h-24 animate-pulse" />
        ))}
      </div>
      <div className="bg-surface rounded-2xl border border-line overflow-hidden h-[520px] animate-pulse" />
    </div>
  )
}

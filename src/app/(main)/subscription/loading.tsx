export default function SubscriptionLoading() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <div className="h-9 w-48 bg-line-2 rounded-lg animate-pulse mx-auto mb-3" />
        <div className="h-5 w-72 bg-line-2 rounded animate-pulse mx-auto" />
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-surface rounded-2xl border border-line p-6 h-80 animate-pulse" />
        ))}
      </div>
    </div>
  )
}

import { createClient } from '@/lib/supabase/server'

export async function WeeklyNutritionReport({ userId }: { userId: string }) {
  const supabase = await createClient()
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const { data: orders } = await supabase
    .from('orders')
    .select('order_items(quantity, products(calories, protein))')
    .eq('user_id', userId)
    .eq('payment_status', 'paid')
    .gte('created_at', since)

  type OrderItem = { quantity: number; products?: { calories?: number | null; protein?: number | null } | null }

  const days = orders?.length ?? 0
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items: OrderItem[] = ((orders ?? []) as any[]).flatMap((o) => o.order_items ?? [])
  const totalCal = items.reduce((s, i) => s + (i.products?.calories ?? 0) * i.quantity, 0)
  const totalProtein = items.reduce((s, i) => s + (i.products?.protein ?? 0) * i.quantity, 0)
  const avgCal = days > 0 ? Math.round(totalCal / days) : 0
  const avgProtein = days > 0 ? Math.round(totalProtein / days) : 0

  return (
    <div className="bg-surface rounded-2xl border border-line p-5">
      <p className="text-sm font-semibold text-ink mb-1">주간 영양 리포트</p>
      <p className="text-xs text-ink-4 mb-4">최근 7일 주문 기준 평균</p>
      {days === 0 ? (
        <p className="text-sm text-ink-5 text-center py-4">최근 주문이 없어요</p>
      ) : (
        <div className="space-y-3">
          {[
            { label: '평균 칼로리', value: avgCal, unit: 'kcal', max: 2500, color: 'bg-orange-400' },
            { label: '평균 단백질', value: avgProtein, unit: 'g', max: 150, color: 'bg-[#2d7a4f]' },
          ].map((item) => (
            <div key={item.label}>
              <div className="flex justify-between text-xs text-ink-3 mb-1">
                <span>{item.label}</span>
                <span className="font-semibold">{item.value.toLocaleString()} {item.unit}</span>
              </div>
              <div className="w-full bg-tint rounded-full h-2">
                <div
                  className={`${item.color} h-2 rounded-full transition-all`}
                  style={{ width: `${Math.min(100, (item.value / item.max) * 100)}%` }}
                />
              </div>
            </div>
          ))}
          <p className="text-xs text-ink-5 text-right">{days}일치 주문 분석</p>
        </div>
      )}
    </div>
  )
}

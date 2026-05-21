'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TrendingUp, TrendingDown, Minus, BarChart3, ShoppingBag } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

type OrderItem = {
  quantity: number
  price_at_purchase: number
  products: { name: string } | null
}

type Order = {
  id: string
  total_price: number
  created_at: string
  order_items: OrderItem[]
}

type DailySales = { date: string; revenue: number }
type ProductSales = { name: string; quantity: number; revenue: number }

function buildDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function buildDisplayKey(date: Date): string {
  return `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}`
}

export default function AdminAnalyticsPage() {
  const supabase = createClient()

  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const [thisMonthRevenue, setThisMonthRevenue] = useState(0)
  const [lastMonthRevenue, setLastMonthRevenue] = useState(0)
  const [dailySales, setDailySales] = useState<DailySales[]>([])
  const [topProducts, setTopProducts] = useState<ProductSales[]>([])

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
      if (profile?.role !== 'admin') { window.location.href = '/'; return }
      setAuthChecked(true)
    }
    checkAuth()
  }, [])

  useEffect(() => {
    if (!authChecked) return
    fetchAnalytics()
  }, [authChecked])

  async function fetchAnalytics() {
    setLoading(true)
    const now = new Date()

    // 이번달 범위
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString()

    // 저번달 범위
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59).toISOString()

    // 최근 30일
    const thirtyDaysAgo = new Date(now)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29)
    thirtyDaysAgo.setHours(0, 0, 0, 0)

    const [
      { data: thisMonthData },
      { data: lastMonthData },
      { data: recentOrders },
    ] = await Promise.all([
      supabase
        .from('orders')
        .select('total_price')
        .eq('payment_status', 'paid')
        .gte('created_at', thisMonthStart)
        .lte('created_at', thisMonthEnd),
      supabase
        .from('orders')
        .select('total_price')
        .eq('payment_status', 'paid')
        .gte('created_at', lastMonthStart)
        .lte('created_at', lastMonthEnd),
      supabase
        .from('orders')
        .select('id, total_price, created_at, order_items(quantity, price_at_purchase, products(name))')
        .eq('payment_status', 'paid')
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: true }),
    ])

    // 이번달 / 저번달 합계
    const thisTotal = (thisMonthData ?? []).reduce((s, o) => s + (o.total_price ?? 0), 0)
    const lastTotal = (lastMonthData ?? []).reduce((s, o) => s + (o.total_price ?? 0), 0)
    setThisMonthRevenue(thisTotal)
    setLastMonthRevenue(lastTotal)

    // 최근 30일 일별 매출
    const dailyMap: Record<string, number> = {}
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now)
      d.setDate(d.getDate() - i)
      const key = buildDateKey(d)
      dailyMap[key] = 0
    }
    for (const order of (recentOrders ?? []) as unknown as Order[]) {
      const d = new Date(order.created_at)
      const key = buildDateKey(d)
      if (key in dailyMap) dailyMap[key] += order.total_price ?? 0
    }
    setDailySales(
      Object.entries(dailyMap).map(([dateKey, revenue]) => {
        const [y, m, d] = dateKey.split('-').map(Number)
        const display = buildDisplayKey(new Date(y, m - 1, d))
        return { date: display, revenue }
      })
    )

    // 상위 5개 상품 집계
    const productMap: Record<string, { name: string; quantity: number; revenue: number }> = {}
    for (const order of (recentOrders ?? []) as unknown as Order[]) {
      for (const item of order.order_items ?? []) {
        const name = (Array.isArray(item.products) ? item.products[0]?.name : item.products?.name) ?? '기타'
        if (!productMap[name]) productMap[name] = { name, quantity: 0, revenue: 0 }
        productMap[name].quantity += item.quantity ?? 0
        productMap[name].revenue += (item.price_at_purchase ?? 0) * (item.quantity ?? 0)
      }
    }
    const sorted = Object.values(productMap).sort((a, b) => b.quantity - a.quantity).slice(0, 5)
    setTopProducts(sorted)

    setLoading(false)
  }

  const growthRate = lastMonthRevenue === 0
    ? (thisMonthRevenue > 0 ? 100 : 0)
    : Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)

  const maxDailyRevenue = Math.max(...dailySales.map((d) => d.revenue), 1)
  const maxProductQuantity = Math.max(...topProducts.map((p) => p.quantity), 1)

  if (!authChecked || loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="h-7 w-48 bg-line-2 rounded animate-pulse mb-4" />
        <div className="h-4 w-32 bg-line-2 rounded animate-pulse mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface rounded-2xl border border-line p-5 h-28 animate-pulse" />
          ))}
        </div>
        <div className="bg-surface rounded-2xl border border-line p-5 h-64 animate-pulse mb-6" />
        <div className="bg-surface rounded-2xl border border-line p-5 h-48 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ink">매출 분석</h1>
          <p className="text-sm text-ink-4 mt-1">결제 완료 기준 · 최근 30일</p>
        </div>
        <a href="/admin" className="text-sm text-[#2d7a4f] hover:underline">← 대시보드</a>
      </div>

      {/* 이번달 / 저번달 / 증감률 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-surface rounded-2xl border border-line p-5">
          <p className="text-xs text-ink-5 mb-1">이번 달 매출</p>
          <p className="text-xl font-bold text-ink">{formatPrice(thisMonthRevenue)}</p>
          <p className="text-xs text-ink-5 mt-1">{new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}</p>
        </div>
        <div className="bg-surface rounded-2xl border border-line p-5">
          <p className="text-xs text-ink-5 mb-1">저번 달 매출</p>
          <p className="text-xl font-bold text-ink">{formatPrice(lastMonthRevenue)}</p>
          <p className="text-xs text-ink-5 mt-1">
            {new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' })}
          </p>
        </div>
        <div className="bg-surface rounded-2xl border border-line p-5">
          <p className="text-xs text-ink-5 mb-1">전월 대비 증감</p>
          <div className="flex items-center gap-1.5 mt-1">
            {growthRate > 0 ? (
              <TrendingUp size={20} className="text-[#2d7a4f]" />
            ) : growthRate < 0 ? (
              <TrendingDown size={20} className="text-red-500" />
            ) : (
              <Minus size={20} className="text-ink-4" />
            )}
            <span className={`text-xl font-bold ${
              growthRate > 0 ? 'text-[#2d7a4f]' : growthRate < 0 ? 'text-red-500' : 'text-ink-4'
            }`}>
              {growthRate > 0 ? '+' : ''}{growthRate}%
            </span>
          </div>
          <p className="text-xs text-ink-5 mt-1">
            {growthRate > 0 ? '상승' : growthRate < 0 ? '하락' : '변동 없음'}
          </p>
        </div>
      </div>

      {/* 최근 30일 일별 매출 바 차트 */}
      <div className="bg-surface rounded-2xl border border-line p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={16} className="text-[#2d7a4f]" />
          <h2 className="font-semibold text-ink">최근 30일 일별 매출</h2>
        </div>
        <div className="flex items-end gap-0.5 h-40 overflow-x-auto pb-6 relative">
          {dailySales.map((day, idx) => {
            const heightPct = maxDailyRevenue > 0 ? (day.revenue / maxDailyRevenue) * 100 : 0
            const showLabel = idx % 5 === 0
            return (
              <div key={day.date} className="flex flex-col items-center flex-1 min-w-[18px] group relative">
                {/* 툴팁 */}
                {day.revenue > 0 && (
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-ink text-white text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {formatPrice(day.revenue)}
                  </div>
                )}
                <div
                  className="w-full rounded-t transition-all"
                  style={{
                    height: `${Math.max(heightPct, day.revenue > 0 ? 2 : 0)}%`,
                    backgroundColor: day.revenue > 0 ? '#2d7a4f' : '#e8f0ea',
                  }}
                />
                {showLabel && (
                  <span className="absolute bottom-0 text-[9px] text-ink-5 whitespace-nowrap">{day.date}</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 상위 5개 상품 */}
      <div className="bg-surface rounded-2xl border border-line p-5">
        <div className="flex items-center gap-2 mb-4">
          <ShoppingBag size={16} className="text-[#2d7a4f]" />
          <h2 className="font-semibold text-ink">상위 5개 상품</h2>
          <span className="text-xs text-ink-5">(최근 30일 판매량 기준)</span>
        </div>
        {topProducts.length === 0 ? (
          <p className="text-sm text-ink-5 py-4 text-center">판매 데이터가 없습니다.</p>
        ) : (
          <div className="space-y-3">
            {topProducts.map((product, idx) => {
              const barWidth = maxProductQuantity > 0 ? (product.quantity / maxProductQuantity) * 100 : 0
              return (
                <div key={product.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-ink-5 w-4">{idx + 1}</span>
                      <span className="text-sm font-medium text-ink">{product.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-ink-4">
                      <span>{product.quantity}개</span>
                      <span className="font-semibold text-ink">{formatPrice(product.revenue)}</span>
                    </div>
                  </div>
                  <div className="h-2 bg-line rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#2d7a4f] transition-all"
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

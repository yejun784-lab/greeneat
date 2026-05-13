import type { ElementType } from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { Package, Users, RefreshCw, TrendingUp, ShoppingCart, AlertTriangle } from 'lucide-react'
import { RevenueChart } from '@/components/admin/RevenueChart'

type StatCard = { label: string; value: string | number; sub?: string; icon: ElementType; color: string }

async function getStats() {
  const supabase = await createClient()

  const [
    { count: totalOrders },
    { count: totalUsers },
    { count: activeSubscriptions },
    { data: revenueData },
    { data: dailyOrdersRaw },
    { data: recentOrders },
    { data: lowStockProducts },
  ] = await Promise.all([
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('orders').select('total_price').eq('payment_status', 'paid'),
    supabase
      .from('orders')
      .select('total_price, created_at')
      .eq('payment_status', 'paid')
      .gte('created_at', (() => { const d = new Date(); d.setDate(d.getDate() - 13); return d.toISOString() })()),
    supabase
      .from('orders')
      .select('id, total_price, status, created_at, profiles(name)')
      .order('created_at', { ascending: false })
      .limit(8),
    supabase
      .from('products')
      .select('id, name, stock')
      .lt('stock', 20)
      .order('stock', { ascending: true })
      .limit(5),
  ])

  const totalRevenue = (revenueData ?? []).reduce((s, o) => s + (o.total_price ?? 0), 0)

  // 최근 14일 일별 매출 집계
  const dailyMap: Record<string, number> = {}
  const today = new Date()
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
    dailyMap[key] = 0
  }
  for (const order of dailyOrdersRaw ?? []) {
    const d = new Date(order.created_at)
    const key = `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`
    if (key in dailyMap) dailyMap[key] += order.total_price ?? 0
  }
  const chartData = Object.entries(dailyMap).map(([date, revenue]) => ({ date, revenue }))

  return {
    totalOrders: totalOrders ?? 0,
    totalUsers: totalUsers ?? 0,
    activeSubscriptions: activeSubscriptions ?? 0,
    totalRevenue,
    chartData,
    recentOrders: recentOrders ?? [],
    lowStockProducts: lowStockProducts ?? [],
  }
}

const STATUS_LABEL: Record<string, string> = {
  pending: '주문 접수', confirmed: '확인', preparing: '준비 중',
  shipped: '배송 중', delivered: '완료', cancelled: '취소',
}
const STATUS_COLOR: Record<string, string> = {
  pending: 'text-yellow-600 bg-yellow-50',
  confirmed: 'text-blue-600 bg-blue-50',
  preparing: 'text-purple-600 bg-purple-50',
  shipped: 'text-indigo-600 bg-indigo-50',
  delivered: 'text-green-600 bg-green-50',
  cancelled: 'text-gray-500 bg-gray-100',
}

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (profile?.role !== 'admin') redirect('/')

  const stats = await getStats()

  const statCards: StatCard[] = [
    { label: '총 주문', value: stats.totalOrders.toLocaleString(), sub: '건', icon: ShoppingCart, color: 'text-blue-500 bg-blue-50' },
    { label: '가입 회원', value: stats.totalUsers.toLocaleString(), sub: '명', icon: Users, color: 'text-purple-500 bg-purple-50' },
    { label: '활성 구독', value: stats.activeSubscriptions.toLocaleString(), sub: '건', icon: RefreshCw, color: 'text-[#2d7a4f] bg-green-tint' },
    { label: '총 매출', value: formatPrice(stats.totalRevenue), icon: TrendingUp, color: 'text-orange-500 bg-orange-50' },
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ink">어드민 대시보드</h1>
          <p className="text-sm text-ink-4 mt-1">GreenEat 운영 현황</p>
        </div>
        <p className="text-xs text-ink-5">{new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="bg-surface rounded-2xl border border-line p-5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
                <Icon size={18} />
              </div>
              <p className="text-xs text-ink-5 mb-1">{card.label}</p>
              <p className="text-xl font-bold text-ink">
                {card.value}
                {card.sub && <span className="text-sm font-normal text-ink-4 ml-1">{card.sub}</span>}
              </p>
            </div>
          )
        })}
      </div>

      {/* 매출 추이 차트 */}
      <div className="bg-surface rounded-2xl border border-line p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-[#2d7a4f]" />
            <h2 className="font-semibold text-ink">최근 14일 매출 추이</h2>
          </div>
          <span className="text-xs text-ink-5">결제 완료 기준</span>
        </div>
        <RevenueChart data={stats.chartData} height={120} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* 최근 주문 */}
        <div className="lg:col-span-2 bg-surface rounded-2xl border border-line p-5">
          <div className="flex items-center gap-2 mb-4">
            <Package size={16} className="text-[#2d7a4f]" />
            <h2 className="font-semibold text-ink">최근 주문</h2>
          </div>
          <div className="space-y-0">
            {stats.recentOrders.length === 0 && (
              <p className="text-sm text-ink-5 py-4 text-center">주문 없음</p>
            )}
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {stats.recentOrders.map((order: any) => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b border-line last:border-0">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLOR[order.status] ?? 'bg-tint text-ink-4'}`}>
                    {STATUS_LABEL[order.status] ?? order.status}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink">
                      {Array.isArray(order.profiles)
                        ? order.profiles[0]?.name ?? '회원'
                        : order.profiles?.name ?? '회원'}
                    </p>
                    <p className="text-xs text-ink-5">{new Date(order.created_at).toLocaleDateString('ko-KR')}</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-ink">{formatPrice(order.total_price)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 재고 부족 상품 */}
        <div className="bg-surface rounded-2xl border border-line p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} className="text-orange-400" />
            <h2 className="font-semibold text-ink">재고 부족</h2>
            <span className="text-xs text-ink-5">(20개 미만)</span>
          </div>
          {stats.lowStockProducts.length === 0 ? (
            <p className="text-sm text-ink-5 py-4 text-center">재고 부족 상품 없음 ✅</p>
          ) : (
            <div className="space-y-3">
              {stats.lowStockProducts.map((p: { id: string; name: string; stock: number }) => (
                <div key={p.id} className="flex items-center justify-between">
                  <p className="text-sm text-ink truncate flex-1">{p.name}</p>
                  <span className={`text-xs font-bold ml-2 ${p.stock === 0 ? 'text-red-500' : 'text-orange-500'}`}>
                    {p.stock === 0 ? '품절' : `${p.stock}개`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

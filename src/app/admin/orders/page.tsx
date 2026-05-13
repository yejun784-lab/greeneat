import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatPrice, formatDate } from '@/lib/utils'
import { OrderStatusSelect } from '@/components/admin/OrderStatusSelect'

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

export default async function AdminOrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin') redirect('/')

  const { data } = await supabase
    .from('orders')
    .select('id, total_price, status, payment_status, created_at, is_gift, profiles(name)')
    .order('created_at', { ascending: false })
    .limit(100)

  const orders = data ?? []

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ink">주문 관리</h1>
          <p className="text-sm text-ink-4 mt-1">총 {orders.length}건</p>
        </div>
        <a href="/admin" className="text-sm text-[#2d7a4f] hover:underline">← 대시보드</a>
      </div>

      <div className="bg-surface rounded-2xl border border-line overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-wash border-b border-line">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">주문 ID</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">고객</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">금액</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">결제</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">날짜</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-ink-5 text-sm">주문 없음</td>
                </tr>
              )}
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {orders.map((order: any) => (
                <tr key={order.id} className="hover:bg-wash/50">
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-ink-4">
                      {order.id.slice(0, 8)}…
                    </span>
                    {order.is_gift && (
                      <span className="ml-1.5 text-xs bg-red-50 text-red-400 px-1.5 py-0.5 rounded-full">선물</span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-ink">
                    {Array.isArray(order.profiles)
                      ? order.profiles[0]?.name ?? '회원'
                      : order.profiles?.name ?? '회원'}
                  </td>
                  <td className="px-4 py-3 font-semibold text-ink">{formatPrice(order.total_price)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      order.payment_status === 'paid' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                    }`}>
                      {order.payment_status === 'paid' ? '결제완료' : '미결제'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink-4 text-xs">{formatDate(order.created_at)}</td>
                  <td className="px-4 py-3">
                    <OrderStatusSelect
                      orderId={order.id}
                      currentStatus={order.status}
                      statusLabel={STATUS_LABEL}
                      statusColor={STATUS_COLOR}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

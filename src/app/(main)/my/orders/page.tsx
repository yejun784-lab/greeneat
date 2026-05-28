import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatPrice, formatDate, ORDER_STATUS_LABEL } from '@/lib/utils'
import { ChevronLeft, Package, CheckCircle2, Truck, Clock, XCircle } from 'lucide-react'
import { ReorderButton } from '@/components/my/ReorderButton'
import { CancelOrderButton } from '@/components/my/CancelOrderButton'
import type { Order, OrderStatus } from '@/types'

const STATUS_STEPS: { key: OrderStatus; label: string; icon: React.ElementType }[] = [
  { key: 'pending',   label: '주문 접수',  icon: Clock },
  { key: 'confirmed', label: '주문 확인',  icon: CheckCircle2 },
  { key: 'preparing', label: '상품 준비',  icon: Package },
  { key: 'shipped',   label: '배송 중',    icon: Truck },
  { key: 'delivered', label: '배송 완료',  icon: CheckCircle2 },
]

function DeliveryTimeline({ status }: { status: OrderStatus }) {
  if (status === 'cancelled') {
    return (
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-line">
        <XCircle size={14} className="text-ink-5" />
        <span className="text-xs text-ink-5">주문이 취소되었습니다.</span>
      </div>
    )
  }

  const currentIdx = STATUS_STEPS.findIndex((s) => s.key === status)

  return (
    <div className="mt-4 pt-3 border-t border-line">
      <div className="flex items-center justify-between relative">
        {/* 진행 바 배경 */}
        <div className="absolute left-0 right-0 top-[14px] h-0.5 bg-line-2 -z-0" />
        <div
          className="absolute left-0 top-[14px] h-0.5 bg-[#2d7a4f] transition-all duration-500 -z-0"
          style={{ width: `${(currentIdx / (STATUS_STEPS.length - 1)) * 100}%` }}
        />

        {STATUS_STEPS.map((step, i) => {
          const done = i <= currentIdx
          const Icon = step.icon
          return (
            <div key={step.key} className="flex flex-col items-center gap-1 z-10">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors ${
                  done
                    ? 'bg-[#2d7a4f] border-[#2d7a4f] text-white'
                    : 'bg-surface border-line-2 text-ink-5'
                }`}
              >
                <Icon size={12} />
              </div>
              <span className={`text-[10px] font-medium ${done ? 'text-[#2d7a4f]' : 'text-ink-5'}`}>
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('orders')
    .select('*, order_items(id, quantity, price_at_purchase, products(name))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(100)

  const orders = (data ?? []) as Order[]

  const STATUS_COLOR: Record<string, string> = {
    pending:   'bg-yellow-50 text-yellow-600',
    confirmed: 'bg-blue-50 text-blue-600',
    preparing: 'bg-purple-50 text-purple-600',
    shipped:   'bg-indigo-50 text-indigo-600',
    delivered: 'bg-green-50 text-[#2d7a4f]',
    cancelled: 'bg-tint text-ink-4',
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-2 mb-8">
        <Link href="/my" className="p-1 text-ink-5 hover:text-ink-2">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-ink">주문 내역</h1>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-surface rounded-2xl border border-line p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_COLOR[order.status] ?? 'bg-tint text-ink-3'}`}
                  >
                    {ORDER_STATUS_LABEL[order.status]}
                  </span>
                  <span className="text-xs text-ink-5">{formatDate(order.created_at)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CancelOrderButton orderId={order.id} status={order.status} />
                  {order.order_items && order.order_items.length > 0 && (
                    <ReorderButton items={order.order_items} />
                  )}
                  <span className="font-bold text-[#2d7a4f]">{formatPrice(order.total_price)}</span>
                  <Link href={`/my/orders/${order.id}`} className="text-xs text-ink-5 hover:text-[#2d7a4f] transition-colors">
                    상세 →
                  </Link>
                </div>
              </div>

              {order.order_items && order.order_items.length > 0 && (
                <ul className="space-y-1.5">
                  {order.order_items.map((item, i) => (
                    <li key={(item as { id?: string }).id ?? `${order.id}-${i}`} className="flex justify-between text-sm">
                      <span className="text-ink-3">
                        {item.products?.name ?? '상품'} × {item.quantity}
                      </span>
                      <span className="text-ink">
                        {formatPrice(item.price_at_purchase * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              {/* 배송 추적 타임라인 */}
              <DeliveryTimeline status={order.status} />

              <p className="text-xs text-ink-5 mt-3 font-mono">{order.id}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-ink-5">
          <p className="text-lg">주문 내역이 없습니다.</p>
          <Link href="/products" className="mt-3 inline-block text-sm text-[#2d7a4f] hover:underline">
            밀키트 둘러보기 →
          </Link>
        </div>
      )}
    </div>
  )
}

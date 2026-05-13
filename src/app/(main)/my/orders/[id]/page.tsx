import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { formatPrice, formatDate, ORDER_STATUS_LABEL } from '@/lib/utils'
import {
  ChevronLeft, Package, CheckCircle2, Truck, Clock,
  XCircle, MapPin, CreditCard, Calendar, Gift,
} from 'lucide-react'
import { ReorderButton } from '@/components/my/ReorderButton'
import type { OrderStatus } from '@/types'

const STATUS_STEPS: { key: OrderStatus; label: string; icon: React.ElementType }[] = [
  { key: 'pending',   label: '주문 접수', icon: Clock },
  { key: 'confirmed', label: '주문 확인', icon: CheckCircle2 },
  { key: 'preparing', label: '상품 준비', icon: Package },
  { key: 'shipped',   label: '배송 중',   icon: Truck },
  { key: 'delivered', label: '배송 완료', icon: CheckCircle2 },
]

const STATUS_COLOR: Record<string, string> = {
  pending:   'bg-yellow-50 text-yellow-600',
  confirmed: 'bg-blue-50 text-blue-600',
  preparing: 'bg-purple-50 text-purple-600',
  shipped:   'bg-indigo-50 text-indigo-600',
  delivered: 'bg-green-50 text-[#2d7a4f]',
  cancelled: 'bg-tint text-ink-4',
}

const PAYMENT_METHOD_LABEL: Record<string, string> = {
  card: '신용/체크카드',
  kakaopay: '카카오페이',
  tosspay: '토스페이',
  naverpay: '네이버페이',
  '가상계좌': '가상계좌',
  '계좌이체': '계좌이체',
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: order } = await supabase
    .from('orders')
    .select(`
      *,
      order_items (
        id, quantity, price_at_purchase,
        products ( id, name, image_url, description )
      ),
      addresses ( address, detail, label )
    `)
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!order) notFound()

  const currentIdx = STATUS_STEPS.findIndex((s) => s.key === order.status)
  const isCancelled = order.status === 'cancelled'

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-8">
        <Link href="/my/orders" className="p-1 text-ink-5 hover:text-ink-2">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-xl font-bold text-ink">주문 상세</h1>
      </div>

      <div className="space-y-4">
        {/* 주문 상태 */}
        <div className="bg-surface rounded-2xl border border-line p-5">
          <div className="flex items-center justify-between mb-4">
            <span className={`text-sm font-semibold px-3 py-1 rounded-full ${STATUS_COLOR[order.status] ?? 'bg-tint text-ink-4'}`}>
              {ORDER_STATUS_LABEL[order.status]}
            </span>
            <div className="flex items-center gap-2">
              {order.is_gift && (
                <span className="flex items-center gap-1 text-xs text-pink-500 bg-pink-50 px-2 py-0.5 rounded-full font-medium">
                  <Gift size={11} /> 선물
                </span>
              )}
              <span className="text-xs text-ink-5">{formatDate(order.created_at)}</span>
            </div>
          </div>

          {/* 배송 타임라인 */}
          {!isCancelled ? (
            <div className="relative flex items-start justify-between">
              <div className="absolute left-3.5 right-3.5 top-3.5 h-0.5 bg-line-2" />
              <div
                className="absolute left-3.5 top-3.5 h-0.5 bg-[#2d7a4f] transition-all duration-500"
                style={{ width: currentIdx <= 0 ? 0 : `calc(${(currentIdx / (STATUS_STEPS.length - 1)) * 100}% - 0px)` }}
              />
              {STATUS_STEPS.map((step, i) => {
                const done = i <= currentIdx
                const Icon = step.icon
                return (
                  <div key={step.key} className="flex flex-col items-center gap-1.5 z-10">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors ${done ? 'bg-[#2d7a4f] border-[#2d7a4f] text-white' : 'bg-surface border-line-2 text-ink-5'}`}>
                      <Icon size={12} />
                    </div>
                    <span className={`text-[10px] font-medium text-center leading-tight ${done ? 'text-[#2d7a4f]' : 'text-ink-5'}`}>
                      {step.label}
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="flex items-center gap-2 py-2">
              <XCircle size={16} className="text-ink-5" />
              <span className="text-sm text-ink-5">주문이 취소되었습니다.</span>
            </div>
          )}
        </div>

        {/* 주문 상품 */}
        <div className="bg-surface rounded-2xl border border-line p-5">
          <h2 className="font-semibold text-ink mb-4">주문 상품</h2>
          <div className="space-y-3">
            {(order.order_items ?? []).map((item: any) => (
              <div key={item.id} className="flex gap-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-wash shrink-0">
                  {item.products?.image_url ? (
                    <Image
                      src={item.products.image_url}
                      alt={item.products.name}
                      width={56}
                      height={56}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package size={16} className="text-ink-5" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.products?.id}`} className="font-medium text-ink text-sm hover:text-[#2d7a4f] transition-colors line-clamp-1">
                    {item.products?.name ?? '상품'}
                  </Link>
                  <p className="text-xs text-ink-5 mt-0.5 line-clamp-1">{item.products?.description}</p>
                  <p className="text-xs text-ink-4 mt-1">수량 {item.quantity}개</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold text-ink text-sm">{formatPrice(item.price_at_purchase * item.quantity)}</p>
                  <p className="text-xs text-ink-5">{formatPrice(item.price_at_purchase)} × {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* 합계 */}
          <div className="border-t border-line mt-4 pt-4 space-y-1.5">
            <div className="flex justify-between text-sm text-ink-4">
              <span>상품 금액</span>
              <span>{formatPrice(order.order_items?.reduce((s: number, i: any) => s + i.price_at_purchase * i.quantity, 0) ?? 0)}</span>
            </div>
            <div className="flex justify-between font-bold text-base">
              <span className="text-ink">총 결제 금액</span>
              <span className="text-[#2d7a4f]">{formatPrice(order.total_price)}</span>
            </div>
          </div>
        </div>

        {/* 배송지 */}
        {order.addresses && (
          <div className="bg-surface rounded-2xl border border-line p-5">
            <h2 className="font-semibold text-ink mb-3 flex items-center gap-2">
              <MapPin size={15} className="text-[#2d7a4f]" />
              배송지
            </h2>
            <p className="text-sm text-ink">{(order.addresses as any).address}</p>
            {(order.addresses as any).detail && (
              <p className="text-sm text-ink-4 mt-0.5">{(order.addresses as any).detail}</p>
            )}
          </div>
        )}

        {/* 결제 및 배송 일정 정보 */}
        <div className="bg-surface rounded-2xl border border-line p-5">
          <h2 className="font-semibold text-ink mb-3">결제 정보</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-4 flex items-center gap-1.5"><CreditCard size={13} />결제 수단</span>
              <span className="text-ink">{PAYMENT_METHOD_LABEL[order.payment_method ?? ''] ?? order.payment_method ?? '카드'}</span>
            </div>
            {order.delivery_date && (
              <div className="flex justify-between">
                <span className="text-ink-4 flex items-center gap-1.5"><Calendar size={13} />배송 예정일</span>
                <span className="text-ink">{new Date(order.delivery_date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-ink-4">주문 번호</span>
              <span className="text-ink font-mono text-xs">{order.id}</span>
            </div>
          </div>
        </div>

        {/* 재주문 버튼 */}
        {order.order_items && order.order_items.length > 0 && order.status !== 'cancelled' && (
          <ReorderButton items={order.order_items} />
        )}
      </div>
    </div>
  )
}

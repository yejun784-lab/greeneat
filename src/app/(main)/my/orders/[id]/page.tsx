import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { formatPrice, formatDate, ORDER_STATUS_LABEL, getTrackingUrl } from '@/lib/utils'
import { ChevronLeft, Package, MapPin, CreditCard, Truck, ExternalLink, Gift } from 'lucide-react'
import type { OrderStatus } from '@/types'

const STATUS_COLOR: Record<string, string> = {
  pending:   'bg-yellow-50 text-yellow-600 border-yellow-200',
  confirmed: 'bg-blue-50 text-blue-600 border-blue-200',
  preparing: 'bg-purple-50 text-purple-600 border-purple-200',
  shipped:   'bg-indigo-50 text-indigo-600 border-indigo-200',
  delivered: 'bg-green-50 text-[#2d7a4f] border-green-200',
  cancelled: 'bg-tint text-ink-4 border-line-2',
}

const STATUS_STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'pending',   label: '주문 접수' },
  { key: 'confirmed', label: '주문 확인' },
  { key: 'preparing', label: '준비 중' },
  { key: 'shipped',   label: '배송 중' },
  { key: 'delivered', label: '배송 완료' },
]

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(*, products(id, name, image_url, price)), addresses(label, address, detail)')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!order) notFound()

  const currentIdx = STATUS_STEPS.findIndex((s) => s.key === order.status)
  const isCancelled = order.status === 'cancelled'

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 mb-8">
        <Link href="/my/orders" className="p-1 text-ink-5 hover:text-ink-2">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-ink">주문 상세</h1>
      </div>

      <div className="space-y-4">
        {/* 주문 상태 */}
        <div className="bg-surface rounded-2xl border border-line p-5">
          <div className="flex items-center justify-between mb-4">
            <span className={`text-sm font-semibold px-3 py-1 rounded-full border ${STATUS_COLOR[order.status] ?? 'bg-tint text-ink-4'}`}>
              {ORDER_STATUS_LABEL[order.status]}
            </span>
            <span className="text-xs text-ink-5">{formatDate(order.created_at)}</span>
          </div>
          {!isCancelled && (
            <div className="flex items-center justify-between relative mt-2">
              <div className="absolute left-0 right-0 top-[14px] h-0.5 bg-line-2" />
              <div
                className="absolute left-0 top-[14px] h-0.5 bg-[#2d7a4f] transition-all"
                style={{ width: currentIdx >= 0 ? `${(currentIdx / (STATUS_STEPS.length - 1)) * 100}%` : '0%' }}
              />
              {STATUS_STEPS.map((step, i) => {
                const done = i <= currentIdx
                return (
                  <div key={step.key} className="flex flex-col items-center gap-1 z-10">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center border-2 text-xs font-bold transition-colors ${done ? 'bg-[#2d7a4f] border-[#2d7a4f] text-white' : 'bg-surface border-line-2 text-ink-5'}`}>
                      {i + 1}
                    </div>
                    <span className={`text-[10px] font-medium text-center ${done ? 'text-[#2d7a4f]' : 'text-ink-5'}`}>
                      {step.label}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
          <p className="text-[10px] text-ink-5 mt-4 font-mono break-all">주문번호: {order.id}</p>
        </div>

        {/* 주문 상품 */}
        <div className="bg-surface rounded-2xl border border-line p-5">
          <div className="flex items-center gap-2 mb-4">
            <Package size={15} className="text-[#2d7a4f]" />
            <h2 className="font-semibold text-ink">주문 상품</h2>
          </div>
          <div className="space-y-3">
            {(order.order_items ?? []).map((item: any) => {
              const imgSrc = item.products?.image_url
                ? (item.products.image_url.startsWith('http')
                    ? item.products.image_url
                    : `https://nbdpckerbphyfnjzqiqp.supabase.co/storage/v1/object/public/product-images/greeneat/${item.products.image_url}`)
                : null
              return (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-tint shrink-0">
                    {imgSrc ? (
                      <Image src={imgSrc} alt={item.products?.name ?? ''} width={56} height={56} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-green-tint" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-ink truncate">{item.products?.name ?? '상품'}</p>
                    <p className="text-xs text-ink-5 mt-0.5">수량 {item.quantity}개</p>
                  </div>
                  <p className="text-sm font-semibold text-ink shrink-0">
                    {formatPrice(item.price_at_purchase * item.quantity)}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* 선물 정보 */}
        {order.is_gift && (
          <div className="bg-red-50 rounded-2xl border border-red-100 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Gift size={15} className="text-red-400" />
              <h2 className="font-semibold text-ink">선물 정보</h2>
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex gap-2">
                <span className="text-ink-4 w-16 shrink-0">받는 분</span>
                <span className="text-ink font-medium">{order.recipient_name}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-ink-4 w-16 shrink-0">연락처</span>
                <span className="text-ink">{order.recipient_phone}</span>
              </div>
              {order.gift_message && (
                <div className="flex gap-2 mt-2 pt-2 border-t border-red-100">
                  <span className="text-ink-4 w-16 shrink-0">메시지</span>
                  <span className="text-ink-3 italic">"{order.gift_message}"</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 배송지 */}
        {order.addresses && (
          <div className="bg-surface rounded-2xl border border-line p-5">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={15} className="text-[#2d7a4f]" />
              <h2 className="font-semibold text-ink">배송지</h2>
            </div>
            <p className="text-sm font-medium text-ink">{order.addresses.label}</p>
            <p className="text-sm text-ink-3 mt-1">{order.addresses.address}</p>
            {order.addresses.detail && <p className="text-sm text-ink-3">{order.addresses.detail}</p>}
          </div>
        )}

        {/* 배송 추적 */}
        {(order.status === 'shipped' || order.status === 'delivered') && order.tracking_number && (
          <div className="bg-surface rounded-2xl border border-[#2d7a4f]/20 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Truck size={15} className="text-[#2d7a4f]" />
              <h2 className="font-semibold text-ink">배송 추적</h2>
            </div>
            <div className="flex items-center justify-between bg-green-tint rounded-xl p-3">
              <div>
                <p className="text-xs text-ink-4 mb-0.5">{order.carrier ?? 'CJ대한통운'}</p>
                <p className="text-sm font-mono font-bold text-ink tracking-wider">{order.tracking_number}</p>
              </div>
              {(() => {
                const url = getTrackingUrl(order.carrier, order.tracking_number)
                return url ? (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 bg-[#2d7a4f] text-white text-xs font-semibold rounded-lg hover:bg-[#235f3d] transition-colors"
                  >
                    조회하기 <ExternalLink size={11} />
                  </a>
                ) : (
                  <span className="text-xs text-ink-5">추적 링크 없음</span>
                )
              })()}
            </div>
          </div>
        )}

        {/* 결제 정보 */}
        <div className="bg-surface rounded-2xl border border-line p-5">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard size={15} className="text-[#2d7a4f]" />
            <h2 className="font-semibold text-ink">결제 정보</h2>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-4">결제 수단</span>
              <span className="text-ink">{order.payment_method ?? '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-4">결제 상태</span>
              <span className={order.payment_status === 'paid' ? 'text-[#2d7a4f] font-medium' : 'text-ink'}>
                {order.payment_status === 'paid' ? '결제 완료' : '결제 대기'}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-line">
              <span className="font-semibold text-ink">총 결제금액</span>
              <span className="font-bold text-[#2d7a4f] text-base">{formatPrice(order.total_price)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Link href="/my/orders" className="flex-1 text-center py-3 border border-line-2 rounded-xl text-sm font-medium text-ink-3 hover:border-[#2d7a4f] hover:text-[#2d7a4f] transition-colors">
            목록으로
          </Link>
          <Link href="/products" className="flex-1 text-center py-3 bg-[#2d7a4f] rounded-xl text-sm font-semibold text-white hover:bg-[#235f3d] transition-colors">
            쇼핑 계속하기
          </Link>
        </div>
      </div>
    </div>
  )
}
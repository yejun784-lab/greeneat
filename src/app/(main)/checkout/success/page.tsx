import Link from 'next/link'
import { redirect } from 'next/navigation'
import { CheckCircle2, Package, ArrowRight, Home } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatPrice, formatDate } from '@/lib/utils'

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>
}) {
  const { orderId } = await searchParams
  if (!orderId) redirect('/')

  const supabase = await createClient()
  const { data: order } = await supabase
    .from('orders')
    .select('*, order_items(quantity, products(name))')
    .eq('id', orderId)
    .maybeSingle()

  const itemCount = (order?.order_items ?? []).reduce(
    (s: number, i: { quantity: number }) => s + i.quantity,
    0
  )
  const firstName = order?.order_items?.[0]?.products?.name ?? '상품'

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">

        {/* 체크 아이콘 */}
        <div className="relative inline-flex mb-8">
          <div className="w-24 h-24 rounded-full bg-green-tint flex items-center justify-center animate-fade-in">
            <CheckCircle2 size={48} className="text-[#2d7a4f]" strokeWidth={1.5} />
          </div>
          <span className="absolute -top-1 -right-1 text-2xl animate-bounce">🎉</span>
        </div>

        <h1 className="text-2xl font-bold text-ink mb-2 animate-fade-up">주문이 완료됐어요!</h1>
        <p className="text-ink-4 text-sm mb-8 animate-fade-up" style={{ animationDelay: '0.05s' }}>
          결제가 성공적으로 처리됐습니다.
        </p>

        {/* 주문 요약 카드 */}
        {order && (
          <div className="bg-surface border border-line rounded-2xl p-5 mb-6 text-left animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-2 mb-4">
              <Package size={15} className="text-[#2d7a4f]" />
              <span className="text-sm font-semibold text-ink">주문 정보</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-4">주문 상품</span>
                <span className="text-ink font-medium">
                  {firstName}{itemCount > 1 ? ` 외 ${itemCount - 1}개` : ''}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-4">결제 금액</span>
                <span className="font-bold text-[#2d7a4f]">{formatPrice(order.total_price)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-4">주문 일시</span>
                <span className="text-ink-3">{formatDate(order.created_at)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-line">
                <span className="text-ink-4">주문번호</span>
                <span className="text-ink-5 font-mono text-xs">{order.id.slice(0, 8)}...</span>
              </div>
            </div>
          </div>
        )}

        {/* 안내 메시지 */}
        <div className="bg-[#f0faf4] rounded-xl p-4 mb-8 text-sm text-[#2d7a4f] animate-fade-up" style={{ animationDelay: '0.15s' }}>
          📦 보통 2~3일 내 냉동 포장으로 배송됩니다.
        </div>

        {/* 버튼 */}
        <div className="flex flex-col sm:flex-row gap-3 animate-fade-up" style={{ animationDelay: '0.2s' }}>
          <Link
            href="/my/orders"
            className="flex-1 flex items-center justify-center gap-2 py-3 border border-line-2 rounded-xl text-sm font-medium text-ink-3 hover:border-[#2d7a4f] hover:text-[#2d7a4f] transition-colors"
          >
            <Package size={15} />
            주문 내역 보기
          </Link>
          <Link
            href="/products"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#2d7a4f] rounded-xl text-sm font-semibold text-white hover:bg-[#235f3d] transition-colors"
          >
            쇼핑 계속하기
            <ArrowRight size={15} />
          </Link>
        </div>

        <Link href="/" className="inline-flex items-center gap-1.5 mt-5 text-xs text-ink-5 hover:text-ink-3 transition-colors">
          <Home size={12} />
          홈으로
        </Link>
      </div>
    </div>
  )
}
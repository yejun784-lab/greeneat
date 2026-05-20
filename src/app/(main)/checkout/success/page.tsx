import Link from 'next/link'
import { CheckCircle2, Package, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatPrice, formatDate } from '@/lib/utils'

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>
}) {
  const { orderId } = await searchParams

  let order = null
  if (orderId) {
    const supabase = await createClient()
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(quantity, price_at_purchase, products(name))')
      .eq('id', orderId)
      .maybeSingle()
    order = data
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 rounded-full bg-green-tint flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 size={48} className="text-[#2d7a4f]" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold text-ink mb-2">주문이 완료됐어요!</h1>
        <p className="text-ink-4 text-sm mb-8">결제가 성공적으로 처리됐어요.</p>

        {order && (
          <div className="bg-tint rounded-2xl p-5 mb-6 text-left space-y-2">
            <p className="text-xs text-ink-4 mb-3">주문 {order.id.slice(0, 8)}…</p>
            {(order.order_items ?? []).map((item: { products?: { name?: string } | null; quantity: number; price_at_purchase: number }, i: number) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-ink-3">{item.products?.name} × {item.quantity}</span>
                <span className="font-medium text-ink">{formatPrice(item.price_at_purchase * item.quantity)}</span>
              </div>
            ))}
            <div className="pt-2 border-t border-line flex justify-between text-sm font-semibold">
              <span>합계</span>
              <span className="text-[#2d7a4f]">{formatPrice(order.total_price)}</span>
            </div>
          </div>
        )}

        <div className="bg-tint rounded-xl p-4 mb-6 text-sm text-ink-3 text-left space-y-1.5">
          <p>• 주문 확인 후 1~2일 내 발송돼요.</p>
          <p>• 배송 시작 시 카카오톡으로 알림을 드려요.</p>
          <p>• 냉동 상품이니 빠르게 냉동 보관해주세요.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {orderId && (
            <Link
              href={`/my/orders/${orderId}`}
              className="flex-1 flex items-center justify-center gap-2 py-3 border border-line-2 rounded-xl text-sm font-medium text-ink-3 hover:border-[#2d7a4f] hover:text-[#2d7a4f] transition-colors"
            >
              <Package size={15} /> 주문 상세 보기
            </Link>
          )}
          <Link
            href="/products"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#2d7a4f] rounded-xl text-sm font-semibold text-white hover:bg-[#235f3d] transition-colors"
          >
            계속 쇼핑하기 <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  )
}
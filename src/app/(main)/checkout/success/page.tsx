'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Package, ArrowRight, Loader2, XCircle } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

type OrderItem = {
  products?: { name?: string } | null
  quantity: number
  price_at_purchase: number
}

type OrderData = {
  id: string
  total_price: number
  order_items?: OrderItem[]
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 size={40} className="text-[#2d7a4f] animate-spin" />
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  )
}

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const paymentKey = searchParams.get('paymentKey')
  const orderId    = searchParams.get('orderId')
  const amount     = Number(searchParams.get('amount'))

  const [status, setStatus]           = useState<'confirming' | 'success' | 'error'>('confirming')
  const [earnedPoints, setEarnedPoints] = useState(0)
  const [order, setOrder]             = useState<OrderData | null>(null)
  const [errorMsg, setErrorMsg]       = useState('')

  useEffect(() => {
    if (!paymentKey || !orderId || !amount) {
      setErrorMsg('결제 정보가 올바르지 않아요.')
      setStatus('error')
      return
    }

    fetch('/api/payment/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setEarnedPoints(data.earnedPoints ?? 0)
          setStatus('success')
          return fetch(`/api/orders/${orderId}`).then((r) => r.json()).then((d) => {
            if (d.order) setOrder(d.order)
          }).catch(() => {})
        } else {
          setErrorMsg(data.error ?? '결제 승인에 실패했어요.')
          setStatus('error')
        }
      })
      .catch(() => {
        setErrorMsg('네트워크 오류가 발생했어요. 주문 내역을 확인해주세요.')
        setStatus('error')
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (status === 'confirming') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="text-[#2d7a4f] animate-spin mx-auto mb-4" />
          <p className="text-ink-3 text-sm">결제를 확인하는 중이에요…</p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-8">
            <XCircle size={48} className="text-red-400" strokeWidth={1.5} />
          </div>
          <h1 className="text-2xl font-bold text-ink mb-2">결제 확인 실패</h1>
          <p className="text-ink-4 text-sm mb-8">{errorMsg}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/my/orders"
              className="flex-1 flex items-center justify-center gap-2 py-3 border border-line-2 rounded-xl text-sm font-medium text-ink-3 hover:border-[#2d7a4f] hover:text-[#2d7a4f] transition-colors"
            >
              <Package size={15} /> 주문 내역 확인
            </Link>
            <Link
              href="/products"
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#2d7a4f] rounded-xl text-sm font-semibold text-white hover:bg-[#235f3d] transition-colors"
            >
              쇼핑 계속하기 <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 rounded-full bg-green-tint flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 size={48} className="text-[#2d7a4f]" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold text-ink mb-2">주문이 완료됐어요!</h1>
        <p className="text-ink-4 text-sm mb-2">결제가 성공적으로 처리됐어요.</p>
        {earnedPoints > 0 && (
          <p className="text-sm font-semibold text-[#2d7a4f] mb-6">
            🎉 {earnedPoints.toLocaleString()}P 적립 완료!
          </p>
        )}

        {order && (
          <div className="bg-tint rounded-2xl p-5 mb-6 text-left space-y-2">
            <p className="text-xs text-ink-4 mb-3">주문 {order.id.slice(0, 8)}…</p>
            {(order.order_items ?? []).map((item, i) => (
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

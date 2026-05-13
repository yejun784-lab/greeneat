'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Loader2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useCartStore } from '@/lib/cart-store'

function SuccessContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { clearCart } = useCartStore()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [earnedPoints, setEarnedPoints] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  const confirmed = useRef(false)

  const paymentKey = searchParams.get('paymentKey')
  const orderId = searchParams.get('orderId')
  const amount = searchParams.get('amount')

  useEffect(() => {
    if (!paymentKey || !orderId || !amount) {
      setErrorMsg('결제 정보가 올바르지 않습니다.')
      setStatus('error')
      return
    }

    if (confirmed.current) return
    confirmed.current = true

    async function confirmPayment() {
      try {
        const res = await fetch('/api/payment/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentKey,
            orderId,
            amount: Number(amount),
          }),
        })

        const data = await res.json()

        if (!res.ok) {
          setErrorMsg(data.error ?? '결제 승인에 실패했습니다.')
          setStatus('error')
          return
        }

        clearCart()
        setEarnedPoints(data.earnedPoints ?? 0)
        setStatus('success')
      } catch {
        setErrorMsg('네트워크 오류가 발생했습니다.')
        setStatus('error')
      }
    }

    confirmPayment()
  }, [paymentKey, orderId, amount, clearCart])

  if (status === 'loading') {
    return (
      <div className="max-w-lg mx-auto px-4 py-32 text-center">
        <Loader2 size={48} className="mx-auto text-[#2d7a4f] animate-spin mb-4" />
        <p className="text-ink-4 text-sm">결제를 확인하고 있습니다...</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <XCircle size={56} className="mx-auto text-red-400 mb-4" />
        <h2 className="text-2xl font-bold text-ink mb-2">결제 확인 실패</h2>
        <p className="text-ink-4 mb-8">{errorMsg}</p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => router.push('/cart')}>장바구니로</Button>
          <Button variant="secondary" onClick={() => router.push('/my/orders')}>주문 내역</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <CheckCircle size={56} className="mx-auto text-[#2d7a4f] mb-4" />
      <h2 className="text-2xl font-bold text-ink mb-2">주문이 완료되었습니다!</h2>
      <p className="text-ink-4 mb-1">
        주문번호: <span className="font-mono text-sm text-ink">{orderId}</span>
      </p>
      {earnedPoints > 0 && (
        <p className="text-[#2d7a4f] font-medium text-sm mt-2">
          🎉 {earnedPoints.toLocaleString()}P 적립됐어요!
        </p>
      )}
      <p className="text-ink-5 text-sm mt-2 mb-8">배송 준비가 완료되면 알림을 드립니다.</p>
      <div className="flex gap-3 justify-center">
        <Button onClick={() => router.push('/my/orders')}>주문 내역 보기</Button>
        <Button variant="secondary" onClick={() => router.push('/products')}>쇼핑 계속하기</Button>
      </div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="max-w-lg mx-auto px-4 py-32 text-center">
        <Loader2 size={48} className="mx-auto text-[#2d7a4f] animate-spin mb-4" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}

'use client'

import { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { XCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const TOSS_ERROR_MESSAGES: Record<string, string> = {
  PAY_PROCESS_CANCELED: '결제를 취소하셨습니다.',
  PAY_PROCESS_ABORTED: '결제 도중 오류가 발생했습니다.',
  REJECT_CARD_COMPANY: '카드사에서 결제를 거절했습니다.',
  INVALID_STOPPED_CARD: '정지된 카드입니다.',
  EXCEED_MAX_DAILY_PAYMENT_COUNT: '하루 결제 횟수를 초과했습니다.',
  NOT_AVAILABLE_PAYMENT: '현재 사용할 수 없는 결제 수단입니다.',
  INVALID_PASSWORD: '결제 비밀번호가 올바르지 않습니다.',
}

function FailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const code = searchParams.get('code') ?? ''
  const message = searchParams.get('message') ?? '알 수 없는 오류가 발생했습니다.'
  const orderId = searchParams.get('orderId')

  const displayMsg = TOSS_ERROR_MESSAGES[code] ?? decodeURIComponent(message)

  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <XCircle size={56} className="mx-auto text-red-400 mb-4" />
      <h2 className="text-2xl font-bold text-ink mb-2">결제에 실패했습니다</h2>
      <p className="text-ink-4 mb-1">{displayMsg}</p>
      {code && <p className="text-xs text-ink-5 font-mono mb-8">오류 코드: {code}</p>}
      {!code && <div className="mb-8" />}
      <div className="flex gap-3 justify-center">
        <Button onClick={() => router.back()}>다시 시도</Button>
        <Button variant="secondary" onClick={() => router.push('/cart')}>장바구니로</Button>
      </div>
      {orderId && (
        <p className="text-xs text-ink-5 mt-6">
          주문번호: <span className="font-mono">{orderId}</span>
        </p>
      )}
    </div>
  )
}

export default function CheckoutFailPage() {
  return (
    <Suspense fallback={<div className="py-32" />}>
      <FailContent />
    </Suspense>
  )
}

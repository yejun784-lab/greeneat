'use client'

import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { XCircle, RefreshCw, ArrowLeft, MessageCircle } from 'lucide-react'
import { Suspense } from 'react'

const FAIL_REASONS: Record<string, string> = {
  PAY_PROCESS_CANCELED: '결제를 취소하셨어요.',
  PAY_PROCESS_ABORTED: '결제 중 오류가 발생했어요.',
  REJECT_CARD_COMPANY: '카드사에서 결제를 거절했어요.',
  NOT_ENOUGH_BALANCE: '잔액이 부족해요.',
}

function FailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const code    = searchParams.get('code') ?? ''
  const message = searchParams.get('message') ?? ''
  const reason  = FAIL_REASONS[code] ?? (message || '결제 처리 중 문제가 발생했어요.')

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center">
        <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-8">
          <XCircle size={48} className="text-red-400" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold text-ink mb-2">결제에 실패했어요</h1>
        <p className="text-ink-4 text-sm mb-2">{reason}</p>
        {code && <p className="text-ink-5 text-xs mb-8 font-mono">오류 코드: {code}</p>}
        <div className="bg-tint rounded-xl p-4 mb-8 text-sm text-ink-3 text-left space-y-1.5">
          <p>• 카드 정보를 다시 확인해주세요.</p>
          <p>• 잠시 후 다시 시도해도 실패한다면 고객센터로 문의해주세요.</p>
          <p>• 장바구니 상품은 그대로 유지돼요.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => router.back()}
            className="flex-1 flex items-center justify-center gap-2 py-3 border border-line-2 rounded-xl text-sm font-medium text-ink-3 hover:border-[#2d7a4f] hover:text-[#2d7a4f] transition-colors"
          >
            <ArrowLeft size={15} /> 이전으로
          </button>
          <Link
            href="/checkout"
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#2d7a4f] rounded-xl text-sm font-semibold text-white hover:bg-[#235f3d] transition-colors"
          >
            <RefreshCw size={15} /> 다시 결제하기
          </Link>
        </div>
        <a href="mailto:hello@greeneat.kr" className="inline-flex items-center gap-1.5 mt-5 text-xs text-ink-5 hover:text-ink-3 transition-colors">
          <MessageCircle size={12} /> 고객센터 문의
        </a>
      </div>
    </div>
  )
}

export default function CheckoutFailPage() {
  return <Suspense><FailContent /></Suspense>
}
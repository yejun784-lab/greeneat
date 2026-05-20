'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2, AlertTriangle } from 'lucide-react'
import { toast } from '@/lib/toast-store'

export function WithdrawButton() {
  const router = useRouter()
  const [step, setStep]       = useState<'idle' | 'confirm' | 'loading'>('idle')
  const [inputVal, setInputVal] = useState('')

  const CONFIRM_WORD = '탈퇴합니다'

  async function handleWithdraw() {
    if (inputVal !== CONFIRM_WORD) {
      toast.error(`"${CONFIRM_WORD}"를 정확히 입력해주세요.`)
      return
    }
    setStep('loading')
    const res = await fetch('/api/account', { method: 'DELETE' })
    if (res.ok) {
      toast.info('탈퇴가 완료됐어요. 이용해 주셔서 감사합니다.')
      router.push('/')
      router.refresh()
    } else {
      const { error } = await res.json().catch(() => ({ error: '오류' }))
      toast.error(error ?? '탈퇴 처리 중 오류가 발생했어요.')
      setStep('idle')
    }
  }

  if (step === 'idle') {
    return (
      <button
        onClick={() => setStep('confirm')}
        className="text-xs text-ink-5 hover:text-red-400 transition-colors underline underline-offset-2"
      >
        회원 탈퇴
      </button>
    )
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-5 space-y-4">
      <div className="flex items-start gap-3">
        <AlertTriangle size={18} className="text-red-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-red-600 mb-1">정말 탈퇴하시겠어요?</p>
          <ul className="text-xs text-red-400 space-y-0.5">
            <li>• 모든 주문 내역, 포인트, 쿠폰이 삭제돼요</li>
            <li>• 진행 중인 구독이 즉시 해지돼요</li>
            <li>• 이 작업은 되돌릴 수 없어요</li>
          </ul>
        </div>
      </div>

      <div>
        <p className="text-xs text-red-500 mb-1.5">
          확인을 위해 <span className="font-bold">"{CONFIRM_WORD}"</span>를 입력해주세요
        </p>
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={CONFIRM_WORD}
          className="w-full px-3 py-2 border border-red-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-400"
          disabled={step === 'loading'}
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => { setStep('idle'); setInputVal('') }}
          disabled={step === 'loading'}
          className="flex-1 py-2.5 border border-line-2 rounded-xl text-sm font-medium text-ink-3 hover:bg-tint transition-colors"
        >
          취소
        </button>
        <button
          onClick={handleWithdraw}
          disabled={step === 'loading' || inputVal !== CONFIRM_WORD}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-40"
        >
          {step === 'loading'
            ? <><Loader2 size={14} className="animate-spin" /> 처리 중…</>
            : <><Trash2 size={14} /> 탈퇴하기</>
          }
        </button>
      </div>
    </div>
  )
}

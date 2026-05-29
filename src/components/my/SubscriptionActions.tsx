'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/lib/toast-store'
import { Pause, Play, XCircle, SkipForward } from 'lucide-react'

type Props = {
  status: 'active' | 'paused'
  subscriptionId?: string
  nextDeliveryAt?: string | null
}

export function SubscriptionActions({ status, subscriptionId, nextDeliveryAt }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<'pause' | 'resume' | 'cancel' | 'skip' | null>(null)

  const getUser = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return { supabase, user }
  }

  const pause = async () => {
    if (!confirm('구독을 일시 중지하시겠어요?')) return
    setLoading('pause')
    const { supabase, user } = await getUser()
    if (!user) { setLoading(null); return }
    await supabase.from('subscriptions').update({ status: 'paused' }).eq('user_id', user.id).eq('status', 'active')
    toast.info('구독이 일시 중지됐어요.')
    router.refresh()
    setLoading(null)
  }

  const resume = async () => {
    if (!confirm('구독을 재개하시겠어요?')) return
    setLoading('resume')
    const { supabase, user } = await getUser()
    if (!user) { setLoading(null); return }
    await supabase.from('subscriptions').update({ status: 'active' }).eq('user_id', user.id).eq('status', 'paused')
    toast.success('구독이 재개됐어요!')
    router.refresh()
    setLoading(null)
  }

  const cancel = async () => {
    if (!confirm('구독을 해지하시겠어요? 이 작업은 되돌릴 수 없어요.')) return
    setLoading('cancel')
    const { supabase, user } = await getUser()
    if (!user) { setLoading(null); return }
    await supabase.from('subscriptions').update({ status: 'cancelled' }).eq('user_id', user.id).in('status', ['active', 'paused'])
    toast.info('구독이 해지됐어요.')
    router.refresh()
    setLoading(null)
  }

  const skip = async () => {
    if (!subscriptionId) return
    if (!confirm('이번 주 배송을 1주일 미루시겠어요?')) return
    setLoading('skip')
    const { supabase, user } = await getUser()
    if (!user) { setLoading(null); return }

    const base = nextDeliveryAt ? new Date(nextDeliveryAt) : new Date()
    const skipped = new Date(base.getTime() + 7 * 24 * 60 * 60 * 1000)
    const { error } = await supabase
      .from('subscriptions')
      .update({ next_delivery_at: skipped.toISOString() })
      .eq('id', subscriptionId)
      .eq('user_id', user.id)

    if (error) {
      toast.error('스킵 처리 중 오류가 발생했어요.')
    } else {
      const month = skipped.getMonth() + 1
      const day = skipped.getDate()
      toast.success(`이번 주 배송을 스킵했어요. 다음 배송: ${month}월 ${day}일`)
    }
    router.refresh()
    setLoading(null)
  }

  return (
    <div className="flex flex-col gap-2 mt-3">
      {/* 스킵 버튼 (active 상태에서만) */}
      {status === 'active' && subscriptionId && (
        <button
          onClick={skip}
          disabled={loading !== null}
          className="w-full flex items-center justify-center gap-1.5 py-2 text-xs font-medium bg-amber-50 border border-amber-200 rounded-xl text-amber-600 hover:bg-amber-100 transition-colors disabled:opacity-50"
        >
          <SkipForward size={12} />
          {loading === 'skip' ? '처리 중…' : '이번 주 배송 스킵'}
        </button>
      )}

      <div className="flex gap-2">
        {status === 'active' ? (
          <button
            onClick={pause}
            disabled={loading !== null}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium border border-line-2 rounded-xl text-ink-3 hover:border-[#2d7a4f] hover:text-[#2d7a4f] transition-colors disabled:opacity-50"
          >
            <Pause size={12} />
            {loading === 'pause' ? '처리 중…' : '일시 중지'}
          </button>
        ) : (
          <button
            onClick={resume}
            disabled={loading !== null}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium border border-[#2d7a4f]/30 rounded-xl text-[#2d7a4f] hover:bg-green-tint transition-colors disabled:opacity-50"
          >
            <Play size={12} />
            {loading === 'resume' ? '처리 중…' : '구독 재개'}
          </button>
        )}
        <button
          onClick={cancel}
          disabled={loading !== null}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium border border-red-200 rounded-xl text-red-400 hover:bg-red-50 transition-colors disabled:opacity-50"
        >
          <XCircle size={12} />
          {loading === 'cancel' ? '처리 중…' : '구독 해지'}
        </button>
      </div>
    </div>
  )
}

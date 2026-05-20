'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/lib/toast-store'
import { Pause, XCircle } from 'lucide-react'

export function SubscriptionActions() {
  const router = useRouter()
  const [loading, setLoading] = useState<'pause' | 'cancel' | null>(null)

  const pause = async () => {
    if (!confirm('구독을 일시 중지하시겠어요?')) return
    setLoading('pause')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('subscriptions').update({ status: 'paused' }).eq('user_id', user.id).eq('status', 'active')
    toast.info('구독이 일시 중지됐어요.')
    router.refresh()
    setLoading(null)
  }

  const cancel = async () => {
    if (!confirm('구독을 해지하시겠어요? 이 작업은 되돌릴 수 없어요.')) return
    setLoading('cancel')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('subscriptions').update({ status: 'cancelled' }).eq('user_id', user.id).eq('status', 'active')
    toast.info('구독이 해지됐어요.')
    router.refresh()
    setLoading(null)
  }

  return (
    <div className="flex gap-2 mt-3">
      <button
        onClick={pause}
        disabled={loading !== null}
        className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium border border-line-2 rounded-xl text-ink-3 hover:border-[#2d7a4f] hover:text-[#2d7a4f] transition-colors disabled:opacity-50"
      >
        <Pause size={12} />
        {loading === 'pause' ? '처리 중…' : '일시 중지'}
      </button>
      <button
        onClick={cancel}
        disabled={loading !== null}
        className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium border border-red-200 rounded-xl text-red-400 hover:bg-red-50 transition-colors disabled:opacity-50"
      >
        <XCircle size={12} />
        {loading === 'cancel' ? '처리 중…' : '구독 해지'}
      </button>
    </div>
  )
}
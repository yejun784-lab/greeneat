'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PauseCircle, XCircle } from 'lucide-react'

export function SubscriptionActions() {
  const [msg, setMsg] = useState('')

  async function handleAction(newStatus: 'paused' | 'cancelled') {
    const label = newStatus === 'paused' ? '일시정지' : '해지'
    if (!window.confirm(`구독을 ${label}하시겠습니까?`)) return

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setMsg('로그인이 필요합니다.'); return }

    const { error } = await supabase
      .from('subscriptions')
      .update({ status: newStatus })
      .eq('user_id', user.id)
      .eq('status', 'active')

    if (error) {
      setMsg('오류가 발생했습니다.')
    } else {
      setMsg(newStatus === 'paused' ? '구독이 일시정지됐습니다.' : '구독이 해지됐습니다.')
    }
    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <div className="mt-3">
      {msg && <p className="text-xs text-ink-4 mb-2">{msg}</p>}
      <div className="flex gap-2">
        <button
          onClick={() => handleAction('paused')}
          className="flex items-center gap-1.5 text-xs border border-line-2 text-ink-3 px-3 py-1.5 rounded-lg hover:border-[#2d7a4f] hover:text-[#2d7a4f] transition-colors"
        >
          <PauseCircle size={13} />
          일시정지
        </button>
        <button
          onClick={() => handleAction('cancelled')}
          className="flex items-center gap-1.5 text-xs border border-red-200 text-red-400 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
        >
          <XCircle size={13} />
          구독 해지
        </button>
      </div>
    </div>
  )
}

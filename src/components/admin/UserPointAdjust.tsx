'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Coins, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/lib/toast-store'

interface Props {
  userId: string
  userName: string
  currentBalance: number
}

export function UserPointAdjust({ userId, userName, currentBalance }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const v = parseInt(amount, 10)
    if (isNaN(v) || v === 0) { toast.error('포인트 금액을 입력하세요.'); return }
    if (!reason.trim()) { toast.error('사유를 입력하세요.'); return }

    const newBalance = currentBalance + v
    if (newBalance < 0) { toast.error(`포인트가 부족합니다. 최대 -${currentBalance}P까지 가능합니다.`); return }

    setSaving(true)
    const supabase = createClient()
    const { error } = await supabase.rpc('adjust_user_points', {
      p_user_id: userId,
      p_amount: v,
      p_reason: reason.trim(),
    })

    if (error) {
      // RPC가 없으면 직접 처리
      const [r1, r2] = await Promise.all([
        supabase.from('points').insert({ user_id: userId, amount: v, reason: reason.trim() }),
        supabase.from('profiles').update({ point_balance: newBalance }).eq('id', userId),
      ])
      if (r1.error || r2.error) {
        toast.error('포인트 조정에 실패했습니다.')
        setSaving(false)
        return
      }
    }

    toast.success(`${userName}님 포인트 ${v > 0 ? '+' : ''}${v.toLocaleString()}P 조정 완료`)
    setOpen(false)
    setAmount('')
    setReason('')
    router.refresh()
    setSaving(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-1.5 text-ink-5 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
        title="포인트 조정"
      >
        <Coins size={14} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={() => setOpen(false)}>
          <div className="bg-surface rounded-2xl border border-line p-6 w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-ink text-base mb-1">포인트 조정</h3>
            <p className="text-sm text-ink-4 mb-4">
              {userName}님 · 현재 <span className="font-semibold text-[#2d7a4f]">{currentBalance.toLocaleString()}P</span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm text-ink-3 mb-1">조정 금액 (음수 입력 시 차감)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="예: 1000 또는 -500"
                  className="w-full px-3 py-2.5 border border-line-2 rounded-lg text-sm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f]"
                  required
                />
                {amount && !isNaN(parseInt(amount)) && (
                  <p className="text-xs text-ink-5 mt-1">
                    조정 후: <span className={`font-semibold ${currentBalance + parseInt(amount) < 0 ? 'text-red-500' : 'text-[#2d7a4f]'}`}>
                      {(currentBalance + parseInt(amount)).toLocaleString()}P
                    </span>
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm text-ink-3 mb-1">사유</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="예: 이벤트 지급, 운영 조정"
                  className="w-full px-3 py-2.5 border border-line-2 rounded-lg text-sm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f]"
                  required
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 border border-line-2 rounded-xl text-sm text-ink-2 hover:bg-wash">취소</button>
                <button type="submit" disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-[#2d7a4f] text-white rounded-xl text-sm font-medium hover:bg-[#235f3d] disabled:opacity-50">
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {saving ? '처리 중...' : '적용'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

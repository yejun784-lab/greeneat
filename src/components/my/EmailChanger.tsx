'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/lib/toast-store'
import { Mail } from 'lucide-react'

interface Props {
  currentEmail: string
  /** 'email' 외(카카오/구글)는 이메일이 OAuth에 묶여 있어 숨김 */
  provider: string
}

export function EmailChanger({ currentEmail, provider }: Props) {
  const [open, setOpen] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  if (provider !== 'email') return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const email = newEmail.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('올바른 이메일 형식이 아니에요.'); return }
    if (email === currentEmail.toLowerCase()) { setError('현재 이메일과 동일해요.'); return }

    setLoading(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ email })
    setLoading(false)

    if (updateError) {
      setError(updateError.message.includes('already')
        ? '이미 사용 중인 이메일이에요.'
        : '변경 요청에 실패했어요. 잠시 후 다시 시도해 주세요.')
      return
    }

    setSent(true)
    toast.success('확인 메일을 보냈어요 📧')
  }

  return (
    <div className="bg-surface rounded-2xl border border-line p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mail size={15} className="text-[#2d7a4f]" />
          <div>
            <p className="text-sm font-semibold text-ink">이메일 변경</p>
            <p className="text-xs text-ink-5 mt-0.5">{currentEmail}</p>
          </div>
        </div>
        <button
          onClick={() => { setOpen(v => !v); setError(null); setSent(false) }}
          className="text-xs font-medium text-primary border border-primary/30 px-3 py-1.5 rounded-full hover:bg-green-tint transition-colors"
        >
          {open ? '닫기' : '변경하기'}
        </button>
      </div>

      {open && (
        sent ? (
          <div className="mt-4 bg-green-tint rounded-xl px-4 py-3 animate-fade-up">
            <p className="text-sm font-semibold text-[#2d7a4f]">확인 메일을 보냈어요</p>
            <p className="text-xs text-ink-4 mt-1">
              새 이메일({newEmail})의 받은편지함에서 확인 링크를 누르면 변경이 완료돼요.
              기존 이메일에도 확인 메일이 갈 수 있어요.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3 animate-fade-up">
            <input
              type="email"
              value={newEmail}
              onChange={e => setNewEmail(e.target.value)}
              placeholder="새 이메일 주소"
              required
              autoComplete="email"
              className="w-full px-3.5 py-2.5 text-sm bg-tint border border-line-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-ink placeholder:text-ink-5"
            />
            {error && (
              <p className="text-xs text-red-500 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-xl">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#2d7a4f] text-white rounded-xl text-sm font-semibold hover:bg-[#235f3d] transition-colors disabled:opacity-50"
            >
              {loading ? '요청 중...' : '확인 메일 보내기'}
            </button>
            <p className="text-[11px] text-ink-5">새 이메일로 확인 링크가 발송되고, 링크를 누르면 변경이 완료돼요.</p>
          </form>
        )
      )}
    </div>
  )
}

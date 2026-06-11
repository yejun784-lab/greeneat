'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/lib/toast-store'
import { KeyRound, Eye, EyeOff } from 'lucide-react'

interface Props {
  email: string
  /** auth provider — 'email' 외(카카오/구글)는 비밀번호가 없으므로 숨김 */
  provider: string
}

export function PasswordChanger({ email, provider }: Props) {
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (provider !== 'email') return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (next.length < 8) { setError('새 비밀번호는 8자 이상이어야 해요.'); return }
    if (next !== confirm) { setError('새 비밀번호가 일치하지 않아요.'); return }
    if (next === current) { setError('현재 비밀번호와 다른 비밀번호를 사용해 주세요.'); return }

    setLoading(true)
    const supabase = createClient()

    // 현재 비밀번호 재인증으로 검증
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: current,
    })
    if (signInError) {
      setError('현재 비밀번호가 올바르지 않아요.')
      setLoading(false)
      return
    }

    const { error: updateError } = await supabase.auth.updateUser({ password: next })
    setLoading(false)

    if (updateError) {
      setError(updateError.message.includes('different')
        ? '이전과 다른 비밀번호를 사용해 주세요.'
        : '비밀번호 변경에 실패했어요. 잠시 후 다시 시도해 주세요.')
      return
    }

    toast.success('비밀번호가 변경되었어요 🔒')
    setOpen(false)
    setCurrent(''); setNext(''); setConfirm('')
  }

  return (
    <div className="bg-surface rounded-2xl border border-line p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <KeyRound size={15} className="text-[#2d7a4f]" />
          <p className="text-sm font-semibold text-ink">비밀번호 변경</p>
        </div>
        <button
          onClick={() => { setOpen(v => !v); setError(null) }}
          className="text-xs font-medium text-primary border border-primary/30 px-3 py-1.5 rounded-full hover:bg-green-tint transition-colors"
        >
          {open ? '닫기' : '변경하기'}
        </button>
      </div>

      {open && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3 animate-fade-up">
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              value={current}
              onChange={e => setCurrent(e.target.value)}
              placeholder="현재 비밀번호"
              required
              autoComplete="current-password"
              className="w-full px-3.5 py-2.5 text-sm bg-tint border border-line-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-ink placeholder:text-ink-5"
            />
            <button
              type="button"
              onClick={() => setShow(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-5 hover:text-ink-3"
              aria-label={show ? '비밀번호 숨기기' : '비밀번호 표시'}
            >
              {show ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          <input
            type={show ? 'text' : 'password'}
            value={next}
            onChange={e => setNext(e.target.value)}
            placeholder="새 비밀번호 (8자 이상)"
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full px-3.5 py-2.5 text-sm bg-tint border border-line-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-ink placeholder:text-ink-5"
          />
          <input
            type={show ? 'text' : 'password'}
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            placeholder="새 비밀번호 확인"
            required
            autoComplete="new-password"
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
            {loading ? '변경 중...' : '비밀번호 변경'}
          </button>
        </form>
      )}
    </div>
  )
}

'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { CheckCircle } from 'lucide-react'

// 1단계: 이메일 입력 → 재설정 링크 발송
function RequestForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password?step=update`,
    })
    if (error) {
      setError('이메일 발송에 실패했습니다. 다시 시도해주세요.')
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="text-center">
        <CheckCircle size={48} className="mx-auto text-[#2d7a4f] mb-4" />
        <h2 className="text-lg font-bold text-ink mb-2">이메일을 확인해주세요</h2>
        <p className="text-sm text-ink-4 mb-6">
          <span className="font-medium text-ink">{email}</span>로<br />
          비밀번호 재설정 링크를 보냈습니다.
        </p>
        <Link href="/login" className="text-sm text-[#2d7a4f] hover:underline">
          로그인으로 돌아가기
        </Link>
      </div>
    )
  }

  return (
    <>
      <h1 className="text-xl font-bold text-ink text-center mb-2">비밀번호 재설정</h1>
      <p className="text-sm text-ink-4 text-center mb-6">
        가입한 이메일을 입력하면 재설정 링크를 보내드려요.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink-2 mb-1">이메일</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@greeneat.kr"
            required
            className="w-full px-3 py-2.5 border border-line-2 rounded-lg text-sm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f] focus:border-transparent"
          />
        </div>
        {error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/30 px-3 py-2 rounded-lg">{error}</p>}
        <Button type="submit" size="lg" className="w-full" loading={loading}>
          재설정 링크 받기
        </Button>
      </form>
      <p className="text-center text-sm text-ink-4 mt-4">
        <Link href="/login" className="text-[#2d7a4f] font-medium hover:underline">
          ← 로그인으로 돌아가기
        </Link>
      </p>
    </>
  )
}

// 2단계: 새 비밀번호 입력 (이메일 링크 클릭 후)
function UpdateForm() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }
    if (password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.')
      return
    }
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })
    if (error) {
      setError('비밀번호 변경에 실패했습니다. 링크가 만료됐을 수 있어요.')
    } else {
      setDone(true)
      setTimeout(() => router.push('/'), 2000)
    }
    setLoading(false)
  }

  if (done) {
    return (
      <div className="text-center">
        <CheckCircle size={48} className="mx-auto text-[#2d7a4f] mb-4" />
        <h2 className="text-lg font-bold text-ink mb-2">비밀번호가 변경됐습니다!</h2>
        <p className="text-sm text-ink-4">잠시 후 메인 페이지로 이동합니다...</p>
      </div>
    )
  }

  return (
    <>
      <h1 className="text-xl font-bold text-ink text-center mb-6">새 비밀번호 설정</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink-2 mb-1">새 비밀번호</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="8자 이상"
            minLength={8}
            required
            className="w-full px-3 py-2.5 border border-line-2 rounded-lg text-sm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-2 mb-1">비밀번호 확인</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="비밀번호 재입력"
            required
            className="w-full px-3 py-2.5 border border-line-2 rounded-lg text-sm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f] focus:border-transparent"
          />
        </div>
        {error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/30 px-3 py-2 rounded-lg">{error}</p>}
        <Button type="submit" size="lg" className="w-full" loading={loading}>
          비밀번호 변경하기
        </Button>
      </form>
    </>
  )
}

function ResetPasswordInner() {
  const searchParams = useSearchParams()
  const step = searchParams.get('step')

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm bg-surface rounded-2xl shadow-sm border border-line p-8">
        <Link href="/" className="block text-center text-2xl font-bold text-[#2d7a4f] mb-6">
          GreenEat
        </Link>
        {step === 'update' ? <UpdateForm /> : <RequestForm />}
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordInner />
    </Suspense>
  )
}

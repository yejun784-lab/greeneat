'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { usePushSubscribe } from '@/components/providers/PWAProvider'

function KakaoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 0.5C4.306 0.5 0.5 3.468 0.5 7.1c0 2.29 1.52 4.303 3.82 5.44L3.1 15.7a.35.35 0 00.51.39l4.06-2.7A10.2 10.2 0 009 13.7c4.694 0 8.5-2.968 8.5-6.6S13.694.5 9 .5z"
        fill="currentColor"
      />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const subscribePush = usePushSubscribe()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('이메일 또는 비밀번호를 확인해주세요.')
      setLoading(false)
      return
    }

    subscribePush()
    router.push('/')
    router.refresh()
  }

  async function handleOAuth(provider: 'kakao' | 'google') {
    setOauthLoading(provider)
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        ...(provider === 'kakao' && {
          queryParams: { scope: 'profile_nickname profile_image' },
        }),
      },
    })
    setOauthLoading(null)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f0e8] px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <Link href="/" className="block text-center text-2xl font-bold text-[#2d7a4f] mb-6">
          GreenEat
        </Link>
        <h1 className="text-xl font-bold text-gray-900 text-center mb-6">로그인</h1>

        {/* 소셜 로그인 */}
        <div className="space-y-2 mb-5">
          <button
            type="button"
            onClick={() => handleOAuth('kakao')}
            disabled={!!oauthLoading}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl text-sm font-medium bg-[#FEE500] text-[#3C1E1E] hover:bg-[#f0d800] transition-colors disabled:opacity-60"
          >
            <KakaoIcon />
            {oauthLoading === 'kakao' ? '연결 중...' : '카카오로 로그인'}
          </button>
          <button
            type="button"
            onClick={() => handleOAuth('google')}
            disabled={!!oauthLoading}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-60"
          >
            <GoogleIcon />
            {oauthLoading === 'google' ? '연결 중...' : 'Google로 로그인'}
          </button>
        </div>

        {/* 구분선 */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">또는</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@greeneat.kr"
              required
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d7a4f] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2d7a4f] focus:border-transparent"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <Button type="submit" size="lg" className="w-full" loading={loading}>
            로그인
          </Button>
        </form>

        <p className="text-center mt-3">
          <Link href="/reset-password" className="text-xs text-gray-400 hover:text-gray-600 hover:underline">
            비밀번호를 잊으셨나요?
          </Link>
        </p>

        <p className="text-center text-sm text-gray-500 mt-3">
          아직 회원이 아니신가요?{' '}
          <Link href="/signup" className="text-[#2d7a4f] font-medium hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  )
}

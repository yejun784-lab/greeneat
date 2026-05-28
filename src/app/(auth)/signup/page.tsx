'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { translateAuthError } from '@/lib/utils'

function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nutritionGoal, setNutritionGoal] = useState('balanced')
  const [refCode, setRefCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const ref = searchParams.get('ref')
    if (ref) setRefCode(ref.toUpperCase())
  }, [searchParams])

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()

    let referrerId: string | null = null
    if (refCode.trim()) {
      const { data: refProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('referral_code', refCode.trim().toUpperCase())
        .maybeSingle()
      if (!refProfile) {
        setError('유효하지 않은 초대 코드예요.')
        setLoading(false)
        return
      }
      referrerId = refProfile.id
    }

    const { error: signupError, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          nutrition_goal: nutritionGoal,
          referred_by: referrerId,
        },
      },
    })

    if (signupError) {
      setError(translateAuthError(signupError.message))
      setLoading(false)
      return
    }

    if (data.user) {
      // 웰컴 쿠폰 + 포인트 지급 (이메일 가입)
      const { data: welcomeCoupon } = await supabase
        .from('coupons')
        .select('id')
        .eq('code', 'WELCOME10')
        .eq('is_active', true)
        .maybeSingle()
      if (welcomeCoupon) {
        try {
          await supabase.from('user_coupons').insert({ user_id: data.user.id, coupon_id: welcomeCoupon.id })
        } catch { /* 중복 무시 */ }
      }
      await supabase.from('points').insert({ user_id: data.user.id, amount: 1000, reason: '신규 가입 웰컴 포인트' })
    }

    if (referrerId && data.user) {
      // points 테이블 기록 + point_balance 원자적 증가 (RPC로 read-modify-write 경합 방지)
      await supabase.from('points').insert([
        { user_id: referrerId, amount: 2000, reason: '친구 초대 보상' },
        { user_id: data.user.id, amount: 1000, reason: '초대 코드 사용' },
      ])
      await Promise.all([
        supabase.rpc('increment_points', { uid: referrerId, amount: 2000 }),
        supabase.rpc('increment_points', { uid: data.user.id, amount: 1000 }),
      ])
    }

    setDone(true)
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream px-4">
        <div className="w-full max-w-sm bg-surface rounded-2xl shadow-sm p-8 text-center">
          <div className="text-4xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-ink mb-2">가입 완료!</h2>
          <p className="text-ink-4 text-sm mb-6">
            인증 이메일을 확인해 주세요.<br />
            이메일 인증 후 로그인할 수 있습니다.
          </p>
          <Link href="/login">
            <Button className="w-full">로그인하기</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm bg-surface rounded-2xl shadow-sm border border-line p-8">
        <Link href="/" className="block text-center text-2xl font-bold text-[#2d7a4f] mb-6">
          GreenEat
        </Link>
        <h1 className="text-xl font-bold text-ink text-center mb-6">회원가입</h1>

        {/* 소셜 로그인 */}
        <div className="space-y-2 mb-5">
          <button
            type="button"
            onClick={async () => {
              const supabase = createClient()
              await supabase.auth.signInWithOAuth({ provider: 'kakao', options: { redirectTo: `${window.location.origin}/auth/callback` } })
            }}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl text-sm font-medium bg-[#FEE500] text-[#3C1E1E] hover:bg-[#f0d800] transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M9 0.5C4.306 0.5 0.5 3.468 0.5 7.1c0 2.29 1.52 4.303 3.82 5.44L3.1 15.7a.35.35 0 00.51.39l4.06-2.7A10.2 10.2 0 009 13.7c4.694 0 8.5-2.968 8.5-6.6S13.694.5 9 .5z" fill="currentColor"/></svg>
            카카오로 시작하기
          </button>
          <button
            type="button"
            onClick={async () => {
              const supabase = createClient()
              await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/auth/callback` } })
            }}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl text-sm font-medium bg-surface border border-line-2 text-ink hover:bg-wash transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
            Google로 시작하기
          </button>
        </div>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex-1 h-px bg-line-2" />
          <span className="text-xs text-ink-5">또는 이메일로 가입</span>
          <div className="flex-1 h-px bg-line-2" />
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-2 mb-1">이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="홍길동"
              required
              className="w-full px-3 py-2.5 border border-line-2 rounded-lg text-sm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f] focus:border-transparent"
            />
          </div>
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
          <div>
            <label className="block text-sm font-medium text-ink-2 mb-1">비밀번호</label>
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

          {/* 식단 목표 */}
          <div>
            <label className="block text-sm font-medium text-ink-2 mb-2">식단 목표</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'diet', label: '다이어트', emoji: '🥗' },
                { value: 'balanced', label: '균형식', emoji: '⚖️' },
                { value: 'muscle', label: '근육 증가', emoji: '💪' },
              ].map((goal) => (
                <button
                  key={goal.value}
                  type="button"
                  onClick={() => setNutritionGoal(goal.value)}
                  className={`flex flex-col items-center py-2.5 rounded-xl border-2 text-sm transition-colors ${
                    nutritionGoal === goal.value
                      ? 'border-[#2d7a4f] bg-green-tint text-[#2d7a4f] font-medium'
                      : 'border-line-2 text-ink-3'
                  }`}
                >
                  <span className="text-lg mb-0.5">{goal.emoji}</span>
                  {goal.label}
                </button>
              ))}
            </div>
          </div>

          {/* 초대 코드 */}
          <div>
            <label className="block text-sm font-medium text-ink-2 mb-1">
              초대 코드 <span className="text-ink-5 font-normal">(선택)</span>
            </label>
            <input
              type="text"
              value={refCode}
              onChange={(e) => setRefCode(e.target.value.toUpperCase())}
              placeholder="친구 초대 코드 입력 시 1,000P 지급"
              maxLength={8}
              className="w-full px-3 py-2.5 border border-line-2 rounded-lg text-sm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f] focus:border-transparent font-mono"
            />
            {refCode && (
              <p className="text-xs text-[#2d7a4f] mt-1">🎁 가입 완료 시 1,000P가 지급됩니다!</p>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}

          <Button type="submit" size="lg" className="w-full" loading={loading}>
            회원가입
          </Button>
        </form>

        <p className="text-center text-sm text-ink-4 mt-4">
          이미 회원이신가요?{' '}
          <Link href="/login" className="text-[#2d7a4f] font-medium hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  )
}

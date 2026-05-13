'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Ticket } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/lib/toast-store'

export function CouponRegister({ userId }: { userId: string }) {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRegister() {
    const trimmed = code.trim().toUpperCase()
    if (!trimmed) return

    setLoading(true)
    const supabase = createClient()

    // 쿠폰 존재 확인
    const { data: coupon, error: couponErr } = await supabase
      .from('coupons')
      .select('id, is_active, expires_at')
      .eq('code', trimmed)
      .maybeSingle()

    if (couponErr || !coupon) {
      toast.error('존재하지 않는 쿠폰 코드입니다.')
      setLoading(false)
      return
    }

    if (!coupon.is_active) {
      toast.error('사용할 수 없는 쿠폰입니다.')
      setLoading(false)
      return
    }

    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      toast.error('만료된 쿠폰입니다.')
      setLoading(false)
      return
    }

    // 이미 등록 여부 확인
    const { data: existing } = await supabase
      .from('user_coupons')
      .select('id')
      .eq('user_id', userId)
      .eq('coupon_id', coupon.id)
      .maybeSingle()

    if (existing) {
      toast.error('이미 등록된 쿠폰입니다.')
      setLoading(false)
      return
    }

    // 등록
    const { error } = await supabase
      .from('user_coupons')
      .insert({ user_id: userId, coupon_id: coupon.id })

    if (error) {
      toast.error('쿠폰 등록 중 오류가 발생했습니다.')
    } else {
      toast.success('🎉 쿠폰이 등록되었습니다!')
      setCode('')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="bg-surface border border-line-2 rounded-2xl p-4 mb-6">
      <p className="text-sm font-medium text-ink mb-3 flex items-center gap-2">
        <Ticket size={15} className="text-[#2d7a4f]" />
        쿠폰 코드 등록
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
          placeholder="쿠폰 코드 입력"
          className="flex-1 bg-surface text-ink border border-line-2 rounded-xl px-4 py-2.5 text-sm font-mono tracking-wider placeholder:text-ink-5 focus:outline-none focus:border-[#2d7a4f] transition-colors"
        />
        <button
          onClick={handleRegister}
          disabled={loading || !code.trim()}
          className="px-4 py-2.5 bg-[#2d7a4f] text-white text-sm font-medium rounded-xl disabled:opacity-40 transition-opacity hover:bg-[#235f3d]"
        >
          {loading ? '확인 중...' : '등록'}
        </button>
      </div>
    </div>
  )
}

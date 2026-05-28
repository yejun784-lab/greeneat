import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { CouponRegister } from '@/components/my/CouponRegister'
import { formatDate } from '@/lib/utils'

type UserCoupon = {
  id: string
  used_at: string | null
  created_at: string
  coupons: {
    id: string
    code: string
    description: string
    discount_type: 'percent' | 'fixed'
    discount_value: number
    min_order_amount: number
    expires_at: string | null
  }
}

function discountLabel(type: 'percent' | 'fixed', value: number) {
  if (type === 'percent') return `${value}% 할인`
  return `${value.toLocaleString()}원 할인`
}

function isExpired(expiresAt: string | null) {
  if (!expiresAt) return false
  return new Date(expiresAt) < new Date()
}

export default async function CouponsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('user_coupons')
    .select('*, coupons(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const coupons = (data ?? []).filter((c) => c.coupons != null) as UserCoupon[]
  const available = coupons.filter((c) => !c.used_at && !isExpired(c.coupons.expires_at))
  const unavailable = coupons.filter((c) => c.used_at || isExpired(c.coupons.expires_at))

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        href="/my"
        className="flex items-center gap-1 text-sm text-ink-4 hover:text-ink-2 mb-6"
      >
        <ChevronLeft size={16} />
        마이페이지
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-ink">쿠폰함</h1>
        <span className="text-sm text-ink-4">
          사용 가능 <span className="font-bold text-[#2d7a4f]">{available.length}</span>장
        </span>
      </div>

      {/* 쿠폰 등록 */}
      <CouponRegister userId={user.id} />

      {/* 사용 가능 쿠폰 */}
      {available.length > 0 && (
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-ink-3 mb-3">사용 가능한 쿠폰</h2>
          <div className="space-y-3">
            {available.map((uc) => (
              <CouponCard key={uc.id} uc={uc} disabled={false} />
            ))}
          </div>
        </div>
      )}

      {/* 사용/만료 쿠폰 */}
      {unavailable.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-ink-3 mb-3">사용 완료 / 만료된 쿠폰</h2>
          <div className="space-y-3 opacity-50">
            {unavailable.map((uc) => (
              <CouponCard key={uc.id} uc={uc} disabled />
            ))}
          </div>
        </div>
      )}

      {coupons.length === 0 && (
        <div className="text-center py-16 bg-surface rounded-2xl border border-line">
          <p className="text-3xl mb-3">🎟️</p>
          <p className="text-sm text-ink-5">보유한 쿠폰이 없습니다.</p>
          <p className="text-xs text-ink-5 mt-1">쿠폰 코드를 입력해 쿠폰을 등록해보세요.</p>
        </div>
      )}
    </div>
  )
}

function CouponCard({ uc, disabled }: { uc: UserCoupon; disabled: boolean }) {
  const { coupons: c } = uc
  const expired = isExpired(c.expires_at)

  return (
    <div className={`relative bg-surface border rounded-2xl overflow-hidden ${
      disabled ? 'border-line' : 'border-[#2d7a4f]/30'
    }`}>
      {/* 왼쪽 색 띠 */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${disabled ? 'bg-ink-5' : 'bg-[#2d7a4f]'}`} />

      <div className="pl-5 pr-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className={`text-xl font-bold ${disabled ? 'text-ink-4' : 'text-[#2d7a4f]'}`}>
              {discountLabel(c.discount_type, c.discount_value)}
            </p>
            <p className="text-sm text-ink-2 font-medium mt-0.5">{c.description}</p>
            <p className="text-xs text-ink-5 mt-1">
              {c.min_order_amount > 0 && `${c.min_order_amount.toLocaleString()}원 이상 주문 시 `}
              {c.expires_at
                ? expired
                  ? `${formatDate(c.expires_at)} 만료됨`
                  : `${formatDate(c.expires_at)} 까지`
                : '기간 무제한'}
            </p>
          </div>
          <div className="flex-shrink-0 text-right">
            {uc.used_at ? (
              <span className="text-xs bg-tint text-ink-4 px-2.5 py-1 rounded-full font-medium">사용 완료</span>
            ) : expired ? (
              <span className="text-xs bg-tint text-ink-4 px-2.5 py-1 rounded-full font-medium">기간 만료</span>
            ) : (
              <span className="text-xs bg-green-tint text-[#2d7a4f] px-2.5 py-1 rounded-full font-medium">사용 가능</span>
            )}
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-dashed border-line-2">
          <span className="text-xs font-mono text-ink-4 tracking-wider">{c.code}</span>
        </div>
      </div>
    </div>
  )
}

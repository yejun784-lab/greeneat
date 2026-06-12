import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ChevronLeft, Check } from 'lucide-react'

export const metadata = { title: '멤버십 등급 안내 — GreenEat' }

const TIERS = [
  {
    name: 'Bronze', emoji: '🥉', min: 0, max: 50000,
    color: 'text-amber-700', bg: 'bg-amber-50 dark:bg-amber-950/30', bar: 'bg-amber-500',
    benefits: ['출석체크 매일 50P', '리뷰 작성 200P · 포토리뷰 +100P', '생일 축하 쿠폰'],
  },
  {
    name: 'Silver', emoji: '🥈', min: 50000, max: 150000,
    color: 'text-slate-500', bg: 'bg-slate-50 dark:bg-slate-900/40', bar: 'bg-slate-400',
    benefits: ['Bronze 혜택 전부', '월 1회 3,000원 쿠폰', '신상품 우선 알림'],
  },
  {
    name: 'Gold', emoji: '🥇', min: 150000, max: 300000,
    color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-950/30', bar: 'bg-yellow-400',
    benefits: ['Silver 혜택 전부', '월 1회 5,000원 쿠폰', '타임세일 사전 공개', '무료배송 기준 1만원 완화'],
  },
  {
    name: 'VIP', emoji: '👑', min: 300000, max: Infinity,
    color: 'text-[#2d7a4f]', bg: 'bg-green-tint', bar: 'bg-[#2d7a4f]',
    benefits: ['Gold 혜택 전부', '월 1회 10,000원 쿠폰', '전 주문 무료배송', '신메뉴 시식단 우선 초대'],
  },
]

export default async function MembershipPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: paidOrders } = await supabase
    .from('orders')
    .select('total_price')
    .eq('user_id', user.id)
    .eq('payment_status', 'paid')
  const total = (paidOrders ?? []).reduce((s, o) => s + (o.total_price ?? 0), 0)

  const currentIdx = TIERS.findIndex(t => total >= t.min && total < t.max)
  const current = TIERS[currentIdx === -1 ? 0 : currentIdx]
  const next = TIERS[TIERS.indexOf(current) + 1]

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-2 mb-8">
        <Link href="/my" className="p-1 text-ink-5 hover:text-ink-2">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-ink">멤버십 등급 안내</h1>
      </div>

      {/* 내 현황 */}
      <div className={`rounded-2xl border border-line p-5 mb-6 ${current.bg}`}>
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="text-xs text-ink-4">내 등급</p>
            <p className={`text-2xl font-bold ${current.color}`}>{current.emoji} {current.name}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-ink-4">누적 구매</p>
            <p className="text-lg font-bold text-ink">{total.toLocaleString()}원</p>
          </div>
        </div>
        {next ? (
          <>
            <div className="w-full bg-white/60 dark:bg-black/20 rounded-full h-2 mb-1.5">
              <div
                className={`${current.bar} h-2 rounded-full transition-all`}
                style={{ width: `${Math.min(100, ((total - current.min) / (next.min - current.min)) * 100)}%` }}
              />
            </div>
            <p className="text-xs text-ink-4">
              {next.emoji} {next.name}까지 <span className="font-semibold text-ink-2">{(next.min - total).toLocaleString()}원</span> 남았어요
            </p>
          </>
        ) : (
          <p className="text-xs font-semibold text-[#2d7a4f]">최고 등급이에요! 👑</p>
        )}
      </div>

      {/* 등급별 혜택 */}
      <div className="space-y-3">
        {TIERS.map(tier => {
          const isCurrent = tier.name === current.name
          return (
            <div
              key={tier.name}
              className={`rounded-2xl border p-5 transition-colors ${
                isCurrent ? 'border-[#2d7a4f]/40 bg-surface shadow-sm' : 'border-line bg-surface'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{tier.emoji}</span>
                  <span className={`font-bold ${tier.color}`}>{tier.name}</span>
                  {isCurrent && (
                    <span className="text-[10px] font-bold bg-[#2d7a4f] text-white px-2 py-0.5 rounded-full">내 등급</span>
                  )}
                </div>
                <span className="text-xs text-ink-5">
                  {tier.max === Infinity
                    ? `${(tier.min / 10000).toLocaleString()}만원 이상`
                    : tier.min === 0
                    ? `${(tier.max / 10000).toLocaleString()}만원 미만`
                    : `${(tier.min / 10000).toLocaleString()}만 ~ ${(tier.max / 10000).toLocaleString()}만원`}
                </span>
              </div>
              <ul className="space-y-1.5">
                {tier.benefits.map(b => (
                  <li key={b} className="flex items-start gap-2 text-sm text-ink-3">
                    <Check size={13} className={`mt-0.5 shrink-0 ${tier.color}`} />
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      <p className="text-[11px] text-ink-5 mt-6 leading-relaxed">
        · 등급은 누적 결제 금액(결제 완료 기준) 기준으로 산정되며 실시간 반영돼요.<br />
        · 일부 혜택은 순차적으로 제공될 예정이에요.
      </p>
    </div>
  )
}

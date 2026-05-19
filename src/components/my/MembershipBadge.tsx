import { Trophy } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

const TIERS = [
  { label: 'Bronze', emoji: '🥉', color: 'text-orange-700', bg: 'bg-orange-50',   min: 0,       max: 50000  },
  { label: 'Silver', emoji: '🥈', color: 'text-slate-500',  bg: 'bg-slate-50',    min: 50000,   max: 150000 },
  { label: 'Gold',   emoji: '🥇', color: 'text-yellow-600', bg: 'bg-yellow-50',   min: 150000,  max: 300000 },
  { label: 'VIP',    emoji: '👑', color: 'text-[#2d7a4f]',  bg: 'bg-green-tint',  min: 300000,  max: null   },
]

interface Props {
  totalOrderAmount: number
}

export function MembershipBadge({ totalOrderAmount }: Props) {
  const tierIdx = TIERS.findIndex((t) => t.max === null || totalOrderAmount < t.max)
  const tier = TIERS[tierIdx < 0 ? TIERS.length - 1 : tierIdx]
  const isVip = tier.max === null
  const progress = isVip ? 100 : Math.min(100, ((totalOrderAmount - tier.min) / (tier.max! - tier.min)) * 100)
  const remaining = isVip ? 0 : tier.max! - totalOrderAmount

  return (
    <div className="bg-surface rounded-2xl border border-line p-5">
      <div className="flex items-center gap-2 mb-4">
        <Trophy size={16} className="text-[#2d7a4f]" />
        <h2 className="font-semibold text-ink">멤버십 등급</h2>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-12 h-12 rounded-xl ${tier.bg} flex items-center justify-center text-2xl`}>
          {tier.emoji}
        </div>
        <div>
          <p className={`text-lg font-bold ${tier.color}`}>{tier.label}</p>
          <p className="text-xs text-ink-5">누적 {formatPrice(totalOrderAmount)} 결제</p>
        </div>
      </div>
      {!isVip && (
        <>
          <div className="w-full bg-line-2 rounded-full h-2 mb-1.5">
            <div
              className="bg-[#2d7a4f] h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-ink-5">
            다음 등급까지 <span className="font-semibold text-ink">{formatPrice(remaining)}</span> 더 필요해요
          </p>
        </>
      )}
      {isVip && (
        <p className="text-xs text-[#2d7a4f] font-medium">최고 등급 회원입니다 🎉</p>
      )}
    </div>
  )
}

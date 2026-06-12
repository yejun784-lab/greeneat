import Link from 'next/link'

const TIERS = [
  { name: 'Bronze', min: 0,      max: 50000,   color: 'text-amber-700',  bg: 'bg-amber-50 dark:bg-amber-950/40',   bar: 'bg-amber-500'  },
  { name: 'Silver', min: 50000,  max: 150000,  color: 'text-slate-500',  bg: 'bg-slate-50 dark:bg-slate-900/40',   bar: 'bg-slate-400'  },
  { name: 'Gold',   min: 150000, max: 300000,  color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-950/40',  bar: 'bg-yellow-400' },
  { name: 'VIP',    min: 300000, max: Infinity, color: 'text-[#2d7a4f]', bg: 'bg-green-tint', bar: 'bg-[#2d7a4f]'  },
]

interface Props { totalOrderAmount: number }

export function MembershipBadge({ totalOrderAmount }: Props) {
  const tier = TIERS.find((t) => totalOrderAmount >= t.min && totalOrderAmount < t.max) ?? TIERS[0]
  const next = TIERS[TIERS.indexOf(tier) + 1]
  const progress = next ? Math.min(100, ((totalOrderAmount - tier.min) / (next.min - tier.min)) * 100) : 100

  return (
    <div className={`rounded-2xl border border-line p-5 ${tier.bg}`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-ink-4 mb-0.5">멤버십 등급</p>
          <div className="flex items-center gap-2">
            <p className={`text-xl font-bold ${tier.color}`}>{tier.name}</p>
            <Link
              href="/my/membership"
              className="text-[11px] font-medium text-ink-4 hover:text-[#2d7a4f] underline underline-offset-2 transition-colors"
            >
              혜택 보기
            </Link>
          </div>
        </div>
        <div className="text-3xl">
          {tier.name === 'Bronze' ? '🥉' : tier.name === 'Silver' ? '🥈' : tier.name === 'Gold' ? '🥇' : '👑'}
        </div>
      </div>
      {next && (
        <>
          <div className="w-full bg-white/60 rounded-full h-2 mb-1.5">
            <div className={`${tier.bar} h-2 rounded-full transition-all`} style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-ink-4">
            {next.name}까지 {(next.min - totalOrderAmount).toLocaleString()}원 남음
          </p>
        </>
      )}
    </div>
  )
}

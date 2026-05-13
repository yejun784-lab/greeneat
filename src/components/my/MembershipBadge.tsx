'use client'

import { useMemo } from 'react'

export type MembershipTier = 'bronze' | 'silver' | 'gold' | 'vip'

export const TIERS: {
  tier: MembershipTier
  label: string
  minAmount: number
  color: string
  bg: string
  border: string
  emoji: string
  benefit: string
}[] = [
  {
    tier: 'bronze',
    label: '브론즈',
    minAmount: 0,
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    emoji: '🥉',
    benefit: '기본 혜택',
  },
  {
    tier: 'silver',
    label: '실버',
    minAmount: 100000,
    color: 'text-slate-500',
    bg: 'bg-slate-50',
    border: 'border-slate-200',
    emoji: '🥈',
    benefit: '배송비 할인 쿠폰 월 1회',
  },
  {
    tier: 'gold',
    label: '골드',
    minAmount: 300000,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    emoji: '🥇',
    benefit: '5% 상시 할인 + 우선 배송',
  },
  {
    tier: 'vip',
    label: 'VIP',
    minAmount: 700000,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    emoji: '💎',
    benefit: '10% 상시 할인 + 전담 CS',
  },
]

export function getTier(totalAmount: number): (typeof TIERS)[number] {
  return (
    [...TIERS].reverse().find((t) => totalAmount >= t.minAmount) ?? TIERS[0]
  )
}

export function getNextTier(current: MembershipTier) {
  const idx = TIERS.findIndex((t) => t.tier === current)
  return idx < TIERS.length - 1 ? TIERS[idx + 1] : null
}

interface Props {
  totalOrderAmount: number
}

export function MembershipBadge({ totalOrderAmount }: Props) {
  const tier = useMemo(() => getTier(totalOrderAmount), [totalOrderAmount])
  const next = useMemo(() => getNextTier(tier.tier), [tier])
  const progress = next
    ? Math.min(100, ((totalOrderAmount - tier.minAmount) / (next.minAmount - tier.minAmount)) * 100)
    : 100
  const remaining = next ? next.minAmount - totalOrderAmount : 0

  return (
    <div className={`rounded-2xl border ${tier.border} ${tier.bg} p-5`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{tier.emoji}</span>
          <div>
            <p className={`text-lg font-bold ${tier.color}`}>{tier.label} 회원</p>
            <p className="text-xs text-ink-5">{tier.benefit}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-ink-5">누적 결제</p>
          <p className="text-sm font-bold text-ink">{totalOrderAmount.toLocaleString()}원</p>
        </div>
      </div>

      {next ? (
        <div>
          <div className="flex justify-between text-xs text-ink-5 mb-1.5">
            <span>{tier.label}</span>
            <span>
              {next.emoji} {next.label}까지 <span className="font-semibold text-ink">{remaining.toLocaleString()}원</span>
            </span>
          </div>
          <div className="w-full bg-white/60 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-700 ${
                tier.tier === 'bronze' ? 'bg-amber-400' :
                tier.tier === 'silver' ? 'bg-slate-400' :
                tier.tier === 'gold'   ? 'bg-yellow-400' : 'bg-purple-400'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <p className="text-xs text-purple-500 font-medium">🎉 최고 등급 달성!</p>
      )}
    </div>
  )
}

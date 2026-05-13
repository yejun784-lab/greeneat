import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, Coins, TrendingUp, TrendingDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'

type PointRow = {
  id: string
  amount: number
  reason: string
  order_id: string | null
  created_at: string
}

export default async function PointsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, { data: points }] = await Promise.all([
    supabase
      .from('profiles')
      .select('name, point_balance')
      .eq('id', user.id)
      .maybeSingle(),
    supabase
      .from('points')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50),
  ])

  const rows = (points ?? []) as PointRow[]
  const balance = profile?.point_balance ?? 0

  const totalEarned = rows.filter((r) => r.amount > 0).reduce((s, r) => s + r.amount, 0)
  const totalUsed   = rows.filter((r) => r.amount < 0).reduce((s, r) => s + Math.abs(r.amount), 0)

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* 헤더 */}
      <Link
        href="/my"
        className="flex items-center gap-1 text-sm text-ink-4 hover:text-ink-2 mb-6"
      >
        <ChevronLeft size={16} />
        마이페이지
      </Link>

      <h1 className="text-2xl font-bold text-ink mb-6">포인트 내역</h1>

      {/* 요약 카드 */}
      <div className="bg-surface rounded-2xl border border-line p-5 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-yellow-50 flex items-center justify-center">
            <Coins size={20} className="text-yellow-500" />
          </div>
          <div>
            <p className="text-xs text-ink-5">보유 포인트</p>
            <p className="text-2xl font-bold text-ink">{balance.toLocaleString()}<span className="text-base font-medium text-ink-4 ml-1">P</span></p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-tint rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp size={13} className="text-[#2d7a4f]" />
              <span className="text-xs text-ink-4">총 적립</span>
            </div>
            <p className="text-lg font-bold text-[#2d7a4f]">+{totalEarned.toLocaleString()}P</p>
          </div>
          <div className="bg-red-50 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingDown size={13} className="text-red-400" />
              <span className="text-xs text-ink-4">총 사용</span>
            </div>
            <p className="text-lg font-bold text-red-400">-{totalUsed.toLocaleString()}P</p>
          </div>
        </div>
      </div>

      {/* 내역 목록 */}
      <div className="bg-surface rounded-2xl border border-line overflow-hidden">
        {rows.length === 0 ? (
          <div className="text-center py-16 text-ink-5 text-sm">
            <p className="text-3xl mb-3">🪙</p>
            <p>포인트 내역이 없습니다.</p>
            <p className="text-xs mt-1 text-ink-5">주문 시 포인트가 적립됩니다.</p>
          </div>
        ) : (
          <ul className="divide-y divide-line">
            {rows.map((row) => {
              const isEarn = row.amount > 0
              return (
                <li key={row.id} className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isEarn ? 'bg-green-tint' : 'bg-red-50'
                    }`}>
                      {isEarn
                        ? <TrendingUp size={15} className="text-[#2d7a4f]" />
                        : <TrendingDown size={15} className="text-red-400" />
                      }
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink">{row.reason}</p>
                      <p className="text-xs text-ink-5 mt-0.5">{formatDate(row.created_at)}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${isEarn ? 'text-[#2d7a4f]' : 'text-red-400'}`}>
                    {isEarn ? '+' : ''}{row.amount.toLocaleString()}P
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Megaphone, Gift, Bell, Pin } from 'lucide-react'

export const metadata: Metadata = {
  title: '이벤트 · 공지사항 | GreenEat',
}

export const dynamic = 'force-dynamic'

const TYPE_META = {
  promotion: { label: '프로모션', color: 'bg-orange-100 text-orange-600', icon: Gift },
  event:     { label: '이벤트',   color: 'bg-green-100 text-green-700',   icon: Megaphone },
  notice:    { label: '공지',     color: 'bg-tint text-ink-3',     icon: Bell },
} as const

type NoticeType = keyof typeof TYPE_META

const TABS = [
  { value: 'all',       label: '전체' },
  { value: 'event',     label: '이벤트' },
  { value: 'promotion', label: '프로모션' },
  { value: 'notice',    label: '공지사항' },
]

function isActive(starts_at: string | null, ends_at: string | null): boolean {
  const today = new Date().toISOString().slice(0, 10)
  if (starts_at && starts_at > today) return false
  if (ends_at && ends_at < today) return false
  return true
}

export default async function NoticePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const { tab = 'all' } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('notices')
    .select('id, title, type, starts_at, ends_at, created_at, is_pinned')
    .eq('is_active', true)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })

  if (tab !== 'all') {
    query = query.eq('type', tab)
  }

  const { data: notices } = await query

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-ink mb-6">이벤트 · 공지사항</h1>

      {/* 탭 */}
      <div className="flex gap-2 mb-6 border-b border-line">
        {TABS.map((t) => (
          <Link
            key={t.value}
            href={`/notice?tab=${t.value}`}
            className={`pb-2.5 px-1 text-sm font-medium border-b-2 transition-colors ${
              tab === t.value
                ? 'border-primary text-primary'
                : 'border-transparent text-ink-4 hover:text-ink'
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {/* 목록 */}
      {!notices || notices.length === 0 ? (
        <p className="text-center text-ink-4 py-16">등록된 내용이 없어요.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-line">
          {notices.map((n) => {
            const meta = TYPE_META[n.type as NoticeType] ?? TYPE_META.notice
            const Icon = meta.icon
            const active = isActive(n.starts_at, n.ends_at)
            const pinned = (n as typeof n & { is_pinned?: boolean }).is_pinned
            return (
              <li key={n.id}>
                <Link
                  href={`/notice/${n.id}`}
                  className={`flex items-start gap-3 py-4 hover:bg-tint px-2 rounded-xl transition-colors ${pinned ? 'bg-amber-50/60' : ''}`}
                >
                  <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${meta.color}`}>
                    <Icon size={15} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      {pinned && (
                        <span className="flex items-center gap-0.5 text-[11px] font-semibold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-md">
                          <Pin size={10} />
                          필독
                        </span>
                      )}
                      <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded-md ${meta.color}`}>
                        {meta.label}
                      </span>
                      {!active && (
                        <span className="text-[11px] text-ink-4 bg-tint px-1.5 py-0.5 rounded-md">종료</span>
                      )}
                    </div>
                    <p className={`text-sm font-medium truncate ${active ? 'text-ink' : 'text-ink-4'}`}>
                      {n.title}
                    </p>
                    <div className="mt-0.5 text-[11px] text-ink-4">
                      {n.starts_at && n.ends_at
                        ? `${n.starts_at} ~ ${n.ends_at}`
                        : n.created_at?.slice(0, 10)}
                    </div>
                  </div>
                  <span className="text-ink-4 text-sm mt-1">›</span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { Bell, Package, RefreshCw, Megaphone, Settings, ShoppingBag, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'

type NotificationType = 'order' | 'restock' | 'event' | 'system' | 'subscription'

type Notification = {
  id: string
  type: NotificationType
  title: string
  body: string
  link: string | null
  is_read: boolean
  created_at: string
}

const TYPE_META: Record<NotificationType, { icon: React.ElementType; color: string; bg: string }> = {
  order:        { icon: Package,    color: 'text-blue-500',   bg: 'bg-blue-50 dark:bg-blue-950' },
  restock:      { icon: ShoppingBag, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950' },
  event:        { icon: Megaphone,  color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-950' },
  subscription: { icon: RefreshCw,  color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950' },
  system:       { icon: Settings,   color: 'text-ink-4',      bg: 'bg-wash' },
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<NotificationType | 'all'>('all')

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const supabase = createClient()
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
    setNotifications((data ?? []) as Notification[])
    setLoading(false)
  }

  async function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, is_read: true } : n))
    const supabase = createClient()
    await supabase.from('notifications').update({ is_read: true }).eq('id', id)
  }

  async function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
    const supabase = createClient()
    await supabase.from('notifications').update({ is_read: true }).eq('is_read', false)
  }

  const filtered = filter === 'all' ? notifications : notifications.filter((n) => n.type === filter)
  const unreadCount = notifications.filter((n) => !n.is_read).length

  const FILTER_TABS: { key: NotificationType | 'all'; label: string }[] = [
    { key: 'all', label: '전체' },
    { key: 'order', label: '주문' },
    { key: 'restock', label: '재입고' },
    { key: 'event', label: '이벤트' },
    { key: 'subscription', label: '구독' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-2 border-[#2d7a4f] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Link href="/my" className="p-1 text-ink-5 hover:text-ink-2">
            <ChevronLeft size={20} />
          </Link>
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-ink" />
            <h1 className="text-xl font-bold text-ink">알림</h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-[#2d7a4f] text-white rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="text-xs text-ink-4 hover:text-[#2d7a4f] transition-colors"
          >
            모두 읽음
          </button>
        )}
      </div>

      {/* 필터 탭 */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-none">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap border transition-colors ${
              filter === tab.key
                ? 'border-[#2d7a4f] bg-green-tint text-[#2d7a4f] font-medium'
                : 'border-line-2 text-ink-4 hover:border-line-3'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 알림 목록 */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Bell size={40} className="mx-auto text-line-2 mb-4" />
          <p className="text-ink-5">알림이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((n) => {
            const meta = TYPE_META[n.type]
            const Icon = meta.icon
            const Wrapper = n.link ? Link : 'div'
            return (
              <Wrapper
                key={n.id}
                href={n.link ?? '#'}
                onClick={() => !n.is_read && markRead(n.id)}
                className={`flex gap-4 p-4 rounded-2xl border transition-colors cursor-pointer ${
                  n.is_read
                    ? 'border-line bg-surface'
                    : 'border-[#2d7a4f]/20 bg-green-tint/30'
                }`}
              >
                {/* 아이콘 */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${meta.bg}`}>
                  <Icon size={18} className={meta.color} />
                </div>

                {/* 내용 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm font-medium ${n.is_read ? 'text-ink-3' : 'text-ink'}`}>
                      {n.title}
                    </p>
                    <span className="text-[10px] text-ink-5 whitespace-nowrap shrink-0">
                      {formatDate(n.created_at)}
                    </span>
                  </div>
                  <p className="text-xs text-ink-4 mt-0.5 leading-relaxed">{n.body}</p>
                </div>

                {/* 읽지 않음 점 */}
                {!n.is_read && (
                  <div className="w-2 h-2 rounded-full bg-[#2d7a4f] shrink-0 mt-1.5" />
                )}
              </Wrapper>
            )
          })}
        </div>
      )}
    </div>
  )
}

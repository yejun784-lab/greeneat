import type { Metadata } from 'next'
import Link from 'next/link'
import { Users, Flame, Camera } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { FeedClient } from '@/components/feed/FeedClient'
import type { MealLog, FeedGroup } from '@/types'

export const metadata: Metadata = {
  title: '밥로그 — GreenEat',
  description: '친구들과 오늘 뭐 먹었는지 공유해보세요.',
}

export default async function FeedPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 비로그인 시 랜딩 화면
  if (!user) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-green-tint flex items-center justify-center mx-auto mb-6">
          <Users size={36} className="text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-ink mb-2">밥로그</h1>
        <p className="text-ink-4 mb-8">친구들과 오늘 뭐 먹었는지 공유하고<br />스트릭을 함께 이어가요.</p>
        <div className="flex justify-center gap-6 mb-10">
          {[
            { icon: Camera, label: '식단 사진 공유' },
            { icon: Flame,  label: '연속 기록 스트릭' },
            { icon: Users,  label: '그룹 피드' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-green-tint-2 flex items-center justify-center">
                <Icon size={20} className="text-primary" />
              </div>
              <p className="text-xs text-ink-4">{label}</p>
            </div>
          ))}
        </div>
        <Link
          href="/login"
          className="inline-block px-8 py-3 bg-primary text-white font-semibold rounded-2xl hover:bg-primary-hover transition-colors"
        >
          로그인하고 시작하기
        </Link>
        <p className="mt-4 text-sm text-ink-5">
          계정이 없으신가요?{' '}
          <Link href="/signup" className="text-primary hover:underline">회원가입</Link>
        </p>
      </div>
    )
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('name')
    .eq('id', user.id)
    .maybeSingle()

  // 내가 속한 그룹
  const { data: memberRows } = await supabase
    .from('feed_group_members')
    .select('group_id')
    .eq('user_id', user.id)

  const groupIds = (memberRows ?? []).map((r) => r.group_id)

  let group: FeedGroup | null = null
  let logs: MealLog[] = []
  let members: { user_id: string; profiles: { name: string | null } | null }[] = []

  if (groupIds.length > 0) {
    const { data: groupData } = await supabase
      .from('feed_groups')
      .select('*')
      .eq('id', groupIds[0])
      .maybeSingle()

    group = groupData as FeedGroup | null

    if (group) {
      const [logsRes, membersRes] = await Promise.all([
        supabase
          .from('meal_logs')
          .select('*, profiles(name), meal_reactions(*)')
          .eq('group_id', group.id)
          .order('created_at', { ascending: false })
          .limit(40),
        supabase
          .from('feed_group_members')
          .select('user_id, profiles(name)')
          .eq('group_id', group.id),
      ])
      logs = (logsRes.data ?? []) as MealLog[]
      members = (membersRes.data ?? []) as unknown as { user_id: string; profiles: { name: string | null } | null }[]
    }
  }

  // 오늘 스트릭 계산 (KST 기준 자정 — 서버가 UTC이더라도 한국 날짜로 정확히 필터)
  const kstTodayStart = new Date(
    new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10) + 'T00:00:00+09:00'
  ).toISOString()
  const { data: todayLog } = await supabase
    .from('meal_logs')
    .select('streak_day, created_at')
    .eq('user_id', user.id)
    .gte('created_at', kstTodayStart)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const currentStreak = todayLog?.streak_day ?? 0

  return (
    <FeedClient
      userId={user.id}
      userName={profile?.name ?? '나'}
      group={group}
      initialLogs={logs}
      members={members}
      currentStreak={currentStreak}
    />
  )
}

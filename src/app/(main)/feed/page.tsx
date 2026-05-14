import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
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
  if (!user) redirect('/login')

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

  // 오늘 스트릭 계산
  const { data: todayLog } = await supabase
    .from('meal_logs')
    .select('streak_day, created_at')
    .eq('user_id', user.id)
    .gte('created_at', new Date(new Date().setHours(0, 0, 0, 0)).toISOString())
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

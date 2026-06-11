import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const DAILY_POINTS = 50
const STREAK_BONUS = 200   // 7일 연속마다 추가 지급
const STREAK_UNIT = 7

/** KST 기준 YYYY-MM-DD */
function todayKST(): string {
  return new Date(Date.now() + 9 * 3_600_000).toISOString().slice(0, 10)
}

/** 연속 출석일 계산 — dates는 내림차순 정렬된 YYYY-MM-DD 배열 */
function calcStreak(dates: string[], today: string): number {
  let streak = 0
  let cursor = new Date(today + 'T00:00:00Z')
  for (const d of dates) {
    if (d === cursor.toISOString().slice(0, 10)) {
      streak += 1
      cursor = new Date(cursor.getTime() - 86_400_000)
    } else if (d < cursor.toISOString().slice(0, 10)) {
      break
    }
  }
  return streak
}

// GET /api/attendance — 최근 30일 출석 + 오늘 출석 여부 + 연속일
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })

  const today = todayKST()
  const since = new Date(Date.now() - 30 * 86_400_000).toISOString().slice(0, 10)

  const { data } = await supabase
    .from('attendance_logs')
    .select('date')
    .eq('user_id', user.id)
    .gte('date', since)
    .order('date', { ascending: false })

  const dates = (data ?? []).map(r => String(r.date))
  const checkedToday = dates.includes(today)
  const streak = calcStreak(dates, checkedToday ? today : new Date(Date.now() + 9 * 3_600_000 - 86_400_000).toISOString().slice(0, 10))

  return NextResponse.json({ dates, checkedToday, streak, today })
}

// POST /api/attendance — 오늘 출석 체크 + 포인트 지급
export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })

  const today = todayKST()

  // UNIQUE(user_id, date) 제약으로 중복 차단
  const { error: insertError } = await supabase
    .from('attendance_logs')
    .insert({ user_id: user.id, date: today, points_awarded: DAILY_POINTS })

  if (insertError) {
    // 23505 = unique_violation → 이미 출석
    if (insertError.code === '23505') {
      return NextResponse.json({ error: '오늘은 이미 출석했어요.' }, { status: 409 })
    }
    return NextResponse.json({ error: '출석 처리에 실패했습니다.' }, { status: 500 })
  }

  // 연속 출석 재계산 (오늘 포함)
  const since = new Date(Date.now() - 30 * 86_400_000).toISOString().slice(0, 10)
  const { data } = await supabase
    .from('attendance_logs')
    .select('date')
    .eq('user_id', user.id)
    .gte('date', since)
    .order('date', { ascending: false })

  const dates = (data ?? []).map(r => String(r.date))
  const streak = calcStreak(dates, today)

  // 7일 연속 달성일마다 보너스
  const isBonusDay = streak > 0 && streak % STREAK_UNIT === 0
  const total = DAILY_POINTS + (isBonusDay ? STREAK_BONUS : 0)

  await Promise.all([
    supabase.rpc('increment_points', { uid: user.id, amount: total }),
    supabase.from('points').insert({
      user_id: user.id,
      amount: total,
      reason: isBonusDay ? `출석체크 (${streak}일 연속 보너스!)` : '출석체크',
    }),
  ])

  return NextResponse.json({ awarded: total, streak, bonus: isBonusDay })
}

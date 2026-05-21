import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// 인기 검색어 top 10 (최근 7일, 1글자 이하 제외, 로그인 불필요)
export async function GET() {
  const supabase = await createClient()

  const since = new Date()
  since.setDate(since.getDate() - 7)

  const { data, error } = await supabase
    .from('search_logs')
    .select('query')
    .gte('created_at', since.toISOString())

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 빈도 집계 (1글자 이하 제외)
  const freq: Record<string, number> = {}
  for (const row of data ?? []) {
    const q = (row.query ?? '').trim()
    if (q.length <= 1) continue
    freq[q] = (freq[q] ?? 0) + 1
  }

  const keywords = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([keyword]) => keyword)

  return NextResponse.json({ keywords })
}

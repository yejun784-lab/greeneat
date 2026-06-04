'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Flame, Dumbbell } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/lib/toast-store'

const EXERCISE_LIST: { name: string; emoji: string; metPerMin: number }[] = [
  { name: '걷기',       emoji: '🚶', metPerMin: 0.053 },
  { name: '달리기',     emoji: '🏃', metPerMin: 0.118 },
  { name: '자전거',     emoji: '🚴', metPerMin: 0.083 },
  { name: '수영',       emoji: '🏊', metPerMin: 0.100 },
  { name: '헬스',       emoji: '🏋️', metPerMin: 0.083 },
  { name: 'HIIT',      emoji: '🔥', metPerMin: 0.150 },
  { name: '요가',       emoji: '🧘', metPerMin: 0.040 },
  { name: '등산',       emoji: '🧗', metPerMin: 0.107 },
  { name: '줄넘기',     emoji: '⛹️', metPerMin: 0.133 },
  { name: '기타',       emoji: '💪', metPerMin: 0.067 },
]

type ExerciseLog = {
  id: string
  exercise_type: string
  duration_min: number
  calories_burned: number | null
  memo: string | null
}

export function ExerciseLogger({ userId, date }: { userId?: string | null; date: string }) {
  const [logs, setLogs] = useState<ExerciseLog[]>([])
  const [showForm, setShowForm] = useState(false)
  const [type, setType] = useState(EXERCISE_LIST[0].name)
  const [duration, setDuration] = useState('')
  const [memo, setMemo] = useState('')
  const [saving, setSaving] = useState(false)

  const totalCalories = logs.reduce((s, l) => s + (l.calories_burned ?? 0), 0)
  const totalMin = logs.reduce((s, l) => s + l.duration_min, 0)

  useEffect(() => {
    if (!userId) return
    const supabase = createClient()
    supabase.from('exercise_logs').select('*').eq('user_id', userId).eq('date', date)
      .order('created_at').then(({ data }) => setLogs((data ?? []) as ExerciseLog[]))
  }, [userId, date])

  function calcCalories(typeName: string, min: number): number {
    const ex = EXERCISE_LIST.find(e => e.name === typeName) ?? EXERCISE_LIST[0]
    // 체중 70kg 기준 근사값
    return Math.round(ex.metPerMin * 70 * min)
  }

  async function handleSave() {
    const min = parseInt(duration)
    if (!min || min <= 0) { toast.error('운동 시간을 입력해주세요.'); return }
    if (!userId) { toast.error('로그인이 필요해요.'); return }

    setSaving(true)
    const supabase = createClient()
    const calories = calcCalories(type, min)
    const { data, error } = await supabase.from('exercise_logs').insert({
      user_id: userId, date, exercise_type: type,
      duration_min: min, calories_burned: calories,
      memo: memo.trim() || null,
    }).select().single()

    setSaving(false)
    if (error) { toast.error('저장에 실패했어요.'); return }
    setLogs(prev => [...prev, data as ExerciseLog])
    toast.success(`${type} ${min}분 — ${calories}kcal 소모 기록됐어요! 💪`)
    setShowForm(false)
    setDuration('')
    setMemo('')
  }

  async function handleDelete(id: string) {
    if (!userId) return
    const supabase = createClient()
    await supabase.from('exercise_logs').delete().eq('id', id).eq('user_id', userId)
    setLogs(prev => prev.filter(l => l.id !== id))
    toast.info('운동 기록이 삭제됐어요.')
  }

  return (
    <div className="bg-surface rounded-2xl border border-line p-5 space-y-4">
      {/* 헤더 요약 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Dumbbell size={16} className="text-[#2d7a4f]" />
          <span className="font-semibold text-ink">오늘의 운동</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          {totalMin > 0 && (
            <>
              <span className="text-ink-4">{totalMin}분</span>
              <span className="flex items-center gap-1 text-orange-500 font-medium">
                <Flame size={13} /> {totalCalories}kcal
              </span>
            </>
          )}
        </div>
      </div>

      {/* 기록 목록 */}
      {logs.length > 0 && (
        <ul className="space-y-2">
          {logs.map(log => {
            const ex = EXERCISE_LIST.find(e => e.name === log.exercise_type)
            return (
              <li key={log.id} className="flex items-center justify-between bg-wash rounded-xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{ex?.emoji ?? '💪'}</span>
                  <div>
                    <p className="text-sm font-medium text-ink">{log.exercise_type}</p>
                    <p className="text-xs text-ink-5">
                      {log.duration_min}분 · {log.calories_burned ?? 0}kcal
                      {log.memo && ` · ${log.memo}`}
                    </p>
                  </div>
                </div>
                <button onClick={() => handleDelete(log.id)} className="text-ink-5 hover:text-red-400 transition-colors">
                  <Trash2 size={14} />
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {/* 입력 폼 */}
      {showForm && (
        <div className="space-y-3 pt-2 border-t border-line">
          {/* 운동 종류 */}
          <div className="grid grid-cols-5 gap-1.5">
            {EXERCISE_LIST.map(ex => (
              <button
                key={ex.name}
                onClick={() => setType(ex.name)}
                className={`flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs transition-colors ${
                  type === ex.name ? 'bg-[#2d7a4f] text-white' : 'bg-wash text-ink-3 hover:bg-green-tint hover:text-[#2d7a4f]'
                }`}
              >
                <span className="text-base">{ex.emoji}</span>
                {ex.name}
              </button>
            ))}
          </div>

          {/* 시간 + 메모 */}
          <div className="flex gap-2">
            <div className="flex items-center gap-2 flex-1 px-3 py-2.5 border border-line-2 rounded-xl">
              <input
                type="number" min="1" max="300"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                placeholder="시간 (분)"
                className="flex-1 text-sm bg-transparent text-ink focus:outline-none"
              />
              <span className="text-xs text-ink-5">분</span>
            </div>
            {duration && (
              <div className="flex items-center px-3 py-2.5 bg-orange-50 rounded-xl text-xs text-orange-600 font-medium whitespace-nowrap">
                <Flame size={12} className="mr-1" />
                {calcCalories(type, parseInt(duration) || 0)}kcal
              </div>
            )}
          </div>

          <input
            type="text" value={memo} onChange={e => setMemo(e.target.value)}
            placeholder="메모 (선택사항)"
            className="w-full px-3 py-2.5 border border-line-2 rounded-xl text-sm bg-surface text-ink placeholder:text-ink-5 focus:outline-none focus:ring-2 focus:ring-[#2d7a4f]"
          />

          <div className="flex gap-2">
            <button onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-line-2 rounded-xl text-sm text-ink-3 hover:bg-wash transition-colors">
              취소
            </button>
            <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 bg-[#2d7a4f] text-white rounded-xl text-sm font-semibold hover:bg-[#235f3d] transition-colors disabled:opacity-60">
              {saving ? '저장 중...' : '기록하기'}
            </button>
          </div>
        </div>
      )}

      {/* 추가 버튼 */}
      {!showForm && (
        <button
          onClick={() => userId ? setShowForm(true) : toast.info('로그인 후 기록할 수 있어요.', { action: { label: '로그인', href: '/login' } })}
          className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-line-2 rounded-xl text-sm text-ink-4 hover:border-[#2d7a4f] hover:text-[#2d7a4f] transition-colors"
        >
          <Plus size={15} /> 운동 추가
        </button>
      )}
    </div>
  )
}

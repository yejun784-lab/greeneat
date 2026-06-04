'use client'

import { useState, useEffect } from 'react'
import { Plus, Minus, Moon, Droplets } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/lib/toast-store'

const WATER_STEP_ML = 200

function getWaterGoal(weightKg?: number | null): number {
  if (!weightKg) return 2000
  // 체중 × 33ml (국제 권장 기준)
  return Math.round(weightKg * 33 / 100) * 100  // 100ml 단위 반올림
}

type SleepLog = {
  id: string
  sleep_start: string
  sleep_end: string
  quality: number | null
}

const QUALITY_LABELS = ['', '😫 최악', '😔 나쁨', '😐 보통', '😊 좋음', '😴 최고']

export function WaterSleepTracker({ userId, date, weightKg }: { userId?: string | null; date: string; weightKg?: number | null }) {
  const [waterMl, setWaterMl] = useState(0)
  const [sleepLog, setSleepLog] = useState<SleepLog | null>(null)
  const [sleepStart, setSleepStart] = useState('23:00')
  const [sleepEnd, setSleepEnd] = useState('07:00')
  const [quality, setQuality] = useState(3)
  const [savingSleep, setSavingSleep] = useState(false)

  const WATER_GOAL_ML = getWaterGoal(weightKg)
  const waterPct = Math.min(100, Math.round((waterMl / WATER_GOAL_ML) * 100))
  const cups = Math.floor(waterMl / WATER_STEP_ML)

  // 수면 시간 계산
  function calcSleepHours(start: string, end: string): number {
    const [sh, sm] = start.split(':').map(Number)
    const [eh, em] = end.split(':').map(Number)
    let mins = (eh * 60 + em) - (sh * 60 + sm)
    if (mins < 0) mins += 24 * 60
    return Math.round(mins / 6) / 10
  }

  useEffect(() => {
    if (!userId) return
    const supabase = createClient()
    Promise.all([
      supabase.from('water_logs').select('amount_ml').eq('user_id', userId).eq('date', date),
      supabase.from('sleep_logs').select('*').eq('user_id', userId).eq('date', date).maybeSingle(),
    ]).then(([{ data: water }, { data: sleep }]) => {
      const total = (water ?? []).reduce((s: number, r: { amount_ml: number }) => s + r.amount_ml, 0)
      setWaterMl(total)
      if (sleep) {
        setSleepLog(sleep as SleepLog)
        setSleepStart(sleep.sleep_start?.slice(0, 5) ?? '23:00')
        setSleepEnd(sleep.sleep_end?.slice(0, 5) ?? '07:00')
        setQuality(sleep.quality ?? 3)
      }
    })
  }, [userId, date])

  async function addWater(ml: number) {
    if (!userId) { toast.info('로그인 후 기록할 수 있어요.', { action: { label: '로그인', href: '/login' } }); return }
    const newTotal = Math.max(0, waterMl + ml)
    setWaterMl(newTotal)
    const supabase = createClient()
    if (ml > 0) {
      await supabase.from('water_logs').insert({ user_id: userId, date, amount_ml: ml })
    } else {
      // 마지막 기록 삭제
      const { data } = await supabase.from('water_logs').select('id').eq('user_id', userId).eq('date', date).order('created_at', { ascending: false }).limit(1)
      if (data?.[0]) await supabase.from('water_logs').delete().eq('id', data[0].id)
    }
    if (newTotal >= WATER_GOAL_ML && waterMl < WATER_GOAL_ML) toast.success('🎉 오늘 목표 수분량 달성!')
  }

  async function saveSleep() {
    if (!userId) { toast.info('로그인 후 기록할 수 있어요.', { action: { label: '로그인', href: '/login' } }); return }
    setSavingSleep(true)
    const supabase = createClient()
    const payload = { user_id: userId, date, sleep_start: sleepStart, sleep_end: sleepEnd, quality }

    let result
    if (sleepLog) {
      result = await supabase.from('sleep_logs').update(payload).eq('id', sleepLog.id).select().single()
    } else {
      result = await supabase.from('sleep_logs').insert(payload).select().single()
    }
    setSavingSleep(false)
    if (result.error) { toast.error('저장에 실패했어요.'); return }
    setSleepLog(result.data as SleepLog)
    const hours = calcSleepHours(sleepStart, sleepEnd)
    toast.success(`수면 ${hours}시간 기록됐어요! 🌙`)
  }

  const sleepHours = sleepLog ? calcSleepHours(sleepLog.sleep_start?.slice(0,5) ?? sleepStart, sleepLog.sleep_end?.slice(0,5) ?? sleepEnd) : null

  return (
    <div className="space-y-4">
      {/* 💧 수분 섭취 */}
      <div className="bg-surface rounded-2xl border border-line p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Droplets size={16} className="text-blue-500" />
            <span className="font-semibold text-ink">수분 섭취</span>
          </div>
          <span className="text-sm font-bold text-blue-500">{waterMl}ml <span className="text-ink-5 font-normal">/ {WATER_GOAL_ML}ml</span></span>
        </div>

        {/* 진행 바 */}
        <div className="w-full h-3 bg-blue-50 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${waterPct}%` }}
          />
        </div>

        {/* 컵 시각화 */}
        <div className="flex gap-1 mb-4 flex-wrap">
          {Array.from({ length: WATER_GOAL_ML / WATER_STEP_ML }).map((_, i) => (
            <div
              key={i}
              className={`w-7 h-8 rounded-b-lg border-2 transition-colors ${
                i < cups ? 'bg-blue-400 border-blue-400' : 'bg-transparent border-line-2'
              }`}
            />
          ))}
        </div>

        {/* 버튼 */}
        <div className="flex gap-2">
          <button
            onClick={() => addWater(-WATER_STEP_ML)}
            disabled={waterMl === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 border border-line-2 rounded-xl text-sm text-ink-3 hover:bg-wash transition-colors disabled:opacity-40"
          >
            <Minus size={14} /> {WATER_STEP_ML}ml
          </button>
          <button
            onClick={() => addWater(WATER_STEP_ML)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            <Plus size={14} /> 물 한 컵 ({WATER_STEP_ML}ml)
          </button>
        </div>
        {waterPct >= 100 && (
          <p className="text-center text-xs text-blue-500 font-medium mt-2">🎉 오늘 목표 달성!</p>
        )}
      </div>

      {/* 🌙 수면 기록 */}
      <div className="bg-surface rounded-2xl border border-line p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Moon size={16} className="text-indigo-500" />
            <span className="font-semibold text-ink">수면 기록</span>
          </div>
          {sleepHours !== null && (
            <span className="text-sm font-bold text-indigo-500">{sleepHours}시간</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs text-ink-5 mb-1">취침 시간</label>
            <input
              type="time" value={sleepStart}
              onChange={e => setSleepStart(e.target.value)}
              className="w-full px-3 py-2.5 border border-line-2 rounded-xl text-sm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="block text-xs text-ink-5 mb-1">기상 시간</label>
            <input
              type="time" value={sleepEnd}
              onChange={e => setSleepEnd(e.target.value)}
              className="w-full px-3 py-2.5 border border-line-2 rounded-xl text-sm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>

        {/* 수면 품질 */}
        <div className="mb-4">
          <label className="block text-xs text-ink-5 mb-2">수면 품질</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(q => (
              <button
                key={q}
                onClick={() => setQuality(q)}
                className={`flex-1 py-2 rounded-xl text-sm transition-colors ${
                  quality === q ? 'bg-indigo-500 text-white' : 'bg-wash text-ink-4 hover:bg-indigo-50 hover:text-indigo-500'
                }`}
              >
                {['😫', '😔', '😐', '😊', '😴'][q - 1]}
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-ink-5 mt-1">{QUALITY_LABELS[quality]}</p>
        </div>

        <div className="flex items-center justify-between text-xs text-ink-5 mb-3">
          <span>예상 수면: {calcSleepHours(sleepStart, sleepEnd)}시간</span>
          <span className={calcSleepHours(sleepStart, sleepEnd) >= 7 ? 'text-[#2d7a4f] font-medium' : 'text-orange-500 font-medium'}>
            {calcSleepHours(sleepStart, sleepEnd) >= 7 ? '✓ 권장 수면량' : '권장: 7~9시간'}
          </span>
        </div>

        <button
          onClick={saveSleep}
          disabled={savingSleep}
          className="w-full py-2.5 bg-indigo-500 text-white rounded-xl text-sm font-semibold hover:bg-indigo-600 transition-colors disabled:opacity-60"
        >
          {savingSleep ? '저장 중...' : sleepLog ? '수면 기록 수정' : '수면 기록 저장'}
        </button>
      </div>
    </div>
  )
}

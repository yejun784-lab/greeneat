'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type WeightLog = { date: string; weight_kg: number }

type Props = {
  initialLogs: WeightLog[]
  userId: string
  heightCm?: number | null
}

function formatMMDD(dateStr: string): string {
  const d = new Date(dateStr)
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${mm}/${dd}`
}

function getTodayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

export function WeightTracker({ initialLogs, userId, heightCm }: Props) {
  const [logs, setLogs] = useState<WeightLog[]>(initialLogs)
  const [date, setDate] = useState(getTodayStr())
  const [weight, setWeight] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const kg = parseFloat(weight)
    if (isNaN(kg) || kg <= 0) {
      setError('올바른 체중을 입력해주세요.')
      return
    }
    setSaving(true)
    setError(null)

    const supabase = createClient()
    const { error: dbErr } = await supabase
      .from('weight_logs')
      .upsert(
        { user_id: userId, date, weight_kg: kg },
        { onConflict: 'user_id,date' }
      )

    if (dbErr) {
      setError('저장 실패: ' + dbErr.message)
      setSaving(false)
      return
    }

    // Update local state
    setLogs((prev) => {
      const filtered = prev.filter((l) => l.date !== date)
      return [...filtered, { date, weight_kg: kg }].sort((a, b) =>
        a.date.localeCompare(b.date)
      )
    })
    setWeight('')
    setSaving(false)
  }

  // BMI
  const latestWeight = logs.length > 0 ? logs[logs.length - 1].weight_kg : null
  const bmi =
    latestWeight && heightCm && heightCm > 0
      ? latestWeight / Math.pow(heightCm / 100, 2)
      : null

  function getBmiLabel(b: number): string {
    if (b < 18.5) return '저체중'
    if (b < 23) return '정상'
    if (b < 25) return '과체중'
    return '비만'
  }
  function getBmiColor(b: number): string {
    if (b < 18.5) return 'text-blue-500'
    if (b < 23) return 'text-[#2d7a4f]'
    if (b < 25) return 'text-yellow-500'
    return 'text-red-500'
  }

  // SVG chart
  const chartLogs = logs.slice(-30)
  const hasData = chartLogs.length > 1

  let polylinePoints = ''
  let circles: { x: number; y: number; date: string; weight: number }[] = []

  if (hasData) {
    const weights = chartLogs.map((l) => l.weight_kg)
    const minW = Math.min(...weights) - 2
    const maxW = Math.max(...weights) + 2
    const rangeW = maxW - minW || 1

    const svgW = 300
    const svgH = 100
    const padX = 10
    const padY = 8

    circles = chartLogs.map((log, i) => {
      const x = padX + (i / (chartLogs.length - 1)) * (svgW - padX * 2)
      const y = padY + ((maxW - log.weight_kg) / rangeW) * (svgH - padY * 2)
      return { x, y, date: log.date, weight: log.weight_kg }
    })

    polylinePoints = circles.map((c) => `${c.x},${c.y}`).join(' ')
  }

  return (
    <div className="space-y-4">
      {/* Input form */}
      <form onSubmit={handleSave} className="flex flex-wrap gap-3 items-end">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-ink-4 font-medium">날짜</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 text-sm border border-line-2 rounded-xl bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f]"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-ink-4 font-medium">체중 (kg)</label>
          <input
            type="number"
            step="0.1"
            min="20"
            max="300"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="예) 65.5"
            className="w-28 px-3 py-2 text-sm border border-line-2 rounded-xl bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f]"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 text-sm font-medium text-white bg-[#2d7a4f] rounded-xl hover:bg-[#235f3d] disabled:opacity-50 transition-colors"
        >
          {saving ? '저장 중...' : '기록'}
        </button>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </form>

      {/* BMI */}
      {bmi && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-ink-4">현재 BMI:</span>
          <span className={`font-bold ${getBmiColor(bmi)}`}>
            {bmi.toFixed(1)}
          </span>
          <span className={`text-xs font-medium ${getBmiColor(bmi)}`}>
            ({getBmiLabel(bmi)})
          </span>
        </div>
      )}

      {/* SVG line chart */}
      {chartLogs.length === 0 ? (
        <div className="py-10 text-center text-ink-5 text-sm">
          아직 기록이 없어요. 첫 체중을 기록해보세요!
        </div>
      ) : chartLogs.length === 1 ? (
        <div className="py-6 text-center text-ink-4 text-sm">
          기록이 1개예요. 2개 이상이면 추이 차트가 표시돼요.
        </div>
      ) : (
        <div className="relative w-full overflow-x-auto">
          <svg
            viewBox="0 0 300 100"
            className="w-full max-w-full"
            style={{ height: 120 }}
          >
            {/* polyline */}
            <polyline
              points={polylinePoints}
              fill="none"
              stroke="#2d7a4f"
              strokeWidth="2"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
            {/* dots */}
            {circles.map((c, i) => (
              <g key={i}>
                <circle
                  cx={c.x}
                  cy={c.y}
                  r="3"
                  fill="#2d7a4f"
                  stroke="#fff"
                  strokeWidth="1.5"
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="cursor-pointer"
                />
                {hoveredIdx === i && (
                  <g>
                    <rect
                      x={Math.max(0, Math.min(c.x - 24, 260))}
                      y={Math.max(0, c.y - 28)}
                      width="52"
                      height="22"
                      rx="4"
                      fill="#111"
                      opacity="0.85"
                    />
                    <text
                      x={Math.max(26, Math.min(c.x + 2, 286))}
                      y={Math.max(12, c.y - 13)}
                      textAnchor="middle"
                      fontSize="7"
                      fill="#fff"
                    >
                      {formatMMDD(c.date)} {c.weight}kg
                    </text>
                  </g>
                )}
              </g>
            ))}
          </svg>
        </div>
      )}
    </div>
  )
}

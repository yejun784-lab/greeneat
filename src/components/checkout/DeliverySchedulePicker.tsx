'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Clock, MessageSquare } from 'lucide-react'

/* ── 시간대 옵션 ─────────────────────────────────────────────────── */
export const TIME_SLOTS = [
  { id: 'morning',   label: '오전 배송', time: '7:00 ~ 12:00',   emoji: '🌅', desc: '오전 중 도착' },
  { id: 'afternoon', label: '오후 배송', time: '12:00 ~ 18:00',  emoji: '☀️', desc: '점심 이후 도착' },
  { id: 'evening',   label: '저녁 배송', time: '18:00 ~ 22:00',  emoji: '🌙', desc: '퇴근 후 도착' },
] as const
export type TimeSlotId = (typeof TIME_SLOTS)[number]['id']

/* ── 배송 메모 프리셋 ──────────────────────────────────────────── */
const MEMO_PRESETS = [
  '문 앞에 놓아주세요',
  '경비실에 맡겨주세요',
  '직접 받겠습니다',
  '택배함에 넣어주세요',
  '기타 (직접 입력)',
]

export type DeliverySchedule = {
  date: string      // 'YYYY-MM-DD'
  timeSlot: TimeSlotId
  memo: string
}

interface Props {
  minDaysAhead?: number   // 최소 몇 일 이후부터 선택 가능 (기본 2)
  value: DeliverySchedule
  onChange: (v: DeliverySchedule) => void
}

const MONTH_NAMES = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']
const DAY_NAMES   = ['일','월','화','수','목','금','토']

export function DeliverySchedulePicker({ minDaysAhead = 2, value, onChange }: Props) {
  /* 최소 선택 가능 날짜 */
  const todayDate = new Date()
  todayDate.setHours(0, 0, 0, 0)
  const minDate = new Date(todayDate)
  minDate.setDate(todayDate.getDate() + minDaysAhead)

  /* 달력 표시 월 */
  const [calYear,  setCalYear]  = useState(minDate.getFullYear())
  const [calMonth, setCalMonth] = useState(minDate.getMonth())

  /* 메모 상태 */
  const [memoPreset,  setMemoPreset]  = useState('')
  const [customMemo,  setCustomMemo]  = useState('')

  /* ── 달력 날짜 배열 ─── */
  const firstDow     = new Date(calYear, calMonth, 1).getDay()
  const daysInMonth  = new Date(calYear, calMonth + 1, 0).getDate()
  const calCells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  function pickDate(day: number) {
    const d = new Date(calYear, calMonth, day)
    if (d < minDate) return
    onChange({ ...value, date: d.toISOString().slice(0, 10) })
  }

  function prevMonth() {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11) }
    else setCalMonth(m => m - 1)
  }
  function nextMonth() {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0) }
    else setCalMonth(m => m + 1)
  }

  function selectMemo(preset: string) {
    setMemoPreset(preset)
    if (preset !== '기타 (직접 입력)') {
      onChange({ ...value, memo: preset })
      setCustomMemo('')
    } else {
      onChange({ ...value, memo: customMemo })
    }
  }

  /* 빠른 날짜 버튼 */
  const quickOptions = [1, 2, 3, 5, 7].map(n => {
    const d = new Date(todayDate)
    d.setDate(todayDate.getDate() + n)
    return {
      label: n === 1 ? '내일' : n === 2 ? '모레' : `${n}일 후`,
      date:  d.toISOString().slice(0, 10),
      mmdd:  d.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
      disabled: d < minDate,
    }
  }).filter(q => !q.disabled)

  const todayIso = todayDate.toISOString().slice(0, 10)

  return (
    <div className="space-y-6">

      {/* ── 빠른 선택 버튼 ── */}
      <div>
        <p className="text-xs font-semibold text-ink-4 mb-2.5">빠른 날짜 선택</p>
        <div className="flex gap-2 flex-wrap">
          {quickOptions.map(q => (
            <button
              key={q.date}
              type="button"
              onClick={() => onChange({ ...value, date: q.date })}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border-2 transition-all ${
                value.date === q.date
                  ? 'bg-[#2d7a4f] text-white border-[#2d7a4f] shadow-sm'
                  : 'border-line-2 text-ink-3 hover:border-[#2d7a4f]/50 hover:text-[#2d7a4f] hover:bg-green-tint'
              }`}
            >
              <span>{q.label}</span>
              <span className={`${value.date === q.date ? 'opacity-80' : 'opacity-60'}`}>{q.mmdd}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── 달력 ── */}
      <div className="border border-line rounded-2xl overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-line bg-wash/60">
          <button type="button" onClick={prevMonth}
            className="p-1.5 rounded-lg hover:bg-tint text-ink-4 transition-colors">
            <ChevronLeft size={15} />
          </button>
          <span className="text-sm font-semibold text-ink">
            {calYear}년 {MONTH_NAMES[calMonth]}
          </span>
          <button type="button" onClick={nextMonth}
            className="p-1.5 rounded-lg hover:bg-tint text-ink-4 transition-colors">
            <ChevronRight size={15} />
          </button>
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 border-b border-line bg-wash/30">
          {DAY_NAMES.map((d, i) => (
            <div key={d}
              className={`py-2 text-center text-[11px] font-semibold ${
                i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-ink-5'
              }`}>
              {d}
            </div>
          ))}
        </div>

        {/* 날짜 셀 */}
        <div className="grid grid-cols-7 p-2 gap-0.5">
          {calCells.map((day, idx) => {
            if (!day) return <div key={`e-${idx}`} />
            const d = new Date(calYear, calMonth, day)
            d.setHours(0, 0, 0, 0)
            const iso       = d.toISOString().slice(0, 10)
            const disabled  = d < minDate
            const selected  = value.date === iso
            const isToday   = iso === todayIso
            const dow       = d.getDay()

            return (
              <button
                key={day}
                type="button"
                onClick={() => !disabled && pickDate(day)}
                disabled={disabled}
                className={`aspect-square flex items-center justify-center text-xs font-medium rounded-lg transition-all ${
                  selected
                    ? 'bg-[#2d7a4f] text-white shadow-sm ring-2 ring-[#2d7a4f]/20'
                    : disabled
                    ? 'text-ink-5/30 cursor-not-allowed'
                    : isToday
                    ? 'border border-[#2d7a4f]/60 text-[#2d7a4f] font-semibold'
                    : dow === 0
                    ? 'text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                    : dow === 6
                    ? 'text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                    : 'text-ink-3 hover:bg-green-tint hover:text-[#2d7a4f]'
                }`}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>

      {/* 선택된 날짜 배너 */}
      {value.date && (
        <div className="flex items-center gap-2.5 px-4 py-3 bg-green-tint border border-primary/20 rounded-xl">
          <span className="text-lg">📅</span>
          <div>
            <p className="text-sm font-semibold text-[#2d7a4f]">
              {new Date(value.date + 'T12:00:00').toLocaleDateString('ko-KR', {
                year: 'numeric', month: 'long', day: 'numeric', weekday: 'short',
              })}
            </p>
            <p className="text-xs text-[#2d7a4f]/70 mt-0.5">배송 예정일로 선택됐어요</p>
          </div>
        </div>
      )}

      {/* ── 시간대 선택 ── */}
      <div>
        <div className="flex items-center gap-1.5 mb-3">
          <Clock size={14} className="text-ink-4" />
          <p className="text-xs font-semibold text-ink-4">배송 시간대 선택</p>
          <span className="text-[10px] text-ink-5">· 가장 편한 시간을 고르세요</span>
        </div>
        <div className="grid grid-cols-3 gap-2.5">
          {TIME_SLOTS.map(slot => (
            <button
              key={slot.id}
              type="button"
              onClick={() => onChange({ ...value, timeSlot: slot.id })}
              className={`p-3.5 rounded-xl border-2 text-center transition-all ${
                value.timeSlot === slot.id
                  ? 'border-[#2d7a4f] bg-green-tint shadow-sm'
                  : 'border-line-2 hover:border-[#2d7a4f]/40 hover:bg-green-tint/40'
              }`}
            >
              <div className="text-2xl mb-1.5">{slot.emoji}</div>
              <p className={`text-xs font-bold ${value.timeSlot === slot.id ? 'text-[#2d7a4f]' : 'text-ink-3'}`}>
                {slot.label}
              </p>
              <p className="text-[10px] text-ink-5 mt-0.5 leading-tight">{slot.time}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ── 배송 요청사항 ── */}
      <div>
        <div className="flex items-center gap-1.5 mb-3">
          <MessageSquare size={14} className="text-ink-4" />
          <p className="text-xs font-semibold text-ink-4">배송 요청사항</p>
          <span className="text-[10px] text-ink-5">· 선택 사항</span>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          {MEMO_PRESETS.map(m => (
            <button
              key={m}
              type="button"
              onClick={() => selectMemo(m)}
              className={`px-3 py-2.5 rounded-xl text-xs border-2 text-left transition-all ${
                memoPreset === m
                  ? 'border-[#2d7a4f] bg-green-tint text-[#2d7a4f] font-semibold'
                  : 'border-line-2 text-ink-3 hover:border-[#2d7a4f]/40 hover:bg-green-tint/40'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        {memoPreset === '기타 (직접 입력)' && (
          <textarea
            rows={2}
            value={customMemo}
            onChange={e => {
              setCustomMemo(e.target.value)
              onChange({ ...value, memo: e.target.value })
            }}
            placeholder="배송 요청사항을 직접 입력해주세요 (50자 이내)"
            maxLength={50}
            className="w-full px-3 py-2.5 border border-line-2 rounded-xl text-sm bg-surface text-ink placeholder:text-ink-5 focus:outline-none focus:ring-2 focus:ring-[#2d7a4f] resize-none"
          />
        )}
        {memoPreset && memoPreset !== '기타 (직접 입력)' && (
          <p className="text-xs text-ink-5 mt-1.5 px-1">✅ &ldquo;{memoPreset}&rdquo; 전달됩니다</p>
        )}
      </div>
    </div>
  )
}

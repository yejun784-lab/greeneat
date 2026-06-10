'use client'

import { useEffect, useState } from 'react'

interface Props {
  endsAt: string    // ISO 날짜 문자열
  onExpire?: () => void
  className?: string
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function calcRemaining(endsAt: string) {
  const diff = Math.max(0, new Date(endsAt).getTime() - Date.now())
  const h = Math.floor(diff / 3_600_000)
  const m = Math.floor((diff % 3_600_000) / 60_000)
  const s = Math.floor((diff % 60_000) / 1_000)
  return { h, m, s, expired: diff <= 0 }
}

export function CountdownTimer({ endsAt, onExpire, className = '' }: Props) {
  const [time, setTime] = useState(() => calcRemaining(endsAt))

  useEffect(() => {
    if (time.expired) { onExpire?.(); return }
    const id = setInterval(() => {
      const next = calcRemaining(endsAt)
      setTime(next)
      if (next.expired) { clearInterval(id); onExpire?.() }
    }, 1000)
    return () => clearInterval(id)
  }, [endsAt, onExpire, time.expired])

  if (time.expired) return <span className={className}>종료됨</span>

  return (
    <span className={`font-mono tabular-nums ${className}`}>
      <Digit v={time.h} />
      <Sep />
      <Digit v={time.m} />
      <Sep />
      <Digit v={time.s} />
    </span>
  )
}

function Digit({ v }: { v: number }) {
  return (
    <span className="inline-flex items-center justify-center w-[2ch]">
      {pad(v)}
    </span>
  )
}

function Sep() {
  return <span className="opacity-60 mx-px animate-pulse">:</span>
}

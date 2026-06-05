'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
  decimals?: number
}

export function CountUp({ end, duration = 1800, prefix = '', suffix = '', decimals = 0 }: Props) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const startTime = performance.now()
          const animate = (now: number) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            // easeOutCubic
            const eased = 1 - Math.pow(1 - progress, 3)
            setValue(Math.round(eased * end * Math.pow(10, decimals)) / Math.pow(10, decimals))
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [end, duration, decimals])

  return (
    <span ref={ref}>
      {prefix}{decimals > 0 ? value.toFixed(decimals) : value.toLocaleString()}{suffix}
    </span>
  )
}

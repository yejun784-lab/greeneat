'use client'

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react'

type Direction = 'up' | 'down' | 'left' | 'right' | 'fade'

interface Props {
  children: ReactNode
  direction?: Direction
  delay?: number        // ms
  duration?: number     // ms
  className?: string
  once?: boolean
}

const TRANSLATE: Record<Direction, string> = {
  up:    'translateY(32px)',
  down:  'translateY(-32px)',
  left:  'translateX(32px)',
  right: 'translateX(-32px)',
  fade:  'none',
}

export function AnimateIn({
  children, direction = 'up', delay = 0, duration = 600, className = '', once = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) observer.disconnect()
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [once])

  const style: CSSProperties = {
    opacity:    visible ? 1 : 0,
    transform:  visible ? 'none' : TRANSLATE[direction],
    transition: `opacity ${duration}ms ease, transform ${duration}ms ease`,
    transitionDelay: `${delay}ms`,
  }

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  )
}

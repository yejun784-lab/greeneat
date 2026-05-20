'use client'

import { useEffect } from 'react'

export function PWAProvider() {
  useEffect(() => {
    // 개발 환경에서는 SW 등록하지 않음 (재시작마다 stale cache 방지)
    if (process.env.NODE_ENV !== 'production') return
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
  }, [])
  return null
}
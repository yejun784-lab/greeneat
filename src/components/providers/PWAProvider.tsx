'use client'

import { useEffect } from 'react'

export function PWAProvider() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    if (process.env.NODE_ENV !== 'production') {
      // 개발 환경: 기존에 등록된 SW 모두 제거 + 캐시 전부 삭제
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((r) => r.unregister())
      })
      caches.keys().then((keys) => {
        keys.forEach((key) => caches.delete(key))
      })
      return
    }

    navigator.serviceWorker.register('/sw.js').catch(() => {})
  }, [])
  return null
}
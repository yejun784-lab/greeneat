'use client'

import { useEffect } from 'react'

export function PWAProvider() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => console.log('[PWA] SW registered:', reg.scope))
        .catch((err) => console.error('[PWA] SW error:', err))
    }
  }, [])

  return null
}

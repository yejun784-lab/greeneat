'use client'

import { useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}

export function PWAProvider() {
  const subscribePush = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return
    if (!VAPID_PUBLIC || process.env.NODE_ENV !== 'production') return

    try {
      const reg = await navigator.serviceWorker.ready
      const existing = await reg.pushManager.getSubscription()
      if (existing) return // already subscribed

      const permission = await Notification.requestPermission()
      if (permission !== 'granted') return

      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC),
      })

      const json = subscription.toJSON()
      await fetch('/api/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: json.endpoint,
          keys: json.keys,
        }),
      })
    } catch {
      // silent — push is optional
    }
  }, [])

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

    navigator.serviceWorker.register('/sw.js').then(async () => {
      // SW 등록 후 로그인 상태이면 push 구독 시도
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) subscribePush()
    }).catch(() => {})
  }, [subscribePush])

  return null
}

/**
 * 외부에서 push 구독 요청할 때 사용하는 훅
 * (로그인 완료 후 호출)
 */
export function usePushSubscribe() {
  return useCallback(async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return
    if (!VAPID_PUBLIC || process.env.NODE_ENV !== 'production') return

    try {
      const reg = await navigator.serviceWorker.ready
      const existing = await reg.pushManager.getSubscription()
      if (existing) return

      const permission = await Notification.requestPermission()
      if (permission !== 'granted') return

      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC),
      })

      const json = subscription.toJSON()
      await fetch('/api/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: json.endpoint, keys: json.keys }),
      })
    } catch {
      // silent
    }
  }, [])
}

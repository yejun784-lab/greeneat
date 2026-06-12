'use client'

import { useEffect, useState } from 'react'
import { BellRing, BellOff } from 'lucide-react'
import { toast } from '@/lib/toast-store'

const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? ''

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const raw = atob((base64 + padding).replace(/-/g, '+').replace(/_/g, '/'))
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)))
}

type PushState = 'unsupported' | 'denied' | 'off' | 'on' | 'loading'

/** 브라우저 푸시 알림 on/off 토글 카드 */
export function NotificationSettings() {
  const [state, setState] = useState<PushState>('loading')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    async function check() {
      if (typeof window === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window) || !VAPID_PUBLIC) {
        setState('unsupported'); return
      }
      if (Notification.permission === 'denied') { setState('denied'); return }
      try {
        const reg = await navigator.serviceWorker.ready
        const sub = await reg.pushManager.getSubscription()
        setState(sub ? 'on' : 'off')
      } catch {
        setState('unsupported')
      }
    }
    check()
  }, [])

  async function turnOn() {
    setBusy(true)
    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        setState(permission === 'denied' ? 'denied' : 'off')
        toast.error('브라우저 알림 권한이 필요해요.')
        return
      }
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC) as BufferSource,
      })
      const json = sub.toJSON()
      const res = await fetch('/api/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: sub.endpoint, keys: json.keys }),
      })
      if (!res.ok) throw new Error()
      setState('on')
      toast.success('푸시 알림을 켰어요 🔔')
    } catch {
      toast.error('알림 설정에 실패했어요.')
    } finally {
      setBusy(false)
    }
  }

  async function turnOff() {
    setBusy(true)
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      if (sub) {
        await fetch('/api/push', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        }).catch(() => {})
        await sub.unsubscribe()
      }
      setState('off')
      toast.success('푸시 알림을 껐어요.')
    } catch {
      toast.error('해제에 실패했어요.')
    } finally {
      setBusy(false)
    }
  }

  if (state === 'loading' || state === 'unsupported') return null

  const on = state === 'on'

  return (
    <div className="bg-surface rounded-2xl border border-line p-5 mb-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${on ? 'bg-green-tint' : 'bg-tint'}`}>
            {on ? <BellRing size={16} className="text-[#2d7a4f]" /> : <BellOff size={16} className="text-ink-4" />}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink">브라우저 푸시 알림</p>
            <p className="text-xs text-ink-5 mt-0.5 truncate">
              {state === 'denied'
                ? '브라우저 설정에서 알림 권한을 허용해 주세요'
                : on ? '재입고·답변·주문 알림을 푸시로 받아요' : '꺼져 있어요 — 켜면 실시간 알림을 받아요'}
            </p>
          </div>
        </div>

        {state === 'denied' ? (
          <span className="text-[11px] text-ink-5 shrink-0">권한 차단됨</span>
        ) : (
          <button
            onClick={on ? turnOff : turnOn}
            disabled={busy}
            role="switch"
            aria-checked={on}
            aria-label="푸시 알림 토글"
            className={`relative w-11 h-6 rounded-full transition-colors shrink-0 disabled:opacity-50 ${
              on ? 'bg-[#2d7a4f]' : 'bg-line-2'
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                on ? 'translate-x-[22px]' : 'translate-x-0.5'
              }`}
            />
          </button>
        )}
      </div>
    </div>
  )
}

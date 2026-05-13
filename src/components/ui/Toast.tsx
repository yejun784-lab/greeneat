'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import Link from 'next/link'
import { useToastStore, type Toast as ToastItem } from '@/lib/toast-store'

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
}

const COLORS = {
  success: 'bg-surface border-[#2d7a4f] text-[#2d7a4f]',
  error: 'bg-surface border-red-400 text-red-500',
  info: 'bg-surface border-blue-400 text-blue-500',
}

const ICON_COLORS = {
  success: 'text-[#2d7a4f]',
  error: 'text-red-500',
  info: 'text-blue-500',
}

function ToastItem({ item, onRemove }: { item: ToastItem; onRemove: () => void }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 16)
    return () => clearTimeout(t)
  }, [])

  const Icon = ICONS[item.type]

  return (
    <div
      className={`flex flex-col min-w-[260px] max-w-xs px-4 py-3 rounded-xl border shadow-lg transition-all duration-300 pointer-events-auto ${COLORS[item.type]} ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      }`}
    >
      <div className="flex items-start gap-3">
        <Icon size={18} className={`shrink-0 mt-0.5 ${ICON_COLORS[item.type]}`} />
        <p className="text-sm text-ink-2 flex-1 leading-snug">{item.message}</p>
        <button
          onClick={onRemove}
          className="shrink-0 text-ink-5 hover:text-ink-4 transition-colors"
          aria-label="닫기"
        >
          <X size={14} />
        </button>
      </div>
      {item.action && (
        <div className="mt-2 pl-7">
          {item.action.href ? (
            <Link
              href={item.action.href}
              onClick={onRemove}
              className={`text-xs font-semibold underline underline-offset-2 ${ICON_COLORS[item.type]}`}
            >
              {item.action.label} →
            </Link>
          ) : (
            <button
              onClick={() => { item.action?.onClick?.(); onRemove() }}
              className={`text-xs font-semibold underline underline-offset-2 ${ICON_COLORS[item.type]}`}
            >
              {item.action.label} →
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} item={t} onRemove={() => removeToast(t.id)} />
      ))}
    </div>
  )
}

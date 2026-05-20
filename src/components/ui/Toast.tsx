'use client'

import Link from 'next/link'
import { useToastStore, type Toast as ToastItem } from '@/lib/toast-store'
import { CheckCircle2, XCircle, Info, X } from 'lucide-react'
import type { ToastType } from '@/lib/toast-store'

const CONFIG: Record<ToastType, { icon: React.ElementType; bg: string; border: string }> = {
  success: { icon: CheckCircle2, bg: 'bg-[#2d7a4f]',  border: 'border-[#235f3d]' },
  error:   { icon: XCircle,      bg: 'bg-red-500',     border: 'border-red-600'   },
  info:    { icon: Info,         bg: 'bg-[#1a1a1a]',   border: 'border-[#333]'    },
}

function ToastItemEl({ t }: { t: ToastItem }) {
  const { remove } = useToastStore()
  const { icon: Icon, bg, border } = CONFIG[t.type]
  return (
    <div className={`flex items-center gap-2.5 pl-4 pr-2 py-3 rounded-2xl shadow-2xl border pointer-events-auto text-white ${bg} ${border} max-w-sm`}>
      <Icon size={15} className="shrink-0 opacity-90" />
      <span className="text-sm font-medium flex-1">{t.message}</span>
      {t.action && (
        t.action.href ? (
          <Link
            href={t.action.href}
            onClick={() => remove(t.id)}
            className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors whitespace-nowrap shrink-0"
          >
            {t.action.label}
          </Link>
        ) : (
          <button
            onClick={() => { t.action?.onClick?.(); remove(t.id) }}
            className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors whitespace-nowrap shrink-0"
          >
            {t.action.label}
          </button>
        )
      )}
      <button onClick={() => remove(t.id)} className="ml-1 opacity-60 hover:opacity-100 transition-opacity shrink-0">
        <X size={13} />
      </button>
    </div>
  )
}

export function ToastContainer() {
  const { toasts } = useToastStore()
  if (toasts.length === 0) return null
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-2 pointer-events-none">
      {toasts.map((t) => <ToastItemEl key={t.id} t={t} />)}
    </div>
  )
}

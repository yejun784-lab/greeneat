'use client'

import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'info'

export interface ToastOptions {
  duration?: number
  action?: { label: string; href?: string; onClick?: () => void }
}

export interface ToastItem {
  id: string
  message: string
  type: ToastType
  action?: { label: string; href?: string; onClick?: () => void }
}

// Toast is an alias for ToastItem (used by Toast.tsx)
export type Toast = ToastItem

type ToastStore = {
  toasts: ToastItem[]
  add: (message: string, type: ToastType, options?: ToastOptions) => void
  remove: (id: string) => void
  removeToast: (id: string) => void  // alias for Toast.tsx compatibility
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  add: (message, type, options) => {
    const id = Math.random().toString(36).slice(2)
    const duration = options?.duration ?? 3500
    set((s) => ({
      toasts: [...s.toasts.slice(-2), { id, message, type, action: options?.action }],
    }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, duration)
  },
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

// React 외부에서도 호출 가능한 헬퍼
export const toast = {
  success: (message: string, options?: ToastOptions) => useToastStore.getState().add(message, 'success', options),
  error:   (message: string, options?: ToastOptions) => useToastStore.getState().add(message, 'error',   options),
  info:    (message: string, options?: ToastOptions) => useToastStore.getState().add(message, 'info',    options),
}
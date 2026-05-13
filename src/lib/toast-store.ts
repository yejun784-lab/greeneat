'use client'

import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'info'

export type ToastAction = {
  label: string
  href?: string
  onClick?: () => void
}

export type Toast = {
  id: string
  message: string
  type: ToastType
  duration?: number
  action?: ToastAction
}

type ToastStore = {
  toasts: Toast[]
  addToast: (message: string, type?: ToastType, opts?: { duration?: number; action?: ToastAction }) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type = 'success', opts) => {
    const id = Math.random().toString(36).slice(2, 9)
    const duration = opts?.duration ?? 3500
    set((state) => ({ toasts: [...state.toasts, { id, message, type, duration, action: opts?.action }] }))
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
    }, duration)
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))

// 컴포넌트 밖에서 호출 가능한 유틸 함수
export const toast = {
  success: (message: string, opts?: { duration?: number; action?: ToastAction }) =>
    useToastStore.getState().addToast(message, 'success', opts),
  error: (message: string, opts?: { duration?: number; action?: ToastAction }) =>
    useToastStore.getState().addToast(message, 'error', opts),
  info: (message: string, opts?: { duration?: number; action?: ToastAction }) =>
    useToastStore.getState().addToast(message, 'info', opts),
}

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
  action?: ToastOptions['action']
}

export type Toast = ToastItem

type ToastStore = {
  toasts: ToastItem[]
  add: (message: string, type: ToastType, options?: ToastOptions) => void
  remove: (id: string) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  add: (message, type, options) => {
    const id = Math.random().toString(36).slice(2)
    set((s) => ({ toasts: [...s.toasts, { id, message, type, action: options?.action }] }))
    const duration = options?.duration ?? 3500
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), duration)
  },
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

export const toast = {
  success: (message: string, options?: ToastOptions) =>
    useToastStore.getState().add(message, 'success', options),
  error: (message: string, options?: ToastOptions) =>
    useToastStore.getState().add(message, 'error', options),
  info: (message: string, options?: ToastOptions) =>
    useToastStore.getState().add(message, 'info', options),
}
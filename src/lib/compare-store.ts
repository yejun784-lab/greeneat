import { create } from 'zustand'
import type { Product } from '@/types'

const MAX = 3

interface CompareStore {
  items: Product[]
  add: (p: Product) => void
  remove: (id: string) => void
  has: (id: string) => boolean
  clear: () => void
}

export const useCompareStore = create<CompareStore>((set, get) => ({
  items: [],
  add: (p) => {
    const { items } = get()
    if (items.length >= MAX || items.find((i) => i.id === p.id)) return
    set({ items: [...items, p] })
  },
  remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
  has: (id) => get().items.some((i) => i.id === id),
  clear: () => set({ items: [] }),
}))

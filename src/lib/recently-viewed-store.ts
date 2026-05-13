'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Product } from '@/types'

const MAX = 8

const storage = createJSONStorage(() => {
  if (typeof window === 'undefined') {
    return { getItem: () => null, setItem: () => {}, removeItem: () => {} } as unknown as Storage
  }
  return localStorage
})

type RecentlyViewedStore = {
  items: Product[]
  add: (product: Product) => void
  clear: () => void
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set) => ({
      items: [],
      add: (product) =>
        set((s) => {
          const filtered = s.items.filter((p) => p.id !== product.id)
          return { items: [product, ...filtered].slice(0, MAX) }
        }),
      clear: () => set({ items: [] }),
    }),
    { name: 'greeneat-recently-viewed', storage, skipHydration: true }
  )
)

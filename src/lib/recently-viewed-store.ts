'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Product } from '@/types'

type RecentlyViewedStore = {
  items: Product[]
  add: (product: Product) => void
  remove: (id: string) => void
  clear: () => void
}

export const useRecentlyViewedStore = create<RecentlyViewedStore>()(
  persist(
    (set, get) => ({
      items: [],
      add: (product) => {
        const filtered = get().items.filter((p) => p.id !== product.id)
        set({ items: [product, ...filtered].slice(0, 10) })
      },
      remove: (id) => set({ items: get().items.filter((p) => p.id !== id) }),
      clear: () => set({ items: [] }),
    }),
    { name: 'greeneat-recently-viewed', storage: createJSONStorage(() => localStorage) }
  )
)
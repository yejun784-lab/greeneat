'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type WishlistStore = {
  ids: Set<string>
  has: (id: string) => boolean
  toggle: (id: string) => void
  clear: () => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      ids: new Set<string>(),
      has: (id) => get().ids.has(id),
      toggle: (id) =>
        set((s) => {
          const next = new Set(s.ids)
          if (next.has(id)) next.delete(id)
          else next.add(id)
          return { ids: next }
        }),
      clear: () => set({ ids: new Set() }),
    }),
    {
      name: 'greeneat-wishlist',
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') {
          return { getItem: () => null, setItem: () => {}, removeItem: () => {} } as unknown as Storage
        }
        return localStorage
      }),
      // Set is not JSON-serializable — serialize as array
      partialize: (s) => ({ ids: [...s.ids] } as any),
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray((state as any).ids)) {
          state.ids = new Set((state as any).ids)
        }
      },
    }
  )
)
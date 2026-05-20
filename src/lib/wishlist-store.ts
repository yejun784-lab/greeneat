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
      toggle: (id) => {
        const next = new Set(get().ids)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        set({ ids: next })
      },
      clear: () => set({ ids: new Set() }),
    }),
    {
      name: 'greeneat-wishlist',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ ids: [...s.ids] } as unknown as WishlistStore),
      onRehydrateStorage: () => (state) => {
        if (state) state.ids = new Set(state.ids as unknown as string[])
      },
    }
  )
)
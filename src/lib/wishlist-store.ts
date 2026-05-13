'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

const storage = createJSONStorage(() => {
  if (typeof window === 'undefined') {
    return { getItem: () => null, setItem: () => {}, removeItem: () => {} } as unknown as Storage
  }
  return localStorage
})

type WishlistStore = {
  ids: string[]           // product id 목록 (로컬 캐시)
  toggle: (id: string) => void
  has: (id: string) => boolean
  setAll: (ids: string[]) => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((s) => ({
          ids: s.ids.includes(id) ? s.ids.filter((i) => i !== id) : [...s.ids, id],
        })),
      has: (id) => get().ids.includes(id),
      setAll: (ids) => set({ ids }),
    }),
    { name: 'greeneat-wishlist', storage, skipHydration: true }
  )
)

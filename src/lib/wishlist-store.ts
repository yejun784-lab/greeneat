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
  ids: string[]
  has: (id: string) => boolean
  add: (id: string) => void
  remove: (id: string) => void
  toggle: (id: string) => void
  setAll: (ids: string[]) => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      ids: [],
      has: (id) => get().ids.includes(id),
      add: (id) => set((s) => ({ ids: s.ids.includes(id) ? s.ids : [...s.ids, id] })),
      remove: (id) => set((s) => ({ ids: s.ids.filter((i) => i !== id) })),
      toggle: (id) => {
        if (get().ids.includes(id)) {
          set((s) => ({ ids: s.ids.filter((i) => i !== id) }))
        } else {
          set((s) => ({ ids: [...s.ids, id] }))
        }
      },
      setAll: (ids) => set({ ids }),
    }),
    {
      name: 'greeneat-wishlist',
      storage,
      skipHydration: true,
    }
  )
)
import { create } from 'zustand'

type OrderedStore = {
  ids: Set<string>
  setIds: (ids: string[]) => void
}

export const useOrderedStore = create<OrderedStore>((set) => ({
  ids: new Set<string>(),
  setIds: (ids: string[]) => set({ ids: new Set(ids) }),
}))

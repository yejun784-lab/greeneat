'use client'

import { create } from 'zustand'
import Link from 'next/link'
import { X } from 'lucide-react'

type CompareStore = {
  ids: string[]
  add: (id: string) => void
  remove: (id: string) => void
  clear: () => void
}

export const useCompareStore = create<CompareStore>((set, get) => ({
  ids: [],
  add: (id) => {
    if (get().ids.length >= 3 || get().ids.includes(id)) return
    set((s) => ({ ids: [...s.ids, id] }))
  },
  remove: (id) => set((s) => ({ ids: s.ids.filter((i) => i !== id) })),
  clear: () => set({ ids: [] }),
}))

export function CompareTray() {
  const { ids, remove, clear } = useCompareStore()
  if (ids.length === 0) return null
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-line shadow-lg px-4 py-3 flex items-center gap-3">
      <span className="text-sm font-medium text-ink mr-2">비교 {ids.length}/3</span>
      <div className="flex gap-2 flex-1">
        {ids.map((id) => (
          <div key={id} className="relative bg-tint rounded-lg px-3 py-1.5 text-xs text-ink-3 flex items-center gap-1">
            <span className="truncate max-w-[80px]">{id.slice(0, 6)}…</span>
            <button onClick={() => remove(id)}><X size={10} /></button>
          </div>
        ))}
      </div>
      {ids.length >= 2 && (
        <Link
          href={`/products/compare?ids=${ids.join(',')}`}
          className="px-4 py-2 bg-[#2d7a4f] text-white text-xs font-semibold rounded-lg hover:bg-[#235f3d] transition-colors"
        >
          비교하기
        </Link>
      )}
      <button onClick={clear} className="text-ink-5 hover:text-ink-3 text-xs">초기화</button>
    </div>
  )
}
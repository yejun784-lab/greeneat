'use client'

import { create } from 'zustand'
import Link from 'next/link'
import { X, GitCompareArrows } from 'lucide-react'

type CompareItem = { id: string; name: string }

type CompareStore = {
  items: CompareItem[]
  add: (item: CompareItem) => void
  remove: (id: string) => void
  has: (id: string) => boolean
  clear: () => void
}

export const useCompareStore = create<CompareStore>((set, get) => ({
  items: [],
  add: (item) => {
    const { items } = get()
    if (items.length >= 3 || items.some((i) => i.id === item.id)) return
    set((s) => ({ items: [...s.items, item] }))
  },
  remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
  has: (id) => get().items.some((i) => i.id === id),
  clear: () => set({ items: [] }),
}))

export function CompareTray() {
  const { items, remove, clear } = useCompareStore()
  if (items.length === 0) return null

  const ids = items.map((i) => i.id).join(',')

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-t border-line shadow-2xl px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <div className="flex items-center gap-1.5 shrink-0">
          <GitCompareArrows size={15} className="text-[#2d7a4f]" />
          <span className="text-sm font-semibold text-ink">{items.length}/3</span>
        </div>

        <div className="flex gap-2 flex-1 overflow-x-auto">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-1.5 bg-tint rounded-lg px-3 py-1.5 text-xs text-ink-3 shrink-0 max-w-[160px]"
            >
              <span className="truncate">{item.name}</span>
              <button
                onClick={() => remove(item.id)}
                className="text-ink-5 hover:text-red-400 shrink-0 ml-0.5"
              >
                <X size={10} />
              </button>
            </div>
          ))}
          {/* 빈 슬롯 */}
          {Array.from({ length: 3 - items.length }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="flex items-center justify-center bg-tint/50 border border-dashed border-line-2 rounded-lg px-6 py-1.5 text-[10px] text-ink-5 shrink-0"
            >
              + 추가
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {items.length >= 2 && (
            <Link
              href={`/products/compare?ids=${ids}`}
              className="px-4 py-2 bg-[#2d7a4f] text-white text-xs font-semibold rounded-lg hover:bg-[#235f3d] transition-colors whitespace-nowrap"
            >
              비교하기 →
            </Link>
          )}
          <button
            onClick={clear}
            className="text-ink-5 hover:text-ink-3 text-xs whitespace-nowrap"
          >
            초기화
          </button>
        </div>
      </div>
    </div>
  )
}

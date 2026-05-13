'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback } from 'react'

const CATEGORIES = [
  { slug: 'korean', name: '한식' },
  { slug: 'western', name: '양식' },
  { slug: 'salad', name: '샐러드' },
  { slug: 'vegan', name: '비건' },
]

const ALLERGENS = [
  { value: 'gluten',  label: '글루텐' },
  { value: 'dairy',   label: '유제품' },
  { value: 'egg',     label: '달걀' },
  { value: 'soy',     label: '대두' },
  { value: 'pork',    label: '돼지고기' },
  { value: 'sesame',  label: '참깨' },
]

const DIFFICULTIES = [
  { value: 'easy', label: '쉬움' },
  { value: 'medium', label: '보통' },
  { value: 'hard', label: '어려움' },
]

const SERVINGS = [
  { value: '1', label: '1인분' },
  { value: '2', label: '2인분' },
  { value: '4', label: '4인분' },
]

export function ProductFilter() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const updateParam = useCallback(
    (key: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value === null || value === params.get(key)) {
        params.delete(key)
      } else {
        params.set(key, value)
      }
      params.delete('page')
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  const active = (key: string, value: string) => searchParams.get(key) === value

  return (
    <aside className="w-56 shrink-0">
      <div className="sticky top-24 space-y-6">
        {/* 카테고리 */}
        <div>
          <h3 className="text-sm font-semibold text-ink mb-3">카테고리</h3>
          <div className="space-y-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => updateParam('category', cat.slug)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  active('category', cat.slug)
                    ? 'bg-green-tint text-[#2d7a4f] font-medium'
                    : 'text-ink-3 hover:bg-wash'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* 인분 */}
        <div>
          <h3 className="text-sm font-semibold text-ink mb-3">인분</h3>
          <div className="space-y-1">
            {SERVINGS.map((s) => (
              <button
                key={s.value}
                onClick={() => updateParam('servings', s.value)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  active('servings', s.value)
                    ? 'bg-green-tint text-[#2d7a4f] font-medium'
                    : 'text-ink-3 hover:bg-wash'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* 난이도 */}
        <div>
          <h3 className="text-sm font-semibold text-ink mb-3">난이도</h3>
          <div className="space-y-1">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.value}
                onClick={() => updateParam('difficulty', d.value)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  active('difficulty', d.value)
                    ? 'bg-green-tint text-[#2d7a4f] font-medium'
                    : 'text-ink-3 hover:bg-wash'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* 알레르기 제외 */}
        <div>
          <h3 className="text-sm font-semibold text-ink mb-3">알레르기 제외</h3>
          <div className="flex flex-wrap gap-1.5">
            {ALLERGENS.map((a) => (
              <button
                key={a.value}
                onClick={() => updateParam('exclude', a.value)}
                className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${
                  active('exclude', a.value)
                    ? 'bg-red-100 border-red-300 text-red-600 font-medium'
                    : 'border-line-2 text-ink-4 hover:border-line-3'
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* 필터 초기화 */}
        {searchParams.toString() && (
          <button
            onClick={() => router.push(pathname)}
            className="w-full text-sm text-ink-4 hover:text-ink-2 underline"
          >
            필터 초기화
          </button>
        )}
      </div>
    </aside>
  )
}

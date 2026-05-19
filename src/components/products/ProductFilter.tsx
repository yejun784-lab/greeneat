'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useState } from 'react'
import { X, SlidersHorizontal, ChevronDown } from 'lucide-react'

// 필터로 취급하는 파라미터 키 (search·sort·page 제외)
const FILTER_KEYS = ['category', 'minCal', 'maxCal', 'exclude', 'difficulty', 'servings']

const CATEGORIES = [
  { slug: 'lunchbox', name: '간편식' },
  { slug: 'bakery', name: '베이커리&샐러드' },
  { slug: 'health', name: '건강식품' },
  { slug: 'diet', name: '맞춤식단' },
]

const CALORIE_RANGES = [
  { label: '~300kcal', max: '300' },
  { label: '300~500kcal', min: '300', max: '500' },
  { label: '500~700kcal', min: '500', max: '700' },
  { label: '700kcal~', min: '700' },
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

  // 활성 필터 개수 계산
  const activeFilterCount = FILTER_KEYS.filter((key) => searchParams.has(key)).length

  function resetFilters() {
    const params = new URLSearchParams(searchParams.toString())
    FILTER_KEYS.forEach((key) => params.delete(key))
    router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const [mobileOpen, setMobileOpen] = useState(false)

  const filterContent = (
    <div className="space-y-6">
      {/* 헤더 + 초기화 버튼 */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-sm font-semibold text-ink">
          <SlidersHorizontal size={14} />
          필터
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#2d7a4f] text-white text-[10px] font-bold">
              {activeFilterCount}
            </span>
          )}
        </span>
        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-0.5 text-xs text-ink-4 hover:text-red-500 transition-colors"
          >
            <X size={12} />
            초기화
          </button>
        )}
      </div>

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

        {/* 칼로리 범위 */}
        <div>
          <h3 className="text-sm font-semibold text-ink mb-3">칼로리</h3>
          <div className="space-y-1">
            {CALORIE_RANGES.map((r) => {
              const key = `${r.min ?? ''}-${r.max ?? ''}`
              const isActive =
                searchParams.get('minCal') === (r.min ?? null) &&
                searchParams.get('maxCal') === (r.max ?? null)
              return (
                <button
                  key={key}
                  onClick={() => {
                    const params = new URLSearchParams(searchParams.toString())
                    if (isActive) {
                      params.delete('minCal'); params.delete('maxCal')
                    } else {
                      if (r.min) params.set('minCal', r.min); else params.delete('minCal')
                      if (r.max) params.set('maxCal', r.max); else params.delete('maxCal')
                    }
                    params.delete('page')
                    router.push(`${pathname}?${params.toString()}`)
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive ? 'bg-green-tint text-[#2d7a4f] font-medium' : 'text-ink-3 hover:bg-wash'
                  }`}
                >
                  {r.label}
                </button>
              )
            })}
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

    </div>
  )

  return (
    <>
      {/* 모바일 필터 토글 */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 border border-line-2 rounded-full text-sm font-medium text-ink bg-white hover:bg-wash transition-colors"
        >
          <SlidersHorizontal size={14} />
          필터
          {activeFilterCount > 0 && (
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#2d7a4f] text-white text-[10px] font-bold">
              {activeFilterCount}
            </span>
          )}
          <ChevronDown size={14} className={`transition-transform ${mobileOpen ? 'rotate-180' : ''}`} />
        </button>
        {mobileOpen && (
          <div className="mt-3 p-4 bg-white border border-line-2 rounded-2xl shadow-md">
            {filterContent}
          </div>
        )}
      </div>

      {/* 데스크톱 사이드바 */}
      <aside className="hidden lg:block w-44 shrink-0">
        <div className="sticky top-24">
          {filterContent}
        </div>
      </aside>
    </>
  )
}

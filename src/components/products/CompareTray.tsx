'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, GitCompare, ChevronUp, ChevronDown } from 'lucide-react'
import { useCompareStore } from '@/lib/compare-store'
import { formatPrice } from '@/lib/utils'

const NUTRIENTS = [
  { key: 'calories', label: '칼로리', unit: 'kcal' },
  { key: 'protein',  label: '단백질', unit: 'g' },
  { key: 'carbs',    label: '탄수화물', unit: 'g' },
  { key: 'fat',      label: '지방', unit: 'g' },
]

export function CompareTray() {
  const { items, remove, clear } = useCompareStore()
  const [expanded, setExpanded] = useState(false)

  if (items.length === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9990] flex justify-center pointer-events-none">
      <div className="pointer-events-auto w-full max-w-3xl mx-4 mb-4">
        {/* 헤더 탭 */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-between bg-[#2d7a4f] text-white px-5 py-3 rounded-t-2xl shadow-lg"
        >
          <div className="flex items-center gap-2">
            <GitCompare size={16} />
            <span className="text-sm font-semibold">상품 비교 ({items.length}/3)</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => { e.stopPropagation(); clear() }}
              className="text-white/60 hover:text-white text-xs underline"
            >
              초기화
            </button>
            {expanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </div>
        </button>

        {/* 썸네일 트레이 (항상 보임) */}
        <div className="bg-surface border border-line border-t-0 px-4 py-3 flex items-center gap-3 shadow-lg rounded-b-2xl">
          {items.map((p) => (
            <div key={p.id} className="relative flex items-center gap-2 bg-wash rounded-xl px-3 py-2 flex-1 min-w-0">
              {p.image_url && (
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                  <Image src={p.image_url} alt={p.name} width={40} height={40} className="object-cover w-full h-full" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-ink truncate">{p.name}</p>
                <p className="text-xs text-[#2d7a4f] font-semibold">{formatPrice(p.price)}</p>
              </div>
              <button
                onClick={() => remove(p.id)}
                className="text-ink-5 hover:text-red-400 shrink-0"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {/* 빈 슬롯 */}
          {Array.from({ length: 3 - items.length }).map((_, i) => (
            <div key={i} className="flex-1 border-2 border-dashed border-line-2 rounded-xl h-14 flex items-center justify-center text-xs text-ink-5">
              + 상품 추가
            </div>
          ))}
        </div>

        {/* 상세 비교 테이블 */}
        {expanded && items.length >= 2 && (
          <div className="bg-surface border border-line border-t-0 px-4 pb-4 rounded-b-2xl shadow-lg -mt-2">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line">
                    <th className="text-left py-2 pr-4 text-ink-4 font-medium w-20">항목</th>
                    {items.map((p) => (
                      <th key={p.id} className="py-2 px-3 text-center text-ink font-semibold">
                        {p.name.length > 8 ? p.name.slice(0, 8) + '…' : p.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-line">
                    <td className="py-2 pr-4 text-ink-4">가격</td>
                    {items.map((p) => {
                      const min = Math.min(...items.map((i) => i.price))
                      return (
                        <td key={p.id} className={`py-2 px-3 text-center font-semibold ${p.price === min ? 'text-[#2d7a4f]' : 'text-ink'}`}>
                          {formatPrice(p.price)}
                          {p.price === min && <span className="ml-1 text-[10px] bg-green-tint text-[#2d7a4f] px-1 rounded">최저</span>}
                        </td>
                      )
                    })}
                  </tr>
                  {NUTRIENTS.map(({ key, label, unit }) => {
                    const vals = items.map((p) => (p as never as Record<string, number>)[key] ?? 0)
                    const best = key === 'calories' || key === 'fat'
                      ? Math.min(...vals)
                      : Math.max(...vals)
                    return (
                      <tr key={key} className="border-b border-line last:border-0">
                        <td className="py-2 pr-4 text-ink-4">{label}</td>
                        {items.map((p, i) => {
                          const val = vals[i]
                          const isBest = val === best && val > 0
                          return (
                            <td key={p.id} className={`py-2 px-3 text-center ${isBest ? 'font-bold text-[#2d7a4f]' : 'text-ink'}`}>
                              {val > 0 ? `${val}${unit}` : '-'}
                              {isBest && val > 0 && <span className="ml-1 text-[10px] bg-green-tint text-[#2d7a4f] px-1 rounded">
                                {key === 'calories' ? '저칼' : key === 'fat' ? '저지방' : '최고'}
                              </span>}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                  <tr>
                    <td className="py-2 pr-4 text-ink-4">인분</td>
                    {items.map((p) => (
                      <td key={p.id} className="py-2 px-3 text-center text-ink">{p.servings}인분</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
        {expanded && items.length < 2 && (
          <div className="bg-surface border border-line border-t-0 px-4 py-4 text-center text-sm text-ink-4 rounded-b-2xl -mt-2">
            비교할 상품을 2개 이상 추가해주세요
          </div>
        )}
      </div>
    </div>
  )
}

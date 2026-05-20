import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { formatPrice, DIFFICULTY_LABEL } from '@/lib/utils'
import { ChevronLeft, ShoppingCart, Star, Check, X } from 'lucide-react'
import type { Product } from '@/types'

const ROWS: { label: string; key: keyof Product; unit?: string; type?: 'bool' | 'text' }[] = [
  { label: '가격',      key: 'price' },
  { label: '칼로리',    key: 'calories',  unit: 'kcal' },
  { label: '단백질',    key: 'protein',   unit: 'g' },
  { label: '탄수화물',  key: 'carbs',     unit: 'g' },
  { label: '지방',      key: 'fat',       unit: 'g' },
  { label: '인분',      key: 'servings',  unit: '인분' },
  { label: '조리 시간', key: 'cook_time', unit: '분' },
  { label: '난이도',    key: 'difficulty', type: 'text' },
  { label: '구독 가능', key: 'is_subscription', type: 'bool' },
  { label: '재고',      key: 'stock',     unit: '개' },
]

function getBestIdx(products: Product[], key: keyof Product, preferHigh: boolean): number {
  const vals = products.map((p) => Number(p[key]) || 0)
  const best = preferHigh ? Math.max(...vals) : Math.min(...vals)
  return vals.indexOf(best)
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>
}) {
  const { ids: rawIds } = await searchParams
  if (!rawIds) notFound()

  const ids = rawIds.split(',').slice(0, 3).filter(Boolean)
  if (ids.length < 2) notFound()

  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*, product_categories(name)')
    .in('id', ids)

  if (!data || data.length < 2) notFound()

  // ids 순서대로 정렬
  const products = ids
    .map((id) => data.find((p) => p.id === id))
    .filter(Boolean) as Product[]

  const colWidth = products.length === 2 ? 'w-1/2' : 'w-1/3'

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/products" className="p-1.5 text-ink-5 hover:text-ink-2">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-ink">상품 비교</h1>
        <span className="text-sm text-ink-5">{products.length}개 상품</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* 상품 헤더 */}
          <thead>
            <tr>
              <th className="w-28 sm:w-36 shrink-0" />
              {products.map((p) => (
                <th key={p.id} className={`${colWidth} pb-6 px-3 align-top`}>
                  <Link href={`/products/${p.id}`} className="group block">
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-wash mb-3 mx-auto max-w-[160px]">
                      {p.image_url && (
                        <Image
                          src={p.image_url}
                          alt={p.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="160px"
                        />
                      )}
                    </div>
                    <p className="text-sm font-semibold text-ink text-center leading-snug group-hover:text-[#2d7a4f] transition-colors line-clamp-2">
                      {p.name}
                    </p>
                    {(p.product_categories as { name?: string } | null)?.name && (
                      <p className="text-xs text-ink-5 text-center mt-0.5">
                        {(p.product_categories as { name?: string }).name}
                      </p>
                    )}
                  </Link>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {ROWS.map((row, rowIdx) => {
              const bestIdx = (() => {
                if (row.type === 'bool' || row.type === 'text') return -1
                if (row.key === 'price' || row.key === 'calories' || row.key === 'fat' || row.key === 'cook_time') {
                  return getBestIdx(products, row.key, false) // 낮을수록 good
                }
                return getBestIdx(products, row.key, true) // 높을수록 good
              })()

              return (
                <tr
                  key={row.key}
                  className={rowIdx % 2 === 0 ? 'bg-tint/50' : 'bg-surface'}
                >
                  <td className="py-3.5 px-3 text-xs font-medium text-ink-4 whitespace-nowrap">
                    {row.label}
                  </td>
                  {products.map((p, pIdx) => {
                    const raw = p[row.key]
                    const isBest = pIdx === bestIdx

                    let display: React.ReactNode = '-'

                    if (row.type === 'bool') {
                      display = raw
                        ? <Check size={16} className="text-[#2d7a4f] mx-auto" />
                        : <X size={16} className="text-line-3 mx-auto" />
                    } else if (row.type === 'text') {
                      display = (
                        <span className="text-sm text-ink">
                          {row.key === 'difficulty'
                            ? DIFFICULTY_LABEL[raw as string] ?? raw
                            : String(raw ?? '-')}
                        </span>
                      )
                    } else if (row.key === 'price') {
                      display = (
                        <span className={`text-sm font-bold ${isBest ? 'text-[#2d7a4f]' : 'text-ink'}`}>
                          {formatPrice(raw as number)}
                          {isBest && <Star size={10} className="inline ml-1 text-yellow-400 fill-yellow-400" />}
                        </span>
                      )
                    } else if (raw != null) {
                      display = (
                        <span className={`text-sm font-semibold ${isBest ? 'text-[#2d7a4f]' : 'text-ink'}`}>
                          {Number(raw).toLocaleString()}{row.unit && ` ${row.unit}`}
                          {isBest && <Star size={10} className="inline ml-1 text-yellow-400 fill-yellow-400" />}
                        </span>
                      )
                    }

                    return (
                      <td key={p.id} className={`py-3.5 px-3 text-center ${isBest && row.type !== 'bool' ? 'font-semibold' : ''}`}>
                        {display}
                      </td>
                    )
                  })}
                </tr>
              )
            })}

            {/* 장바구니 담기 행 */}
            <tr>
              <td className="py-5 px-3" />
              {products.map((p) => (
                <td key={p.id} className="py-5 px-3">
                  <AddToCartButton product={p} />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 text-center">
        <Link href="/products" className="text-sm text-ink-4 hover:text-[#2d7a4f] transition-colors">
          ← 상품 목록으로 돌아가기
        </Link>
      </div>
    </div>
  )
}

// 클라이언트 담기 버튼은 서버 컴포넌트에서 직접 못 쓰니 간단히 링크로
function AddToCartButton({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      className={`w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
        product.stock > 0
          ? 'bg-[#2d7a4f] text-white hover:bg-[#235f3d]'
          : 'bg-tint text-ink-5 cursor-not-allowed pointer-events-none'
      }`}
    >
      <ShoppingCart size={13} />
      {product.stock > 0 ? '상품 보기' : '품절'}
    </Link>
  )
}

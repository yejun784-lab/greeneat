'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Zap, ShoppingBag } from 'lucide-react'
import { CountdownTimer } from '@/components/ui/CountdownTimer'
import { useCartStore } from '@/lib/cart-store'
import { toast } from '@/lib/toast-store'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

export type FlashSaleItem = {
  id: string
  discount_rate: number
  ends_at: string
  product: Product
}

interface Props {
  items: FlashSaleItem[]
}

export function FlashSaleSection({ items }: Props) {
  const addItem = useCartStore((s) => s.addItem)
  // 종료된 세일 아이템을 실시간 제거
  const [expired, setExpired] = useState<Set<string>>(new Set())

  const visible = items.filter(i => !expired.has(i.id))
  if (visible.length === 0) return null

  // 가장 빨리 끝나는 세일 시간 (헤더 타이머에 사용)
  const soonest = visible.reduce((a, b) =>
    new Date(a.ends_at) < new Date(b.ends_at) ? a : b
  )

  return (
    <section className="py-10 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
      {/* 섹션 헤더 */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#e8734a] flex items-center justify-center">
            <Zap size={16} className="text-white" fill="white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-ink tracking-tight">타임세일</h2>
            <p className="text-xs text-ink-5">한정 수량, 시간 안에만!</p>
          </div>
        </div>

        {/* 카운트다운 타이머 */}
        <div className="flex items-center gap-1.5 bg-ink text-white dark:bg-surface dark:text-ink dark:border dark:border-line px-3 py-1.5 rounded-xl">
          <Zap size={11} className="text-[#e8734a]" fill="#e8734a" />
          <CountdownTimer
            endsAt={soonest.ends_at}
            className="text-sm font-bold tracking-widest"
          />
        </div>
      </div>

      {/* 상품 카드 그리드 — 가로 스크롤 (모바일) */}
      <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1 sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:overflow-visible">
        {visible.map((item) => {
          const p = item.product
          const salePrice = Math.round(p.price * (1 - item.discount_rate / 100))
          const imgSrc = p.image_url
            ? p.image_url.startsWith('http')
              ? p.image_url
              : `https://nbdpckerbphyfnjzqiqp.supabase.co/storage/v1/object/public/product-images/greeneat/${p.image_url}`
            : null

          return (
            <div
              key={item.id}
              className="group relative bg-surface rounded-2xl border border-line shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden shrink-0 w-44 sm:w-auto"
            >
              {/* 할인율 뱃지 */}
              <div className="absolute top-2.5 left-2.5 z-10 bg-[#e8734a] text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-sm">
                -{item.discount_rate}%
              </div>

              {/* 타이머 뱃지 */}
              <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-0.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full">
                <Zap size={8} fill="white" />
                <CountdownTimer
                  endsAt={item.ends_at}
                  className="text-[10px]"
                  onExpire={() => setExpired(prev => new Set([...prev, item.id]))}
                />
              </div>

              {/* 이미지 */}
              <Link href={`/products/${p.id}`} className="block">
                <div className="relative aspect-square overflow-hidden bg-[#f5f5f3]">
                  {imgSrc ? (
                    <Image
                      src={imgSrc}
                      alt={p.name}
                      fill
                      className="object-cover group-hover:scale-[1.04] transition-transform duration-500"
                      sizes="(max-width: 640px) 176px, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-green-tint" />
                  )}
                </div>
              </Link>

              {/* 정보 */}
              <div className="px-3.5 pt-3 pb-3.5">
                <Link href={`/products/${p.id}`}>
                  <h3 className="text-[13px] font-medium text-ink line-clamp-1 mb-1.5">{p.name}</h3>
                </Link>

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[11px] text-ink-5 line-through">{formatPrice(p.price)}</p>
                    <p className="text-[15px] font-bold text-[#e8734a]">{formatPrice(salePrice)}</p>
                  </div>

                  {/* 담기 버튼 */}
                  {p.stock > 0 ? (
                    <button
                      onClick={() => {
                        addItem({ ...p, price: salePrice })
                        toast.success('타임세일 상품을 담았어요 ⚡')
                      }}
                      className="w-8 h-8 rounded-xl bg-[#e8734a] flex items-center justify-center hover:bg-[#d4622c] transition-colors active:scale-90"
                    >
                      <ShoppingBag size={13} className="text-white" />
                    </button>
                  ) : (
                    <span className="text-[10px] text-ink-5 font-medium">품절</span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

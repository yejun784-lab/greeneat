'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const BASE = 'https://nbdpckerbphyfnjzqiqp.supabase.co/storage/v1/object/public/product-images/greeneat/'

type MenuItem = {
  src: string
  label: string
  price: string
  badge: string | null
}

// 히어로 회전 메뉴 풀 — 실제 상품명/가격 기준
const MENU_POOL: MenuItem[] = [
  { src: 'hankki-dakgaseum.png',   label: '닭가슴살 도시락',       price: '4,900원~', badge: '🔥 인기 1위' },
  { src: 'manrep-bulgogi.png',     label: '만렙 소불고기덮밥',     price: '6,500원',  badge: '⭐ 신메뉴' },
  { src: 'granola-gamgyul2.png',   label: '감귤 그래놀라',         price: '6,900원',  badge: null },
  { src: 'hankki-dakgalbi.png',    label: '치즈닭갈비 도시락',     price: '5,200원',  badge: null },
  { src: 'manrep-omurice.png',     label: '만렙 치즈오므라이스',   price: '6,500원',  badge: '🍳 든든' },
  { src: 'hankki-buldakroze.png',  label: '불닭 로제 파스타',      price: '5,600원',  badge: '🌶️ 매콤' },
  { src: 'manrep-tteokgalbi.png',  label: '만렙 떡갈비덮밥',       price: '6,500원',  badge: null },
  { src: 'hankki-chickensteak.png', label: '치킨스테이크 덮밥',    price: '4,900원',  badge: null },
  { src: 'manrep-avocado.png',     label: '아보카도명란마요 덮밥', price: '6,500원',  badge: '🥑 신선' },
  { src: 'hankki-jekyuk.png',      label: '매콤제육 도시락',       price: '5,200원',  badge: null },
]

const ROTATE_INTERVAL = 4500 // 한 칸 교체 주기 (ms)
const FADE_MS = 700

// 칸별 비대칭 라운드 코너 (기존 디자인 유지)
const CELL_ROUNDED = [
  'rounded-tl-3xl rounded-tr-xl rounded-bl-xl rounded-br-sm',
  'rounded-tl-xl rounded-tr-3xl rounded-bl-sm rounded-br-xl',
  'rounded-tl-xl rounded-tr-sm rounded-bl-3xl rounded-br-xl',
  'rounded-tl-sm rounded-tr-xl rounded-bl-xl rounded-br-3xl',
]

function CellContent({ item, priority = false }: { item: MenuItem; priority?: boolean }) {
  return (
    <>
      <div className="aspect-square relative">
        <Image
          src={`${BASE}${item.src}`}
          alt={item.label}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={priority}
          sizes="25vw"
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/55 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 px-2.5 pb-2.5">
        {item.badge && (
          <span className="inline-block bg-surface/20 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded mb-1">
            {item.badge}
          </span>
        )}
        <p className="text-white text-[11px] font-semibold leading-tight drop-shadow">{item.label}</p>
        <p className="text-white/80 text-[10px] mt-0.5">{item.price}</p>
      </div>
    </>
  )
}

export function HeroCollage() {
  // 각 칸이 보여주는 풀 인덱스
  const [cells, setCells] = useState<number[]>([0, 1, 2, 3])
  // 크로스페이드용 이전 인덱스 (교체 중인 칸만 값 보유)
  const [prevCells, setPrevCells] = useState<(number | null)[]>([null, null, null, null])

  const cursorRef = useRef(4)   // 다음 투입할 풀 인덱스
  const turnRef = useRef(0)     // 이번에 교체할 칸 (라운드로빈)
  const cleanupRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // 모션 최소화 설정 시 회전 비활성화
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const id = setInterval(() => {
      setCells(current => {
        const turn = turnRef.current % 4

        // 현재 화면에 없는 다음 메뉴 선택
        let next = cursorRef.current % MENU_POOL.length
        let guard = 0
        while (current.includes(next) && guard < MENU_POOL.length) {
          cursorRef.current += 1
          next = cursorRef.current % MENU_POOL.length
          guard += 1
        }

        const updated = [...current]
        const old = updated[turn]
        updated[turn] = next

        setPrevCells(prev => {
          const p = [...prev]
          p[turn] = old
          return p
        })

        // 페이드 종료 후 이전 레이어 제거
        if (cleanupRef.current) clearTimeout(cleanupRef.current)
        cleanupRef.current = setTimeout(() => {
          setPrevCells(prev => {
            const p = [...prev]
            p[turn] = null
            return p
          })
        }, FADE_MS + 100)

        cursorRef.current += 1
        turnRef.current += 1
        return updated
      })
    }, ROTATE_INTERVAL)

    return () => {
      clearInterval(id)
      if (cleanupRef.current) clearTimeout(cleanupRef.current)
    }
  }, [])

  // 다음에 나올 메뉴 미리 로드 (깜빡임 방지)
  const upcoming = MENU_POOL[cursorRef.current % MENU_POOL.length]

  return (
    <div className="relative">
      {/* 배경 장식 */}
      <div className="absolute -inset-4 bg-gradient-to-br from-[#e8f5ee] to-[#f0faf4] rounded-[3rem] -z-0" />

      {/* 2×2 콜라주 */}
      <div className="relative z-10 grid grid-cols-2 gap-3 p-4">
        {cells.map((poolIdx, i) => {
          const item = MENU_POOL[poolIdx]
          const prevIdx = prevCells[i]
          return (
            <Link
              key={i}
              href="/products"
              className={`relative overflow-hidden shadow-md shadow-black/8 group block bg-surface ${CELL_ROUNDED[i]}`}
            >
              {/* 이전 메뉴 — 아래 레이어 (페이드 아웃 동안 유지) */}
              {prevIdx !== null && (
                <div className="absolute inset-0">
                  <CellContent item={MENU_POOL[prevIdx]} />
                </div>
              )}
              {/* 현재 메뉴 — 교체 중이면 위에서 페이드 인 */}
              <div
                key={poolIdx}
                className={prevIdx !== null ? 'relative animate-fade-in' : 'relative'}
                style={prevIdx !== null ? { animationDuration: `${FADE_MS}ms` } : undefined}
              >
                <CellContent item={item} priority={i < 4 && prevIdx === null} />
              </div>
            </Link>
          )
        })}
      </div>

      {/* 다음 메뉴 프리로드 (보이지 않음) */}
      <div className="absolute w-px h-px overflow-hidden opacity-0 pointer-events-none" aria-hidden>
        <Image src={`${BASE}${upcoming.src}`} alt="" width={10} height={10} />
      </div>

      {/* 플로팅 뱃지 — 가격 */}
      <div className="absolute -top-3 right-4 z-20 bg-[#2d7a4f] rounded-2xl px-4 py-2.5 shadow-lg shadow-[#2d7a4f]/40 text-white text-center">
        <p className="text-[9px] opacity-75 tracking-wide">한 끼 최저</p>
        <p className="text-[15px] font-bold tracking-tight">4,900원</p>
      </div>
    </div>
  )
}

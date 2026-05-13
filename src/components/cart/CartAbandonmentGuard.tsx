'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useCartStore } from '@/lib/cart-store'
import { toast } from '@/lib/toast-store'

// 장바구니에 담긴 상품이 있는 상태에서 /cart 또는 /checkout 이외의 페이지로
// 일정 시간(3분) 이상 머물면 한 번 nudge toast를 보여줍니다.
const NUDGE_DELAY_MS = 3 * 60 * 1000   // 3분
const STORAGE_KEY    = 'greeneat_cart_nudge_at'
const COOLDOWN_MS    = 30 * 60 * 1000  // 30분마다 최대 1회

export function CartAbandonmentGuard() {
  const pathname  = usePathname()
  const items     = useCartStore((s) => s.items)
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 결제 관련 페이지면 판단 불필요
  const isCheckoutPath = pathname.startsWith('/cart') || pathname.startsWith('/checkout')

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)

    const regularItems = items.filter((i) => !i.isSubscription)
    if (regularItems.length === 0 || isCheckoutPath) return

    timerRef.current = setTimeout(() => {
      // 쿨다운 확인
      const lastNudge = parseInt(localStorage.getItem(STORAGE_KEY) ?? '0', 10)
      if (Date.now() - lastNudge < COOLDOWN_MS) return

      const count = regularItems.reduce((s, i) => s + i.quantity, 0)
      const firstName = regularItems[0].product.name

      toast.info(
        `🛒 장바구니에 ${firstName}${count > 1 ? ` 외 ${count - 1}개` : ''}가 담겨 있어요! 지금 결제하시겠어요?`,
        {
          action: { label: '장바구니 보기', href: '/cart' },
          duration: 8000,
        }
      )
      localStorage.setItem(STORAGE_KEY, String(Date.now()))
    }, NUDGE_DELAY_MS)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [items, pathname, isCheckoutPath])

  return null
}

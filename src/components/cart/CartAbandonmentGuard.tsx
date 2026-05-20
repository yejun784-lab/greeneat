'use client'

import { useEffect, useRef } from 'react'
import { useCartStore } from '@/lib/cart-store'
import { toast } from '@/lib/toast-store'

export function CartAbandonmentGuard() {
  const shown = useRef(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (shown.current) return
      const items = useCartStore.getState().items
      if (items.length > 0) {
        shown.current = true
        toast.info(`장바구니에 ${items.length}개 상품이 있어요`, {
          action: { label: '장바구니 보기', href: '/cart' },
        })
      }
    }, 30000)
    return () => clearTimeout(timer)
  }, [])

  return null
}
'use client'

import { useEffect } from 'react'
import { useCartStore } from '@/lib/cart-store'

export function CartProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useCartStore.persist.rehydrate()
  }, [])

  return <>{children}</>
}

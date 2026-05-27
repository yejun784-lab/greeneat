'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Product } from '@/types'

const storage = createJSONStorage(() => {
  if (typeof window === 'undefined') {
    return { getItem: () => null, setItem: () => {}, removeItem: () => {} } as unknown as Storage
  }
  return localStorage
})

export type LocalCartItem = {
  product: Product
  quantity: number
  isSubscription: boolean
}

type CartStore = {
  _hasHydrated: boolean
  setHasHydrated: (v: boolean) => void
  items: LocalCartItem[]
  addItem: (product: Product, isSubscription?: boolean) => void
  removeItem: (productId: string, isSubscription?: boolean) => void
  updateQuantity: (productId: string, quantity: number, isSubscription?: boolean) => void
  clearCart: () => void
  totalItems: () => number
  totalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      _hasHydrated: false,
      setHasHydrated: (v) => set({ _hasHydrated: v }),
      items: [],
      addItem: (product, isSubscription = false) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.product.id === product.id && i.isSubscription === isSubscription
          )
          if (existing) {
            // 재고 상한 초과 시 무시
            if (product.stock > 0 && existing.quantity >= product.stock) return state
            return {
              items: state.items.map((i) =>
                i.product.id === product.id && i.isSubscription === isSubscription
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            }
          }
          if (product.stock <= 0) return state  // 품절 상품 추가 불가
          return { items: [...state.items, { product, quantity: 1, isSubscription }] }
        })
      },
      removeItem: (productId, isSubscription = false) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.product.id === productId && i.isSubscription === isSubscription)
          ),
        }))
      },
      updateQuantity: (productId, quantity, isSubscription = false) => {
        if (quantity <= 0) {
          get().removeItem(productId, isSubscription)
          return
        }
        set((state) => ({
          items: state.items.map((i) => {
            if (i.product.id !== productId || i.isSubscription !== isSubscription) return i
            // 재고 상한 초과 방지 (재고 0 상품은 수량 변경 불가)
            if (i.product.stock <= 0) return i
            const maxQty = i.product.stock
            return { ...i, quantity: Math.min(quantity, maxQty) }
          }),
        }))
      },
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    }),
    {
      name: 'greeneat-cart',
      storage,
      skipHydration: true,
      onRehydrateStorage: () => (state) => { state?.setHasHydrated(true) },
    }
  )
)

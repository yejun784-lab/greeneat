'use client'

import { useWishlistStore } from '@/lib/wishlist-store'
import { toast } from '@/lib/toast-store'

export function useWishlist() {
  const store = useWishlistStore()

  const toggle = (id: string, name?: string) => {
    const wasLiked = store.has(id)
    store.toggle(id)
    toast.info(wasLiked ? '찜 목록에서 제거했어요' : '찜 목록에 추가했어요 ❤️')
  }

  return { has: store.has, toggle }
}
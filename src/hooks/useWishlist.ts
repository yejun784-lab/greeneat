'use client'

import { useWishlistStore } from '@/lib/wishlist-store'
import { toast } from '@/lib/toast-store'

export function useWishlist() {
  const store = useWishlistStore()

  function toggle(id: string) {
    const wasWished = store.has(id)
    store.toggle(id)
    toast.info(wasWished ? '찜 목록에서 제거했어요' : '찜 목록에 추가했어요 ❤️')
  }

  return { toggle, has: store.has }
}
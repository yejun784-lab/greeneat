'use client'

import { useCallback } from 'react'
import { useWishlistStore } from '@/lib/wishlist-store'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/lib/toast-store'

export function useWishlist() {
  const store = useWishlistStore()

  const toggle = useCallback(
    async (productId: string) => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (store.has(productId)) {
        store.remove(productId)
        if (user) {
          await supabase.from('wishlists').delete().eq('user_id', user.id).eq('product_id', productId)
        }
        toast.info('찜 목록에서 제거했어요')
      } else {
        store.add(productId)
        if (user) {
          await supabase.from('wishlists').upsert({ user_id: user.id, product_id: productId })
        }
        toast.success('찜 목록에 추가했어요 ❤️')
      }
    },
    [store]
  )

  return { has: store.has, toggle }
}
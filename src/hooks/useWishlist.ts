'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useWishlistStore } from '@/lib/wishlist-store'
import { toast } from '@/lib/toast-store'

export function useWishlist() {
  const store = useWishlistStore()
  const [synced, setSynced] = useState(false)

  // 로그인 유저면 Supabase에서 찜 목록 로드
  useEffect(() => {
    if (synced) return
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return
      const { data: rows } = await supabase
        .from('wishlists')
        .select('product_id')
        .eq('user_id', data.user.id)
      if (rows) store.setAll(rows.map((r) => r.product_id))
      setSynced(true)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const toggle = useCallback(
    async (productId: string) => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast.info('찜 기능은 로그인 후 이용하세요 💚')
        return
      }

      const isWished = store.has(productId)
      // 낙관적 업데이트
      store.toggle(productId)

      if (isWished) {
        const { error } = await supabase
          .from('wishlists')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId)
        if (error) {
          store.toggle(productId) // 롤백
          toast.error('찜 취소에 실패했어요.')
        } else {
          toast.info('찜 목록에서 제거했어요.')
        }
      } else {
        const { error } = await supabase
          .from('wishlists')
          .insert({ user_id: user.id, product_id: productId })
        if (error) {
          store.toggle(productId) // 롤백
          toast.error('찜 추가에 실패했어요.')
        } else {
          toast.success('찜 목록에 추가했어요! 🩷')
        }
      }
    },
    [store]
  )

  return { toggle, has: store.has }
}

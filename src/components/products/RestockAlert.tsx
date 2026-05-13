'use client'

import { useState, useEffect } from 'react'
import { Bell, BellOff, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/lib/toast-store'

interface Props {
  productId: string
  productName: string
}

export function RestockAlert({ productId, productName }: Props) {
  const [subscribed, setSubscribed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      const uid = data.user?.id ?? null
      setUserId(uid)
      if (!uid) { setLoading(false); return }

      // 이미 신청했는지 확인
      const { data: existing } = await supabase
        .from('restock_alerts')
        .select('id')
        .eq('user_id', uid)
        .eq('product_id', productId)
        .maybeSingle()

      setSubscribed(!!existing)
      setLoading(false)
    })
  }, [productId])

  async function handleToggle() {
    if (!userId) {
      toast.error('로그인 후 이용해주세요.')
      return
    }
    setLoading(true)
    const supabase = createClient()

    if (subscribed) {
      await supabase
        .from('restock_alerts')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId)
      setSubscribed(false)
      toast.success('재입고 알림을 취소했습니다.')
    } else {
      await supabase
        .from('restock_alerts')
        .insert({ user_id: userId, product_id: productId })
      setSubscribed(true)
      toast.success(`${productName} 재입고 시 알려드릴게요! 🔔`)
    }
    setLoading(false)
  }

  if (loading) return null

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
        subscribed
          ? 'border-[#2d7a4f] bg-green-tint text-[#2d7a4f]'
          : 'border-line-2 text-ink-3 hover:border-[#2d7a4f] hover:text-[#2d7a4f]'
      }`}
    >
      {subscribed ? (
        <>
          <Check size={15} />
          알림 신청됨
        </>
      ) : (
        <>
          <Bell size={15} />
          재입고 알림 신청
        </>
      )}
      {subscribed && (
        <BellOff size={13} className="ml-1 opacity-50" />
      )}
    </button>
  )
}

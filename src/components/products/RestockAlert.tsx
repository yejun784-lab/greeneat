'use client'

import { useEffect, useState } from 'react'
import { Bell, BellOff, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/lib/toast-store'

export function RestockAlert({ productId, productName }: { productId: string; productName?: string }) {
  const [status, setStatus]   = useState<'idle' | 'loading' | 'on' | 'off'>('loading')
  const isLoading = status === 'loading'

  useEffect(() => {
    async function check() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setStatus('off'); return }

      const { data } = await supabase
        .from('restock_alerts')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle()

      setStatus(data ? 'on' : 'off')
    }
    check()
  }, [productId])

  async function toggle() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('로그인이 필요해요.')
      return
    }

    setStatus('loading')

    if (status === 'on') {
      await supabase
        .from('restock_alerts')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId)
      toast.info('재입고 알림이 취소됐어요.')
      setStatus('off')
    } else {
      const { error } = await supabase
        .from('restock_alerts')
        .insert({ user_id: user.id, product_id: productId })
      if (error) {
        toast.error('알림 신청에 실패했어요.')
        setStatus('off')
        return
      }
      toast.success(`${productName ?? '상품'} 재입고 시 알림을 드릴게요! 🔔`)
      setStatus('on')
    }
  }

  if (status === 'loading') {
    return (
      <button
        disabled
        className="w-full flex items-center justify-center gap-2 py-3 border border-line-2 rounded-xl text-sm text-ink-5"
      >
        <Loader2 size={15} className="animate-spin" />
        확인 중…
      </button>
    )
  }

  if (status === 'on') {
    return (
      <button
        onClick={toggle}
        className="w-full flex items-center justify-center gap-2 py-3 bg-green-tint border border-[#2d7a4f]/30 rounded-xl text-sm font-medium text-[#2d7a4f] hover:bg-red-50 hover:border-red-200 hover:text-red-400 transition-colors group"
      >
        <BellOff size={15} className="group-hover:block hidden" />
        <Bell size={15} className="group-hover:hidden fill-current" />
        <span className="group-hover:hidden">재입고 알림 신청됨 ✓</span>
        <span className="hidden group-hover:block">알림 취소하기</span>
      </button>
    )
  }

  return (
    <button
      onClick={toggle}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2 py-3 border border-line-2 rounded-xl text-sm font-medium text-ink-3 hover:border-[#2d7a4f] hover:text-[#2d7a4f] transition-colors disabled:opacity-50"
    >
      <Bell size={15} />
      재입고 알림 신청
    </button>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useCartStore } from '@/lib/cart-store'
import { RefreshCw } from 'lucide-react'
import type { OrderItem } from '@/types'

interface Props {
  items: OrderItem[]
}

export function ReorderButton({ items }: Props) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const addItem = useCartStore((s) => s.addItem)
  const router = useRouter()

  async function reorder() {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); setLoading(false); return }
    const productIds = items.map((i) => i.product_id).filter(Boolean)
    const { data: products } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds)

    if (products) {
      for (const item of items) {
        const product = products.find((p) => p.id === item.product_id)
        if (product) {
          for (let i = 0; i < item.quantity; i++) {
            addItem(product)
          }
        }
      }
    }

    setLoading(false)
    setDone(true)
    setTimeout(() => {
      setDone(false)
      router.push('/cart')
    }, 1200)
  }

  return (
    <button
      onClick={reorder}
      disabled={loading || done}
      className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border transition-colors disabled:opacity-60 ${
        done
          ? 'border-[#2d7a4f] text-[#2d7a4f] bg-green-tint'
          : 'border-line-2 text-ink-4 hover:border-[#2d7a4f] hover:text-[#2d7a4f]'
      }`}
    >
      <RefreshCw size={11} className={loading ? 'animate-spin' : ''} />
      {done ? '추가됨!' : '재주문'}
    </button>
  )
}

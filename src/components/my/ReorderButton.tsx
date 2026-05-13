'use client'

import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/cart-store'
import { RotateCcw } from 'lucide-react'
import type { OrderItem } from '@/types'

export function ReorderButton({ items }: { items: OrderItem[] }) {
  const router = useRouter()
  const addItem = useCartStore((s) => s.addItem)

  function handleReorder() {
    items.forEach((item) => {
      if (item.products) {
        for (let i = 0; i < item.quantity; i++) {
          addItem(item.products)
        }
      }
    })
    router.push('/cart')
  }

  return (
    <button
      onClick={handleReorder}
      className="flex items-center gap-1.5 text-xs font-medium text-[#2d7a4f] hover:text-[#235f3d] transition-colors"
    >
      <RotateCcw size={13} />
      다시 주문
    </button>
  )
}

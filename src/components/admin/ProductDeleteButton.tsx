'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/lib/toast-store'

interface Props {
  productId: string
  productName: string
}

export function ProductDeleteButton({ productId, productName }: Props) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    const supabase = createClient()
    const { error } = await supabase.from('products').delete().eq('id', productId)
    if (error) {
      toast.error(`삭제 실패: ${error.message}`)
    } else {
      toast.success(`"${productName}" 상품을 삭제했습니다.`)
      router.refresh()
    }
    setDeleting(false)
    setConfirming(false)
  }

  if (confirming) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
        <div className="bg-surface rounded-2xl border border-line p-6 w-full max-w-sm shadow-xl">
          <h3 className="font-bold text-ink text-base mb-2">상품 삭제</h3>
          <p className="text-sm text-ink-4 mb-5">
            <span className="font-semibold text-ink">"{productName}"</span>을(를) 삭제하시겠습니까?<br />
            이 작업은 되돌릴 수 없습니다.
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setConfirming(false)}
              disabled={deleting}
              className="px-4 py-2 border border-line-2 rounded-xl text-sm text-ink-2 hover:bg-wash transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              {deleting ? '삭제 중...' : '삭제'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="p-1.5 text-ink-5 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
      title="삭제"
    >
      <Trash2 size={14} />
    </button>
  )
}

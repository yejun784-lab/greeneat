'use client'

import { useState } from 'react'
import { Share2, Check, Copy } from 'lucide-react'
import { toast } from '@/lib/toast-store'

interface Props {
  productName: string
  productId: string
}

export function ShareButton({ productName, productId }: Props) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const url = `${window.location.origin}/products/${productId}`
    const title = `GreenEat — ${productName}`
    const text = `${productName}을(를) GreenEat에서 확인해보세요! 🥗`

    // Web Share API 지원 시 네이티브 공유
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
        return
      } catch {
        // 취소 등
        return
      }
    }

    // 미지원 시 클립보드 복사
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('링크가 복사되었습니다! 🔗')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('링크 복사에 실패했습니다.')
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1.5 px-3 py-2 text-sm text-ink-4 hover:text-[#2d7a4f] border border-line-2 hover:border-[#2d7a4f] rounded-xl transition-colors"
      title="공유하기"
    >
      {copied ? (
        <>
          <Check size={15} className="text-[#2d7a4f]" />
          <span className="text-[#2d7a4f] text-xs">복사됨</span>
        </>
      ) : (
        <>
          <Share2 size={15} />
          <span className="text-xs">공유</span>
        </>
      )}
    </button>
  )
}

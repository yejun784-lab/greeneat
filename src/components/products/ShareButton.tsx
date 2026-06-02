'use client'

import { Share2, Check, MessageCircle } from 'lucide-react'
import { useState, useEffect } from 'react'

declare global {
  interface Window {
    Kakao?: {
      init: (key: string) => void
      isInitialized: () => boolean
      Share: {
        sendDefault: (params: object) => void
      }
    }
  }
}

const KAKAO_JS_KEY = '776afac3a75817dfa4fbe810883b958e'

function loadKakaoSDK(): Promise<void> {
  return new Promise((resolve) => {
    if (window.Kakao) { resolve(); return }
    const script = document.createElement('script')
    script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.2/kakao.min.js'
    script.crossOrigin = 'anonymous'
    script.onload = () => resolve()
    document.head.appendChild(script)
  })
}

interface Props {
  name?: string
  productName?: string
  productId?: string
  description?: string
  imageUrl?: string | null
}

export function ShareButton({ name, productName, productId, description, imageUrl }: Props) {
  const displayName = name ?? productName ?? ''
  const [copied, setCopied] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    if (!showMenu) return
    const handler = () => setShowMenu(false)
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [showMenu])

  async function handleKakaoShare() {
    try {
      await loadKakaoSDK()
      const kakao = window.Kakao!
      if (!kakao.isInitialized()) kakao.init(KAKAO_JS_KEY)

      const url = window.location.href
      kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: `🥗 ${displayName}`,
          description: description ?? 'GreenEat 건강한 밀키트를 확인해보세요!',
          imageUrl: imageUrl ?? 'https://greeneat-six.vercel.app/icons/icon-512.png',
          link: { mobileWebUrl: url, webUrl: url },
        },
        buttons: [
          { title: '자세히 보기', link: { mobileWebUrl: url, webUrl: url } },
        ],
      })
    } catch {
      // 카카오톡 미설치 등 fallback → 클립보드 복사
      handleCopyLink()
    }
    setShowMenu(false)
  }

  async function handleCopyLink() {
    const url = window.location.href
    await navigator.clipboard.writeText(url).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    setShowMenu(false)
  }

  async function handleNativeShare() {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title: displayName, url }).catch(() => {})
    } else {
      handleCopyLink()
    }
    setShowMenu(false)
  }

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => setShowMenu((v) => !v)}
        className="flex items-center gap-1.5 text-xs text-ink-4 hover:text-ink-3 transition-colors"
      >
        {copied ? <Check size={13} className="text-[#2d7a4f]" /> : <Share2 size={13} />}
        {copied ? '복사됨!' : '공유'}
      </button>

      {showMenu && (
        <div className="absolute right-0 top-7 z-50 bg-surface border border-line rounded-xl shadow-xl overflow-hidden w-40">
          <button
            onClick={handleKakaoShare}
            className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-ink-2 hover:bg-wash transition-colors"
          >
            <span className="text-base">💬</span>
            카카오톡
          </button>
          <button
            onClick={handleNativeShare}
            className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-ink-2 hover:bg-wash transition-colors border-t border-line"
          >
            <Share2 size={14} />
            다른 앱으로
          </button>
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-ink-2 hover:bg-wash transition-colors border-t border-line"
          >
            <MessageCircle size={14} />
            링크 복사
          </button>
        </div>
      )}
    </div>
  )
}

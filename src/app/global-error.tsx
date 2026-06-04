'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="ko">
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 text-center bg-[#f5faf7]">
          <div className="text-6xl">🍅</div>
          <h1 className="text-2xl font-bold text-ink">예상치 못한 오류가 발생했어요</h1>
          <p className="text-ink-4 text-sm max-w-sm">
            불편을 드려 죄송해요. 오류가 자동으로 보고됐어요.
          </p>
          <button
            onClick={reset}
            className="px-6 py-3 bg-[#2d7a4f] text-white rounded-xl font-semibold hover:bg-[#235f3d] transition-colors"
          >
            다시 시도하기
          </button>
        </div>
      </body>
    </html>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'
import { X, Loader2, ScanLine } from 'lucide-react'
import type { BarcodeResult } from '@/app/api/barcode/route'

type Props = {
  onResult: (result: BarcodeResult) => void
  onClose: () => void
}

export function BarcodeScanner({ onResult, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [status, setStatus] = useState<'init' | 'scanning' | 'found' | 'error'>('init')
  const [errorMsg, setErrorMsg] = useState('')
  const streamRef = useRef<MediaStream | null>(null)
  const readerRef = useRef<import('@zxing/browser').BrowserMultiFormatReader | null>(null)

  useEffect(() => {
    let cancelled = false

    async function start() {
      try {
        const { BrowserMultiFormatReader } = await import('@zxing/browser')
        const reader = new BrowserMultiFormatReader()
        readerRef.current = reader

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        })

        if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return }
        streamRef.current = stream

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }

        setStatus('scanning')

        // 200ms마다 프레임 캡처 후 바코드 디코딩
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        const interval = setInterval(async () => {
          if (cancelled || !videoRef.current) { clearInterval(interval); return }
          const v = videoRef.current
          if (v.readyState < 2) return

          canvas.width = v.videoWidth
          canvas.height = v.videoHeight
          ctx.drawImage(v, 0, 0)

          try {
            const result = await reader.decodeFromCanvas(canvas)
            if (result && !cancelled) {
              clearInterval(interval)
              setStatus('found')
              await lookupBarcode(result.getText(), cancelled)
            }
          } catch {
            // 인식 실패 → 계속 시도
          }
        }, 200)

        return () => clearInterval(interval)
      } catch (err) {
        if (!cancelled) {
          setStatus('error')
          setErrorMsg(
            err instanceof DOMException && err.name === 'NotAllowedError'
              ? '카메라 권한이 필요해요. 브라우저 설정에서 허용해주세요.'
              : '카메라를 시작할 수 없어요.'
          )
        }
      }
    }

    start()

    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  async function lookupBarcode(code: string, cancelled: boolean) {
    try {
      const res = await fetch(`/api/barcode?code=${encodeURIComponent(code)}`)
      if (cancelled) return
      if (!res.ok) {
        setStatus('error')
        setErrorMsg(`바코드(${code})를 찾을 수 없어요. 직접 입력해주세요.`)
        return
      }
      const data: BarcodeResult = await res.json()
      streamRef.current?.getTracks().forEach((t) => t.stop())
      onResult(data)
    } catch {
      if (!cancelled) {
        setStatus('error')
        setErrorMsg('조회 중 오류가 발생했어요. 다시 시도해주세요.')
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white"
      >
        <X size={18} />
      </button>

      {/* 카메라 미리보기 */}
      <video
        ref={videoRef}
        muted
        playsInline
        className="w-full h-full object-cover"
      />

      {/* 스캔 가이드 오버레이 */}
      {status === 'scanning' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {/* 어두운 배경 */}
          <div className="absolute inset-0 bg-black/30" />

          {/* 스캔 박스 */}
          <div className="relative w-64 h-40 z-10">
            {/* 모서리 */}
            {['top-0 left-0 border-t-2 border-l-2', 'top-0 right-0 border-t-2 border-r-2',
              'bottom-0 left-0 border-b-2 border-l-2', 'bottom-0 right-0 border-b-2 border-r-2']
              .map((cls) => (
                <span key={cls} className={`absolute w-6 h-6 border-white ${cls}`} />
              ))}
            {/* 스캔 라인 애니메이션 */}
            <div className="absolute inset-x-0 top-0 animate-scan">
              <ScanLine size={256} className="text-[#2d7a4f] w-full opacity-70" />
            </div>
          </div>

          <p className="relative z-10 mt-6 text-white text-sm font-medium bg-black/40 px-4 py-2 rounded-full">
            바코드를 박스 안에 맞춰주세요
          </p>
        </div>
      )}

      {/* 초기화 중 */}
      {status === 'init' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black">
          <Loader2 size={32} className="text-white animate-spin" />
          <p className="text-white text-sm">카메라 시작 중...</p>
        </div>
      )}

      {/* 인식 중 */}
      {status === 'found' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/70">
          <Loader2 size={32} className="text-[#2d7a4f] animate-spin" />
          <p className="text-white text-sm font-medium">영양 정보 불러오는 중...</p>
        </div>
      )}

      {/* 에러 */}
      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/80 px-8 text-center">
          <p className="text-white text-sm leading-relaxed">{errorMsg}</p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#2d7a4f] text-white rounded-xl text-sm font-medium"
          >
            닫기
          </button>
        </div>
      )}
    </div>
  )
}

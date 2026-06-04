'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Camera, Upload, X, Flame, Dumbbell, Wheat, Droplets, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { toast } from '@/lib/toast-store'
import { type MealType, MEAL_TYPE_META } from '@/lib/utils'

type Dish = {
  name: string
  amount: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

type AnalysisResult = {
  description: string
  calories: number
  protein: number
  carbs: number
  fat: number
  confidence: 'high' | 'medium' | 'low'
  confidence_reason?: string
  dishes?: Dish[]
}

const CONFIDENCE_LABEL = {
  high: { text: '높음', color: 'text-emerald-600 bg-emerald-50' },
  medium: { text: '보통', color: 'text-amber-600 bg-amber-50' },
  low: { text: '낮음', color: 'text-red-500 bg-red-50' },
}

export function MealPhotoLogger({ onLogged, userId }: { onLogged?: () => void; userId?: string | null }) {
  const router = useRouter()
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [mealType, setMealType] = useState<MealType>('lunch')
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [done, setDone] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith('image/')) { toast.error('이미지 파일만 업로드해주세요.'); return }
    if (f.size > 5 * 1024 * 1024) { toast.error('5MB 이하 이미지만 가능해요.'); return }
    setFile(f)
    setResult(null)
    setDone(false)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(f)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }, [handleFile])

  async function analyze() {
    if (!file) return
    if (userId === null || userId === undefined) {
      toast.info('로그인 후 식단을 기록할 수 있어요.', { action: { label: '로그인', href: '/login' } })
      return
    }
    setLoading(true)
    setResult(null)
    try {
      const fd = new FormData()
      fd.append('image', file)
      fd.append('meal_type', mealType)
      fd.append('date', date)

      const res = await fetch('/api/analyze-meal', { method: 'POST', body: fd })
      const json = await res.json()

      if (!res.ok) {
        toast.error(json.error ?? '분석에 실패했어요.')
        return
      }
      setResult(json.analysis)
      setDone(true)
      toast.success('식단이 기록됐어요! 🥗')
      onLogged?.()
      router.refresh() // 서버 컴포넌트 재요청 → 영양 현황 즉시 반영
    } catch {
      toast.error('네트워크 오류가 발생했어요.')
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setPreview(null)
    setFile(null)
    setResult(null)
    setDone(false)
  }

  return (
    <div className="bg-surface rounded-2xl border border-line overflow-hidden">
      {/* 헤더 */}
      <div className="px-5 py-4 border-b border-line flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-green-tint flex items-center justify-center">
          <Camera size={16} className="text-[#2d7a4f]" />
        </div>
        <div>
          <p className="font-semibold text-ink text-sm">식단 사진 분석</p>
          <p className="text-xs text-ink-4">사진 한 장으로 칼로리를 자동 계산해요</p>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* 날짜 + 식사 유형 */}
        <div className="flex gap-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="flex-1 px-3 py-2 text-sm border border-line-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2d7a4f] text-ink-2"
          />
          <div className="flex gap-1">
            {(Object.keys(MEAL_TYPE_META) as MealType[]).map((t) => (
              <button
                key={t}
                onClick={() => setMealType(t)}
                className={`px-2.5 py-2 text-xs rounded-xl font-medium transition-colors ${
                  mealType === t
                    ? 'bg-[#2d7a4f] text-white'
                    : 'bg-tint text-ink-3 hover:bg-green-tint hover:text-[#2d7a4f]'
                }`}
              >
                {MEAL_TYPE_META[t].label}
              </button>
            ))}
          </div>
        </div>

        {/* 업로드 영역 */}
        {!preview ? (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-line-2 rounded-2xl p-8 text-center cursor-pointer hover:border-[#2d7a4f] hover:bg-green-tint-2 transition-all"
          >
            <Upload size={28} className="text-[#2d7a4f]/50 mx-auto mb-3" />
            <p className="text-sm font-medium text-ink-3">사진을 드래그하거나 클릭해서 업로드</p>
            <p className="text-xs text-ink-5 mt-1">JPG, PNG, WebP · 최대 5MB</p>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
            />
          </div>
        ) : (
          <div className="relative rounded-2xl overflow-hidden bg-tint">
            <div className="aspect-video relative">
              <Image src={preview} alt="업로드된 식단" fill className="object-contain" />
            </div>
            {!done && (
              <button
                onClick={reset}
                className="absolute top-2 right-2 w-7 h-7 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
        )}

        {/* 분석 결과 */}
        {result && (
          <div className="rounded-2xl bg-surface border border-line p-4 space-y-3">
            {/* 헤더: 설명 + 신뢰도 */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-[#2d7a4f] shrink-0 mt-0.5" />
                <p className="text-sm text-ink-2 leading-relaxed">{result.description}</p>
              </div>
              {result.confidence && (
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${CONFIDENCE_LABEL[result.confidence]?.color}`}>
                  신뢰도 {CONFIDENCE_LABEL[result.confidence]?.text}
                </span>
              )}
            </div>

            {/* 음식별 분리 목록 */}
            {result.dishes && result.dishes.length > 1 && (
              <div className="space-y-1.5">
                {result.dishes.map((dish, i) => (
                  <div key={i} className="flex items-center justify-between text-xs bg-wash rounded-lg px-3 py-2">
                    <span className="text-ink-2 font-medium">{dish.name}</span>
                    <span className="text-ink-5">{dish.amount}</span>
                    <span className="text-orange-500 font-semibold">{dish.calories}kcal</span>
                  </div>
                ))}
              </div>
            )}

            {/* 영양소 합계 */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { icon: Flame,    label: '칼로리', value: result.calories,  unit: 'kcal', color: 'text-orange-500 bg-orange-50' },
                { icon: Dumbbell, label: '단백질', value: result.protein,   unit: 'g',    color: 'text-blue-500 bg-blue-50' },
                { icon: Wheat,    label: '탄수화물', value: result.carbs,  unit: 'g',    color: 'text-amber-500 bg-amber-50' },
                { icon: Droplets, label: '지방',   value: result.fat,      unit: 'g',    color: 'text-purple-500 bg-purple-50' },
              ].map(({ icon: Icon, label, value, unit, color }) => (
                <div key={label} className={`rounded-xl p-2.5 ${color.split(' ')[1]} text-center`}>
                  <Icon size={14} className={`${color.split(' ')[0]} mx-auto mb-1`} />
                  <p className="text-[13px] font-bold text-ink">{value ?? '–'}</p>
                  <p className="text-[9px] text-ink-4">{unit}</p>
                  <p className="text-[9px] text-ink-3 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* 신뢰도 이유 */}
            {(result.confidence === 'low' || result.confidence === 'medium') && (
              <div className="flex items-start gap-2 text-xs text-amber-600 bg-amber-50 rounded-xl px-3 py-2">
                <AlertCircle size={12} className="shrink-0 mt-0.5" />
                <span>{result.confidence_reason ?? (result.confidence === 'low' ? '사진이 불분명해 수치가 부정확할 수 있어요. 더 선명한 사진으로 다시 시도해보세요.' : '양 추정에 불확실성이 있어요. 직접 조정하실 수 있어요.')}</span>
              </div>
            )}

            <button
              onClick={reset}
              className="w-full text-xs text-[#2d7a4f] font-medium py-2 hover:underline"
            >
              다른 사진 분석하기
            </button>
          </div>
        )}

        {/* 분석 버튼 */}
        {preview && !done && (
          <button
            onClick={analyze}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#2d7a4f] text-white text-sm font-semibold rounded-xl hover:bg-[#235f3d] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                AI가 분석 중이에요…
              </>
            ) : (
              <>
                <Camera size={16} />
                칼로리 분석하기
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, Loader2, RefreshCw } from 'lucide-react'
import type { Product } from '@/types'

/* ── 타입 ── */
type WeatherData = { temp: number; apparent: number; code: number }

type MealRec = {
  emoji: string
  title: string
  desc: string
  tags: string[]          // 상품 필터 키워드
  filterFn: (p: Product) => boolean
  bgClass: string
  textClass: string
  chipClass: string
}

/* ── WMO weather code 매핑 ── */
function weatherLabel(code: number) {
  if (code === 0) return '맑음'
  if (code <= 3)  return '구름 조금'
  if (code <= 48) return '안개'
  if (code <= 67) return '비'
  if (code <= 77) return '눈'
  if (code <= 82) return '소나기'
  if (code >= 95) return '천둥'
  return '흐림'
}
function weatherEmoji(code: number) {
  if (code === 0)          return '☀️'
  if (code <= 3)           return '⛅'
  if (code <= 48)          return '🌫️'
  if (code >= 71 && code <= 77) return '❄️'
  if (code >= 51 && code <= 82) return '🌧️'
  if (code >= 95)          return '⛈️'
  return '🌤️'
}

/* ── 날씨·기온 → 식단 추천 ── */
function getMealRec(temp: number, code: number): MealRec {
  const rainy = (code >= 51 && code <= 82) || code >= 95
  const snowy = code >= 71 && code <= 77

  if (snowy || temp < 5) return {
    emoji: '🍲', title: '따뜻한 보양식',
    desc: '몸을 데워주는 국물 요리와 고단백 보양식을 추천해요.',
    tags: ['고단백', '탕·국물'],
    filterFn: p => !!(p.protein && p.protein >= 22) || !!(p.calories && p.calories >= 400),
    bgClass: 'bg-orange-50', textClass: 'text-orange-700', chipClass: 'bg-orange-100 text-orange-700',
  }
  if (rainy || temp < 15) return {
    emoji: '🍜', title: '따뜻한 한식',
    desc: '비 오는 날엔 따뜻한 국물 한 그릇이 최고예요.',
    tags: ['한식', '균형식'],
    filterFn: p => {
      const t = `${p.name}`.toLowerCase()
      return t.includes('도시락') || t.includes('불고기') || t.includes('비빔') || t.includes('닭')
    },
    bgClass: 'bg-amber-50', textClass: 'text-amber-700', chipClass: 'bg-amber-100 text-amber-700',
  }
  if (temp < 25) return {
    emoji: '🥗', title: '균형 잡힌 한 끼',
    desc: '선선한 날씨엔 영양 균형 잡힌 도시락을 추천해요.',
    tags: ['균형식', '단백질'],
    filterFn: p => !!(p.calories && p.calories >= 300 && p.calories <= 550 && p.protein && p.protein >= 18),
    bgClass: 'bg-emerald-50', textClass: 'text-emerald-700', chipClass: 'bg-emerald-100 text-emerald-700',
  }
  if (temp < 30) return {
    emoji: '🥙', title: '가벼운 저칼로리',
    desc: '더운 날엔 소화 부담 없는 저칼로리 도시락이 좋아요.',
    tags: ['저칼로리', '샐러드'],
    filterFn: p => !!(p.calories && p.calories < 400),
    bgClass: 'bg-sky-50', textClass: 'text-sky-700', chipClass: 'bg-sky-100 text-sky-700',
  }
  return {
    emoji: '🍋', title: '시원한 저칼로리',
    desc: '무더운 날엔 열량 낮은 메뉴로 몸을 가볍게 유지하세요.',
    tags: ['저칼로리', '가벼운'],
    filterFn: p => !!(p.calories && p.calories < 350),
    bgClass: 'bg-blue-50', textClass: 'text-blue-700', chipClass: 'bg-blue-100 text-blue-700',
  }
}

/* ── 컴포넌트 ── */
export function WeatherRecommend({ products = [] }: { products?: Product[] }) {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [status,  setStatus]  = useState<'loading' | 'denied' | 'error' | 'ok'>('loading')

  function fetch위치() {
    setStatus('loading')
    if (!navigator.geolocation) { setStatus('denied'); return }
    navigator.geolocation.getCurrentPosition(
      async pos => {
        try {
          const { latitude: lat, longitude: lon } = pos.coords
          const r = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat.toFixed(3)}&longitude=${lon.toFixed(3)}&current=temperature_2m,apparent_temperature,weather_code&timezone=auto`,
            { next: { revalidate: 1800 } }
          )
          const j = await r.json()
          const c = j.current
          setWeather({ temp: Math.round(c.temperature_2m), apparent: Math.round(c.apparent_temperature), code: c.weather_code })
          setStatus('ok')
        } catch { setStatus('error') }
      },
      () => setStatus('denied')
    )
  }

  useEffect(() => { fetch위치() }, [])

  if (status === 'denied') return null   // 위치 거부 → 조용히 숨김
  if (status === 'loading') return (
    <div className="flex items-center gap-2 py-3 text-xs text-ink-5">
      <Loader2 size={12} className="animate-spin" /> 현재 날씨 확인 중…
    </div>
  )
  if (status === 'error' || !weather) return null

  const rec         = getMealRec(weather.temp, weather.code)
  const recProducts = products.filter(rec.filterFn).slice(0, 3)

  return (
    <div className={`rounded-2xl p-4 border border-line ${rec.bgClass}`}>
      {/* 날씨 헤더 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{weatherEmoji(weather.code)}</span>
          <div>
            <p className="text-[10px] font-semibold text-ink-4 flex items-center gap-0.5">
              <MapPin size={9} /> 현재 위치
            </p>
            <p className="text-sm font-bold text-ink">
              {weather.temp}°C · {weatherLabel(weather.code)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-5">체감 {weather.apparent}°C</span>
          <button onClick={fetch위치} className="p-1 text-ink-5 hover:text-ink-3 transition-colors">
            <RefreshCw size={11} />
          </button>
        </div>
      </div>

      {/* 추천 메시지 */}
      <div className="flex items-start gap-2 mb-3">
        <span className="text-xl shrink-0">{rec.emoji}</span>
        <div>
          <p className={`text-sm font-bold ${rec.textClass}`}>{rec.title} 추천</p>
          <p className="text-xs text-ink-4 mt-0.5 leading-relaxed">{rec.desc}</p>
        </div>
      </div>

      {/* 태그 */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {rec.tags.map(tag => (
          <span key={tag} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${rec.chipClass}`}>
            #{tag}
          </span>
        ))}
      </div>

      {/* 추천 상품 */}
      {recProducts.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold text-ink-4">날씨 맞춤 도시락</p>
          {recProducts.map(p => (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="flex items-center gap-2.5 bg-white/70 rounded-xl px-3 py-2 hover:bg-white transition-colors group"
            >
              <span className="text-base shrink-0">🍱</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-ink line-clamp-1">{p.name}</p>
                {p.calories && <p className="text-[10px] text-ink-5">🔥 {p.calories} kcal · 💪 {p.protein ?? 0}g</p>}
              </div>
              <span className={`text-[10px] font-semibold ${rec.textClass} opacity-0 group-hover:opacity-100 transition-opacity shrink-0`}>보기 →</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

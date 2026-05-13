'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Sparkles, RefreshCw } from 'lucide-react'
import { formatPrice } from '@/lib/utils'

type Rec = { id: string; name: string; reason: string; price: number }

export function AIRecommend() {
  const [recs, setRecs] = useState<Rec[]>([])
  const [loading, setLoading] = useState(true)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/ai-recommend')
      if (res.ok) {
        const { recommendations } = await res.json()
        setRecs(recommendations ?? [])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  return (
    <div className="bg-gradient-to-br from-[#1a4a2e] to-[#2d7a4f] rounded-2xl p-5 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={18} />
          <h2 className="font-semibold">AI 맞춤 추천</h2>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-white/10 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : recs.length > 0 ? (
        <div className="space-y-2">
          {recs.map((rec, i) => (
            <Link
              key={rec.id}
              href={`/products/${rec.id}`}
              className="flex items-start gap-3 bg-white/10 hover:bg-white/20 rounded-xl p-3 transition-colors"
            >
              <span className="w-6 h-6 rounded-full bg-white/20 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-sm truncate">{rec.name}</p>
                  <span className="text-xs text-green-200 shrink-0">{formatPrice(rec.price)}</span>
                </div>
                <p className="text-xs text-green-200 mt-0.5 leading-relaxed">{rec.reason}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-green-200 text-center py-4">추천을 불러오지 못했습니다.</p>
      )}
    </div>
  )
}

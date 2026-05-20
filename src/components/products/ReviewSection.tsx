'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Star } from 'lucide-react'

type Review = { id: string; rating: number; content: string; created_at: string; profiles?: { name?: string | null } | null }

export function ReviewSection({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([])

  useEffect(() => {
    const supabase = createClient()
    supabase.from('reviews').select('*, profiles(name)').eq('product_id', productId).order('created_at', { ascending: false }).limit(10)
      .then(({ data }) => setReviews((data ?? []) as Review[]))
  }, [productId])

  if (reviews.length === 0) return (
    <div className="py-12 text-center text-ink-5 text-sm">아직 리뷰가 없어요.</div>
  )

  return (
    <div className="space-y-4">
      {reviews.map((r) => (
        <div key={r.id} className="border-b border-line pb-4">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className={i < r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-line-3'} />
              ))}
            </div>
            <span className="text-xs text-ink-4">{r.profiles?.name ?? '익명'}</span>
          </div>
          <p className="text-sm text-ink">{r.content}</p>
        </div>
      ))}
    </div>
  )
}
'use client'

import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

type Review = {
  id: string
  user_id: string
  rating: number
  content: string | null
  created_at: string
  profiles?: { name: string | null }
}

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => onChange && setHover(star)}
          onMouseLeave={() => onChange && setHover(0)}
          className={onChange ? 'cursor-pointer' : 'cursor-default'}
        >
          <Star
            size={20}
            className={
              star <= (hover || value)
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-line-3'
            }
          />
        </button>
      ))}
    </div>
  )
}

export function ReviewSection({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [myReview, setMyReview] = useState<Review | null>(null)
  const [rating, setRating] = useState(5)
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  async function loadData() {
    const [{ data: reviewsData }, { data: { user } }] = await Promise.all([
      supabase
        .from('reviews')
        .select('*, profiles(name)')
        .eq('product_id', productId)
        .order('created_at', { ascending: false }),
      supabase.auth.getUser(),
    ])
    setReviews((reviewsData ?? []) as Review[])
    setUserId(user?.id ?? null)
    const mine = reviewsData?.find((r) => r.user_id === user?.id)
    if (mine) { setMyReview(mine as Review); setRating(mine.rating); setContent(mine.content ?? '') }
    setLoading(false)
  }

  useEffect(() => { loadData() }, [productId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!userId) return
    setSubmitting(true)
    const payload = { user_id: userId, product_id: productId, rating, content: content.trim() || null }
    if (myReview) {
      await supabase.from('reviews').update({ rating, content: content.trim() || null }).eq('id', myReview.id)
    } else {
      await supabase.from('reviews').insert(payload)
    }
    await loadData()
    setSubmitting(false)
  }

  async function handleDelete() {
    if (!myReview) return
    await supabase.from('reviews').delete().eq('id', myReview.id)
    setMyReview(null)
    setRating(5)
    setContent('')
    await loadData()
  }

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null

  if (loading) return <div className="py-8 text-center text-ink-5 text-sm">로딩 중...</div>

  return (
    <div className="space-y-6">
      {/* 평균 평점 */}
      {avg && (
        <div className="flex items-center gap-3 bg-cream rounded-2xl p-4">
          <span className="text-4xl font-bold text-ink">{avg}</span>
          <div>
            <StarRating value={Math.round(Number(avg))} />
            <p className="text-sm text-ink-4 mt-0.5">리뷰 {reviews.length}개</p>
          </div>
        </div>
      )}

      {/* 리뷰 작성 폼 */}
      {userId ? (
        <div className="bg-surface border border-line rounded-2xl p-5">
          <h3 className="font-semibold text-ink mb-3">
            {myReview ? '내 리뷰 수정' : '리뷰 작성'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <StarRating value={rating} onChange={setRating} />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="이 밀키트를 사용해본 솔직한 후기를 남겨주세요."
              rows={3}
              className="w-full px-3 py-2.5 border border-line-2 rounded-lg text-sm resize-none bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f]"
            />
            <div className="flex gap-2">
              <Button type="submit" size="sm" loading={submitting}>
                {myReview ? '수정하기' : '등록하기'}
              </Button>
              {myReview && (
                <Button type="button" size="sm" variant="secondary" onClick={handleDelete}>
                  삭제
                </Button>
              )}
            </div>
          </form>
        </div>
      ) : (
        <p className="text-sm text-ink-5 text-center py-4">
          리뷰를 작성하려면{' '}
          <a href="/login" className="text-[#2d7a4f] underline">로그인</a>이 필요합니다.
        </p>
      )}

      {/* 리뷰 목록 */}
      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-line pb-4 last:border-0">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-ink">
                    {review.profiles?.name ?? '익명'}
                  </span>
                  <StarRating value={review.rating} />
                </div>
                <span className="text-xs text-ink-5">{formatDate(review.created_at)}</span>
              </div>
              {review.content && (
                <p className="text-sm text-ink-3 leading-relaxed">{review.content}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-ink-5">
          <p>아직 리뷰가 없습니다.</p>
          <p className="text-sm mt-1">첫 번째 리뷰를 작성해보세요!</p>
        </div>
      )}
    </div>
  )
}

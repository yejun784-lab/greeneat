'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Star, Pencil, Loader2, Trash2, ImagePlus, X } from 'lucide-react'
import { toast } from '@/lib/toast-store'

type Review = {
  id: string
  user_id: string
  rating: number
  content: string | null
  images: string[] | null
  created_at: string
  profiles?: { name?: string | null } | null
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          className="p-0.5 transition-transform hover:scale-110"
        >
          <Star
            size={24}
            className={n <= (hovered || value) ? 'text-yellow-400 fill-yellow-400' : 'text-line-3'}
          />
        </button>
      ))}
    </div>
  )
}

function RatingBar({ rating, count, total }: { rating: number; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-3 text-ink-4 text-right">{rating}</span>
      <Star size={10} className="text-yellow-400 fill-yellow-400 shrink-0" />
      <div className="flex-1 bg-line-2 rounded-full h-1.5 overflow-hidden">
        <div className="bg-yellow-400 h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-4 text-ink-5 text-right">{count}</span>
    </div>
  )
}

const MAX_IMAGES = 3

export function ReviewSection({ productId }: { productId: string }) {
  const [reviews, setReviews]             = useState<Review[]>([])
  const [loading, setLoading]             = useState(true)
  const [userId, setUserId]               = useState<string | null>(null)
  const [myReview, setMyReview]           = useState<Review | null>(null)
  const [hasPurchased, setHasPurchased]   = useState(false)

  // 폼 상태
  const [showForm, setShowForm]           = useState(false)
  const [rating, setRating]               = useState(5)
  const [content, setContent]             = useState('')
  const [submitting, setSubmitting]       = useState(false)

  // 이미지 업로드 상태
  const [imageFiles, setImageFiles]       = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [uploading, setUploading]         = useState(false)
  const fileInputRef                      = useRef<HTMLInputElement>(null)

  useEffect(() => { load() }, [productId])

  async function load() {
    setLoading(true)
    const supabase = createClient()

    const [{ data: reviewData }, { data: { user } }] = await Promise.all([
      supabase
        .from('reviews')
        .select('*, profiles(name)')
        .eq('product_id', productId)
        .order('created_at', { ascending: false })
        .limit(20),
      supabase.auth.getUser(),
    ])

    const list = (reviewData ?? []) as Review[]
    setReviews(list)
    setUserId(user?.id ?? null)

    if (user) {
      const mine = list.find((r) => r.user_id === user.id) ?? null
      setMyReview(mine)
      if (mine) {
        setRating(mine.rating)
        setContent(mine.content ?? '')
        setExistingImages(mine.images ?? [])
      }

      const { data: paidOrders } = await supabase
        .from('orders')
        .select('id')
        .eq('user_id', user.id)
        .eq('payment_status', 'paid')
      const paidOrderIds = (paidOrders ?? []).map((o) => o.id)
      if (paidOrderIds.length > 0) {
        const { count } = await supabase
          .from('order_items')
          .select('id', { count: 'exact', head: true })
          .eq('product_id', productId)
          .in('order_id', paidOrderIds)
        setHasPurchased((count ?? 0) > 0)
      } else {
        setHasPurchased(false)
      }
    }

    setLoading(false)
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    const remaining = MAX_IMAGES - existingImages.length - imageFiles.length
    const selected = files.slice(0, remaining)
    if (files.length > remaining) {
      toast.error(`최대 ${MAX_IMAGES}장까지 첨부할 수 있어요.`)
    }
    const newPreviews = selected.map((f) => URL.createObjectURL(f))
    setImageFiles((prev) => [...prev, ...selected])
    setImagePreviews((prev) => [...prev, ...newPreviews])
    // input 초기화 (같은 파일 재선택 허용)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function removeNewImage(idx: number) {
    URL.revokeObjectURL(imagePreviews[idx])
    setImageFiles((prev) => prev.filter((_, i) => i !== idx))
    setImagePreviews((prev) => prev.filter((_, i) => i !== idx))
  }

  function removeExistingImage(idx: number) {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx))
  }

  async function uploadImages(uid: string): Promise<string[]> {
    if (imageFiles.length === 0) return []
    const supabase = createClient()
    const urls: string[] = []
    for (const file of imageFiles) {
      const ext = file.name.split('.').pop() ?? 'jpg'
      const path = `${uid}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
      const { error } = await supabase.storage
        .from('review-images')
        .upload(path, file, { cacheControl: '3600', upsert: false })
      if (error) { toast.error('이미지 업로드 실패: ' + error.message); continue }
      const { data: { publicUrl } } = supabase.storage
        .from('review-images')
        .getPublicUrl(path)
      urls.push(publicUrl)
    }
    return urls
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!userId) { toast.error('로그인이 필요해요.'); return }
    if (rating === 0) { toast.error('별점을 선택해주세요.'); return }
    setSubmitting(true)
    setUploading(imageFiles.length > 0)

    const newUrls = await uploadImages(userId)
    const finalImages = [...existingImages, ...newUrls]
    setUploading(false)

    const supabase = createClient()
    if (myReview) {
      const { error } = await supabase
        .from('reviews')
        .update({ rating, content, images: finalImages })
        .eq('id', myReview.id)
      if (error) { toast.error('수정에 실패했어요.'); setSubmitting(false); return }
      toast.success('리뷰가 수정됐어요.')
    } else {
      const { error } = await supabase
        .from('reviews')
        .insert({ product_id: productId, user_id: userId, rating, content, images: finalImages })
      if (error) { toast.error('리뷰 등록에 실패했어요.'); setSubmitting(false); return }
      supabase.rpc('increment_points', { uid: userId, amount: 200 }).then(() => {})
      const bonus = newUrls.length > 0 ? ' +사진 리뷰 보너스 100P 🏆' : ''
      toast.success(`리뷰가 등록됐어요! +200P 적립 🎉${bonus}`)
      // 사진 리뷰 보너스 포인트
      if (newUrls.length > 0) {
        supabase.rpc('increment_points', { uid: userId, amount: 100 }).then(() => {})
      }
    }

    // 폼 초기화
    setShowForm(false)
    setImageFiles([])
    imagePreviews.forEach((url) => URL.revokeObjectURL(url))
    setImagePreviews([])
    await load()
    setSubmitting(false)
  }

  async function handleDelete() {
    if (!myReview || !confirm('리뷰를 삭제하시겠어요?')) return
    const supabase = createClient()
    await supabase.from('reviews').delete().eq('id', myReview.id)
    toast.info('리뷰가 삭제됐어요.')
    setMyReview(null)
    setRating(5)
    setContent('')
    setExistingImages([])
    await load()
  }

  const total = reviews.length
  const avg = total > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0
  const dist = [5, 4, 3, 2, 1].map((n) => ({
    rating: n,
    count: reviews.filter((r) => r.rating === n).length,
  }))

  const totalSlots = existingImages.length + imageFiles.length

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 size={24} className="animate-spin text-ink-5" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 평점 요약 */}
      {total > 0 && (
        <div className="flex flex-col sm:flex-row gap-6 bg-cream rounded-2xl p-5">
          <div className="flex flex-col items-center justify-center sm:w-32 shrink-0">
            <span className="text-5xl font-bold text-ink">{avg.toFixed(1)}</span>
            <div className="flex gap-0.5 my-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} size={14} className={n <= Math.round(avg) ? 'text-yellow-400 fill-yellow-400' : 'text-line-3'} />
              ))}
            </div>
            <span className="text-xs text-ink-5">{total}개의 리뷰</span>
          </div>
          <div className="flex-1 space-y-1.5 justify-center flex flex-col">
            {dist.map((d) => (
              <RatingBar key={d.rating} rating={d.rating} count={d.count} total={total} />
            ))}
          </div>
        </div>
      )}

      {/* 리뷰 작성 버튼 / 폼 */}
      {userId && hasPurchased && (
        <div>
          {!showForm ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-4 py-2.5 border border-[#2d7a4f] text-[#2d7a4f] rounded-xl text-sm font-medium hover:bg-green-tint transition-colors"
              >
                <Pencil size={14} />
                {myReview ? '내 리뷰 수정' : '리뷰 작성'}
              </button>
              {myReview && (
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-1.5 px-3 py-2.5 text-xs text-red-400 hover:text-red-500 border border-red-200 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 size={12} /> 삭제
                </button>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-surface border border-[#2d7a4f]/20 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-ink">
                  {myReview ? '리뷰 수정' : '리뷰 작성'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setImageFiles([])
                    imagePreviews.forEach((url) => URL.revokeObjectURL(url))
                    setImagePreviews([])
                    if (myReview) setExistingImages(myReview.images ?? [])
                  }}
                  className="text-xs text-ink-5 hover:text-ink-3"
                >
                  취소
                </button>
              </div>

              <div>
                <p className="text-xs text-ink-4 mb-2">별점</p>
                <StarPicker value={rating} onChange={setRating} />
              </div>

              <div>
                <p className="text-xs text-ink-4 mb-2">리뷰 내용</p>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="이 상품은 어떠셨나요? 솔직한 리뷰를 남겨주세요."
                  rows={4}
                  maxLength={500}
                  className="w-full px-3 py-2.5 border border-line-2 rounded-xl text-sm bg-surface text-ink placeholder:text-ink-5 focus:outline-none focus:ring-2 focus:ring-[#2d7a4f] resize-none"
                />
                <p className="text-right text-xs text-ink-5 mt-1">{content.length}/500</p>
              </div>

              {/* 이미지 업로드 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-ink-4">사진 첨부 <span className="text-ink-5">(선택 · 최대 {MAX_IMAGES}장)</span></p>
                  {totalSlots === 0 && (
                    <span className="text-[10px] text-[#2d7a4f] bg-green-tint px-2 py-0.5 rounded-full font-medium">
                      사진 리뷰 +100P
                    </span>
                  )}
                </div>
                <div className="flex gap-2 flex-wrap">
                  {/* 기존 이미지 (수정 시) */}
                  {existingImages.map((url, i) => (
                    <div key={`exist-${i}`} className="relative w-20 h-20 rounded-xl overflow-hidden bg-wash border border-line-2">
                      <Image src={url} alt={`리뷰 이미지 ${i + 1}`} fill className="object-cover" sizes="80px" />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(i)}
                        className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80"
                      >
                        <X size={10} className="text-white" />
                      </button>
                    </div>
                  ))}
                  {/* 새로 추가한 이미지 미리보기 */}
                  {imagePreviews.map((url, i) => (
                    <div key={`new-${i}`} className="relative w-20 h-20 rounded-xl overflow-hidden bg-wash border border-[#2d7a4f]/30">
                      <Image src={url} alt={`새 이미지 ${i + 1}`} fill className="object-cover" sizes="80px" />
                      <button
                        type="button"
                        onClick={() => removeNewImage(i)}
                        className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center hover:bg-black/80"
                      >
                        <X size={10} className="text-white" />
                      </button>
                    </div>
                  ))}
                  {/* 추가 버튼 */}
                  {totalSlots < MAX_IMAGES && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-20 h-20 rounded-xl border-2 border-dashed border-line-2 flex flex-col items-center justify-center gap-1 hover:border-[#2d7a4f] hover:bg-green-tint transition-colors text-ink-5 hover:text-[#2d7a4f]"
                    >
                      <ImagePlus size={18} />
                      <span className="text-[10px]">{totalSlots}/{MAX_IMAGES}</span>
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  multiple
                  className="hidden"
                  onChange={handleImageSelect}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-[#2d7a4f] text-white text-sm font-semibold rounded-xl hover:bg-[#235f3d] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {(submitting || uploading) && <Loader2 size={14} className="animate-spin" />}
                {uploading ? '이미지 업로드 중...' : myReview ? '수정하기' : '등록하기'}
              </button>
            </form>
          )}
        </div>
      )}

      {userId && !hasPurchased && !myReview && (
        <p className="text-xs text-ink-5 bg-tint rounded-xl px-4 py-3">
          구매한 상품에만 리뷰를 남길 수 있어요.
        </p>
      )}

      {!userId && (
        <p className="text-xs text-ink-5 bg-tint rounded-xl px-4 py-3">
          리뷰를 작성하려면 <a href="/login" className="text-[#2d7a4f] underline underline-offset-2">로그인</a>이 필요해요.
        </p>
      )}

      {/* 리뷰 목록 */}
      {reviews.length === 0 ? (
        <div className="py-12 text-center text-ink-5 text-sm">
          아직 리뷰가 없어요. 첫 리뷰를 남겨보세요!
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div
              key={r.id}
              className={`border-b border-line pb-4 last:border-0 ${r.user_id === userId ? 'bg-green-tint/30 rounded-xl p-4 border-none' : ''}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={12} className={i <= r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-line-3'} />
                    ))}
                  </div>
                  <span className="text-xs font-medium text-ink-3">
                    {r.profiles?.name ?? '익명'}
                    {r.user_id === userId && (
                      <span className="ml-1.5 text-[10px] text-[#2d7a4f] font-semibold bg-green-tint px-1.5 py-0.5 rounded-full">내 리뷰</span>
                    )}
                  </span>
                </div>
                <span className="text-[10px] text-ink-5">
                  {new Date(r.created_at).toLocaleDateString('ko-KR')}
                </span>
              </div>

              {r.content && <p className="text-sm text-ink leading-relaxed mb-3">{r.content}</p>}

              {/* 리뷰 이미지 */}
              {(r.images ?? []).length > 0 && (
                <div className="flex gap-2 flex-wrap mt-2">
                  {(r.images ?? []).map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block w-20 h-20 rounded-xl overflow-hidden bg-wash border border-line-2 hover:opacity-90 transition-opacity">
                      <Image
                        src={url}
                        alt={`리뷰 사진 ${i + 1}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

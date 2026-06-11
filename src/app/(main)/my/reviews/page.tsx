import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { ChevronLeft, Star, MessageSquareText } from 'lucide-react'

const IMAGE_BASE =
  'https://nbdpckerbphyfnjzqiqp.supabase.co/storage/v1/object/public/product-images/greeneat/'

function resolveImageUrl(imageUrl: string | null | undefined): string | null {
  if (!imageUrl) return null
  return imageUrl.startsWith('http') ? imageUrl : `${IMAGE_BASE}${imageUrl}`
}

type ReviewProduct = {
  id: string
  name: string
  image_url: string | null
}

type ReviewRow = {
  id: string
  rating: number
  content: string | null
  images: string[] | null
  created_at: string
  products: ReviewProduct | ReviewProduct[] | null
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={14}
          className={n <= rating ? 'text-yellow-400' : 'text-line-2'}
          fill={n <= rating ? 'currentColor' : 'none'}
        />
      ))}
    </div>
  )
}

export default async function MyReviewsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('reviews')
    .select('id, rating, content, images, created_at, products(id, name, image_url)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const reviews = (data ?? []) as ReviewRow[]

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-2 mb-8">
        <Link href="/my" className="p-1 text-ink-5 hover:text-ink-2">
          <ChevronLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-ink">내가 쓴 리뷰</h1>
        <span className="text-sm text-ink-5">({reviews.length}개)</span>
      </div>

      {reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => {
            const p = review.products
            const product = Array.isArray(p) ? p[0] : p
            const productImage = resolveImageUrl(product?.image_url)

            return (
              <div key={review.id} className="bg-surface rounded-2xl border border-line p-5">
                <div className="flex items-center gap-3 mb-3">
                  {productImage ? (
                    <Image
                      src={productImage}
                      alt={product?.name ?? '상품'}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-xl object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-tint shrink-0" />
                  )}
                  <div className="min-w-0 flex-1">
                    {product ? (
                      <Link
                        href={`/products/${product.id}?tab=reviews`}
                        className="text-sm font-semibold text-ink hover:text-[#2d7a4f] transition-colors truncate block"
                      >
                        {product.name}
                      </Link>
                    ) : (
                      <span className="text-sm font-semibold text-ink-4">삭제된 상품</span>
                    )}
                    <span className="text-xs text-ink-5">{formatDate(review.created_at)}</span>
                  </div>
                </div>

                <StarRating rating={review.rating} />

                {review.content && (
                  <p className="mt-2 text-sm text-ink-3 whitespace-pre-line">{review.content}</p>
                )}

                {review.images && review.images.length > 0 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto">
                    {review.images.map((url, i) => (
                      <Image
                        key={`${review.id}-img-${i}`}
                        src={url}
                        alt={`리뷰 사진 ${i + 1}`}
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-xl object-cover border border-line shrink-0"
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center py-20 text-center">
          <div className="relative w-28 h-28 mb-5">
            <div className="absolute inset-0 bg-tint rounded-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <MessageSquareText size={44} className="text-[#2d7a4f]/40" strokeWidth={1.5} />
            </div>
          </div>
          <p className="text-base font-semibold text-ink-2 mb-1">아직 작성한 리뷰가 없어요</p>
          <p className="text-sm text-ink-4 mb-7">주문 내역에서 리뷰를 작성해보세요</p>
          <Link
            href="/my/orders"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#2d7a4f] text-white rounded-xl text-sm font-semibold hover:bg-[#235f3d] transition-colors"
          >
            주문 내역 보기
          </Link>
        </div>
      )}
    </div>
  )
}

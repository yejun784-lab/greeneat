'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Minus, Plus, ShoppingCart, RefreshCw, Gift, Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useCartStore } from '@/lib/cart-store'
import { formatPrice, DIFFICULTY_LABEL } from '@/lib/utils'
import { toast } from '@/lib/toast-store'
import { NutritionBadge } from '@/components/products/NutritionBadge'
import { ReviewSection } from '@/components/products/ReviewSection'
import { RelatedProducts } from '@/components/products/RelatedProducts'
import { CalcNutrition } from '@/components/products/CalcNutrition'
import { RestockAlert } from '@/components/products/RestockAlert'
import { ShareButton } from '@/components/products/ShareButton'
import { Button } from '@/components/ui/Button'
import { useRecentlyViewedStore } from '@/lib/recently-viewed-store'
import { useWishlist } from '@/hooks/useWishlist'
import { useWishlistStore } from '@/lib/wishlist-store'
import type { Product } from '@/types'

type RecipeStep = {
  id: string
  step_number: number
  title: string
  description: string
  duration_minutes: number | null
}

type Tab = 'info' | 'calc' | 'recipe' | 'reviews'
type GalleryImage = { id: string; url: string; order: number }

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [recipeSteps, setRecipeSteps] = useState<RecipeStep[]>([])
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([])
  const [activeImage, setActiveImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState<Tab>('info')
  const [added, setAdded] = useState(false)
  const addedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const addItem = useCartStore((s) => s.addItem)
  const addRecentlyViewed = useRecentlyViewedStore((s) => s.add)
  const { toggle: toggleWishlist } = useWishlist()
  const wishedIds = useWishlistStore((s) => s.ids)

  // timer cleanup on unmount
  useEffect(() => {
    return () => { if (addedTimerRef.current) clearTimeout(addedTimerRef.current) }
  }, [])

  useEffect(() => {
    async function load() {
      try {
        const supabase = createClient()
        const [{ data: productData, error: productErr }, { data: stepsData }, { data: imagesData }] = await Promise.all([
          supabase
            .from('products')
            .select('*, product_categories(id, name, slug, description)')
            .eq('id', params.id as string)
            .single(),
          supabase
            .from('recipe_steps')
            .select('*')
            .eq('product_id', params.id as string)
            .order('step_number'),
          supabase
            .from('product_images')
            .select('*')
            .eq('product_id', params.id as string)
            .order('order'),
        ])
        if (productErr || !productData) {
          setProduct(null)
          setLoading(false)
          return
        }
        const p = productData as Product
        setProduct(p)
        setRecipeSteps((stepsData ?? []) as RecipeStep[])
        setGalleryImages((imagesData ?? []) as GalleryImage[])
        if (p) addRecentlyViewed(p)
      } catch {
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.id, addRecentlyViewed])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-[#2d7a4f] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-24">
        <p className="text-ink-4">상품을 찾을 수 없습니다.</p>
        <Link href="/products" className="mt-4 inline-block text-[#2d7a4f] underline">
          목록으로 돌아가기
        </Link>
      </div>
    )
  }

  function handleAddToCart(isSubscription = false) {
    if (!product) return
    for (let i = 0; i < quantity; i++) addItem(product, isSubscription)
    if (addedTimerRef.current) clearTimeout(addedTimerRef.current)
    setAdded(true)
    addedTimerRef.current = setTimeout(() => setAdded(false), 2000)
    if (isSubscription) {
      toast.success(`${product.name}이(가) 구독 장바구니에 담겼습니다.`)
    } else {
      toast.success(`${product.name}이(가) 장바구니에 담겼습니다. 🛒`)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* 뒤로가기 + 공유 */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-sm text-ink-4 hover:text-ink-2"
        >
          <ChevronLeft size={16} />
          돌아가기
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => product && toggleWishlist(product.id)}
            className={`p-2 rounded-xl border transition-colors ${
              product && wishedIds.has(product.id)
                ? 'border-red-300 bg-red-50 text-red-500'
                : 'border-line-2 text-ink-4 hover:border-red-200 hover:text-red-400'
            }`}
            title="찜하기"
          >
            <Heart size={18} fill={product && wishedIds.has(product.id) ? 'currentColor' : 'none'} />
          </button>
          <ShareButton productName={product?.name ?? ''} productId={params.id as string} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* 이미지 갤러리 */}
        <div className="space-y-3">
          {/* 메인 이미지 */}
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-wash group">
            {(galleryImages[activeImage]?.url ?? product.image_url) && (
              <Image
                src={galleryImages[activeImage]?.url ?? product.image_url!}
                alt={product.name}
                fill
                className="object-cover transition-all duration-300"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            )}
            {product.is_subscription && (
              <span className="absolute top-3 left-3 bg-[#2d7a4f] text-white text-xs font-medium px-3 py-1 rounded-full z-10">
                구독 가능
              </span>
            )}
            {/* 이전/다음 버튼 */}
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImage((i) => (i - 1 + galleryImages.length) % galleryImages.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setActiveImage((i) => (i + 1) % galleryImages.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity z-10"
                >
                  <ChevronRight size={16} />
                </button>
                {/* 인디케이터 */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {galleryImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`w-1.5 h-1.5 rounded-full transition-all ${i === activeImage ? 'bg-white w-4' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          {/* 썸네일 */}
          {galleryImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {galleryImages.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    i === activeImage ? 'border-[#2d7a4f]' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image src={img.url} alt={`이미지 ${i + 1}`} fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 상세 정보 */}
        <div>
          {product.product_categories && (
            <Link
              href={`/products?category=${product.product_categories.slug}`}
              className="text-xs text-[#2d7a4f] font-medium hover:underline"
            >
              {product.product_categories.name}
            </Link>
          )}
          <h1 className="text-2xl font-bold text-ink mt-1 mb-2">{product.name}</h1>
          {product.description && (
            <p className="text-ink-4 text-sm leading-relaxed mb-4">{product.description}</p>
          )}

          <NutritionBadge product={product} />

          <div className="mt-4 py-4 border-y border-line">
            <span className="text-3xl font-bold text-ink">{formatPrice(product.price)}</span>
            <span className="ml-2 text-sm text-ink-5">/ 1회</span>
          </div>

          {/* 수량 */}
          <div className="flex items-center gap-4 mt-5">
            <span className="text-sm font-medium text-ink-2">수량</span>
            <div className="flex items-center gap-2 border border-line-2 rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-9 h-9 flex items-center justify-center hover:bg-wash transition-colors text-ink"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-sm font-medium text-ink">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                className="w-9 h-9 flex items-center justify-center hover:bg-wash transition-colors text-ink"
              >
                <Plus size={14} />
              </button>
            </div>
            <span className="text-sm font-semibold text-ink">
              {formatPrice(product.price * quantity)}
            </span>
          </div>

          {/* 버튼 */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            {product.stock > 0 ? (
              <>
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={() => handleAddToCart(false)}
                  loading={added}
                >
                  <ShoppingCart size={18} />
                  {added ? '담았습니다!' : '장바구니 담기'}
                </Button>
                {product.is_subscription && (
                  <Button
                    size="lg"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => handleAddToCart(true)}
                  >
                    <RefreshCw size={18} />
                    구독 담기
                  </Button>
                )}
              </>
            ) : (
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  <span className="text-sm font-medium text-red-500">현재 품절된 상품입니다</span>
                </div>
                <RestockAlert productId={product.id} productName={product.name} />
              </div>
            )}
          </div>

          {/* 선물하기 */}
          <Link
            href={`/gift?product=${product.id}`}
            className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-red-200 text-red-400 hover:bg-red-50 hover:border-red-300 transition-colors text-sm font-medium"
          >
            <Gift size={15} />
            선물하기
          </Link>
        </div>
      </div>

      {/* 탭 */}
      <div className="mt-12">
        <div className="flex border-b border-line-2 mb-6 overflow-x-auto scrollbar-none">
          {(['info', 'calc', 'recipe', 'reviews'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-[#2d7a4f] text-[#2d7a4f]'
                  : 'border-transparent text-ink-4 hover:text-ink-2'
              }`}
            >
              {tab === 'info' ? '기본 정보' : tab === 'calc' ? '영양 계산기' : tab === 'recipe' ? '레시피' : '리뷰'}
            </button>
          ))}
        </div>

        {activeTab === 'info' && (
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              ['칼로리', product.calories ? `${product.calories} kcal` : '-'],
              ['단백질', product.protein ? `${product.protein} g` : '-'],
              ['탄수화물', product.carbs ? `${product.carbs} g` : '-'],
              ['지방', product.fat ? `${product.fat} g` : '-'],
              ['인분', `${product.servings} 인분`],
              ['조리 시간', product.cook_time ? `${product.cook_time} 분` : '-'],
              ['난이도', DIFFICULTY_LABEL[product.difficulty] ?? product.difficulty],
              ['재고', product.stock > 0 ? `${product.stock}개` : '품절'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between py-2.5 border-b border-line">
                <span className="text-sm text-ink-4">{label}</span>
                <span className="text-sm font-medium text-ink">{value}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'calc' && <CalcNutrition product={product} />}

        {activeTab === 'recipe' && (
          recipeSteps.length > 0 ? (
            <div className="space-y-4">
              {recipeSteps.map((step) => (
                <div key={step.id} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#2d7a4f] text-white text-sm font-bold flex items-center justify-center">
                    {step.step_number}
                  </div>
                  <div className="flex-1 bg-surface border border-line rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-ink">{step.title}</h4>
                      {step.duration_minutes && (
                        <span className="text-xs text-ink-5 bg-wash px-2 py-0.5 rounded-full">
                          {step.duration_minutes}분
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-ink-3 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-cream rounded-2xl p-6 text-center text-ink-4">
              <p className="text-lg mb-2">🍳 레시피 준비 중</p>
              <p className="text-sm">상세 레시피가 곧 업데이트될 예정입니다.</p>
            </div>
          )
        )}

        {activeTab === 'reviews' && (
          <ReviewSection productId={product.id} />
        )}
      </div>

      {/* 관련 상품 */}
      <RelatedProducts productId={product.id} categoryId={product.category_id} />
    </div>
  )
}

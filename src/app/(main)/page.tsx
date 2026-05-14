import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/products/ProductCard'
import { RecentlyViewed } from '@/components/products/RecentlyViewed'

export const metadata: Metadata = {
  title: 'GreenEat — 진정성 있는 건강한 도시락',
  description: '진정성 있는 건강한 선택, 맛있는 도시락. 바쁜 일상 속 건강한 한 끼를 GreenEat 도시락으로 간편하게.',
  openGraph: {
    title: 'GreenEat — 진정성 있는 건강한 도시락',
    description: '진정성 있는 건강한 선택, 맛있는 도시락.',
    type: 'website',
  },
}
import { Button } from '@/components/ui/Button'
import type { Product } from '@/types'

const CATEGORIES = [
  { slug: 'lunchbox', name: '간편식', emoji: '🍱', desc: '든든한 한끼 도시락' },
  { slug: 'bakery', name: '베이커리&샐러드', emoji: '🥗', desc: '신선하고 가벼운 한 끼' },
  { slug: 'health', name: '건강식품', emoji: '💪', desc: '영양 균형 특화 메뉴' },
  { slug: 'diet', name: '맞춤식단', emoji: '🌿', desc: '목표별 식단 관리' },
]

async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('*, product_categories(id, name, slug, description)')
    .limit(8)
    .order('created_at', { ascending: false })
  return (data as Product[]) ?? []
}

export default async function HomePage() {
  const products = await getFeaturedProducts()

  return (
    <div>
      {/* 히어로 섹션 — 의도적으로 다크, 라이트/다크 모드 무관 */}
      <section className="relative min-h-[560px] flex items-center bg-gradient-to-br from-[#1a4a2e] via-[#2d7a4f] to-[#4caf72] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-64 h-64 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-white blur-2xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-white/20 text-white text-sm font-medium px-3 py-1 rounded-full mb-4">
              🥗 진정성 있는 건강한 선택
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-5">
              바쁜 일상 속<br />건강한 한 끼
            </h1>
            <p className="text-green-100 text-lg mb-8 leading-relaxed">
              직접 만든 정직한 재료로 완성한<br />맛있고 건강한 냉동 도시락을 매일 즐겨보세요.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/products">
                <Button size="lg" variant="ghost" className="!bg-white !text-[#2d7a4f] hover:!bg-gray-50 font-semibold shadow-sm">
                  도시락 둘러보기
                </Button>
              </Link>
              <Link href="/subscription">
                <Button size="lg" variant="secondary" className="border-white text-white hover:bg-white/10">
                  정기구독 보기
                </Button>
              </Link>
            </div>
            <div className="flex gap-8 mt-10">
              {[['20+', '다양한 도시락'], ['최저 4,900원', '한끼 가격'], ['100%', '건강 재료']].map(([num, label]) => (
                <div key={label}>
                  <p className="text-white font-bold text-xl">{num}</p>
                  <p className="text-green-200 text-sm">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden md:block">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-4 rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://ecimg.cafe24img.com/pg2495b61354611092/greeneat0419/web/upload/goodymall/kr/main/main_img02.jpg"
                  alt="그린잇 도시락"
                  fill
                  sizes="(max-width: 1280px) 400px, 500px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 카테고리 퀵 링크 */}
      <section className="bg-cream py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/products?category=${cat.slug}`}
                className="flex items-center gap-3 bg-surface rounded-2xl p-4 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group"
              >
                <span className="text-3xl">{cat.emoji}</span>
                <div>
                  <p className="font-semibold text-ink group-hover:text-[#2d7a4f] transition-colors">
                    {cat.name}
                  </p>
                  <p className="text-xs text-ink-4">{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 인기 상품 */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-ink">인기 도시락</h2>
              <p className="text-ink-4 mt-1">GreenEat에서 가장 사랑받는 메뉴</p>
            </div>
            <Link href="/products" className="text-sm font-medium text-[#2d7a4f] hover:underline">
              전체 보기 →
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-ink-5">
              <p className="text-lg">준비 중인 메뉴가 곧 업데이트됩니다.</p>
            </div>
          )}
        </div>
      </section>

      {/* 최근 본 상품 */}
      <RecentlyViewed />

      {/* 구독 플랜 배너 — 의도적으로 다크 */}
      <section className="bg-[#1a4a2e] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">도시락 정기구독으로 더 건강하게</h2>
          <p className="text-green-200 text-lg mb-8">
            매일 배달되는 건강한 도시락 · 구독 시 최대 20% 할인 + 무료 배송
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-10">
            {[
              { plan: '라이트', price: '49,900', meals: '주 5개', discount: '10%' },
              { plan: '스탠다드', price: '89,900', meals: '주 10개', discount: '15%', popular: true },
              { plan: '풀케어', price: '149,900', meals: '주 21개', discount: '20%' },
            ].map((p) => (
              <div
                key={p.plan}
                className={`rounded-2xl p-5 text-left ${p.popular ? 'bg-[#2d7a4f] ring-2 ring-[#4caf72]' : 'bg-white/10'}`}
              >
                {p.popular && (
                  <span className="inline-block bg-[#4caf72] text-white text-xs font-bold px-2 py-0.5 rounded-full mb-2">
                    인기
                  </span>
                )}
                <p className="text-white font-semibold text-lg">{p.plan}</p>
                <p className="text-green-200 text-sm">{p.meals} · 할인 {p.discount}</p>
                <p className="text-white font-bold text-2xl mt-2">
                  {p.price}
                  <span className="text-sm font-normal text-green-200">원/월</span>
                </p>
              </div>
            ))}
          </div>
          <Link href="/subscription">
            <Button size="lg" variant="ghost" className="!bg-white !text-[#2d7a4f] hover:!bg-gray-50 font-semibold shadow-sm">
              구독 시작하기
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/products/ProductCard'
import { RecentlyViewed } from '@/components/products/RecentlyViewed'
import { InstagramGrid } from '@/components/home/InstagramGrid'
import { AnimateIn } from '@/components/ui/AnimateIn'
import { CountUp } from '@/components/ui/CountUp'
import { FlashSaleSection } from '@/components/home/FlashSaleSection'
import type { FlashSaleItem } from '@/components/home/FlashSaleSection'
import { CollectionsBanner } from '@/components/home/CollectionsBanner'
import { PersonalizedSection } from '@/components/home/PersonalizedSection'
import { HeroCollage } from '@/components/home/HeroCollage'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'

export const metadata: Metadata = {
  title: 'GreenEat — 진정성 있는 건강한 도시락',
  description: '진정성 있는 건강한 선택, 맛있는 도시락. 바쁜 일상 속 건강한 한 끼를 GreenEat 도시락으로 간편하게.',
  openGraph: {
    title: 'GreenEat — 진정성 있는 건강한 도시락',
    description: '진정성 있는 건강한 선택, 맛있는 도시락.',
    type: 'website',
  },
}

const CATEGORIES = [
  { slug: 'lunchbox', name: '간편식',        desc: '한끼 · 만렙 도시락',  emoji: '🍱', color: 'bg-[#e8f5ee] dark:bg-[#243828]', text: 'text-[#2d7a4f] dark:text-[#7acc80]' },
  { slug: 'bakery',   name: '베이커리&샐러드', desc: '그래놀라 · 샐러드',   emoji: '🥗', color: 'bg-[#fff7ed] dark:bg-[#3e2c18]', text: 'text-[#c2762a] dark:text-[#e0a060]' },
  { slug: 'health',   name: '건강식품',       desc: '수제 만두 · 건강간식', emoji: '🥦', color: 'bg-[#f0f4ff] dark:bg-[#1e2e40]', text: 'text-[#4a6fa5] dark:text-[#7aaee0]' },
  { slug: 'diet',     name: '맞춤식단',       desc: '닭가슴살 · 저칼로리',  emoji: '💪', color: 'bg-[#fdf0f5] dark:bg-[#3a2030]', text: 'text-[#b05d7a] dark:text-[#e090b8]' },
]

async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = await createClient()
  // display_group 순 정렬: 박스(1) → 접시(2) → 샐러드/기타(3)
  const { data } = await supabase
    .from('products')
    .select('*, product_categories(id, name, slug, description)')
    .eq('is_active', true)
    .order('display_group', { ascending: true })
    .order('created_at', { ascending: false })
    .limit(9)
  return (data as Product[]) ?? []
}

async function getTrendingProducts(): Promise<(Product & { order_count: number })[]> {
  const supabase = await createClient()
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  // 최근 7일 order_items에서 product_id 빈도 집계
  const { data: items } = await supabase
    .from('order_items')
    .select('product_id')
    .gte('created_at', since)
    .limit(1000)

  if (!items || items.length === 0) return []

  const freq: Record<string, number> = {}
  for (const r of items) {
    const pid = String(r.product_id)
    freq[pid] = (freq[pid] ?? 0) + 1
  }

  const topIds = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([id]) => id)

  if (topIds.length === 0) return []

  const { data } = await supabase
    .from('products')
    .select('*, product_categories(id, name, slug, description)')
    .in('id', topIds)
    .eq('is_active', true)

  return ((data ?? []) as Product[])
    .map(p => ({ ...p, order_count: freq[p.id] ?? 0 }))
    .sort((a, b) => b.order_count - a.order_count) as (Product & { order_count: number })[]
}

async function getNewProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { data } = await supabase
    .from('products')
    .select('*, product_categories(id, name, slug, description)')
    .eq('is_active', true)
    .gte('created_at', sevenDaysAgo)
    .order('created_at', { ascending: false })
    .limit(6)
  return (data as Product[]) ?? []
}

async function getFlashSales(): Promise<FlashSaleItem[]> {
  const supabase = await createClient()
  const now = new Date().toISOString()
  const { data } = await supabase
    .from('flash_sales')
    .select('id, discount_rate, ends_at, product:products(*, product_categories(id, name, slug, description))')
    .eq('is_active', true)
    .lte('starts_at', now)
    .gt('ends_at', now)
    .order('ends_at', { ascending: true })
    .limit(6)
  if (!data) return []
  return data.map((row: any) => ({
    id: row.id,
    discount_rate: row.discount_rate,
    ends_at: row.ends_at,
    product: row.product as Product,
  }))
}

export default async function HomePage() {
  const [products, newProducts, trendingProducts, flashSales] = await Promise.all([
    getFeaturedProducts(),
    getNewProducts(),
    getTrendingProducts(),
    getFlashSales(),
  ])

  return (
    <div className="bg-wash">

      {/* ── 히어로 ──────────────────────────────────────────────── */}
      <section className="bg-surface">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid md:grid-cols-2 gap-8 items-center py-16 md:py-20">

            {/* 텍스트 */}
            <div className="animate-fade-up order-2 md:order-1">
              <span className="inline-flex items-center gap-1.5 bg-[#e8f5ee] text-[#2d7a4f] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
                🌿 진정성 있는 건강한 선택
              </span>
              <h1 className="text-display text-3xl sm:text-4xl lg:text-[3.5rem] text-ink leading-[1.12] mb-5">
                바쁜 일상 속<br />
                <span className="text-[#2d7a4f]">건강한 한 끼</span>
              </h1>
              <p className="hero-desc text-[#666] text-[17px] leading-relaxed mb-8 font-light">
                직접 만든 정직한 재료로 완성한<br />
                냉동 도시락을 매일 즐겨보세요.
              </p>
              <div className="flex flex-wrap gap-3 mb-12">
                <Link
                  href="/products"
                  className="inline-flex items-center px-7 py-3.5 bg-[#2d7a4f] text-white font-semibold rounded-full text-sm hover:bg-[#235f3d] transition-colors shadow-sm shadow-[#2d7a4f]/20"
                >
                  도시락 보기
                </Link>
                <Link
                  href="/subscription"
                  className="inline-flex items-center px-7 py-3.5 bg-surface text-ink-2 font-semibold rounded-full text-sm hover:bg-[#f0faf4] hover:text-[#2d7a4f] hover:border-[#2d7a4f] transition-colors border border-[#ccc]"
                >
                  정기구독
                </Link>
              </div>

              {/* 스탯 — 카운트업 */}
              <div className="flex gap-5 sm:gap-8 pt-8 border-t border-line">
                {([
                  { end: 20, suffix: '+', label: '다양한 메뉴' },
                  { end: 4900, prefix: '', suffix: '원~', label: '한끼 가격' },
                  { end: 100, suffix: '%', label: '건강 재료' },
                ] as { end: number; prefix?: string; suffix: string; label: string }[]).map((stat) => (
                  <div key={stat.label}>
                    <p className="text-ink font-bold text-xl tracking-tight">
                      <CountUp end={stat.end} prefix={stat.prefix} suffix={stat.suffix} duration={1600} />
                    </p>
                    <p className="text-ink-4 text-xs mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 이미지 콜라주 — 메뉴 풀 10종이 한 칸씩 번갈아 회전 */}
            <div className="order-1 md:order-2 animate-fade-up delay-150">
              <HeroCollage />
            </div>
          </div>
        </div>
      </section>

      {/* ── 카테고리 ──────────────────────────────────────────────── */}
      <section className="py-14 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CATEGORIES.map((cat, i) => (
            <AnimateIn key={cat.slug} direction="up" delay={i * 80} duration={500}>
            <Link
              href={`/products?category=${cat.slug}`}
              className={`group ${cat.color} rounded-2xl p-5 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between min-h-[130px]`}
            >
              <div>
                <span className="text-3xl mb-3 block">{cat.emoji}</span>
                <p className={`font-bold text-base leading-tight ${cat.text}`}>{cat.name}</p>
                <p className="text-ink-4 text-xs mt-1.5 leading-relaxed">{cat.desc}</p>
              </div>
              <p className={`text-xs font-semibold mt-4 ${cat.text} opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all`}>
                보러가기 →
              </p>
            </Link>
            </AnimateIn>
          ))}
        </div>
      </section>

      {/* ── 타임세일 ─────────────────────────────────────────────── */}
      {flashSales.length > 0 && (
        <AnimateIn direction="up" duration={500}>
          <FlashSaleSection items={flashSales} />
        </AnimateIn>
      )}

      {/* ── 개인화 추천 (로그인 시) ───────────────────────────────── */}
      <PersonalizedSection />

      {/* ── 기획전 ───────────────────────────────────────────────── */}
      <CollectionsBanner />

      {/* ── 인기 급상승 ──────────────────────────────────────────── */}
      {trendingProducts.length > 0 && (
        <section className="py-10 pb-4 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
          <AnimateIn direction="up" duration={500}>
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-[11px] font-semibold text-[#e8734a] tracking-[0.15em] uppercase mb-2">Trending Now</p>
              <h2 className="text-display text-2xl md:text-3xl text-ink">인기 급상승 🔥</h2>
            </div>
            <Link
              href="/products?sort=popular"
              className="inline-block text-sm font-medium text-ink-4 hover:text-ink transition-colors pt-3 pb-1 -mt-3 border-b border-[#ddd] hover:border-[#111]"
            >
              전체 보기
            </Link>
          </div>
          </AnimateIn>

          {/* 가로 스크롤 랭킹 리스트 */}
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-none">
            {trendingProducts.map((product, i) => (
              <AnimateIn key={product.id} direction="up" delay={i * 50} duration={400}>
                <Link
                  href={`/products/${product.id}`}
                  className="group flex items-center gap-3 bg-surface border border-line rounded-2xl px-4 py-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 shrink-0 w-[260px]"
                >
                  {/* 순위 */}
                  <span className={`text-xl font-black shrink-0 w-8 text-center ${
                    i === 0 ? 'text-[#e8734a]' : i === 1 ? 'text-ink-3' : 'text-ink-4'
                  }`}>
                    {i + 1}
                  </span>

                  {/* 이미지 */}
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-tint shrink-0">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="48px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg">🍱</div>
                    )}
                  </div>

                  {/* 텍스트 */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-ink line-clamp-1">{product.name}</p>
                    <p className="text-xs font-bold text-[#2d7a4f] mt-0.5">{formatPrice(product.price)}</p>
                    <p className="text-[10px] text-ink-5 mt-0.5">
                      🔥 이번 주 {product.order_count}건
                    </p>
                  </div>
                </Link>
              </AnimateIn>
            ))}
          </div>
        </section>
      )}

      {/* ── 이번 주 신상품 ────────────────────────────────────────── */}
      {newProducts.length > 0 && (
        <section className="py-10 pb-4 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
          <AnimateIn direction="up" duration={500}>
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-[11px] font-semibold text-[#2d7a4f] tracking-[0.15em] uppercase mb-2">New Arrivals</p>
              <h2 className="text-display text-2xl md:text-3xl text-ink">이번 주 신상품 🆕</h2>
            </div>
            <Link
              href="/products?sort=newest"
              className="inline-block text-sm font-medium text-ink-4 hover:text-ink transition-colors pt-3 pb-1 -mt-3 border-b border-[#ddd] hover:border-[#111]"
            >
              전체 보기
            </Link>
          </div>
          </AnimateIn>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {newProducts.map((product, i) => (
              <AnimateIn key={product.id} direction="up" delay={i * 60} duration={500}>
                <ProductCard product={product} priority={false} />
              </AnimateIn>
            ))}
          </div>
        </section>
      )}

      {/* ── 인기 상품 ─────────────────────────────────────────────── */}
      <section className="py-4 pb-20 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <AnimateIn direction="up" duration={600}>
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[11px] font-semibold text-[#2d7a4f] tracking-[0.15em] uppercase mb-2">Best Sellers</p>
            <h2 className="text-display text-3xl md:text-4xl text-ink">인기 도시락</h2>
          </div>
          <Link
            href="/products"
            className="inline-block text-sm font-medium text-ink-4 hover:text-ink transition-colors pt-3 pb-1 -mt-3 border-b border-[#ddd] hover:border-[#111]"
          >
            전체 보기
          </Link>
        </div>

        </AnimateIn>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {products.map((product, i) => (
              <AnimateIn key={product.id} direction="up" delay={i * 60} duration={500}>
                <ProductCard product={product} priority={i < 4} />
              </AnimateIn>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-ink-5">
            <p>준비 중인 메뉴가 곧 업데이트됩니다.</p>
          </div>
        )}
      </section>

      {/* ── 최근 본 상품 ──────────────────────────────────────────── */}
      <RecentlyViewed />

      {/* ── 브랜드 스트립 ─────────────────────────────────────────── */}
      <section className="bg-[#2d7a4f] py-10 overflow-hidden">
        <div className="flex gap-12 animate-[scroll_20s_linear_infinite] whitespace-nowrap">
          {Array(3).fill(['냉동 간편식', '정직한 재료', '건강한 한끼', '전자레인지 3분', '무료 배송', '정기구독 할인']).flat().map((text, i) => (
            <span key={i} className="text-white/60 text-sm font-medium shrink-0">
              {text} <span className="text-white/30 mx-3">·</span>
            </span>
          ))}
        </div>
      </section>

      {/* ── 인스타그램 ────────────────────────────────────────────── */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[11px] font-semibold text-[#2d7a4f] tracking-[0.15em] uppercase mb-2">Instagram</p>
              <h2 className="text-display text-3xl text-ink">@green_eat_food</h2>
            </div>
            <a
              href="https://www.instagram.com/green_eat_food"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm font-medium text-ink-4 hover:text-ink transition-colors pt-3 pb-1 -mt-3 border-b border-[#ddd] hover:border-[#111]"
            >
              팔로우
            </a>
          </div>
          <InstagramGrid />
        </div>
      </section>

      {/* ── 구독 배너 ─────────────────────────────────────────────── */}
      <section className="py-20 bg-[#f0faf4] dark:bg-[#1e2b1e]">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[11px] font-semibold text-[#2d7a4f] dark:text-[#6ab87a] tracking-[0.15em] uppercase mb-4">Subscription</p>
              <h2 className="text-display text-3xl md:text-4xl text-ink mb-4">
                정기구독으로<br />더 건강하게, 더 알뜰하게
              </h2>
              <p className="text-ink-3 leading-relaxed mb-8 font-light">
                주 1회부터 매일까지, 원하는 주기로 설정하세요.<br />
                구독 회원 전용 할인과 무료 배송 혜택을 드립니다.
              </p>
              <Link
                href="/subscription"
                className="inline-flex items-center px-7 py-3.5 bg-[#2d7a4f] text-white font-semibold rounded-full text-sm hover:bg-[#235f3d] transition-colors shadow-sm shadow-[#2d7a4f]/20"
              >
                구독 플랜 보기
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {[
                { icon: '🚚', title: '무료 배송', desc: '구독 회원은 매 배송 무료' },
                { icon: '💸', title: '최대 15% 할인', desc: '플랜 업그레이드 시 추가 혜택' },
                { icon: '🔄', title: '언제든 변경', desc: '배송일·상품 자유롭게 조정 가능' },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-4 bg-surface dark:bg-[#2a3d2a] rounded-2xl p-4 shadow-sm">
                  <span className="text-2xl w-10 text-center shrink-0">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-ink text-sm">{item.title}</p>
                    <p className="text-ink-4 text-xs mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

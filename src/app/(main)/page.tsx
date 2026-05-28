import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/products/ProductCard'
import { RecentlyViewed } from '@/components/products/RecentlyViewed'
import { InstagramGrid } from '@/components/home/InstagramGrid'
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
  { slug: 'lunchbox', name: '간편식',        desc: '한끼 · 만렙 도시락',  emoji: '🍱', color: 'bg-[#e8f5ee]', text: 'text-[#2d7a4f]' },
  { slug: 'bakery',   name: '베이커리&샐러드', desc: '그래놀라 · 샐러드',   emoji: '🥗', color: 'bg-[#fff7ed]', text: 'text-[#c2762a]' },
  { slug: 'health',   name: '건강식품',       desc: '수제 만두 · 건강간식', emoji: '🥦', color: 'bg-[#f0f4ff]', text: 'text-[#4a6fa5]' },
  { slug: 'diet',     name: '맞춤식단',       desc: '닭가슴살 · 저칼로리',  emoji: '💪', color: 'bg-[#fdf0f5]', text: 'text-[#b05d7a]' },
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

export default async function HomePage() {
  const products = await getFeaturedProducts()

  return (
    <div className="bg-[#f8f8f6]">

      {/* ── 히어로 ──────────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid md:grid-cols-2 gap-8 items-center py-16 md:py-20">

            {/* 텍스트 */}
            <div className="animate-fade-up order-2 md:order-1">
              <span className="inline-flex items-center gap-1.5 bg-[#e8f5ee] text-[#2d7a4f] text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
                🌿 진정성 있는 건강한 선택
              </span>
              <h1 className="text-display text-3xl sm:text-4xl lg:text-[3.5rem] text-[#111] leading-[1.12] mb-5">
                바쁜 일상 속<br />
                <span className="text-[#2d7a4f]">건강한 한 끼</span>
              </h1>
              <p className="text-[#666] text-[17px] leading-relaxed mb-8 font-light">
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
                  className="inline-flex items-center px-7 py-3.5 bg-white text-[#333] font-semibold rounded-full text-sm hover:bg-[#f0faf4] hover:text-[#2d7a4f] hover:border-[#2d7a4f] transition-colors border border-[#ccc]"
                >
                  정기구독
                </Link>
              </div>

              {/* 스탯 */}
              <div className="flex gap-5 sm:gap-8 pt-8 border-t border-[#f0f0ee]">
                {[['20+', '다양한 메뉴'], ['4,900원~', '한끼 가격'], ['100%', '건강 재료']].map(([num, label]) => (
                  <div key={label}>
                    <p className="text-[#111] font-bold text-xl tracking-tight">{num}</p>
                    <p className="text-[#999] text-xs mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 이미지 콜라주 */}
            <div className="order-1 md:order-2 animate-fade-up delay-150">
              <div className="relative">
                {/* 배경 장식 */}
                <div className="absolute -inset-4 bg-gradient-to-br from-[#e8f5ee] to-[#f0faf4] rounded-[3rem] -z-0" />

                {/* 2×2 콜라주 */}
                <div className="relative z-10 grid grid-cols-2 gap-3 p-4">
                  {[
                    { src: 'hankki-dakgaseum.png', label: '닭가슴살 도시락', price: '4,900원~', badge: '🔥 인기 1위', contain: false },
                    { src: 'manrep-bulgogi.png',  label: '만렙 소불고기',  price: '6,500원',  badge: '⭐ 신메뉴',  contain: false },
                    { src: 'granola-gamgyul2.png', label: '감귤 그래놀라', price: '6,900원',  badge: null,        contain: false },
                    { src: 'hankki-dakgalbi.png', label: '치즈닭갈비',    price: '5,200원',  badge: null,        contain: false },
                  ].map((item, i) => (
                    <Link
                      key={i}
                      href="/products"
                      className={`relative overflow-hidden shadow-md shadow-black/8 group block ${
                        item.contain ? 'bg-[#fffbf0]' : 'bg-white'
                      } ${
                        i === 0 ? 'rounded-tl-3xl rounded-tr-xl rounded-bl-xl rounded-br-sm' :
                        i === 1 ? 'rounded-tl-xl rounded-tr-3xl rounded-bl-sm rounded-br-xl' :
                        i === 2 ? 'rounded-tl-xl rounded-tr-sm rounded-bl-3xl rounded-br-xl' :
                                  'rounded-tl-sm rounded-tr-xl rounded-bl-xl rounded-br-3xl'
                      }`}
                    >
                      <div className="aspect-square relative">
                        <Image
                          src={`https://nbdpckerbphyfnjzqiqp.supabase.co/storage/v1/object/public/product-images/greeneat/${item.src}`}
                          alt={item.label}
                          fill
                          className={`transition-transform duration-500 group-hover:scale-105 ${item.contain ? 'object-contain p-3' : 'object-cover'}`}
                          priority={i < 2}
                          sizes="25vw"
                        />
                      </div>
                      {/* 하단 그라디언트 오버레이 */}
                      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/55 to-transparent" />
                      {/* 하단 텍스트 — 배지 있으면 같이 표시 */}
                      <div className="absolute inset-x-0 bottom-0 px-2.5 pb-2.5">
                        {item.badge && (
                          <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-[9px] font-bold px-1.5 py-0.5 rounded mb-1">
                            {item.badge}
                          </span>
                        )}
                        <p className="text-white text-[11px] font-semibold leading-tight drop-shadow">{item.label}</p>
                        <p className="text-white/80 text-[10px] mt-0.5">{item.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* 플로팅 뱃지 — 가격 */}
                <div className="absolute -top-3 right-4 z-20 bg-[#2d7a4f] rounded-2xl px-4 py-2.5 shadow-lg shadow-[#2d7a4f]/40 text-white text-center">
                  <p className="text-[9px] opacity-75 tracking-wide">한 끼 최저</p>
                  <p className="text-[15px] font-bold tracking-tight">4,900원</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 카테고리 ──────────────────────────────────────────────── */}
      <section className="py-14 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className={`group ${cat.color} rounded-2xl p-5 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 animate-fade-up flex flex-col justify-between min-h-[130px]`}
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div>
                <span className="text-3xl mb-3 block">{cat.emoji}</span>
                <p className={`font-bold text-base leading-tight ${cat.text}`}>{cat.name}</p>
                <p className="text-[#888] text-xs mt-1.5 leading-relaxed">{cat.desc}</p>
              </div>
              <p className={`text-xs font-semibold mt-4 ${cat.text} opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all`}>
                보러가기 →
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 인기 상품 ─────────────────────────────────────────────── */}
      <section className="py-4 pb-20 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[11px] font-semibold text-[#2d7a4f] tracking-[0.15em] uppercase mb-2">Best Sellers</p>
            <h2 className="text-display text-3xl md:text-4xl text-[#111]">인기 도시락</h2>
          </div>
          <Link
            href="/products"
            className="text-sm font-medium text-[#999] hover:text-[#111] transition-colors pb-1 border-b border-[#ddd] hover:border-[#111]"
          >
            전체 보기
          </Link>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 4} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-[#aaa]">
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[11px] font-semibold text-[#2d7a4f] tracking-[0.15em] uppercase mb-2">Instagram</p>
              <h2 className="text-display text-3xl text-[#111]">@green_eat_food</h2>
            </div>
            <a
              href="https://www.instagram.com/green_eat_food"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-[#999] hover:text-[#111] transition-colors pb-1 border-b border-[#ddd] hover:border-[#111]"
            >
              팔로우
            </a>
          </div>
          <InstagramGrid />
        </div>
      </section>

      {/* ── 구독 배너 ─────────────────────────────────────────────── */}
      <section className="py-20 bg-[#f0faf4]">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[11px] font-semibold text-[#2d7a4f] tracking-[0.15em] uppercase mb-4">Subscription</p>
              <h2 className="text-display text-3xl md:text-4xl text-[#111] mb-4">
                정기구독으로<br />더 건강하게, 더 알뜰하게
              </h2>
              <p className="text-[#666] leading-relaxed mb-8 font-light">
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
                <div key={item.title} className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm">
                  <span className="text-2xl w-10 text-center shrink-0">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-[#111] text-sm">{item.title}</p>
                    <p className="text-[#999] text-xs mt-0.5">{item.desc}</p>
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

import { cache } from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/products/ProductCard'
import type { Product } from '@/types'

type Props = { params: Promise<{ slug: string }> }

type CollectionRow = {
  id: string
  slug: string
  title: string
  subtitle: string | null
  emoji: string
  theme_color: string
}

const getCollection = cache(async (slug: string): Promise<CollectionRow | null> => {
  const supabase = await createClient()
  const { data } = await supabase
    .from('collections')
    .select('id, slug, title, subtitle, emoji, theme_color')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle()
  return (data as CollectionRow) ?? null
})

async function getCollectionProducts(collectionId: string): Promise<Product[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('collection_items')
    .select('sort_order, products(*, product_categories(id, name, slug, description))')
    .eq('collection_id', collectionId)
    .order('sort_order', { ascending: true })

  const rows = (data ?? []) as { sort_order: number; products: Product | Product[] | null }[]
  // products가 객체/배열 어느 쪽으로 와도 정규화
  return rows.flatMap((row) =>
    Array.isArray(row.products) ? row.products : row.products ? [row.products] : []
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const collection = await getCollection(slug)
  if (!collection) return { title: '기획전 — GreenEat' }
  return {
    title: `${collection.title} — GreenEat 기획전`,
    description: collection.subtitle ?? `GreenEat 기획전 ${collection.title}`,
  }
}

export default async function CollectionDetailPage({ params }: Props) {
  const { slug } = await params
  const collection = await getCollection(slug)
  if (!collection) notFound()

  const products = await getCollectionProducts(collection.id)

  return (
    <div>
      {/* 히어로 */}
      <section style={{ backgroundColor: `${collection.theme_color}14` }}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 md:py-16">
          <Link
            href="/collections"
            className="inline-flex items-center gap-1.5 text-sm text-ink-4 hover:text-ink transition-colors mb-6"
          >
            <ArrowLeft size={15} />
            기획전 전체
          </Link>
          <span className="text-5xl block mb-4">{collection.emoji}</span>
          <h1 className="text-3xl font-bold text-ink leading-snug">{collection.title}</h1>
          {collection.subtitle && (
            <p className="text-ink-4 mt-2 leading-relaxed">{collection.subtitle}</p>
          )}
        </div>
      </section>

      {/* 상품 그리드 */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10 pb-20">
        {products.length > 0 ? (
          <>
            <p className="text-sm text-ink-4 mb-6">
              총 <span className="font-semibold text-ink">{products.length}</span>개 상품
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} priority={i < 4} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-24 text-ink-4">
            <p className="text-4xl mb-4">{collection.emoji}</p>
            <p className="text-sm">이 기획전에 담긴 상품이 아직 없어요.</p>
            <Link
              href="/products"
              className="inline-flex items-center mt-6 px-6 py-2.5 rounded-full border border-line text-sm font-medium text-ink hover:border-[#2d7a4f]/50 hover:text-[#2d7a4f] transition-colors"
            >
              전체 상품 보러가기
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}

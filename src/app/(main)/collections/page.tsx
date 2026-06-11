import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = {
  title: '기획전 — GreenEat',
  description: '테마별로 골라 담은 GreenEat 기획전. 단백질, 다이어트, 간편식까지 취향에 맞는 한 끼를 만나보세요.',
}

type CollectionRow = {
  id: string
  slug: string
  title: string
  subtitle: string | null
  emoji: string
  theme_color: string
  sort_order: number
  collection_items: { count: number }[]
}

async function getCollections(): Promise<CollectionRow[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('collections')
    .select('*, collection_items(count)')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  return (data as CollectionRow[]) ?? []
}

export default async function CollectionsPage() {
  const collections = await getCollections()

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-10">
      {/* 헤더 */}
      <div className="mb-10">
        <p className="text-[11px] font-semibold text-[#2d7a4f] tracking-[0.15em] uppercase mb-2">Collections</p>
        <h1 className="text-display text-3xl md:text-4xl text-ink">기획전 🎁</h1>
        <p className="text-sm text-ink-4 mt-3">테마별로 골라 담은 GreenEat의 추천 큐레이션</p>
      </div>

      {collections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {collections.map((collection, i) => {
            const count = collection.collection_items?.[0]?.count ?? 0
            return (
              <Link
                key={collection.id}
                href={`/collections/${collection.slug}`}
                className="group rounded-3xl border border-line p-7 sm:p-8 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 animate-fade-up"
                style={{ backgroundColor: `${collection.theme_color}14`, animationDelay: `${i * 0.07}s` }}
              >
                <span className="text-5xl block mb-5">{collection.emoji}</span>
                <h2 className="text-xl font-bold text-ink leading-snug">{collection.title}</h2>
                {collection.subtitle && (
                  <p className="text-sm text-ink-4 mt-1.5 leading-relaxed">{collection.subtitle}</p>
                )}
                <div className="flex items-center justify-between mt-6">
                  <span className="text-xs font-medium text-ink-4 bg-surface/70 px-2.5 py-1 rounded-full">
                    상품 {count}개
                  </span>
                  <span
                    className="text-xs font-semibold opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
                    style={{ color: collection.theme_color }}
                  >
                    보러가기 →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-24 text-ink-4">
          <p className="text-4xl mb-4">🎁</p>
          <p className="text-sm">진행 중인 기획전이 없어요. 곧 새로운 테마로 찾아올게요!</p>
        </div>
      )}
    </div>
  )
}

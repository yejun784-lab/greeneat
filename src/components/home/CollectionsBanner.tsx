import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

type CollectionRow = {
  id: string
  slug: string
  title: string
  subtitle: string | null
  emoji: string
  theme_color: string
}

export async function CollectionsBanner() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('collections')
    .select('id, slug, title, subtitle, emoji, theme_color')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
    .limit(3)

  const collections = (data as CollectionRow[]) ?? []
  if (collections.length === 0) return null

  return (
    <section className="py-10 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
      {/* 섹션 헤더 */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[11px] font-semibold text-[#2d7a4f] tracking-[0.15em] uppercase mb-2">Collections</p>
          <h2 className="text-display text-3xl text-ink">기획전 🎁</h2>
        </div>
        <Link
          href="/collections"
          className="text-sm font-medium text-ink-4 hover:text-ink transition-colors pb-1 border-b border-line hover:border-ink"
        >
          전체보기
        </Link>
      </div>

      {/* 가로 스크롤 카드 */}
      <div className="flex gap-4 overflow-x-auto pb-2 -mx-6 px-6 sm:mx-0 sm:px-0 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {collections.map((collection) => (
          <Link
            key={collection.id}
            href={`/collections/${collection.slug}`}
            className="group snap-start shrink-0 w-[260px] sm:w-auto sm:flex-1 rounded-2xl border border-line p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between min-h-[170px]"
            style={{ backgroundColor: `${collection.theme_color}14` }}
          >
            <div>
              <span className="text-3xl block mb-3">{collection.emoji}</span>
              <p className="font-bold text-base text-ink leading-tight">{collection.title}</p>
              {collection.subtitle && (
                <p className="text-xs text-ink-4 mt-1.5 leading-relaxed">{collection.subtitle}</p>
              )}
            </div>
            <p
              className="text-xs font-semibold mt-4 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
              style={{ color: collection.theme_color }}
            >
              보러가기 →
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}

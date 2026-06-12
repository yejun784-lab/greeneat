import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Gift } from 'lucide-react'
import {
  CollectionForm,
  CollectionToggle,
  CollectionDelete,
  CollectionItemsButton,
} from '@/components/admin/CollectionForm'

type CollectionRow = {
  id: string
  slug: string
  title: string
  subtitle: string | null
  emoji: string
  theme_color: string
  is_active: boolean
  sort_order: number
  created_at: string
  collection_items: { count: number }[] | null
}

export default async function AdminCollectionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin') redirect('/')

  const { data } = await supabase
    .from('collections')
    .select('*, collection_items(count)')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })

  const collections = (data ?? []) as CollectionRow[]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ink">기획전 관리</h1>
          <p className="text-sm text-ink-4 mt-1">총 {collections.length}개 기획전</p>
        </div>
        <CollectionForm mode="create" />
      </div>

      <div className="bg-surface rounded-2xl border border-line overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-wash border-b border-line">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">기획전</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4 w-32">슬러그</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4 w-20">상품</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4 w-16">정렬</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4 w-20">상태</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4 w-44">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {collections.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <Gift size={32} className="mx-auto text-ink-5 mb-2" />
                    <p className="text-sm text-ink-4">등록된 기획전이 없습니다</p>
                  </td>
                </tr>
              )}
              {collections.map(c => {
                const itemCount = c.collection_items?.[0]?.count ?? 0
                return (
                  <tr key={c.id} className="hover:bg-wash/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                          style={{ backgroundColor: c.theme_color + '1a' }}
                        >
                          {c.emoji}
                        </span>
                        <div className="min-w-0">
                          <Link
                            href={`/collections/${c.slug}`}
                            className="font-medium text-ink hover:text-[#2d7a4f] hover:underline"
                          >
                            {c.title}
                          </Link>
                          {c.subtitle && (
                            <p className="text-xs text-ink-5 truncate">{c.subtitle}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-ink-4">{c.slug}</td>
                    <td className="px-4 py-3 text-ink-3">{itemCount}개</td>
                    <td className="px-4 py-3 text-ink-4">{c.sort_order}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        c.is_active ? 'bg-green-tint text-[#2d7a4f]' : 'bg-tint text-ink-5'
                      }`}>
                        {c.is_active ? '노출중' : '숨김'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <CollectionItemsButton collectionId={c.id} collectionTitle={c.title} />
                        <CollectionForm mode="edit" collection={c} />
                        <CollectionToggle id={c.id} isActive={c.is_active} />
                        <CollectionDelete id={c.id} />
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

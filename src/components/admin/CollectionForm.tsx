'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/lib/toast-store'
import { X, Plus, PencilLine, Power, Trash2, Search, Boxes, Loader2 } from 'lucide-react'

type Collection = {
  id: string
  slug: string
  title: string
  subtitle: string | null
  emoji: string
  theme_color: string
  sort_order: number
}

/* ── 생성/수정 모달 ─────────────────────────────────────── */

export function CollectionForm({ mode, collection }: { mode: 'create' | 'edit'; collection?: Collection }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [slug, setSlug] = useState(collection?.slug ?? '')
  const [title, setTitle] = useState(collection?.title ?? '')
  const [subtitle, setSubtitle] = useState(collection?.subtitle ?? '')
  const [emoji, setEmoji] = useState(collection?.emoji ?? '🍱')
  const [themeColor, setThemeColor] = useState(collection?.theme_color ?? '#2d7a4f')
  const [sortOrder, setSortOrder] = useState(collection?.sort_order ?? 0)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!slug.trim() || !title.trim()) { setError('슬러그와 제목은 필수예요.'); return }
    if (!/^[a-z0-9-]+$/.test(slug.trim())) { setError('슬러그는 영소문자·숫자·하이픈만 가능해요.'); return }

    setSaving(true)
    const supabase = createClient()
    const payload = {
      slug: slug.trim(),
      title: title.trim(),
      subtitle: subtitle.trim() || null,
      emoji: emoji.trim() || '🍱',
      theme_color: themeColor,
      sort_order: sortOrder,
    }

    const { error: dbError } = mode === 'create'
      ? await supabase.from('collections').insert(payload)
      : await supabase.from('collections').update(payload).eq('id', collection!.id)
    setSaving(false)

    if (dbError) {
      setError(dbError.message.includes('duplicate') ? '이미 사용 중인 슬러그예요.' : '저장에 실패했어요.')
      return
    }
    toast.success(mode === 'create' ? '기획전을 만들었어요.' : '기획전을 수정했어요.')
    setOpen(false)
    router.refresh()
  }

  return (
    <>
      {mode === 'create' ? (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#2d7a4f] text-white text-sm font-semibold rounded-xl hover:bg-[#235f3d] transition-colors"
        >
          <Plus size={14} /> 기획전 추가
        </button>
      ) : (
        <button
          onClick={() => setOpen(true)}
          aria-label="수정"
          className="p-1.5 text-ink-4 hover:text-[#2d7a4f] transition-colors"
        >
          <PencilLine size={14} />
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setOpen(false)} />
          <div className="relative bg-surface rounded-2xl border border-line p-6 w-full max-w-md shadow-2xl animate-pop-in">
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-ink-4 hover:text-ink-2" aria-label="닫기">
              <X size={16} />
            </button>
            <h3 className="font-bold text-ink mb-4">{mode === 'create' ? '기획전 추가' : '기획전 수정'}</h3>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-ink-4 mb-1">슬러그 (URL)</label>
                  <input value={slug} onChange={e => setSlug(e.target.value)} placeholder="summer-diet"
                    className="w-full px-3 py-2.5 text-sm bg-tint border border-line-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-ink font-mono" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-4 mb-1">이모지</label>
                  <input value={emoji} onChange={e => setEmoji(e.target.value)} placeholder="🍱"
                    className="w-full px-3 py-2.5 text-sm bg-tint border border-line-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-ink" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-ink-4 mb-1">제목</label>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="여름맞이 다이어트 특집"
                  className="w-full px-3 py-2.5 text-sm bg-tint border border-line-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-ink" />
              </div>
              <div>
                <label className="block text-xs font-medium text-ink-4 mb-1">부제목</label>
                <input value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder="가볍고 시원한 한 끼 모음"
                  className="w-full px-3 py-2.5 text-sm bg-tint border border-line-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-ink" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-ink-4 mb-1">테마 색상</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={themeColor} onChange={e => setThemeColor(e.target.value)}
                      className="w-9 h-9 rounded-lg border border-line-2 cursor-pointer bg-transparent" />
                    <span className="text-xs font-mono text-ink-4">{themeColor}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-4 mb-1">정렬 순서</label>
                  <input type="number" value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))}
                    className="w-full px-3 py-2.5 text-sm bg-tint border border-line-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-ink" />
                </div>
              </div>

              {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-xl">{error}</p>}

              <button type="submit" disabled={saving}
                className="w-full py-2.5 bg-[#2d7a4f] text-white rounded-xl text-sm font-semibold hover:bg-[#235f3d] transition-colors disabled:opacity-50">
                {saving ? '저장 중...' : mode === 'create' ? '기획전 만들기' : '수정 저장'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

/* ── 활성 토글 ──────────────────────────────────────────── */

export function CollectionToggle({ id, isActive }: { id: string; isActive: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function toggle() {
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('collections').update({ is_active: !isActive }).eq('id', id)
    setLoading(false)
    if (error) { toast.error('변경에 실패했어요.'); return }
    router.refresh()
  }

  return (
    <button onClick={toggle} disabled={loading} aria-label={isActive ? '숨기기' : '노출하기'}
      className={`p-1.5 transition-colors ${isActive ? 'text-[#2d7a4f] hover:text-ink-4' : 'text-ink-5 hover:text-[#2d7a4f]'}`}>
      <Power size={14} />
    </button>
  )
}

/* ── 삭제 (2단계 확인) ──────────────────────────────────── */

export function CollectionDelete({ id }: { id: string }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('collections').delete().eq('id', id)
    setLoading(false)
    if (error) { toast.error('삭제에 실패했어요.'); return }
    toast.success('기획전을 삭제했어요.')
    router.refresh()
  }

  if (confirming) {
    return (
      <span className="flex items-center gap-1">
        <button onClick={handleDelete} disabled={loading}
          className="text-[10px] font-bold text-red-500 hover:text-red-700 whitespace-nowrap">
          {loading ? '...' : '삭제!'}
        </button>
        <button onClick={() => setConfirming(false)} className="text-[10px] text-ink-5 hover:text-ink-3">취소</button>
      </span>
    )
  }

  return (
    <button onClick={() => setConfirming(true)} aria-label="삭제"
      className="p-1.5 text-ink-5 hover:text-red-500 transition-colors">
      <Trash2 size={14} />
    </button>
  )
}

/* ── 상품 관리 모달 ─────────────────────────────────────── */

type ItemRow = {
  id: string
  product_id: string
  products: { id: string; name: string; price: number } | null
}

type ProductOption = { id: string; name: string; price: number }

export function CollectionItemsButton({ collectionId, collectionTitle }: { collectionId: string; collectionTitle: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<ItemRow[]>([])
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ProductOption[]>([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    if (open) loadItems()
  }, [open])  // eslint-disable-line react-hooks/exhaustive-deps

  async function loadItems() {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('collection_items')
      .select('id, product_id, products(id, name, price)')
      .eq('collection_id', collectionId)
      .order('sort_order', { ascending: true })
    setItems(((data ?? []) as unknown as ItemRow[]).map(r => ({
      ...r,
      products: Array.isArray(r.products) ? (r.products[0] ?? null) : r.products,
    })))
    setLoading(false)
  }

  async function handleSearch(q: string) {
    setQuery(q)
    if (q.trim().length < 1) { setResults([]); return }
    setSearching(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('products')
      .select('id, name, price')
      .ilike('name', `%${q.trim()}%`)
      .eq('is_active', true)
      .limit(6)
    setResults((data ?? []) as ProductOption[])
    setSearching(false)
  }

  async function addProduct(p: ProductOption) {
    if (items.some(i => i.product_id === p.id)) { toast.error('이미 담긴 상품이에요.'); return }
    const supabase = createClient()
    const { error } = await supabase.from('collection_items').insert({
      collection_id: collectionId,
      product_id: p.id,
      sort_order: items.length,
    })
    if (error) { toast.error('추가에 실패했어요.'); return }
    setQuery(''); setResults([])
    loadItems()
    router.refresh()
  }

  async function removeItem(itemId: string) {
    const supabase = createClient()
    const { error } = await supabase.from('collection_items').delete().eq('id', itemId)
    if (error) { toast.error('제거에 실패했어요.'); return }
    setItems(prev => prev.filter(i => i.id !== itemId))
    router.refresh()
  }

  return (
    <>
      <button onClick={() => setOpen(true)} aria-label="상품 관리"
        className="p-1.5 text-ink-4 hover:text-[#2d7a4f] transition-colors">
        <Boxes size={14} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setOpen(false)} />
          <div className="relative bg-surface rounded-2xl border border-line p-6 w-full max-w-md shadow-2xl animate-pop-in max-h-[85dvh] flex flex-col">
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-ink-4 hover:text-ink-2" aria-label="닫기">
              <X size={16} />
            </button>
            <h3 className="font-bold text-ink mb-1">상품 관리</h3>
            <p className="text-xs text-ink-5 mb-4">{collectionTitle}</p>

            {/* 상품 검색 */}
            <div className="relative mb-3">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-5" />
              <input
                value={query}
                onChange={e => handleSearch(e.target.value)}
                placeholder="상품 이름으로 검색해서 추가"
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-tint border border-line-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-ink"
              />
              {searching && <Loader2 size={13} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-ink-5" />}
              {results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-line rounded-xl shadow-lg z-10 overflow-hidden">
                  {results.map(p => (
                    <button key={p.id} onClick={() => addProduct(p)}
                      className="w-full flex items-center justify-between px-3.5 py-2.5 text-left hover:bg-green-tint/50 transition-colors">
                      <span className="text-sm text-ink truncate">{p.name}</span>
                      <Plus size={13} className="text-[#2d7a4f] shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 현재 아이템 */}
            <div className="flex-1 overflow-y-auto -mx-1 px-1">
              {loading ? (
                <div className="flex justify-center py-8"><Loader2 size={18} className="animate-spin text-ink-5" /></div>
              ) : items.length === 0 ? (
                <p className="text-center text-sm text-ink-5 py-8">담긴 상품이 없어요. 위에서 검색해 추가하세요.</p>
              ) : (
                <ul className="divide-y divide-line">
                  {items.map(item => (
                    <li key={item.id} className="flex items-center justify-between py-2.5 gap-2">
                      <span className="text-sm text-ink-2 truncate">
                        {item.products?.name ?? '삭제된 상품'}
                      </span>
                      <button onClick={() => removeItem(item.id)} aria-label="제거"
                        className="p-1 text-ink-5 hover:text-red-500 transition-colors shrink-0">
                        <X size={13} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <p className="text-[11px] text-ink-5 mt-3 pt-3 border-t border-line">
              총 {items.length}개 상품 · 변경은 즉시 반영돼요
            </p>
          </div>
        </div>
      )}
    </>
  )
}

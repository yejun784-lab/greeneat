'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Plus, Loader2, Trash2, Power } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/lib/toast-store'

type ProductOption = {
  id: string
  name: string
  price: number
}

function toLocalInput(d: Date) {
  const offset = d.getTimezoneOffset()
  return new Date(d.getTime() - offset * 60000).toISOString().slice(0, 16)
}

export function FlashSaleForm() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [products, setProducts] = useState<ProductOption[]>([])
  const [productId, setProductId] = useState('')
  const [discountRate, setDiscountRate] = useState(20)
  const [startsAt, setStartsAt] = useState(() => toLocalInput(new Date()))
  const [endsAt, setEndsAt] = useState(() => toLocalInput(new Date(Date.now() + 24 * 60 * 60 * 1000)))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('products')
      .select('id, name, price')
      .eq('is_active', true)
      .order('name')
      .then(({ data }) => setProducts((data as ProductOption[]) ?? []))
  }, [])

  const selected = products.find((p) => p.id === productId)
  const salePrice = selected ? Math.floor(selected.price * (1 - discountRate / 100)) : null

  function openModal() {
    setStartsAt(toLocalInput(new Date()))
    setEndsAt(toLocalInput(new Date(Date.now() + 24 * 60 * 60 * 1000)))
    setError(null)
    setOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!productId) { setError('상품을 선택하세요.'); return }
    if (discountRate < 5 || discountRate > 90) { setError('할인율은 5~90% 사이여야 합니다.'); return }
    if (!startsAt || !endsAt) { setError('시작/종료 시각을 입력하세요.'); return }
    if (new Date(endsAt) <= new Date(startsAt)) { setError('종료 시각은 시작 시각 이후여야 합니다.'); return }

    setSaving(true)
    const supabase = createClient()
    const { error: insertError } = await supabase.from('flash_sales').insert({
      product_id: productId,
      discount_rate: Number(discountRate),
      starts_at: new Date(startsAt).toISOString(),
      ends_at: new Date(endsAt).toISOString(),
      is_active: true,
    })

    if (insertError) {
      setError(`저장 실패: ${insertError.message}`)
    } else {
      toast.success('타임세일을 등록했습니다.')
      setOpen(false)
      setProductId('')
      setDiscountRate(20)
      router.refresh()
    }
    setSaving(false)
  }

  const inputCls = 'w-full px-3 py-2.5 border border-line-2 rounded-lg text-sm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f]'

  return (
    <>
      <button
        onClick={openModal}
        className="flex items-center gap-2 px-4 py-2.5 bg-[#2d7a4f] text-white rounded-xl text-sm font-medium hover:bg-[#235f3d] transition-colors"
      >
        <Plus size={16} />
        타임세일 추가
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-lg bg-surface rounded-2xl border border-line max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* 헤더 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-line">
              <h2 className="font-bold text-ink text-lg">타임세일 추가</h2>
              <button onClick={() => setOpen(false)} className="text-ink-5 hover:text-ink-2"><X size={20} /></button>
            </div>

            {/* 폼 */}
            <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-4">
              {/* 상품 선택 */}
              <div>
                <label className="block text-sm font-medium text-ink-2 mb-1">상품 *</label>
                <select value={productId} onChange={(e) => setProductId(e.target.value)} className={inputCls} required>
                  <option value="">상품을 선택하세요</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.price.toLocaleString()}원)
                    </option>
                  ))}
                </select>
              </div>

              {/* 할인율 */}
              <div>
                <label className="block text-sm font-medium text-ink-2 mb-1">할인율 (%) *</label>
                <input
                  type="number"
                  value={discountRate || ''}
                  onChange={(e) => setDiscountRate(Number(e.target.value))}
                  min={5}
                  max={90}
                  className={inputCls}
                  required
                />
                {selected && salePrice !== null && (
                  <p className="text-xs text-ink-5 mt-1">
                    할인가: <span className="font-semibold text-[#2d7a4f]">{salePrice.toLocaleString()}원</span>
                    <span className="line-through ml-1.5">{selected.price.toLocaleString()}원</span>
                  </p>
                )}
              </div>

              {/* 시작 / 종료 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-ink-2 mb-1">시작 *</label>
                  <input
                    type="datetime-local"
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                    className={inputCls}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-2 mb-1">종료 *</label>
                  <input
                    type="datetime-local"
                    value={endsAt}
                    onChange={(e) => setEndsAt(e.target.value)}
                    className={inputCls}
                    required
                  />
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>
              )}
            </form>

            {/* 푸터 */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-line">
              <button onClick={() => setOpen(false)} className="px-4 py-2.5 border border-line-2 rounded-xl text-sm text-ink-2 hover:bg-wash transition-colors">취소</button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#2d7a4f] text-white rounded-xl text-sm font-medium hover:bg-[#235f3d] transition-colors disabled:opacity-50"
              >
                {saving && <Loader2 size={14} className="animate-spin" />}
                {saving ? '저장 중...' : '타임세일 추가'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export function FlashSaleToggle({ id, isActive }: { id: string; isActive: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleToggle() {
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.from('flash_sales').update({ is_active: !isActive }).eq('id', id)
    if (error) toast.error(`변경 실패: ${error.message}`)
    else {
      toast.success(isActive ? '타임세일을 비활성화했습니다.' : '타임세일을 활성화했습니다.')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      title={isActive ? '비활성화' : '활성화'}
      className={`p-1.5 rounded-lg transition-colors disabled:opacity-50 ${
        isActive
          ? 'text-[#2d7a4f] hover:bg-green-50'
          : 'text-ink-5 hover:text-[#2d7a4f] hover:bg-green-50'
      }`}
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <Power size={14} />}
    </button>
  )
}

export function FlashSaleDelete({ id }: { id: string }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    const supabase = createClient()
    const { error } = await supabase.from('flash_sales').delete().eq('id', id)
    if (error) toast.error(`삭제 실패: ${error.message}`)
    else {
      toast.success('타임세일을 삭제했습니다.')
      router.refresh()
    }
    setDeleting(false)
    setConfirming(false)
  }

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-1">
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 disabled:opacity-50"
        >
          {deleting && <Loader2 size={12} className="animate-spin" />}
          {deleting ? '삭제 중...' : '정말 삭제?'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={deleting}
          className="px-2 py-1 border border-line-2 rounded-lg text-xs text-ink-4 hover:bg-wash"
        >
          취소
        </button>
      </span>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      title="삭제"
      className="p-1.5 text-ink-5 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
    >
      <Trash2 size={14} />
    </button>
  )
}

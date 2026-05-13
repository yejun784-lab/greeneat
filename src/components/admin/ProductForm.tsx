'use client'

import { useState, useRef, type ReactNode } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { X, Plus, Upload, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/lib/toast-store'

type Category = { id: string; name: string; slug: string }

type Product = {
  id: string
  name: string
  description: string | null
  price: number
  category_id: string | null
  calories: number | null
  protein: number | null
  carbs: number | null
  fat: number | null
  servings: number
  cook_time: number | null
  difficulty: 'easy' | 'medium' | 'hard'
  image_url: string | null
  is_subscription: boolean
  is_active: boolean
  stock: number
}

interface Props {
  categories: Category[]
  mode: 'create' | 'edit'
  product?: Product
  trigger?: ReactNode
}

const EMPTY: Omit<Product, 'id'> = {
  name: '',
  description: '',
  price: 0,
  category_id: null,
  calories: null,
  protein: null,
  carbs: null,
  fat: null,
  servings: 2,
  cook_time: 20,
  difficulty: 'easy',
  image_url: null,
  is_subscription: false,
  is_active: true,
  stock: 100,
}

export function ProductForm({ categories, mode, product, trigger }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Omit<Product, 'id'>>(
    product ? { ...product } : { ...EMPTY }
  )
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(product?.image_url ?? null)
  const fileRef = useRef<HTMLInputElement>(null)

  function set<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleImageUpload(file: File) {
    setUploading(true)
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `${Date.now()}.${ext}`
    const { error } = await supabase.storage
      .from('product-images')
      .upload(path, file, { upsert: true })
    if (error) {
      toast.error('이미지 업로드 실패')
      setUploading(false)
      return
    }
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(path)
    set('image_url', publicUrl)
    setPreviewUrl(publicUrl)
    setUploading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('상품명을 입력해주세요.'); return }
    if (form.price <= 0) { toast.error('가격을 입력해주세요.'); return }

    setSaving(true)
    const supabase = createClient()

    const payload = {
      name: form.name.trim(),
      description: form.description || null,
      price: Number(form.price),
      category_id: form.category_id || null,
      calories: form.calories ? Number(form.calories) : null,
      protein: form.protein ? Number(form.protein) : null,
      carbs: form.carbs ? Number(form.carbs) : null,
      fat: form.fat ? Number(form.fat) : null,
      servings: Number(form.servings),
      cook_time: form.cook_time ? Number(form.cook_time) : null,
      difficulty: form.difficulty,
      image_url: form.image_url,
      is_subscription: form.is_subscription,
      is_active: form.is_active,
      stock: Number(form.stock),
    }

    let error: { message: string } | null = null

    if (mode === 'create') {
      const res = await supabase.from('products').insert(payload)
      error = res.error
    } else {
      const res = await supabase.from('products').update(payload).eq('id', product!.id)
      error = res.error
    }

    if (error) {
      toast.error(`저장 실패: ${error.message}`)
    } else {
      toast.success(mode === 'create' ? '상품을 추가했습니다.' : '상품을 수정했습니다.')
      setOpen(false)
      router.refresh()
    }
    setSaving(false)
  }

  return (
    <>
      {/* 트리거 */}
      {trigger ? (
        <span onClick={() => setOpen(true)}>{trigger}</span>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#2d7a4f] text-white rounded-xl text-sm font-medium hover:bg-[#235f3d] transition-colors"
        >
          <Plus size={16} />
          상품 추가
        </button>
      )}

      {/* 모달 */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-surface rounded-2xl border border-line max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-line shrink-0">
              <h2 className="font-bold text-ink text-lg">
                {mode === 'create' ? '상품 추가' : '상품 수정'}
              </h2>
              <button onClick={() => setOpen(false)} className="text-ink-5 hover:text-ink-2">
                <X size={20} />
              </button>
            </div>

            {/* 폼 */}
            <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-5">
              {/* 이미지 */}
              <div>
                <label className="block text-sm font-medium text-ink-2 mb-2">상품 이미지</label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-wash border-2 border-dashed border-line-2 flex items-center justify-center shrink-0">
                    {previewUrl ? (
                      <Image src={previewUrl} alt="preview" width={96} height={96} className="object-cover w-full h-full" />
                    ) : (
                      <Upload size={20} className="text-ink-5" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      disabled={uploading}
                      className="flex items-center gap-2 px-4 py-2 border border-line-2 rounded-lg text-sm text-ink-2 hover:bg-wash transition-colors disabled:opacity-50"
                    >
                      {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                      {uploading ? '업로드 중...' : '이미지 선택'}
                    </button>
                    <p className="text-xs text-ink-5">JPG, PNG, WebP (최대 5MB)</p>
                  </div>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f) handleImageUpload(f)
                    }}
                  />
                </div>
              </div>

              {/* 기본 정보 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-ink-2 mb-1">상품명 *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => set('name', e.target.value)}
                    placeholder="예: 비건 두부스테이크"
                    required
                    className="w-full px-3 py-2.5 border border-line-2 rounded-lg text-sm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-ink-2 mb-1">설명</label>
                  <textarea
                    value={form.description ?? ''}
                    onChange={(e) => set('description', e.target.value)}
                    rows={2}
                    placeholder="상품 설명을 입력하세요"
                    className="w-full px-3 py-2.5 border border-line-2 rounded-lg text-sm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f] resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-2 mb-1">가격 (원) *</label>
                  <input
                    type="number"
                    value={form.price || ''}
                    onChange={(e) => set('price', Number(e.target.value))}
                    min={0}
                    required
                    className="w-full px-3 py-2.5 border border-line-2 rounded-lg text-sm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-2 mb-1">재고 (개)</label>
                  <input
                    type="number"
                    value={form.stock || ''}
                    onChange={(e) => set('stock', Number(e.target.value))}
                    min={0}
                    className="w-full px-3 py-2.5 border border-line-2 rounded-lg text-sm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-2 mb-1">카테고리</label>
                  <select
                    value={form.category_id ?? ''}
                    onChange={(e) => set('category_id', e.target.value || null)}
                    className="w-full px-3 py-2.5 border border-line-2 rounded-lg text-sm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f]"
                  >
                    <option value="">카테고리 선택</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-2 mb-1">난이도</label>
                  <select
                    value={form.difficulty}
                    onChange={(e) => set('difficulty', e.target.value as 'easy' | 'medium' | 'hard')}
                    className="w-full px-3 py-2.5 border border-line-2 rounded-lg text-sm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f]"
                  >
                    <option value="easy">쉬움</option>
                    <option value="medium">보통</option>
                    <option value="hard">어려움</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-2 mb-1">인분</label>
                  <input
                    type="number"
                    value={form.servings || ''}
                    onChange={(e) => set('servings', Number(e.target.value))}
                    min={1}
                    className="w-full px-3 py-2.5 border border-line-2 rounded-lg text-sm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-2 mb-1">조리 시간 (분)</label>
                  <input
                    type="number"
                    value={form.cook_time ?? ''}
                    onChange={(e) => set('cook_time', Number(e.target.value) || null)}
                    min={0}
                    className="w-full px-3 py-2.5 border border-line-2 rounded-lg text-sm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f]"
                  />
                </div>
              </div>

              {/* 영양 정보 */}
              <div>
                <label className="block text-sm font-medium text-ink-2 mb-2">영양 정보 (1인분 기준)</label>
                <div className="grid grid-cols-4 gap-3">
                  {([
                    { key: 'calories', label: '칼로리 (kcal)' },
                    { key: 'protein', label: '단백질 (g)' },
                    { key: 'carbs', label: '탄수화물 (g)' },
                    { key: 'fat', label: '지방 (g)' },
                  ] as { key: 'calories' | 'protein' | 'carbs' | 'fat'; label: string }[]).map(({ key, label }) => (
                    <div key={key}>
                      <label className="block text-xs text-ink-5 mb-1">{label}</label>
                      <input
                        type="number"
                        value={form[key] ?? ''}
                        onChange={(e) => set(key, Number(e.target.value) || null)}
                        min={0}
                        placeholder="0"
                        className="w-full px-2.5 py-2 border border-line-2 rounded-lg text-sm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* 토글 옵션 */}
              <div className="flex gap-6">
                {([
                  { key: 'is_active', label: '판매 중', desc: '비활성화 시 목록에서 숨겨집니다' },
                  { key: 'is_subscription', label: '구독 가능', desc: '구독 플랜에서 선택 가능' },
                ] as { key: 'is_active' | 'is_subscription'; label: string; desc: string }[]).map(({ key, label, desc }) => (
                  <label key={key} className="flex items-start gap-3 cursor-pointer">
                    <div className="relative mt-0.5">
                      <input
                        type="checkbox"
                        checked={form[key]}
                        onChange={(e) => set(key, e.target.checked)}
                        className="sr-only"
                      />
                      <div
                        className={`w-10 h-6 rounded-full transition-colors ${form[key] ? 'bg-[#2d7a4f]' : 'bg-line-2'}`}
                        onClick={() => set(key, !form[key])}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${form[key] ? 'translate-x-5' : 'translate-x-1'}`} />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink">{label}</p>
                      <p className="text-xs text-ink-5">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </form>

            {/* 푸터 */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-line shrink-0">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2.5 border border-line-2 rounded-xl text-sm text-ink-2 hover:bg-wash transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                form=""
                onClick={handleSubmit}
                disabled={saving || uploading}
                className="px-5 py-2.5 bg-[#2d7a4f] text-white rounded-xl text-sm font-medium hover:bg-[#235f3d] transition-colors disabled:opacity-50"
              >
                {saving ? '저장 중...' : mode === 'create' ? '상품 추가' : '변경 저장'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

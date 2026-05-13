'use client'

import { useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { X, Plus, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/lib/toast-store'

type Coupon = {
  id: string
  code: string
  discount_type: 'percent' | 'fixed'
  discount_value: number
  min_order_amount: number
  max_uses: number | null
  expires_at: string | null
  is_active: boolean
}

type CouponInput = Omit<Coupon, 'id'>

const EMPTY: CouponInput = {
  code: '',
  discount_type: 'percent',
  discount_value: 10,
  min_order_amount: 0,
  max_uses: null,
  expires_at: null,
  is_active: true,
}

interface Props {
  mode: 'create' | 'edit'
  coupon?: Coupon
  trigger?: ReactNode
}

export function CouponForm({ mode, coupon, trigger }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<CouponInput>(coupon ? { ...coupon } : { ...EMPTY })
  const [saving, setSaving] = useState(false)

  function set<K extends keyof CouponInput>(key: K, value: CouponInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function generateCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let code = ''
    for (let i = 0; i < 8; i++) code += chars[Math.floor(Math.random() * chars.length)]
    set('code', code)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.code.trim()) { toast.error('쿠폰 코드를 입력하세요.'); return }
    if (form.discount_value <= 0) { toast.error('할인값을 입력하세요.'); return }
    if (form.discount_type === 'percent' && form.discount_value > 100) {
      toast.error('퍼센트 할인은 100% 이하여야 합니다.'); return
    }

    setSaving(true)
    const supabase = createClient()
    const payload = {
      code: form.code.trim().toUpperCase(),
      discount_type: form.discount_type,
      discount_value: Number(form.discount_value),
      min_order_amount: Number(form.min_order_amount),
      max_uses: form.max_uses ? Number(form.max_uses) : null,
      expires_at: form.expires_at || null,
      is_active: form.is_active,
    }

    let error: { message: string } | null = null
    if (mode === 'create') {
      const res = await supabase.from('coupons').insert(payload)
      error = res.error
    } else {
      const res = await supabase.from('coupons').update(payload).eq('id', coupon!.id)
      error = res.error
    }

    if (error) {
      toast.error(error.message.includes('unique') ? '이미 존재하는 코드입니다.' : `저장 실패: ${error.message}`)
    } else {
      toast.success(mode === 'create' ? '쿠폰을 생성했습니다.' : '쿠폰을 수정했습니다.')
      setOpen(false)
      router.refresh()
    }
    setSaving(false)
  }

  const inputCls = 'w-full px-3 py-2.5 border border-line-2 rounded-lg text-sm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f]'

  return (
    <>
      {trigger ? (
        <span onClick={() => setOpen(true)}>{trigger}</span>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#2d7a4f] text-white rounded-xl text-sm font-medium hover:bg-[#235f3d] transition-colors"
        >
          <Plus size={16} />
          쿠폰 추가
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={() => setOpen(false)}>
          <div className="w-full max-w-lg bg-surface rounded-2xl border border-line max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* 헤더 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-line">
              <h2 className="font-bold text-ink text-lg">{mode === 'create' ? '쿠폰 추가' : '쿠폰 수정'}</h2>
              <button onClick={() => setOpen(false)} className="text-ink-5 hover:text-ink-2"><X size={20} /></button>
            </div>

            {/* 폼 */}
            <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-4">
              {/* 쿠폰 코드 */}
              <div>
                <label className="block text-sm font-medium text-ink-2 mb-1">쿠폰 코드 *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) => set('code', e.target.value.toUpperCase())}
                    placeholder="WELCOME10"
                    className={`${inputCls} flex-1 font-mono`}
                    required
                  />
                  <button
                    type="button"
                    onClick={generateCode}
                    className="px-3 py-2 border border-line-2 rounded-lg text-xs text-ink-3 hover:bg-wash transition-colors shrink-0"
                  >
                    랜덤 생성
                  </button>
                </div>
              </div>

              {/* 할인 유형 + 값 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-ink-2 mb-1">할인 유형</label>
                  <select value={form.discount_type} onChange={(e) => set('discount_type', e.target.value as 'percent' | 'fixed')} className={inputCls}>
                    <option value="percent">퍼센트 (%)</option>
                    <option value="fixed">고정 금액 (원)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-2 mb-1">
                    할인값 {form.discount_type === 'percent' ? '(%)' : '(원)'}
                  </label>
                  <input
                    type="number"
                    value={form.discount_value || ''}
                    onChange={(e) => set('discount_value', Number(e.target.value))}
                    min={1}
                    max={form.discount_type === 'percent' ? 100 : undefined}
                    className={inputCls}
                    required
                  />
                </div>
              </div>

              {/* 최소 주문 금액 + 최대 사용 횟수 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-ink-2 mb-1">최소 주문 금액 (원)</label>
                  <input
                    type="number"
                    value={form.min_order_amount || ''}
                    onChange={(e) => set('min_order_amount', Number(e.target.value))}
                    min={0}
                    placeholder="0 (제한 없음)"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink-2 mb-1">최대 사용 횟수</label>
                  <input
                    type="number"
                    value={form.max_uses ?? ''}
                    onChange={(e) => set('max_uses', e.target.value ? Number(e.target.value) : null)}
                    min={1}
                    placeholder="무제한"
                    className={inputCls}
                  />
                </div>
              </div>

              {/* 만료일 */}
              <div>
                <label className="block text-sm font-medium text-ink-2 mb-1">만료일</label>
                <input
                  type="datetime-local"
                  value={form.expires_at ? form.expires_at.slice(0, 16) : ''}
                  onChange={(e) => set('expires_at', e.target.value ? new Date(e.target.value).toISOString() : null)}
                  className={inputCls}
                />
                <p className="text-xs text-ink-5 mt-1">비워두면 만료되지 않습니다.</p>
              </div>

              {/* 활성화 토글 */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => set('is_active', e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-10 h-6 rounded-full transition-colors ${form.is_active ? 'bg-[#2d7a4f]' : 'bg-line-2'}`}
                    onClick={() => set('is_active', !form.is_active)}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${form.is_active ? 'translate-x-5' : 'translate-x-1'}`} />
                  </div>
                </div>
                <span className="text-sm font-medium text-ink">쿠폰 활성화</span>
              </label>
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
                {saving ? '저장 중...' : mode === 'create' ? '쿠폰 추가' : '변경 저장'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

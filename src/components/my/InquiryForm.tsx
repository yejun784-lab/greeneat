'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Loader2, MessageSquarePlus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/lib/toast-store'

const CATEGORIES = [
  { value: 'order',    label: '주문' },
  { value: 'delivery', label: '배송' },
  { value: 'product',  label: '상품' },
  { value: 'refund',   label: '환불' },
  { value: 'account',  label: '계정' },
  { value: 'etc',      label: '기타' },
] as const

type Category = (typeof CATEGORIES)[number]['value']

export function InquiryForm() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [category, setCategory] = useState<Category>('order')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function close() {
    setOpen(false)
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!title.trim()) { setError('제목을 입력해 주세요.'); return }
    if (!content.trim()) { setError('문의 내용을 입력해 주세요.'); return }

    setSaving(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('로그인이 필요합니다.')
      setSaving(false)
      return
    }

    const { error: insertError } = await supabase.from('inquiries').insert({
      user_id: user.id,
      category,
      title: title.trim(),
      content: content.trim(),
    })

    if (insertError) {
      setError(`문의 접수에 실패했습니다: ${insertError.message}`)
      setSaving(false)
      return
    }

    toast.success('문의가 접수되었습니다. 빠르게 답변드릴게요!')
    setTitle('')
    setContent('')
    setCategory('order')
    setSaving(false)
    setOpen(false)
    router.refresh()
  }

  const inputCls =
    'w-full px-3 py-2.5 border border-line-2 rounded-lg text-sm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f]'

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-4 py-2.5 bg-[#2d7a4f] text-white rounded-xl text-sm font-medium hover:bg-[#235f3d] transition-colors"
      >
        <MessageSquarePlus size={16} />
        문의하기
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={close}
        >
          <div
            className="w-full max-w-md bg-surface rounded-2xl border border-line max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-line">
              <h2 className="font-bold text-ink text-lg">1:1 문의하기</h2>
              <button onClick={close} className="text-ink-5 hover:text-ink-2">
                <X size={20} />
              </button>
            </div>

            {/* 폼 */}
            <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-ink-2 mb-1">문의 유형</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className={inputCls}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-2 mb-1">제목</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="문의 제목을 입력해 주세요"
                  className={inputCls}
                  maxLength={100}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-2 mb-1">내용</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="문의하실 내용을 자세히 적어 주세요"
                  rows={5}
                  className={`${inputCls} resize-none`}
                  required
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={close}
                  className="px-4 py-2.5 border border-line-2 rounded-xl text-sm text-ink-2 hover:bg-wash transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#2d7a4f] text-white rounded-xl text-sm font-medium hover:bg-[#235f3d] transition-colors disabled:opacity-50"
                >
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {saving ? '접수 중...' : '문의 접수'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

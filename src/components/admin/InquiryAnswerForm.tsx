'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Loader2, MessageSquareReply, PencilLine } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/lib/toast-store'

type Inquiry = {
  id: string
  category: string
  title: string
  content: string
  status: 'pending' | 'answered'
  answer: string | null
  created_at: string
}

const CATEGORY_LABEL: Record<string, string> = {
  order:    '주문',
  delivery: '배송',
  product:  '상품',
  refund:   '환불',
  account:  '계정',
  etc:      '기타',
}

interface Props {
  inquiry: Inquiry
  userName: string
}

export function InquiryAnswerForm({ inquiry, userName }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [answer, setAnswer] = useState(inquiry.answer ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const answered = inquiry.status === 'answered'

  function close() {
    setOpen(false)
    setError(null)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!answer.trim()) { setError('답변 내용을 입력해 주세요.'); return }

    setSaving(true)
    const supabase = createClient()
    const { error: updateError } = await supabase
      .from('inquiries')
      .update({
        answer: answer.trim(),
        status: 'answered',
        answered_at: new Date().toISOString(),
      })
      .eq('id', inquiry.id)

    if (updateError) {
      setError(`답변 저장에 실패했습니다: ${updateError.message}`)
      setSaving(false)
      return
    }

    toast.success(answered ? '답변을 수정했습니다.' : '답변을 등록했습니다.')
    setSaving(false)
    setOpen(false)
    router.refresh()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors ${
          answered
            ? 'border border-line-2 text-ink-3 hover:bg-wash'
            : 'bg-[#2d7a4f] text-white hover:bg-[#235f3d]'
        }`}
      >
        {answered ? <PencilLine size={12} /> : <MessageSquareReply size={12} />}
        {answered ? '답변 수정' : '답변하기'}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={close}
        >
          <div
            className="w-full max-w-lg bg-surface rounded-2xl border border-line max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-line">
              <h2 className="font-bold text-ink text-lg">{answered ? '답변 수정' : '문의 답변'}</h2>
              <button onClick={close} className="text-ink-5 hover:text-ink-2">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 p-6 space-y-4">
              {/* 문의 내용 */}
              <div className="bg-wash rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-tint text-ink-3">
                    {CATEGORY_LABEL[inquiry.category] ?? '기타'}
                  </span>
                  <span className="text-xs text-ink-5">
                    {userName} · {new Date(inquiry.created_at).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <p className="font-semibold text-ink text-sm">{inquiry.title}</p>
                <p className="text-sm text-ink-3 mt-1.5 whitespace-pre-line">{inquiry.content}</p>
              </div>

              {/* 답변 입력 */}
              <div>
                <label className="block text-sm font-medium text-ink-2 mb-1">답변 내용</label>
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="고객에게 전달할 답변을 입력해 주세요"
                  rows={6}
                  className="w-full px-3 py-2.5 border border-line-2 rounded-lg text-sm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f] resize-none"
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
                  {saving ? '저장 중...' : answered ? '답변 수정' : '답변 등록'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

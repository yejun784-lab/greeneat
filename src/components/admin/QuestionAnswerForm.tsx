'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, MessageSquareReply, PencilLine, Lock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/lib/toast-store'

type Question = {
  id: string
  question: string
  is_secret: boolean
  status: 'pending' | 'answered'
  answer: string | null
  created_at: string
}

interface Props {
  question: Question
  userName: string
  productName: string
}

export function QuestionAnswerForm({ question, userName, productName }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [answer, setAnswer] = useState(question.answer ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const answered = question.status === 'answered'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!answer.trim()) { setError('답변 내용을 입력해 주세요.'); return }

    setSaving(true)
    const supabase = createClient()
    const { error: updateError } = await supabase
      .from('product_questions')
      .update({
        answer: answer.trim(),
        status: 'answered',
        answered_at: new Date().toISOString(),
      })
      .eq('id', question.id)
    setSaving(false)

    if (updateError) { setError('저장에 실패했어요. 다시 시도해 주세요.'); return }
    toast.success(answered ? '답변을 수정했어요.' : '답변을 등록했어요.')
    setOpen(false)
    router.refresh()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
          answered
            ? 'border border-line-2 text-ink-4 hover:border-[#2d7a4f]/40 hover:text-[#2d7a4f]'
            : 'bg-[#2d7a4f] text-white hover:bg-[#235f3d]'
        }`}
      >
        {answered ? <><PencilLine size={11} /> 수정</> : <><MessageSquareReply size={11} /> 답변</>}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={() => setOpen(false)} />
          <div className="relative bg-surface rounded-2xl border border-line p-6 w-full max-w-lg shadow-2xl animate-pop-in">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-ink-4 hover:text-ink-2"
              aria-label="닫기"
            >
              <X size={16} />
            </button>

            <h3 className="font-bold text-ink mb-1">상품 문의 답변</h3>
            <p className="text-xs text-ink-5 mb-4">{productName} · {userName}</p>

            {/* 질문 원문 */}
            <div className="bg-tint rounded-xl px-4 py-3 mb-4">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] font-bold text-ink-4">질문</span>
                {question.is_secret && (
                  <span className="flex items-center gap-0.5 text-[10px] text-ink-4">
                    <Lock size={9} /> 비밀글
                  </span>
                )}
              </div>
              <p className="text-sm text-ink-2 leading-relaxed whitespace-pre-line">{question.question}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <textarea
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                rows={5}
                placeholder="답변 내용을 입력해 주세요."
                className="w-full px-3.5 py-3 text-sm bg-tint border border-line-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-ink placeholder:text-ink-5 resize-none"
              />
              {error && (
                <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-xl">{error}</p>
              )}
              <button
                type="submit"
                disabled={saving}
                className="w-full py-2.5 bg-[#2d7a4f] text-white rounded-xl text-sm font-semibold hover:bg-[#235f3d] transition-colors disabled:opacity-50"
              >
                {saving ? '저장 중...' : answered ? '답변 수정' : '답변 등록'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

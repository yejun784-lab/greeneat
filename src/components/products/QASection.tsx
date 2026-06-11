'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { MessageCircleQuestion, Lock, Trash2, Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from '@/lib/toast-store'

type Question = {
  id: string
  user_id: string
  question: string
  is_secret: boolean
  answer: string | null
  status: 'pending' | 'answered'
  answered_at: string | null
  created_at: string
  profiles?: { name?: string | null } | null
}

/** 이름 마스킹: 김그린 → 김** */
function maskName(name?: string | null): string {
  if (!name) return '익명'
  if (name.length <= 1) return name + '*'
  return name[0] + '*'.repeat(Math.min(name.length - 1, 3))
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' })
}

export function QASection({ productId }: { productId: string }) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)

  // 작성 폼
  const [showForm, setShowForm] = useState(false)
  const [content, setContent] = useState('')
  const [isSecret, setIsSecret] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { load() }, [productId])  // eslint-disable-line react-hooks/exhaustive-deps

  async function load() {
    setLoading(true)
    const supabase = createClient()
    const [{ data: { user } }, { data }] = await Promise.all([
      supabase.auth.getUser(),
      supabase
        .from('product_questions')
        .select('*, profiles(name)')
        .eq('product_id', productId)
        .order('created_at', { ascending: false })
        .limit(50),
    ])
    setUserId(user?.id ?? null)
    setQuestions((data ?? []) as Question[])
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!userId) { toast.error('로그인 후 문의를 남길 수 있어요.'); return }
    if (content.trim().length < 5) { toast.error('문의 내용을 5자 이상 입력해 주세요.'); return }

    setSubmitting(true)
    const supabase = createClient()
    const { error } = await supabase.from('product_questions').insert({
      product_id: productId,
      user_id: userId,
      question: content.trim(),
      is_secret: isSecret,
    })
    setSubmitting(false)

    if (error) { toast.error('문의 등록에 실패했어요.'); return }
    toast.success('문의가 등록되었어요. 답변이 달리면 알려드릴게요!')
    setContent(''); setIsSecret(false); setShowForm(false)
    load()
  }

  async function handleDelete(id: string) {
    const supabase = createClient()
    const { error } = await supabase.from('product_questions').delete().eq('id', id)
    if (error) { toast.error('삭제에 실패했어요.'); return }
    setQuestions(qs => qs.filter(q => q.id !== id))
    toast.success('문의를 삭제했어요.')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={20} className="animate-spin text-ink-5" />
      </div>
    )
  }

  return (
    <div>
      {/* 헤더 + 작성 버튼 */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-ink">상품 Q&A</h3>
          <span className="text-sm text-ink-5">({questions.length})</span>
        </div>
        <button
          onClick={() => {
            if (!userId) { toast.error('로그인 후 문의를 남길 수 있어요.'); return }
            setShowForm(v => !v)
          }}
          className="text-xs font-semibold px-3.5 py-2 bg-[#2d7a4f] text-white rounded-xl hover:bg-[#235f3d] transition-colors"
        >
          {showForm ? '닫기' : '문의하기'}
        </button>
      </div>
      <p className="text-xs text-ink-5 mb-5">비밀글은 작성자와 관리자만 볼 수 있어요.</p>

      {/* 작성 폼 */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-tint rounded-2xl space-y-3 animate-fade-up">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={3}
            placeholder="상품에 대해 궁금한 점을 남겨주세요. (예: 전자레인지 조리 시간이 어떻게 되나요?)"
            className="w-full px-3.5 py-3 text-sm bg-surface border border-line-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 text-ink placeholder:text-ink-5 resize-none"
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-ink-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isSecret}
                onChange={e => setIsSecret(e.target.checked)}
                className="rounded accent-[#2d7a4f]"
              />
              <Lock size={11} className="text-ink-4" />
              비밀글로 문의하기
            </label>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-[#2d7a4f] text-white text-xs font-semibold rounded-xl hover:bg-[#235f3d] transition-colors disabled:opacity-50"
            >
              {submitting ? '등록 중...' : '문의 등록'}
            </button>
          </div>
        </form>
      )}

      {/* 목록 */}
      {questions.length === 0 ? (
        <div className="text-center py-14">
          <MessageCircleQuestion size={36} className="mx-auto text-line-2 mb-3" />
          <p className="text-sm font-medium text-ink-4">아직 문의가 없어요</p>
          <p className="text-xs text-ink-5 mt-1">첫 번째로 궁금한 점을 물어보세요!</p>
        </div>
      ) : (
        <div className="divide-y divide-line">
          {questions.map(q => (
            <div key={q.id} className="py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      q.status === 'answered'
                        ? 'bg-green-tint text-[#2d7a4f]'
                        : 'bg-tint text-ink-4'
                    }`}>
                      {q.status === 'answered' ? '답변완료' : '답변대기'}
                    </span>
                    {q.is_secret && (
                      <span className="flex items-center gap-0.5 text-[10px] text-ink-4">
                        <Lock size={9} /> 비밀글
                      </span>
                    )}
                    <span className="text-[11px] text-ink-5">
                      {maskName(q.profiles?.name)} · {formatDate(q.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-ink-2 leading-relaxed">{q.question}</p>
                </div>
                {userId === q.user_id && (
                  <button
                    onClick={() => handleDelete(q.id)}
                    aria-label="문의 삭제"
                    className="p-1.5 text-ink-5 hover:text-red-500 transition-colors shrink-0"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>

              {/* 답변 */}
              {q.answer && (
                <div className="mt-3 ml-3 pl-3.5 border-l-2 border-[#2d7a4f]/30 bg-green-tint/50 rounded-r-xl py-3 pr-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <CheckCircle2 size={12} className="text-[#2d7a4f]" />
                    <span className="text-xs font-bold text-[#2d7a4f]">GreenEat 답변</span>
                    {q.answered_at && (
                      <span className="text-[10px] text-ink-5">{formatDate(q.answered_at)}</span>
                    )}
                  </div>
                  <p className="text-sm text-ink-3 leading-relaxed whitespace-pre-line">{q.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

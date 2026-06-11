import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { QuestionAnswerForm } from '@/components/admin/QuestionAnswerForm'
import { MessageCircleQuestion, Lock } from 'lucide-react'

type QuestionRow = {
  id: string
  product_id: string
  question: string
  is_secret: boolean
  answer: string | null
  status: 'pending' | 'answered'
  answered_at: string | null
  created_at: string
  profiles: { name: string | null } | { name: string | null }[] | null
  products: { id: string; name: string } | { id: string; name: string }[] | null
}

function norm<T>(v: T | T[] | null): T | null {
  if (!v) return null
  return Array.isArray(v) ? v[0] ?? null : v
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR', { year: '2-digit', month: 'short', day: 'numeric' })
}

export default async function AdminQuestionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin') redirect('/')

  const { data } = await supabase
    .from('product_questions')
    .select('*, profiles(name), products(id, name)')
    .order('status', { ascending: false })  // pending 먼저
    .order('created_at', { ascending: false })

  const questions = (data ?? []) as QuestionRow[]
  const pendingCount = questions.filter(q => q.status === 'pending').length

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink">상품 Q&A 관리</h1>
        <p className="text-sm text-ink-4 mt-1">
          총 {questions.length}건 · 답변대기 <span className="font-semibold text-[#e8734a]">{pendingCount}건</span>
        </p>
      </div>

      <div className="bg-surface rounded-2xl border border-line overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-wash border-b border-line">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4 w-20">상태</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">상품 / 질문</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4 w-24">작성자</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4 w-24">작성일</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4 w-20">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {questions.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-16 text-center">
                    <MessageCircleQuestion size={32} className="mx-auto text-ink-5 mb-2" />
                    <p className="text-sm text-ink-4">등록된 문의가 없습니다</p>
                  </td>
                </tr>
              )}
              {questions.map(q => {
                const prod = norm(q.products)
                const prof = norm(q.profiles)
                return (
                  <tr key={q.id} className="hover:bg-wash/50 transition-colors">
                    <td className="px-4 py-3 align-top">
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        q.status === 'answered'
                          ? 'bg-green-tint text-[#2d7a4f]'
                          : 'bg-orange-50 text-[#e8734a]'
                      }`}>
                        {q.status === 'answered' ? '답변완료' : '답변대기'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        {prod ? (
                          <Link href={`/products/${prod.id}?tab=qa`} className="text-xs font-semibold text-[#2d7a4f] hover:underline">
                            {prod.name}
                          </Link>
                        ) : (
                          <span className="text-xs text-ink-5">삭제된 상품</span>
                        )}
                        {q.is_secret && <Lock size={10} className="text-ink-4" />}
                      </div>
                      <p className="text-ink-2 line-clamp-2 max-w-md">{q.question}</p>
                      {q.answer && (
                        <p className="text-xs text-ink-4 mt-1 line-clamp-1">↳ {q.answer}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 align-top text-ink-3 text-xs">{prof?.name ?? '회원'}</td>
                    <td className="px-4 py-3 align-top text-ink-4 text-xs">{formatDate(q.created_at)}</td>
                    <td className="px-4 py-3 align-top">
                      <QuestionAnswerForm
                        question={q}
                        userName={prof?.name ?? '회원'}
                        productName={prod?.name ?? '삭제된 상품'}
                      />
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

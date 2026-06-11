import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { InquiryAnswerForm } from '@/components/admin/InquiryAnswerForm'
import { MessageCircleQuestion } from 'lucide-react'

type Inquiry = {
  id: string
  user_id: string
  category: string
  title: string
  content: string
  status: 'pending' | 'answered'
  answer: string | null
  answered_at: string | null
  created_at: string
  profiles: { name: string } | { name: string }[] | null
}

const CATEGORY_LABEL: Record<string, string> = {
  order:    '주문',
  delivery: '배송',
  product:  '상품',
  refund:   '환불',
  account:  '계정',
  etc:      '기타',
}

function getProfileName(profiles: Inquiry['profiles']): string {
  if (!profiles) return '회원'
  if (Array.isArray(profiles)) return profiles[0]?.name ?? '회원'
  return profiles.name ?? '회원'
}

export default async function AdminInquiriesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  if (profile?.role !== 'admin') redirect('/')

  // status desc → 'pending'이 'answered'보다 뒤 알파벳이므로 답변대기 먼저
  const { data } = await supabase
    .from('inquiries')
    .select('*, profiles(name)')
    .order('status', { ascending: false })
    .order('created_at', { ascending: false })

  const inquiries = (data ?? []) as Inquiry[]
  const pendingCount = inquiries.filter((i) => i.status === 'pending').length

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ink">1:1 문의 관리</h1>
          <p className="text-sm text-ink-4 mt-1">
            답변대기 {pendingCount}건 · 전체 {inquiries.length}건
          </p>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-line overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-wash border-b border-line">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">상태</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">유형</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">제목</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">작성자</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4">작성일</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-ink-4 w-28">답변</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {inquiries.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <MessageCircleQuestion size={32} className="mx-auto text-ink-5 mb-2" />
                    <p className="text-sm text-ink-5">접수된 문의가 없습니다.</p>
                  </td>
                </tr>
              )}
              {inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-wash/40 transition-colors align-top">
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${
                        inquiry.status === 'answered'
                          ? 'bg-green-50 text-[#2d7a4f]'
                          : 'bg-yellow-50 text-yellow-600'
                      }`}
                    >
                      {inquiry.status === 'answered' ? '답변완료' : '답변대기'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-4 whitespace-nowrap">
                    {CATEGORY_LABEL[inquiry.category] ?? '기타'}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{inquiry.title}</p>
                    <p className="text-xs text-ink-4 mt-0.5 line-clamp-2 whitespace-pre-line">
                      {inquiry.content}
                    </p>
                    {inquiry.status === 'answered' && inquiry.answer && (
                      <div className="mt-2 bg-green-tint rounded-lg px-3 py-2">
                        <span className="text-[11px] font-bold text-[#2d7a4f]">답변</span>
                        <p className="text-xs text-ink-3 mt-0.5 line-clamp-2 whitespace-pre-line">
                          {inquiry.answer}
                        </p>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink-3 text-xs whitespace-nowrap">
                    {getProfileName(inquiry.profiles)}
                  </td>
                  <td className="px-4 py-3 text-ink-4 text-xs whitespace-nowrap">
                    {new Date(inquiry.created_at).toLocaleDateString('ko-KR', {
                      year: '2-digit', month: 'short', day: 'numeric',
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <InquiryAnswerForm inquiry={inquiry} userName={getProfileName(inquiry.profiles)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

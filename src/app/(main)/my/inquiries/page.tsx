import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import { ChevronLeft, MessageCircleQuestion } from 'lucide-react'
import { InquiryForm } from '@/components/my/InquiryForm'

type Inquiry = {
  id: string
  category: string
  title: string
  content: string
  status: 'pending' | 'answered'
  answer: string | null
  answered_at: string | null
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

export default async function InquiriesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('inquiries')
    .select('id, category, title, content, status, answer, answered_at, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(100)

  const inquiries = (data ?? []) as Inquiry[]

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Link href="/my" className="p-1 text-ink-5 hover:text-ink-2">
            <ChevronLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-ink">1:1 문의</h1>
        </div>
        <InquiryForm />
      </div>

      {inquiries.length > 0 ? (
        <div className="space-y-4">
          {inquiries.map((inquiry) => (
            <div key={inquiry.id} className="bg-surface rounded-2xl border border-line p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-tint text-ink-3">
                    {CATEGORY_LABEL[inquiry.category] ?? '기타'}
                  </span>
                  <span className="text-xs text-ink-5">{formatDate(inquiry.created_at)}</span>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    inquiry.status === 'answered'
                      ? 'bg-green-50 text-[#2d7a4f]'
                      : 'bg-yellow-50 text-yellow-600'
                  }`}
                >
                  {inquiry.status === 'answered' ? '답변완료' : '답변대기'}
                </span>
              </div>

              <h2 className="font-semibold text-ink">{inquiry.title}</h2>
              <p className="text-sm text-ink-4 mt-1 whitespace-pre-line">{inquiry.content}</p>

              {inquiry.status === 'answered' && inquiry.answer && (
                <div className="mt-4 bg-green-tint rounded-xl p-4">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-[#2d7a4f]">GreenEat 답변</span>
                    {inquiry.answered_at && (
                      <span className="text-xs text-ink-5">{formatDate(inquiry.answered_at)}</span>
                    )}
                  </div>
                  <p className="text-sm text-ink-2 whitespace-pre-line">{inquiry.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-ink-5">
          <MessageCircleQuestion size={40} className="mx-auto mb-3 text-ink-5" />
          <p className="text-lg">문의 내역이 없어요</p>
          <p className="text-sm mt-1">궁금한 점이 있다면 언제든 문의해 주세요.</p>
        </div>
      )}
    </div>
  )
}

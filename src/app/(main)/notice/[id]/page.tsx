import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react'

type Notice = {
  id: string
  title: string
  content: string
  created_at: string
  is_pinned?: boolean
}

export default async function NoticePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // 현재 공지 조회
  const { data: notice } = await supabase
    .from('notices')
    .select('id, title, content, created_at, is_pinned')
    .eq('id', id)
    .maybeSingle()

  if (!notice) notFound()

  const current = notice as Notice

  // 이전글·다음글 조회
  const [{ data: prevData }, { data: nextData }] = await Promise.all([
    supabase
      .from('notices')
      .select('id, title')
      .lt('created_at', current.created_at)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('notices')
      .select('id, title')
      .gt('created_at', current.created_at)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle(),
  ])

  const prev = prevData as { id: string; title: string } | null
  const next = nextData as { id: string; title: string } | null

  const dateStr = new Date(current.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* 뒤로 가기 */}
      <Link
        href="/notice"
        className="inline-flex items-center gap-1.5 text-sm text-ink-4 hover:text-[#2d7a4f] transition-colors mb-8"
      >
        <ArrowLeft size={15} />
        공지사항 목록
      </Link>

      {/* 공지 본문 */}
      <article className="bg-surface rounded-2xl border border-line p-6 sm:p-8 mb-6">
        {current.is_pinned && (
          <span className="inline-block text-xs font-medium bg-[#2d7a4f] text-white px-2.5 py-1 rounded-full mb-3">
            필독
          </span>
        )}
        <h1 className="text-xl sm:text-2xl font-bold text-ink mb-3 leading-snug">
          {current.title}
        </h1>
        <p className="text-xs text-ink-5 mb-6">{dateStr}</p>
        <div className="h-px bg-line mb-6" />
        <div className="prose prose-sm max-w-none">
          {current.content.split('\n').map((line, i) => (
            line.trim() === '' ? (
              <br key={i} />
            ) : (
              <p key={i} className="text-sm text-ink-2 leading-relaxed mb-2">
                {line}
              </p>
            )
          ))}
        </div>
      </article>

      {/* 이전글·다음글 */}
      <div className="bg-surface rounded-2xl border border-line divide-y divide-line mb-6">
        <div className="flex items-center gap-4 px-5 py-3.5 min-h-[56px]">
          <span className="flex items-center gap-1 text-xs text-ink-5 w-16 flex-shrink-0">
            <ChevronLeft size={14} />
            이전글
          </span>
          {prev ? (
            <Link
              href={`/notice/${prev.id}`}
              className="text-sm text-ink hover:text-[#2d7a4f] transition-colors line-clamp-1"
            >
              {prev.title}
            </Link>
          ) : (
            <span className="text-sm text-ink-5">이전 글이 없습니다.</span>
          )}
        </div>
        <div className="flex items-center gap-4 px-5 py-3.5 min-h-[56px]">
          <span className="flex items-center gap-1 text-xs text-ink-5 w-16 flex-shrink-0">
            <ChevronRight size={14} />
            다음글
          </span>
          {next ? (
            <Link
              href={`/notice/${next.id}`}
              className="text-sm text-ink hover:text-[#2d7a4f] transition-colors line-clamp-1"
            >
              {next.title}
            </Link>
          ) : (
            <span className="text-sm text-ink-5">다음 글이 없습니다.</span>
          )}
        </div>
      </div>

      {/* 목록 버튼 */}
      <div className="flex justify-center">
        <Link
          href="/notice"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-line text-sm font-medium text-ink hover:border-[#2d7a4f]/50 hover:text-[#2d7a4f] transition-colors"
        >
          <ArrowLeft size={14} />
          목록으로 돌아가기
        </Link>
      </div>
    </div>
  )
}

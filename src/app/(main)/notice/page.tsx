import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Megaphone, Gift, Tag, Calendar } from 'lucide-react'

export const metadata: Metadata = {
  title: '공지사항 & 이벤트 — GreenEat',
  description: 'GreenEat의 최신 프로모션, 이벤트, 공지사항을 확인하세요.',
}

type Notice = {
  id: string
  title: string
  content: string
  type: 'notice' | 'event' | 'promotion'
  starts_at: string | null
  ends_at: string | null
  created_at: string
}

const TYPE_CONFIG = {
  notice: { label: '공지', icon: Megaphone, color: 'bg-blue-50 text-blue-600 border-blue-100' },
  event: { label: '이벤트', icon: Gift, color: 'bg-purple-50 text-purple-600 border-purple-100' },
  promotion: { label: '프로모션', icon: Tag, color: 'bg-orange-50 text-orange-600 border-orange-100' },
}

function isActive(notice: Notice) {
  if (!notice.ends_at) return true
  return new Date(notice.ends_at) >= new Date()
}

function formatRange(starts: string | null, ends: string | null) {
  if (!starts && !ends) return null
  const fmt = (d: string) => new Date(d).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })
  if (starts && ends) return `${fmt(starts)} ~ ${fmt(ends)}`
  if (ends) return `~ ${fmt(ends)}`
  return `${fmt(starts!)} ~`
}

// 정적 샘플 데이터 (notices 테이블이 없을 경우 폴백)
const SAMPLE_NOTICES: Notice[] = [
  {
    id: '1',
    title: '🎉 GreenEat 오픈 기념 20% 할인!',
    content: '그린잇 오픈을 기념해 모든 밀키트 20% 할인 행사를 진행합니다. 지금 바로 장바구니를 채워보세요!',
    type: 'promotion',
    starts_at: '2026-05-01',
    ends_at: '2026-05-31',
    created_at: '2026-05-01',
  },
  {
    id: '2',
    title: '건강한 5월, 비건 밀키트 특가!',
    content: '5월 한 달간 비건 밀키트 전 품목 15% 특가 진행! 건강과 환경을 동시에 챙겨보세요.',
    type: 'event',
    starts_at: '2026-05-01',
    ends_at: '2026-05-31',
    created_at: '2026-05-01',
  },
  {
    id: '3',
    title: '구독 첫 달 무료 배송 혜택',
    content: '구독 플랜 가입 시 첫 달 배송비가 전액 무료입니다. 지금 구독을 시작하세요!',
    type: 'promotion',
    starts_at: null,
    ends_at: null,
    created_at: '2026-05-10',
  },
  {
    id: '4',
    title: '친구 초대 시 포인트 2배 지급 이벤트',
    content: '5월 한 달간 친구 초대 시 기존 1,000P에서 2,000P로 두 배 지급됩니다!',
    type: 'event',
    starts_at: '2026-05-01',
    ends_at: '2026-05-31',
    created_at: '2026-05-05',
  },
  {
    id: '5',
    title: '개인정보 처리방침 업데이트 안내',
    content: '2026년 6월 1일부터 개인정보 처리방침이 일부 변경됩니다. 자세한 내용은 고객센터를 통해 문의해주세요.',
    type: 'notice',
    starts_at: null,
    ends_at: null,
    created_at: '2026-05-08',
  },
]

export default async function NoticePage() {
  let notices: Notice[] = SAMPLE_NOTICES

  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false })

    if (data && data.length > 0) {
      notices = data as Notice[]
    }
  } catch {
    // notices 테이블 없으면 샘플 데이터 사용
  }

  const active = notices.filter(isActive)
  const expired = notices.filter((n) => !isActive(n))

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink">공지사항 &amp; 이벤트</h1>
        <p className="text-ink-4 mt-1">GreenEat의 최신 소식을 확인하세요</p>
      </div>

      {/* 진행 중 */}
      <div className="space-y-4 mb-10">
        {active.map((notice) => {
          const config = TYPE_CONFIG[notice.type] ?? TYPE_CONFIG.notice
          const Icon = config.icon
          const dateRange = formatRange(notice.starts_at, notice.ends_at)

          return (
            <div
              key={notice.id}
              className="bg-surface rounded-2xl border border-line p-5 hover:border-[#2d7a4f]/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={`shrink-0 w-9 h-9 rounded-xl border flex items-center justify-center ${config.color}`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${config.color}`}>
                      {config.label}
                    </span>
                    {dateRange && (
                      <span className="flex items-center gap-1 text-xs text-ink-5">
                        <Calendar size={11} />
                        {dateRange}
                      </span>
                    )}
                  </div>
                  <h2 className="font-semibold text-ink mb-1">{notice.title}</h2>
                  <p className="text-sm text-ink-4 leading-relaxed">{notice.content}</p>
                  <p className="text-xs text-ink-5 mt-2">
                    {new Date(notice.created_at).toLocaleDateString('ko-KR')}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* 종료된 이벤트 */}
      {expired.length > 0 && (
        <>
          <h2 className="text-sm font-semibold text-ink-4 mb-3">종료된 이벤트</h2>
          <div className="space-y-3 opacity-50">
            {expired.map((notice) => {
              const config = TYPE_CONFIG[notice.type] ?? TYPE_CONFIG.notice
              return (
                <div key={notice.id} className="bg-surface rounded-2xl border border-line p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${config.color}`}>
                      {config.label}
                    </span>
                    <span className="text-xs text-ink-5">종료됨</span>
                  </div>
                  <p className="text-sm font-medium text-ink">{notice.title}</p>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

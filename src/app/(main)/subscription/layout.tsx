import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '정기구독',
  description: '매주 신선한 밀키트를 정기적으로 받아보세요. 베이직·스탠다드·프리미엄 플랜 중 선택.',
}

export default function SubscriptionLayout({ children }: { children: React.ReactNode }) {
  return children
}

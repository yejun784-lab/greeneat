import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '자주 묻는 질문',
  description: 'GreenEat 서비스 이용 중 궁금한 점을 해결하세요.',
}

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return children
}

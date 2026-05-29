import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '선물하기',
  description: '소중한 사람에게 건강한 한 끼를 선물하세요. GreenEat 밀키트 선물하기.',
}

export default function GiftLayout({ children }: { children: React.ReactNode }) {
  return children
}

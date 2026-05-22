import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="text-white font-bold text-lg mb-3">GreenEat</p>
            <p className="text-sm leading-relaxed">
              진정성 있는 건강한 선택,<br />맛있는 도시락.
            </p>
          </div>
          <div>
            <p className="text-white font-medium mb-3">서비스</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-white transition-colors">도시락 쇼핑</Link></li>
              <li><Link href="/subscription" className="hover:text-white transition-colors">구독 플랜</Link></li>
              <li><Link href="/my/orders" className="hover:text-white transition-colors">주문 내역</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-white font-medium mb-3">고객 지원</p>
            <ul className="space-y-2 text-sm">
              <li>평일 09:00 - 18:00</li>
              <li>cs@greeneat.kr</li>
              <li>1588-0000</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-10 pt-6 text-xs text-center">
          © 2026 GreenEat. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

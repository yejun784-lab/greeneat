import Link from 'next/link'
import { ShoppingBag, Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 text-center">
      {/* 일러스트 */}
      <div className="relative mb-8 select-none">
        <p className="text-[120px] font-black text-[#2d7a4f]/10 leading-none">404</p>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-green-tint flex items-center justify-center">
            <ShoppingBag size={44} className="text-[#2d7a4f]" />
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-ink mb-2">페이지를 찾을 수 없어요</h1>
      <p className="text-ink-4 text-sm mb-8 max-w-xs leading-relaxed">
        주소가 잘못됐거나 페이지가 삭제됐을 수 있어요.<br />
        원하시는 밀키트를 다시 찾아보세요!
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#2d7a4f] text-white rounded-xl font-medium hover:bg-[#235f3d] transition-colors text-sm"
        >
          <Home size={16} />
          홈으로
        </Link>
        <Link
          href="/products"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-surface border border-line rounded-xl font-medium text-ink-2 hover:border-[#2d7a4f]/40 transition-colors text-sm"
        >
          <Search size={16} />
          밀키트 둘러보기
        </Link>
      </div>
    </div>
  )
}

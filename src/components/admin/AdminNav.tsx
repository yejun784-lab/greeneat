'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Package, ShoppingCart, Users, Tag, Home, Boxes, BarChart3, Truck, RotateCcw, Megaphone, Zap, MessageCircleQuestion, MessagesSquare, Gift } from 'lucide-react'

const NAV = [
  { href: '/admin',             label: '대시보드',   icon: LayoutDashboard },
  { href: '/admin/products',    label: '상품 관리',   icon: Package },
  { href: '/admin/inventory',   label: '재고 관리',   icon: Boxes },
  { href: '/admin/orders',      label: '주문 관리',   icon: ShoppingCart },
  { href: '/admin/deliveries',  label: '배송 관리',   icon: Truck },
  { href: '/admin/refunds',     label: '환불 관리',   icon: RotateCcw },
  { href: '/admin/inquiries',   label: '1:1 문의',   icon: MessageCircleQuestion },
  { href: '/admin/questions',   label: '상품 Q&A',   icon: MessagesSquare },
  { href: '/admin/users',       label: '회원 관리',   icon: Users },
  { href: '/admin/coupons',     label: '쿠폰 관리',   icon: Tag },
  { href: '/admin/flash-sales', label: '타임세일',    icon: Zap },
  { href: '/admin/collections', label: '기획전',      icon: Gift },
  { href: '/admin/notices',     label: '공지 관리',   icon: Megaphone },
  { href: '/admin/analytics',   label: '통계',       icon: BarChart3 },
]

export function AdminNav() {
  const pathname = usePathname()

  function isActive(href: string) {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <aside className="w-56 shrink-0 bg-surface border-r border-line flex flex-col">
      {/* 로고 */}
      <div className="px-5 py-5 border-b border-line">
        <p className="text-sm font-bold text-[#2d7a4f]">🥗 GreenEat</p>
        <p className="text-xs text-ink-5">Admin</p>
      </div>

      {/* 내비게이션 */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active
                  ? 'bg-green-tint text-[#2d7a4f]'
                  : 'text-ink-4 hover:bg-wash hover:text-ink'
              }`}
            >
              <Icon size={16} className={active ? 'text-[#2d7a4f]' : ''} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* 사이트로 */}
      <div className="px-3 py-4 border-t border-line">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-ink-5 hover:bg-wash hover:text-ink transition-colors"
        >
          <Home size={16} />
          사이트로 이동
        </Link>
      </div>
    </aside>
  )
}

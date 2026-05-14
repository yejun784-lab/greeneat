'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/cart-store'
import { createClient } from '@/lib/supabase/client'
import { ShoppingCart, User, Menu, X, LogOut, Search } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import type { User as SupabaseUser } from '@supabase/supabase-js'

type SuggestItem = { id: string; name: string; image_url: string | null; price: number }

const NAV_LINKS = [
  { href: '/products', label: '도시락' },
  { href: '/subscription', label: '구독 플랜' },
  { href: '/planner', label: '식단 플래너' },
  { href: '/feed', label: '밥로그' },
  { href: '/notice', label: '이벤트' },
]

export function Header() {
  const router = useRouter()
  const totalItems = useCartStore((s) => s.totalItems())
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profileName, setProfileName] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SuggestItem[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeSuggestion, setActiveSuggestion] = useState(-1)
  const searchRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const suggestRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user ?? null)
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('name')
          .eq('id', data.user.id)
          .maybeSingle()
        setProfileName(profile?.name ?? null)
      }
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) setProfileName(null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        suggestRef.current && !suggestRef.current.contains(e.target as Node) &&
        searchRef.current && !searchRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 디바운스 자동완성 검색
  const fetchSuggestions = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    if (!q.trim()) { setSuggestions([]); setShowSuggestions(false); return }

    debounceRef.current = setTimeout(async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('products')
        .select('id, name, image_url, price')
        .ilike('name', `%${q}%`)
        .limit(6)
      setSuggestions((data as SuggestItem[]) ?? [])
      setShowSuggestions(true)
      setActiveSuggestion(-1)
    }, 200)
  }, [])

  function handleSearchOpen() {
    setSearchOpen(true)
    setTimeout(() => searchRef.current?.focus(), 50)
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value
    setSearchQuery(q)
    fetchSuggestions(q)
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = searchQuery.trim()
    if (!q) return
    setShowSuggestions(false)
    router.push(`/products?search=${encodeURIComponent(q)}`)
    setSearchOpen(false)
    setSearchQuery('')
  }

  function handleSuggestionClick(item: SuggestItem) {
    setShowSuggestions(false)
    setSearchOpen(false)
    setSearchQuery('')
    router.push(`/products/${item.id}`)
  }

  // 키보드 탐색
  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showSuggestions || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveSuggestion((i) => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveSuggestion((i) => Math.max(i - 1, -1))
    } else if (e.key === 'Enter' && activeSuggestion >= 0) {
      e.preventDefault()
      handleSuggestionClick(suggestions[activeSuggestion])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  function handleSearchClose() {
    setSearchOpen(false)
    setSearchQuery('')
    setSuggestions([])
    setShowSuggestions(false)
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setUser(null)
    setProfileName(null)
    router.push('/')
    router.refresh()
  }

  const displayName = profileName ?? user?.email?.split('@')[0] ?? ''

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link href="/" className="flex items-center">
            <Image
              src="https://nbdpckerbphyfnjzqiqp.supabase.co/storage/v1/object/public/product-images/greeneat/logo.png"
              alt="GreenEat"
              width={120}
              height={40}
              className="h-9 w-auto object-contain"
              priority
            />
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-ink-2 hover:text-[#2d7a4f] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* 우측 액션 */}
          <div className="flex items-center gap-3">
            {/* 검색 */}
            {searchOpen ? (
              <div className="relative">
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    ref={searchRef}
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => searchQuery && suggestions.length > 0 && setShowSuggestions(true)}
                    placeholder="도시락 검색..."
                    className="w-40 sm:w-64 px-3 py-1.5 text-sm border border-line-2 rounded-lg bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f]"
                    autoComplete="off"
                  />
                  <button type="submit" className="sr-only">검색</button>
                  <button
                    type="button"
                    onClick={handleSearchClose}
                    className="ml-1 p-1.5 text-ink-5 hover:text-ink-3"
                  >
                    <X size={16} />
                  </button>
                </form>

                {/* 자동완성 드롭다운 */}
                {showSuggestions && suggestions.length > 0 && (
                  <div
                    ref={suggestRef}
                    className="absolute top-full left-0 mt-1 w-72 bg-surface border border-line-2 rounded-2xl shadow-xl overflow-hidden z-50"
                  >
                    {suggestions.map((item, i) => (
                      <button
                        key={item.id}
                        onMouseDown={() => handleSuggestionClick(item)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                          i === activeSuggestion ? 'bg-green-tint' : 'hover:bg-wash'
                        }`}
                      >
                        {/* 썸네일 */}
                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-tint shrink-0">
                          {item.image_url ? (
                            <Image
                              src={item.image_url}
                              alt={item.name}
                              width={36}
                              height={36}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-ink-5 text-xs">
                              🍽
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          {/* 검색어 하이라이트 */}
                          <p className="text-sm font-medium text-ink truncate">
                            {highlightMatch(item.name, searchQuery)}
                          </p>
                          <p className="text-xs text-ink-4">
                            {item.price.toLocaleString()}원
                          </p>
                        </div>
                        <Search size={12} className="text-ink-5 shrink-0" />
                      </button>
                    ))}
                    {/* 전체 검색 결과 보기 */}
                    <button
                      onMouseDown={handleSearchSubmit as never}
                      className="w-full px-3 py-2.5 text-sm text-[#2d7a4f] font-medium text-center hover:bg-green-tint border-t border-line transition-colors"
                    >
                      "{searchQuery}" 전체 결과 보기 →
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleSearchOpen}
                className="p-2 text-ink-3 hover:text-[#2d7a4f] transition-colors"
                aria-label="검색"
              >
                <Search size={20} />
              </button>
            )}

            <Link
              href="/cart"
              className="relative p-2 text-ink-3 hover:text-[#2d7a4f] transition-colors"
              aria-label="장바구니"
            >
              <ShoppingCart size={22} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#2d7a4f] text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <>
                <Link
                  href="/my"
                  className="hidden md:flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-[#2d7a4f] transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-green-tint flex items-center justify-center">
                    <User size={14} className="text-[#2d7a4f]" />
                  </div>
                  <span>{displayName}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="hidden md:flex items-center gap-1 px-3 py-1.5 text-sm text-ink-4 hover:text-red-500 transition-colors"
                  aria-label="로그아웃"
                >
                  <LogOut size={15} />
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/my"
                  className="p-2 text-ink-3 hover:text-[#2d7a4f] transition-colors"
                  aria-label="마이페이지"
                >
                  <User size={22} />
                </Link>
                <Link
                  href="/login"
                  className="hidden md:inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#2d7a4f] rounded-lg hover:bg-[#235f3d] transition-colors"
                >
                  로그인
                </Link>
              </>
            )}

            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            {/* 모바일 메뉴 버튼 */}
            <button
              className="md:hidden p-2 text-ink-3"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="메뉴"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 드롭다운 */}
      {mobileOpen && (
        <div className="md:hidden border-t border-line bg-surface">
          <nav className="flex flex-col px-4 py-3 gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2.5 text-sm font-medium text-ink-2 hover:text-[#2d7a4f]"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href="/my"
                  className="py-2.5 text-sm font-medium text-ink-2"
                  onClick={() => setMobileOpen(false)}
                >
                  {displayName}님의 마이페이지
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false) }}
                  className="text-left py-2.5 text-sm font-medium text-red-500"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="mt-2 py-2.5 text-sm font-medium text-[#2d7a4f]"
                onClick={() => setMobileOpen(false)}
              >
                로그인 / 회원가입
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

// 검색어 매칭 부분 하이라이트
function highlightMatch(text: string, query: string) {
  if (!query.trim()) return <>{text}</>
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-yellow-100 text-yellow-800 rounded px-0.5">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </>
  )
}

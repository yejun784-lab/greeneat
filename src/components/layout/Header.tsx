'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/cart-store'
import { createClient } from '@/lib/supabase/client'
import { ShoppingCart, User, Menu, X, LogOut, Search, Bell, Clock, TrendingUp } from 'lucide-react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import type { User as SupabaseUser } from '@supabase/supabase-js'

type SuggestItem = { id: string; name: string; image_url: string | null; price: number }

const NAV_LINKS = [
  { href: '/products', label: '도시락' },
  { href: '/subscription', label: '구독 플랜' },
  { href: '/health', label: '건강관리' },
  { href: '/feed', label: '밥로그' },
  { href: '/notice', label: '이벤트' },
]

const POPULAR_SEARCHES = ['한끼 도시락', '만렙 도시락', '그래놀라', '닭가슴살', '만두', '트라이얼 세트']
const RECENT_KEY = 'greeneat_recent_searches'
const MAX_RECENT = 6

function getRecentSearches(): string[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]') } catch { return [] }
}
function saveRecentSearch(query: string) {
  try {
    const prev = getRecentSearches().filter((q) => q !== query)
    localStorage.setItem(RECENT_KEY, JSON.stringify([query, ...prev].slice(0, MAX_RECENT)))
  } catch {}
}
function removeRecentSearch(query: string) {
  try {
    const prev = getRecentSearches().filter((q) => q !== query)
    localStorage.setItem(RECENT_KEY, JSON.stringify(prev))
  } catch {}
}

export function Header() {
  const router = useRouter()
  const totalItems = useCartStore((s) => s.totalItems())
  const [cartMounted, setCartMounted] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profileName, setProfileName] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)

  // 검색
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<SuggestItem[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeSuggestion, setActiveSuggestion] = useState(-1)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const searchRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const suggestRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setCartMounted(true) }, [])

  const [notifToast, setNotifToast] = useState<{ title: string; body: string } | null>(null)
  const notifToastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 채널 ref — 얼리 언마운트 시에도 cleanup 보장
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null)

  useEffect(() => {
    const supabase = createClient()
    let unmounted = false

    supabase.auth.getUser().then(async ({ data }) => {
      if (unmounted) return
      setUser(data.user ?? null)
      if (!data.user) return

      const userId = data.user.id
      const [{ data: profile }, { count }] = await Promise.all([
        supabase.from('profiles').select('name').eq('id', userId).maybeSingle(),
        supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('is_read', false).eq('user_id', userId),
      ])
      if (unmounted) return
      setProfileName(profile?.name ?? null)
      setUnreadCount(count ?? 0)

      // Realtime 구독 — 새 알림 INSERT 시 뱃지 + 토스트
      const ch = supabase
        .channel(`notifications:${userId}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
          (payload) => {
            const n = payload.new as { title?: string; body?: string }
            setUnreadCount((c) => c + 1)
            if (notifToastTimer.current) clearTimeout(notifToastTimer.current)
            setNotifToast({ title: n.title ?? '새 알림', body: n.body ?? '' })
            notifToastTimer.current = setTimeout(() => setNotifToast(null), 4000)
          }
        )
        .subscribe()

      if (unmounted) {
        supabase.removeChannel(ch)
      } else {
        channelRef.current = ch
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) { setProfileName(null); setUnreadCount(0) }
    })

    return () => {
      unmounted = true
      subscription.unsubscribe()
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
      if (notifToastTimer.current) clearTimeout(notifToastTimer.current)
    }
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
    if (!q.trim()) { setSuggestions([]); setShowSuggestions(true); return }

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
    setRecentSearches(getRecentSearches())
    setSearchOpen(true)
    setTimeout(() => searchRef.current?.focus(), 50)
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value
    setSearchQuery(q)
    fetchSuggestions(q)
  }

  function doSearch(q: string) {
    if (!q.trim()) return
    saveRecentSearch(q.trim())
    setShowSuggestions(false)
    router.push(`/products?search=${encodeURIComponent(q.trim())}`)
    setSearchOpen(false)
    setSearchQuery('')

    // 인기 검색어 로그 (로그인된 경우에만) — search_logs 는 query 컬럼만 집계에 사용
    if (user) {
      const supabase = createClient()
      supabase.from('search_logs').insert({ query: q.trim() }).then(() => {})
    }
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    doSearch(searchQuery)
  }

  function handleSuggestionClick(item: SuggestItem) {
    setShowSuggestions(false)
    setSearchOpen(false)
    setSearchQuery('')
    router.push(`/products/${item.id}`)
  }

  function handleChipSearch(q: string) {
    setSearchQuery(q)
    doSearch(q)
  }

  function handleDeleteRecent(q: string, e: React.MouseEvent) {
    e.stopPropagation()
    removeRecentSearch(q)
    setRecentSearches(getRecentSearches())
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
    <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur-xl border-b border-line">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-[60px]">
          {/* 로고 */}
          <Link
            href="/"
            onClick={() => router.push('/')}
            className="flex items-center shrink-0 cursor-pointer"
            aria-label="홈으로 이동"
          >
            <Image
              src="https://nbdpckerbphyfnjzqiqp.supabase.co/storage/v1/object/public/product-images/greeneat/logo.png"
              alt="GreenEat"
              width={120}
              height={40}
              className="h-9 w-auto object-contain pointer-events-none"
              priority
            />
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] font-medium text-ink-3 hover:text-ink transition-colors tracking-tight"
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
                    onFocus={() => setShowSuggestions(true)}
                    placeholder="도시락 검색..."
                    className="w-36 sm:w-64 px-3 py-1.5 text-sm border border-line-2 rounded-lg bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f]"
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

                {/* 드롭다운 */}
                {showSuggestions && (
                  <div
                    ref={suggestRef}
                    className="absolute top-full left-0 mt-1 w-72 sm:w-80 bg-surface border border-line-2 rounded-2xl shadow-xl overflow-hidden z-50 max-w-[calc(100vw-2rem)]"
                  >
                    {/* 쿼리가 없을 때: 최근/인기 검색어 */}
                    {!searchQuery.trim() ? (
                      <div className="p-3 space-y-4">
                        {recentSearches.length > 0 && (
                          <div>
                            <p className="text-[10px] font-semibold text-ink-5 uppercase tracking-wide mb-2 flex items-center gap-1">
                              <Clock size={10} /> 최근 검색어
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {recentSearches.map((q) => (
                                <button
                                  key={q}
                                  onMouseDown={() => handleChipSearch(q)}
                                  className="group flex items-center gap-1 px-2.5 py-1 text-xs bg-wash hover:bg-tint rounded-full text-ink-3 transition-colors"
                                >
                                  {q}
                                  <span
                                    onMouseDown={(e) => handleDeleteRecent(q, e)}
                                    className="text-ink-5 hover:text-red-400 ml-0.5"
                                  >
                                    ×
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                        <div>
                          <p className="text-[10px] font-semibold text-ink-5 uppercase tracking-wide mb-2 flex items-center gap-1">
                            <TrendingUp size={10} /> 인기 검색어
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {POPULAR_SEARCHES.map((q, i) => (
                              <button
                                key={q}
                                onMouseDown={() => handleChipSearch(q)}
                                className="flex items-center gap-1 px-2.5 py-1 text-xs border border-line-2 hover:border-[#2d7a4f] hover:text-[#2d7a4f] rounded-full text-ink-3 transition-colors"
                              >
                                <span className="text-[#2d7a4f] font-bold text-[10px] w-3 text-center">{i + 1}</span>
                                {q}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : suggestions.length > 0 ? (
                      <>
                        {suggestions.map((item, i) => (
                          <button
                            key={item.id}
                            onMouseDown={() => handleSuggestionClick(item)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                              i === activeSuggestion ? 'bg-green-tint' : 'hover:bg-wash'
                            }`}
                          >
                            <div className="w-9 h-9 rounded-lg overflow-hidden bg-tint shrink-0">
                              {item.image_url ? (
                                <Image src={item.image_url} alt={item.name} width={36} height={36} className="object-cover w-full h-full" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-ink-5 text-xs">🍽</div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-ink truncate">{highlightMatch(item.name, searchQuery)}</p>
                              <p className="text-xs text-ink-4">{item.price.toLocaleString()}원</p>
                            </div>
                            <Search size={12} className="text-ink-5 shrink-0" />
                          </button>
                        ))}
                        <button
                          onMouseDown={handleSearchSubmit as never}
                          className="w-full px-3 py-2.5 text-sm text-[#2d7a4f] font-medium text-center hover:bg-green-tint border-t border-line transition-colors"
                        >
                          "{searchQuery}" 전체 결과 보기 →
                        </button>
                      </>
                    ) : (
                      <div className="px-4 py-6 text-center text-sm text-ink-5">
                        "{searchQuery}" 검색 결과가 없어요
                      </div>
                    )}
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

            {/* 알림 벨 */}
            {user && (
              <Link
                href="/my/notifications"
                className="relative p-2 text-ink-3 hover:text-[#2d7a4f] transition-colors"
                aria-label="알림"
                onClick={() => setUnreadCount(0)}
              >
                <Bell size={20} className={unreadCount > 0 ? 'text-[#2d7a4f]' : ''} />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
            )}

            {/* 실시간 알림 토스트 */}
            {notifToast && (
              <div
                className="fixed top-16 right-4 z-[200] max-w-xs w-full bg-surface border border-line rounded-2xl shadow-xl p-4 animate-toast-in cursor-pointer"
                onClick={() => { setNotifToast(null); router.push('/my/notifications') }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-tint flex items-center justify-center shrink-0">
                    <Bell size={14} className="text-[#2d7a4f]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">{notifToast.title}</p>
                    {notifToast.body && (
                      <p className="text-xs text-ink-4 mt-0.5 line-clamp-2">{notifToast.body}</p>
                    )}
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setNotifToast(null) }}
                    className="text-ink-5 hover:text-ink-3 shrink-0 -mt-0.5"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            )}

            <Link
              href="/cart"
              className="relative p-2 text-ink-3 hover:text-[#2d7a4f] transition-colors"
              aria-label="장바구니"
            >
              <ShoppingCart size={22} />
              {cartMounted && totalItems > 0 && (
                <span
                  key={totalItems}
                  className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#2d7a4f] text-white text-xs rounded-full flex items-center justify-center font-medium animate-badge-pop"
                >
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
                <Link href="/my" className="p-2 text-ink-3 hover:text-[#2d7a4f] transition-colors" aria-label="마이페이지">
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
                <Link href="/my" className="py-2.5 text-sm font-medium text-ink-2" onClick={() => setMobileOpen(false)}>
                  {displayName}님의 마이페이지
                </Link>
                <Link href="/my/notifications" className="flex items-center gap-2 py-2.5 text-sm font-medium text-ink-2" onClick={() => setMobileOpen(false)}>
                  알림
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full">{unreadCount}</span>
                  )}
                </Link>
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false) }}
                  className="text-left py-2.5 text-sm font-medium text-red-500"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <Link href="/login" className="mt-2 py-2.5 text-sm font-medium text-[#2d7a4f]" onClick={() => setMobileOpen(false)}>
                로그인 / 회원가입
              </Link>
            )}
            <div className="pt-2 border-t border-line mt-1">
              <ThemeToggle />
            </div>
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

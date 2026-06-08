'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/lib/toast-store'
import { formatPrice, SUBSCRIPTION_PLAN_LABEL } from '@/lib/utils'
import {
  ChevronLeft, RefreshCw, Plus, X, Loader2, Check,
  Calendar, SkipForward, Clock, RotateCcw, PauseCircle,
  PlayCircle, Zap, CreditCard, AlertCircle,
} from 'lucide-react'

/* ── 타입 ──────────────────────────────────────────────────────── */
type SubProduct = {
  id: string; name: string; price: number
  image_url: string | null; calories: number | null; protein: number | null
}
type Subscription = {
  id: string
  plan_type: string
  status: string
  delivery_day: number
  next_delivery_at: string | null
  delivery_time_slot?: string | null
  auto_renew?: boolean | null
  paused_until?: string | null
  subscription_items?: { product_id: string; products: SubProduct | null }[]
}

/* ── 상수 ──────────────────────────────────────────────────────── */
const DAY_LABELS: Record<number, string> = { 1:'월', 2:'화', 3:'수', 4:'목', 5:'금', 6:'토', 0:'일' }

const TIME_SLOTS = [
  { id: 'morning',   label: '오전 배송', time: '7:00 ~ 12:00',  emoji: '🌅' },
  { id: 'afternoon', label: '오후 배송', time: '12:00 ~ 18:00', emoji: '☀️' },
  { id: 'evening',   label: '저녁 배송', time: '18:00 ~ 22:00', emoji: '🌙' },
] as const

const PAUSE_OPTIONS = [
  { label: '1주일',  days: 7 },
  { label: '2주일',  days: 14 },
  { label: '1개월',  days: 30 },
  { label: '2개월',  days: 60 },
]

const PLAN_PRICE: Record<string, number> = {
  basic: 39000, standard: 65000, premium: 99000,
}

/* ── 메인 컴포넌트 ─────────────────────────────────────────────── */
export default function SubscriptionManagePage() {
  const router = useRouter()
  const [sub,         setSub]         = useState<Subscription | null>(null)
  const [allProducts, setAllProducts] = useState<SubProduct[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  /* 로컬 편집 상태 */
  const [deliveryDay,  setDeliveryDay]  = useState<number>(1)
  const [timeSlot,     setTimeSlot]     = useState<string>('morning')
  const [nextDelivery, setNextDelivery] = useState('')
  const [autoRenew,    setAutoRenew]    = useState(true)

  /* UI 상태 */
  const [loading,      setLoading]      = useState(true)
  const [saving,       setSaving]       = useState<string | null>(null)
  const [showPicker,   setShowPicker]   = useState(false)
  const [showPause,    setShowPause]    = useState(false)
  const [pauseOption,  setPauseOption]  = useState<number>(7)

  /* ── 데이터 로드 ── */
  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function load() {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const [{ data: subData }, { data: products }] = await Promise.all([
      supabase
        .from('subscriptions')
        .select('*, subscription_items(product_id, products(id, name, price, image_url, calories, protein))')
        .eq('user_id', user.id)
        .in('status', ['active', 'paused'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from('products')
        .select('id, name, price, image_url, calories, protein')
        .eq('is_subscription', true)
        .eq('is_active', true)
        .gt('stock', 0)
        .order('name'),
    ])

    setSub(subData as Subscription | null)
    setAllProducts((products ?? []) as SubProduct[])
    if (subData) {
      const items = (subData.subscription_items ?? []) as { product_id: string }[]
      setSelectedIds(items.map((i) => i.product_id))
      setDeliveryDay(subData.delivery_day)
      setNextDelivery(subData.next_delivery_at?.slice(0, 10) ?? '')
      setTimeSlot((subData as Subscription).delivery_time_slot ?? 'morning')
      setAutoRenew((subData as Subscription).auto_renew !== false)
    }
    setLoading(false)
  }

  /* ── 상품 토글 ── */
  function toggleProduct(id: string) {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  /* ── PATCH 헬퍼 ── */
  async function patch(body: Record<string, unknown>, savingKey: string) {
    setSaving(savingKey)
    const res = await fetch('/api/subscriptions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    setSaving(null)
    return res
  }

  async function saveItems() {
    if (!sub) return
    if (selectedIds.length === 0) { toast.error('구독 메뉴를 1가지 이상 선택해주세요.'); return }
    const res = await patch({ action: 'update_items', subscription_id: sub.id, product_ids: selectedIds }, 'items')
    if (res.ok) { toast.success('구독 메뉴가 변경됐어요!'); await load() }
    else toast.error('변경에 실패했어요.')
  }

  async function saveDeliveryDay() {
    if (!sub) return
    const res = await patch({ action: 'update_delivery_day', subscription_id: sub.id, delivery_day: deliveryDay }, 'day')
    if (res.ok) { toast.success('배송 요일이 변경됐어요!'); await load() }
    else toast.error('변경에 실패했어요.')
  }

  async function saveTimeSlot() {
    if (!sub) return
    const res = await patch({ action: 'update_time_slot', subscription_id: sub.id, time_slot: timeSlot }, 'slot')
    if (res.ok) { toast.success('배송 시간대가 변경됐어요!'); await load() }
    else toast.error('변경에 실패했어요.')
  }

  async function saveNextDelivery() {
    if (!sub || !nextDelivery) return
    const res = await patch({ action: 'update_next_delivery', subscription_id: sub.id, next_delivery_at: nextDelivery }, 'date')
    if (res.ok) { toast.success('다음 배송일이 변경됐어요!'); await load() }
    else { const j = await res.json().catch(() => ({})); toast.error(j.error ?? '변경에 실패했어요.') }
  }

  async function toggleAutoRenew() {
    if (!sub) return
    const next = !autoRenew
    setAutoRenew(next)
    const res = await patch({ action: 'update_auto_renew', subscription_id: sub.id, auto_renew: next }, 'auto')
    if (res.ok) {
      toast.success(next ? '자동 결제가 활성화됐어요.' : '자동 결제가 비활성화됐어요. 다음 배송일 전까지 직접 결제가 필요해요.')
      await load()
    } else {
      setAutoRenew(!next)   // rollback
      toast.error('변경에 실패했어요.')
    }
  }

  async function skipOneWeek() {
    if (!sub) return
    if (!confirm('이번 주 배송을 1주일 미루시겠어요?')) return
    const base = sub.next_delivery_at ? new Date(sub.next_delivery_at) : new Date()
    const skipped = new Date(base.getTime() + 7 * 86400000)
    const supabase = createClient()
    const { error } = await supabase.from('subscriptions').update({ next_delivery_at: skipped.toISOString() }).eq('id', sub.id)
    if (error) toast.error('스킵 처리 중 오류가 발생했어요.')
    else { toast.success(`배송 스킵! 다음 배송: ${skipped.toLocaleDateString('ko-KR', { month:'long', day:'numeric' })}`); await load() }
  }

  async function pauseWithDuration() {
    if (!sub) return
    const until = new Date()
    until.setDate(until.getDate() + pauseOption)
    const res = await patch({ action: 'pause_until', subscription_id: sub.id, pause_until: until.toISOString() }, 'pause')
    if (res.ok) {
      toast.success(`${pauseOption === 7 ? '1주일' : pauseOption === 14 ? '2주일' : pauseOption === 30 ? '1개월' : '2개월'} 일시정지됐어요.`)
      setShowPause(false)
      await load()
    } else toast.error('일시정지에 실패했어요.')
  }

  async function resumeSub() {
    if (!sub) return
    const res = await patch({ action: 'resume', subscription_id: sub.id }, 'resume')
    if (res.ok) { toast.success('구독이 재개됐어요!'); await load() }
    else toast.error('재개에 실패했어요.')
  }

  async function cancelSub() {
    if (!sub) return
    if (!confirm('구독을 해지하면 취소할 수 없어요. 정말 해지하시겠어요?')) return
    const res = await patch({ action: 'cancel', subscription_id: sub.id }, 'cancel')
    if (res.ok) { toast.success('구독이 해지됐어요.'); router.push('/subscription') }
    else toast.error('해지에 실패했어요.')
  }

  /* ── 로딩 / 빈 상태 ── */
  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 size={28} className="animate-spin text-[#2d7a4f]" />
    </div>
  )
  if (!sub) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <RefreshCw size={40} className="mx-auto text-line-2 mb-4" />
      <p className="text-ink-4 mb-4">활성 구독이 없어요.</p>
      <Link href="/subscription" className="text-sm font-medium text-[#2d7a4f] hover:underline">구독 시작하기 →</Link>
    </div>
  )

  /* ── 계산 ── */
  const currentItems = (sub.subscription_items ?? []).map(i => i.products).filter(Boolean) as SubProduct[]
  const itemsChanged = JSON.stringify([...selectedIds].sort()) !== JSON.stringify([...currentItems.map(p => p.id)].sort())
  const monthlyPrice = PLAN_PRICE[sub.plan_type] ?? 0
  const slotChanged = timeSlot !== (sub.delivery_time_slot ?? 'morning')
  const nextSlot = TIME_SLOTS.find(s => s.id === timeSlot) ?? TIME_SLOTS[0]
  const pausedUntil = (sub as Subscription).paused_until

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-6">
        <Link href="/my" className="p-1.5 text-ink-5 hover:text-ink-2">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-ink">구독 관리</h1>
          <p className="text-xs text-ink-5 mt-0.5">
            {SUBSCRIPTION_PLAN_LABEL[sub.plan_type] ?? sub.plan_type} ·{' '}
            <span className={sub.status === 'active' ? 'text-[#2d7a4f]' : 'text-yellow-500'}>
              {sub.status === 'active' ? '구독 중' : '일시 중지'}
            </span>
          </p>
        </div>
      </div>

      <div className="space-y-5">

        {/* ── 구독 현황 요약 카드 ── */}
        <div className="bg-[#2d7a4f] text-white rounded-2xl p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold opacity-75 uppercase tracking-wide">현재 플랜</p>
              <p className="text-xl font-bold mt-1">{SUBSCRIPTION_PLAN_LABEL[sub.plan_type] ?? sub.plan_type}</p>
            </div>
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
              sub.status === 'active'
                ? 'bg-white/20 text-white'
                : 'bg-yellow-400/20 text-yellow-200'
            }`}>
              {sub.status === 'active'
                ? <><Zap size={11} /> 구독 중</>
                : <><PauseCircle size={11} /> 일시정지</>
              }
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-[10px] font-semibold opacity-70 mb-1">다음 배송일</p>
              <p className="text-sm font-bold">
                {sub.next_delivery_at
                  ? new Date(sub.next_delivery_at).toLocaleDateString('ko-KR', { month:'short', day:'numeric' })
                  : '미정'
                }
              </p>
              <p className="text-[10px] opacity-60 mt-0.5">
                {DAY_LABELS[sub.delivery_day]}요일
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-[10px] font-semibold opacity-70 mb-1">월 결제 예정</p>
              <p className="text-sm font-bold">{formatPrice(monthlyPrice)}</p>
              <p className="text-[10px] opacity-60 mt-0.5">
                {autoRenew ? '자동결제 ON' : '자동결제 OFF'}
              </p>
            </div>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-[10px] font-semibold opacity-70 mb-1">배송 시간대</p>
              <p className="text-sm font-bold">{TIME_SLOTS.find(s => s.id === (sub.delivery_time_slot ?? 'morning'))?.emoji}</p>
              <p className="text-[10px] opacity-60 mt-0.5">
                {TIME_SLOTS.find(s => s.id === (sub.delivery_time_slot ?? 'morning'))?.label}
              </p>
            </div>
          </div>

          {/* 일시정지 해제 중 안내 */}
          {sub.status === 'paused' && pausedUntil && (
            <div className="bg-yellow-400/20 border border-yellow-300/30 rounded-xl px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle size={14} className="text-yellow-200" />
                <div>
                  <p className="text-xs font-semibold text-yellow-100">일시정지 중</p>
                  <p className="text-[11px] text-yellow-200/80">
                    {new Date(pausedUntil).toLocaleDateString('ko-KR', { month:'long', day:'numeric' })} 자동 재개 예정
                  </p>
                </div>
              </div>
              <button
                onClick={resumeSub}
                disabled={saving !== null}
                className="flex items-center gap-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-semibold transition-colors"
              >
                {saving === 'resume' ? <Loader2 size={11} className="animate-spin" /> : <PlayCircle size={11} />}
                지금 재개
              </button>
            </div>
          )}
        </div>

        {/* ── 배송 요일 ── */}
        <div className="bg-surface rounded-2xl border border-line p-5">
          <h2 className="text-sm font-semibold text-ink mb-4">배송 요일</h2>
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4, 5].map((d) => (
              <button
                key={d}
                onClick={() => setDeliveryDay(d)}
                className={`w-10 h-10 rounded-full text-sm font-semibold transition-colors ${
                  deliveryDay === d
                    ? 'bg-[#2d7a4f] text-white shadow-sm'
                    : 'bg-tint text-ink-3 hover:bg-green-tint hover:text-[#2d7a4f]'
                }`}
              >
                {DAY_LABELS[d]}
              </button>
            ))}
          </div>
          {deliveryDay !== sub.delivery_day && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-line">
              <p className="text-xs text-ink-4">
                {DAY_LABELS[sub.delivery_day]}요일 → <strong className="text-ink">{DAY_LABELS[deliveryDay]}요일</strong>
              </p>
              <button
                onClick={saveDeliveryDay}
                disabled={saving !== null}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#2d7a4f] text-white text-xs font-semibold rounded-lg hover:bg-[#235f3d] disabled:opacity-50 transition-colors"
              >
                {saving === 'day' ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                저장
              </button>
            </div>
          )}
        </div>

        {/* ── 배송 시간대 ── */}
        <div className="bg-surface rounded-2xl border border-line p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={15} className="text-[#2d7a4f]" />
            <h2 className="text-sm font-semibold text-ink">배송 시간대</h2>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {TIME_SLOTS.map(slot => (
              <button
                key={slot.id}
                onClick={() => setTimeSlot(slot.id)}
                className={`p-3.5 rounded-xl border-2 text-center transition-all ${
                  timeSlot === slot.id
                    ? 'border-[#2d7a4f] bg-green-tint'
                    : 'border-line-2 hover:border-[#2d7a4f]/40'
                }`}
              >
                <div className="text-xl mb-1">{slot.emoji}</div>
                <p className={`text-xs font-semibold ${timeSlot === slot.id ? 'text-[#2d7a4f]' : 'text-ink-3'}`}>
                  {slot.label}
                </p>
                <p className="text-[10px] text-ink-5 mt-0.5">{slot.time}</p>
              </button>
            ))}
          </div>
          {slotChanged && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-line">
              <p className="text-xs text-ink-4">
                {nextSlot.emoji} <strong className="text-ink">{nextSlot.label}</strong>으로 변경
              </p>
              <button
                onClick={saveTimeSlot}
                disabled={saving !== null}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#2d7a4f] text-white text-xs font-semibold rounded-lg hover:bg-[#235f3d] disabled:opacity-50 transition-colors"
              >
                {saving === 'slot' ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                저장
              </button>
            </div>
          )}
        </div>

        {/* ── 다음 배송일 변경 ── */}
        <div className="bg-surface rounded-2xl border border-line p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar size={15} className="text-[#2d7a4f]" />
              <h2 className="text-sm font-semibold text-ink">다음 배송일</h2>
            </div>
            {sub.status === 'active' && (
              <button
                onClick={skipOneWeek}
                disabled={saving !== null}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl text-amber-600 dark:text-amber-400 hover:bg-amber-100 disabled:opacity-50 transition-colors"
              >
                <SkipForward size={11} />
                이번 주 스킵
              </button>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
            <div className="flex-1">
              <p className="text-xs text-ink-5 mb-1.5">날짜 직접 선택</p>
              <input
                type="date"
                value={nextDelivery}
                min={new Date(Date.now() + 86400000).toISOString().slice(0, 10)}
                onChange={(e) => setNextDelivery(e.target.value)}
                className="w-full px-3 py-2.5 border border-line-2 rounded-xl text-sm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f]"
              />
            </div>
            <button
              onClick={saveNextDelivery}
              disabled={saving !== null || !nextDelivery || nextDelivery === sub?.next_delivery_at?.slice(0, 10)}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-[#2d7a4f] text-white text-xs font-semibold rounded-xl hover:bg-[#235f3d] disabled:opacity-40 shrink-0 transition-colors"
            >
              {saving === 'date' ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
              저장
            </button>
          </div>
          {sub?.next_delivery_at && (
            <p className="text-xs text-ink-5 mt-2">
              현재:{' '}
              <span className="text-ink-3 font-medium">
                {new Date(sub.next_delivery_at).toLocaleDateString('ko-KR', {
                  year:'numeric', month:'long', day:'numeric', weekday:'short',
                })}
              </span>
            </p>
          )}
        </div>

        {/* ── 자동 결제 관리 ── */}
        <div className="bg-surface rounded-2xl border border-line p-5">
          <div className="flex items-center gap-2 mb-1">
            <CreditCard size={15} className="text-[#2d7a4f]" />
            <h2 className="text-sm font-semibold text-ink">자동 결제</h2>
          </div>
          <p className="text-xs text-ink-5 mb-4">
            자동 결제를 끄면 매월 배송일 전까지 직접 결제해야 해요.
          </p>
          <div className="flex items-center justify-between p-4 rounded-xl border border-line bg-wash/50">
            <div>
              <p className="text-sm font-semibold text-ink">
                {autoRenew ? '자동 결제 활성화' : '자동 결제 비활성화'}
              </p>
              <p className="text-xs text-ink-5 mt-0.5">
                {autoRenew
                  ? `매월 ${formatPrice(monthlyPrice)} 자동 청구`
                  : '다음 배송일 전 직접 결제 필요'
                }
              </p>
            </div>
            <button
              onClick={toggleAutoRenew}
              disabled={saving === 'auto'}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
                autoRenew ? 'bg-[#2d7a4f]' : 'bg-line-3'
              } disabled:opacity-60`}
            >
              {saving === 'auto'
                ? <Loader2 size={12} className="absolute inset-0 m-auto animate-spin text-white" />
                : <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
                    autoRenew ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
              }
            </button>
          </div>
          {!autoRenew && (
            <div className="mt-3 flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
              <AlertCircle size={13} className="text-amber-500 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-700 dark:text-amber-300">
                자동 결제가 꺼져 있어요. 다음 배송일({sub.next_delivery_at
                  ? new Date(sub.next_delivery_at).toLocaleDateString('ko-KR', { month:'short', day:'numeric' })
                  : '미정'}) 전까지 결제하지 않으면 배송이 취소될 수 있어요.
              </p>
            </div>
          )}
        </div>

        {/* ── 일시정지 ── */}
        {sub.status === 'active' && (
          <div className="bg-surface rounded-2xl border border-line p-5">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <PauseCircle size={15} className="text-[#2d7a4f]" />
                <h2 className="text-sm font-semibold text-ink">구독 일시정지</h2>
              </div>
              <button
                onClick={() => setShowPause(v => !v)}
                className="text-xs text-ink-5 hover:text-ink-2 underline"
              >
                {showPause ? '닫기' : '설정'}
              </button>
            </div>
            <p className="text-xs text-ink-5 mb-3">
              원하는 기간 동안 배송을 일시중지하고, 기간이 끝나면 자동으로 재개돼요.
            </p>

            {showPause && (
              <div className="border-t border-line pt-4 space-y-4">
                <div className="grid grid-cols-4 gap-2">
                  {PAUSE_OPTIONS.map(opt => (
                    <button
                      key={opt.days}
                      onClick={() => setPauseOption(opt.days)}
                      className={`py-2.5 rounded-xl text-xs font-semibold border-2 transition-all ${
                        pauseOption === opt.days
                          ? 'border-[#2d7a4f] bg-green-tint text-[#2d7a4f]'
                          : 'border-line-2 text-ink-3 hover:border-[#2d7a4f]/40'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-between p-3 bg-tint rounded-xl text-xs text-ink-4">
                  <span>재개 예정일</span>
                  <span className="font-semibold text-ink">
                    {(() => {
                      const d = new Date(); d.setDate(d.getDate() + pauseOption)
                      return d.toLocaleDateString('ko-KR', { month:'long', day:'numeric', weekday:'short' })
                    })()}
                  </span>
                </div>
                <button
                  onClick={pauseWithDuration}
                  disabled={saving !== null}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 text-white text-sm font-semibold rounded-xl hover:bg-amber-600 disabled:opacity-50 transition-colors"
                >
                  {saving === 'pause' ? <Loader2 size={14} className="animate-spin" /> : <PauseCircle size={14} />}
                  {PAUSE_OPTIONS.find(o => o.days === pauseOption)?.label} 일시정지
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── 구독 메뉴 변경 ── */}
        <div className="bg-surface rounded-2xl border border-line p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-ink">
              구독 메뉴{' '}
              <span className="text-ink-5 font-normal">({selectedIds.length}개 선택)</span>
            </h2>
            <button
              onClick={() => setShowPicker(v => !v)}
              className="flex items-center gap-1 text-xs text-[#2d7a4f] hover:underline font-medium"
            >
              <Plus size={12} />
              {showPicker ? '닫기' : '메뉴 변경'}
            </button>
          </div>

          {selectedIds.length === 0 ? (
            <p className="text-sm text-ink-5 text-center py-4">선택된 메뉴가 없어요.</p>
          ) : (
            <div className="space-y-2 mb-4">
              {allProducts.filter(p => selectedIds.includes(p.id)).map(p => (
                <div key={p.id} className="flex items-center gap-3 bg-tint rounded-xl px-3 py-2.5">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-wash shrink-0">
                    {p.image_url && <Image src={p.image_url} alt={p.name} width={40} height={40} className="object-cover w-full h-full" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-ink truncate">{p.name}</p>
                    <p className="text-[10px] text-ink-5">{formatPrice(p.price)}</p>
                  </div>
                  <button onClick={() => toggleProduct(p.id)} className="p-1 text-ink-5 hover:text-red-400 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {showPicker && (
            <div className="border-t border-line pt-4 space-y-2 max-h-72 overflow-y-auto">
              <p className="text-xs text-ink-5 mb-3">구독 가능한 상품을 선택하세요</p>
              {allProducts.map(p => {
                const selected = selectedIds.includes(p.id)
                return (
                  <button
                    key={p.id}
                    onClick={() => toggleProduct(p.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-colors ${
                      selected ? 'border-[#2d7a4f] bg-green-tint' : 'border-line-2 hover:border-[#2d7a4f]/40'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-wash shrink-0">
                      {p.image_url && <Image src={p.image_url} alt={p.name} width={40} height={40} className="object-cover w-full h-full" />}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-xs font-medium text-ink truncate">{p.name}</p>
                      <p className="text-[10px] text-ink-5">
                        {formatPrice(p.price)}{p.calories && ` · ${p.calories}kcal`}
                      </p>
                    </div>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                      selected ? 'bg-[#2d7a4f] border-[#2d7a4f]' : 'border-line-2'
                    }`}>
                      {selected && <Check size={11} className="text-white" strokeWidth={3} />}
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {itemsChanged && (
            <div className="mt-4 pt-4 border-t border-line flex items-center justify-between">
              <p className="text-xs text-ink-4">변경사항이 있어요</p>
              <button
                onClick={saveItems}
                disabled={saving !== null}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#2d7a4f] text-white text-xs font-semibold rounded-lg hover:bg-[#235f3d] disabled:opacity-50 transition-colors"
              >
                {saving === 'items' ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                저장하기
              </button>
            </div>
          )}
        </div>

        {/* ── 구독 해지 ── */}
        <div className="bg-surface rounded-2xl border border-red-200 dark:border-red-900/50 p-5">
          <div className="flex items-center gap-2 mb-1">
            <RotateCcw size={15} className="text-red-400" />
            <h2 className="text-sm font-semibold text-ink">구독 해지</h2>
          </div>
          <p className="text-xs text-ink-5 mb-4">
            해지 후에는 다시 구독을 시작해야 해요. 이미 결제된 기간은 유지됩니다.
          </p>
          <button
            onClick={cancelSub}
            disabled={saving !== null}
            className="flex items-center gap-2 px-4 py-2.5 border border-red-300 dark:border-red-800 text-red-500 dark:text-red-400 text-xs font-semibold rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 transition-colors"
          >
            {saving === 'cancel' ? <Loader2 size={12} className="animate-spin" /> : <RotateCcw size={12} />}
            구독 해지하기
          </button>
        </div>

      </div>
    </div>
  )
}

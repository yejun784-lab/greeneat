'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/cart-store'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Tag, Coins, CreditCard, Loader2, Wallet } from 'lucide-react'
import { toast } from '@/lib/toast-store'
import { AddressPicker } from '@/components/checkout/AddressPicker'
import { DeliverySchedulePicker, type DeliverySchedule } from '@/components/checkout/DeliverySchedulePicker'
import type {} from '@/types/toss'

const SHIPPING_FEE = 3000
const FREE_SHIPPING_THRESHOLD = 50000
const BUNDLE_THRESHOLD = 3
const BUNDLE_DISCOUNT_RATE = 0.05

type Coupon = { id: string; code: string; discount_type: 'percent' | 'fixed'; discount_value: number; min_order_amount: number }

type PayMethod = 'CARD' | 'KAKAOPAY' | 'NAVERPAY' | 'TOSSPAY'

const PAY_METHODS: { id: PayMethod; label: string; sub: string; color: string; bg: string; border: string }[] = [
  { id: 'CARD',     label: '신용/체크카드', sub: '토스페이먼츠',  color: 'text-[#2d7a4f]', bg: 'bg-green-tint',   border: 'border-[#2d7a4f]' },
  { id: 'KAKAOPAY', label: '카카오페이',   sub: '카카오페이',     color: 'text-[#3A1D1D]', bg: 'bg-[#FEE500]/20', border: 'border-[#FEE500]'  },
  { id: 'NAVERPAY', label: '네이버페이',   sub: '네이버페이',     color: 'text-[#03C75A]', bg: 'bg-[#03C75A]/10', border: 'border-[#03C75A]'  },
  { id: 'TOSSPAY',  label: '토스페이',    sub: '토스페이',       color: 'text-[#0064FF]', bg: 'bg-[#0064FF]/10', border: 'border-[#0064FF]'  },
]

function KakaoPayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 2C5.582 2 2 4.91 2 8.5c0 2.293 1.52 4.306 3.82 5.44L4.6 17l4.06-2.7A9.7 9.7 0 0010 14.5c4.418 0 8-2.91 8-6.5S14.418 2 10 2z" fill="#3A1D1D"/>
    </svg>
  )
}

function NaverPayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect width="20" height="20" rx="4" fill="#03C75A"/>
      <path d="M11.2 10.2L8.5 6H6v8h2.8V9.8L11.5 14H14V6h-2.8v4.2z" fill="white"/>
    </svg>
  )
}

function TossPayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect width="20" height="20" rx="4" fill="#0064FF"/>
      <path d="M5 10.5C5 8 7 6 9.5 6H15v2h-5.5C8.1 8 7 9.1 7 10.5S8.1 13 9.5 13H15v2H9.5C7 15 5 13 5 10.5z" fill="white"/>
    </svg>
  )
}

function loadTossScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.TossPayments) { resolve(); return }
    const existing = document.querySelector('script[src*="tosspayments"]')
    if (existing) { existing.addEventListener('load', () => resolve()); existing.addEventListener('error', reject); return }
    const script = document.createElement('script')
    script.src = 'https://js.tosspayments.com/v2/standard'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Toss 결제 스크립트 로드 실패'))
    document.head.appendChild(script)
  })
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, _hasHydrated } = useCartStore()
  const [address, setAddress] = useState('')
  const [detail, setDetail] = useState('')
  const [deliverySchedule, setDeliverySchedule] = useState<DeliverySchedule>({
    date: '',
    timeSlot: 'morning',
    memo: '',
  })
  const [loading, setLoading] = useState(false)
  const [tossReady, setTossReady] = useState(false)
  const [payMethod, setPayMethod] = useState<PayMethod>('CARD')

  const [couponCode, setCouponCode] = useState('')
  const [coupon, setCoupon] = useState<Coupon | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [availableCoupons, setAvailableCoupons] = useState<Coupon[]>([])

  const [pointBalance, setPointBalance] = useState(0)
  const [usePointInput, setUsePointInput] = useState('')
  const [usedPoints, setUsedPoints] = useState(0)

  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')

  const total = totalPrice()
  const totalItems = items.reduce((s, i) => s + i.quantity, 0)
  const bundleDiscount = totalItems >= BUNDLE_THRESHOLD ? Math.round(total * BUNDLE_DISCOUNT_RATE) : 0
  const discountedTotal = total - bundleDiscount
  const shipping = discountedTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
  const couponDiscount = coupon
    ? coupon.discount_type === 'percent'
      ? Math.round(discountedTotal * coupon.discount_value / 100)
      : coupon.discount_value
    : 0
  const finalTotal = Math.max(0, discountedTotal + shipping - couponDiscount - usedPoints)

  useEffect(() => {
    loadTossScript()
      .then(() => setTossReady(true))
      .catch(() => toast.error('결제 모듈 로드에 실패했습니다. 페이지를 새로고침해주세요.'))

    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) { router.replace('/login'); return }
      setUserEmail(data.user.email ?? '')
      const { data: profile } = await supabase
        .from('profiles')
        .select('point_balance, name')
        .eq('id', data.user.id)
        .single()
      setPointBalance(profile?.point_balance ?? 0)
      setUserName(profile?.name ?? '')

      // 사용 가능한 쿠폰 조회 (user_coupons 또는 공개 쿠폰)
      const { data: userCoupons } = await supabase
        .from('user_coupons')
        .select('coupons(*)')
        .eq('user_id', data.user.id)
        .eq('is_used', false)
      const parsed = (userCoupons ?? [])
        .map((uc: { coupons: Coupon | Coupon[] | null }) => (Array.isArray(uc.coupons) ? uc.coupons[0] : uc.coupons))
        .filter(Boolean) as Coupon[]
      setAvailableCoupons(parsed)
    })
  }, [router])

  useEffect(() => {
    if (_hasHydrated && items.length === 0) router.replace('/cart')
  }, [_hasHydrated, items.length, router])

  async function applyCoupon() {
    if (!couponCode.trim()) return
    setCouponLoading(true)
    setCouponError(null)
    const supabase = createClient()
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', couponCode.trim().toUpperCase())
      .eq('is_active', true)
      .maybeSingle()
    if (error || !data) {
      setCouponError('유효하지 않은 쿠폰 코드입니다.')
    } else if (data.min_order_amount > total) {
      setCouponError(`최소 주문 금액 ${formatPrice(data.min_order_amount)} 이상에서 사용 가능합니다.`)
    } else {
      setCoupon(data as Coupon)
      const desc = data.discount_type === 'percent'
        ? `${data.discount_value}% 할인`
        : `${formatPrice(data.discount_value)} 할인`
      toast.success(`쿠폰 적용 완료! ${desc}`)
    }
    setCouponLoading(false)
  }

  // 포인트 사용 가능 최대치 = 묶음할인 후 금액 + 배송비 - 쿠폰할인 (결제 전 금액)
  const maxUsablePoints = Math.min(pointBalance, Math.max(0, discountedTotal + shipping - couponDiscount))

  function applyPoints() {
    const v = parseInt(usePointInput, 10)
    if (isNaN(v) || v <= 0) { toast.error('올바른 포인트를 입력하세요.'); return }
    if (v > pointBalance) { toast.error(`보유 포인트(${pointBalance.toLocaleString()}P)를 초과했어요.`); return }
    if (v > maxUsablePoints) { toast.error(`최대 ${maxUsablePoints.toLocaleString()}P까지 사용 가능해요.`); return }
    setUsedPoints(v)
    toast.success(`${v.toLocaleString()}P 사용 적용됐어요!`)
  }

  const handlePayment = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!address) { toast.error('배송지를 입력해주세요.'); return }
    if (!deliverySchedule.date) { toast.error('배송 날짜를 선택해주세요.'); return }
    // 0원 결제는 PG사에서 오류 반환 — 포인트/쿠폰으로 전액 차감된 경우
    if (finalTotal === 0) {
      toast.error('결제 금액이 0원입니다. 포인트·쿠폰 사용량을 조정해주세요.')
      return
    }
    if (!tossReady || !window.TossPayments) {
      toast.error('결제 모듈을 불러오는 중입니다. 잠시 후 다시 시도해주세요.')
      return
    }

    setLoading(true)
    let dbOrderId: string | null = null
    try {
      // 1) DB에 pending 주문 생성
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            product_id: i.product.id,
            quantity: i.quantity,
            price: i.product.price,
          })),
          address: { address, detail },
          totalPrice: finalTotal,
          usedPoints,
          couponId: coupon?.id ?? null,
          pending: true,
          deliveryDate:     deliverySchedule.date     || null,
          deliveryTimeSlot: deliverySchedule.timeSlot || null,
          deliveryMemo:     deliverySchedule.memo     || null,
        }),
      })

      if (!res.ok) {
        const { error } = await res.json()
        toast.error(error ?? '주문 생성에 실패했습니다.')
        setLoading(false)
        return
      }

      const { orderId } = await res.json()
      dbOrderId = orderId

      // 2) TossPayments 결제 요청
      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!
      const tossPayments = window.TossPayments(clientKey)
      const payment = tossPayments.payment({ customerKey: dbOrderId! })

      const orderName = items.length === 1
        ? items[0].product.name
        : `${items[0].product.name} 외 ${items.length - 1}개`

      const commonPayParams = {
        amount: { currency: 'KRW', value: finalTotal },
        orderId: dbOrderId!,
        orderName,
        customerName: userName || undefined,
        customerEmail: userEmail || undefined,
        successUrl: `${window.location.origin}/checkout/success?usedPoints=${usedPoints}`,
        failUrl: `${window.location.origin}/checkout/fail`,
      }

      if (payMethod === 'CARD') {
        await payment.requestPayment({ method: 'CARD', ...commonPayParams })
      } else {
        const providerMap: Record<Exclude<PayMethod, 'CARD'>, string> = {
          KAKAOPAY: 'KAKAOPAY',
          NAVERPAY: 'NAVERPAY',
          TOSSPAY: 'TOSSPAY',
        }
        await payment.requestPayment({
          method: 'EASY_PAY',
          easyPay: { provider: providerMap[payMethod as Exclude<PayMethod, 'CARD'>] },
          ...commonPayParams,
        })
      }
      // requestPayment가 성공하면 successUrl로 redirect됨
    } catch (err: unknown) {
      // 결제 실패/취소 시 pending 주문 DB에서 삭제
      if (dbOrderId) {
        fetch(`/api/orders/${dbOrderId}`, { method: 'DELETE' }).catch(() => {})
      }
      const message = err instanceof Error ? err.message : ''
      if (!message.includes('PAY_PROCESS_CANCELED')) {
        toast.error('결제 처리 중 오류가 발생했습니다.')
      }
      setLoading(false)
    }
  }, [address, detail, deliverySchedule, finalTotal, usedPoints, items, tossReady, userName, userEmail])

  if (!_hasHydrated) return (
    <div className="flex justify-center items-center h-64">
      <Loader2 size={24} className="animate-spin text-[#2d7a4f]" />
    </div>
  )
  if (items.length === 0) return null

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-ink mb-8">결제</h1>

      <form onSubmit={handlePayment} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* 왼쪽 */}
        <div className="lg:col-span-2 space-y-6">
          {/* 배송지 */}
          <div className="bg-surface rounded-2xl border border-line p-5">
            <h2 className="font-semibold text-ink mb-4">배송지</h2>
            <AddressPicker
              value={address}
              detail={detail}
              onChange={(a, d) => { setAddress(a); setDetail(d) }}
            />
          </div>

          {/* 배송 일정 */}
          <div className="bg-surface rounded-2xl border border-line p-5">
            <h2 className="font-semibold text-ink mb-5">배송 일정</h2>
            <DeliverySchedulePicker
              minDaysAhead={2}
              value={deliverySchedule}
              onChange={setDeliverySchedule}
            />
          </div>

          {/* 포인트 사용 */}
          {pointBalance > 0 && (
            <div className="bg-surface rounded-2xl border border-line p-5">
              <h2 className="font-semibold text-ink mb-4 flex items-center gap-2">
                <Coins size={16} className="text-yellow-500" />
                포인트 사용
              </h2>
              <p className="text-sm text-ink-4 mb-3">
                보유 포인트: <span className="font-bold text-[#2d7a4f]">{pointBalance.toLocaleString()}P</span>
              </p>
              {usedPoints > 0 ? (
                <div className="flex items-center justify-between bg-yellow-50 rounded-xl p-3">
                  <p className="text-sm font-medium text-yellow-700">
                    {usedPoints.toLocaleString()}P 사용 중
                  </p>
                  <button
                    type="button"
                    onClick={() => { setUsedPoints(0); setUsePointInput('') }}
                    className="text-xs text-ink-5 hover:text-red-400"
                  >
                    취소
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="number"
                    value={usePointInput}
                    onChange={(e) => setUsePointInput(e.target.value)}
                    placeholder={`최대 ${maxUsablePoints.toLocaleString()}P`}
                    max={maxUsablePoints}
                    min={1}
                    className="flex-1 px-3 py-2.5 border border-line-2 rounded-lg text-sm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f]"
                  />
                  <div className="flex gap-2 sm:contents">
                    <Button type="button" size="sm" variant="secondary" className="flex-1 sm:flex-none" onClick={applyPoints}>사용</Button>
                    <Button type="button" size="sm" variant="secondary" className="flex-1 sm:flex-none" onClick={() => setUsePointInput(String(maxUsablePoints))}>전액</Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 쿠폰 */}
          <div className="bg-surface rounded-2xl border border-line p-5">
            <h2 className="font-semibold text-ink mb-4 flex items-center gap-2">
              <Tag size={16} className="text-[#2d7a4f]" />
              쿠폰 / 할인 코드
            </h2>
            {coupon ? (
              <div className="flex items-center justify-between bg-green-tint rounded-xl p-3">
                <div>
                  <p className="font-medium text-[#2d7a4f] text-sm">{coupon.code}</p>
                  <p className="text-xs text-ink-4">
                    {coupon.discount_type === 'percent'
                      ? `${coupon.discount_value}% 할인`
                      : `${formatPrice(coupon.discount_value)} 할인`}
                    {' '}적용됨
                  </p>
                </div>
                <button type="button" onClick={() => { setCoupon(null); setCouponCode('') }} className="text-xs text-ink-5 hover:text-red-400">취소</button>
              </div>
            ) : (
              <>
                {/* 보유 쿠폰 자동 추천 */}
                {availableCoupons.length > 0 && (() => {
                  const eligible = availableCoupons.filter(c => discountedTotal >= c.min_order_amount)
                  if (eligible.length === 0) return null
                  const best = eligible.reduce((a, b) => {
                    const da = a.discount_type === 'percent' ? Math.round(discountedTotal * a.discount_value / 100) : a.discount_value
                    const db = b.discount_type === 'percent' ? Math.round(discountedTotal * b.discount_value / 100) : b.discount_value
                    return da >= db ? a : b
                  })
                  const bestDiscount = best.discount_type === 'percent'
                    ? Math.round(discountedTotal * best.discount_value / 100)
                    : best.discount_value
                  return (
                    <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-3">
                      <div>
                        <p className="text-xs font-semibold text-amber-700">🎫 최대 할인 쿠폰</p>
                        <p className="text-sm font-bold text-ink mt-0.5">{best.code}
                          <span className="ml-2 text-xs font-normal text-ink-4">
                            {best.discount_type === 'percent' ? `${best.discount_value}%` : formatPrice(best.discount_value)} 할인
                          </span>
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => { setCoupon(best); setCouponCode(best.code); toast.success(`${best.code} 쿠폰이 적용됐어요! ${formatPrice(bestDiscount)} 할인`) }}
                        className="shrink-0 px-3 py-1.5 bg-amber-500 text-white text-xs font-semibold rounded-lg hover:bg-amber-600 transition-colors"
                      >
                        바로 적용
                      </button>
                    </div>
                  )
                })()}
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="쿠폰 코드 입력 (예: WELCOME10)"
                    className="flex-1 px-3 py-2.5 border border-line-2 rounded-lg text-sm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f]"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), applyCoupon())}
                  />
                  <Button type="button" size="sm" variant="secondary" className="w-full sm:w-auto" onClick={applyCoupon} loading={couponLoading}>적용</Button>
                </div>
              </>
            )}
            {couponError && <p className="text-xs text-red-500 mt-2">{couponError}</p>}
          </div>

          {/* 결제 수단 */}
          <div className="bg-surface rounded-2xl border border-line p-5">
            <h2 className="font-semibold text-ink mb-4">결제 수단</h2>
            <div className="grid grid-cols-2 gap-2">
              {PAY_METHODS.map((m) => {
                const selected = payMethod === m.id
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPayMethod(m.id)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all text-left ${
                      selected ? `${m.border} ${m.bg}` : 'border-line-2 hover:border-line'
                    }`}
                  >
                    <div className="shrink-0">
                      {m.id === 'CARD'     && <CreditCard size={20} className={selected ? m.color : 'text-ink-4'} />}
                      {m.id === 'KAKAOPAY' && <KakaoPayIcon />}
                      {m.id === 'NAVERPAY' && <NaverPayIcon />}
                      {m.id === 'TOSSPAY'  && <TossPayIcon />}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-semibold truncate ${selected ? m.color : 'text-ink-3'}`}>{m.label}</p>
                    </div>
                    {selected && (
                      <div className={`ml-auto w-3.5 h-3.5 rounded-full ${m.border.replace('border-', 'bg-')} flex items-center justify-center shrink-0`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-surface" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
            {!tossReady && (
              <p className="text-xs text-ink-5 mt-2 flex items-center gap-1">
                <Loader2 size={12} className="animate-spin" />
                결제 모듈 로딩 중...
              </p>
            )}
          </div>
        </div>

        {/* 오른쪽: 주문 요약 */}
        <div className="lg:col-span-1">
          <div className="bg-surface rounded-2xl border border-line p-5 sticky top-24">
            <h2 className="font-semibold text-ink mb-4">주문 상품</h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.isSubscription}`} className="flex justify-between text-sm">
                  <span className="text-ink-3 truncate flex-1 mr-2">
                    {item.product.name} × {item.quantity}
                  </span>
                  <span className="shrink-0 text-ink">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-line pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-4">상품 금액</span>
                <span className="text-ink">{formatPrice(total)}</span>
              </div>
              {bundleDiscount > 0 && (
                <div className="flex justify-between text-[#2d7a4f]">
                  <span className="flex items-center gap-1"><Tag size={12} /> 묶음 할인 (5%)</span>
                  <span>-{formatPrice(bundleDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-ink-4">배송비</span>
                <span className={shipping === 0 ? 'text-[#2d7a4f]' : 'text-ink'}>{shipping === 0 ? '무료' : formatPrice(shipping)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-[#2d7a4f]">
                  <span>쿠폰 할인</span>
                  <span>-{formatPrice(couponDiscount)}</span>
                </div>
              )}
              {usedPoints > 0 && (
                <div className="flex justify-between text-yellow-600">
                  <span className="flex items-center gap-1"><Coins size={12} />포인트 사용</span>
                  <span>-{usedPoints.toLocaleString()}P</span>
                </div>
              )}
              <div className="border-t border-line pt-2 flex justify-between text-xs text-yellow-600">
                <span>주문 후 적립 예정</span>
                <span>+{Math.floor(finalTotal * 0.01).toLocaleString()}P</span>
              </div>
            </div>
            <div className="border-t border-line mt-3 pt-3 flex justify-between">
              <span className="font-semibold text-ink">총 결제 금액</span>
              <span className="font-bold text-lg text-[#2d7a4f]">{formatPrice(finalTotal)}</span>
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full mt-4"
              loading={loading}
              disabled={!tossReady}
            >
              {loading
                ? '처리 중...'
                : `${formatPrice(finalTotal)} ${PAY_METHODS.find((m) => m.id === payMethod)?.label ?? ''}로 결제`}
            </Button>
            <p className="text-xs text-center text-ink-5 mt-3 flex items-center justify-center gap-1">
              <Wallet size={11} />
              토스페이먼츠 보안 결제
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}

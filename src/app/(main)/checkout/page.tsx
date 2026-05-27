'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/lib/cart-store'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Tag, Coins, CreditCard, Loader2 } from 'lucide-react'
import { toast } from '@/lib/toast-store'
import { AddressPicker } from '@/components/checkout/AddressPicker'
import type {} from '@/types/toss'

const SHIPPING_FEE = 3000
const FREE_SHIPPING_THRESHOLD = 50000

type Coupon = { id: string; code: string; discount_type: 'percent' | 'fixed'; discount_value: number; min_order_amount: number }

function loadTossScript(): Promise<void> {
  return new Promise((resolve) => {
    if (window.TossPayments) { resolve(); return }
    const existing = document.querySelector('script[src*="tosspayments"]')
    if (existing) { existing.addEventListener('load', () => resolve()); return }
    const script = document.createElement('script')
    script.src = 'https://js.tosspayments.com/v2/standard'
    script.onload = () => resolve()
    document.head.appendChild(script)
  })
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice } = useCartStore()
  const [address, setAddress] = useState('')
  const [detail, setDetail] = useState('')
  const [deliveryDate, setDeliveryDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [tossReady, setTossReady] = useState(false)

  const [couponCode, setCouponCode] = useState('')
  const [coupon, setCoupon] = useState<Coupon | null>(null)
  const [couponError, setCouponError] = useState<string | null>(null)
  const [couponLoading, setCouponLoading] = useState(false)

  const [pointBalance, setPointBalance] = useState(0)
  const [usePointInput, setUsePointInput] = useState('')
  const [usedPoints, setUsedPoints] = useState(0)

  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')

  const total = totalPrice()
  const shipping = total >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
  const couponDiscount = coupon
    ? coupon.discount_type === 'percent'
      ? Math.round(total * coupon.discount_value / 100)
      : coupon.discount_value
    : 0
  const finalTotal = Math.max(0, total + shipping - couponDiscount - usedPoints)

  useEffect(() => {
    loadTossScript().then(() => setTossReady(true))

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
    })
  }, [router])

  useEffect(() => {
    if (items.length === 0) router.replace('/cart')
  }, [items.length, router])

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

  // 포인트 사용 가능 최대치 = 상품금액 + 배송비 - 쿠폰할인 (결제 전 금액)
  const maxUsablePoints = Math.min(pointBalance, Math.max(0, total + shipping - couponDiscount))

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
          pending: true,
          deliveryDate: deliveryDate || null,
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

      await payment.requestPayment({
        method: '카드',
        amount: { currency: 'KRW', value: finalTotal },
        orderId: dbOrderId!,
        orderName,
        customerName: userName || undefined,
        customerEmail: userEmail || undefined,
        successUrl: `${window.location.origin}/checkout/success?usedPoints=${usedPoints}`,
        failUrl: `${window.location.origin}/checkout/fail`,
      })
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
  }, [address, detail, finalTotal, usedPoints, items, tossReady, userName, userEmail])

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
            <h2 className="font-semibold text-ink mb-4">배송 일정</h2>
            <input
              type="date"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              min={new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]}
              className="w-full px-3 py-2.5 border border-line-2 rounded-lg text-sm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f] focus:border-transparent"
            />
            <p className="text-xs text-ink-5 mt-2">오늘로부터 2일 이후 날짜를 선택하세요.</p>
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
            )}
            {couponError && <p className="text-xs text-red-500 mt-2">{couponError}</p>}
          </div>

          {/* 결제 수단 */}
          <div className="bg-surface rounded-2xl border border-line p-5">
            <h2 className="font-semibold text-ink mb-4">결제 수단</h2>
            <div className="border-2 border-[#2d7a4f] rounded-xl p-3 flex items-center gap-3">
              <CreditCard size={20} className="text-[#2d7a4f]" />
              <div>
                <p className="text-sm font-medium text-ink">신용/체크카드</p>
                <p className="text-xs text-ink-4">토스페이먼츠 — 안전한 결제</p>
              </div>
              <div className="ml-auto w-4 h-4 rounded-full bg-[#2d7a4f] flex items-center justify-center shrink-0">
                <div className="w-2 h-2 rounded-full bg-white" />
              </div>
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
              {loading ? '처리 중...' : `${formatPrice(finalTotal)} 결제하기`}
            </Button>
            <p className="text-xs text-center text-ink-5 mt-3">
              토스페이먼츠 보안 결제
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}

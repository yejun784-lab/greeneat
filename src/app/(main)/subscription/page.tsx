'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { CheckCircle2, Truck, RefreshCw, Leaf, Check, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { toast } from '@/lib/toast-store'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'

type PlanId = 'basic' | 'standard' | 'premium'

const PLANS = [
  {
    id: 'basic' as PlanId,
    name: '베이직',
    price: 39900,
    meals: '주 2회',
    saves: '10%',
    maxProducts: 2,
    features: ['주 2회 배송', '최대 2가지 메뉴', '무료 배송', '언제든 취소 가능'],
  },
  {
    id: 'standard' as PlanId,
    name: '스탠다드',
    price: 69900,
    meals: '주 4회',
    saves: '15%',
    popular: true,
    maxProducts: 4,
    features: ['주 4회 배송', '최대 4가지 메뉴', '무료 배송', '메뉴 자유 변경', '언제든 취소 가능'],
  },
  {
    id: 'premium' as PlanId,
    name: '프리미엄',
    price: 99900,
    meals: '주 6회',
    saves: '20%',
    maxProducts: 99,
    features: ['주 6회 배송', '무제한 메뉴 선택', '무료 배송 + 우선 배송', '전문 영양사 식단 추천', '언제든 취소 가능'],
  },
]

const DELIVERY_DAYS = [
  { value: 1, label: '월' },
  { value: 2, label: '화' },
  { value: 3, label: '수' },
  { value: 4, label: '목' },
  { value: 5, label: '금' },
]

type Product = {
  id: string
  name: string
  price: number
  image_url: string | null
  calories: number | null
  servings: number | null
}

export default function SubscriptionPage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('standard')
  const [selectedDay, setSelectedDay] = useState(1)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  const [products, setProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([])

  // 인증 상태 확인 (로그인 강제 아님)
  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
      setUserId(data.user?.id ?? null)
    })
  }, [])

  // 구독 가능 상품 로드
  useEffect(() => {
    createClient()
      .from('products')
      .select('id, name, price, image_url, calories, servings')
      .eq('is_subscription', true)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error) setProducts((data ?? []) as unknown as Product[])
        setProductsLoading(false)
      })
  }, [])

  const currentPlan = PLANS.find((p) => p.id === selectedPlan)!
  const maxProducts = currentPlan.maxProducts

  function toggleProduct(id: string) {
    setSelectedProductIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= maxProducts) {
        toast.error(`${currentPlan.name} 플랜은 최대 ${maxProducts}가지까지 선택할 수 있어요.`)
        return prev
      }
      return [...prev, id]
    })
  }

  // 플랜 변경 시 초과 선택 자동 제거
  function changePlan(plan: PlanId) {
    setSelectedPlan(plan)
    const newMax = PLANS.find((p) => p.id === plan)!.maxProducts
    setSelectedProductIds((prev) => prev.slice(0, newMax))
  }

  async function handleSubscribe() {
    if (!userId) {
      toast.info('로그인 후 구독을 시작할 수 있어요.', { action: { label: '로그인', href: '/login' } })
      return
    }
    if (selectedProductIds.length === 0) {
      toast.error('구독할 메뉴를 1가지 이상 선택해주세요.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan_type: selectedPlan,
          delivery_day: selectedDay,
          product_ids: selectedProductIds,
        }),
      })
      if (!res.ok) {
        const { error } = await res.json()
        if (error === '로그인이 필요합니다.') {
          toast.error('로그인 후 이용해주세요.')
          router.push('/login')
          return
        }
        toast.error(error || '구독 신청에 실패했습니다.')
        return
      }
      toast.success(`${currentPlan.name} 플랜 구독이 시작되었습니다! 🌿`)
      router.push('/my')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* 히어로 */}
      <section className="bg-gradient-to-br from-[#1a4a2e] to-[#2d7a4f] dark:from-[#1e2b1e] dark:to-[#2a3d2a] py-16 text-center px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-white dark:text-[#e8f0e8] mb-3">GreenEat 구독 플랜</h1>
        <p className="text-green-200 dark:text-[#8ab08a] text-lg">정기 구독으로 더 저렴하게, 더 건강하게</p>
      </section>

      {/* 혜택 */}
      <section className="bg-cream dark:bg-wash py-10 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: Truck, title: '무료 배송', desc: '구독 시 배송비 0원' },
            { icon: RefreshCw, title: '자유로운 변경', desc: '언제든 메뉴·일정 변경' },
            { icon: Leaf, title: '신선 보장', desc: '당일 생산 신선 재료' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3 bg-surface rounded-2xl p-4">
              <div className="w-9 h-9 rounded-xl bg-green-tint flex items-center justify-center shrink-0">
                <Icon size={18} className="text-[#2d7a4f]" />
              </div>
              <div>
                <p className="font-semibold text-ink text-sm">{title}</p>
                <p className="text-xs text-ink-4 mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-14 px-4">
        <div className="max-w-4xl mx-auto">

          {/* ① 플랜 선택 */}
          <h2 className="text-2xl font-bold text-ink text-center mb-8">플랜 선택</h2>
          <div className="grid md:grid-cols-3 gap-5 mb-10">
            {PLANS.map((plan) => (
              <button
                key={plan.id}
                onClick={() => changePlan(plan.id)}
                className={`relative text-left rounded-2xl border-2 p-5 transition-all ${
                  selectedPlan === plan.id
                    ? 'border-[#2d7a4f] bg-green-tint-2'
                    : 'border-line-2 hover:border-line-3 bg-surface'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-2.5 left-4 bg-[#2d7a4f] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                    인기
                  </span>
                )}
                <p className="font-bold text-ink text-lg">{plan.name}</p>
                <p className="text-sm text-[#2d7a4f] font-medium">{plan.meals} · {plan.saves} 할인</p>
                <p className="text-2xl font-bold text-ink mt-2">
                  {plan.price.toLocaleString()}
                  <span className="text-sm font-normal text-ink-4">원/월</span>
                </p>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-ink-3">
                      <CheckCircle2 size={14} className="text-[#2d7a4f] shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                {selectedPlan === plan.id && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#2d7a4f] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* ② 메뉴 선택 */}
          <div className="bg-surface rounded-2xl border border-line p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-ink">정기 배송 메뉴 선택</h3>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                selectedProductIds.length >= maxProducts
                  ? 'bg-[#2d7a4f] text-white'
                  : 'bg-tint text-ink-4'
              }`}>
                {selectedProductIds.length} / {maxProducts === 99 ? '무제한' : maxProducts}
              </span>
            </div>

            {productsLoading ? (
              <p className="text-center text-sm text-ink-5 py-8">구독 가능한 상품을 불러오는 중...</p>
            ) : products.length === 0 ? (
              <p className="text-center text-sm text-ink-5 py-8">현재 구독 가능한 상품이 없습니다.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {products.map((product) => {
                  const selected = selectedProductIds.includes(product.id)
                  const disabled = !selected && selectedProductIds.length >= maxProducts
                  return (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => toggleProduct(product.id)}
                      disabled={disabled}
                      className={`relative text-left rounded-xl border-2 overflow-hidden transition-all ${
                        selected
                          ? 'border-[#2d7a4f] bg-green-tint-2'
                          : disabled
                          ? 'border-line opacity-40 cursor-not-allowed'
                          : 'border-line-2 hover:border-[#2d7a4f]/40 bg-surface'
                      }`}
                    >
                      {/* 이미지 */}
                      <div className="relative aspect-video bg-wash">
                        {product.image_url && (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="200px"
                          />
                        )}
                        {selected && (
                          <div className="absolute inset-0 bg-[#2d7a4f]/20 flex items-center justify-center">
                            <div className="w-8 h-8 rounded-full bg-[#2d7a4f] flex items-center justify-center">
                              <Check size={16} className="text-white" />
                            </div>
                          </div>
                        )}
                        {!selected && !disabled && (
                          <div className="absolute inset-0 bg-black/0 hover:bg-black/5 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Plus size={20} className="text-[#2d7a4f]" />
                          </div>
                        )}
                      </div>
                      {/* 정보 */}
                      <div className="p-2.5">
                        <p className="text-xs font-semibold text-ink truncate">{product.name}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-ink-5">
                            {product.calories ? `${product.calories}kcal` : ''}
                            {product.servings ? ` · ${product.servings}인분` : ''}
                          </span>
                          <span className="text-xs font-bold text-[#2d7a4f]">{formatPrice(product.price)}</span>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            {selectedProductIds.length > 0 && (
              <p className="mt-3 text-xs text-[#2d7a4f] text-center font-medium">
                ✓ {selectedProductIds.length}가지 메뉴 선택됨
              </p>
            )}
          </div>

          {/* ③ 배송 요일 */}
          <div className="bg-surface rounded-2xl border border-line p-6 mb-6">
            <h3 className="font-semibold text-ink mb-4">배송 시작 요일</h3>
            <div className="flex gap-2">
              {DELIVERY_DAYS.map((day) => (
                <button
                  key={day.value}
                  onClick={() => setSelectedDay(day.value)}
                  className={`w-11 h-11 rounded-xl text-sm font-medium transition-colors ${
                    selectedDay === day.value
                      ? 'bg-[#2d7a4f] text-white'
                      : 'bg-tint text-ink-3 hover:bg-line-2'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          {/* 최종 요약 */}
          {selectedProductIds.length > 0 && (
            <div className="bg-green-tint rounded-2xl p-4 mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-[#2d7a4f]">
                  {currentPlan.name} 플랜 · {selectedProductIds.length}가지 메뉴
                </p>
                <p className="text-xs text-ink-4 mt-0.5">
                  {DELIVERY_DAYS.find((d) => d.value === selectedDay)?.label}요일 정기 배송
                </p>
              </div>
              <p className="text-lg font-bold text-[#2d7a4f]">
                {currentPlan.price.toLocaleString()}원
                <span className="text-xs font-normal text-ink-4">/월</span>
              </p>
            </div>
          )}

          <Button
            size="lg"
            className="w-full max-w-sm mx-auto block"
            loading={loading}
            onClick={handleSubscribe}
          >
            {currentPlan.name} 구독 시작하기
          </Button>
        </div>
      </section>
    </div>
  )
}

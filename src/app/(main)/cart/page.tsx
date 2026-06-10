'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, Tag } from 'lucide-react'
import { useCartStore } from '@/lib/cart-store'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

const SHIPPING_FEE = 3000
const FREE_SHIPPING_THRESHOLD = 50000
const BUNDLE_THRESHOLD = 3
const BUNDLE_DISCOUNT = 0.05

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, _hasHydrated } = useCartStore()
  const total = totalPrice()
  const totalItems = items.reduce((s, i) => s + i.quantity, 0)

  const isBundleEligible = totalItems >= BUNDLE_THRESHOLD
  const bundleDiscount = isBundleEligible ? Math.round(total * BUNDLE_DISCOUNT) : 0
  const discountedTotal = total - bundleDiscount
  const shipping = discountedTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
  const finalTotal = discountedTotal + shipping

  if (!_hasHydrated) return null

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 flex flex-col items-center">
        {/* 일러스트 */}
        <div className="relative w-36 h-36 mb-6">
          <div className="absolute inset-0 bg-green-tint rounded-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <ShoppingBag size={56} className="text-[#2d7a4f]/50" strokeWidth={1.5} />
          </div>
          {/* 작은 아이콘들 */}
          <span className="absolute -top-1 -right-1 text-2xl animate-bounce" style={{ animationDuration: '2s' }}>🥦</span>
          <span className="absolute -bottom-1 -left-2 text-xl animate-bounce" style={{ animationDuration: '2.4s', animationDelay: '0.3s' }}>🍱</span>
        </div>

        <h2 className="text-xl font-bold text-ink mb-2">장바구니가 비어있어요</h2>
        <p className="text-sm text-ink-4 mb-1">신선한 밀키트를 담아보세요!</p>
        <p className="text-xs text-ink-5 mb-8">3개 이상 담으면 <span className="text-[#2d7a4f] font-semibold">5% 묶음 할인</span>이 적용돼요</p>

        <div className="flex gap-3">
          <Link href="/products" className="px-6 py-3 bg-[#2d7a4f] text-white text-sm font-semibold rounded-xl hover:bg-[#235f3d] transition-colors">
            밀키트 둘러보기
          </Link>
          <Link href="/products?sort=popular" className="px-6 py-3 border border-line-2 text-ink-3 text-sm font-medium rounded-xl hover:border-[#2d7a4f] hover:text-[#2d7a4f] transition-colors">
            인기 상품 보기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-ink mb-8">장바구니</h1>

      {/* 묶음 할인 배너 */}
      {isBundleEligible ? (
        <div className="mb-5 flex items-center gap-2.5 bg-green-tint border border-[#2d7a4f]/20 rounded-2xl px-4 py-3">
          <Tag size={16} className="text-[#2d7a4f] shrink-0" />
          <p className="text-sm text-[#2d7a4f] font-medium">
            🎉 묶음 할인 적용! {totalItems}개 담아서 <strong>{BUNDLE_DISCOUNT * 100}% 할인</strong>을 받고 있어요.
          </p>
          <span className="ml-auto text-sm font-bold text-[#2d7a4f]">-{formatPrice(bundleDiscount)}</span>
        </div>
      ) : (
        <div className="mb-5 flex items-center gap-2.5 bg-wash border border-line rounded-2xl px-4 py-3">
          <Tag size={16} className="text-ink-5 shrink-0" />
          <p className="text-sm text-ink-4">
            총 <strong>{BUNDLE_THRESHOLD - totalItems}개</strong> 더 담으면 묶음 할인 5%를 받아요!
          </p>
          <div className="ml-auto flex gap-0.5">
            {Array.from({ length: BUNDLE_THRESHOLD }).map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full ${i < totalItems ? 'bg-[#2d7a4f]' : 'bg-line-2'}`}
              />
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* 아이템 목록 */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={`${item.product.id}-${item.isSubscription}`}
              className="flex gap-4 bg-surface rounded-2xl border border-line p-4"
            >
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-wash shrink-0">
                {item.product.image_url && (
                  <Image
                    src={item.product.image_url}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <Link
                      href={`/products/${item.product.id}`}
                      className="font-medium text-ink hover:text-[#2d7a4f] transition-colors text-sm"
                    >
                      {item.product.name}
                    </Link>
                    {item.isSubscription && (
                      <span className="ml-2 text-xs bg-green-tint text-[#2d7a4f] px-1.5 py-0.5 rounded-full">
                        구독
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => removeItem(item.product.id, item.isSubscription)}
                    className="p-1 text-ink-5 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1.5 border border-line-2 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.isSubscription)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-wash text-ink"
                    >
                      <Minus size={12} />
                    </button>
                    <span key={item.quantity} className="w-7 text-center text-sm font-medium text-ink animate-count-bump">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.isSubscription)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-wash text-ink"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <span className="text-sm font-semibold text-ink">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 주문 요약 */}
        <div className="lg:col-span-1">
          <div className="bg-surface rounded-2xl border border-line p-5 sticky top-24">
            <h2 className="font-semibold text-ink mb-4">주문 요약</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-4">상품 금액</span>
                <span className="text-ink">{formatPrice(total)}</span>
              </div>
              {bundleDiscount > 0 && (
                <div className="flex justify-between text-[#2d7a4f]">
                  <span className="flex items-center gap-1">
                    <Tag size={12} /> 묶음 할인 (5%)
                  </span>
                  <span>-{formatPrice(bundleDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-ink-4">배송비</span>
                <span className={shipping === 0 ? 'text-[#2d7a4f] font-medium' : 'text-ink'}>
                  {shipping === 0 ? '무료' : formatPrice(shipping)}
                </span>
              </div>
              {discountedTotal < FREE_SHIPPING_THRESHOLD && (
                <p className="text-xs text-ink-5">
                  {formatPrice(FREE_SHIPPING_THRESHOLD - discountedTotal)} 더 담으면 무료 배송
                </p>
              )}
            </div>
            <div className="border-t border-line mt-4 pt-4 flex justify-between">
              <span className="font-semibold text-ink">총 결제 금액</span>
              <span className="font-bold text-lg text-[#2d7a4f]">{formatPrice(finalTotal)}</span>
            </div>
            <Link href="/checkout" className="block mt-4">
              <Button size="lg" className="w-full">결제하기</Button>
            </Link>
            <Link href="/products" className="block mt-2">
              <Button size="md" variant="ghost" className="w-full text-ink-4">
                계속 쇼핑하기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

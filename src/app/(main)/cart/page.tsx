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
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore()
  const total = totalPrice()
  const totalItems = items.reduce((s, i) => s + i.quantity, 0)

  const isBundleEligible = totalItems >= BUNDLE_THRESHOLD
  const bundleDiscount = isBundleEligible ? Math.round(total * BUNDLE_DISCOUNT) : 0
  const discountedTotal = total - bundleDiscount
  const shipping = discountedTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
  const finalTotal = discountedTotal + shipping

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <ShoppingBag size={48} className="mx-auto text-ink-5 mb-4" />
        <h2 className="text-xl font-semibold text-ink-2 mb-2">장바구니가 비어있습니다</h2>
        <p className="text-ink-5 mb-8">마음에 드는 밀키트를 담아보세요!</p>
        <Link href="/products">
          <Button size="lg">밀키트 둘러보기</Button>
        </Link>
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

      <div className="grid lg:grid-cols-3 gap-8">
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
                    <span className="w-7 text-center text-sm font-medium text-ink">{item.quantity}</span>
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

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Gift, Heart, CheckCircle, ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { toast } from '@/lib/toast-store'
import { Suspense } from 'react'

type Product = {
  id: string
  name: string
  price: number
  image_url: string | null
  description: string | null
}

function GiftPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = searchParams.get('product')

  const [product, setProduct] = useState<Product | null>(null)
  const [recipientName, setRecipientName] = useState('')
  const [recipientPhone, setRecipientPhone] = useState('')
  const [recipientAddress, setRecipientAddress] = useState('')
  const [message, setMessage] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!productId) return
    const supabase = createClient()
    supabase
      .from('products')
      .select('id, name, price, image_url, description')
      .eq('id', productId)
      .single()
      .then(({ data }) => setProduct(data as Product))
  }, [productId])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!product) return
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'pending',
          payment_status: 'paid',
          total_price: product.price * quantity,
          payment_method: 'gift',
          gift_recipient_name: recipientName,
          gift_recipient_phone: recipientPhone,
          gift_recipient_address: recipientAddress,
          gift_message: message,
          is_gift: true,
        })
        .select('id')
        .single()

      if (error || !order) throw error

      await supabase.from('order_items').insert({
        order_id: order.id,
        product_id: product.id,
        quantity,
        price_at_purchase: product.price,
      })

      setDone(true)
    } catch {
      toast.error('선물 주문에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
          <Heart size={36} className="text-red-400" fill="currentColor" />
        </div>
        <h2 className="text-2xl font-bold text-ink mb-2">선물이 전달됐어요! 🎁</h2>
        <p className="text-ink-4 mb-8">
          <span className="font-medium text-ink">{recipientName}</span>님께<br />
          마음을 담은 밀키트를 보냈습니다.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => router.push('/my/orders')}>주문 내역 보기</Button>
          <Button variant="secondary" onClick={() => router.push('/products')}>계속 쇼핑하기</Button>
        </div>
      </div>
    )
  }

  if (!productId) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Link href="/products" className="flex items-center gap-1 text-sm text-ink-4 hover:text-ink-2 mb-6">
          <ChevronLeft size={16} /> 밀키트로 돌아가기
        </Link>
        <div className="text-center py-16">
          <Gift size={48} className="mx-auto text-ink-5 mb-4" />
          <p className="text-ink-4">선물할 상품을 선택해주세요.</p>
          <Link href="/products" className="mt-4 inline-block text-sm text-[#2d7a4f] hover:underline">
            밀키트 둘러보기 →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href={`/products/${productId}`} className="flex items-center gap-1 text-sm text-ink-4 hover:text-ink-2 mb-6">
        <ChevronLeft size={16} /> 상품으로 돌아가기
      </Link>

      <div className="flex items-center gap-2 mb-8">
        <Gift size={22} className="text-red-400" />
        <h1 className="text-2xl font-bold text-ink">선물하기</h1>
      </div>

      {product && (
        <div className="bg-surface rounded-2xl border border-[#2d7a4f]/20 p-4 mb-6 flex items-center gap-4">
          {product.image_url && (
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-wash shrink-0">
              <Image src={product.image_url} alt={product.name} width={64} height={64} className="object-cover w-full h-full" />
            </div>
          )}
          <div className="flex-1">
            <p className="font-semibold text-ink">{product.name}</p>
            <p className="text-sm text-[#2d7a4f] font-bold">{formatPrice(product.price)}</p>
          </div>
          <div className="flex items-center gap-2 border border-line-2 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="w-8 h-8 flex items-center justify-center hover:bg-wash text-ink text-lg"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-medium text-ink">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              className="w-8 h-8 flex items-center justify-center hover:bg-wash text-ink text-lg"
            >
              +
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 받는 분 정보 */}
        <div className="bg-surface rounded-2xl border border-line p-5">
          <h2 className="font-semibold text-ink mb-4">받는 분 정보</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-ink-3 mb-1">이름 *</label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="받는 분 이름"
                required
                className="w-full px-3 py-2.5 border border-line-2 rounded-lg text-sm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f]"
              />
            </div>
            <div>
              <label className="block text-sm text-ink-3 mb-1">연락처 *</label>
              <input
                type="tel"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                placeholder="010-0000-0000"
                required
                className="w-full px-3 py-2.5 border border-line-2 rounded-lg text-sm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f]"
              />
            </div>
            <div>
              <label className="block text-sm text-ink-3 mb-1">배송지 *</label>
              <input
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="도로명 주소를 입력하세요"
                required
                className="w-full px-3 py-2.5 border border-line-2 rounded-lg text-sm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f]"
              />
            </div>
          </div>
        </div>

        {/* 메시지 */}
        <div className="bg-surface rounded-2xl border border-line p-5">
          <h2 className="font-semibold text-ink mb-4">선물 메시지</h2>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="마음을 담은 한 마디를 적어보세요 (선택)"
            rows={3}
            maxLength={200}
            className="w-full px-3 py-2.5 border border-line-2 rounded-lg text-sm bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-[#2d7a4f] resize-none"
          />
          <p className="text-xs text-ink-5 text-right mt-1">{message.length}/200</p>
        </div>

        {/* 결제 요약 */}
        {product && (
          <div className="bg-green-tint rounded-2xl p-4 flex justify-between items-center">
            <span className="text-sm font-medium text-ink">총 결제 금액</span>
            <span className="text-lg font-bold text-[#2d7a4f]">{formatPrice(product.price * quantity)}</span>
          </div>
        )}

        <Button type="submit" size="lg" className="w-full" loading={loading}>
          <Gift size={16} className="mr-1.5" />
          선물 보내기
        </Button>
      </form>
    </div>
  )
}

export default function GiftPage() {
  return (
    <Suspense>
      <GiftPageInner />
    </Suspense>
  )
}

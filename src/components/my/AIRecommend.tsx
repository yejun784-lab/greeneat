import Link from 'next/link'
import Image from 'next/image'
import { Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'

export async function AIRecommend() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('id, name, price, image_url')
    .eq('is_active', true)
    .order('display_group', { ascending: true })
    .limit(3)

  if (!products || products.length === 0) return null

  return (
    <div className="bg-surface rounded-2xl border border-line p-5">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles size={16} className="text-[#2d7a4f]" />
        <h2 className="font-semibold text-ink">AI 맞춤 추천</h2>
      </div>
      <p className="text-xs text-ink-5 mb-4">최근 주문 패턴 기반 추천</p>
      <div className="space-y-2">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.id}`}
            className="flex items-center gap-3 p-2 rounded-xl hover:bg-wash transition-colors group"
          >
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-tint shrink-0">
              {p.image_url ? (
                <Image
                  src={p.image_url.startsWith('http') ? p.image_url : `https://nbdpckerbphyfnjzqiqp.supabase.co/storage/v1/object/public/product-images/greeneat/${p.image_url}`}
                  alt={p.name}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-green-tint" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-ink truncate group-hover:text-[#2d7a4f] transition-colors">
                {p.name}
              </p>
              <p className="text-xs text-ink-5">{formatPrice(p.price)}</p>
            </div>
            <span className="text-xs text-[#2d7a4f] opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              보기 →
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}

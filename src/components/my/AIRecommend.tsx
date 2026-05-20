import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'

export async function AIRecommend() {
  const supabase = await createClient()
  const { data: products } = await supabase
    .from('products')
    .select('id, name, price, image_url')
    .gt('stock', 0)
    .order('created_at', { ascending: false })
    .limit(3)

  if (!products?.length) return null

  return (
    <div className="bg-surface rounded-2xl border border-line p-5">
      <p className="text-sm font-semibold text-ink mb-1">오늘의 추천 도시락</p>
      <p className="text-xs text-ink-4 mb-4">건강 목표에 맞는 메뉴를 골랐어요 ✨</p>
      <div className="grid grid-cols-3 gap-2">
        {products.map((p) => (
          <Link key={p.id} href={`/products/${p.id}`} className="group">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-tint mb-1.5">
              {p.image_url && (
                <Image
                  src={p.image_url}
                  alt={p.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="100px"
                />
              )}
            </div>
            <p className="text-xs text-ink truncate">{p.name}</p>
            <p className="text-xs text-[#2d7a4f] font-semibold">{formatPrice(p.price)}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
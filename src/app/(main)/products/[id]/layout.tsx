import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'

type Props = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('name, description, price, image_url')
    .eq('id', id)
    .maybeSingle()

  if (!data) {
    return { title: '상품 — GreenEat' }
  }

  return {
    title: `${data.name} — GreenEat`,
    description: data.description ?? `${data.name} 밀키트. 신선한 재료로 만드는 건강한 한 끼.`,
    openGraph: {
      title: `${data.name} — GreenEat`,
      description: data.description ?? `${data.name} 밀키트`,
      images: data.image_url ? [{ url: data.image_url }] : [],
      type: 'website',
    },
  }
}

export default function ProductDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

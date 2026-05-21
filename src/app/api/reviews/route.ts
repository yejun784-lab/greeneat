import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// 리뷰 목록 조회
export async function GET(req: NextRequest) {
  const supabase = await createClient()

  const { searchParams } = new URL(req.url)
  const productId = searchParams.get('productId')

  if (!productId) {
    return NextResponse.json({ error: 'productId가 필요합니다.' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('reviews')
    .select('id, rating, content, created_at, profiles(name)')
    .eq('product_id', productId)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ reviews: data })
}

// 리뷰 작성
export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  const { product_id, rating, content } = await req.json() as {
    product_id: string
    rating: number
    content: string
  }

  if (!product_id || !rating || !content) {
    return NextResponse.json({ error: '필수 파라미터 누락' }, { status: 400 })
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: '평점은 1~5 사이여야 합니다.' }, { status: 400 })
  }

  // 중복 리뷰 방지
  const { data: existing } = await supabase
    .from('reviews')
    .select('id')
    .eq('user_id', user.id)
    .eq('product_id', product_id)
    .single()

  if (existing) {
    return NextResponse.json({ error: '이미 리뷰를 작성하셨습니다.' }, { status: 409 })
  }

  const { data, error } = await supabase
    .from('reviews')
    .insert({ user_id: user.id, product_id, rating, content })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ review: data })
}

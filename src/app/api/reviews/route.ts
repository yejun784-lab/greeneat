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

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: '평점은 1~5 사이 정수여야 합니다.' }, { status: 400 })
  }

  if (content && content.length > 500) {
    return NextResponse.json({ error: '리뷰는 500자 이내로 작성해주세요.' }, { status: 400 })
  }

  // 구매 이력 확인 (해당 product_id를 실제로 구매한 경우만)
  const { data: paidOrders } = await supabase
    .from('orders')
    .select('id')
    .eq('user_id', user.id)
    .eq('payment_status', 'paid')
  const paidOrderIds = (paidOrders ?? []).map((o) => o.id)
  if (paidOrderIds.length === 0) {
    return NextResponse.json({ error: '구매한 상품에만 리뷰를 작성할 수 있습니다.' }, { status: 403 })
  }
  const { count: purchaseCount } = await supabase
    .from('order_items')
    .select('id', { count: 'exact', head: true })
    .eq('product_id', product_id)
    .in('order_id', paidOrderIds)
  if ((purchaseCount ?? 0) === 0) {
    return NextResponse.json({ error: '구매한 상품에만 리뷰를 작성할 수 있습니다.' }, { status: 403 })
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

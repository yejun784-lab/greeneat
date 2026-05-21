import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// 재입고 알림 신청 여부 조회
export async function GET(req: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const productId = searchParams.get('productId')

  if (!productId) {
    return NextResponse.json({ error: 'productId가 필요합니다.' }, { status: 400 })
  }

  const { data } = await supabase
    .from('restock_alerts')
    .select('user_id')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .single()

  return NextResponse.json({ subscribed: !!data })
}

// 재입고 알림 신청
export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  const { product_id } = await req.json() as { product_id: string }

  if (!product_id) {
    return NextResponse.json({ error: 'product_id가 필요합니다.' }, { status: 400 })
  }

  // 이미 신청된 경우 무시
  const { data: existing } = await supabase
    .from('restock_alerts')
    .select('user_id')
    .eq('user_id', user.id)
    .eq('product_id', product_id)
    .single()

  if (existing) {
    return NextResponse.json({ ok: true })
  }

  const { error } = await supabase
    .from('restock_alerts')
    .insert({ user_id: user.id, product_id })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

// 재입고 알림 해제
export async function DELETE(req: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const productId = searchParams.get('productId')

  if (!productId) {
    return NextResponse.json({ error: 'productId가 필요합니다.' }, { status: 400 })
  }

  const { error } = await supabase
    .from('restock_alerts')
    .delete()
    .eq('user_id', user.id)
    .eq('product_id', productId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

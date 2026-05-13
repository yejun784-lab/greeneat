import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const client = new Anthropic()

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [{ data: profile }, { data: products }, { data: orders }] = await Promise.all([
    supabase.from('profiles').select('name, nutrition_goal').eq('id', user.id).maybeSingle(),
    supabase.from('products').select('id, name, calories, protein, carbs, fat, price, product_categories(name)'),
    supabase.from('orders').select('order_items(products(name))').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
  ])

  const goal: string = profile?.nutrition_goal ?? 'balanced'
  const goalLabels: Record<string, string> = { diet: '다이어트 (저칼로리)', balanced: '균형 잡힌 식단', muscle: '근육 증가 (고단백)' }
  const goalLabel = goalLabels[goal] ?? '균형 식단'

  const recentNames = (orders ?? [])
    .flatMap((o) => {
      const items = o.order_items as unknown as { products: { name: string } | null }[] | null
      return (items ?? []).map((i) => i.products?.name).filter(Boolean)
    })
    .join(', ') || '없음'

  const productList = (products ?? [])
    .map((p) => {
      const cat = Array.isArray(p.product_categories)
        ? (p.product_categories[0] as { name: string } | undefined)?.name
        : (p.product_categories as { name: string } | null)?.name
      return `- ${p.name} (칼로리: ${p.calories ?? '?'}kcal, 단백질: ${p.protein ?? '?'}g, 카테고리: ${cat ?? '기타'})`
    })
    .join('\n')

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `당신은 건강한 식단 전문가입니다. 사용자에게 GreenEat 밀키트 3가지를 추천해주세요.

사용자 정보:
- 식단 목표: ${goalLabel}
- 최근 주문: ${recentNames}

전체 밀키트 메뉴:
${productList}

조건:
1. 식단 목표에 맞는 메뉴를 우선 추천
2. 최근 주문과 겹치지 않게 추천
3. 반드시 JSON 형식으로만 응답: [{"name":"상품명","reason":"추천 이유 한 줄"}] 형태로 3개`,
      },
    ],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : '[]'
  let recommendations: { name: string; reason: string }[] = []
  try {
    const match = text.match(/\[[\s\S]*\]/)
    recommendations = match ? JSON.parse(match[0]) : []
  } catch {
    recommendations = []
  }

  const enriched = recommendations
    .map((rec) => {
      const product = (products ?? []).find((p) => p.name === rec.name)
      return product ? { ...rec, id: product.id, price: product.price } : null
    })
    .filter(Boolean)

  return NextResponse.json({ recommendations: enriched })
}

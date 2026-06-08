import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export type FoodSearchItem = {
  id: string
  name: string
  calories: number | null
  protein: number | null
  carbs: number | null
  fat: number | null
  servingSize: string | null
  source: 'greeneat' | 'foodsafety'
  imageUrl?: string | null
}

/**
 * GET /api/food-search?q=김치찌개
 * 1) GreenEat 상품 DB (Supabase)
 * 2) 공공데이터포털 — 식품안전처 식품영양성분 DB
 */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? ''
  if (q.length < 1) return NextResponse.json([])

  const results: FoodSearchItem[] = []

  /* ── 1. GreenEat 상품 검색 ─────────────────────────── */
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('products')
      .select('id, name, calories, protein, carbs, fat, image_url')
      .ilike('name', `%${q}%`)
      .eq('is_active', true)
      .limit(4)

    for (const p of data ?? []) {
      results.push({
        id: `g-${p.id}`,
        name: p.name,
        calories: p.calories ?? null,
        protein: p.protein ?? null,
        carbs: p.carbs ?? null,
        fat: p.fat ?? null,
        servingSize: null,
        source: 'greeneat',
        imageUrl: p.image_url ?? null,
      })
    }
  } catch { /* Supabase 실패 시 무시 */ }

  /* ── 2. 식품안전처 식품영양성분 DB ─────────────────── */
  const apiKey = process.env.FOOD_SAFETY_API_KEY
  if (apiKey) {
    try {
      const url =
        `https://apis.data.go.kr/1471000/FoodNtrIrdntInfoService1/getFoodNtrItdntList1` +
        `?serviceKey=${apiKey}&pageNo=1&numOfRows=6&type=json` +
        `&FOOD_NM_KR=${encodeURIComponent(q)}`

      const res = await fetch(url, { next: { revalidate: 3600 } })
      if (res.ok) {
        const json = await res.json()
        // API 응답 구조: { body: { items: [...] } } 또는 { body: { items: { item: [...] } } }
        const raw = json?.body?.items
        const items: any[] = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.item)
          ? raw.item
          : []

        for (const it of items) {
          const name = it.FOOD_NM_KR ?? it.foodNmKr ?? ''
          if (!name) continue
          results.push({
            id: `fs-${it.FOOD_CD ?? it.foodCd ?? Math.random()}`,
            name,
            calories: toNum(it.AMT_NUM1 ?? it.kcal ?? it.amtNum1),
            protein:  toNum(it.AMT_NUM3 ?? it.protein ?? it.amtNum3),
            carbs:    toNum(it.AMT_NUM5 ?? it.carbohydrate ?? it.amtNum5),
            fat:      toNum(it.AMT_NUM4 ?? it.fat ?? it.amtNum4),
            servingSize: it.SERVING_SIZE
              ? `${it.SERVING_SIZE}${it.SERVING_UNIT ?? 'g'}`
              : it.servingSize ?? null,
            source: 'foodsafety',
          })
        }
      }
    } catch { /* API 실패 시 무시 */ }
  }

  return NextResponse.json(results.slice(0, 6))
}

function toNum(v: unknown): number | null {
  const n = parseFloat(String(v ?? ''))
  return isNaN(n) ? null : n
}

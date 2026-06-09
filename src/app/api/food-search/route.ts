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
  source: 'greeneat' | 'foodsafety' | 'openfoodfacts'
  imageUrl?: string | null
}

/**
 * GET /api/food-search?q=김치찌개
 * 1) GreenEat 상품 DB (Supabase)
 * 2) 공공데이터포털 — 식품안전처 식품영양성분 DB (FOOD_SAFETY_API_KEY 필요)
 * 3) Open Food Facts — 글로벌 오픈 식품 DB (키 불필요, fallback)
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

  /* ── 3. Open Food Facts (키 불필요, fallback) ──────── */
  if (results.length < 6) {
    try {
      const offUrl =
        `https://world.openfoodfacts.org/api/v2/search` +
        `?search_terms=${encodeURIComponent(q)}` +
        `&fields=product_name,nutriments,serving_size` +
        `&page_size=${6 - results.length}` +
        `&countries_tags=en%3Asouth-korea`

      const offRes = await fetch(offUrl, {
        next: { revalidate: 3600 },
        headers: { 'User-Agent': 'GreenEat/1.0 (contact@greeneat.kr)' },
      })
      if (offRes.ok) {
        const offJson = await offRes.json()
        const products: any[] = offJson?.products ?? []

        for (const p of products) {
          const name = p.product_name?.trim()
          if (!name) continue
          const n = p.nutriments ?? {}
          results.push({
            id: `off-${encodeURIComponent(name).slice(0, 24)}-${Math.random().toString(36).slice(2, 6)}`,
            name,
            calories: toNum(n['energy-kcal_100g'] ?? n['energy-kcal']),
            protein:  toNum(n['proteins_100g']    ?? n['proteins']),
            carbs:    toNum(n['carbohydrates_100g'] ?? n['carbohydrates']),
            fat:      toNum(n['fat_100g']          ?? n['fat']),
            servingSize: p.serving_size ?? '100g당',
            source: 'openfoodfacts',
          })
        }
      }
    } catch { /* OFF 실패 시 무시 */ }
  }

  return NextResponse.json(results.slice(0, 6))
}

function toNum(v: unknown): number | null {
  const n = parseFloat(String(v ?? ''))
  return isNaN(n) ? null : n
}

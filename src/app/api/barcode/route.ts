import { NextRequest, NextResponse } from 'next/server'

export type BarcodeResult = {
  name: string
  calories: number | null
  protein: number | null
  carbs: number | null
  fat: number | null
  servingSize: string | null
  imageUrl: string | null
  source: 'openfoodfacts' | 'foodsafety' | null
}

/**
 * GET /api/barcode?code=8801234567890
 * Open Food Facts로 바코드 조회 (글로벌 + 일부 국내)
 * 국내 전용: 식품안전처 B553748 바코드API 신청 후 fetchFoodSafetyByName 연동 예정
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  if (!code || !/^\d{8,14}$/.test(code)) {
    return NextResponse.json({ error: 'Invalid barcode' }, { status: 400 })
  }

  const off = await fetchOpenFoodFacts(code)
  if (off) return NextResponse.json(off)

  return NextResponse.json({ error: 'Product not found' }, { status: 404 })
}

// ── Open Food Facts ────────────────────────────────────────────────────────────
async function fetchOpenFoodFacts(code: string): Promise<BarcodeResult | null> {
  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${code}.json?fields=product_name,product_name_ko,nutriments,serving_size,image_front_url`,
      {
        headers: { 'User-Agent': 'GreenEat/1.0 (greeneat.vercel.app)' },
        next: { revalidate: 86400 },
      }
    )
    if (!res.ok) return null
    const data = await res.json()
    if (data.status !== 1 || !data.product) return null

    const p = data.product
    const n = p.nutriments ?? {}
    const name = p.product_name_ko || p.product_name || ''
    if (!name) return null   // 이름 없으면 다음 소스로

    return {
      name,
      calories: toNum(n['energy-kcal_100g'] ?? n['energy-kcal_serving']),
      protein:  toNum(n['proteins_100g']),
      carbs:    toNum(n['carbohydrates_100g']),
      fat:      toNum(n['fat_100g']),
      servingSize: p.serving_size ?? null,
      imageUrl: p.image_front_url ?? null,
      source: 'openfoodfacts',
    }
  } catch {
    return null
  }
}

// 식품안전처 API는 lib/food-safety.ts 참고

function toNum(v: unknown): number | null {
  const n = parseFloat(String(v ?? ''))
  return isNaN(n) ? null : n
}

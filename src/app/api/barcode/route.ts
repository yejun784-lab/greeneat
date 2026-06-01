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

// ── 식품안전처 식품영양성분 DB (상품명 검색용) ────────────────────────────────
// 바코드→상품명 변환 API(B553748)는 별도 신청 필요 → 현재 미지원
// 향후 B553748 신청 후 productName 파라미터 활성화 가능
export async function fetchFoodSafetyByName(productName: string): Promise<BarcodeResult | null> {
  const apiKey = process.env.FOOD_SAFETY_API_KEY
  if (!apiKey || !productName.trim()) return null

  try {
    const nutriRes = await fetch(
      `https://apis.data.go.kr/1471000/FoodNtrCpntDbInfo02/getFoodNtrCpntDbInq02` +
      `?serviceKey=${apiKey}&pageNo=1&numOfRows=1&type=json` +
      `&FOOD_NM_KR=${encodeURIComponent(productName)}`,
      { next: { revalidate: 86400 } }
    )

    if (!nutriRes.ok) return null
    const nd = await nutriRes.json()
    const item = nd?.body?.items?.[0]
    if (!item) return null

    return {
      name:       item.FOOD_NM_KR ?? productName ?? '',
      calories:   toNum(item.AMT_NUM1),   // 에너지(kcal)
      protein:    toNum(item.AMT_NUM3),   // 단백질(g)
      fat:        toNum(item.AMT_NUM4),   // 지방(g)
      carbs:      toNum(item.AMT_NUM6),   // 탄수화물(g)
      servingSize: item.SERVING_SIZE ?? null,
      imageUrl:   null,
      source:     'foodsafety',
    }
  } catch {
    return null
  }
}

function toNum(v: unknown): number | null {
  const n = parseFloat(String(v ?? ''))
  return isNaN(n) ? null : n
}

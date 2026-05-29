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
 * 1순위: Open Food Facts (글로벌, 무료)
 * 2순위: 식품안전처 식품영양성분 DB (국내 제품)
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  if (!code || !/^\d{8,14}$/.test(code)) {
    return NextResponse.json({ error: 'Invalid barcode' }, { status: 400 })
  }

  // 1순위: Open Food Facts
  const off = await fetchOpenFoodFacts(code)
  if (off) return NextResponse.json(off)

  // 2순위: 식품안전처
  const kfood = await fetchFoodSafety(code)
  if (kfood) return NextResponse.json(kfood)

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

// ── 식품안전처 식품영양성분 DB ─────────────────────────────────────────────────
async function fetchFoodSafety(barcode: string): Promise<BarcodeResult | null> {
  const apiKey = process.env.FOOD_SAFETY_API_KEY
  if (!apiKey) return null

  try {
    // 바코드로 상품명 조회 (식품 바코드 통합 API)
    const barcodeRes = await fetch(
      `https://apis.data.go.kr/B553748/CertImgListServiceV3/getCertImgListServiceV3` +
      `?serviceKey=${apiKey}&pageNo=1&numOfRows=1&type=json&BRCD_NO=${barcode}`,
      { next: { revalidate: 86400 } }
    )

    let productName = ''
    if (barcodeRes.ok) {
      const bd = await barcodeRes.json()
      const item = bd?.body?.items?.[0]
      productName = item?.PRDLST_NM ?? ''
    }

    // 상품명으로 영양성분 조회
    const searchName = productName || barcode
    const nutriRes = await fetch(
      `https://apis.data.go.kr/1471000/FoodNtrCpntDbInfo01/getFoodNtrCpntDbInq01` +
      `?serviceKey=${apiKey}&pageNo=1&numOfRows=3&type=json` +
      `&FOOD_NM_KR=${encodeURIComponent(searchName)}`,
      { next: { revalidate: 86400 } }
    )

    if (!nutriRes.ok) return null
    const nd = await nutriRes.json()
    const item = nd?.body?.items?.[0]
    if (!item) return null

    return {
      name: item.FOOD_NM_KR ?? productName ?? '',
      calories: toNum(item.ENERC_KCAL),
      protein:  toNum(item.PROT),
      carbs:    toNum(item.CHOCDF),
      fat:      toNum(item.FAT),
      servingSize: item.SERVING_WT ? `${item.SERVING_WT}g` : null,
      imageUrl: null,
      source: 'foodsafety',
    }
  } catch {
    return null
  }
}

function toNum(v: unknown): number | null {
  const n = parseFloat(String(v ?? ''))
  return isNaN(n) ? null : n
}

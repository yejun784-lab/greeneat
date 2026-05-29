import { NextRequest, NextResponse } from 'next/server'

export type BarcodeResult = {
  name: string
  calories: number | null
  protein: number | null
  carbs: number | null
  fat: number | null
  servingSize: string | null
  imageUrl: string | null
}

/**
 * GET /api/barcode?code=8801234567890
 * Open Food Facts API로 바코드 영양소 조회
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')
  if (!code || !/^\d{8,14}$/.test(code)) {
    return NextResponse.json({ error: 'Invalid barcode' }, { status: 400 })
  }

  try {
    const res = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${code}.json?fields=product_name,product_name_ko,nutriments,serving_size,image_front_url`,
      { headers: { 'User-Agent': 'GreenEat/1.0 (greeneat.vercel.app)' }, next: { revalidate: 86400 } }
    )

    if (!res.ok) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const data = await res.json()

    if (data.status !== 1 || !data.product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const p = data.product
    const n = p.nutriments ?? {}

    const result: BarcodeResult = {
      name: p.product_name_ko || p.product_name || '',
      calories: n['energy-kcal_100g'] ?? n['energy-kcal_serving'] ?? null,
      protein: n['proteins_100g'] ?? null,
      carbs: n['carbohydrates_100g'] ?? null,
      fat: n['fat_100g'] ?? null,
      servingSize: p.serving_size ?? null,
      imageUrl: p.image_front_url ?? null,
    }

    return NextResponse.json(result)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

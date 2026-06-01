/**
 * 식품안전처 식품영양성분 DB (상품명 검색용)
 * 바코드→상품명 변환 API(B553748)는 별도 신청 필요 → 현재 미지원
 */

export type FoodNutrition = {
  name: string
  calories: number | null
  protein: number | null
  carbs: number | null
  fat: number | null
  servingSize: string | null
}

function toNum(v: unknown): number | null {
  const n = parseFloat(String(v ?? ''))
  return isNaN(n) ? null : n
}

export async function fetchFoodSafetyByName(productName: string): Promise<FoodNutrition | null> {
  const apiKey = process.env.FOOD_SAFETY_API_KEY
  if (!apiKey || !productName.trim()) return null

  try {
    const res = await fetch(
      `https://apis.data.go.kr/1471000/FoodNtrCpntDbInfo02/getFoodNtrCpntDbInq02` +
      `?serviceKey=${apiKey}&pageNo=1&numOfRows=1&type=json` +
      `&FOOD_NM_KR=${encodeURIComponent(productName)}`,
      { next: { revalidate: 86400 } }
    )
    if (!res.ok) return null
    const data = await res.json()
    const item = data?.body?.items?.[0]
    if (!item) return null

    return {
      name:        item.FOOD_NM_KR ?? productName,
      calories:    toNum(item.AMT_NUM1),  // 에너지(kcal)
      protein:     toNum(item.AMT_NUM3),  // 단백질(g)
      fat:         toNum(item.AMT_NUM4),  // 지방(g)
      carbs:       toNum(item.AMT_NUM6),  // 탄수화물(g)
      servingSize: item.SERVING_SIZE ?? null,
    }
  } catch {
    return null
  }
}

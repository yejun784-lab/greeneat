import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { BUILTIN_FOODS } from '@/lib/food-db'

export type FoodSearchItem = {
  id: string
  name: string
  calories: number | null
  protein: number | null
  carbs: number | null
  fat: number | null
  servingSize: string | null
  source: 'greeneat' | 'foodsafety' | 'openfoodfacts' | 'ai'
  imageUrl?: string | null
}

/**
 * 프로세스 수명 동안 유지되는 메모리 캐시 (24h TTL)
 * unstable_cache 대신 사용 — Next.js 버전 호환성 이슈 회피
 */
const aiCache = new Map<string, { result: FoodSearchItem | null; ts: number }>()
const AI_CACHE_TTL = 86_400_000 // 24h ms

async function estimateFoodWithAI(name: string): Promise<FoodSearchItem | null> {
  const cached = aiCache.get(name)
  if (cached && Date.now() - cached.ts < AI_CACHE_TTL) return cached.result

  const apiKey = process.env.GREENEAT_ANTHROPIC_KEY
  if (!apiKey) return null
  try {
    const client = new Anthropic({ apiKey })
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 120,
      messages: [{
        role: 'user',
        content: `음식 "${name}" 1인분 기준 영양소를 JSON 하나로만 답해주세요 (다른 텍스트 없이). 음식이 아닌 경우 null만 답하세요.\n{"calories":숫자,"protein":숫자,"carbs":숫자,"fat":숫자,"servingSize":"설명"}`,
      }],
    })
    const text = msg.content[0]?.type === 'text' ? msg.content[0].text.trim() : ''
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) { aiCache.set(name, { result: null, ts: Date.now() }); return null }
    const p = JSON.parse(match[0])
    const result: FoodSearchItem = {
      id: `ai-${encodeURIComponent(name).slice(0, 24)}`,
      name,
      calories: typeof p.calories === 'number' ? p.calories : null,
      protein:  typeof p.protein  === 'number' ? p.protein  : null,
      carbs:    typeof p.carbs    === 'number' ? p.carbs    : null,
      fat:      typeof p.fat      === 'number' ? p.fat      : null,
      servingSize: typeof p.servingSize === 'string' ? p.servingSize : '1인분',
      source: 'ai',
    }
    aiCache.set(name, { result, ts: Date.now() })
    return result
  } catch { return null }
}

/**
 * GET /api/food-search?q=김치찌개
 * 1) GreenEat 상품 DB (Supabase)
 * 2) 내장 한국 식품 DB (food-db.ts, 637개, 키 불필요)
 * 3) 공공데이터포털 — 식품안전처 식품영양성분 DB (FOOD_SAFETY_API_KEY 필요)
 * 4) Open Food Facts — 글로벌 오픈 식품 DB (키 불필요, fallback)
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

  /* ── 2. 내장 한국 식품 DB (food-db.ts) ──────────────── */
  if (results.length < 6) {
    const needle = q.toLowerCase()
    const matched = BUILTIN_FOODS
      .filter(f => f.name.toLowerCase().includes(needle))
      .slice(0, 6 - results.length)

    for (const f of matched) {
      if (results.some(r => r.name === f.name)) continue
      results.push({
        id: f.id,
        name: f.name,
        calories: f.calories,
        protein: f.protein,
        carbs: f.carbs,
        fat: f.fat,
        servingSize: f.servingSize,
        source: 'foodsafety', // 식품안전처 DB 기반 대표값
      })
    }
  }

  /* ── 3. 식품안전처 식품영양성분 DB ─────────────────── */
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

  // 한국어 포함 쿼리 여부 — OFF는 한글 검색에 엉뚱한 외국 식품을 반환하므로 제외
  const isKoreanQuery = /[가-힣]/.test(q)

  /* ── 4. Open Food Facts — 영문 쿼리에만 사용 ──────── */
  if (!isKoreanQuery && results.length < 6) {
    try {
      const offUrl =
        `https://world.openfoodfacts.org/api/v2/search` +
        `?search_terms=${encodeURIComponent(q)}` +
        `&fields=product_name,nutriments,serving_size` +
        `&page_size=${6 - results.length}`

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

  /* ── 5. Claude AI 영양소 추정 ──────────────────────────
   * 한국어 쿼리: food-db에 없는 음식이면 바로 AI로 추정
   * 영문 쿼리: OFF 포함 전 단계에서도 결과 없을 때만
   * ──────────────────────────────────────────────────── */
  if (results.length < 1) {
    const aiResult = await estimateFoodWithAI(q)
    if (aiResult) results.push(aiResult)
  }

  return NextResponse.json(results.slice(0, 6))
}

function toNum(v: unknown): number | null {
  const n = parseFloat(String(v ?? ''))
  return isNaN(n) ? null : n
}

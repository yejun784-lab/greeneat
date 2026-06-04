import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'
import { fetchFoodSafetyByName } from '@/lib/food-safety'

const anthropic = new Anthropic({ apiKey: process.env.GREENEAT_ANTHROPIC_KEY })

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const
  type AllowedMime = typeof ALLOWED_MIME[number]
  const MIME_TO_EXT: Record<AllowedMime, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
  }
  const VALID_MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack']

  const formData = await req.formData()
  const file = formData.get('image') as File | null
  const rawMealType = (formData.get('meal_type') as string) || 'snack'
  const mealType = VALID_MEAL_TYPES.includes(rawMealType) ? rawMealType : 'snack'
  const date = (formData.get('date') as string) || new Date().toISOString().split('T')[0]

  if (!file) return NextResponse.json({ error: 'No image provided' }, { status: 400 })

  // MIME 타입 검증
  if (!ALLOWED_MIME.includes(file.type as AllowedMime)) {
    return NextResponse.json({ error: '지원하지 않는 이미지 형식입니다. (jpg/png/webp/gif)' }, { status: 400 })
  }

  // 날짜 형식 검증
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: '날짜 형식이 올바르지 않습니다.' }, { status: 400 })
  }

  // 파일 크기 제한 5MB
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: '이미지 크기는 5MB 이하로 업로드해주세요.' }, { status: 400 })
  }

  // 이미지 → base64
  const arrayBuffer = await file.arrayBuffer()
  const base64 = Buffer.from(arrayBuffer).toString('base64')
  const mediaType = file.type as AllowedMime

  // ── 1단계: 음식 식별 + 양 추정 ──────────────────────────────
  const step1 = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 800,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
          {
            type: 'text',
            text: `이 사진에서 음식을 식별해 주세요. 음식이 없으면 NONE이라고만 답해주세요.

각 음식/반찬마다:
1. 정확한 이름 (한국어)
2. 국가별 분류 (한식/일식/중식/양식/기타)
3. 주재료 목록
4. 조리방법 (볶음/구이/찜/국/생/튀김/기타)
5. 양 추정:
   - 일반 접시/그릇 크기 기준으로 판단
   - 손바닥 크기 = 약 100g 참고
   - 밥 1공기 = 약 200g, 국 1그릇 = 약 300ml

JSON으로만 답해주세요:
{"items": [{"name":"음식명","cuisine":"한식","ingredients":["재료1","재료2"],"cooking":"조리법","amount_g":숫자,"amount_desc":"1공기","visible_ratio":0.8}]}

visible_ratio: 음식이 사진에서 얼마나 잘 보이는지 (0~1, 1=완전히 보임)`,
          },
        ],
      },
    ],
  })

  const step1Text = step1.content[0].type === 'text' ? step1.content[0].text : ''
  if (step1Text.trim() === 'NONE') {
    return NextResponse.json({ error: '음식 사진을 촬영해 주세요.' }, { status: 422 })
  }

  let identifiedItems: {
    name: string; cuisine: string; ingredients: string[]
    cooking: string; amount_g: number; amount_desc: string; visible_ratio: number
  }[] = []
  try {
    const m = step1Text.match(/\{[\s\S]*\}/)
    const parsed1 = m ? JSON.parse(m[0]) : {}
    identifiedItems = parsed1.items ?? []
  } catch { /* fallback to step2 */ }

  // ── 1.5단계: 식품안전처 공식 DB 조회 (한국 음식 한정) ──────────
  type DbResult = { name: string; dbCalPer100g: number | null; dbProtPer100g: number | null; dbCarbsPer100g: number | null; dbFatPer100g: number | null; found: boolean }
  const dbResults: DbResult[] = await Promise.all(
    identifiedItems.map(async (item) => {
      if (item.cuisine !== '한식') return { name: item.name, dbCalPer100g: null, dbProtPer100g: null, dbCarbsPer100g: null, dbFatPer100g: null, found: false }
      const db = await fetchFoodSafetyByName(item.name)
      if (!db || !db.calories) return { name: item.name, dbCalPer100g: null, dbProtPer100g: null, dbCarbsPer100g: null, dbFatPer100g: null, found: false }
      return { name: item.name, dbCalPer100g: db.calories, dbProtPer100g: db.protein, dbCarbsPer100g: db.carbs, dbFatPer100g: db.fat, found: true }
    })
  )

  // DB에서 찾은 음식은 공식 데이터로 계산 (100g 기준 × 추정 g)
  const dbDishes = identifiedItems
    .map((item, i) => {
      const db = dbResults[i]
      if (!db.found || !db.dbCalPer100g) return null
      const ratio = item.amount_g / 100
      return {
        name: item.name,
        amount: item.amount_desc,
        calories: Math.round((db.dbCalPer100g ?? 0) * ratio),
        protein:  Math.round((db.dbProtPer100g  ?? 0) * ratio),
        carbs:    Math.round((db.dbCarbsPer100g ?? 0) * ratio),
        fat:      Math.round((db.dbFatPer100g   ?? 0) * ratio),
        source: '식품안전처DB',
      }
    })
    .filter(Boolean)

  const notInDb = identifiedItems.filter((_, i) => !dbResults[i].found)
  const dbFoundNames = identifiedItems.filter((_, i) => dbResults[i].found).map(i => i.name)

  // ── 2단계: DB에 없는 음식만 Claude로 추정 ────────────────────
  const itemsContext = notInDb.length > 0
    ? `다음 음식들은 국내 DB에 없어 추정이 필요합니다:\n${notInDb.map(i =>
        `- ${i.name} (${i.cuisine}, ${i.cooking}): 주재료 [${i.ingredients.join(', ')}], 추정량 ${i.amount_desc}(${i.amount_g}g)`
      ).join('\n')}\n${dbFoundNames.length > 0 ? `\n참고: [${dbFoundNames.join(', ')}]는 공식 DB 데이터로 이미 계산됨 - 이것들은 제외하고` : ''}\n위 음식들만`
    : dbFoundNames.length > 0
      ? null  // 모두 DB에서 찾음 → 2단계 불필요
      : '사진을 보고'

  // 모두 DB에서 찾은 경우 2단계 생략
  let aiDishes: { name: string; amount: string; calories: number; protein: number; carbs: number; fat: number }[] = []
  let aiDescription = ''
  let aiConfidence: string | undefined
  let aiConfidenceReason: string | undefined

  if (itemsContext !== null) {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1200,
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
            {
              type: 'text',
              text: `당신은 공인 영양사입니다. ${itemsContext} 각 음식의 영양소를 계산해 주세요.

계산 기준:
- 양식/일식/중식: USDA FoodData Central 기준
- 한식 중 DB 미등록: 한국 식품성분표 7.1 추정값
- 조리 손실률 반영, 소스/양념 포함

JSON으로만 답해주세요:
{
  "dishes": [{"name":"음식명","amount":"추정량","calories":정수,"protein":정수,"carbs":정수,"fat":정수}],
  "description": "전체 식사 한줄 요약 (한국어)",
  "confidence": "high"|"medium"|"low",
  "confidence_reason": "신뢰도 이유 (한국어, 1문장)"
}
- 음식이 아닌 사진: {"error": "음식 사진을 촬영해 주세요"}`,
            },
          ],
        },
      ],
    })

    const rawText = message.content[0].type === 'text' ? message.content[0].text : ''
    try {
      const m = rawText.match(/\{[\s\S]*\}/)
      const p = m ? JSON.parse(m[0]) : {}
      if (p.error) return NextResponse.json({ error: p.error }, { status: 422 })
      aiDishes = p.dishes ?? []
      aiDescription = p.description ?? p.total?.description ?? ''
      aiConfidence = p.confidence
      aiConfidenceReason = p.confidence_reason
    } catch {
      return NextResponse.json({ error: 'AI 분석에 실패했어요. 다시 시도해주세요.' }, { status: 500 })
    }
  }

  // ── DB + AI 결과 합산 ───────────────────────────────────────
  const allDishes = [
    ...(dbDishes as { name: string; amount: string; calories: number; protein: number; carbs: number; fat: number }[]),
    ...aiDishes,
  ]
  const finalCalories = allDishes.reduce((s, d) => s + (d.calories ?? 0), 0) || null
  const finalProtein  = allDishes.reduce((s, d) => s + (d.protein  ?? 0), 0) || null
  const finalCarbs    = allDishes.reduce((s, d) => s + (d.carbs    ?? 0), 0) || null
  const finalFat      = allDishes.reduce((s, d) => s + (d.fat      ?? 0), 0) || null
  const finalDescription = aiDescription || (allDishes.length > 0 ? allDishes.map(d => d.name).join(', ') : '')
  const dbCount = dbDishes.length
  const finalConfidence = dbCount > 0 && notInDb.length === 0 ? 'high'
    : (aiConfidence ?? (dbCount > 0 ? 'medium' : 'low'))
  const finalConfidenceReason = dbCount > 0 && notInDb.length === 0
    ? `${dbCount}개 음식 모두 식품안전처 공식 데이터로 계산됐어요`
    : dbCount > 0
      ? `${dbCount}개는 공식 DB, ${notInDb.length}개는 AI 추정`
      : (aiConfidenceReason ?? '')

  // Supabase Storage에 이미지 업로드
  let imageUrl: string | null = null
  try {
    const ext = MIME_TO_EXT[file.type as AllowedMime] ?? 'jpg'
    const path = `meal-logs/${user.id}/${date}-${Date.now()}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('meal-images')
      .upload(path, file, { contentType: file.type, upsert: false })
    if (!uploadError) {
      const { data: urlData } = supabase.storage.from('meal-images').getPublicUrl(path)
      imageUrl = urlData.publicUrl
    }
  } catch {
    // 업로드 실패해도 로그는 저장
  }

  // meal_logs에 저장
  const { data: log, error: insertError } = await supabase
    .from('meal_logs')
    .insert({
      user_id: user.id,
      date,
      meal_type: mealType,
      description: finalDescription,
      image_url: imageUrl,
      calories: finalCalories,
      protein: finalProtein,
      carbs: finalCarbs,
      fat: finalFat,
      ai_raw: step1Text,
    })
    .select()
    .single()

  if (insertError) {
    return NextResponse.json({ error: '저장에 실패했어요.' }, { status: 500 })
  }

  return NextResponse.json({
    log,
    analysis: {
      description: finalDescription,
      calories: finalCalories,
      protein: finalProtein,
      carbs: finalCarbs,
      fat: finalFat,
      confidence: finalConfidence,
      confidence_reason: finalConfidenceReason,
      dishes: allDishes,
    },
  })
}

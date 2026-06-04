import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

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

  // ── 2단계: 식별된 음식 기반 정밀 영양 계산 ───────────────────
  const itemsContext = identifiedItems.length > 0
    ? `식별된 음식 목록:\n${identifiedItems.map(i =>
        `- ${i.name} (${i.cuisine}, ${i.cooking}): 주재료 [${i.ingredients.join(', ')}], 추정량 ${i.amount_desc}(${i.amount_g}g), 가시율 ${i.visible_ratio}`
      ).join('\n')}\n\n위 정보를 바탕으로`
    : '사진을 보고'

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
- 한국 식품성분표 7.1 (2021) 기준
- 양식/일식/중식은 USDA FoodData Central 기준
- 조리 손실률 반영 (가열 시 수분 손실 등)
- 소스/양념 포함한 실제 섭취 영양소

JSON으로만 답해주세요:
{
  "dishes": [
    {
      "name": "음식명 (한국어)",
      "amount": "추정량 표기",
      "calories": 정수,
      "protein": 정수,
      "carbs": 정수,
      "fat": 정수,
      "fiber": 정수,
      "sodium_mg": 정수
    }
  ],
  "total": {
    "description": "전체 식사 한줄 요약 (한국어, 예: 한식 백반 - 밥+된장찌개+반찬 3가지)",
    "calories": 정수,
    "protein": 정수,
    "carbs": 정수,
    "fat": 정수
  },
  "confidence": "high" | "medium" | "low",
  "confidence_reason": "신뢰도 이유 (한국어, 1문장)"
}

- 음식이 아닌 사진: {"error": "음식 사진을 촬영해 주세요"}
- high: 음식 명확+성분표 데이터 있음 / medium: 양 추정 불확실 / low: 가려지거나 불분명`,
          },
        ],
      },
    ],
  })

  const rawText = message.content[0].type === 'text' ? message.content[0].text : ''

  // JSON 파싱 (새 포맷 + 구 포맷 fallback)
  let parsed: {
    dishes?: { name: string; amount: string; calories: number; protein: number; carbs: number; fat: number }[]
    total?: { description: string; calories: number; protein: number; carbs: number; fat: number }
    description?: string
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
    confidence?: string
    confidence_reason?: string
    error?: string
  }
  try {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/)
    parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {}
  } catch {
    return NextResponse.json({ error: 'AI 분석에 실패했어요. 다시 시도해주세요.' }, { status: 500 })
  }

  if (parsed.error) {
    return NextResponse.json({ error: parsed.error }, { status: 422 })
  }

  // 새 포맷(total) 또는 구 포맷(calories) 통합
  const finalDescription = parsed.total?.description ?? parsed.description ?? ''
  const finalCalories = parsed.total?.calories ?? parsed.calories ?? null
  const finalProtein  = parsed.total?.protein  ?? parsed.protein  ?? null
  const finalCarbs    = parsed.total?.carbs    ?? parsed.carbs    ?? null
  const finalFat      = parsed.total?.fat      ?? parsed.fat      ?? null

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
      ai_raw: rawText,
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
      confidence: parsed.confidence,
      confidence_reason: parsed.confidence_reason,
      dishes: parsed.dishes ?? [],
    },
  })
}

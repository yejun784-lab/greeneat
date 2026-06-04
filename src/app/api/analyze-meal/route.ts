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

  // Claude vision으로 분석 (개선된 프롬프트)
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: mediaType, data: base64 },
          },
          {
            type: 'text',
            text: `당신은 한국 음식 전문 영양사입니다. 이 식사 사진을 정밀 분석해 주세요.

분석 지침:
1. 사진에 보이는 각 음식/반찬을 개별 식별하세요
2. 그릇 크기, 담긴 양, 재료 구성을 추정하세요 (일반 가정 기준)
3. 한국 음식 표준 레시피와 식품성분표를 기반으로 영양소를 계산하세요
4. 조리법(볶음/구이/찜/국)에 따른 칼로리 차이를 반영하세요

JSON 형식으로만 답해주세요 (다른 텍스트 없이):
{
  "dishes": [
    {
      "name": "음식명 (한국어)",
      "amount": "추정 양 (예: 1공기, 100g, 1접시)",
      "calories": 숫자,
      "protein": 숫자,
      "carbs": 숫자,
      "fat": 숫자
    }
  ],
  "total": {
    "description": "전체 식사 한줄 요약 (한국어)",
    "calories": 숫자,
    "protein": 숫자,
    "carbs": 숫자,
    "fat": 숫자
  },
  "confidence": "high" | "medium" | "low",
  "confidence_reason": "신뢰도 이유 (한국어, 1문장)"
}

- 음식이 아닌 사진이면: {"error": "음식 사진을 촬영해 주세요"}
- 숫자는 정수 (소수점 반올림)
- 신뢰도 기준: high=음식 명확+양 추정 가능 / medium=음식 식별되나 양 불확실 / low=흐릿하거나 가려짐`,
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

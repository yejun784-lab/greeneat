import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

const anthropic = new Anthropic({ apiKey: process.env.GREENEAT_ANTHROPIC_KEY })

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('image') as File | null
  const mealType = (formData.get('meal_type') as string) || 'snack'
  const date = (formData.get('date') as string) || new Date().toISOString().split('T')[0]

  if (!file) return NextResponse.json({ error: 'No image provided' }, { status: 400 })

  // 파일 크기 제한 5MB
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: '이미지 크기는 5MB 이하로 업로드해주세요.' }, { status: 400 })
  }

  // 이미지 → base64
  const arrayBuffer = await file.arrayBuffer()
  const base64 = Buffer.from(arrayBuffer).toString('base64')
  const mediaType = (file.type as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif') || 'image/jpeg'

  // Claude vision으로 분석
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 512,
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
            text: `이 음식 사진을 분석해서 영양 정보를 JSON으로만 답해줘. 다른 설명 없이 JSON만.

형식:
{
  "description": "음식 이름과 간단한 설명 (한국어, 1~2문장)",
  "calories": 숫자 (kcal),
  "protein": 숫자 (g),
  "carbs": 숫자 (g),
  "fat": 숫자 (g),
  "confidence": "high" | "medium" | "low"
}

- 음식이 여러 개면 합산해서 줘
- 음식이 아닌 사진이면 {"error": "음식 사진이 아닙니다"} 로만 답해줘
- 숫자는 반올림된 정수 또는 소수점 1자리까지`,
          },
        ],
      },
    ],
  })

  const rawText = message.content[0].type === 'text' ? message.content[0].text : ''

  // JSON 파싱
  let parsed: {
    description?: string
    calories?: number
    protein?: number
    carbs?: number
    fat?: number
    confidence?: string
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

  // Supabase Storage에 이미지 업로드
  let imageUrl: string | null = null
  try {
    const ext = file.name.split('.').pop() || 'jpg'
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
      description: parsed.description ?? '',
      image_url: imageUrl,
      calories: parsed.calories ?? null,
      protein: parsed.protein ?? null,
      carbs: parsed.carbs ?? null,
      fat: parsed.fat ?? null,
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
      description: parsed.description,
      calories: parsed.calories,
      protein: parsed.protein,
      carbs: parsed.carbs,
      fat: parsed.fat,
      confidence: parsed.confidence,
    },
  })
}

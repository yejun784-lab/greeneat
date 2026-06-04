// 건강관리 탭 공유 타입 & 상수

export type DayNutrition = {
  date: string
  cal: number
  protein: number
  carbs: number
  fat: number
}

export type GoalInfo = {
  calTarget: number
  proteinTarget: number
  carbsTarget: number
  fatTarget: number
}

export type MealLogRow = {
  date: string
  calories: number | null
  protein: number | null
  carbs: number | null
  fat: number | null
  meal_type: string
  description: string | null
  image_url: string | null
  created_at: string
}

// ── 기본 고정 목표 (체형 정보 없을 때 fallback) ──────────────────────
export const GOAL_INFO: Record<string, GoalInfo> = {
  diet:     { calTarget: 1500, proteinTarget: 80,  carbsTarget: 150, fatTarget: 40 },
  muscle:   { calTarget: 2500, proteinTarget: 150, carbsTarget: 280, fatTarget: 70 },
  maintain: { calTarget: 2000, proteinTarget: 100, carbsTarget: 220, fatTarget: 55 },
  health:   { calTarget: 1800, proteinTarget: 90,  carbsTarget: 200, fatTarget: 50 },
  balanced: { calTarget: 2000, proteinTarget: 100, carbsTarget: 220, fatTarget: 55 },
}

export const GOAL_LABEL: Record<string, { label: string; emoji: string }> = {
  diet:     { label: '다이어트',   emoji: '🥗' },
  muscle:   { label: '근육 증가',  emoji: '💪' },
  maintain: { label: '체중 유지',  emoji: '⚖️' },
  health:   { label: '건강 관리',  emoji: '🌿' },
  balanced: { label: '균형식',     emoji: '⚖️' },
}

// ── Mifflin-St Jeor 방정식 기반 개인 맞춤 목표 계산 ─────────────────
// activityLevel: 1.2(거의없음) 1.375(가볍게) 1.55(보통) 1.725(활발) 1.9(매우활발)
export function calcPersonalGoal(
  goal: string,
  weightKg: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female' | 'other',
  activityLevel = 1.55
): GoalInfo {
  // BMR 계산 (Mifflin-St Jeor)
  const genderOffset = gender === 'female' ? -161 : 5
  const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + genderOffset
  const tdee = Math.round(bmr * activityLevel)

  // 목표별 칼로리 조정
  const calMap: Record<string, number> = {
    diet:     Math.max(1200, tdee - 500),   // 주당 0.5kg 감량
    muscle:   tdee + 300,                    // 점진적 증량
    maintain: tdee,
    health:   Math.round(tdee * 0.95),
    balanced: tdee,
  }
  const calTarget = calMap[goal] ?? tdee

  // 단백질: 목표별 체중당 권장량 (ISSN 가이드라인)
  const proteinPerKg: Record<string, number> = {
    diet: 1.6, muscle: 2.0, maintain: 1.2, health: 1.3, balanced: 1.2,
  }
  const proteinTarget = Math.round(weightKg * (proteinPerKg[goal] ?? 1.2))

  // 지방: 총 칼로리의 27%
  const fatTarget = Math.round((calTarget * 0.27) / 9)

  // 탄수화물: 나머지 칼로리
  const carbCal = calTarget - proteinTarget * 4 - fatTarget * 9
  const carbsTarget = Math.max(50, Math.round(carbCal / 4))

  return { calTarget, proteinTarget, carbsTarget, fatTarget }
}

type ProfileForGoal = {
  weight_kg?: number | null
  height_cm?: number | null
  age?: number | null
  gender?: string | null
}

/** 프로필 있으면 맞춤 계산, 없으면 기본값 사용 */
export function getGoalInfo(goal: string, profile?: ProfileForGoal | null): GoalInfo {
  const w = profile?.weight_kg ? Number(profile.weight_kg) : null
  const h = profile?.height_cm ? Number(profile.height_cm) : null
  const a = profile?.age ? Number(profile.age) : null
  const g = profile?.gender as 'male' | 'female' | 'other' | null

  if (w && h && a && g) {
    return calcPersonalGoal(goal, w, h, a, g)
  }
  return GOAL_INFO[goal] ?? GOAL_INFO.balanced
}

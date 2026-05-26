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

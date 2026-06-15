-- 주간 식단 플래너 재저장 불가 수정
-- meal_plans 에 SELECT/INSERT/DELETE 정책만 있고 UPDATE 정책이 없음.
-- MealPlanner 는 .upsert({...}, { onConflict: 'user_id,week_start' }) 로 저장하는데,
-- 같은 주 식단을 두 번째로 저장하면 ON CONFLICT DO UPDATE 경로를 타고
-- UPDATE 정책이 없어 42501(RLS violation)로 실패 → "저장에 실패했습니다" 토스트.
CREATE POLICY "meal_plans_update" ON meal_plans FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

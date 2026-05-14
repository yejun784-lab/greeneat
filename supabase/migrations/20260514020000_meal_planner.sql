-- ── 식단 플랜 테이블 ─────────────────────────────────────────────
CREATE TABLE meal_plans (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  week_start date NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, week_start)
);

ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "meal_plans_select" ON meal_plans FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "meal_plans_insert" ON meal_plans FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "meal_plans_delete" ON meal_plans FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ── 식단 플랜 아이템 테이블 ──────────────────────────────────────
CREATE TABLE meal_plan_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id uuid REFERENCES meal_plans(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  day_of_week int NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=월 ~ 6=일
  meal_type text NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE meal_plan_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "meal_plan_items_select" ON meal_plan_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM meal_plans WHERE id = plan_id AND user_id = auth.uid()));
CREATE POLICY "meal_plan_items_insert" ON meal_plan_items FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM meal_plans WHERE id = plan_id AND user_id = auth.uid()));
CREATE POLICY "meal_plan_items_delete" ON meal_plan_items FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM meal_plans WHERE id = plan_id AND user_id = auth.uid()));

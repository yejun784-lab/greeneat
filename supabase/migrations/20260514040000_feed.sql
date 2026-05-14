-- ── 식단 피드 그룹 ────────────────────────────────────────────
CREATE TABLE feed_groups (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  invite_code text NOT NULL UNIQUE DEFAULT upper(substring(gen_random_uuid()::text, 1, 6)),
  created_by uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE feed_groups ENABLE ROW LEVEL SECURITY;
-- feed_group_members가 생성된 후 policy 추가
CREATE POLICY "feed_groups_insert" ON feed_groups FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

-- ── 그룹 멤버 ──────────────────────────────────────────────────
CREATE TABLE feed_group_members (
  group_id uuid REFERENCES feed_groups(id) ON DELETE CASCADE NOT NULL,
  user_id  uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  joined_at timestamptz DEFAULT now(),
  PRIMARY KEY (group_id, user_id)
);

ALTER TABLE feed_group_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "feed_members_select" ON feed_group_members FOR SELECT TO authenticated USING (
  user_id = auth.uid() OR
  EXISTS (SELECT 1 FROM feed_group_members m2 WHERE m2.group_id = feed_group_members.group_id AND m2.user_id = auth.uid())
);
CREATE POLICY "feed_members_insert" ON feed_group_members FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "feed_members_delete" ON feed_group_members FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ── 식사 기록 ──────────────────────────────────────────────────
CREATE TABLE meal_logs (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  group_id   uuid REFERENCES feed_groups(id) ON DELETE CASCADE NOT NULL,
  photo_url  text,
  caption    text,
  meal_type  text NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  streak_day int NOT NULL DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE meal_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "meal_logs_select" ON meal_logs FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM feed_group_members WHERE group_id = meal_logs.group_id AND user_id = auth.uid())
);
CREATE POLICY "meal_logs_insert" ON meal_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "meal_logs_delete" ON meal_logs FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ── 이모지 리액션 ──────────────────────────────────────────────
CREATE TABLE meal_reactions (
  log_id   uuid REFERENCES meal_logs(id) ON DELETE CASCADE NOT NULL,
  user_id  uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  emoji    text NOT NULL,
  PRIMARY KEY (log_id, user_id)
);

ALTER TABLE meal_reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "meal_reactions_select" ON meal_reactions FOR SELECT TO authenticated USING (true);
CREATE POLICY "meal_reactions_insert" ON meal_reactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "meal_reactions_delete" ON meal_reactions FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- feed_group_members 생성 후 feed_groups select policy 추가
CREATE POLICY "feed_groups_select" ON feed_groups FOR SELECT TO authenticated USING (
  auth.uid() = created_by OR
  EXISTS (SELECT 1 FROM feed_group_members WHERE group_id = feed_groups.id AND user_id = auth.uid())
);

-- ── 식사 기록 사진용 Storage 버킷 ─────────────────────────────
INSERT INTO storage.buckets (id, name, public) VALUES ('meal-photos', 'meal-photos', true)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "meal_photos_select" ON storage.objects FOR SELECT USING (bucket_id = 'meal-photos');
CREATE POLICY "meal_photos_insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'meal-photos');
CREATE POLICY "meal_photos_delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'meal-photos' AND auth.uid()::text = (storage.foldername(name))[1]);

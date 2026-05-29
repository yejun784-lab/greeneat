-- 밥로그 댓글 테이블
CREATE TABLE meal_log_comments (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  log_id     uuid REFERENCES meal_logs(id) ON DELETE CASCADE NOT NULL,
  user_id    uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content    text NOT NULL CHECK (char_length(content) BETWEEN 1 AND 200),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE meal_log_comments ENABLE ROW LEVEL SECURITY;

-- 같은 그룹 멤버라면 댓글 조회 가능
CREATE POLICY "meal_comments_select" ON meal_log_comments
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM meal_logs ml
      JOIN feed_group_members fgm ON fgm.group_id = ml.group_id
      WHERE ml.id = meal_log_comments.log_id AND fgm.user_id = auth.uid()
    )
  );

-- 본인만 댓글 작성
CREATE POLICY "meal_comments_insert" ON meal_log_comments
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- 본인 댓글만 삭제
CREATE POLICY "meal_comments_delete" ON meal_log_comments
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- 밥로그 그룹 삭제 정책
-- 방장(created_by)만 그룹 전체 삭제 가능.
-- feed_group_members / meal_logs 는 ON DELETE CASCADE 라 함께 정리됨.
-- (멤버 본인 나가기는 기존 feed_members_delete 정책으로 이미 가능)
CREATE POLICY "feed_groups_delete" ON feed_groups FOR DELETE TO authenticated USING (
  auth.uid() = created_by
);

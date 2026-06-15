-- 밥로그(피드) RLS 무한재귀(42P17) 수정
--
-- 문제: feed_members_select 정책이 feed_group_members 자신을 서브쿼리로 참조 →
-- feed_group_members 를 조회할 때마다 정책이 재귀 확장되어 PostgreSQL이
-- "infinite recursion detected in policy for relation feed_group_members" (42P17) 발생.
-- 그 결과 feed_group_members 직접 조회 + 이를 서브쿼리로 쓰는 feed_groups/meal_logs
-- SELECT 가 전부 실패 → 그룹 생성/조회/피드 로딩 불가.
--
-- 해결: SECURITY DEFINER 함수로 멤버십을 확인하면 함수 내부 조회가 RLS 를
-- 거치지 않으므로 재귀가 끊긴다.

CREATE OR REPLACE FUNCTION public.is_feed_group_member(gid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM feed_group_members
    WHERE group_id = gid AND user_id = auth.uid()
  )
$$;

GRANT EXECUTE ON FUNCTION public.is_feed_group_member(uuid) TO authenticated;

-- 1) feed_group_members: 자기참조 제거
DROP POLICY IF EXISTS "feed_members_select" ON feed_group_members;
CREATE POLICY "feed_members_select" ON feed_group_members FOR SELECT TO authenticated USING (
  user_id = auth.uid() OR public.is_feed_group_member(group_id)
);

-- 2) feed_groups: 서브쿼리 → 함수로 교체 (재귀 정책 경유 방지)
DROP POLICY IF EXISTS "feed_groups_select" ON feed_groups;
CREATE POLICY "feed_groups_select" ON feed_groups FOR SELECT TO authenticated USING (
  auth.uid() = created_by OR public.is_feed_group_member(id)
);

-- 3) meal_logs: 동일하게 함수로 교체
DROP POLICY IF EXISTS "meal_logs_select" ON meal_logs;
CREATE POLICY "meal_logs_select" ON meal_logs FOR SELECT TO authenticated USING (
  public.is_feed_group_member(group_id)
);

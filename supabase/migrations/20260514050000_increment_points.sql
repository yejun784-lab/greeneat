-- increment_points RPC: 포인트 적립 함수
-- 식단 피드 스트릭 리워드 등에서 사용
CREATE OR REPLACE FUNCTION increment_points(uid uuid, amount int)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE profiles
  SET point_balance = COALESCE(point_balance, 0) + amount
  WHERE id = uid;
END;
$$;

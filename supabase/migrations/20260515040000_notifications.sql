-- 알림 센터
CREATE TABLE IF NOT EXISTS notifications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type        text NOT NULL CHECK (type IN ('order','restock','event','system','subscription')),
  title       text NOT NULL,
  body        text NOT NULL,
  link        text,
  is_read     boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id, created_at DESC);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users can read own notifications"
  ON notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users can update own notifications"
  ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- 서비스 롤만 INSERT 가능 (service_role key로만 알림 생성)
CREATE POLICY "service role can insert notifications"
  ON notifications FOR INSERT WITH CHECK (true);

-- 인기 검색어 로그
CREATE TABLE IF NOT EXISTS search_logs (
  id         bigserial PRIMARY KEY,
  query      text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 인기 검색어 집계 뷰
CREATE OR REPLACE VIEW popular_searches AS
SELECT query, COUNT(*) AS cnt
FROM search_logs
WHERE created_at > now() - INTERVAL '7 days'
  AND length(query) >= 2
GROUP BY query
ORDER BY cnt DESC
LIMIT 8;

GRANT SELECT ON popular_searches TO anon, authenticated;
GRANT INSERT ON search_logs TO anon, authenticated;

-- 출석체크 (데일리 리워드)
CREATE TABLE IF NOT EXISTS attendance_logs (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date           date        NOT NULL DEFAULT CURRENT_DATE,
  points_awarded int         NOT NULL DEFAULT 50,
  created_at     timestamptz DEFAULT now(),
  UNIQUE(user_id, date)  -- 하루 1회만
);

CREATE INDEX IF NOT EXISTS idx_attendance_user_date ON attendance_logs(user_id, date DESC);

ALTER TABLE attendance_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "attendance_select_own" ON attendance_logs
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "attendance_insert_own" ON attendance_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

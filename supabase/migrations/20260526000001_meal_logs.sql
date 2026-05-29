-- meal_logs는 20260514040000_feed.sql에서 이미 생성됨
-- 헬스 트래커용 컬럼 추가 (IF NOT EXISTS로 중복 방지)
ALTER TABLE meal_logs ADD COLUMN IF NOT EXISTS date date DEFAULT CURRENT_DATE;
ALTER TABLE meal_logs ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE meal_logs ADD COLUMN IF NOT EXISTS image_url text;
ALTER TABLE meal_logs ADD COLUMN IF NOT EXISTS calories integer;
ALTER TABLE meal_logs ADD COLUMN IF NOT EXISTS protein numeric(6,1);
ALTER TABLE meal_logs ADD COLUMN IF NOT EXISTS carbs numeric(6,1);
ALTER TABLE meal_logs ADD COLUMN IF NOT EXISTS fat numeric(6,1);
ALTER TABLE meal_logs ADD COLUMN IF NOT EXISTS ai_raw text;

-- index for daily queries
CREATE INDEX IF NOT EXISTS meal_logs_user_date ON meal_logs(user_id, date);

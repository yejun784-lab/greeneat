-- 운동 기록
CREATE TABLE IF NOT EXISTS exercise_logs (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date          date DEFAULT CURRENT_DATE,
  exercise_type text NOT NULL,
  duration_min  integer NOT NULL CHECK (duration_min > 0),
  calories_burned integer,
  memo          text,
  created_at    timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS exercise_logs_user_date ON exercise_logs(user_id, date);
ALTER TABLE exercise_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "exercise_logs_own" ON exercise_logs FOR ALL USING (auth.uid() = user_id);

-- 수분 섭취 기록
CREATE TABLE IF NOT EXISTS water_logs (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date       date DEFAULT CURRENT_DATE,
  amount_ml  integer NOT NULL DEFAULT 200 CHECK (amount_ml > 0),
  created_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS water_logs_user_date ON water_logs(user_id, date);
ALTER TABLE water_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "water_logs_own" ON water_logs FOR ALL USING (auth.uid() = user_id);

-- 수면 기록
CREATE TABLE IF NOT EXISTS sleep_logs (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date        date DEFAULT CURRENT_DATE,
  sleep_start time NOT NULL,
  sleep_end   time NOT NULL,
  quality     integer CHECK (quality BETWEEN 1 AND 5),
  created_at  timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS sleep_logs_user_date ON sleep_logs(user_id, date);
ALTER TABLE sleep_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sleep_logs_own" ON sleep_logs FOR ALL USING (auth.uid() = user_id);

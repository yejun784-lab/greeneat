CREATE TABLE IF NOT EXISTS meal_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  meal_type text NOT NULL DEFAULT 'snack', -- breakfast | lunch | dinner | snack
  description text,
  image_url text,
  calories integer,
  protein numeric(6,1),
  carbs numeric(6,1),
  fat numeric(6,1),
  ai_raw text, -- raw AI response for debugging
  created_at timestamptz DEFAULT now()
);
ALTER TABLE meal_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own meal logs" ON meal_logs FOR ALL USING (auth.uid() = user_id);

-- index for daily queries
CREATE INDEX IF NOT EXISTS meal_logs_user_date ON meal_logs(user_id, date);

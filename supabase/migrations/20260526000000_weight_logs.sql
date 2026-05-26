CREATE TABLE IF NOT EXISTS weight_logs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  weight_kg numeric(5,1) NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);
ALTER TABLE weight_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own weight logs" ON weight_logs FOR ALL USING (auth.uid() = user_id);

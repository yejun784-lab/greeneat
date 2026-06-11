-- 1:1 문의 (고객 문의 + 어드민 답변)
CREATE TABLE inquiries (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category    text NOT NULL CHECK (category IN ('order', 'delivery', 'product', 'refund', 'account', 'etc')),
  title       text NOT NULL,
  content     text NOT NULL,
  status      text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'answered')),
  answer      text,
  answered_at timestamptz,
  created_at  timestamptz DEFAULT now()
);

CREATE INDEX inquiries_user_created_idx ON inquiries (user_id, created_at DESC);
CREATE INDEX inquiries_status_idx ON inquiries (status);

ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- 본인 문의 조회
CREATE POLICY "inquiries_select_own" ON inquiries
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- 본인 문의 작성
CREATE POLICY "inquiries_insert_own" ON inquiries
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

-- 어드민 전체 권한 (조회/답변)
CREATE POLICY "inquiries_admin_all" ON inquiries
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

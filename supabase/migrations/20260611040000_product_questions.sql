-- 상품 Q&A (문의)
CREATE TABLE IF NOT EXISTS product_questions (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  uuid        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question    text        NOT NULL,
  is_secret   boolean     NOT NULL DEFAULT false,
  answer      text,
  status      text        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'answered')),
  answered_at timestamptz,
  created_at  timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_questions_product ON product_questions(product_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_questions_status ON product_questions(status);

ALTER TABLE product_questions ENABLE ROW LEVEL SECURITY;

-- 공개글은 모두, 비밀글은 작성자/어드민만 조회
CREATE POLICY "product_questions_select" ON product_questions
  FOR SELECT USING (
    is_secret = false
    OR auth.uid() = user_id
    OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 작성: 로그인 본인
CREATE POLICY "product_questions_insert" ON product_questions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 삭제: 본인
CREATE POLICY "product_questions_delete_own" ON product_questions
  FOR DELETE USING (auth.uid() = user_id);

-- 답변(수정)/관리: 어드민
CREATE POLICY "product_questions_admin_all" ON product_questions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

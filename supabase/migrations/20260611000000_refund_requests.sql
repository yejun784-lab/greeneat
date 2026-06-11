-- 환불/교환 신청 테이블
-- src/app/(main)/my/refund/page.tsx 가 insert 중이던 테이블 — 정의 누락 보완
CREATE TABLE IF NOT EXISTS refund_requests (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id      uuid        NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  order_item_id uuid        REFERENCES order_items(id) ON DELETE SET NULL,
  type          text        NOT NULL CHECK (type IN ('refund', 'exchange')),
  reason        text        NOT NULL,
  detail        text,
  status        text        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_refund_requests_user ON refund_requests(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_refund_requests_status ON refund_requests(status);

ALTER TABLE refund_requests ENABLE ROW LEVEL SECURITY;

-- 본인 신청 조회/생성
CREATE POLICY "refund_requests_select_own" ON refund_requests
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "refund_requests_insert_own" ON refund_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 어드민 전체 접근
CREATE POLICY "refund_requests_admin_all" ON refund_requests
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

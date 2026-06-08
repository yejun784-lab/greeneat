-- ── 배송 예약 시스템 강화 마이그레이션 ──────────────────────────────
-- 실행: Supabase Dashboard > SQL Editor에서 실행

-- orders: 시간대 + 메모 컬럼 추가
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS delivery_time_slot TEXT CHECK (delivery_time_slot IN ('morning', 'afternoon', 'evening')),
  ADD COLUMN IF NOT EXISTS delivery_memo       TEXT;

-- subscriptions: 시간대 + 자동결제 + 일시정지 기간 컬럼 추가
ALTER TABLE subscriptions
  ADD COLUMN IF NOT EXISTS delivery_time_slot TEXT    DEFAULT 'morning' CHECK (delivery_time_slot IN ('morning', 'afternoon', 'evening')),
  ADD COLUMN IF NOT EXISTS auto_renew         BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS paused_until       TIMESTAMPTZ;

COMMENT ON COLUMN orders.delivery_time_slot IS '배송 시간대: morning(7-12) / afternoon(12-18) / evening(18-22)';
COMMENT ON COLUMN orders.delivery_memo       IS '배송 요청사항 (문앞/경비실/직접받음 등)';
COMMENT ON COLUMN subscriptions.delivery_time_slot IS '정기 배송 시간대';
COMMENT ON COLUMN subscriptions.auto_renew         IS '자동결제 여부 (false면 매월 직접 결제)';
COMMENT ON COLUMN subscriptions.paused_until       IS '일시정지 종료 일시 (null이면 무기한)';

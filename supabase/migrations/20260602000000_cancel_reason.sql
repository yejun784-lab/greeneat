-- 주문 취소 사유 컬럼 추가
ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancel_reason text;

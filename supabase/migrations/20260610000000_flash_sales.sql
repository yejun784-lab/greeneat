-- 타임세일 테이블
CREATE TABLE IF NOT EXISTS flash_sales (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  uuid        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  discount_rate int       NOT NULL CHECK (discount_rate BETWEEN 5 AND 90),
  starts_at   timestamptz NOT NULL DEFAULT now(),
  ends_at     timestamptz NOT NULL,
  is_active   boolean     NOT NULL DEFAULT true,
  created_at  timestamptz DEFAULT now()
);

-- 현재 활성 세일 조회 최적화
CREATE INDEX IF NOT EXISTS idx_flash_sales_active ON flash_sales(is_active, starts_at, ends_at);

-- RLS
ALTER TABLE flash_sales ENABLE ROW LEVEL SECURITY;

-- 누구나 활성 세일 조회 가능
CREATE POLICY "flash_sales_select_all" ON flash_sales
  FOR SELECT USING (true);

-- 어드민만 삽입/수정/삭제
CREATE POLICY "flash_sales_admin_write" ON flash_sales
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 테스트용 시드 데이터 (처음 실행 시 상품 2개에 타임세일 설정)
-- 실제 product_id로 대체 필요
DO $$
DECLARE
  p1 uuid; p2 uuid; p3 uuid;
BEGIN
  -- 첫 3개 상품에 타임세일 적용
  SELECT id INTO p1 FROM products WHERE is_active = true ORDER BY created_at LIMIT 1 OFFSET 0;
  SELECT id INTO p2 FROM products WHERE is_active = true ORDER BY created_at LIMIT 1 OFFSET 1;
  SELECT id INTO p3 FROM products WHERE is_active = true ORDER BY created_at LIMIT 1 OFFSET 2;

  IF p1 IS NOT NULL THEN
    INSERT INTO flash_sales (product_id, discount_rate, starts_at, ends_at)
    VALUES (p1, 20, now(), now() + interval '24 hours')
    ON CONFLICT DO NOTHING;
  END IF;
  IF p2 IS NOT NULL THEN
    INSERT INTO flash_sales (product_id, discount_rate, starts_at, ends_at)
    VALUES (p2, 30, now(), now() + interval '20 hours')
    ON CONFLICT DO NOTHING;
  END IF;
  IF p3 IS NOT NULL THEN
    INSERT INTO flash_sales (product_id, discount_rate, starts_at, ends_at)
    VALUES (p3, 15, now(), now() + interval '18 hours')
    ON CONFLICT DO NOTHING;
  END IF;
END $$;

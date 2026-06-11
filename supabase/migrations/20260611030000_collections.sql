-- 기획전(테마 큐레이션) 기능
-- collections: 기획전 메타 / collection_items: 기획전-상품 매핑

-- 1. 테이블
CREATE TABLE IF NOT EXISTS collections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  subtitle text,
  emoji text DEFAULT '🍱',
  theme_color text DEFAULT '#2d7a4f', -- 배경 틴트용 hex
  is_active boolean DEFAULT true,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS collection_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id uuid NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sort_order int DEFAULT 0,
  UNIQUE (collection_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_collection_items_collection_id
  ON collection_items (collection_id);

-- 2. RLS — 읽기는 모두 허용, 쓰기는 어드민만
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "collections_select" ON collections
  FOR SELECT USING (true);

CREATE POLICY "collections_admin_all" ON collections
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "collection_items_select" ON collection_items
  FOR SELECT USING (true);

CREATE POLICY "collection_items_admin_all" ON collection_items
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- 3. 시드 — 기획전 3개
INSERT INTO collections (slug, title, subtitle, emoji, theme_color, sort_order) VALUES
  ('high-protein', '단백질 가득 한 끼',    '운동하는 날엔 이 도시락',       '💪', '#4a6fa5', 1),
  ('low-cal-diet', '가볍게, 다이어트 식단', '400kcal 이하 저칼로리 모음',   '🥗', '#2d7a4f', 2),
  ('quick-meal',   '3분 완성 간편식',      '바쁜 날 가장 빠른 한 끼',       '⚡', '#e8734a', 3)
ON CONFLICT (slug) DO NOTHING;

-- 4. 상품 자동 매칭 (각 기획전당 상위 8개)
DO $$
DECLARE
  c_id uuid;
BEGIN
  -- 단백질 가득 한 끼: protein >= 25
  SELECT id INTO c_id FROM collections WHERE slug = 'high-protein';
  IF c_id IS NOT NULL THEN
    INSERT INTO collection_items (collection_id, product_id, sort_order)
    SELECT c_id, p.id, row_number() OVER (ORDER BY p.protein DESC)
    FROM (
      SELECT id, protein FROM products
      WHERE protein >= 25 AND is_active = true
      ORDER BY protein DESC
      LIMIT 8
    ) p
    ON CONFLICT (collection_id, product_id) DO NOTHING;
  END IF;

  -- 가볍게, 다이어트 식단: calories <= 400
  SELECT id INTO c_id FROM collections WHERE slug = 'low-cal-diet';
  IF c_id IS NOT NULL THEN
    INSERT INTO collection_items (collection_id, product_id, sort_order)
    SELECT c_id, p.id, row_number() OVER (ORDER BY p.calories ASC)
    FROM (
      SELECT id, calories FROM products
      WHERE calories <= 400 AND is_active = true
      ORDER BY calories ASC
      LIMIT 8
    ) p
    ON CONFLICT (collection_id, product_id) DO NOTHING;
  END IF;

  -- 3분 완성 간편식: cook_time <= 5
  SELECT id INTO c_id FROM collections WHERE slug = 'quick-meal';
  IF c_id IS NOT NULL THEN
    INSERT INTO collection_items (collection_id, product_id, sort_order)
    SELECT c_id, p.id, row_number() OVER (ORDER BY p.cook_time ASC)
    FROM (
      SELECT id, cook_time FROM products
      WHERE cook_time <= 5 AND is_active = true
      ORDER BY cook_time ASC
      LIMIT 8
    ) p
    ON CONFLICT (collection_id, product_id) DO NOTHING;
  END IF;
END $$;

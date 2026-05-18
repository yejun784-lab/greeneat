-- display_group 컬럼 추가 (1=도시락박스, 2=접시, 3=샐러드/기타)
ALTER TABLE products ADD COLUMN IF NOT EXISTS display_group smallint DEFAULT 2;

-- Group 1: 도시락 박스 스타일 (만렙, 트라이얼, 세트류)
UPDATE products SET display_group = 1
WHERE name LIKE '%만렙%'
   OR name LIKE '%트라이얼%'
   OR name LIKE '%8가지%'
   OR name LIKE '%골고루%'
   OR name LIKE '%세트%';

-- Group 3: 샐러드/베이커리/기타 (채소, 그래놀라, 쿠키, 만두, 요거트)
UPDATE products SET display_group = 3
WHERE name LIKE '%샐러드%'
   OR name LIKE '%그래놀라%'
   OR name LIKE '%쿠키%'
   OR name LIKE '%만두%'
   OR name LIKE '%채소%'
   OR name LIKE '%요거트%';

-- Group 2: 나머지는 전부 접시 스타일 (한끼 도시락, 닭가슴살, 단백질 등)
UPDATE products SET display_group = 2
WHERE display_group IS NULL OR display_group = 2;

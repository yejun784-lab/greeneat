-- 현재 활성 상품 알레르기 + 칼로리 null 보정
-- allergens: gluten / dairy / egg / soy / pork / sesame

-- 만두류 (밀가루 + 각종)
UPDATE products SET allergens = ARRAY['gluten','pork']
WHERE name LIKE '%수제만두%' AND name NOT LIKE '%4색%' AND name NOT LIKE '%전복%' AND name NOT LIKE '%문어%';

UPDATE products SET allergens = ARRAY['gluten','pork']
WHERE name LIKE '%제주 4색 수제만두%';

UPDATE products SET allergens = ARRAY['gluten']
WHERE name LIKE '%전복 수제만두%' OR name LIKE '%문어 수제만두%';

-- 덮밥/도시락류
UPDATE products SET allergens = ARRAY['gluten','soy','pork']
WHERE name IN ('만렙 제육덮밥', '매콤제육 도시락');

UPDATE products SET allergens = ARRAY['gluten','dairy','egg']
WHERE name = '만렙 치즈오므라이스';

UPDATE products SET allergens = ARRAY['egg','soy']
WHERE name = '만렙 아보카도명란마요 덮밥';

UPDATE products SET allergens = ARRAY['gluten','soy']
WHERE name IN ('만렙 떡갈비덮밥','만렙 소불고기덮밥','만렙 오징어덮밥',
               '소불고기 도시락','오리고기 도시락','간장 우삼겹 도시락',
               '강된장 비빔밥','치킨스테이크 덮밥');

UPDATE products SET allergens = ARRAY['gluten','egg','soy','pork']
WHERE name IN ('만렙도시락 6종 덮밥 세트','8가지 한끼도시락 세트','트라이얼 3개묶음 도시락세트');

UPDATE products SET allergens = ARRAY['egg']
WHERE name = '닭가슴살 도시락';

UPDATE products SET allergens = ARRAY['dairy','egg']
WHERE name = '치즈닭갈비 도시락';

UPDATE products SET allergens = ARRAY['gluten','dairy']
WHERE name IN ('불닭 로제 파스타','상하이 버터떡 세트 (14개)');

-- 쿠키류
UPDATE products SET allergens = ARRAY['gluten','dairy','egg']
WHERE name LIKE '%두바이 쫀득 쿠키%';

-- 그래놀라
UPDATE products SET allergens = ARRAY['gluten','soy']
WHERE name LIKE '%그래놀라%';

-- 칼로리 null → 추정값 보정
UPDATE products SET calories = 550  WHERE name = '8가지 한끼도시락 세트'         AND calories IS NULL;
UPDATE products SET calories = 720  WHERE name = '두바이 쫀득 쿠키 (4개)'         AND calories IS NULL;
UPDATE products SET calories = 1080 WHERE name = '두바이 쫀득 쿠키 (6개)'         AND calories IS NULL;
UPDATE products SET calories = 610  WHERE name = '만렙도시락 6종 덮밥 세트'       AND calories IS NULL;
UPDATE products SET calories = 1060 WHERE name = '제주 4색 수제만두 세트 (28알)' AND calories IS NULL;
UPDATE products SET calories = 520  WHERE name = '트라이얼 3개묶음 도시락세트'   AND calories IS NULL;

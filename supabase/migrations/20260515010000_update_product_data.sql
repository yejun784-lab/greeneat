-- 실제 그린잇 가격 및 데이터 보완

-- 한끼 도시락 개별: 실제 4,900원
UPDATE products SET
  price = 4900,
  description = '1개도 주문 가능! 먹고 싶은 도시락만 골라 담아요. 전자레인지 3분이면 완성되는 간편한 한끼.'
WHERE name LIKE '%한끼 도시락%' AND name NOT LIKE '%세트%' AND name NOT LIKE '%8가지%';

-- 만렙 도시락 개별: 실제 6,500원
UPDATE products SET
  price = 6500,
  description = '평균 중량 300g 이상! 든든하게 먹고 싶을 때 선택하는 만렙 도시락. 전자레인지 3분이면 OK.'
WHERE name LIKE '%만렙 도시락 - %';

-- 만렙 6종 세트: 38,800원
UPDATE products SET
  price = 38800,
  servings = 6,
  description = '6가지 맛 덮밥을 한 번에! 불닭, 소불고기, 오징어, 로제 등 다양한 맛을 골고루 즐길 수 있는 세트.'
WHERE name LIKE '%만렙 도시락%' AND name LIKE '%세트%';

-- 트라이얼 세트: 19,800원 (3개)
UPDATE products SET
  price = 19800,
  servings = 3,
  description = '그린잇 처음이라면? 함박스테이크, 불닭, 로제파스타, 오징어덮밥 중 3개를 골라 맛보는 트라이얼 세트.'
WHERE name LIKE '%트라이얼%';

-- 8가지 한끼 세트: 42,000원
UPDATE products SET
  price = 42000,
  servings = 8,
  description = '냉동 간편식의 정석! 8가지 맛을 골고루 담은 프리미엄 한끼도시락 세트. 한 달 식단을 미리 준비하세요.'
WHERE name LIKE '%8가지%' OR name LIKE '%골고루%';

-- 두바이 쫀득 쿠키: 76,000원 (20개)
UPDATE products SET
  price = 76000,
  servings = 20,
  description = '겉은 쫀득, 속은 바삭! 두바이 감성의 프리미엄 수제 쿠키 20개입. 선물하기에도 딱.',
  calories = 180, protein = 3, carbs = 24, fat = 8
WHERE name LIKE '%쫀득 쿠키%';

-- 수제만두: 7,110원
UPDATE products SET
  price = 7110,
  description = '제주 장인이 직접 빚은 수제 김치만두. 아삭한 제주 김치 속이 가득한 정직한 만두.',
  calories = 320, protein = 14, carbs = 38, fat = 12
WHERE name LIKE '%수제만두%' OR (name LIKE '%만두%' AND name NOT LIKE '%8가지%');

-- 그릭 요거트 샐러드: 8,900원
UPDATE products SET
  price = 8900,
  calories = 220, protein = 14, carbs = 18, fat = 8
WHERE name LIKE '%그릭 요거트%';

-- 그래놀라 가격 및 데이터
UPDATE products SET
  price = 14900,
  calories = 420, protein = 10, carbs = 58, fat = 16,
  description = '제주산 감귤 껍질을 넣어 상큼하고 고소한 수제 그래놀라. 요거트에 곁들이면 더욱 맛있어요.'
WHERE name LIKE '%감귤 그래놀라%';

UPDATE products SET
  price = 12900,
  calories = 390, protein = 9, carbs = 54, fat = 14,
  description = '귀리, 아몬드, 꿀로 만든 클래식 그래놀라. 바쁜 아침을 든든하게 시작하세요.'
WHERE name LIKE '%오리지널 그래놀라%';

-- 닭가슴살 도시락 (맞춤식단)
UPDATE products SET
  calories = 320, protein = 38, carbs = 28, fat = 6,
  description = '고단백 저지방 닭가슴살과 현미밥으로 구성된 다이어트 식단 도시락. 운동하는 분께 강추!'
WHERE name LIKE '%닭가슴살%';

-- 저칼로리 채소 도시락
UPDATE products SET
  calories = 380, protein = 16, carbs = 52, fat = 10,
  description = '500kcal 이하의 채소 중심 도시락. 다이어트 중에도 맛있게, 포만감은 높게.'
WHERE name LIKE '%저칼로리%';

-- 단백질 강화 도시락
UPDATE products SET
  calories = 480, protein = 45, carbs = 38, fat = 10,
  description = '운동 후 근육 회복을 위한 고단백 도시락. 닭가슴살, 계란, 퀴노아로 구성한 헬스 식단.'
WHERE name LIKE '%단백질 강화%';

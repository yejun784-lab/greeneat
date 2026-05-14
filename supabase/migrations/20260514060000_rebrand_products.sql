-- ── 카테고리 리브랜딩: 밀키트 → 도시락 중심 ────────────────────
UPDATE product_categories SET
  name = '간편식',
  slug = 'lunchbox',
  description = '간편하게 즐기는 냉동 도시락'
WHERE slug = 'korean';

UPDATE product_categories SET
  name = '베이커리&샐러드',
  slug = 'bakery',
  description = '신선한 샐러드와 건강한 베이커리'
WHERE slug = 'salad';

UPDATE product_categories SET
  name = '건강식품',
  slug = 'health',
  description = '영양 균형 특화 건강 먹거리'
WHERE slug = 'western';

UPDATE product_categories SET
  name = '맞춤식단',
  slug = 'diet',
  description = '목표별 칼로리 맞춤 식단 관리'
WHERE slug = 'vegan';

-- ── 기존 상품 전체 비활성화 후 새 상품으로 교체 ─────────────────
UPDATE products SET is_active = false;

-- 카테고리 ID 변수 (기존 ID 재사용)
DO $$
DECLARE
  v_lunchbox  uuid := '129a064a-bf38-4a8c-a247-b5e2bf97979f';  -- 간편식 (구 한식)
  v_bakery    uuid := 'c574bdb2-3026-47fb-a1e2-7ea78f2f5616';  -- 베이커리&샐러드 (구 샐러드)
  v_health    uuid := 'fc63e2a8-a77d-45ad-a50a-aaa8df881ae9';  -- 건강식품 (구 양식)
  v_diet      uuid := 'f1f57589-7f1b-4686-9d79-fccc222c5e25';  -- 맞춤식단 (구 비건)
BEGIN

INSERT INTO products (name, description, price, category_id, calories, protein, carbs, fat, servings, cook_time, difficulty, image_url, is_subscription, stock, is_active) VALUES

-- ── 간편식 ────────────────────────────────────────────────────────
('한끼 도시락 - 함박스테이크',
 '촉촉한 수제 함박 패티에 데미글라스 소스를 곁들인 든든한 한끼. 전자레인지 3분이면 완성!',
 5900, v_lunchbox,
 520, 32, 48, 18, 1, 3, 'easy',
 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&w=600&q=80',
 true, 100, true),

('한끼 도시락 - 불닭 덮밥',
 '불닭 소스의 매콤한 풍미가 살아있는 닭갈비 덮밥. 매운 맛 즐기는 분께 강추!',
 5900, v_lunchbox,
 580, 35, 62, 14, 1, 3, 'easy',
 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?auto=format&w=600&q=80',
 true, 100, true),

('한끼 도시락 - 로제 파스타',
 '크리미한 로제 소스에 쫄깃한 파스타. 가볍지만 풍부한 맛의 이탈리안 한끼.',
 5900, v_lunchbox,
 610, 22, 72, 24, 1, 3, 'easy',
 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&w=600&q=80',
 true, 80, true),

('한끼 도시락 - 오징어 덮밥',
 '쫄깃한 오징어와 고추장 양념이 어우러진 매콤한 오징어 덮밥.',
 5900, v_lunchbox,
 540, 28, 66, 12, 1, 3, 'easy',
 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&w=600&q=80',
 true, 80, true),

('만렙 도시락 - 소불고기',
 '부드러운 양념 소불고기와 밥이 듬뿍 300g 이상. 든든하게 먹고 싶을 때.',
 6500, v_lunchbox,
 680, 42, 72, 18, 1, 3, 'easy',
 'https://images.unsplash.com/photo-1544025162-d76538f8fe8d?auto=format&w=600&q=80',
 true, 60, true),

('제주 수제만두 - 김치',
 '제주 장인이 직접 빚은 수제 김치만두. 아삭한 김치 속이 가득.',
 7110, v_lunchbox,
 420, 18, 48, 16, 1, 5, 'easy',
 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&w=600&q=80',
 true, 50, true),

('한끼 도시락 - 된장찌개',
 '집 된장 향이 그대로 살아있는 구수한 된장찌개 도시락. 따뜻한 집밥의 맛.',
 4900, v_lunchbox,
 380, 20, 44, 10, 1, 3, 'easy',
 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&w=600&q=80',
 true, 70, true),

('트라이얼 4종 세트',
 '함박스테이크, 불닭, 로제파스타, 오징어덮밥 4종 맛보기 세트. 처음 시작하기 딱!',
 21900, v_lunchbox,
 550, 29, 57, 16, 4, 3, 'easy',
 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&w=600&q=80',
 false, 40, true),

-- ── 베이커리&샐러드 ──────────────────────────────────────────────
('두바이 쫀득 쿠키 (20개)',
 '겉은 쫀득, 속은 바삭한 프리미엄 쿠키. 달달한 간식으로 딱!',
 76000, v_bakery,
 180, 3, 24, 8, 20, 0, 'easy',
 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&w=600&q=80',
 false, 30, true),

('제주 장인의집 흑돼지 만두',
 '제주 흑돼지와 제주 채소로 빚은 특제 만두. 선물용으로도 인기.',
 8900, v_bakery,
 380, 20, 38, 18, 1, 5, 'easy',
 'https://images.unsplash.com/photo-1607532941433-304659e8198a?auto=format&w=600&q=80',
 true, 40, true),

('그릭 요거트 샐러드',
 '신선한 채소와 그릭 요거트 드레싱으로 가볍게 즐기는 한끼 샐러드.',
 8900, v_bakery,
 220, 14, 18, 10, 1, 0, 'easy',
 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&w=600&q=80',
 true, 30, true),

-- ── 건강식품 ────────────────────────────────────────────────────
('제주 감귤 그래놀라',
 '제주산 감귤 껍질을 넣어 상큼하고 고소한 수제 그래놀라. 요거트에 곁들여 드세요.',
 14900, v_health,
 420, 10, 58, 16, 3, 0, 'easy',
 'https://images.unsplash.com/photo-1517093728226-03c47c7d09d2?auto=format&w=600&q=80',
 true, 35, true),

('오리지널 그래놀라',
 '귀리, 아몬드, 꿀로 만든 클래식 그래놀라. 아침 한 끼를 든든하게.',
 12900, v_health,
 390, 9, 54, 14, 3, 0, 'easy',
 'https://images.unsplash.com/photo-1495214783159-3503fd1b572d?auto=format&w=600&q=80',
 true, 40, true),

-- ── 맞춤식단 ────────────────────────────────────────────────────
('다이어트 닭가슴살 도시락',
 '고단백 저지방 닭가슴살과 현미밥으로 구성된 다이어트 식단 도시락.',
 5900, v_diet,
 320, 38, 28, 6, 1, 3, 'easy',
 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&w=600&q=80',
 true, 60, true),

('저칼로리 채소 도시락',
 '500kcal 이하로 구성한 채소 중심 다이어트 도시락. 열량은 낮고 포만감은 높게.',
 5900, v_diet,
 440, 18, 54, 12, 1, 3, 'easy',
 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&w=600&q=80',
 true, 50, true),

('단백질 강화 도시락',
 '운동 후 회복을 위한 고단백 도시락. 닭가슴살, 계란, 퀴노아로 구성.',
 6500, v_diet,
 480, 45, 38, 10, 1, 3, 'easy',
 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&w=600&q=80',
 true, 45, true);

END $$;

-- 기존 카테고리 ID 사용
-- 한식:  129a064a-bf38-4a8c-a247-b5e2bf97979f
-- 양식:  fc63e2a8-a77d-45ad-a50a-aaa8df881ae9
-- 샐러드: c574bdb2-3026-47fb-a1e2-7ea78f2f5616
-- 비건:  f1f57589-7f1b-4686-9d79-fccc222c5e25

INSERT INTO products (name, description, price, category_id, calories, protein, carbs, fat, servings, cook_time, difficulty, image_url, is_subscription, stock, is_active) VALUES

-- ── 한식 ─────────────────────────────────────────────────────────
('부대찌개 밀키트',
 '스팸, 소시지, 김치가 어우러진 푸짐한 부대찌개. 얼큰하고 든든한 한 끼.',
 12900, '129a064a-bf38-4a8c-a247-b5e2bf97979f',
 520, 28, 45, 18, 2, 25, 'easy',
 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&w=600&q=80',
 true, 50, true),

('된장찌개 밀키트',
 '구수한 된장에 두부, 애호박, 버섯을 넣은 정통 된장찌개. 집밥의 따뜻함을 그대로.',
 10900, '129a064a-bf38-4a8c-a247-b5e2bf97979f',
 320, 18, 28, 12, 2, 20, 'easy',
 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&w=600&q=80',
 true, 45, true),

('소불고기 밀키트',
 '부드러운 소고기를 달콤짭짤한 양념에 재운 불고기. 온 가족이 좋아하는 메뉴.',
 15900, '129a064a-bf38-4a8c-a247-b5e2bf97979f',
 480, 35, 32, 20, 2, 30, 'easy',
 'https://images.unsplash.com/photo-1544025162-d76538f8fe8d?auto=format&w=600&q=80',
 true, 40, true),

('비빔밥 밀키트',
 '5가지 나물과 고추장이 어우러진 알록달록 비빔밥. 영양 가득 건강한 한 끼.',
 11900, '129a064a-bf38-4a8c-a247-b5e2bf97979f',
 580, 22, 88, 14, 2, 35, 'medium',
 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?auto=format&w=600&q=80',
 false, 35, true),

('김치찌개 밀키트',
 '잘 익은 김치와 돼지고기로 끓인 얼큰한 김치찌개. 밥 한 그릇 뚝딱.',
 11900, '129a064a-bf38-4a8c-a247-b5e2bf97979f',
 420, 25, 35, 16, 2, 25, 'easy',
 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&w=600&q=80',
 true, 30, true),

-- ── 양식 ─────────────────────────────────────────────────────────
('크림 파스타 밀키트',
 '진한 생크림 소스에 베이컨과 버섯이 들어간 카르보나라 스타일 파스타.',
 13900, 'fc63e2a8-a77d-45ad-a50a-aaa8df881ae9',
 720, 24, 82, 32, 2, 20, 'easy',
 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&w=600&q=80',
 true, 40, true),

('토마토 파스타 밀키트',
 '신선한 토마토 소스에 올리브오일과 바질로 완성한 아라비아타 파스타.',
 12900, 'fc63e2a8-a77d-45ad-a50a-aaa8df881ae9',
 580, 18, 85, 16, 2, 20, 'easy',
 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&w=600&q=80',
 true, 35, true),

('함박스테이크 밀키트',
 '촉촉한 수제 함박 패티에 데미글라스 소스를 곁들인 양식 정식.',
 16900, 'fc63e2a8-a77d-45ad-a50a-aaa8df881ae9',
 650, 38, 42, 28, 2, 30, 'medium',
 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&w=600&q=80',
 false, 25, true),

('버섯 리조또 밀키트',
 '버섯과 파마산 치즈로 완성한 크리미한 이탈리안 버섯 리조또.',
 14900, 'fc63e2a8-a77d-45ad-a50a-aaa8df881ae9',
 640, 20, 75, 24, 2, 25, 'medium',
 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&w=600&q=80',
 true, 30, true),

-- ── 샐러드 ───────────────────────────────────────────────────────
('그릭 샐러드 밀키트',
 '페타치즈, 올리브, 오이, 토마토가 어우러진 지중해식 그릭 샐러드.',
 10900, 'c574bdb2-3026-47fb-a1e2-7ea78f2f5616',
 280, 12, 18, 18, 1, 10, 'easy',
 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&w=600&q=80',
 true, 30, true),

('시저 샐러드 밀키트',
 '바삭한 크루통과 파마산, 시저 드레싱으로 완성한 클래식 시저 샐러드.',
 11900, 'c574bdb2-3026-47fb-a1e2-7ea78f2f5616',
 320, 14, 22, 20, 1, 10, 'easy',
 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&w=600&q=80',
 true, 25, true),

('퀴노아 샐러드 밀키트',
 '단백질 풍부한 퀴노아에 아보카도, 방울토마토를 곁들인 영양 샐러드.',
 13900, 'c574bdb2-3026-47fb-a1e2-7ea78f2f5616',
 380, 16, 42, 16, 1, 15, 'easy',
 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&w=600&q=80',
 true, 20, true),

-- ── 비건 ─────────────────────────────────────────────────────────
('두부 스테이크 밀키트',
 '두툼한 두부를 허브 마리네이드에 재워 구운 비건 스테이크. 고소하고 담백.',
 12900, 'f1f57589-7f1b-4686-9d79-fccc222c5e25',
 340, 20, 22, 16, 2, 20, 'easy',
 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&w=600&q=80',
 true, 25, true),

('채소 카레 밀키트',
 '강황, 코코넛밀크, 제철 채소로 만든 인도식 비건 채소 카레.',
 11900, 'f1f57589-7f1b-4686-9d79-fccc222c5e25',
 420, 12, 62, 14, 2, 25, 'easy',
 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&w=600&q=80',
 true, 20, true),

('버섯 볶음밥 밀키트',
 '표고, 새송이, 양송이 3종 버섯과 채소로 만든 고소한 비건 볶음밥.',
 10900, 'f1f57589-7f1b-4686-9d79-fccc222c5e25',
 460, 14, 72, 12, 2, 15, 'easy',
 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&w=600&q=80',
 false, 15, true);

-- ── 크림 파스타 레시피 스텝 ─────────────────────────────────────
INSERT INTO recipe_steps (product_id, step_number, title, description, duration_minutes)
SELECT p.id, s.step_number, s.title, s.description, s.duration_minutes
FROM products p
CROSS JOIN (VALUES
  (1, '물 끓이기', '냄비에 물 1L를 넣고 소금 1큰술을 넣어 끓입니다.', 8),
  (2, '파스타 삶기', '끓는 물에 파스타를 넣고 표기된 시간보다 1분 덜 삶습니다.', 9),
  (3, '베이컨 볶기', '팬에 베이컨을 바삭하게 볶다가 버섯을 넣어 함께 볶습니다.', 5),
  (4, '크림소스 만들기', '생크림 200ml와 파마산 치즈를 넣고 약불에서 졸입니다.', 5),
  (5, '마무리', '삶은 파스타를 소스에 넣어 버무린 후 후추를 뿌려 완성합니다.', 3)
) AS s(step_number, title, description, duration_minutes)
WHERE p.name = '크림 파스타 밀키트';

-- ── 된장찌개 레시피 스텝 ────────────────────────────────────────
INSERT INTO recipe_steps (product_id, step_number, title, description, duration_minutes)
SELECT p.id, s.step_number, s.title, s.description, s.duration_minutes
FROM products p
CROSS JOIN (VALUES
  (1, '재료 준비', '두부는 1.5cm 크기로 깍둑썰고, 애호박은 반달 모양으로 썹니다.', 5),
  (2, '육수 내기', '냄비에 멸치와 다시마로 기본 육수 400ml를 냅니다.', 8),
  (3, '된장 풀기', '육수가 끓으면 된장 2큰술을 풀고 다진 마늘을 넣습니다.', 2),
  (4, '채소 넣기', '애호박, 버섯, 양파를 넣고 5분간 끓입니다.', 5),
  (5, '두부 마무리', '두부를 넣고 2분 더 끓인 후 파를 올려 완성합니다.', 2)
) AS s(step_number, title, description, duration_minutes)
WHERE p.name = '된장찌개 밀키트';

-- ── 소불고기 레시피 스텝 ────────────────────────────────────────
INSERT INTO recipe_steps (product_id, step_number, title, description, duration_minutes)
SELECT p.id, s.step_number, s.title, s.description, s.duration_minutes
FROM products p
CROSS JOIN (VALUES
  (1, '양념 만들기', '간장 3큰술, 설탕 1큰술, 참기름, 다진 마늘을 섞어 양념을 만듭니다.', 5),
  (2, '고기 재우기', '얇게 썬 소고기에 양념과 배즙을 넣고 20분 재웁니다.', 20),
  (3, '채소 준비', '양파는 채썰고 버섯은 먹기 좋은 크기로 준비합니다.', 3),
  (4, '볶기', '달군 팬에 재운 고기와 채소를 센불에서 5분간 볶습니다.', 5),
  (5, '마무리', '참깨와 파를 뿌려 접시에 담아 완성합니다.', 2)
) AS s(step_number, title, description, duration_minutes)
WHERE p.name = '소불고기 밀키트';

-- ── 부대찌개 레시피 스텝 ────────────────────────────────────────
INSERT INTO recipe_steps (product_id, step_number, title, description, duration_minutes)
SELECT p.id, s.step_number, s.title, s.description, s.duration_minutes
FROM products p
CROSS JOIN (VALUES
  (1, '재료 손질', '스팸과 소시지는 먹기 좋은 크기로 썰고, 김치는 한입 크기로 자릅니다.', 5),
  (2, '육수 내기', '냄비에 물 500ml와 멸치, 다시마를 넣고 중불에서 10분간 육수를 냅니다.', 10),
  (3, '양념 넣기', '육수에 고추장 1.5큰술, 고춧가루 1큰술, 간장 1큰술을 넣고 잘 섞습니다.', 3),
  (4, '재료 끓이기', '손질한 재료를 모두 넣고 중불에서 10분간 끓입니다.', 10),
  (5, '마무리', '라면 사리와 대파를 넣고 면이 익을 때까지 3분 더 끓입니다.', 3)
) AS s(step_number, title, description, duration_minutes)
WHERE p.name = '부대찌개 밀키트';

-- ── 그릭 샐러드 레시피 스텝 ─────────────────────────────────────
INSERT INTO recipe_steps (product_id, step_number, title, description, duration_minutes)
SELECT p.id, s.step_number, s.title, s.description, s.duration_minutes
FROM products p
CROSS JOIN (VALUES
  (1, '채소 손질', '오이는 반달썰기, 토마토는 한입 크기, 양파는 얇게 썹니다.', 5),
  (2, '드레싱 만들기', '올리브오일 3큰술, 레몬즙 1큰술, 소금, 후추를 섞습니다.', 3),
  (3, '완성', '채소를 담고 페타치즈, 올리브를 올린 후 드레싱을 뿌립니다.', 2)
) AS s(step_number, title, description, duration_minutes)
WHERE p.name = '그릭 샐러드 밀키트';

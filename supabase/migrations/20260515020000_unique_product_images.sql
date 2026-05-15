-- 상품별 고유 이미지 배정 (중복 제거)
-- Unsplash 음식 사진으로 각 상품에 맞는 이미지 배정

-- ── 간편식 (한끼 도시락) ──────────────────────────────────────────
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&w=600&q=80'
WHERE name = '한끼 도시락 - 함박스테이크';
-- 함박스테이크 / 미트볼 느낌

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1604908177524-44cf6869e5c1?auto=format&w=600&q=80'
WHERE name = '한끼 도시락 - 불닭 덮밥';
-- 매운 치킨 덮밥

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&w=600&q=80'
WHERE name = '한끼 도시락 - 로제 파스타';
-- 로제 파스타

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?auto=format&w=600&q=80'
WHERE name = '한끼 도시락 - 오징어 덮밥';
-- 해산물 덮밥

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&w=600&q=80'
WHERE name = '한끼 도시락 - 된장찌개';
-- 한국식 찌개

-- ── 간편식 (만렙 도시락) ──────────────────────────────────────────
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&w=600&q=80'
WHERE name = '만렙 도시락 - 소불고기';
-- 소불고기 덮밥

-- 만렙 세트 & 대용량
UPDATE products SET image_url = 'https://nbdpckerbphyfnjzqiqp.supabase.co/storage/v1/object/public/product-images/greeneat/trial.jpg'
WHERE name = '트라이얼 4종 세트';

UPDATE products SET image_url = 'https://nbdpckerbphyfnjzqiqp.supabase.co/storage/v1/object/public/product-images/greeneat/hankki-set.jpg'
WHERE name LIKE '%8가지%' OR name LIKE '%골고루%';

-- ── 베이커리 & 샐러드 ─────────────────────────────────────────────
UPDATE products SET image_url = 'https://nbdpckerbphyfnjzqiqp.supabase.co/storage/v1/object/public/product-images/greeneat/cookie.png'
WHERE name LIKE '%쿠키%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&w=600&q=80'
WHERE name LIKE '%그릭 요거트%';
-- 요거트 샐러드

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1517093728226-03c47c7d09d2?auto=format&w=600&q=80'
WHERE name LIKE '%감귤 그래놀라%';
-- 그래놀라 볼

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1494597564530-871f2b93ac55?auto=format&w=600&q=80'
WHERE name LIKE '%오리지널 그래놀라%';
-- 오리지널 그래놀라 (다른 사진)

-- ── 건강식품 (만두) ───────────────────────────────────────────────
UPDATE products SET image_url = 'https://nbdpckerbphyfnjzqiqp.supabase.co/storage/v1/object/public/product-images/greeneat/mandu.png'
WHERE name LIKE '%제주 수제만두%';

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&w=600&q=80'
WHERE name LIKE '%흑돼지 만두%';
-- 만두 (다른 사진)

-- ── 맞춤식단 ─────────────────────────────────────────────────────
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&w=600&q=80'
WHERE name LIKE '%닭가슴살%';
-- 닭가슴살 건강 도시락

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&w=600&q=80'
WHERE name LIKE '%저칼로리 채소%';
-- 채소 도시락

UPDATE products SET image_url = 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&w=600&q=80'
WHERE name LIKE '%단백질 강화%';
-- 단백질 도시락

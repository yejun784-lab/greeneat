-- 실제 그린잇 공홈에서 다운받은 이미지로 교체
DO $$
DECLARE
  base text := 'https://nbdpckerbphyfnjzqiqp.supabase.co/storage/v1/object/public/product-images/greeneat/';
BEGIN

-- ── 한끼 도시락 ────────────────────────────────────────────────────
-- 함박스테이크 → 골라담기 대표 이미지 (실제 제품 이미지)
UPDATE products SET image_url = base || 'hankki-hambak.png'
WHERE name = '한끼 도시락 - 함박스테이크';

-- 불닭 덮밥 → 불닭 로제 파스타 실제 이미지
UPDATE products SET image_url = base || 'hankki-buldakroze.png'
WHERE name = '한끼 도시락 - 불닭 덮밥';

-- 로제 파스타 → 같은 이미지 (불닭+로제 세트)
UPDATE products SET image_url = base || 'hankki-buldakroze.png'
WHERE name = '한끼 도시락 - 로제 파스타';

-- 오징어 덮밥 → 만렙 오징어 실제 이미지 (한끼 오징어 단독 페이지 없음)
UPDATE products SET image_url = base || 'manrep-ojingo.png'
WHERE name = '한끼 도시락 - 오징어 덮밥';

-- 된장찌개 → 강된장 비빔밥 실제 이미지 (가장 유사한 제품)
UPDATE products SET image_url = base || 'hankki-doenjang.png'
WHERE name = '한끼 도시락 - 된장찌개';

-- ── 만렙 도시락 ────────────────────────────────────────────────────
UPDATE products SET image_url = base || 'manrep-bulgogi.png'
WHERE name = '만렙 도시락 - 소불고기';

-- ── 세트 상품 ──────────────────────────────────────────────────────
UPDATE products SET image_url = base || 'hankki-8jong.jpg'
WHERE name LIKE '%8가지%' OR name LIKE '%골고루%';

UPDATE products SET image_url = base || 'trial.jpg'
WHERE name LIKE '%트라이얼%';

UPDATE products SET image_url = base || 'manrep-6jong.png'
WHERE name LIKE '%만렙%' AND name LIKE '%세트%';

-- ── 베이커리 & 샐러드 ─────────────────────────────────────────────
UPDATE products SET image_url = base || 'cookie.png'
WHERE name LIKE '%쿠키%';

UPDATE products SET image_url = base || 'granola-gamgyul.png'
WHERE name LIKE '%감귤 그래놀라%';

UPDATE products SET image_url = base || 'granola-original.png'
WHERE name LIKE '%오리지널 그래놀라%';

-- 그릭 요거트 샐러드 (사이트에 없는 제품 → 좋은 Unsplash 사진)
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&w=600&q=80'
WHERE name LIKE '%그릭 요거트%';

-- ── 건강식품 (만두) ───────────────────────────────────────────────
UPDATE products SET image_url = base || 'mandu.png'
WHERE name LIKE '%수제만두%' OR name LIKE '%김치%만두%';

UPDATE products SET image_url = base || 'manrep-tteokgalbi.png'
WHERE name LIKE '%흑돼지 만두%';

-- ── 맞춤식단 ─────────────────────────────────────────────────────
UPDATE products SET image_url = base || 'hankki-dakgaseum.png'
WHERE name LIKE '%닭가슴살%';

UPDATE products SET image_url = base || 'hankki-jekyuk.png'
WHERE name LIKE '%단백질 강화%';

-- 저칼로리 채소 (사이트에 없는 제품 → Unsplash)
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&w=600&q=80'
WHERE name LIKE '%저칼로리%';

-- butter-tteok 이미지는 버터 떡 제품 있으면 적용
UPDATE products SET image_url = base || 'butter-tteok.png'
WHERE name LIKE '%버터 떡%' OR name LIKE '%버터떡%';

END $$;

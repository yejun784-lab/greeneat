-- Supabase Storage에 업로드된 실제 그린잇 이미지로 교체
DO $$
DECLARE
  base text := 'https://nbdpckerbphyfnjzqiqp.supabase.co/storage/v1/object/public/product-images/greeneat/';
BEGIN

UPDATE products SET image_url = base || 'hankki.png'
WHERE name LIKE '%한끼 도시락%' AND name NOT LIKE '%세트%' AND name NOT LIKE '%8가지%';

UPDATE products SET image_url = base || 'manrep.png'
WHERE name LIKE '%만렙 도시락%' AND name NOT LIKE '%세트%';

UPDATE products SET image_url = base || 'trial.jpg'
WHERE name LIKE '%트라이얼%';

UPDATE products SET image_url = base || 'hankki-set.jpg'
WHERE name LIKE '%8가지%' OR name LIKE '%골고루%';

UPDATE products SET image_url = base || 'cookie.png'
WHERE name LIKE '%쫀득 쿠키%' OR name LIKE '%쿠키%';

UPDATE products SET image_url = base || 'mandu.png'
WHERE name LIKE '%만두%';

UPDATE products SET image_url = base || 'butter-tteok.png'
WHERE name LIKE '%그래놀라%';

UPDATE products SET image_url = base || 'hero.jpg'
WHERE name LIKE '%한끼 도시락 - 된장찌개%'
   OR name LIKE '%닭가슴살%'
   OR name LIKE '%저칼로리%'
   OR name LIKE '%단백질 강화%';

END $$;

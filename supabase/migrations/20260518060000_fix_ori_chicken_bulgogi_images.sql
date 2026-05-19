-- 오리고기, 치킨스테이크, 소불고기 이미지 수정
-- (이전에 eb631446=소불고기 이미지를 오리고기에 잘못 배정한 것 수정)

-- 오리고기 도시락: 실제 오리고기 medium 이미지 (Supabase Storage 업로드본)
UPDATE products
SET image_url = 'https://nbdpckerbphyfnjzqiqp.supabase.co/storage/v1/object/public/product-images/greeneat/hankki-origogi.png'
WHERE name = '오리고기 도시락';

-- 치킨스테이크 덮밥: 실제 치킨스테이크 이미지 (Supabase Storage 업로드본)
UPDATE products
SET image_url = 'https://nbdpckerbphyfnjzqiqp.supabase.co/storage/v1/object/public/product-images/greeneat/hankki-chickensteak.png'
WHERE name = '치킨스테이크 덮밥';

-- 소불고기 도시락: 실제 그린잇 Cafe24 CDN 소불고기 이미지
UPDATE products
SET image_url = 'https://ecimg.cafe24img.com/pg2495b61354611092/greeneat0419/web/product/medium/20260404/eb631446589811ef20e47631095561ce.png'
WHERE name = '소불고기 도시락';

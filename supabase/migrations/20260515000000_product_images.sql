-- 기존 갤러리 이미지 초기화 후 재삽입
DELETE FROM product_images;

-- 기존 상품 대표 이미지를 갤러리 0번으로
INSERT INTO product_images (product_id, url, "order")
SELECT id, image_url, 0 FROM products WHERE image_url IS NOT NULL AND is_active = true;

-- 한끼 도시락류 추가 이미지
INSERT INTO product_images (product_id, url, "order")
SELECT p.id,
  'https://nbdpckerbphyfnjzqiqp.supabase.co/storage/v1/object/public/product-images/greeneat/hankki-set.jpg', 1
FROM products p WHERE p.name LIKE '%한끼 도시락%' AND p.name NOT LIKE '%세트%' AND p.is_active = true;

INSERT INTO product_images (product_id, url, "order")
SELECT p.id,
  'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&w=600&q=80', 2
FROM products p WHERE p.name LIKE '%한끼 도시락%' AND p.is_active = true;

-- 만렙 도시락 추가 이미지
INSERT INTO product_images (product_id, url, "order")
SELECT p.id,
  'https://nbdpckerbphyfnjzqiqp.supabase.co/storage/v1/object/public/product-images/greeneat/manrep-set.png', 1
FROM products p WHERE p.name LIKE '%만렙 도시락%' AND p.is_active = true;

INSERT INTO product_images (product_id, url, "order")
SELECT p.id,
  'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?auto=format&w=600&q=80', 2
FROM products p WHERE p.name LIKE '%만렙 도시락%' AND p.is_active = true;

-- 트라이얼 세트 추가 이미지
INSERT INTO product_images (product_id, url, "order")
SELECT p.id,
  'https://nbdpckerbphyfnjzqiqp.supabase.co/storage/v1/object/public/product-images/greeneat/hankki.png', 1
FROM products p WHERE p.name LIKE '%트라이얼%' AND p.is_active = true;

INSERT INTO product_images (product_id, url, "order")
SELECT p.id,
  'https://nbdpckerbphyfnjzqiqp.supabase.co/storage/v1/object/public/product-images/greeneat/manrep.png', 2
FROM products p WHERE p.name LIKE '%트라이얼%' AND p.is_active = true;

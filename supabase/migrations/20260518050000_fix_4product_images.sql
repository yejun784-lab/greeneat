-- 4개 메뉴 이미지 → 실제 그린잇(greeneatfood.com) Cafe24 CDN 이미지로 교체

-- 치킨스테이크 덮밥: 된장 이미지 → 실제 치킨스테이크 이미지
UPDATE products
SET image_url = 'https://ecimg.cafe24img.com/pg2495b61354611092/greeneat0419/web/product/medium/20260404/b61490e212e0e462fba264eeb0ccc1bf.png'
WHERE name = '치킨스테이크 덮밥';

-- 오리고기 도시락: 제네릭 이미지 → 실제 오리고기 이미지
UPDATE products
SET image_url = 'https://ecimg.cafe24img.com/pg2495b61354611092/greeneat0419/web/product/medium/20260404/eb631446589811ef20e47631095561ce.png'
WHERE name = '오리고기 도시락';

-- 간장 우삼겹 도시락: 함박스테이크 이미지 → 실제 우삼겹 이미지
UPDATE products
SET image_url = 'https://ecimg.cafe24img.com/pg2495b61354611092/greeneat0419/web/product/medium/20260404/f195bc9c84cb23f6c923fb3a70609023.png'
WHERE name = '간장 우삼겹 도시락';

-- 강된장 비빔밥: 박스 이미지 → 실제 비빔밥 이미지
UPDATE products
SET image_url = 'https://ecimg.cafe24img.com/pg2495b61354611092/greeneat0419/web/product/medium/20260403/d0ab2375dd5bf3975233d189105cb30a.png'
WHERE name = '강된장 비빔밥';

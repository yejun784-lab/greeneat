-- 메뉴명 ↔ 이미지 불일치 전부 수정

-- 1. 불닭 덮밥: 닭갈비 이미지 → 불닭로제 이미지 (buldak 포함)
UPDATE products SET image_url = 'https://nbdpckerbphyfnjzqiqp.supabase.co/storage/v1/object/public/product-images/greeneat/hankki-buldakroze.png'
WHERE name = '한끼 도시락 - 불닭 덮밥';

-- 2. 로제 파스타: 불닭 이미지 → 크리미 파스타 unsplash
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&w=600&q=80'
WHERE name = '한끼 도시락 - 로제 파스타';

-- 3. 제주 장인의집 흑돼지 만두: 떡갈비 이미지 → 만두 이미지
UPDATE products SET image_url = 'https://nbdpckerbphyfnjzqiqp.supabase.co/storage/v1/object/public/product-images/greeneat/mandu.png'
WHERE name = '제주 장인의집 흑돼지 만두';

-- 4. 단백질 강화 도시락: 제육볶음 이미지 → 고단백 닭가슴살 볼
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&w=600&q=80'
WHERE name = '단백질 강화 도시락';

-- 5. 닭가슴살 퀴노아볼: 닭가슴살 도시락이랑 동일 이미지 → 퀴노아볼
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&w=600&q=80'
WHERE name = '닭가슴살 퀴노아볼';

-- 6. 그릭 샐러드: 채소 도시락이랑 동일 이미지 → 그릭 샐러드
UPDATE products SET image_url = 'https://images.unsplash.com/photo-1604909052743-94e838986d24?auto=format&w=600&q=80'
WHERE name = '그릭 샐러드';

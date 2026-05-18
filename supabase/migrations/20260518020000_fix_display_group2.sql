-- manrep 이미지 쓰는 상품 = 박스/컨테이너 스타일 → group 1
UPDATE products SET display_group = 1
WHERE name = '한끼 도시락 - 오징어 덮밥'
   OR name LIKE '%떡갈비%'
   OR name LIKE '%만렙%6종%'
   OR name LIKE '%6종%만렙%';

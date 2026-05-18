-- 박스/컨테이너 스타일 추가 (한끼 잡밥스테이크, 만렙 시리즈)
UPDATE products SET display_group = 1
WHERE name LIKE '%잡밥%'
   OR name LIKE '%8가지%'
   OR name LIKE '%골고루%'
   OR name LIKE '%만렙%';

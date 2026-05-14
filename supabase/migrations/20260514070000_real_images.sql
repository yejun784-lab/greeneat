-- 실제 그린잇(greeneatfood.com) 공홈 이미지로 교체
UPDATE products SET image_url = 'https://ecimg.cafe24img.com/pg2495b61354611092/greeneat0419/web/product/medium/20260403/3bf8fc08c7ae7127dc7ebf21cc3de314.png'
WHERE name LIKE '%한끼 도시락%' AND name NOT LIKE '%세트%';

UPDATE products SET image_url = 'https://ecimg.cafe24img.com/pg2495b61354611092/greeneat0419/web/product/medium/20260403/7aff2dc252faa58e557dbaef78b65c68.png'
WHERE name LIKE '%만렙 도시락 - 소불고기%';

UPDATE products SET image_url = 'https://ecimg.cafe24img.com/pg2495b61354611092/greeneat0419/web/product/medium/20260403/7aff2dc252faa58e557dbaef78b65c68.png'
WHERE name LIKE '%만렙 도시락%' AND name NOT LIKE '%소불고기%';

UPDATE products SET image_url = 'https://ecimg.cafe24img.com/pg2495b61354611092/greeneat0419/web/product/medium/20260410/de0fd2a103e8386bbba658ec77571d58.jpg'
WHERE name LIKE '%트라이얼%';

UPDATE products SET image_url = 'https://ecimg.cafe24img.com/pg2495b61354611092/greeneat0419/web/product/medium/20260514/5f44e67a5fd972ba27f26fc9edf51db4.jpg'
WHERE name LIKE '%8가지%' OR name LIKE '%골고루%';

UPDATE products SET image_url = 'https://ecimg.cafe24img.com/pg2495b61354611092/greeneat0419/web/product/medium/20260329/cd813f21ec2a4b9be22634200b16d3ef.png'
WHERE name LIKE '%쫀득 쿠키%';

UPDATE products SET image_url = 'https://ecimg.cafe24img.com/pg2495b61354611092/greeneat0419/web/product/medium/20260329/7a48b09b72b28328b37c93da05cccd09.png'
WHERE name LIKE '%수제만두%' OR name LIKE '%만두%';

UPDATE products SET image_url = 'https://ecimg.cafe24img.com/pg2495b61354611092/greeneat0419/web/product/medium/20260415/a23d3e01664ebc4b42a195e1ce6fa82f.png'
WHERE name LIKE '%그래놀라%';

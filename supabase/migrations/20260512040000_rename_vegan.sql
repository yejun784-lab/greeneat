-- 카테고리명 채식 → 비건
update product_categories
  set name        = '비건',
      description = '채소와 곡물로 만드는 비건 밀키트'
  where slug = 'vegan';

-- 상품명 채식 → 비건
update products
  set name        = '비건 두부스테이크',
      description = '두부를 활용한 든든한 비건 메인 디쉬. 버섯 그레이비 소스와 함께'
  where name = '채식 두부스테이크';

update products
  set name        = '비건 카레',
      description = '각종 채소와 코코넛밀크로 만드는 부드러운 인도식 비건 카레'
  where name = '채식 카레';

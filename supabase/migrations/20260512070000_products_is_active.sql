-- products 테이블에 is_active 컬럼 추가
alter table products
  add column if not exists is_active boolean not null default true;

-- 기존 상품은 모두 활성 상태로 설정
update products set is_active = true where is_active is null;

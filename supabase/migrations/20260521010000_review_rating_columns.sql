-- products 테이블에 별점 집계 컬럼 추가
alter table products
  add column if not exists avg_rating numeric(3,2) default 0,
  add column if not exists review_count int default 0;

-- 리뷰 집계 업데이트 함수
create or replace function update_product_rating()
returns trigger language plpgsql as $$
declare
  p_id uuid;
begin
  p_id := coalesce(new.product_id, old.product_id);
  update products set
    avg_rating   = coalesce((select round(avg(rating)::numeric, 2) from reviews where product_id = p_id), 0),
    review_count = (select count(*) from reviews where product_id = p_id)
  where id = p_id;
  return null;
end;
$$;

-- 트리거 (insert/update/delete 모두 처리)
drop trigger if exists trg_update_product_rating on reviews;
create trigger trg_update_product_rating
  after insert or update or delete on reviews
  for each row execute function update_product_rating();

-- 기존 데이터 초기화
update products p set
  avg_rating   = coalesce((select round(avg(r.rating)::numeric, 2) from reviews r where r.product_id = p.id), 0),
  review_count = (select count(*) from reviews r where r.product_id = p.id);

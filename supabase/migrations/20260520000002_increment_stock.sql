-- 재고 복구 함수 (주문 취소 시 사용)
create or replace function increment_stock(p_product_id uuid, p_quantity int)
returns void language plpgsql as $$
begin
  update products
  set stock = stock + p_quantity
  where id = p_product_id;
end;
$$;

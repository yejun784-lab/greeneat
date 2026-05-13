-- ── 재고 원자적 차감 함수 ────────────────────────────────────────────────────
-- Race condition 없이 재고를 안전하게 차감합니다.
create or replace function decrement_stock(p_product_id uuid, p_quantity int)
returns void
language plpgsql
security definer
as $$
begin
  update products
  set stock = stock - p_quantity
  where id = p_product_id
    and stock >= p_quantity;

  if not found then
    raise exception '재고가 부족합니다. (product_id: %)', p_product_id;
  end if;
end;
$$;

-- ── orders 테이블에 delivery_date 컬럼 추가 ──────────────────────────────────
alter table orders
  add column if not exists delivery_date date;

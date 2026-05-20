-- 주문 테이블에 배송 추적 컬럼 추가
alter table orders
  add column if not exists tracking_number text,
  add column if not exists carrier         text default 'CJ대한통운';

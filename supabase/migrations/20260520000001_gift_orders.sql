-- 선물하기 필드
alter table orders
  add column if not exists is_gift        boolean  default false,
  add column if not exists gift_message   text,
  add column if not exists recipient_name text,
  add column if not exists recipient_phone text;

-- 1. orders 테이블에 선물하기 컬럼 추가
alter table orders
  add column if not exists is_gift boolean not null default false,
  add column if not exists gift_recipient_name text,
  add column if not exists gift_recipient_phone text,
  add column if not exists gift_recipient_address text,
  add column if not exists gift_message text;

-- 2. profiles 테이블에 role 컬럼 추가 (어드민 권한)
alter table profiles
  add column if not exists role text not null default 'user'
  check (role in ('user', 'admin'));

-- 3. 첫 번째 유저를 어드민으로 설정 (선택적 — 실제 uuid로 교체)
-- update profiles set role = 'admin' where id = 'YOUR_USER_UUID';

-- 4. orders 테이블 RLS: 선물 주문도 본인 주문으로 조회 가능
-- (기존 RLS 정책은 유지, 신규 컬럼은 자동 포함됨)

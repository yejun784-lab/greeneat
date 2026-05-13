-- ── 포인트 ────────────────────────────────────────────────────────
create table if not exists points (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  amount      int  not null,                          -- 양수=적립, 음수=사용
  reason      text not null,                          -- 예: '주문 적립', '포인트 사용', '친구 초대'
  order_id    uuid references orders(id) on delete set null,
  created_at  timestamptz not null default now()
);

alter table points enable row level security;
create policy "users_read_own_points" on points for select using (auth.uid() = user_id);
create policy "service_insert_points"  on points for insert with check (true);

-- ── 리퍼럴 ────────────────────────────────────────────────────────
alter table profiles
  add column if not exists referral_code text unique,
  add column if not exists referred_by   uuid references auth.users(id) on delete set null,
  add column if not exists point_balance int not null default 0;

-- 기존 유저 referral_code 발급 (8자리 랜덤 대문자)
update profiles
  set referral_code = upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 8))
  where referral_code is null;

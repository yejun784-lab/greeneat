-- 쿠폰 정의 테이블
create table if not exists coupons (
  id           uuid primary key default gen_random_uuid(),
  code         text not null unique,
  description  text not null,
  discount_type  text not null check (discount_type in ('percent', 'fixed')),
  discount_value numeric(10,2) not null,
  min_order_amount numeric(10,2) not null default 0,
  expires_at   timestamptz,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);

-- 유저 쿠폰 지갑
create table if not exists user_coupons (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  coupon_id  uuid not null references coupons(id) on delete cascade,
  used_at    timestamptz,
  order_id   uuid references orders(id) on delete set null,
  created_at timestamptz not null default now(),
  unique(user_id, coupon_id)
);

alter table user_coupons enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where tablename='user_coupons' and policyname='유저는 자신의 쿠폰만 조회') then
    create policy "유저는 자신의 쿠폰만 조회" on user_coupons for select using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where tablename='user_coupons' and policyname='서비스가 쿠폰 발급') then
    create policy "서비스가 쿠폰 발급" on user_coupons for insert with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename='user_coupons' and policyname='유저는 자신의 쿠폰 업데이트') then
    create policy "유저는 자신의 쿠폰 업데이트" on user_coupons for update using (auth.uid() = user_id);
  end if;
end $$;

-- 기존 테이블에 누락된 컬럼 보정 (idempotent)
alter table coupons add column if not exists description      text not null default '';
alter table coupons add column if not exists discount_type    text not null default 'percent';
alter table coupons add column if not exists discount_value   numeric(10,2) not null default 0;
alter table coupons add column if not exists min_order_amount numeric(10,2) not null default 0;
alter table coupons add column if not exists expires_at       timestamptz;
alter table coupons add column if not exists is_active        boolean not null default true;

-- 기존 check constraint 제거 후 재정의
alter table coupons drop constraint if exists coupons_discount_type_check;

-- 기존 discount_type 값 정규화 (이전 스키마 호환)
update coupons set discount_type = 'percent' where discount_type not in ('percent', 'fixed');
update coupons set discount_type = 'fixed'   where discount_type in ('amount', 'flat', 'won');

-- 새 constraint 추가
alter table coupons add constraint coupons_discount_type_check
  check (discount_type in ('percent', 'fixed'));

-- 쿠폰은 누구나 조회 (코드 등록 시 필요)
alter table coupons enable row level security;
do $$ begin
  if not exists (
    select 1 from pg_policies where tablename='coupons' and policyname='쿠폰 공개 조회'
  ) then
    create policy "쿠폰 공개 조회" on coupons for select using (true);
  end if;
end $$;

-- 시드 데이터
insert into coupons (code, description, discount_type, discount_value, min_order_amount, expires_at) values
  ('WELCOME10', '신규 가입 10% 할인', 'percent', 10, 10000, now() + interval '1 year'),
  ('GREENEAT5K', '5,000원 즉시 할인', 'fixed', 5000, 30000, now() + interval '6 months'),
  ('HEALTH20', '건강식 20% 할인', 'percent', 20, 20000, now() + interval '3 months')
on conflict (code) do nothing;

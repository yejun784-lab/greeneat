-- 재입고 알림 신청 테이블
create table if not exists restock_alerts (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, product_id)
);

alter table restock_alerts enable row level security;

create policy "유저는 자신의 알림만 관리"
  on restock_alerts for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

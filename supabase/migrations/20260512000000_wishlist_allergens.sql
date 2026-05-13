-- ── 찜 목록 ────────────────────────────────────────────────────────
create table if not exists wishlists (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, product_id)
);

alter table wishlists enable row level security;

create policy "users_manage_own_wishlists"
  on wishlists for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ── 알레르기 정보 ─────────────────────────────────────────────────
alter table products
  add column if not exists allergens text[] not null default '{}';

-- 알레르기 데이터 (주요 메뉴)
update products set allergens = ARRAY['gluten','soy','sesame']
  where name ilike '%비빔밥%';

update products set allergens = ARRAY['soy','sesame']
  where name ilike '%불고기%';

update products set allergens = ARRAY['soy']
  where name ilike '%된장찌개%';

update products set allergens = ARRAY['gluten','soy','pork']
  where name ilike '%부대찌개%';

update products set allergens = ARRAY['gluten','dairy']
  where name ilike '%볼로네제%' or name ilike '%파스타%';

update products set allergens = ARRAY['gluten','dairy']
  where name ilike '%리조또%' or name ilike '%크림%';

update products set allergens = ARRAY['soy']
  where name ilike '%두부%';

update products set allergens = ARRAY['egg','dairy']
  where name ilike '%샐러드%';

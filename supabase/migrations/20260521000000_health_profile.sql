-- 건강 문진표 컬럼 추가
alter table profiles
  add column if not exists age integer,
  add column if not exists gender text check (gender in ('male', 'female', 'other')),
  add column if not exists height_cm integer,
  add column if not exists weight_kg integer,
  add column if not exists health_goal text check (health_goal in ('diet', 'muscle', 'maintain', 'health')) default 'maintain',
  add column if not exists activity_level text check (activity_level in ('low', 'medium', 'high')) default 'medium',
  add column if not exists diet_type text check (diet_type in ('none', 'vegetarian', 'vegan', 'halal')) default 'none',
  add column if not exists onboarding_completed boolean not null default false;

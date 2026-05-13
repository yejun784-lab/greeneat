-- profiles에 알레르기 프로필 컬럼 추가
alter table profiles
  add column if not exists allergen_profile text[] not null default '{}';

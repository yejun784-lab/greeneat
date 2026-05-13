-- ── 회원가입 시 profiles 행 자동 생성 트리거 ─────────────────────────────────
-- Supabase Auth에서 새 유저가 생성되면 profiles 테이블에 행을 자동으로 삽입합니다.
-- signUp()의 options.data(name, nutrition_goal, referred_by)도 함께 저장됩니다.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_referral_code text;
begin
  -- 고유 레퍼럴 코드 생성 (8자 대문자+숫자)
  loop
    new_referral_code := upper(substring(md5(random()::text) from 1 for 8));
    exit when not exists (
      select 1 from public.profiles where referral_code = new_referral_code
    );
  end loop;

  insert into public.profiles (
    id,
    name,
    nutrition_goal,
    referral_code,
    point_balance,
    role,
    created_at
  )
  values (
    new.id,
    new.raw_user_meta_data ->> 'name',
    coalesce(new.raw_user_meta_data ->> 'nutrition_goal', 'balanced'),
    new_referral_code,
    0,
    'user',
    now()
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- 트리거가 이미 있으면 먼저 삭제 후 재생성
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

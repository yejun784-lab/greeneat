-- ── 리뷰 테이블 ──────────────────────────────────────────────
CREATE TABLE reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  rating int NOT NULL CHECK (rating BETWEEN 1 AND 5),
  content text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews_select" ON reviews FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "reviews_insert" ON reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_update" ON reviews FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "reviews_delete" ON reviews FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- ── 레시피 스텝 테이블 ─────────────────────────────────────────
CREATE TABLE recipe_steps (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  step_number int NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  duration_minutes int,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE recipe_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "recipe_steps_select" ON recipe_steps FOR SELECT TO anon, authenticated USING (true);

-- ── 쿠폰 테이블 ──────────────────────────────────────────────
CREATE TABLE coupons (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  code text UNIQUE NOT NULL,
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value numeric NOT NULL,
  min_order_amount numeric DEFAULT 0,
  max_uses int,
  used_count int DEFAULT 0,
  expires_at timestamptz,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "coupons_select" ON coupons FOR SELECT TO authenticated USING (is_active = true);

-- ── 쿠폰 시드 데이터 ────────────────────────────────────────────
INSERT INTO coupons (code, discount_type, discount_value, min_order_amount, max_uses) VALUES
  ('WELCOME10', 'percentage', 10, 20000, 1000),
  ('FIRST5000', 'fixed', 5000, 30000, 500),
  ('GREEN20', 'percentage', 20, 50000, 200);

-- ── 레시피 스텝 시드 데이터 ─────────────────────────────────────
INSERT INTO recipe_steps (product_id, step_number, title, description, duration_minutes)
SELECT p.id, s.step_number, s.title, s.description, s.duration_minutes
FROM products p
JOIN (VALUES
  ('부대찌개', 1, '재료 손질', '스팸과 소시지는 먹기 좋은 크기로 썰고, 김치는 한입 크기로 자릅니다. 대파는 어슷썰기 합니다.', 5),
  ('부대찌개', 2, '육수 내기', '냄비에 물 500ml와 멸치, 다시마를 넣고 중불에서 10분간 육수를 냅니다.', 10),
  ('부대찌개', 3, '양념 넣기', '육수에 고추장 1.5큰술, 고춧가루 1큰술, 간장 1큰술을 넣고 잘 섞습니다.', 3),
  ('부대찌개', 4, '재료 끓이기', '손질한 재료를 모두 넣고 중불에서 10분간 끓입니다.', 10),
  ('부대찌개', 5, '라면 추가', '라면 사리와 대파를 넣고 면이 익을 때까지 3분 더 끓입니다.', 3),

  ('된장찌개', 1, '재료 준비', '두부는 1.5cm 크기로 깍둑썰고, 애호박은 반달 모양, 버섯은 먹기 좋게 찢습니다.', 5),
  ('된장찌개', 2, '육수 만들기', '냄비에 멸치와 다시마로 기본 육수 400ml를 냅니다.', 8),
  ('된장찌개', 3, '된장 풀기', '육수가 끓으면 된장 2큰술을 풀고 다진 마늘 1작은술을 넣습니다.', 2),
  ('된장찌개', 4, '채소 넣기', '애호박, 버섯, 양파를 넣고 5분간 끓입니다.', 5),
  ('된장찌개', 5, '두부 마무리', '두부를 넣고 2분 더 끓인 후 파를 올려 완성합니다.', 2),

  ('불고기', 1, '양념 만들기', '간장 3큰술, 설탕 1큰술, 참기름 1큰술, 다진 마늘, 생강, 후추를 섞어 양념을 만듭니다.', 5),
  ('불고기', 2, '고기 재우기', '얇게 썬 소고기에 양념을 넣고 배즙과 함께 30분 이상 재웁니다.', 30),
  ('불고기', 3, '채소 준비', '양파는 채썰고 버섯은 먹기 좋은 크기로 준비합니다.', 3),
  ('불고기', 4, '볶기', '달군 팬에 재운 고기와 채소를 함께 넣고 센불에서 5분간 볶습니다.', 5),
  ('불고기', 5, '마무리', '참깨와 파를 뿌려 접시에 담아 완성합니다.', 2),

  ('비빔밥', 1, '밥 짓기', '쌀을 씻고 동량의 물로 밥을 짓습니다. 뜸은 충분히 들입니다.', 30),
  ('비빔밥', 2, '나물 준비', '시금치, 도라지, 콩나물을 각각 데쳐서 간장, 참기름, 소금으로 무칩니다.', 15),
  ('비빔밥', 3, '고기 볶기', '다진 소고기를 간장, 설탕, 마늘로 양념해 볶습니다.', 7),
  ('비빔밥', 4, '계란 후라이', '계란을 프라이팬에 반숙으로 익힙니다.', 3),
  ('비빔밥', 5, '완성', '그릇에 밥을 담고 나물, 고기, 계란을 올린 뒤 고추장과 참기름을 넣고 비빕니다.', 2),

  ('파스타 카르보나라', 1, '파스타 삶기', '끓는 소금물에 파스타를 패키지 지시대로 1분 덜 삶습니다. 면수 1컵을 남겨둡니다.', 10),
  ('파스타 카르보나라', 2, '소스 준비', '계란 노른자 2개에 파마산 치즈 50g, 후추를 섞어 소스를 만듭니다.', 3),
  ('파스타 카르보나라', 3, '베이컨 굽기', '팬치에타나 베이컨을 바삭하게 볶습니다.', 5),
  ('파스타 카르보나라', 4, '소스 버무리기', '불을 끈 상태에서 면, 소스, 면수를 넣고 빠르게 버무립니다.', 3),
  ('파스타 카르보나라', 5, '완성', '접시에 담고 파마산 치즈와 후추를 듬뿍 뿌립니다.', 1),

  ('토마토 볼로네제', 1, '소프리토 만들기', '양파, 당근, 셀러리를 잘게 다져 올리브오일에 10분간 볶습니다.', 10),
  ('토마토 볼로네제', 2, '고기 볶기', '다진 소고기를 넣고 갈색이 될 때까지 센불에 볶습니다.', 8),
  ('토마토 볼로네제', 3, '토마토 소스', '토마토 캔, 토마토 페이스트, 와인을 넣고 약불에서 30분 졸입니다.', 30),
  ('토마토 볼로네제', 4, '파스타 삶기', '끓는 소금물에 스파게티를 알 덴테로 삶습니다.', 10),
  ('토마토 볼로네제', 5, '완성', '파스타와 소스를 버무려 파마산 치즈를 뿌려 완성합니다.', 2),

  ('크림 리조또', 1, '육수 준비', '닭육수나 채소육수를 따뜻하게 데워 준비합니다.', 5),
  ('크림 리조또', 2, '쌀 볶기', '버터와 양파를 볶다가 아르보리오 쌀을 넣고 투명해질 때까지 볶습니다.', 5),
  ('크림 리조또', 3, '육수 추가', '육수를 한 국자씩 추가하며 전분이 풀릴 때까지 저어가며 익힙니다.', 18),
  ('크림 리조또', 4, '버터 마운팅', '불을 끄고 버터와 파마산 치즈를 넣어 크리미하게 완성합니다.', 3),
  ('크림 리조또', 5, '플레이팅', '접시에 담고 파마산 치즈, 후추, 허브를 올립니다.', 2),

  ('그릭 샐러드', 1, '채소 준비', '오이, 토마토는 큼직하게 썰고, 양파는 링으로 썹니다.', 5),
  ('그릭 샐러드', 2, '드레싱 만들기', '올리브오일 3큰술, 레몬즙 1큰술, 오레가노, 소금, 후추를 섞습니다.', 2),
  ('그릭 샐러드', 3, '섞기', '채소, 블랙 올리브, 페타 치즈를 그릇에 담습니다.', 2),
  ('그릭 샐러드', 4, '드레싱 뿌리기', '드레싱을 골고루 뿌리고 살짝 버무립니다.', 1),

  ('닭가슴살 퀴노아볼', 1, '퀴노아 준비', '퀴노아를 씻어 2배의 물로 15분간 익힙니다.', 15),
  ('닭가슴살 퀴노아볼', 2, '닭가슴살 굽기', '닭가슴살을 소금, 후추로 간하고 올리브오일에 앞뒤로 굽습니다.', 10),
  ('닭가슴살 퀴노아볼', 3, '채소 준비', '아보카도, 방울토마토, 루꼴라를 준비합니다.', 3),
  ('닭가슴살 퀴노아볼', 4, '드레싱', '레몬즙, 올리브오일, 허니 머스타드를 섞어 드레싱을 만듭니다.', 2),
  ('닭가슴살 퀴노아볼', 5, '완성', '그릇에 퀴노아를 담고 닭가슴살, 채소를 올려 드레싱을 뿌립니다.', 1),

  ('코브 샐러드', 1, '닭고기 준비', '닭가슴살을 삶거나 구워 먹기 좋은 크기로 썹니다.', 10),
  ('코브 샐러드', 2, '토핑 준비', '베이컨을 바삭하게 굽고, 계란은 완숙으로 삶아 반으로 자릅니다.', 10),
  ('코브 샐러드', 3, '채소 깔기', '그릇 바닥에 로메인 상추를 깔고 토핑을 줄맞춰 얹습니다.', 3),
  ('코브 샐러드', 4, '완성', '블루치즈 드레싱 또는 시저 드레싱을 뿌려 완성합니다.', 2),

  ('비건 두부스테이크', 1, '두부 준비', '두부를 키친타월로 눌러 물기를 제거한 후 2cm 두께로 썹니다.', 5),
  ('비건 두부스테이크', 2, '밑간', '소금, 후추, 마늘파우더로 두부에 밑간을 합니다.', 3),
  ('비건 두부스테이크', 3, '굽기', '달군 팬에 올리브오일을 두르고 앞뒤로 각 4분씩 황금빛이 될 때까지 굽습니다.', 8),
  ('비건 두부스테이크', 4, '소스', '간장 2큰술, 생강즙, 참기름으로 소스를 만들어 곁들입니다.', 2),
  ('비건 두부스테이크', 5, '플레이팅', '두부 위에 소스를 뿌리고 파와 참깨를 올려 완성합니다.', 1),

  ('비건 카레', 1, '채소 손질', '감자, 당근, 양파는 한입 크기로 썰고 마늘은 다집니다.', 7),
  ('비건 카레', 2, '볶기', '냄비에 오일을 두르고 양파, 마늘을 볶다가 채소를 넣습니다.', 5),
  ('비건 카레', 3, '카레 끓이기', '물 400ml와 카레 루를 넣고 채소가 익을 때까지 15분간 끓입니다.', 15),
  ('비건 카레', 4, '두유 추가', '두유 100ml를 넣어 크리미하게 만듭니다.', 3),
  ('비건 카레', 5, '완성', '밥 위에 카레를 담고 파슬리를 뿌려 완성합니다.', 1)
) AS s(food_name, step_number, title, description, duration_minutes)
ON p.name = s.food_name;

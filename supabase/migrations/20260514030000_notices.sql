-- ── 공지사항 / 이벤트 테이블 ─────────────────────────────────
CREATE TABLE notices (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  type text NOT NULL DEFAULT 'notice' CHECK (type IN ('notice', 'event', 'promotion')),
  starts_at date,
  ends_at date,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 공개 읽기 허용
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notices_select" ON notices FOR SELECT USING (true);
CREATE POLICY "notices_admin_all" ON notices FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- 샘플 데이터
INSERT INTO notices (title, content, type, starts_at, ends_at) VALUES
  ('🎉 GreenEat 오픈 기념 20% 할인!', '그린잇 오픈을 기념해 모든 밀키트 20% 할인 행사를 진행합니다. 지금 바로 장바구니를 채워보세요!', 'promotion', '2026-05-01', '2026-05-31'),
  ('건강한 5월, 비건 밀키트 특가!', '5월 한 달간 비건 밀키트 전 품목 15% 특가 진행! 건강과 환경을 동시에 챙겨보세요.', 'event', '2026-05-01', '2026-05-31'),
  ('구독 첫 달 무료 배송 혜택', '구독 플랜 가입 시 첫 달 배송비가 전액 무료입니다. 지금 구독을 시작하세요!', 'promotion', null, null),
  ('친구 초대 시 포인트 2배 지급 이벤트', '5월 한 달간 친구 초대 시 기존 1,000P에서 2,000P로 두 배 지급됩니다!', 'event', '2026-05-01', '2026-05-31'),
  ('개인정보 처리방침 업데이트 안내', '2026년 6월 1일부터 개인정보 처리방침이 일부 변경됩니다. 자세한 내용은 고객센터를 통해 문의해주세요.', 'notice', null, null);

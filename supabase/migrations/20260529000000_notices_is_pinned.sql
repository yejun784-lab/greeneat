-- notices 테이블에 is_pinned 컬럼 추가 (필독 공지 표시용)
ALTER TABLE notices ADD COLUMN IF NOT EXISTS is_pinned boolean DEFAULT false;

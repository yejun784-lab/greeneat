-- reviews 테이블에 이미지 URL 배열 추가
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}';

-- review-images storage 버킷
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'review-images',
  'review-images',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 인증된 유저만 업로드 (본인 경로에만)
CREATE POLICY "review_images_upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'review-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- 누구나 조회 가능
CREATE POLICY "review_images_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'review-images');

-- 본인 이미지만 삭제 가능
CREATE POLICY "review_images_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'review-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

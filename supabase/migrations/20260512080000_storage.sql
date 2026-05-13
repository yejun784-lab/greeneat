-- Supabase Storage: 상품 이미지 버킷 생성
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- 공개 읽기
create policy "product_images_public_read"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- 어드민만 업로드/삭제 (profiles.role = 'admin')
create policy "product_images_admin_insert"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and auth.uid() in (
      select id from profiles where role = 'admin'
    )
  );

create policy "product_images_admin_delete"
  on storage.objects for delete
  using (
    bucket_id = 'product-images'
    and auth.uid() in (
      select id from profiles where role = 'admin'
    )
  );

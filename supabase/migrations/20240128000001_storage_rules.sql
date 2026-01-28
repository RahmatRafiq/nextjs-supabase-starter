-- Enable RLS for storage (usually enabled by default, but good to ensure)
-- Note: 'storage.objects' is the table for Supabase Storage

-- 1. Allow Public Read Access (untuk menampilkan gambar)
create policy "Public Access"
on storage.objects for select
to public
using ( bucket_id = 'article-images' );

-- 2. Allow Authenticated Uploads (untuk admin upload)
create policy "Authenticated Upload"
on storage.objects for insert
to authenticated
with check ( bucket_id = 'article-images' );

-- 3. Allow Authenticated Updates (untuk ganti gambar)
create policy "Authenticated Update"
on storage.objects for update
to authenticated
using ( bucket_id = 'article-images' );

-- 4. Allow Authenticated Deletes (untuk hapus gambar)
create policy "Authenticated Delete"
on storage.objects for delete
to authenticated
using ( bucket_id = 'article-images' );

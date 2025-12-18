
-- STORAGE POLICIES
-- Allow public access to storage for the demo
-- Note: In a real app, you'd want restrictive policies based on user auth

-- 1. Allow public select (view images)
create policy "Public Select"
on storage.objects for select
using ( bucket_id in ('product-images', 'category-images') );

-- 2. Allow public insert (upload images) - This fixes "violates row-level security policy"
create policy "Public Insert"
on storage.objects for insert
with check ( bucket_id in ('product-images', 'category-images') );

-- 3. Allow public update
create policy "Public Update"
on storage.objects for update
using ( bucket_id in ('product-images', 'category-images') );

-- 4. Allow public delete
create policy "Public Delete"
on storage.objects for delete
using ( bucket_id in ('product-images', 'category-images') );

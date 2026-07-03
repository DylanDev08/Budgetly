insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', false, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('assistant-uploads', 'assistant-uploads', false, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('receipts', 'receipts', false, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "budgetly_storage_owner_select" on storage.objects;
create policy "budgetly_storage_owner_select" on storage.objects
for select
using (
  bucket_id in ('avatars', 'assistant-uploads', 'receipts')
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "budgetly_storage_owner_insert" on storage.objects;
create policy "budgetly_storage_owner_insert" on storage.objects
for insert
with check (
  bucket_id in ('avatars', 'assistant-uploads', 'receipts')
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "budgetly_storage_owner_update" on storage.objects;
create policy "budgetly_storage_owner_update" on storage.objects
for update
using (
  bucket_id in ('avatars', 'assistant-uploads', 'receipts')
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id in ('avatars', 'assistant-uploads', 'receipts')
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "budgetly_storage_owner_delete" on storage.objects;
create policy "budgetly_storage_owner_delete" on storage.objects
for delete
using (
  bucket_id in ('avatars', 'assistant-uploads', 'receipts')
  and (storage.foldername(name))[1] = auth.uid()::text
);

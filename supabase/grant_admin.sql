-- Run in Supabase SQL Editor to allow a dashboard account to list all users.
-- RLS already permits admins to read every row in public.users.

update public.users
set role = 'admin',
    updated_at = now()
where lower(email) = lower('YOUR_ADMIN_EMAIL@example.com');

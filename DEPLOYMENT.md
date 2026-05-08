## Deployment Guide

### 1) Environment Variables

Set these in Vercel/Netlify:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_APP_URL` (frontend URL used for magic link redirect)
- `VITE_N8N_BASE_URL` (for example: `https://n8n.yourdomain.com/webhook`)
- `VITE_N8N_TRIGGER_AUDIT_PATH` (optional, defaults to `/trigger-audit`)
- Optional legacy fallback: `VITE_N8N_WEBHOOK_URL` (single full webhook URL)

### 2) Supabase Production

1. Run `supabase/schema.sql` in the Supabase SQL editor for the production project.
2. Confirm `on_auth_user_created` trigger exists on `auth.users`.
3. Confirm RLS is enabled for all tables and policies are active.
4. Verify realtime publication includes:
   - `public.onboarding_flows`
   - `public.audit_reports`

### 3) Build and Host

- Vercel:
  - Framework: Vite
  - Build command: `npm run build`
  - Output directory: `dist`
- Netlify:
  - Build command: `npm run build`
  - Publish directory: `dist`

### 4) n8n + Stripe Integration Checks

1. Stripe webhook should upsert `public.users` and insert `public.payments`.
2. n8n should create/update `public.onboarding_flows`.
3. Clicking "Trigger Audit" in the dashboard should call `POST /trigger-audit` with:
   - `source: "manual"`
   - `user_id: "<uuid>"`
   - `days_without_sales: 90`

### 5) Smoke Test Checklist

- Magic link login works for pre-provisioned billing email.
- `auth_user_id` gets linked after first login.
- User can view only their records.
- Admin can open `Admin Logs` and view all workflow logs.
- Onboarding completion emits a toast and refreshes reports.

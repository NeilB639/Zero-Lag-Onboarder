create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role' and typnamespace = 'public'::regnamespace) then
    create type public.user_role as enum ('admin', 'user');
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'onboarding_status' and typnamespace = 'public'::regnamespace) then
    create type public.onboarding_status as enum ('queued', 'in_progress', 'completed', 'failed', 'retrying');
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'log_level' and typnamespace = 'public'::regnamespace) then
    create type public.log_level as enum ('info', 'warn', 'error');
  end if;
end $$;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  stripe_customer_id text unique,
  email text not null unique,
  full_name text,
  role public.user_role not null default 'user',
  plan_code text,
  onboarding_status public.onboarding_status not null default 'queued', -- maintained by n8n
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  stripe_event_id text not null unique,
  stripe_payment_intent_id text,
  stripe_checkout_session_id text,
  stripe_invoice_id text,
  stripe_customer_id text,
  user_id uuid references public.users(id) on delete set null,
  email text not null,
  currency text not null,
  amount_cents bigint not null check (amount_cents >= 0),
  product_code text,
  plan_code text,
  metadata jsonb not null default '{}'::jsonb,
  status text not null,
  paid_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.audit_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  report_name text not null,
  total_products integer not null default 0,
  dead_sku_count integer not null default 0,
  total_trapped_capital numeric(14,2) not null default 0,
  currency text not null default 'USD',
  days_without_sales integer not null default 90,
  context jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  google_sheet_url text,
  google_sheet_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.dead_skus (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.audit_reports(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  sku text not null,
  product_name text not null,
  inventory integer not null default 0,
  sales_price numeric(12,2) not null default 0,
  trapped_capital numeric(14,2) not null default 0,
  days_without_sales integer not null default 0,
  last_sale_date date,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.onboarding_flows (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  payment_id uuid references public.payments(id) on delete set null,
  source text not null default 'stripe',
  workflow_version text not null default 'v1',
  status public.onboarding_status not null default 'queued',
  started_at timestamptz,
  finished_at timestamptz,
  last_error text,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.email_logs (
  id uuid primary key default gen_random_uuid(),
  flow_id uuid references public.onboarding_flows(id) on delete set null,
  user_id uuid references public.users(id) on delete set null,
  provider text not null default 'gmail',
  to_email text not null,
  subject text not null,
  template_key text not null default 'welcome_v1',
  payload jsonb not null default '{}'::jsonb,
  provider_message_id text,
  status text not null default 'queued',
  error_message text,
  attempts int not null default 0,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.workflow_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  flow_id uuid references public.onboarding_flows(id) on delete set null,
  report_id uuid references public.audit_reports(id) on delete set null,
  level public.log_level not null default 'info',
  status text not null,
  message text not null,
  source text not null default 'n8n',
  execution_time_ms integer,
  context jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.integrations (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  provider text not null,
  enabled boolean not null default false,
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- compatibility migration for existing older schemas
alter table public.users add column if not exists role public.user_role not null default 'user';
alter table public.users add column if not exists onboarding_status public.onboarding_status not null default 'queued';
alter table public.users add column if not exists plan_code text;
alter table public.users add column if not exists updated_at timestamptz not null default now();

alter table public.audit_reports add column if not exists user_id uuid references public.users(id) on delete cascade;
alter table public.audit_reports add column if not exists currency text not null default 'USD';
alter table public.audit_reports add column if not exists days_without_sales integer not null default 90;
alter table public.audit_reports add column if not exists context jsonb not null default '{}'::jsonb;
alter table public.audit_reports add column if not exists metadata jsonb not null default '{}'::jsonb;
alter table public.audit_reports add column if not exists updated_at timestamptz not null default now();

alter table public.dead_skus add column if not exists user_id uuid references public.users(id) on delete cascade;
alter table public.dead_skus add column if not exists days_without_sales integer not null default 0;
alter table public.dead_skus add column if not exists metadata jsonb not null default '{}'::jsonb;

alter table public.workflow_logs add column if not exists user_id uuid references public.users(id) on delete set null;
alter table public.workflow_logs add column if not exists flow_id uuid references public.onboarding_flows(id) on delete set null;
alter table public.workflow_logs add column if not exists level public.log_level not null default 'info';
alter table public.workflow_logs add column if not exists source text not null default 'n8n';
alter table public.workflow_logs add column if not exists execution_time_ms integer;
alter table public.workflow_logs add column if not exists context jsonb not null default '{}'::jsonb;
alter table public.workflow_logs add column if not exists metadata jsonb not null default '{}'::jsonb;
alter table public.workflow_logs add column if not exists updated_at timestamptz not null default now();

-- backfill new columns from legacy columns where possible
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'audit_reports' and column_name = 'created_by'
  ) then
    update public.audit_reports ar
    set user_id = u.id
    from public.users u
    where ar.user_id is null
      and u.auth_user_id = ar.created_by;
  end if;
end $$;

update public.dead_skus ds
set user_id = ar.user_id
from public.audit_reports ar
where ds.user_id is null
  and ds.report_id = ar.id;

update public.workflow_logs wl
set user_id = ar.user_id
from public.audit_reports ar
where wl.user_id is null
  and wl.report_id = ar.id;

-- bridge auth.users -> public.users on first login (magic link)
create or replace function public.on_auth_user_created()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.users u
  set auth_user_id = new.id,
      updated_at = now()
  where lower(u.email) = lower(new.email)
    and u.auth_user_id is null;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.on_auth_user_created();

create index if not exists idx_users_stripe_customer on public.users(stripe_customer_id);
create index if not exists idx_users_onboarding_status on public.users(onboarding_status);
create index if not exists idx_payments_customer_created on public.payments(stripe_customer_id, created_at desc);
create index if not exists idx_payments_user_id on public.payments(user_id);
create index if not exists idx_reports_user_id_created on public.audit_reports(user_id, created_at desc);
create index if not exists idx_dead_skus_report_id on public.dead_skus(report_id);
create index if not exists idx_dead_skus_user_id on public.dead_skus(user_id);
create index if not exists idx_flows_user_status on public.onboarding_flows(user_id, status);
create index if not exists idx_logs_flow_created on public.workflow_logs(flow_id, created_at desc);
create index if not exists idx_email_logs_flow_created on public.email_logs(flow_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_users_updated_at on public.users;
create trigger trg_users_updated_at
before update on public.users
for each row execute function public.set_updated_at();

drop trigger if exists trg_reports_updated_at on public.audit_reports;
create trigger trg_reports_updated_at
before update on public.audit_reports
for each row execute function public.set_updated_at();

drop trigger if exists trg_flows_updated_at on public.onboarding_flows;
create trigger trg_flows_updated_at
before update on public.onboarding_flows
for each row execute function public.set_updated_at();

drop trigger if exists trg_workflow_logs_updated_at on public.workflow_logs;
create trigger trg_workflow_logs_updated_at
before update on public.workflow_logs
for each row execute function public.set_updated_at();

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'audit_reports'
  ) then
    alter publication supabase_realtime add table public.audit_reports;
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'onboarding_flows'
  ) then
    alter publication supabase_realtime add table public.onboarding_flows;
  end if;
end $$;

alter table public.users enable row level security;
alter table public.payments enable row level security;
alter table public.audit_reports enable row level security;
alter table public.dead_skus enable row level security;
alter table public.onboarding_flows enable row level security;
alter table public.workflow_logs enable row level security;
alter table public.email_logs enable row level security;
alter table public.integrations enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users u
    where u.auth_user_id = auth.uid()
      and u.role = 'admin'
  );
$$;

drop policy if exists "users select own profile" on public.users;
create policy "users select own profile"
on public.users for select
to authenticated
using (auth.uid() = auth_user_id or public.is_admin());

drop policy if exists "users update own profile" on public.users;
create policy "users update own profile"
on public.users for update
to authenticated
using (auth.uid() = auth_user_id)
with check (auth.uid() = auth_user_id);

drop policy if exists "reports read own_or_admin" on public.audit_reports;
create policy "reports read own_or_admin"
on public.audit_reports for select
to authenticated
using (
  public.is_admin()
  or exists (
    select 1 from public.users u
    where u.id = audit_reports.user_id
      and u.auth_user_id = auth.uid()
  )
);

drop policy if exists "dead_skus read own_or_admin" on public.dead_skus;
create policy "dead_skus read own_or_admin"
on public.dead_skus for select
to authenticated
using (
  public.is_admin()
  or exists (
    select 1 from public.users u
    where u.id = dead_skus.user_id
      and u.auth_user_id = auth.uid()
  )
);

drop policy if exists "flows read own_or_admin" on public.onboarding_flows;
create policy "flows read own_or_admin"
on public.onboarding_flows for select
to authenticated
using (
  public.is_admin()
  or exists (
    select 1 from public.users u
    where u.id = onboarding_flows.user_id
      and u.auth_user_id = auth.uid()
  )
);

drop policy if exists "payments read own_or_admin" on public.payments;
create policy "payments read own_or_admin"
on public.payments for select
to authenticated
using (
  public.is_admin()
  or exists (
    select 1 from public.users u
    where u.id = payments.user_id
      and u.auth_user_id = auth.uid()
  )
);

drop policy if exists "workflow logs read admin_or_own_user" on public.workflow_logs;
create policy "workflow logs read admin_or_own_user"
on public.workflow_logs for select
to authenticated
using (
  public.is_admin()
  or exists (
    select 1 from public.users u
    where u.id = workflow_logs.user_id
      and u.auth_user_id = auth.uid()
  )
);

drop policy if exists "email logs read own_or_admin" on public.email_logs;
create policy "email logs read own_or_admin"
on public.email_logs for select
to authenticated
using (
  public.is_admin()
  or exists (
    select 1 from public.users u
    where u.id = email_logs.user_id
      and u.auth_user_id = auth.uid()
  )
);

drop policy if exists "service role full access users" on public.users;
create policy "service role full access users"
on public.users for all to service_role using (true) with check (true);
drop policy if exists "service role full access reports" on public.audit_reports;
create policy "service role full access reports"
on public.audit_reports for all to service_role using (true) with check (true);
drop policy if exists "service role full access dead_skus" on public.dead_skus;
create policy "service role full access dead_skus"
on public.dead_skus for all to service_role using (true) with check (true);
drop policy if exists "service role full access payments" on public.payments;
create policy "service role full access payments"
on public.payments for all to service_role using (true) with check (true);
drop policy if exists "service role full access flows" on public.onboarding_flows;
create policy "service role full access flows"
on public.onboarding_flows for all to service_role using (true) with check (true);
drop policy if exists "service role full access workflow_logs" on public.workflow_logs;
create policy "service role full access workflow_logs"
on public.workflow_logs for all to service_role using (true) with check (true);
drop policy if exists "service role full access email_logs" on public.email_logs;
create policy "service role full access email_logs"
on public.email_logs for all to service_role using (true) with check (true);
drop policy if exists "service role full access integrations" on public.integrations;
create policy "service role full access integrations"
on public.integrations for all to service_role using (true) with check (true);
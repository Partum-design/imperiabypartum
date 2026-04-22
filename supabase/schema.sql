-- Imperia By Partum - Supabase PostgreSQL schema + RLS
-- Run this in Supabase SQL editor.

create extension if not exists "pgcrypto";

create type public.app_role as enum (
  'superadmin',
  'rh',
  'ventas',
  'desarrollo',
  'diseno',
  'grabacion',
  'empleado_general'
);

create type public.visit_status as enum ('pendiente', 'confirmada', 'en_progreso', 'completada', 'cancelada');
create type public.subscription_kind as enum ('dominio', 'suscripcion', 'licencia');
create type public.notification_type as enum ('cumpleanos', 'vencimiento', 'evento', 'general');

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text not null,
  role public.app_role not null default 'empleado_general',
  department text,
  position text,
  birthday date,
  phone text,
  avatar_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.users(id) on delete restrict,
  title text not null,
  body text not null,
  is_pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references public.users(id) on delete restrict,
  title text not null,
  description text,
  start_at timestamptz not null,
  end_at timestamptz,
  location text,
  is_all_day boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.visits (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  notes text,
  visit_at timestamptz not null,
  status public.visit_status not null default 'pendiente',
  assigned_to uuid not null references public.users(id) on delete restrict,
  created_by uuid not null references public.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payroll (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.users(id) on delete cascade,
  period_start date not null,
  period_end date not null,
  gross_amount numeric(12,2) not null,
  deductions_amount numeric(12,2) not null default 0,
  net_amount numeric(12,2) not null,
  currency text not null default 'MXN',
  receipt_file_path text,
  created_by uuid not null references public.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint payroll_period_check check (period_end >= period_start)
);

create table if not exists public.employee_files (
  id uuid primary key default gen_random_uuid(),
  employee_id uuid not null references public.users(id) on delete cascade,
  uploaded_by uuid not null references public.users(id) on delete restrict,
  file_name text not null,
  file_path text not null,
  file_category text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  kind public.subscription_kind not null,
  name text not null,
  provider text not null,
  cost numeric(12,2) not null,
  currency text not null default 'MXN',
  registered_at date not null,
  expires_at date not null,
  owner_user_id uuid references public.users(id) on delete set null,
  notes text,
  created_by uuid not null references public.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint subscriptions_expiry_check check (expires_at >= registered_at)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  type public.notification_type not null,
  title text not null,
  message text not null,
  user_id uuid references public.users(id) on delete cascade,
  entity_id uuid,
  entity_table text,
  seen_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  endpoint text not null,
  p256dh text not null,
  auth text not null,
  user_agent text,
  created_at timestamptz not null default now(),
  unique(user_id, endpoint)
);

create table if not exists public.alert_jobs_log (
  run_date date primary key,
  processed_at timestamptz not null default now(),
  total_alerts integer not null default 0
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.current_user_role()
returns public.app_role
language sql
stable
as $$
  select role from public.users where id = auth.uid();
$$;

create trigger trg_users_updated_at before update on public.users
for each row execute function public.set_updated_at();

create trigger trg_posts_updated_at before update on public.posts
for each row execute function public.set_updated_at();

create trigger trg_events_updated_at before update on public.events
for each row execute function public.set_updated_at();

create trigger trg_visits_updated_at before update on public.visits
for each row execute function public.set_updated_at();

create trigger trg_payroll_updated_at before update on public.payroll
for each row execute function public.set_updated_at();

create trigger trg_subscriptions_updated_at before update on public.subscriptions
for each row execute function public.set_updated_at();

create index if not exists idx_posts_created_at on public.posts(created_at desc);
create index if not exists idx_events_start_at on public.events(start_at);
create index if not exists idx_visits_visit_at on public.visits(visit_at);
create index if not exists idx_visits_assigned_to on public.visits(assigned_to);
create index if not exists idx_payroll_employee_period on public.payroll(employee_id, period_start, period_end);
create index if not exists idx_subscriptions_expires_at on public.subscriptions(expires_at);
create index if not exists idx_notifications_user_created on public.notifications(user_id, created_at desc);

alter table public.users enable row level security;
alter table public.posts enable row level security;
alter table public.events enable row level security;
alter table public.visits enable row level security;
alter table public.payroll enable row level security;
alter table public.employee_files enable row level security;
alter table public.subscriptions enable row level security;
alter table public.notifications enable row level security;
alter table public.push_subscriptions enable row level security;
alter table public.alert_jobs_log enable row level security;

-- USERS
create policy users_select on public.users
for select
using (
  auth.uid() = id
  or public.current_user_role() in ('superadmin', 'rh')
);

create policy users_insert on public.users
for insert
with check (public.current_user_role() in ('superadmin', 'rh'));

create policy users_update on public.users
for update
using (
  auth.uid() = id
  or public.current_user_role() in ('superadmin', 'rh')
)
with check (
  auth.uid() = id
  or public.current_user_role() in ('superadmin', 'rh')
);

-- POSTS
create policy posts_select on public.posts
for select
using (auth.uid() is not null);

create policy posts_insert on public.posts
for insert
with check (
  auth.uid() = author_id
  and public.current_user_role() in ('superadmin', 'rh', 'ventas', 'desarrollo', 'diseno', 'grabacion')
);

create policy posts_update_delete on public.posts
for all
using (
  auth.uid() = author_id
  or public.current_user_role() in ('superadmin', 'rh')
)
with check (
  auth.uid() = author_id
  or public.current_user_role() in ('superadmin', 'rh')
);

-- EVENTS
create policy events_select on public.events
for select
using (auth.uid() is not null);

create policy events_manage on public.events
for all
using (public.current_user_role() in ('superadmin', 'rh'))
with check (public.current_user_role() in ('superadmin', 'rh'));

-- VISITS
create policy visits_select on public.visits
for select
using (
  public.current_user_role() in ('superadmin', 'rh', 'ventas')
  or assigned_to = auth.uid()
  or created_by = auth.uid()
);

create policy visits_insert on public.visits
for insert
with check (
  public.current_user_role() in ('superadmin', 'rh', 'ventas')
  and created_by = auth.uid()
);

create policy visits_update_delete on public.visits
for all
using (
  public.current_user_role() in ('superadmin', 'rh', 'ventas')
  or assigned_to = auth.uid()
)
with check (
  public.current_user_role() in ('superadmin', 'rh', 'ventas')
  or assigned_to = auth.uid()
);

-- PAYROLL + FILES
create policy payroll_select on public.payroll
for select
using (
  public.current_user_role() in ('superadmin', 'rh')
  or employee_id = auth.uid()
);

create policy payroll_manage on public.payroll
for all
using (public.current_user_role() in ('superadmin', 'rh'))
with check (public.current_user_role() in ('superadmin', 'rh'));

create policy files_select on public.employee_files
for select
using (
  public.current_user_role() in ('superadmin', 'rh')
  or employee_id = auth.uid()
);

create policy files_manage on public.employee_files
for all
using (public.current_user_role() in ('superadmin', 'rh'))
with check (public.current_user_role() in ('superadmin', 'rh'));

-- SUBSCRIPTIONS / ASSETS
create policy subscriptions_select on public.subscriptions
for select
using (
  auth.uid() is not null
);

create policy subscriptions_manage on public.subscriptions
for all
using (public.current_user_role() in ('superadmin', 'rh', 'ventas'))
with check (public.current_user_role() in ('superadmin', 'rh', 'ventas'));

-- NOTIFICATIONS + PUSH
create policy notifications_select on public.notifications
for select
using (
  user_id = auth.uid()
  or (user_id is null and public.current_user_role() in ('superadmin', 'rh'))
);

create policy notifications_manage on public.notifications
for all
using (public.current_user_role() in ('superadmin', 'rh'))
with check (public.current_user_role() in ('superadmin', 'rh'));

create policy push_subscription_owner on public.push_subscriptions
for all
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy alert_jobs_admin on public.alert_jobs_log
for all
using (public.current_user_role() in ('superadmin', 'rh'))
with check (public.current_user_role() in ('superadmin', 'rh'));

-- Optional: keeps auth.users and public.users synchronized on signup.
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users(id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(coalesce(new.email, 'usuario'), '@', 1))
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

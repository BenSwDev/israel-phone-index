create table if not exists public.phone_statuses (
  phone text primary key check (phone ~ '^05[0-9]{8}$'),
  status text not null check (status in ('active', 'inactive', 'unknown')),
  source text not null default 'manual',
  checked_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.phone_statuses enable row level security;

create policy "phone_statuses_read_all"
on public.phone_statuses
for select
to anon, authenticated
using (true);

-- Newsletter subscribers
-- Run in Supabase SQL Editor after profiles and comments migrations

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  status text not null default 'active' check (status in ('active', 'unsubscribed')),
  subscribed_at timestamptz not null default now(),
  constraint newsletter_subscribers_email_key unique (email),
  constraint newsletter_subscribers_email_format check (position('@' in email) > 1)
);

create index if not exists newsletter_subscribers_status_idx
  on public.newsletter_subscribers (status);

alter table public.newsletter_subscribers enable row level security;

create policy "Anyone can subscribe to newsletter"
  on public.newsletter_subscribers
  for insert
  to anon, authenticated
  with check (status = 'active');

grant insert on public.newsletter_subscribers to anon, authenticated;

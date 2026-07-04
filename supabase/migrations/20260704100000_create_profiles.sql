-- Profiles table with role-based access control
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

create type public.user_role as enum ('user', 'admin');

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null,
  avatar_url text,
  role public.user_role not null default 'user',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint profiles_username_length check (char_length(username) >= 2)
);

create unique index if not exists profiles_username_key on public.profiles (lower(username));

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles
  for select
  to anon, authenticated
  using (true);

create policy "Users can insert own profile"
  on public.profiles
  for insert
  to authenticated
  with check ((select auth.uid()) = id);

create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;

create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

create or replace function public.protect_profile_role()
returns trigger
language plpgsql
as $$
begin
  if current_setting('request.jwt.claim.role', true) is distinct from 'service_role' then
    new.role := old.role;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_role on public.profiles;

create trigger protect_profile_role
  before update on public.profiles
  for each row
  when (old.role is distinct from new.role)
  execute function public.protect_profile_role();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  base_username text;
  final_username text;
  suffix integer := 0;
begin
  base_username := coalesce(
    nullif(new.raw_user_meta_data ->> 'username', ''),
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    nullif(new.raw_user_meta_data ->> 'name', ''),
    split_part(new.email, '@', 1)
  );

  final_username := base_username;

  while exists (
    select 1
    from public.profiles
    where lower(username) = lower(final_username)
  ) loop
    suffix := suffix + 1;
    final_username := base_username || suffix::text;
  end loop;

  insert into public.profiles (id, username, avatar_url)
  values (
    new.id,
    final_username,
    coalesce(
      new.raw_user_meta_data ->> 'avatar_url',
      new.raw_user_meta_data ->> 'picture'
    )
  );

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

grant usage on schema public to anon, authenticated;
grant select on public.profiles to anon, authenticated;
grant insert, update on public.profiles to authenticated;

-- User-submitted articles with moderation workflow

create type public.article_status as enum ('draft', 'pending', 'published', 'rejected');

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  slug text not null,
  excerpt text,
  content text not null,
  status public.article_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint articles_title_length check (char_length(trim(title)) >= 3),
  constraint articles_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint articles_content_length check (char_length(trim(content)) >= 10)
);

create unique index if not exists articles_slug_key on public.articles (lower(slug));
create index if not exists articles_user_id_idx on public.articles (user_id);
create index if not exists articles_status_idx on public.articles (status);
create index if not exists articles_created_at_idx on public.articles (created_at desc);

alter table public.articles enable row level security;

-- Public can read published articles
create policy "Published articles are viewable by everyone"
  on public.articles
  for select
  to anon, authenticated
  using (status = 'published');

-- Authors can read their own articles
create policy "Authors can view own articles"
  on public.articles
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- Admins can read all articles
create policy "Admins can view all articles"
  on public.articles
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where id = (select auth.uid()) and role = 'admin'
    )
  );

create policy "Authenticated users can create articles"
  on public.articles
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Authors can update own draft or pending articles"
  on public.articles
  for update
  to authenticated
  using (
    (select auth.uid()) = user_id
    and status in ('draft', 'pending', 'rejected')
  )
  with check (
    (select auth.uid()) = user_id
    and status in ('draft', 'pending', 'rejected')
  );

create policy "Authors can delete own draft or rejected articles"
  on public.articles
  for delete
  to authenticated
  using (
    (select auth.uid()) = user_id
    and status in ('draft', 'rejected')
  );

create policy "Admins can update any article"
  on public.articles
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where id = (select auth.uid()) and role = 'admin'
    )
  )
  with check (
    exists (
      select 1
      from public.profiles
      where id = (select auth.uid()) and role = 'admin'
    )
  );

create policy "Admins can delete any article"
  on public.articles
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where id = (select auth.uid()) and role = 'admin'
    )
  );

drop trigger if exists articles_updated_at on public.articles;

create trigger articles_updated_at
  before update on public.articles
  for each row
  execute function public.handle_updated_at();

grant select on public.articles to anon, authenticated;
grant insert, update, delete on public.articles to authenticated;

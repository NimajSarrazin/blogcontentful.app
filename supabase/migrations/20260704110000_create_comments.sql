-- Comments system: nested comments, likes, reports
-- Run in Supabase SQL Editor after the profiles migration

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_slug text not null,
  user_id uuid not null references public.profiles (id) on delete cascade,
  parent_id uuid references public.comments (id) on delete cascade,
  content text not null,
  is_deleted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint comments_content_length check (
    char_length(trim(content)) >= 1 and char_length(content) <= 5000
  )
);

create index if not exists comments_post_slug_idx on public.comments (post_slug);
create index if not exists comments_parent_id_idx on public.comments (parent_id);
create index if not exists comments_created_at_idx on public.comments (created_at desc);
create index if not exists comments_user_id_idx on public.comments (user_id);

create table if not exists public.comment_likes (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references public.comments (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint comment_likes_unique unique (comment_id, user_id)
);

create index if not exists comment_likes_comment_id_idx on public.comment_likes (comment_id);

create table if not exists public.comment_reports (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references public.comments (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  reason text,
  created_at timestamptz not null default now(),
  constraint comment_reports_unique unique (comment_id, user_id)
);

alter table public.comments enable row level security;
alter table public.comment_likes enable row level security;
alter table public.comment_reports enable row level security;

-- Comments: public read, authenticated write
create policy "Comments are viewable by everyone"
  on public.comments
  for select
  to anon, authenticated
  using (true);

create policy "Authenticated users can create comments"
  on public.comments
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update own comments"
  on public.comments
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete own comments"
  on public.comments
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Admins can delete any comment"
  on public.comments
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where id = (select auth.uid()) and role = 'admin'
    )
  );

-- Likes
create policy "Comment likes are viewable by everyone"
  on public.comment_likes
  for select
  to anon, authenticated
  using (true);

create policy "Users can like comments"
  on public.comment_likes
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can unlike comments"
  on public.comment_likes
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- Reports
create policy "Users can report comments"
  on public.comment_reports
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Admins can view reports"
  on public.comment_reports
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.profiles
      where id = (select auth.uid()) and role = 'admin'
    )
  );

-- Updated_at trigger for comments
drop trigger if exists comments_updated_at on public.comments;

create trigger comments_updated_at
  before update on public.comments
  for each row
  execute function public.handle_updated_at();

-- Enable realtime
alter publication supabase_realtime add table public.comments;
alter publication supabase_realtime add table public.comment_likes;

grant select on public.comments to anon, authenticated;
grant insert, update, delete on public.comments to authenticated;
grant select, insert, delete on public.comment_likes to anon, authenticated;
grant insert on public.comment_reports to authenticated;
grant select on public.comment_reports to authenticated;

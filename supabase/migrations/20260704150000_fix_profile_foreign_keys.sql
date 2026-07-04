-- Point user_id FKs at public.profiles so PostgREST can join comments/articles with profiles

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'comments'
  ) then
    alter table public.comments drop constraint if exists comments_user_id_fkey;
    alter table public.comments
      add constraint comments_user_id_fkey
      foreign key (user_id) references public.profiles (id) on delete cascade;
  end if;

  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'comment_likes'
  ) then
    alter table public.comment_likes drop constraint if exists comment_likes_user_id_fkey;
    alter table public.comment_likes
      add constraint comment_likes_user_id_fkey
      foreign key (user_id) references public.profiles (id) on delete cascade;
  end if;

  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'comment_reports'
  ) then
    alter table public.comment_reports drop constraint if exists comment_reports_user_id_fkey;
    alter table public.comment_reports
      add constraint comment_reports_user_id_fkey
      foreign key (user_id) references public.profiles (id) on delete cascade;
  end if;

  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'articles'
  ) then
    alter table public.articles drop constraint if exists articles_user_id_fkey;
    alter table public.articles
      add constraint articles_user_id_fkey
      foreign key (user_id) references public.profiles (id) on delete cascade;
  end if;
end $$;

notify pgrst, 'reload schema';

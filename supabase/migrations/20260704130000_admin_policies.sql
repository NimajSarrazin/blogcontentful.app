-- Admin moderation policies and role management

-- Allow admins to soft-delete any comment (update is_deleted)
create policy "Admins can update any comment"
  on public.comments
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

-- Allow admins to hard-delete comments
-- (delete policy already exists from comments migration)

-- Admin role assignment via security definer function
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
as $$
begin
  if current_setting('request.jwt.claim.role', true) = 'service_role' then
    return new;
  end if;

  if current_setting('app.admin_role_change', true) = 'true' then
    return new;
  end if;

  new.role := old.role;
  return new;
end;
$$;

create or replace function public.admin_set_user_role(
  target_user_id uuid,
  new_role public.user_role
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  ) then
    raise exception 'Unauthorized';
  end if;

  if target_user_id = auth.uid() then
    raise exception 'Cannot change your own role';
  end if;

  perform set_config('app.admin_role_change', 'true', true);

  update public.profiles
  set role = new_role
  where id = target_user_id;
end;
$$;

grant execute on function public.admin_set_user_role(uuid, public.user_role) to authenticated;

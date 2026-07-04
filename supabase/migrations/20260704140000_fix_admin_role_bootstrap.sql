-- Fix role protection for new Supabase secret keys and add bootstrap helper

create or replace function public.protect_profile_role()
returns trigger
language plpgsql
as $$
begin
  if current_setting('request.jwt.claim.role', true) = 'service_role' then
    return new;
  end if;

  if current_user = 'service_role' then
    return new;
  end if;

  if current_setting('app.admin_role_change', true) = 'true' then
    return new;
  end if;

  new.role := old.role;
  return new;
end;
$$;

create or replace function public.bootstrap_admin_by_email(target_email text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.profiles
  set role = 'admin'
  where id = (
    select id
    from auth.users
    where lower(email) = lower(target_email)
  );
end;
$$;

revoke all on function public.bootstrap_admin_by_email(text) from public;
grant execute on function public.bootstrap_admin_by_email(text) to service_role;

select public.bootstrap_admin_by_email('sarrazin.benjamin.pro@gmail.com');

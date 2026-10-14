-- Public access is limited to the explicitly published general service catalog.
-- Existing private-proposal password checks and table RLS are preserved.
create or replace function redom_private.public_general_proposal()
returns jsonb language sql security definer set search_path='' as $$
 select to_jsonb(p)-'passcode'-'client_email' from public.proposals p
 where p.slug='general' and p.passcode='' and p.status='active'
 and (nullif(p.valid_until::text,'') is null or nullif(p.valid_until::text,'')::date>=current_date)
 and exists(select 1 from jsonb_array_elements(p.sections::jsonb) s where s->>'catalog'='true')
 limit 1;
$$;
revoke all on function redom_private.public_general_proposal() from public;
grant execute on function redom_private.public_general_proposal() to anon,authenticated;
create or replace function public.public_general_proposal()
returns jsonb language sql security invoker set search_path='' as $$
 select redom_private.public_general_proposal();
$$;
revoke all on function public.public_general_proposal() from public;
grant execute on function public.public_general_proposal() to anon,authenticated;

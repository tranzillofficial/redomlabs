-- Separate customer follow-up access from sales finance access; preserve all balances.
begin;
alter table public.admin_staff drop constraint if exists admin_staff_permissions_check;
alter table public.admin_staff add constraint admin_staff_permissions_check check(permissions <@ array['overview','products','work','crm','sales','proposals','inquiries','forms','settings','expenses','finance']::text[]);
-- Sales access is assigned explicitly by the owner; no new staff scopes are granted automatically.
alter policy "CRM access" on public.crm_customers using((select redom_private.has_access('sales') and redom_private.has_access('finance'))) with check((select redom_private.has_access('sales') and redom_private.has_access('finance')));
create or replace function redom_private.crm_safe_list(page_number integer,search_term text,stage_filter text) returns jsonb language plpgsql stable security definer set search_path='' as $$
declare result jsonb;
begin
 if auth.uid() is null or not redom_private.has_access('crm') then raise insufficient_privilege; end if;
 if page_number<0 or page_number>100000 or length(search_term)>200 or stage_filter not in ('all','customer','potential','follow_up') then raise exception 'Invalid filter'; end if;
 with filtered as (select c.* from public.crm_customers c where (stage_filter='all' or stage=stage_filter) and (search_term='' or concat_ws(' ',name,phone,business_name,service_name) ilike '%'||search_term||'%')),
 page as (select * from filtered order by created_at desc,id desc offset page_number*50 limit 50)
 select jsonb_build_object('count',(select count(*) from filtered),'data',coalesce((select jsonb_agg((to_jsonb(p)-array['total_amount','paid_amount','remaining_amount','currency'])||'{"total_amount":0,"paid_amount":0,"remaining_amount":0,"currency":"EGP"}'::jsonb ) from page p),'[]'::jsonb)) into result;
 return result;
end $$;
create or replace function redom_private.sales_list(page_number integer,search_term text,stage_filter text) returns jsonb language plpgsql stable security definer set search_path='' as $$
declare result jsonb;
begin
 if auth.uid() is null or (not redom_private.has_access('sales') or not redom_private.has_access('finance')) then raise insufficient_privilege; end if;
 if page_number<0 or page_number>100000 or length(search_term)>200 or stage_filter not in ('all','customer','potential','follow_up') then raise exception 'Invalid filter'; end if;
 with filtered as (select c.* from public.crm_customers c where (stage_filter='all' or stage=stage_filter) and (search_term='' or concat_ws(' ',name,phone,business_name,service_name) ilike '%'||search_term||'%')),
 page as (select * from filtered order by created_at desc,id desc offset page_number*50 limit 50)
 select jsonb_build_object('count',(select count(*) from filtered),'data',coalesce((select jsonb_agg(case when redom_private.has_access('finance') then to_jsonb(p) else (to_jsonb(p)-array['total_amount','paid_amount','remaining_amount','currency'])||'{"total_amount":0,"paid_amount":0,"remaining_amount":0,"currency":"EGP"}'::jsonb end) from page p),'[]'::jsonb)) into result;
 return result;
end $$;

create or replace function public.sales_list(page_number integer default 0,search_term text default '',stage_filter text default 'all') returns jsonb language sql stable security invoker set search_path='' as $$select redom_private.sales_list(page_number,search_term,stage_filter)$$;
revoke all on function redom_private.sales_list(integer,text,text),public.sales_list(integer,text,text) from public,anon;
grant execute on function redom_private.sales_list(integer,text,text),public.sales_list(integer,text,text) to authenticated;
notify pgrst,'reload schema';
commit;

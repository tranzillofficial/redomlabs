-- Apply with the matching application release. Existing amounts are preserved.
begin;
alter table public.admin_staff drop constraint if exists admin_staff_permissions_check;
alter table public.admin_staff add constraint admin_staff_permissions_check check(permissions <@ array['overview','products','work','crm','proposals','inquiries','forms','settings','expenses','finance']::text[]);
drop policy if exists "CRM access" on public.crm_customers;
create policy "CRM access" on public.crm_customers for all to authenticated using((select redom_private.has_access('crm') and redom_private.has_access('finance'))) with check((select redom_private.has_access('crm') and redom_private.has_access('finance')));
create or replace function redom_private.crm_safe_list(page_number integer,search_term text,stage_filter text) returns jsonb language plpgsql stable security definer set search_path='' as $$
declare result jsonb;
begin
 if auth.uid() is null or not redom_private.has_access('crm') then raise insufficient_privilege; end if;
 if page_number<0 or page_number>100000 or length(search_term)>200 or stage_filter not in ('all','customer','potential','follow_up') then raise exception 'Invalid filter'; end if;
 with filtered as (select c.* from public.crm_customers c where (stage_filter='all' or stage=stage_filter) and (search_term='' or concat_ws(' ',name,phone,business_name,service_name) ilike '%'||search_term||'%')),
 page as (select * from filtered order by created_at desc,id desc offset page_number*50 limit 50)
 select jsonb_build_object('count',(select count(*) from filtered),'data',coalesce((select jsonb_agg(case when redom_private.has_access('finance') then to_jsonb(p) else (to_jsonb(p)-array['total_amount','paid_amount','remaining_amount','currency'])||'{"total_amount":0,"paid_amount":0,"remaining_amount":0,"currency":"EGP"}'::jsonb end) from page p),'[]'::jsonb)) into result;
 return result;
end $$;
create or replace function redom_private.crm_safe_save(payload jsonb) returns void language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null or not redom_private.has_access('crm') then raise insufficient_privilege; end if;
 insert into public.crm_customers(id,name,phone,business_name,service_name,notes,stage,follow_up_date)
 values((payload->>'id')::uuid,trim(payload->>'name'),payload->>'phone',coalesce(payload->>'business_name',''),payload->>'service_name',coalesce(payload->>'notes',''),payload->>'stage',nullif(payload->>'follow_up_date','')::date)
 on conflict(id) do update set name=excluded.name,phone=excluded.phone,business_name=excluded.business_name,service_name=excluded.service_name,notes=excluded.notes,stage=excluded.stage,follow_up_date=excluded.follow_up_date,updated_at=now();
end $$;
create or replace function redom_private.crm_convert_request(request_id uuid) returns void language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null or not redom_private.has_access('crm') or not redom_private.has_access('proposals') then raise insufficient_privilege; end if;
 insert into public.crm_customers(name,phone,business_name,service_name,notes,proposal_request_id,stage)
 select contact_name,phone,case when proposal_slug='general' then '' else client_name end,left((select string_agg(x->>'title','، ') from jsonb_array_elements(sections) x),300),coalesce(notes,''),id,'potential' from public.proposal_requests where id=request_id on conflict(proposal_request_id) do nothing;
end $$;
create table if not exists public.company_expenses(
 id uuid primary key default gen_random_uuid(), amount numeric(14,2) not null check(amount>0),currency text not null default 'EGP' check(currency in ('EGP','USD','SAR','AED','GBP','EUR')),
 purpose text not null check(length(trim(purpose)) between 1 and 1000),category text not null check(category in ('ads','freelance','salary','server','domain','other')),spent_on date not null,
 created_by uuid references auth.users(id) on delete set null,created_by_name text not null,created_at timestamptz not null default now()
);
alter table public.company_expenses enable row level security;
revoke all on public.company_expenses from anon,authenticated;
grant select,insert on public.company_expenses to authenticated;
drop policy if exists "Expense history finance only" on public.company_expenses;
create policy "Expense history finance only" on public.company_expenses for select to authenticated using((select redom_private.has_access('expenses') and redom_private.has_access('finance')));
drop policy if exists "Expense entry" on public.company_expenses;
create policy "Expense entry" on public.company_expenses for insert to authenticated with check((select redom_private.has_access('expenses')));
create or replace function redom_private.expense_actor() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null or not redom_private.has_access('expenses') then raise insufficient_privilege; end if;
 new.created_by=auth.uid();new.created_at=now();
 select coalesce((select name from public.admin_staff where user_id=auth.uid()),(select email from auth.users where id=auth.uid())) into new.created_by_name;
 return new;
end $$;
drop trigger if exists expense_actor on public.company_expenses;
create trigger expense_actor before insert on public.company_expenses for each row execute function redom_private.expense_actor();
create or replace function public.expense_totals() returns table(currency text,total numeric) language sql stable security invoker set search_path='' as $$select currency,sum(amount) from public.company_expenses group by currency$$;
create or replace function public.crm_financial_totals() returns table(currency text,total numeric,paid numeric,remaining numeric) language sql stable security invoker set search_path='' as $$select currency,sum(total_amount),sum(paid_amount),sum(remaining_amount) from public.crm_customers group by currency$$;
create or replace function public.crm_safe_list(page_number integer default 0,search_term text default '',stage_filter text default 'all') returns jsonb language sql stable security invoker set search_path='' as $$select redom_private.crm_safe_list(page_number,search_term,stage_filter)$$;
create or replace function public.crm_safe_save(payload jsonb) returns void language sql security invoker set search_path='' as $$select redom_private.crm_safe_save(payload)$$;
create or replace function public.crm_convert_request(request_id uuid) returns void language sql security invoker set search_path='' as $$select redom_private.crm_convert_request(request_id)$$;
revoke all on function redom_private.crm_safe_list(integer,text,text),redom_private.crm_safe_save(jsonb),redom_private.crm_convert_request(uuid),redom_private.expense_actor() from public,anon,authenticated;
grant execute on function redom_private.crm_safe_list(integer,text,text),redom_private.crm_safe_save(jsonb),redom_private.crm_convert_request(uuid) to authenticated;
revoke all on function public.crm_safe_list(integer,text,text),public.crm_safe_save(jsonb),public.crm_convert_request(uuid),public.expense_totals(),public.crm_financial_totals() from public,anon;
grant execute on function public.crm_safe_list(integer,text,text),public.crm_safe_save(jsonb),public.crm_convert_request(uuid),public.expense_totals(),public.crm_financial_totals() to authenticated;
create index if not exists company_expenses_date on public.company_expenses(spent_on desc,created_at desc,id);
notify pgrst,'reload schema';
commit;

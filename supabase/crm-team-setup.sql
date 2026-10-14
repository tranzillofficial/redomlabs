-- Persistent staff permissions; existing indom_admin users remain owners.
create schema if not exists redom_private;
create table if not exists public.admin_staff (
 user_id uuid primary key references auth.users(id) on delete cascade,
 name text not null check(length(trim(name)) between 1 and 100),
 email text not null check(length(email) between 3 and 254),
 permissions text[] not null default '{}' check(permissions <@ array['overview','products','work','crm','proposals','inquiries','forms','settings']::text[]),
 active boolean not null default true,
 created_at timestamptz not null default now()
);
alter table public.admin_staff enable row level security;
revoke all on public.admin_staff from anon,authenticated;
grant select,insert,update,delete on public.admin_staff to authenticated;
-- The private definer only checks the current authenticated identity; it takes no user ID.
create or replace function redom_private.has_access(section text) returns boolean
language sql stable security definer set search_path='' as $$
 select auth.uid() is not null and (
 exists(select 1 from auth.users where id=auth.uid() and raw_app_meta_data->>'indom_admin'='true')
 or exists(select 1 from public.admin_staff where user_id=auth.uid() and active and section=any(permissions)));
$$;
revoke all on function redom_private.has_access(text) from public;
grant usage on schema redom_private to authenticated;
grant execute on function redom_private.has_access(text) to authenticated;
drop policy if exists "Staff self or owner" on public.admin_staff;
create policy "Staff self or owner" on public.admin_staff for select to authenticated using(user_id=(select auth.uid()) or (select redom_private.has_access('team')));
drop policy if exists "Owner manages staff" on public.admin_staff;
create policy "Owner manages staff" on public.admin_staff for all to authenticated using((select redom_private.has_access('team'))) with check((select redom_private.has_access('team')));
create table if not exists public.crm_customers (
 id uuid primary key default gen_random_uuid(),
 name text not null check(length(trim(name)) between 1 and 100),
 phone text not null check(phone ~ '^[+0-9 ()-]{7,40}$'),
 business_name text not null default '' check(length(business_name)<=200),
 service_name text not null check(length(trim(service_name)) between 1 and 300),
 total_amount numeric(14,2) not null default 0 check(total_amount>=0),
 paid_amount numeric(14,2) not null default 0 check(paid_amount>=0 and paid_amount<=total_amount),
 remaining_amount numeric(14,2) generated always as (total_amount-paid_amount) stored,
 currency text not null default 'EGP' check(currency in ('EGP','USD','SAR','AED','GBP','EUR')),
 stage text not null default 'potential' check(stage in ('customer','potential','follow_up')),
 follow_up_date date,
 notes text not null default '' check(length(notes)<=4000),
 proposal_request_id uuid unique references public.proposal_requests(id) on delete set null,
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
alter table public.crm_customers enable row level security;
revoke all on public.crm_customers from anon,authenticated;
grant select,insert,update,delete on public.crm_customers to authenticated;
drop policy if exists "CRM access" on public.crm_customers;
create policy "CRM access" on public.crm_customers for all to authenticated using((select redom_private.has_access('crm'))) with check((select redom_private.has_access('crm')));
create index if not exists crm_customers_follow_up on public.crm_customers(stage,follow_up_date);
create index if not exists crm_customers_created on public.crm_customers(created_at desc,id desc);
create table if not exists public.proposal_request_reads (
 user_id uuid not null references auth.users(id) on delete cascade,
 request_id uuid not null references public.proposal_requests(id) on delete cascade,
 read_at timestamptz not null default now(),
 primary key(user_id,request_id)
);
alter table public.proposal_request_reads enable row level security;
revoke all on public.proposal_request_reads from anon,authenticated;
grant select,insert on public.proposal_request_reads to authenticated;
drop policy if exists "Read own receipts" on public.proposal_request_reads;
create policy "Read own receipts" on public.proposal_request_reads for select to authenticated using(user_id=(select auth.uid()) and (select redom_private.has_access('proposals')));
drop policy if exists "Mark own requests read" on public.proposal_request_reads;
create policy "Mark own requests read" on public.proposal_request_reads for insert to authenticated with check(user_id=(select auth.uid()) and (select redom_private.has_access('proposals')));
alter table public.proposal_requests add column if not exists contacted_at timestamptz;
alter table public.proposal_requests add column if not exists contacted_by uuid references auth.users(id) on delete set null;
alter table public.proposal_requests add column if not exists contacted_by_name text;
grant select,update,delete on public.proposal_requests to authenticated;
drop policy if exists "Admin proposal request inbox" on public.proposal_requests;
create policy "Admin proposal request inbox" on public.proposal_requests for select to authenticated using((select redom_private.has_access('proposals')));
drop policy if exists "Update proposal requests" on public.proposal_requests;
create policy "Update proposal requests" on public.proposal_requests for update to authenticated using((select redom_private.has_access('proposals'))) with check((select redom_private.has_access('proposals')));
drop policy if exists "Delete proposal requests" on public.proposal_requests;
create policy "Delete proposal requests" on public.proposal_requests for delete to authenticated using((select redom_private.has_access('proposals')));
-- Attribution is generated by the database, never trusted from browser input.
create or replace function redom_private.attribute_contact() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if not redom_private.has_access('proposals') then raise exception 'Unauthorized'; end if;
 if new.contacted_at is not null and old.contacted_at is null then
  new.contacted_at=now(); new.contacted_by=auth.uid();
  select coalesce(s.name,u.email) into new.contacted_by_name from auth.users u left join public.admin_staff s on s.user_id=u.id where u.id=auth.uid();
 else
  new.contacted_at=old.contacted_at;new.contacted_by=old.contacted_by;new.contacted_by_name=old.contacted_by_name;
 end if;
 return new;
end; $$;
revoke all on function redom_private.attribute_contact() from public,anon,authenticated;
drop trigger if exists attribute_proposal_contact on public.proposal_requests;
create trigger attribute_proposal_contact before update on public.proposal_requests for each row execute function redom_private.attribute_contact();
-- Staff may update only contact state; quote snapshots remain immutable.
revoke update on public.proposal_requests from authenticated;
grant update(contacted_at) on public.proposal_requests to authenticated;
create or replace function public.unread_proposal_count() returns bigint language sql stable security invoker set search_path='' as $$
 select count(*) from public.proposal_requests r where not exists(select 1 from public.proposal_request_reads v where v.request_id=r.id and v.user_id=auth.uid());
$$;
revoke all on function public.unread_proposal_count() from public,anon;
grant execute on function public.unread_proposal_count() to authenticated;
-- Replace legacy permissive proposal policies so staff scopes cannot be bypassed.
do $$ declare p record; begin for p in select policyname from pg_policies where schemaname='public' and tablename='proposals' loop execute format('drop policy %I on public.proposals',p.policyname);end loop;end $$;
revoke all on public.proposals from anon;
grant select,insert,update,delete on public.proposals to authenticated;
drop policy if exists "Scoped proposals" on public.proposals;
create policy "Scoped proposals" on public.proposals for all to authenticated using((select redom_private.has_access('proposals'))) with check((select redom_private.has_access('proposals')));
drop policy if exists "Admin contact insert" on public.contact_settings;
drop policy if exists "Admin contact update" on public.contact_settings;
create policy "Admin contact insert" on public.contact_settings for insert to authenticated with check((select redom_private.has_access('settings')));
create policy "Admin contact update" on public.contact_settings for update to authenticated using((select redom_private.has_access('settings'))) with check((select redom_private.has_access('settings')));
drop policy if exists "Admin inquiry inbox" on public.contact_inquiries;
create policy "Admin inquiry inbox" on public.contact_inquiries for select to authenticated using((select redom_private.has_access('inquiries')));
drop policy if exists "Admin inquiry delete" on public.contact_inquiries;
grant delete on public.contact_inquiries to authenticated;
create policy "Admin inquiry delete" on public.contact_inquiries for delete to authenticated using((select redom_private.has_access('inquiries')));
drop policy if exists "Redom published projects" on public.site_projects;
create policy "Redom published projects" on public.site_projects for select to anon,authenticated using(published or (select redom_private.has_access(case when kind='product' then 'products' else 'work' end)));
-- anon must be able to read published rows without calling the private checker.
grant usage on schema redom_private to anon;
grant execute on function redom_private.has_access(text) to anon;
do $$ declare operation text;begin foreach operation in array array['insert','update','delete'] loop
 execute format('drop policy if exists %I on public.site_projects','Redom admin project '||operation);
 if operation='insert' then execute 'create policy "Redom admin project insert" on public.site_projects for insert to authenticated with check(redom_private.has_access(case when kind=''product'' then ''products'' else ''work'' end))';
 elsif operation='update' then execute 'create policy "Redom admin project update" on public.site_projects for update to authenticated using(redom_private.has_access(case when kind=''product'' then ''products'' else ''work'' end)) with check(redom_private.has_access(case when kind=''product'' then ''products'' else ''work'' end))';
 else execute 'create policy "Redom admin project delete" on public.site_projects for delete to authenticated using(redom_private.has_access(case when kind=''product'' then ''products'' else ''work'' end))';end if;
 end loop;end $$;
do $$ declare operation text; predicate text='bucket_id=''site-images'' and (redom_private.has_access(''products'') or redom_private.has_access(''work'') or redom_private.has_access(''proposals''))';begin foreach operation in array array['read','insert','update','delete'] loop
 execute format('drop policy if exists %I on storage.objects','Redom admin image '||operation);
 if operation='insert' then execute 'create policy "Redom admin image insert" on storage.objects for insert to authenticated with check('||predicate||')';
 elsif operation='update' then execute 'create policy "Redom admin image update" on storage.objects for update to authenticated using('||predicate||') with check('||predicate||')';
 else execute 'create policy '||quote_ident('Redom admin image '||operation)||' on storage.objects for '||case when operation='read' then 'select' else 'delete' end||' to authenticated using('||predicate||')';end if;
 end loop;end $$;

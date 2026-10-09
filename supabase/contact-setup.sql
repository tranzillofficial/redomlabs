-- Run in the esastftdifqqoksylbwv project SQL editor.
begin;
create table public.contact_settings (
 id integer primary key check(id=1),
 address_en text not null default 'Cairo - Egypt' check(length(address_en) between 1 and 200),
 address_ar text not null default 'القاهرة - مصر' check(length(address_ar) between 1 and 200),
 phone text not null default '' check(length(phone)<=40),
 email text not null default '' check(length(email)<=254)
);
insert into public.contact_settings(id) values(1);
alter table public.contact_settings enable row level security;
grant select on public.contact_settings to anon,authenticated;
grant insert,update on public.contact_settings to authenticated;
create policy "Public contact details" on public.contact_settings for select to anon,authenticated using(true);
create policy "Admin contact insert" on public.contact_settings for insert to authenticated with check((select auth.jwt()->'app_metadata'->>'indom_admin')='true');
create policy "Admin contact update" on public.contact_settings for update to authenticated using((select auth.jwt()->'app_metadata'->>'indom_admin')='true') with check((select auth.jwt()->'app_metadata'->>'indom_admin')='true');
create table public.contact_inquiries (
 id uuid primary key default gen_random_uuid(),
 name text not null check(length(trim(name)) between 1 and 100),
 email text not null check(length(email)<=254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
 project_type text not null check(project_type in ('website','mobile','business','ai','branding','marketing','it')),
 message text not null check(length(trim(message)) between 1 and 5000),
 locale text not null check(locale in ('ar','en')),
 created_at timestamptz not null default now()
);
create index contact_inquiries_created_at on public.contact_inquiries(created_at desc);
alter table public.contact_inquiries enable row level security;
grant insert(name,email,project_type,message,locale) on public.contact_inquiries to anon,authenticated;
grant select on public.contact_inquiries to authenticated;
create policy "Submit contact inquiry" on public.contact_inquiries for insert to anon,authenticated with check(true);
create policy "Admin inquiry inbox" on public.contact_inquiries for select to authenticated using((select auth.jwt()->'app_metadata'->>'indom_admin')='true');
commit;

-- REDOM LABS: complete database and image-storage setup.
-- Target project: esastftdifqqoksylbwv. Run this entire file in SQL Editor.
-- Safe to rerun: preserves existing records and recreates only Redom policies.
-- No password or service-role key is included.
-- For admin access, create redomlabs@gmail.com in Authentication > Users first.
-- The final UPDATE marks that existing user as admin; it never creates a password.
-- Contact phone/email remain blank until supplied from the admin dashboard.
-- Project images are public. Never upload private documents to site-images.
begin;
create table if not exists public.contact_settings (
 id integer primary key check(id=1),
 address_en text not null default 'Cairo - Egypt' check(length(address_en) between 1 and 200),
 address_ar text not null default 'القاهرة - مصر' check(length(address_ar) between 1 and 200),
 phone text not null default '' check(length(phone)<=40),
 email text not null default '' check(length(email)<=254)
);
-- Upgrade existing contact settings without replacing saved contact details.
alter table public.contact_settings add column if not exists address_details_en text not null default '' check(length(address_details_en)<=500);
alter table public.contact_settings add column if not exists address_details_ar text not null default '' check(length(address_details_ar)<=500);
alter table public.contact_settings add column if not exists social_links jsonb not null default '{}'::jsonb check(jsonb_typeof(social_links)='object');
insert into public.contact_settings(id) values(1) on conflict(id) do nothing;
alter table public.contact_settings enable row level security;
grant select on public.contact_settings to anon,authenticated;
grant insert,update on public.contact_settings to authenticated;
drop policy if exists "Public contact details" on public.contact_settings;
create policy "Public contact details" on public.contact_settings for select to anon,authenticated using(true);
drop policy if exists "Admin contact insert" on public.contact_settings;
create policy "Admin contact insert" on public.contact_settings for insert to authenticated with check((select auth.jwt()->'app_metadata'->>'indom_admin')='true');
drop policy if exists "Admin contact update" on public.contact_settings;
create policy "Admin contact update" on public.contact_settings for update to authenticated using((select auth.jwt()->'app_metadata'->>'indom_admin')='true') with check((select auth.jwt()->'app_metadata'->>'indom_admin')='true');
create table if not exists public.contact_inquiries (
 id uuid primary key default gen_random_uuid(),
 name text not null check(length(trim(name)) between 1 and 100),
 email text not null check(length(email)<=254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
 project_type text not null check(project_type in ('website','mobile','business','ai','branding','marketing','it')),
 message text not null check(length(trim(message)) between 1 and 5000),
 locale text not null check(locale in ('ar','en')),
 created_at timestamptz not null default now()
);
create index if not exists contact_inquiries_created_at on public.contact_inquiries(created_at desc);
create index if not exists contact_inquiries_page_order on public.contact_inquiries(created_at desc,id desc);
alter table public.contact_inquiries enable row level security;
grant insert(name,email,project_type,message,locale) on public.contact_inquiries to anon,authenticated;
grant select on public.contact_inquiries to authenticated;
drop policy if exists "Submit contact inquiry" on public.contact_inquiries;
create policy "Submit contact inquiry" on public.contact_inquiries for insert to anon,authenticated with check(true);
drop policy if exists "Admin inquiry inbox" on public.contact_inquiries;
create policy "Admin inquiry inbox" on public.contact_inquiries for select to authenticated using((select auth.jwt()->'app_metadata'->>'indom_admin')='true');

-- Only verified administrators may permanently remove an inquiry.
grant delete on public.contact_inquiries to authenticated;
drop policy if exists "Admin inquiry delete" on public.contact_inquiries;
create policy "Admin inquiry delete" on public.contact_inquiries for delete to authenticated using((select auth.jwt()->'app_metadata'->>'indom_admin')='true');


-- 2. Products and approved client work.
create table if not exists public.site_projects (
 id uuid primary key default gen_random_uuid(),
 kind text not null check(kind in ('product','work')),
 slug text not null unique check(slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug)<=80),
 name_ar text not null check(length(trim(name_ar)) between 1 and 1000),
 name_en text not null check(length(trim(name_en)) between 1 and 1000),
 category_ar text not null default '', category_en text not null default '',
 summary_ar text not null check(length(trim(summary_ar)) between 1 and 500),
 summary_en text not null check(length(trim(summary_en)) between 1 and 500),
 description_ar text not null default '' check(length(description_ar)<=6000),
 description_en text not null default '' check(length(description_en)<=6000),
 website_url text not null default '' check(website_url='' or website_url ~ '^https://'),
 thumbnail_url text not null default '' check(length(thumbnail_url)<=1000),
 gallery_urls text[] not null default '{}' check(cardinality(gallery_urls)<=12),
 features_ar text[] not null default '{}' check(cardinality(features_ar)<=20),
 features_en text[] not null default '{}' check(cardinality(features_en)<=20),
 client_name text not null default '', year text not null default '',
 published boolean not null default false,
 sort_order integer not null default 0 check(sort_order between 0 and 9999),
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists site_projects_public_order on public.site_projects(kind,published,sort_order);
alter table public.site_projects enable row level security;
grant select on public.site_projects to anon,authenticated;
grant insert,update,delete on public.site_projects to authenticated;
drop policy if exists "Redom published projects" on public.site_projects;
create policy "Redom published projects" on public.site_projects for select to anon,authenticated using(published or (select auth.jwt()->'app_metadata'->>'indom_admin')='true');
drop policy if exists "Redom admin project insert" on public.site_projects;
create policy "Redom admin project insert" on public.site_projects for insert to authenticated with check((select auth.jwt()->'app_metadata'->>'indom_admin')='true');
drop policy if exists "Redom admin project update" on public.site_projects;
create policy "Redom admin project update" on public.site_projects for update to authenticated using((select auth.jwt()->'app_metadata'->>'indom_admin')='true') with check((select auth.jwt()->'app_metadata'->>'indom_admin')='true');
drop policy if exists "Redom admin project delete" on public.site_projects;
create policy "Redom admin project delete" on public.site_projects for delete to authenticated using((select auth.jwt()->'app_metadata'->>'indom_admin')='true');
-- Seed the verified product once. Subsequent runs preserve dashboard edits.
insert into public.site_projects(kind,slug,name_ar,name_en,category_ar,category_en,summary_ar,summary_en,description_ar,description_en,website_url,features_ar,features_en,year,published)
values('product','menuzqr','MenuzQR','MenuzQR','المطاعم والكافيهات','Restaurants & cafés','منيو رقمي وإدارة طلبات ونقطة بيع في منصة واحدة.','Digital menus, orders and point of sale in one platform.','يساعد MenuzQR أصحاب الأنشطة على إدارة الأقسام والمنتجات والأسعار ومشاركة المنيو باستخدام QR، مع أدوات للطلبات ونقطة البيع حسب احتياجات النشاط.','MenuzQR helps businesses manage categories, items and prices and share their menu through QR codes, with order and point-of-sale tools suited to their operations.','https://menuzqr.shop',array['منيو رقمي عبر QR','إدارة الأقسام والمنتجات والأسعار','الطلبات ونقطة البيع'],array['QR digital menus','Category, item and price management','Orders and point of sale'],'2026',true)
on conflict(slug) do nothing;

-- 3. Public image bucket, maximum 5 MB, raster image formats only.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('site-images','site-images',true,5242880,array['image/jpeg','image/png','image/webp'])
on conflict(id) do update set public=true,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
drop policy if exists "Redom admin image read" on storage.objects;
create policy "Redom admin image read" on storage.objects for select to authenticated using(bucket_id='site-images' and (select auth.jwt()->'app_metadata'->>'indom_admin')='true');
drop policy if exists "Redom admin image insert" on storage.objects;
create policy "Redom admin image insert" on storage.objects for insert to authenticated with check(bucket_id='site-images' and (select auth.jwt()->'app_metadata'->>'indom_admin')='true');
drop policy if exists "Redom admin image update" on storage.objects;
create policy "Redom admin image update" on storage.objects for update to authenticated using(bucket_id='site-images' and (select auth.jwt()->'app_metadata'->>'indom_admin')='true') with check(bucket_id='site-images' and (select auth.jwt()->'app_metadata'->>'indom_admin')='true');
drop policy if exists "Redom admin image delete" on storage.objects;
create policy "Redom admin image delete" on storage.objects for delete to authenticated using(bucket_id='site-images' and (select auth.jwt()->'app_metadata'->>'indom_admin')='true');

-- 4. Existing client-proposal feature. No sample clients are inserted.
create table if not exists public.proposals (
 id text primary key, slug text not null unique,
 title text not null, client_name text not null, client_email text,
 passcode text not null, summary text not null default '',
 initial_price text not null default '', currency text not null default 'EGP',
 delivery_time text, valid_until date,
 status text not null default 'active' check(status in ('draft','active','accepted','expired')),
 sections text not null default '[]',
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table public.proposals enable row level security;
revoke all on public.proposals from anon,authenticated;
grant select,insert,update,delete on public.proposals to authenticated;
drop policy if exists "Redom admin proposals" on public.proposals;
create policy "Redom admin proposals" on public.proposals for all to authenticated using((select auth.jwt()->'app_metadata'->>'indom_admin')='true') with check((select auth.jwt()->'app_metadata'->>'indom_admin')='true');
-- Restrictive gate also protects against pre-existing permissive policies.
drop policy if exists "Redom proposals authorization gate" on public.proposals;
create policy "Redom proposals authorization gate" on public.proposals as restrictive for all to authenticated using((select auth.jwt()->'app_metadata'->>'indom_admin')='true') with check((select auth.jwt()->'app_metadata'->>'indom_admin')='true');

-- Passcode-gated access: private definer plus public invoker wrapper.
-- Only an active, unexpired proposal with a matching passcode is returned.
-- The returned JSON never contains its passcode or the client's email.
create schema if not exists redom_private;
revoke all on schema redom_private from public;
grant usage on schema redom_private to anon,authenticated;
create or replace function redom_private.unlock_proposal(requested_slug text,entered_passcode text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare result jsonb;
begin
 if requested_slug is null or entered_passcode is null or length(requested_slug)>100 or length(entered_passcode)>200 or length(trim(entered_passcode))<4 then return null; end if;
 select to_jsonb(p)-'passcode'-'client_email' into result
 from public.proposals p
 where p.slug=requested_slug and p.passcode=entered_passcode
 and p.status='active' and (p.valid_until is null or p.valid_until>=current_date)
 limit 1;
 return result;
end;
$$;
revoke all on function redom_private.unlock_proposal(text,text) from public;
grant execute on function redom_private.unlock_proposal(text,text) to anon,authenticated;
create or replace function public.unlock_proposal(requested_slug text,entered_passcode text)
returns jsonb language sql security invoker set search_path='' as $$
 select redom_private.unlock_proposal(requested_slug,entered_passcode);
$$;
revoke all on function public.unlock_proposal(text,text) from public;
grant execute on function public.unlock_proposal(text,text) to anon,authenticated;

-- 5. Updated timestamps.
create or replace function redom_private.touch_updated_at()
returns trigger language plpgsql security invoker set search_path='' as $$
begin new.updated_at=now();return new;end;
$$;
revoke all on function redom_private.touch_updated_at() from public;
drop trigger if exists redom_projects_updated_at on public.site_projects;
create trigger redom_projects_updated_at before update on public.site_projects for each row execute function redom_private.touch_updated_at();
drop trigger if exists redom_proposals_updated_at on public.proposals;
create trigger redom_proposals_updated_at before update on public.proposals for each row execute function redom_private.touch_updated_at();

-- 6. Authorize the existing owner account only. No other user is promoted.
update auth.users set raw_app_meta_data=coalesce(raw_app_meta_data,'{}'::jsonb)||'{"indom_admin":true}'::jsonb where lower(email)='redomlabs@gmail.com';
-- If zero users were updated, create the user in Authentication > Users,
-- then rerun the file. Sign out and sign in to refresh the admin JWT.
notify pgrst,'reload schema';
commit;

-- Setup verification summary (does not expose messages or passcodes).
select 'contact_settings' as resource,count(*)::bigint as records from public.contact_settings
union all select 'contact_inquiries',count(*) from public.contact_inquiries
union all select 'site_projects',count(*) from public.site_projects
union all select 'proposals',count(*) from public.proposals;
select id,name,public,file_size_limit,allowed_mime_types from storage.buckets where id='site-images';
select email,(raw_app_meta_data->>'indom_admin')::boolean as admin_enabled from auth.users where lower(email)='redomlabs@gmail.com';

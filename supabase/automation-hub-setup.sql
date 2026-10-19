-- Additive, rerunnable. Requires existing crm-team and customer/sales setup.
begin;
-- Upgrade the existing October 19 foundation in place, preserving every row.
-- Legacy calculated fields are retained under legacy_* names.
do $$ begin
 if exists(select 1 from information_schema.columns where table_schema='public' and table_name='automation_leads' and column_name='company_name') then
 alter table public.automation_leads rename column company_name to company;
 alter table public.automation_leads rename column industry to sector;
 alter table public.automation_leads rename column contact_name to decision_maker;
 alter table public.automation_leads rename column contact_role to job_title;
 alter table public.automation_leads rename column contact_email to email;
 alter table public.automation_leads rename column opportunity to needs;
 alter table public.automation_leads rename column recommended_service to service;
 alter table public.automation_leads rename column do_not_contact to suppressed;
 alter table public.automation_leads rename column domain to legacy_domain;
 alter table public.automation_leads rename column score to legacy_score;
 alter table public.automation_leads add column domain text generated always as (regexp_replace(regexp_replace(lower(split_part(split_part(website,'://',2),'/',1)),'^www\.',''),':443$','')) stored;
 create unique index automation_leads_canonical_domain on public.automation_leads(domain) where domain<>'';
 alter table public.automation_leads add column company_size text not null default '',add column phone text not null default '',add column source_url text not null default '',add column notes text not null default '',add column fit integer not null default 0 check(fit between 0 and 40),add column need integer not null default 0 check(need between 0 and 40),add column reach integer not null default 0 check(reach between 0 and 20),add column score integer generated always as(fit+need+reach) stored,add column campaign_id uuid references public.automation_campaigns(id),add column proposal_id text references public.proposals(id),add column revision integer not null default 0;
 alter table public.automation_leads alter column segment set default 'business';
 update public.automation_leads set segment='business' where segment='direct';
 update public.automation_leads set source_url=coalesce(nullif(evidence_url,''),website);
 alter table public.automation_campaigns add column sector text not null default '',add column revision integer not null default 0,add column updated_at timestamptz not null default now();
 alter table public.automation_campaigns drop constraint if exists automation_campaigns_status_check;
 alter table public.automation_campaigns add constraint automation_campaigns_status_check check(status in ('draft','active','paused','stopped','completed'));
 alter table public.automation_messages add column external_id text not null default '',add column revision integer not null default 0,add column updated_at timestamptz not null default now();
 alter table public.automation_messages drop constraint if exists automation_messages_status_check;
 alter table public.automation_messages add constraint automation_messages_status_check check(status in ('draft','approved','sent','replied','positive','cancelled'));
 alter table public.automation_integrations rename column key to id;
 alter table public.automation_integrations rename column last_checked_at to checked_at;
 alter table public.automation_integrations rename column error_text to error_code;
 alter table public.automation_integrations add column capabilities text[] not null default '{}';
 alter table public.automation_jobs rename column job_type to kind;
 alter table public.automation_jobs rename column error_text to error_code;
 alter table public.automation_jobs add column runner_id text,add column heartbeat_at timestamptz,add column attempts integer not null default 0,add column api_units numeric not null default 0,add column credit_units numeric not null default 0;
 alter table public.automation_jobs drop constraint if exists automation_jobs_status_check;
 alter table public.automation_jobs add constraint automation_jobs_status_check check(status in ('queued','running','paused','completed','failed','stopped','cancelled'));
 alter table public.automation_activities rename column event_type to action;
 alter table public.automation_activities add column entity text not null default 'legacy',add column record_id text not null default '',add column source text not null default 'legacy';
 end if;
end $$;
alter table public.admin_staff drop constraint if exists admin_staff_permissions_check;
alter table public.admin_staff add constraint admin_staff_permissions_check check(permissions <@ array['overview','automation','products','work','crm','sales','proposals','inquiries','forms','settings','expenses','finance']::text[]);
create table if not exists public.automation_markets(id text primary key, enabled boolean not null default true, revision integer not null default 0,created_at timestamptz not null default now(),updated_at timestamptz not null default now());
insert into public.automation_markets(id) select code from unnest(array['US','GB','NL','FR','SA','AE','QA','KW','BH','OM','IQ','JO']) code where not exists(select 1 from public.automation_markets m where m.id=code) on conflict do nothing;
create table if not exists public.automation_campaigns(
 id uuid primary key default gen_random_uuid(),name text not null check(length(trim(name)) between 1 and 200),country text references public.automation_markets(id),sector text not null default '' check(length(sector)<=500),service text not null default '' check(length(service)<=500),status text not null default 'draft' check(status in ('draft','active','paused','stopped','completed')),revision integer not null default 0,created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create table if not exists public.automation_leads(
 id uuid primary key default gen_random_uuid(),company text not null check(length(trim(company)) between 1 and 200),website text not null check(website ~ '^https://[^/[:space:]]+\.[^/[:space:]]+'),
 domain text generated always as (regexp_replace(regexp_replace(lower(split_part(split_part(website,'://',2),'/',1)),'^www\.',''),':443$','')) stored unique,
 country text not null references public.automation_markets(id),sector text not null default '',company_size text not null default '',segment text not null default 'business' check(segment in ('agency','business','marketing')),
 decision_maker text not null default '',job_title text not null default '',email text not null default '',phone text not null default '',source text not null default 'manual',source_url text not null check(source_url ~ '^https://'),needs text not null default '' check(length(needs)<=6000),evidence_url text not null default '',service text not null default '',
 fit integer not null default 0 check(fit between 0 and 40),need integer not null default 0 check(need between 0 and 40),reach integer not null default 0 check(reach between 0 and 20),score integer generated always as(fit+need+reach) stored,
 stage text not null default 'new' check(stage in ('new','researching','qualified','draft_ready','approved','contacted','replied','interested','meeting','proposal_sent','won','lost')),
 suppressed boolean not null default false,notes text not null default '' check(length(notes)<=6000),campaign_id uuid references public.automation_campaigns(id) on delete set null,
 crm_customer_id uuid references public.crm_customers(id) on delete set null,proposal_id text references public.proposals(id) on delete set null,last_contact_at timestamptz,
 revision integer not null default 0,created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create index if not exists automation_lead_filters on public.automation_leads(country,campaign_id,created_at);
create table if not exists public.automation_templates(id uuid primary key default gen_random_uuid(),name text not null check(length(trim(name)) between 1 and 200),subject text not null check(length(subject) between 1 and 500),body text not null check(length(body) between 1 and 6000),language text not null default 'en' check(language in ('ar','en')),revision integer not null default 0,created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create table if not exists public.automation_messages(id uuid primary key default gen_random_uuid(),lead_id uuid not null references public.automation_leads(id),campaign_id uuid references public.automation_campaigns(id),subject text not null check(length(trim(subject)) between 1 and 500),body text not null check(length(trim(body)) between 1 and 6000),status text not null default 'draft' check(status in ('draft','approved','sent','replied','positive','cancelled')),external_id text not null default '',sent_at timestamptz,approved_by uuid references auth.users(id),approved_at timestamptz,revision integer not null default 0,created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create table if not exists public.automation_tasks(id uuid primary key default gen_random_uuid(),lead_id uuid not null references public.automation_leads(id),title text not null check(length(trim(title)) between 1 and 500),due_at timestamptz not null,status text not null default 'pending' check(status in ('pending','done','cancelled')),revision integer not null default 0,created_at timestamptz not null default now(),updated_at timestamptz not null default now());
create table if not exists public.automation_social(id uuid primary key default gen_random_uuid(),platform text not null check(platform in ('facebook','instagram','linkedin','other')),body text not null check(length(trim(body)) between 1 and 6000),scheduled_at timestamptz,status text not null default 'draft' check(status in ('draft','planned','published')),external_url text not null default '',revision integer not null default 0,created_at timestamptz not null default now(),updated_at timestamptz not null default now(),check(status<>'published' or external_url ~ '^https://'));
-- Integration state is verified by future adapters, never entered as an arbitrary Connected toggle.
create table if not exists public.automation_integrations(id text primary key,status text not null default 'disconnected' check(status in ('disconnected','connected','error')),checked_at timestamptz,error_code text, capabilities text[] not null default '{}');
insert into public.automation_integrations(id) select unnest(array['apollo','gmail','metricool','n8n','meta_ads']) on conflict do nothing;
create table if not exists public.automation_jobs(id uuid primary key default gen_random_uuid(),campaign_id uuid references public.automation_campaigns(id),kind text not null,status text not null check(status in ('queued','running','paused','completed','failed','stopped')),runner_id text,heartbeat_at timestamptz,attempts integer not null default 0,api_units numeric not null default 0,credit_units numeric not null default 0,error_code text,created_at timestamptz not null default now(),check(status<>'running' or (runner_id is not null and heartbeat_at is not null)));
create table if not exists public.automation_activities(id uuid primary key default gen_random_uuid(),entity text not null,record_id text not null,action text not null,actor_id uuid,source text not null default 'dashboard_manual',created_at timestamptz not null default now());
create index if not exists automation_activity_time on public.automation_activities(created_at desc);
-- Explicit grants and database authorization, including direct REST calls.
do $$ declare t text; begin
 foreach t in array array['markets','campaigns','leads','templates','messages','tasks','social','integrations','jobs','activities'] loop
 execute format('alter table public.automation_%I enable row level security',t);
 execute format('revoke all on public.automation_%I from anon,authenticated',t);
 execute format('grant select on public.automation_%I to authenticated',t);
 execute format('drop policy if exists automation_staff_access on public.automation_%I',t);
 execute format('drop policy if exists automation_read on public.automation_%I',t);
 execute format('create policy automation_read on public.automation_%I for select to authenticated using((select redom_private.has_access(''automation'')))',t);
 if t not in ('integrations','jobs','activities') then
 execute format('grant insert,update on public.automation_%I to authenticated',t);
 execute format('drop policy if exists automation_write on public.automation_%I',t);
 execute format('create policy automation_write on public.automation_%I for all to authenticated using((select redom_private.has_access(''automation''))) with check((select redom_private.has_access(''automation'')))',t);
 end if;
 end loop;
end $$;
create or replace function redom_private.automation_audit() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if not redom_private.has_access('automation') then raise exception 'Unauthorized'; end if;
 if tg_op='UPDATE' then new.revision=old.revision+1;new.created_at=old.created_at; end if;
 new.updated_at=now();
 if tg_table_name='automation_campaigns' then
 if (tg_op='INSERT' or new.country is distinct from old.country) and not exists(select 1 from public.automation_markets where id=new.country and enabled) then raise exception 'Market disabled';end if;end if;
 insert into public.automation_activities(entity,record_id,action,actor_id,source) values(tg_table_name,new.id::text,lower(tg_op),auth.uid(),'dashboard_manual');
 return new;
end $$;
revoke all on function redom_private.automation_audit() from public,anon,authenticated;
do $$ declare t text;begin foreach t in array array['markets','campaigns','leads','templates','messages','tasks','social'] loop
 execute format('drop trigger if exists automation_audit on public.automation_%I',t);
 execute format('create trigger automation_audit before insert or update on public.automation_%I for each row execute function redom_private.automation_audit()',t);
end loop;end $$;
create or replace function redom_private.automation_guard() returns trigger language plpgsql security definer set search_path='' as $$
declare l public.automation_leads; begin
 if not redom_private.has_access('automation') then raise exception 'Unauthorized'; end if;
 select * into l from public.automation_leads where id=new.lead_id for update;
 if tg_table_name='automation_messages' then
 if tg_op='INSERT' and new.status<>'draft' then raise exception 'Create a draft first';end if;
 if new.status in ('approved','sent') and (l.suppressed or l.stage in ('replied','interested','meeting','proposal_sent','won','lost')) then raise exception 'Contact blocked';end if;
 if new.status='sent' and (tg_op='INSERT' or old.status<>'approved' or new.external_id='' or new.sent_at is null or new.body<>old.body or new.subject<>old.subject) then raise exception 'Approval and external send reference required';end if;
 if tg_op='UPDATE' and old.status in ('sent','replied','positive') and (new.body<>old.body or new.subject<>old.subject or new.lead_id<>old.lead_id or new.sent_at is distinct from old.sent_at or new.external_id<>old.external_id or new.status not in ('sent','replied','positive')) then raise exception 'Sent evidence is immutable';end if;
 if new.status='approved' then
 if tg_op='UPDATE' and old.status='approved' and (new.body<>old.body or new.subject<>old.subject or new.lead_id<>old.lead_id) then new.status='draft';new.approved_by=null;new.approved_at=null;
 else new.approved_by=auth.uid();new.approved_at=now();end if;
 elsif new.status='draft' then new.approved_by=null;new.approved_at=null;
 end if;
 if tg_op='UPDATE' and new.status in ('sent','replied','positive') then new.approved_by=old.approved_by;new.approved_at=old.approved_at;end if;
 if new.status='sent' then update public.automation_leads set stage='contacted',last_contact_at=new.sent_at where id=new.lead_id;end if;
 if new.status in ('replied','positive') then update public.automation_leads set stage=case when new.status='positive' then 'interested' else 'replied' end where id=new.lead_id;end if;
 else
 if new.status='pending' and (l.suppressed or l.stage in ('replied','interested','meeting','proposal_sent','won','lost')) then raise exception 'Follow-up blocked';end if;
 end if;
 return new;
end $$;
revoke all on function redom_private.automation_guard() from public,anon,authenticated;
drop trigger if exists automation_guard on public.automation_messages;
create trigger automation_guard before insert or update on public.automation_messages for each row execute function redom_private.automation_guard();
drop trigger if exists automation_guard on public.automation_tasks;
create trigger automation_guard before insert or update on public.automation_tasks for each row execute function redom_private.automation_guard();
create or replace function redom_private.automation_lead_guard() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if not redom_private.has_access('automation') then raise exception 'Unauthorized';end if;
 if (tg_op='INSERT' or new.country is distinct from old.country) and not exists(select 1 from public.automation_markets where id=new.country and enabled) then raise exception 'Market disabled';end if;
 if new.need>0 and (new.evidence_url !~ '^https://' or trim(new.needs)='') then raise exception 'Evidence required for need score';end if;
 if tg_op='UPDATE' and (new.crm_customer_id is distinct from old.crm_customer_id) and not redom_private.has_access('crm') then raise exception 'CRM access required';end if;
 if tg_op='UPDATE' and (new.proposal_id is distinct from old.proposal_id) and not redom_private.has_access('proposals') then raise exception 'Proposal access required';end if;
 if tg_op='INSERT' and (new.crm_customer_id is not null or new.proposal_id is not null) then raise exception 'Link existing records after creation';end if;
 if tg_op='UPDATE' and (new.suppressed or new.stage in ('replied','interested','meeting','proposal_sent','won','lost')) then
 update public.automation_messages set status='cancelled' where lead_id=new.id and status in ('draft','approved');
 update public.automation_tasks set status='cancelled' where lead_id=new.id and status='pending';
 end if;
 return new;
end $$;
revoke all on function redom_private.automation_lead_guard() from public,anon,authenticated;
drop trigger if exists automation_lead_guard on public.automation_leads;
create trigger automation_lead_guard before insert or update on public.automation_leads for each row execute function redom_private.automation_lead_guard();
create index if not exists automation_leads_campaign on public.automation_leads(campaign_id);
create index if not exists automation_leads_crm on public.automation_leads(crm_customer_id);
create index if not exists automation_leads_proposal on public.automation_leads(proposal_id);
create index if not exists automation_messages_lead on public.automation_messages(lead_id);
create index if not exists automation_messages_campaign on public.automation_messages(campaign_id);
create index if not exists automation_messages_actor on public.automation_messages(approved_by);
create index if not exists automation_tasks_due on public.automation_tasks(due_at) where status='pending';
create index if not exists automation_tasks_lead on public.automation_tasks(lead_id);
create index if not exists automation_jobs_campaign on public.automation_jobs(campaign_id);
do $$ begin if to_regprocedure('public.automation_is_allowed()') is not null then execute 'revoke all on function public.automation_is_allowed() from public,anon,authenticated';end if;end $$;
commit;

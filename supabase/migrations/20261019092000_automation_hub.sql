-- Redom Automation Hub: additive migration, no existing customer data changed.
create table if not exists public.automation_leads (
 id uuid primary key default gen_random_uuid(),
 company_name text not null check (char_length(company_name) between 1 and 200),
 website text not null default '',
 domain text not null default '',
 country text not null default '',
 industry text not null default '',
 segment text not null default 'direct',
 contact_name text not null default '',
 contact_role text not null default '',
 contact_email text not null default '',
 source text not null default 'manual',
 evidence_url text not null default '',
 opportunity text not null default '',
 recommended_service text not null default '',
 score integer not null default 0 check (score between 0 and 100),
 stage text not null default 'new' check (stage in ('new','researching','qualified','draft_ready','approved','contacted','replied','interested','meeting','proposal_sent','won','lost')),
 do_not_contact boolean not null default false,
 last_contact_at timestamptz,
 crm_customer_id uuid,
 created_by uuid default auth.uid(),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);
create unique index if not exists automation_leads_domain_unique on public.automation_leads (lower(domain)) where domain <> '';
create index if not exists automation_leads_stage_idx on public.automation_leads(stage,created_at desc);
create table if not exists public.automation_campaigns (
 id uuid primary key default gen_random_uuid(),
 name text not null check (char_length(name) between 1 and 200),
 country text not null default '',
 segment text not null default '',
 service text not null default '',
 status text not null default 'draft' check(status in ('draft','paused','active','completed')),
 created_by uuid default auth.uid(),
 created_at timestamptz not null default now()
);
create table if not exists public.automation_messages (
 id uuid primary key default gen_random_uuid(),
 lead_id uuid not null references public.automation_leads(id) on delete cascade,
 campaign_id uuid references public.automation_campaigns(id) on delete set null,
 subject text not null default '',
 body text not null default '',
 status text not null default 'draft' check(status in ('draft','approved','sent','replied','cancelled')),
 approved_by uuid,
 approved_at timestamptz,
 sent_at timestamptz,
 created_at timestamptz not null default now()
);
create table if not exists public.automation_jobs (
 id uuid primary key default gen_random_uuid(),
 campaign_id uuid references public.automation_campaigns(id) on delete set null,
 job_type text not null,
 status text not null default 'queued' check(status in ('queued','running','paused','completed','failed','cancelled')),
 provider text not null default 'manual',
 details jsonb not null default '{}'::jsonb,
 error_text text,
 created_at timestamptz not null default now(),
 started_at timestamptz,
 finished_at timestamptz
);
create table if not exists public.automation_activities (
 id uuid primary key default gen_random_uuid(),
 lead_id uuid references public.automation_leads(id) on delete set null,
 campaign_id uuid references public.automation_campaigns(id) on delete set null,
 actor_id uuid default auth.uid(),
 event_type text not null,
 details jsonb not null default '{}'::jsonb,
 created_at timestamptz not null default now()
);
create table if not exists public.automation_integrations (
 key text primary key,
 status text not null default 'disconnected' check(status in ('connected','disconnected','error')),
 last_checked_at timestamptz,
 error_text text,
 updated_at timestamptz not null default now()
);
-- Ensure RLS: only owners or explicitly authorized active staff may access automation data.
create or replace function public.automation_is_allowed()
returns boolean language sql stable security definer set search_path = '' as $$
 select exists(select 1 from auth.users u where u.id=auth.uid() and u.raw_app_meta_data->>'indom_admin'='true')
 or exists(select 1 from public.admin_staff s where s.user_id=auth.uid() and s.active=true and 'automation'=any(s.permissions));
$$;
revoke all on function public.automation_is_allowed() from public;
grant execute on function public.automation_is_allowed() to authenticated;
alter table public.automation_leads enable row level security;
alter table public.automation_campaigns enable row level security;
alter table public.automation_messages enable row level security;
alter table public.automation_jobs enable row level security;
alter table public.automation_activities enable row level security;
alter table public.automation_integrations enable row level security;
do $$ declare t text; begin
 foreach t in array array['automation_leads','automation_campaigns','automation_messages','automation_jobs','automation_activities','automation_integrations'] loop
  execute format('drop policy if exists automation_staff_access on public.%I',t);
  execute format('create policy automation_staff_access on public.%I for all to authenticated using ((select public.automation_is_allowed())) with check ((select public.automation_is_allowed()))',t);
 end loop;
end $$;
revoke all on public.automation_leads,public.automation_campaigns,public.automation_messages,public.automation_jobs,public.automation_activities,public.automation_integrations from anon;
grant select,insert,update,delete on public.automation_leads,public.automation_campaigns,public.automation_messages,public.automation_jobs,public.automation_activities to authenticated;
grant select on public.automation_integrations to authenticated;

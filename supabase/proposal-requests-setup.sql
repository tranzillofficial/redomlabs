-- Catalog configuration stays inside the existing proposals.sections document.
create table if not exists public.proposal_requests (
 id uuid primary key,
 proposal_slug text not null,
 client_name text not null,
 contact_name text not null check(length(trim(contact_name)) between 1 and 100),
 phone text not null check(phone ~ '^[+0-9 ()-]{7,40}$'),
 notes text not null default '' check(length(notes)<=2000),
 business_type text not null check(business_type in ('restaurant','company','store','other')),
 currency text not null,
 sections jsonb not null check(jsonb_typeof(sections)='array'),
 locale text not null check(locale in ('ar','en')),
 created_at timestamptz not null default now()
);
alter table public.proposal_requests enable row level security;
revoke all on public.proposal_requests from anon,authenticated;
grant select on public.proposal_requests to authenticated;
drop policy if exists "Admin proposal request inbox" on public.proposal_requests;
create policy "Admin proposal request inbox" on public.proposal_requests for select to authenticated using((select auth.jwt()->'app_metadata'->>'indom_admin')='true');
create index if not exists proposal_requests_created_at on public.proposal_requests(created_at desc);
create index if not exists proposal_requests_phone_time on public.proposal_requests(proposal_slug,phone,created_at desc);

-- A private definer is necessary for passcode-authorized visitors without Auth accounts.
-- The public wrapper is an invoker. No direct INSERT or client price inputs are accepted.
create or replace function redom_private.submit_proposal_request(requested_slug text,entered_passcode text,selected_ids text[],requested_business text,contact_name text,contact_phone text,additional_notes text,request_locale text,request_id uuid)
returns uuid language plpgsql security definer set search_path='' as $$
declare p public.proposals%rowtype; snapshot jsonb; result_id uuid;
begin
 if requested_slug is null or length(requested_slug)>100 or entered_passcode is null or length(entered_passcode)>200 or requested_business is null or requested_business not in ('restaurant','company','store','other') or contact_name is null or length(trim(contact_name)) not between 1 and 100 or contact_phone is null or contact_phone !~ '^[+0-9 ()-]{7,40}$' or length(regexp_replace(contact_phone,'[^0-9]','','g'))<7 or additional_notes is null or length(additional_notes)>2000 or request_locale is null or request_locale not in ('ar','en') or request_id is null or selected_ids is null or cardinality(selected_ids) not between 1 and 30 or array_position(selected_ids,null) is not null then return null; end if;
 select * into p from public.proposals where slug=requested_slug and passcode=entered_passcode and status='active' and (nullif(valid_until::text,'') is null or nullif(valid_until::text,'')::date>=current_date) for share;
 if p.id is null then return null; end if;
 if not exists(select 1 from jsonb_array_elements(p.sections::jsonb) s where s->>'catalog'='true') then return null; end if;
 select jsonb_agg((s - 'businessVariants') || coalesce(s->'businessVariants'->requested_business,'{}'::jsonb) order by ord)
 into snapshot from jsonb_array_elements(p.sections::jsonb) with ordinality as item(s,ord)
 where s->>'id'=any(selected_ids) and coalesce(s->>'enabled','true')='true';
 if snapshot is null or jsonb_array_length(snapshot)<>(select count(distinct x) from unnest(selected_ids) x) then return null; end if;
 -- Serialize per proposal/phone to enforce the direct-RPC hourly limit.
 perform pg_advisory_xact_lock(hashtextextended(requested_slug||contact_phone,0));
 select id into result_id from public.proposal_requests r where r.id=request_id and r.proposal_slug=requested_slug and r.phone=contact_phone;
 if result_id is not null then return result_id; end if;
 if (select count(*) from public.proposal_requests where proposal_slug=requested_slug and phone=contact_phone and created_at>now()-interval '1 hour')>=5 then return null; end if;
 insert into public.proposal_requests(id,proposal_slug,client_name,contact_name,phone,notes,business_type,currency,sections,locale)
 values(request_id,p.slug,p.client_name,trim(contact_name),contact_phone,additional_notes,requested_business,p.currency,snapshot,request_locale)
 on conflict(id) do nothing returning id into result_id;
 return result_id;
end;
$$;
revoke all on function redom_private.submit_proposal_request(text,text,text[],text,text,text,text,text,uuid) from public;
grant execute on function redom_private.submit_proposal_request(text,text,text[],text,text,text,text,text,uuid) to anon,authenticated;
create or replace function public.submit_proposal_request(requested_slug text,entered_passcode text,selected_ids text[],requested_business text,contact_name text,contact_phone text,additional_notes text,request_locale text,request_id uuid)
returns uuid language sql security invoker set search_path='' as $$
 select redom_private.submit_proposal_request(requested_slug,entered_passcode,selected_ids,requested_business,contact_name,contact_phone,additional_notes,request_locale,request_id);
$$;
revoke all on function public.submit_proposal_request(text,text,text[],text,text,text,text,text,uuid) from public;
grant execute on function public.submit_proposal_request(text,text,text[],text,text,text,text,text,uuid) to anon,authenticated;

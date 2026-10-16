-- Apply after invoice-customer-setup.sql. Existing customers retain a blank optional number.
begin;
alter table public.crm_customers add column if not exists phone_secondary text not null default '';
alter table public.crm_customers add column if not exists phone_secondary_name text not null default '';
alter table public.crm_customers add constraint crm_customers_phone_secondary_name_check check(length(phone_secondary_name)<=100 and (phone_secondary<>'' or phone_secondary_name=''));
alter table public.crm_customers add constraint crm_customers_phone_secondary_check check(phone_secondary='' or (phone_secondary ~ '^[+0-9 ()-]{7,40}$' and length(regexp_replace(phone_secondary,'[^0-9]','','g'))>=7));
create or replace function redom_private.crm_safe_list(page_number integer,search_term text,stage_filter text) returns jsonb language plpgsql stable security definer set search_path='' as $$
declare result jsonb;
begin
 if auth.uid() is null or not redom_private.has_access('crm') then raise insufficient_privilege; end if;
 if page_number<0 or page_number>100000 or length(search_term)>200 or stage_filter not in ('all','customer','potential','follow_up') then raise exception 'Invalid filter'; end if;
 with filtered as (select c.* from public.crm_customers c where (stage_filter='all' or stage=stage_filter) and (search_term='' or concat_ws(' ',name,phone,phone_secondary,business_name,service_name) ilike '%'||search_term||'%')),
 page as (select * from filtered order by created_at desc,id desc offset page_number*50 limit 50)
 select jsonb_build_object('count',(select count(*) from filtered),'data',coalesce((select jsonb_agg((to_jsonb(p)-array['total_amount','paid_amount','remaining_amount','currency'])||'{"total_amount":0,"paid_amount":0,"remaining_amount":0,"currency":"EGP"}'::jsonb ) from page p),'[]'::jsonb)) into result;
 return result;
end $$;
create or replace function redom_private.sales_list(page_number integer,search_term text,stage_filter text) returns jsonb language plpgsql stable security definer set search_path='' as $$
declare result jsonb;
begin
 if auth.uid() is null or (not redom_private.has_access('sales') or not redom_private.has_access('finance')) then raise insufficient_privilege; end if;
 if page_number<0 or page_number>100000 or length(search_term)>200 or stage_filter not in ('all','customer','potential','follow_up') then raise exception 'Invalid filter'; end if;
 with filtered as (select c.* from public.crm_customers c where (stage_filter='all' or stage=stage_filter) and (search_term='' or concat_ws(' ',name,phone,phone_secondary,business_name,service_name) ilike '%'||search_term||'%')),
 page as (select * from filtered order by created_at desc,id desc offset page_number*50 limit 50)
 select jsonb_build_object('count',(select count(*) from filtered),'data',coalesce((select jsonb_agg(case when redom_private.has_access('finance') then to_jsonb(p) else (to_jsonb(p)-array['total_amount','paid_amount','remaining_amount','currency'])||'{"total_amount":0,"paid_amount":0,"remaining_amount":0,"currency":"EGP"}'::jsonb end) from page p),'[]'::jsonb)) into result;
 return result;
end $$;

create or replace function redom_private.crm_safe_save(payload jsonb) returns void language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null or not redom_private.has_access('crm') then raise insufficient_privilege; end if;
 insert into public.crm_customers(id,name,phone,phone_secondary,phone_secondary_name,business_name,service_name,notes,stage,follow_up_date)
 values((payload->>'id')::uuid,trim(payload->>'name'),payload->>'phone',btrim(coalesce(payload->>'phone_secondary','')),btrim(coalesce(payload->>'phone_secondary_name','')),coalesce(payload->>'business_name',''),payload->>'service_name',coalesce(payload->>'notes',''),payload->>'stage',nullif(payload->>'follow_up_date','')::date)
 on conflict(id) do update set name=excluded.name,phone=excluded.phone,phone_secondary=case when payload ? 'phone_secondary' then excluded.phone_secondary else public.crm_customers.phone_secondary end,phone_secondary_name=case when payload ? 'phone_secondary_name' then excluded.phone_secondary_name when payload ? 'phone_secondary' and excluded.phone_secondary='' then '' else public.crm_customers.phone_secondary_name end,business_name=excluded.business_name,service_name=excluded.service_name,notes=excluded.notes,stage=excluded.stage,follow_up_date=excluded.follow_up_date,updated_at=now();
end $$;
create or replace function redom_private.create_sales_invoice_with_customer(payload jsonb) returns jsonb
language plpgsql security definer set search_path='' as $$
declare customer uuid; invoice_id uuid; n jsonb; inv public.sales_invoices; c public.crm_customers;
begin
 if auth.uid() is null or not redom_private.has_access('sales') or not redom_private.has_access('finance') or not redom_private.has_access('crm') then raise insufficient_privilege;end if;
 customer=(payload->>'customer_id')::uuid;invoice_id=(payload->>'id')::uuid;n=payload->'new_customer';
 if customer is null or invoice_id is null or jsonb_typeof(n) is distinct from 'object' or jsonb_typeof(n->'name') is distinct from 'string' or length(btrim(n->>'name')) not between 1 and 100 or jsonb_typeof(n->'phone') is distinct from 'string' or (n->>'phone') !~ '^[+0-9 ()-]{7,40}$' or jsonb_typeof(n->'business_name') is distinct from 'string' or length(n->>'business_name')>200 then raise exception 'Invalid customer';end if;
 -- Same retry/customer ID serializes concurrent submissions before either insert.
 perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(customer::text,0));
 select * into inv from public.sales_invoices where id=invoice_id;
 if found then
  if inv.created_by<>auth.uid() or inv.customer_id<>customer then raise exception 'Retry mismatch';end if;
  return redom_private.create_sales_invoice(payload);
 end if;
 -- Never overwrite or attach a supplied new identity to an existing customer.
 if exists(select 1 from public.crm_customers where id=customer) then raise exception 'Customer already exists';end if;
 insert into public.crm_customers(id,name,phone,phone_secondary,phone_secondary_name,business_name,service_name,stage,currency,total_amount,paid_amount,notes)
 values(customer,btrim(n->>'name'),n->>'phone',btrim(coalesce(n->>'phone_secondary','')),btrim(coalesce(n->>'phone_secondary_name','')),btrim(n->>'business_name'),'—','customer',payload->>'currency',0,0,'');
 return redom_private.create_sales_invoice(payload);
end $$;
notify pgrst,'reload schema';
commit;

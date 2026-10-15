-- Apply after customers-sales-setup.sql. Existing account balances are retained.
begin;
create table if not exists public.sales_invoices (
 id uuid primary key,
 invoice_number bigint generated always as identity unique,
 customer_id uuid not null references public.crm_customers(id) on delete restrict,
 description text not null check(length(btrim(description)) between 1 and 300),
 amount numeric(14,2) not null check(amount>0),
 paid_amount numeric(14,2) not null check(paid_amount>=0 and paid_amount<=amount),
 currency text not null check(currency in ('EGP','USD','SAR','AED','GBP','EUR')),
 issued_on date not null,
 created_by uuid not null,
 created_by_name text not null,
 created_at timestamptz not null default now()
);
create index if not exists sales_invoices_customer_date on public.sales_invoices(customer_id,issued_on desc,created_at desc,id);
alter table public.sales_invoices enable row level security;
revoke all on public.sales_invoices from anon,authenticated;
grant select on public.sales_invoices to authenticated;
drop policy if exists "Sales invoice readers" on public.sales_invoices;
create policy "Sales invoice readers" on public.sales_invoices for select to authenticated using((select redom_private.has_access('sales') and redom_private.has_access('finance')));
create or replace function redom_private.create_sales_invoice(payload jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare c public.crm_customers; inv public.sales_invoices; invoice_id uuid; customer uuid; value numeric; paid numeric; cur text; detail text; issued date; actor_name text;
begin
 if auth.uid() is null or not redom_private.has_access('sales') or not redom_private.has_access('finance') then raise insufficient_privilege; end if;
 invoice_id=(payload->>'id')::uuid; customer=(payload->>'customer_id')::uuid;
 value=(payload->>'amount')::numeric;paid=(payload->>'paid_amount')::numeric;cur=payload->>'currency';detail=btrim(payload->>'description');issued=(payload->>'issued_on')::date;
 if invoice_id is null or customer is null or value is null or paid is null or value::text in ('NaN','Infinity','-Infinity') or paid::text in ('NaN','Infinity','-Infinity') or value<=0 or value>999999999999.99 or paid<0 or paid>value or round(value,2)<>value or round(paid,2)<>paid or cur is null or cur not in ('EGP','USD','SAR','AED','GBP','EUR') or detail is null or length(detail) not between 1 and 300 or issued is null or issued not between date '1900-01-01' and date '2100-12-31' then raise exception 'Invalid invoice';end if;
 -- Serialize by customer. Retry IDs never increment the account twice.
 select * into c from public.crm_customers where id=customer for update;
 if not found then raise exception 'Customer not found';end if;
 select * into inv from public.sales_invoices where id=invoice_id;
 if found then
  if inv.customer_id<>customer or inv.amount<>value or inv.paid_amount<>paid or inv.currency<>cur or inv.description<>detail or inv.issued_on<>issued or inv.created_by<>auth.uid() then raise exception 'Retry mismatch';end if;
  return jsonb_build_object('id',inv.id,'invoice_number',inv.invoice_number);
 end if;
 if c.currency<>cur and (c.total_amount<>0 or c.paid_amount<>0 or exists(select 1 from public.sales_invoices where customer_id=customer)) then raise exception 'Currency mismatch';end if;
 select coalesce((select name from public.admin_staff where user_id=auth.uid()),(select email from auth.users where id=auth.uid()),'Admin') into actor_name;
 insert into public.sales_invoices(id,customer_id,description,amount,paid_amount,currency,issued_on,created_by,created_by_name) values(invoice_id,customer,detail,value,paid,cur,issued,auth.uid(),actor_name) returning * into inv;
 update public.crm_customers set total_amount=total_amount+value,paid_amount=paid_amount+paid,currency=cur,service_name=detail,updated_at=clock_timestamp() where id=customer;
 return jsonb_build_object('id',inv.id,'invoice_number',inv.invoice_number);
end $$;
create or replace function public.create_sales_invoice(payload jsonb) returns jsonb language sql security invoker set search_path='' as $$select redom_private.create_sales_invoice(payload)$$;
revoke all on function redom_private.create_sales_invoice(jsonb),public.create_sales_invoice(jsonb) from public,anon;
grant execute on function redom_private.create_sales_invoice(jsonb),public.create_sales_invoice(jsonb) to authenticated;
-- Once invoices exist, account currency cannot reinterpret their balances.
create or replace function redom_private.keep_invoice_currency() returns trigger language plpgsql security definer set search_path='' as $$
begin
 if new.currency<>old.currency and exists(select 1 from public.sales_invoices where customer_id=old.id and currency<>new.currency) then raise exception 'Currency mismatch';end if;
 return new;
end $$;
revoke all on function redom_private.keep_invoice_currency() from public,anon,authenticated;
drop trigger if exists keep_invoice_currency on public.crm_customers;
create trigger keep_invoice_currency before update of currency on public.crm_customers for each row execute function redom_private.keep_invoice_currency();
notify pgrst,'reload schema';
commit;

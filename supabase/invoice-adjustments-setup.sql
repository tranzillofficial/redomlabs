-- Apply after sales-invoices-setup.sql and invoice-archival-setup.sql.
-- Existing invoices and cumulative/legacy account balances are preserved.
begin;
alter table public.sales_invoices add column if not exists discount_amount numeric(14,2) not null default 0;
alter table public.sales_invoices add column if not exists net_amount numeric(14,2) generated always as (amount-discount_amount) stored;
alter table public.sales_invoices add column if not exists revision integer not null default 1;
alter table public.sales_invoices add column if not exists updated_by_name text not null default '';
alter table public.company_expenses add column if not exists revision integer not null default 1;
alter table public.company_expenses add column if not exists updated_by_name text not null default '';
do $$begin
 if not exists(select 1 from pg_constraint where conrelid='public.sales_invoices'::regclass and conname='invoice_discount_valid') then
  alter table public.sales_invoices add constraint invoice_discount_valid check(discount_amount>=0 and discount_amount<=amount and paid_amount<=net_amount);
 end if;
end $$;
create table if not exists redom_private.financial_changes(
 mutation_id uuid primary key, kind text not null, record_id uuid not null,
 actor_id uuid not null,actor_name text not null,changed_at timestamptz not null default clock_timestamp(),
 request jsonb not null,before_value jsonb not null,after_value jsonb not null
);
alter table redom_private.financial_changes enable row level security;
revoke all on redom_private.financial_changes from public,anon,authenticated;
create or replace function redom_private.edit_invoice(payload jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare sale public.sales_invoices; bill public.company_expenses; account public.crm_customers; old_value jsonb; new_value jsonb; prior redom_private.financial_changes;
 kind text:=payload->>'type'; ident uuid:=(payload->>'id')::uuid; mutation uuid:=(payload->>'mutation_id')::uuid; expected integer:=(payload->>'revision')::integer;
 value numeric:=(payload->>'amount')::numeric; discount numeric:=coalesce((payload->>'discount_amount')::numeric,0); paid numeric:=coalesce((payload->>'paid_amount')::numeric,0);
 detail text:=btrim(payload->>'description'); issued date:=(payload->>'date')::date; actor text; customer uuid; total numeric; received numeric;
begin
 if auth.uid() is null or not redom_private.has_access('finance') or kind not in ('sales','purchases') or kind is null then raise insufficient_privilege;end if;
 if (kind='sales' and not redom_private.has_access('sales')) or (kind='purchases' and not redom_private.has_access('expenses')) then raise insufficient_privilege;end if;
 if ident is null or mutation is null or expected is null or expected<1 or value is null or value::text in ('NaN','Infinity','-Infinity') or value<=0 or value>999999999999.99 or round(value,2)<>value or detail is null or length(detail) not between 1 and (case when kind='sales' then 300 else 1000 end) or issued is null or issued not between date '1900-01-01' and date '2100-12-31' then raise exception 'Invalid invoice';end if;
 -- Same lock order as creation: customer, then invoice. Identity/currency never change.
 if kind='sales' then
  select customer_id into customer from public.sales_invoices where id=ident and not archived;
  if customer is null then raise exception 'Invoice not found';end if;
  select * into account from public.crm_customers where id=customer for update;
  select * into sale from public.sales_invoices where id=ident and not archived for update;
  if not found then raise exception 'Invoice not found';end if;
 else
  select * into bill from public.company_expenses where id=ident for update;
  if not found then raise exception 'Invoice not found';end if;
 end if;
 select * into prior from redom_private.financial_changes where mutation_id=mutation;
 if found then
  if prior.actor_id<>auth.uid() or prior.kind<>kind or prior.record_id<>ident or prior.request<>payload then raise exception 'Retry mismatch';end if;
  return jsonb_build_object('ok',true);
 end if;
 select coalesce((select name from public.admin_staff where user_id=auth.uid()),(select email from auth.users where id=auth.uid()),'Admin') into actor;
 if kind='sales' then
  if sale.revision<>expected then raise exception 'Conflict';end if;
  if discount::text in ('NaN','Infinity','-Infinity') or paid::text in ('NaN','Infinity','-Infinity') or discount<0 or discount>value or paid<0 or paid>value-discount or round(discount,2)<>discount or round(paid,2)<>paid then raise exception 'Invalid invoice';end if;
  total:=account.total_amount+(value-discount)-sale.net_amount;received:=account.paid_amount+paid-sale.paid_amount;
  if total<0 or received<0 or received>total or total>999999999999.99 then raise exception 'Account balance conflict';end if;
  old_value:=to_jsonb(sale);
  update public.sales_invoices set description=detail,amount=value,discount_amount=discount,paid_amount=paid,issued_on=issued,revision=revision+1,updated_by_name=actor where id=ident returning to_jsonb(sales_invoices.*) into new_value;
  update public.crm_customers set total_amount=total,paid_amount=received,updated_at=clock_timestamp() where id=customer;
 else
  if bill.revision<>expected then raise exception 'Conflict';end if;
  if payload->>'category' is null or payload->>'category' not in ('ads','freelance','salary','server','domain','other') then raise exception 'Invalid category';end if;
  old_value:=to_jsonb(bill);
  update public.company_expenses set purpose=detail,amount=value,category=payload->>'category',spent_on=issued,revision=revision+1,updated_by_name=actor where id=ident returning to_jsonb(company_expenses.*) into new_value;
 end if;
 insert into redom_private.financial_changes(mutation_id,kind,record_id,actor_id,actor_name,request,before_value,after_value) values(mutation,kind,ident,auth.uid(),actor,payload,old_value,new_value);
 return jsonb_build_object('ok',true);
end $$;
create or replace function public.edit_invoice(payload jsonb) returns jsonb language sql security invoker set search_path='' as $$select redom_private.edit_invoice(payload)$$;
create or replace function redom_private.update_customer_payment(payload jsonb) returns jsonb language plpgsql security definer set search_path='' as $$
declare account public.crm_customers; prior redom_private.financial_changes; mutation uuid:=(payload->>'mutation_id')::uuid;ident uuid:=(payload->>'id')::uuid;paid numeric:=(payload->>'paid_amount')::numeric; actor text; after_row jsonb;
begin
 if auth.uid() is null or not redom_private.has_access('sales') or not redom_private.has_access('finance') then raise insufficient_privilege;end if;
 if mutation is null or ident is null or paid is null or paid::text in ('NaN','Infinity','-Infinity') or paid<0 or round(paid,2)<>paid then raise exception 'Invalid payment';end if;
 select * into account from public.crm_customers where id=ident for update;
 if not found then raise exception 'Customer not found';end if;
 select * into prior from redom_private.financial_changes where mutation_id=mutation;
 if found then
  if prior.actor_id<>auth.uid() or prior.kind<>'payment' or prior.record_id<>ident or prior.request<>payload then raise exception 'Retry mismatch';end if;
  return jsonb_build_object('ok',true);
 end if;
 if payload->>'updated_at' is null or (payload->>'updated_at')::timestamptz<>account.updated_at then raise exception 'Conflict';end if;
 if paid>account.total_amount then raise exception 'Invalid payment';end if;
 select coalesce((select name from public.admin_staff where user_id=auth.uid()),(select email from auth.users where id=auth.uid()),'Admin') into actor;
 update public.crm_customers set paid_amount=paid,updated_at=clock_timestamp() where id=ident returning to_jsonb(crm_customers.*) into after_row;
 insert into redom_private.financial_changes(mutation_id,kind,record_id,actor_id,actor_name,request,before_value,after_value) values(mutation,'payment',ident,auth.uid(),actor,payload,to_jsonb(account),after_row);
 return jsonb_build_object('ok',true);
end $$;
create or replace function public.update_customer_payment(payload jsonb) returns jsonb language sql security invoker set search_path='' as $$select redom_private.update_customer_payment(payload)$$;
revoke all on function redom_private.edit_invoice(jsonb),public.edit_invoice(jsonb),redom_private.update_customer_payment(jsonb),public.update_customer_payment(jsonb) from public,anon;
grant execute on function redom_private.edit_invoice(jsonb),public.edit_invoice(jsonb),redom_private.update_customer_payment(jsonb),public.update_customer_payment(jsonb) to authenticated;
-- Add optional creation discounts while retaining archived retry/currency protections.
do $$declare f text;begin
 select pg_get_functiondef('redom_private.create_sales_invoice(jsonb)'::regprocedure) into f;
 if position('discount_value' in f)=0 then
  f:=replace(f,'actor_name text;','actor_name text; discount_value numeric:=coalesce((payload->>''discount_amount'')::numeric,0);');
  f:=replace(f,'-- Serialize by customer.',E'if discount_value::text in (''NaN'',''Infinity'',''-Infinity'') or discount_value<0 or discount_value>value or round(discount_value,2)<>discount_value or paid>value-discount_value then raise exception ''Invalid discount'';end if;\n -- Serialize by customer.');
  f:=replace(f,'inv.amount<>value or','inv.amount<>value or inv.discount_amount<>discount_value or');
  f:=replace(f,'description,amount,paid_amount,currency,issued_on,created_by,created_by_name)', 'description,amount,paid_amount,currency,issued_on,created_by,created_by_name,discount_amount)');
  f:=replace(f,'detail,value,paid,cur,issued,auth.uid(),actor_name)', 'detail,value,paid,cur,issued,auth.uid(),actor_name,discount_value)');
  f:=replace(f,'total_amount=total_amount+value,','total_amount=total_amount+value-discount_value,');
  execute f;
 end if;
end $$;
notify pgrst,'reload schema';
commit;

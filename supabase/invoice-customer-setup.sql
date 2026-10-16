-- Additive setup after sales-invoices-setup.sql; legacy balances remain intact.
begin;
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
 insert into public.crm_customers(id,name,phone,business_name,service_name,stage,currency,total_amount,paid_amount,notes)
 values(customer,btrim(n->>'name'),n->>'phone',btrim(n->>'business_name'),'—','customer',payload->>'currency',0,0,'');
 return redom_private.create_sales_invoice(payload);
end $$;
create or replace function public.create_sales_invoice_with_customer(payload jsonb) returns jsonb
language sql security invoker set search_path='' as $$select redom_private.create_sales_invoice_with_customer(payload)$$;
revoke all on function redom_private.create_sales_invoice_with_customer(jsonb),public.create_sales_invoice_with_customer(jsonb) from public,anon;
grant execute on function redom_private.create_sales_invoice_with_customer(jsonb),public.create_sales_invoice_with_customer(jsonb) to authenticated;
notify pgrst,'reload schema';
commit;

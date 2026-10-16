-- Reversible maintenance support. Apply after sales-invoices-setup.sql.
-- This contains no customer-specific deletion, renumbering or balance reset.
begin;
alter table public.sales_invoices add column if not exists archived boolean not null default false;
drop policy if exists "Hide archived invoices" on public.sales_invoices;
create policy "Hide archived invoices" on public.sales_invoices as restrictive for select to authenticated using(not archived);
do $$declare f text;begin
 select pg_get_functiondef('redom_private.create_sales_invoice(jsonb)'::regprocedure) into f;
 f=replace(f,'where customer_id=customer)','where customer_id=customer and not archived)');
 if position('Invoice archived' in f)=0 then
  f=replace(f,E'if found then\n',E'if found then\n  if inv.archived then raise exception ''Invoice archived'';end if;\n');
 end if;
 execute f;
 select pg_get_functiondef('redom_private.keep_invoice_currency()'::regprocedure) into f;
 f=replace(f,'where customer_id=old.id and currency','where customer_id=old.id and not archived and currency');
 execute f;
end $$;
notify pgrst,'reload schema';
commit;

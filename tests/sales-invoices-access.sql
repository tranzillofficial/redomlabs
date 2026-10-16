begin;
insert into auth.users(id,email,raw_app_meta_data) values('a1000000-0000-4000-8000-000000000001','invoice-owner@example.invalid','{"indom_admin":true}'),('a1000000-0000-4000-8000-000000000002','invoice-staff@example.invalid','{}');
insert into public.admin_staff(user_id,name,email,permissions) values('a1000000-0000-4000-8000-000000000002','Invoice staff','invoice-staff@example.invalid',array['sales']);
insert into public.crm_customers(id,name,phone,service_name,total_amount,paid_amount) values('a2000000-0000-4000-8000-000000000001','Invoice test','01000000000','Legacy',5000,1500);
select set_config('request.jwt.claims','{"sub":"a1000000-0000-4000-8000-000000000001","role":"authenticated"}',true);
set local role authenticated;
do $$declare p jsonb='{"id":"a3000000-0000-4000-8000-000000000001","customer_id":"a2000000-0000-4000-8000-000000000001","description":"New website","amount":1200,"paid_amount":400,"currency":"EGP","issued_on":"2026-10-16","created_by_name":"Spoofed"}';r jsonb;begin
 r=public.create_sales_invoice(p);perform public.create_sales_invoice(p);
 if (select count(*) from public.sales_invoices where customer_id=(p->>'customer_id')::uuid)<>1 then raise exception 'Duplicate invoice';end if;
 if (select total_amount from public.crm_customers where id=(p->>'customer_id')::uuid)<>6200 or (select paid_amount from public.crm_customers where id=(p->>'customer_id')::uuid)<>1900 then raise exception 'Incorrect balances';end if;
 if (select created_by_name from public.sales_invoices where id=(p->>'id')::uuid)<>'invoice-owner@example.invalid' then raise exception 'Actor spoofed';end if;
 begin perform public.create_sales_invoice(p||'{"amount":1300}');raise exception 'Changed retry accepted';exception when raise_exception then if sqlerrm='Changed retry accepted' then raise;end if;end;
 begin perform public.create_sales_invoice(p||'{"id":"a3000000-0000-4000-8000-000000000002","currency":"USD"}');raise exception 'Currency accepted';exception when raise_exception then if sqlerrm='Currency accepted' then raise;end if;end;
 begin perform public.create_sales_invoice(p||'{"id":"a3000000-0000-4000-8000-000000000002","paid_amount":1400}');raise exception 'Overpayment accepted';exception when raise_exception then if sqlerrm='Overpayment accepted' then raise;end if;end;
 begin update public.crm_customers set currency='USD' where id=(p->>'customer_id')::uuid;raise exception 'Currency changed';exception when raise_exception then if sqlerrm='Currency changed' then raise;end if;end;
 begin delete from public.sales_invoices where id=(p->>'id')::uuid;raise exception 'Invoice deleted';exception when insufficient_privilege then null;end;
end $$;
-- New identity and invoice are one retry-safe transaction.
do $$declare p jsonb='{"id":"a3000000-0000-4000-8000-000000000003","customer_id":"a2000000-0000-4000-8000-000000000003","new_customer":{"name":"New invoice customer","phone":"01022223333","business_name":"Company"},"description":"First service","amount":750,"paid_amount":250,"currency":"EGP","issued_on":"2026-10-16"}';begin
 perform public.create_sales_invoice_with_customer(p);perform public.create_sales_invoice_with_customer(p);
 if (select total_amount from public.crm_customers where id=(p->>'customer_id')::uuid)<>750 or (select count(*) from public.sales_invoices where customer_id=(p->>'customer_id')::uuid)<>1 then raise exception 'New customer retry duplicated balances';end if;
 perform public.create_sales_invoice((p-'new_customer')||'{"id":"a3000000-0000-4000-8000-000000000004","amount":100,"paid_amount":50}');
 if (select total_amount from public.crm_customers where id=(p->>'customer_id')::uuid)<>850 or (select paid_amount from public.crm_customers where id=(p->>'customer_id')::uuid)<>300 or (select count(*) from public.sales_invoices where customer_id=(p->>'customer_id')::uuid)<>2 then raise exception 'Repeat purchase failed';end if;
 begin perform public.create_sales_invoice_with_customer(p||'{"id":"a3000000-0000-4000-8000-000000000005","customer_id":"a2000000-0000-4000-8000-000000000005","paid_amount":9999}');raise exception 'Invalid invoice accepted';exception when raise_exception then if sqlerrm='Invalid invoice accepted' then raise;end if;end;
 if exists(select 1 from public.crm_customers where id='a2000000-0000-4000-8000-000000000005') then raise exception 'Orphan customer after failed invoice';end if;
 begin perform public.create_sales_invoice_with_customer(p||'{"id":"a3000000-0000-4000-8000-000000000006","new_customer":{"name":"Spoof","phone":"01022223333","business_name":""}}');raise exception 'Existing identity overwritten';exception when raise_exception then if sqlerrm='Existing identity overwritten' then raise;end if;end;
end $$;
reset role;
select set_config('request.jwt.claims','{"sub":"a1000000-0000-4000-8000-000000000002","role":"authenticated","user_metadata":{"indom_admin":true}}',true);
set local role authenticated;
do $$begin
 if exists(select 1 from public.sales_invoices) then raise exception 'Invoice data leaked';end if;
 begin perform public.create_sales_invoice('{}');raise exception 'Staff without finance created invoice';exception when insufficient_privilege then null;end;
end $$;
reset role;
update public.admin_staff set permissions=array['sales','finance'] where user_id='a1000000-0000-4000-8000-000000000002';
set local role authenticated;
do $$begin
 begin perform public.create_sales_invoice_with_customer('{}');raise exception 'Missing CRM scope accepted';exception when insufficient_privilege then null;end;
 perform public.create_sales_invoice('{"id":"a3000000-0000-4000-8000-000000000002","customer_id":"a2000000-0000-4000-8000-000000000001","description":"Second invoice","amount":100,"paid_amount":100,"currency":"EGP","issued_on":"2026-10-16"}');
 if (select created_by_name from public.sales_invoices where id='a3000000-0000-4000-8000-000000000002')<>'Invoice staff' then raise exception 'Staff attribution failed';end if;
end $$;
reset role;
select 'PASS invoices: totals preserved/incremented, retry safe, currency lock, validation, actor, read/write permissions' as test_result;
rollback;

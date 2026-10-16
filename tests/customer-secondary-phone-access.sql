begin;
insert into auth.users(id,email,raw_app_meta_data) values('b1000000-0000-4000-8000-000000000001','secondary-owner@example.invalid','{"indom_admin":true}'),('b1000000-0000-4000-8000-000000000002','secondary-staff@example.invalid','{}');
insert into public.admin_staff(user_id,name,email,permissions) values('b1000000-0000-4000-8000-000000000002','CRM only','secondary-staff@example.invalid',array['crm']);
insert into public.crm_customers(id,name,phone,service_name,total_amount,paid_amount) values('b2000000-0000-4000-8000-000000000001','Main customer','01000000000','Legacy',100,40);
select set_config('request.jwt.claims','{"sub":"b1000000-0000-4000-8000-000000000002","role":"authenticated"}',true);
set local role authenticated;
do $$declare p jsonb='{"id":"b2000000-0000-4000-8000-000000000001","name":"Main customer","phone":"01000000000","phone_secondary":"01199998888","phone_secondary_name":"Account contact","business_name":"Company","service_name":"Legacy","notes":"","stage":"customer","total_amount":9999,"paid_amount":0}';r jsonb;begin
 perform public.crm_safe_save(p);
 r=public.crm_safe_list(0,'01199998888','all');
 if (r->>'count')::int<>1 or r->'data'->0->>'phone_secondary_name'<>'Account contact' or r->'data'->0->>'name'<>'Main customer' or (r->'data'->0->>'total_amount')::numeric<>0 then raise exception 'Contact save/search or financial masking failed';end if;
 perform public.crm_safe_save(p-'phone_secondary'-'phone_secondary_name');
 r=public.crm_safe_list(0,'01199998888','all');if r->'data'->0->>'phone_secondary'<>'01199998888' then raise exception 'Old payload lost contact';end if;
 begin perform public.crm_safe_save(p||'{"phone_secondary":"abc"}');raise exception 'Invalid phone accepted';exception when check_violation then null;end;
 begin perform public.crm_safe_save(p||'{"phone_secondary":"","phone_secondary_name":"Orphan name"}');raise exception 'Name without phone accepted';exception when check_violation then null;end;
 perform public.crm_safe_save((p-'phone_secondary_name')||'{"phone_secondary":""}');r=public.crm_safe_list(0,'Main customer','all');if r->'data'->0->>'phone_secondary_name'<>'' then raise exception 'Clearing contact failed';end if;
 perform public.crm_safe_save(p);
end $$;
reset role;
do $$begin if (select total_amount from public.crm_customers where id='b2000000-0000-4000-8000-000000000001')<>100 then raise exception 'Financial balances changed';end if;end $$;
select set_config('request.jwt.claims','{"sub":"b1000000-0000-4000-8000-000000000001","role":"authenticated"}',true);
set local role authenticated;
do $$declare p jsonb='{"id":"b3000000-0000-4000-8000-000000000001","customer_id":"b2000000-0000-4000-8000-000000000002","new_customer":{"name":"Invoice main customer","phone":"01012345678","phone_secondary":"01288889999","phone_secondary_name":"Finance manager","business_name":"Company"},"description":"Service","amount":750,"paid_amount":250,"currency":"EGP","issued_on":"2026-10-16"}';begin
 perform public.create_sales_invoice_with_customer(p);perform public.create_sales_invoice_with_customer(p);
 if (select phone_secondary_name from public.crm_customers where id=(p->>'customer_id')::uuid)<>'Finance manager' or (select name from public.crm_customers where id=(p->>'customer_id')::uuid)<>'Invoice main customer' or (select total_amount from public.crm_customers where id=(p->>'customer_id')::uuid)<>750 then raise exception 'Invoice customer contact failed';end if;
 if (public.sales_list(0,'01288889999','all')->>'count')::int<>1 then raise exception 'Sales secondary search failed';end if;
end $$;
reset role;
select 'PASS optional named secondary contact: profile/invoice creation, search, clear, backwards compatibility, masked finance and unchanged primary identity/balances' as test_result;
rollback;

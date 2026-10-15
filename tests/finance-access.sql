insert into auth.users(id,email,raw_app_meta_data) values('10000000-0000-4000-8000-000000000001','finance-test@example.invalid','{}');
insert into public.admin_staff(user_id,name,email,permissions) values('10000000-0000-4000-8000-000000000001','Test Staff','finance-test@example.invalid',array['crm','expenses','proposals']);
insert into public.crm_customers(id,name,phone,service_name,total_amount,paid_amount) values('20000000-0000-4000-8000-000000000001','Finance Test','01000000000','Website',2500,700);
select set_config('request.jwt.claims','{"sub":"10000000-0000-4000-8000-000000000001","role":"authenticated"}',true);
set local role authenticated;
do $$declare j jsonb;begin
 if exists(select 1 from public.crm_customers) then raise exception 'CRM exposed';end if;
 j=public.crm_safe_list(0,'Finance Test','all');
 if j->>'count'<>'1' or j->'data'->0->>'total_amount'<>'0' then raise exception 'Masked amount exposed';end if;
 perform public.crm_safe_save('{"id":"20000000-0000-4000-8000-000000000001","name":"Finance Test","phone":"01000000000","service_name":"Updated","stage":"customer","total_amount":1,"paid_amount":1}');
 begin update public.crm_customers set total_amount=1 where id='20000000-0000-4000-8000-000000000001';exception when others then null;end;
 insert into public.company_expenses(id,amount,currency,purpose,category,spent_on,created_by,created_by_name) values('30000000-0000-4000-8000-000000000001',120,'EGP','Ad test','ads',current_date,null,'Spoof');
 if exists(select 1 from public.company_expenses) or exists(select 1 from public.expense_totals()) or exists(select 1 from public.crm_financial_totals()) then raise exception 'Financial data exposed';end if;
end $$;
reset role;
do $$begin
 if (select total_amount from public.crm_customers where id='20000000-0000-4000-8000-000000000001')<>2500 then raise exception 'Amount changed';end if;
 if (select created_by_name from public.company_expenses where id='30000000-0000-4000-8000-000000000001')<>'Test Staff' then raise exception 'Spoof accepted';end if;
end $$;
update public.admin_staff set permissions=array['crm','expenses','finance'] where user_id='10000000-0000-4000-8000-000000000001';
set local role authenticated;
do $$begin
 if not exists(select 1 from public.company_expenses where id='30000000-0000-4000-8000-000000000001') then raise exception 'Finance denied';end if;
 if not exists(select 1 from public.crm_customers where total_amount=2500 and id='20000000-0000-4000-8000-000000000001') then raise exception 'Finance CRM denied';end if;
end $$;
reset role;
update public.admin_staff set active=false where user_id='10000000-0000-4000-8000-000000000001';
set local role authenticated;
do $$begin
 begin perform public.crm_safe_list(0,'','all');raise exception 'Disabled account allowed';exception when insufficient_privilege then null;end;
end $$;
reset role;
select 'PASS: masked CRM, unchanged balances, blind expense entry, actor attribution, financial access, disabled denial' as test_result;
rollback;

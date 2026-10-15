insert into auth.users(id,email,raw_app_meta_data) values('10000000-0000-4000-8000-000000000002','sales-test@example.invalid','{}');
insert into public.admin_staff(user_id,name,email,permissions) values('10000000-0000-4000-8000-000000000002','Sales Test','sales-test@example.invalid',array['crm','finance']);
insert into public.crm_customers(id,name,phone,service_name,total_amount,paid_amount) values('20000000-0000-4000-8000-000000000002','Sales Split Test','01000000000','Website',5000,1500);
select set_config('request.jwt.claims','{"sub":"10000000-0000-4000-8000-000000000002","role":"authenticated"}',true);
set local role authenticated;
do $$declare j jsonb;begin
 j=public.crm_safe_list(0,'Sales Split Test','all');if j->>'count'<>'1' or j->'data'->0->>'total_amount'<>'0' then raise exception 'Customer directory exposes balances';end if;
 if exists(select 1 from public.crm_customers) then raise exception 'Sales scope bypass';end if;
 begin perform public.sales_list(0,'','all');raise exception 'Sales without scope';exception when insufficient_privilege then null;end;
 perform public.crm_safe_save('{"id":"20000000-0000-4000-8000-000000000002","name":"Sales Split Test","phone":"01000000000","service_name":"Website","stage":"follow_up","total_amount":1,"paid_amount":1}');
end $$;
reset role;
do $$begin if (select total_amount from public.crm_customers where id='20000000-0000-4000-8000-000000000002')<>5000 then raise exception 'Customer edit modified balance';end if;end $$;
update public.admin_staff set permissions=array['sales','finance'] where user_id='10000000-0000-4000-8000-000000000002';
set local role authenticated;
do $$declare j jsonb;begin
 j=public.sales_list(0,'Sales Split Test','all');if j->'data'->0->>'total_amount'<>'5000.00' then raise exception 'Sales balance missing: %',j;end if;
 update public.crm_customers set paid_amount=2000 where id='20000000-0000-4000-8000-000000000002';
 if not exists(select 1 from public.crm_customers where id='20000000-0000-4000-8000-000000000002' and remaining_amount=3000) then raise exception 'Payment update failed';end if;
 begin perform public.crm_safe_list(0,'','all');raise exception 'Customer scope bypass';exception when insufficient_privilege then null;end;
end $$;
reset role;
update public.admin_staff set permissions=array['sales'] where user_id='10000000-0000-4000-8000-000000000002';
set local role authenticated;
do $$begin begin perform public.sales_list(0,'','all');raise exception 'Finance scope bypass';exception when insufficient_privilege then null;end;end $$;
reset role;
select 'PASS: customer masking, sales scope, financial scope, preserved balances, updated payment' as test_result;
rollback;

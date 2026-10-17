-- Apply after redomlabs-setup.sql and crm-team-setup.sql.
-- Public company contact details; existing settings authorization remains unchanged.
create or replace function redom_private.valid_contact_people(people jsonb)
returns boolean language plpgsql immutable security invoker set search_path='' as $$
declare person jsonb; field text; value text;
begin
 if people is null or jsonb_typeof(people)<>'array' then return false; end if;
 if jsonb_array_length(people)>20 then return false; end if;
 for person in select jsonb_array_elements(people) loop
  if jsonb_typeof(person)<>'object' or jsonb_typeof(person->'phone') is distinct from 'string' then return false; end if;
  value:=person->>'phone';
  if length(value)>40 or value!~'^[+0-9() -]+$' or length(regexp_replace(value,'[^0-9]','','g'))<7 then return false; end if;
  foreach field in array array['name','job_title','email'] loop
   if person ? field and jsonb_typeof(person->field)<>'string' then return false; end if;
   value:=coalesce(person->>field,'');
   if length(value)>(case when field='email' then 254 else 100 end) then return false; end if;
   if field='email' and value<>'' and value!~'^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then return false; end if;
  end loop;
 end loop;
 return true;
end; $$;
revoke all on function redom_private.valid_contact_people(jsonb) from public,anon;
grant execute on function redom_private.valid_contact_people(jsonb) to authenticated;
alter table public.contact_settings add column if not exists contact_people jsonb not null default '[]'::jsonb;
-- Preserve any existing single contact; repeat setup does not replace nonempty lists.
update public.contact_settings set contact_people=jsonb_build_array(jsonb_build_object('phone',phone,'name','','job_title','','email',''))
where contact_people='[]'::jsonb and phone<>'';
do $$ begin
 if not exists(select 1 from pg_constraint where conrelid='public.contact_settings'::regclass and conname='contact_settings_people_valid') then
  alter table public.contact_settings add constraint contact_settings_people_valid check(redom_private.valid_contact_people(contact_people));
 end if;
end; $$;

'use server';
import {contactClient} from '../../../../lib/contact-service';
import {currentAccess,adminCookie} from '../../../../lib/admin-auth';
import {cookies} from 'next/headers';
import {loadCRM,customerStats} from './crm-actions';
export async function loadDashboardSummary(){
 const access=await currentAccess();
 if(!access||!access.permissions.includes('overview'))return null;
 const client=contactClient((await cookies()).get(adminCookie)?.value);
 const allowed=(section:string)=>access.owner||access.permissions.includes(section as typeof access.permissions[number]);
 const count=async(table:string,kind?:string)=>{try{let q=client.from(table).select('id',{count:'exact',head:true});if(kind)q=q.eq('kind',kind);const r=await q;return r.error?null:r.count??0}catch{return null}};
 const totals=async(name:string)=>{try{const r=await client.rpc(name);return r.error?null:r.data}catch{return null}};
 const [crm,recent,products,work,inquiries,proposals,sales,purchases]=await Promise.all([
  allowed('crm')?customerStats():null,allowed('crm')?loadCRM():null,
  allowed('products')?count('site_projects','product'):undefined,
  allowed('work')?count('site_projects','work'):undefined,
  allowed('inquiries')?count('contact_inquiries'):undefined,
  allowed('proposals')?count('proposals'):undefined,
  allowed('finance')&&allowed('sales')?totals('crm_financial_totals'):undefined,
  allowed('finance')&&allowed('expenses')?totals('expense_totals'):undefined,
 ]);
 return {crm,customers:recent?(recent.error?null:recent.data.slice(0,5).map(r=>({id:r.id,name:r.name,business:r.business_name,stage:r.stage,date:r.follow_up_date}))):undefined,
 products,work,inquiries,proposals,
 sales:sales as {currency:string;total:number;paid:number;remaining:number}[]|null|undefined,
 purchases:purchases as {currency:string;total:number}[]|null|undefined};
}

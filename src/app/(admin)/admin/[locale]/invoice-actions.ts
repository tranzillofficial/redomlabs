'use server';
import {invoiceNet} from '../../../../lib/invoice-math';
import {contactAdminClient} from '../../../../lib/contact-service';
import {requireSection} from '../../../../lib/admin-auth';
import type {InvoiceEdit,PaymentEdit} from '../../../../lib/financial-edit-types';
import type {SalesInvoice,NewInvoice} from '../../../../lib/invoice-types';
const uuid=(v:string)=>typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
export async function createInvoice(row:NewInvoice){
 try{
  await requireSection('finance');const c=await contactAdminClient('sales');
  const valid=(n:number)=>Number.isFinite(n)&&n>=0&&n<=999999999999.99&&Math.abs(n*100-Math.round(n*100))<.001;
  if(!row||!uuid(row.id)||!uuid(row.customer_id)||typeof row.description!=='string'||!row.description.trim()||row.description.length>300||!valid(row.amount)||row.amount===0||!valid(row.paid_amount)||row.paid_amount>invoiceNet(row.amount,row.discount_amount??0)||!valid(row.discount_amount??0)||(row.discount_amount??0)>row.amount||!['EGP','USD','SAR','AED','GBP','EUR'].includes(row.currency)||!/^\d{4}-\d{2}-\d{2}$/.test(row.issued_on)||!Number.isFinite(Date.parse(row.issued_on))||new Date(row.issued_on).toISOString().slice(0,10)!==row.issued_on)return {ok:false,error:'invalid'};
  if(row.new_customer){await requireSection('crm');const n=row.new_customer;if(typeof n.name!=='string'||!n.name.trim()||n.name.trim().length>100||typeof n.phone!=='string'||! /^[+0-9 ()-]{7,40}$/.test(n.phone)||typeof n.business_name!=='string'||n.business_name.length>200)return {ok:false,error:'invalid'};}
  if(row.new_customer?.phone_secondary!==undefined){const phone=row.new_customer.phone_secondary;if(typeof phone!=='string'||(phone.trim()!==''&&(!/^[+0-9 ()-]{7,40}$/.test(phone.trim())||phone.replace(/\D/g,'').length<7)))return {ok:false,error:'invalid'};}
  if(row.new_customer?.phone_secondary_name!==undefined){const n=row.new_customer;if(typeof n.phone_secondary_name!=='string'||n.phone_secondary_name.trim().length>100||(!n.phone_secondary?.trim()&&n.phone_secondary_name.trim()!==''))return {ok:false,error:'invalid'};}
  const {data,error}=await c.rpc(row.new_customer?'create_sales_invoice_with_customer':'create_sales_invoice',{payload:row});
  return error?{ok:false,error:error.message.includes('Currency mismatch')?'currency':'save'}:{ok:true,number:String(data.invoice_number)};
 }catch{return {ok:false,error:'save'}}
}
export async function loadInvoices(customerId:string,page=0){try{await requireSection('finance');const c=await contactAdminClient('sales');if(!uuid(customerId)||!Number.isInteger(page)||page<0)throw Error();const {data,count,error}=await c.from('sales_invoices').select('*',{count:'exact'}).eq('customer_id',customerId).order('issued_on',{ascending:false}).order('created_at',{ascending:false}).order('id').range(page*20,page*20+19);if(error)throw error;return {data:data as SalesInvoice[],count:count||0,error:false}}catch{return {data:[] as SalesInvoice[],count:0,error:true}}}

export async function loadCustomerAccount(customerId:string){try{await requireSection('finance');const c=await contactAdminClient('sales');if(!uuid(customerId))throw Error();const {data,error}=await c.from('crm_customers').select('total_amount,paid_amount,remaining_amount,currency,updated_at').eq('id',customerId).single();if(error)throw error;return data as {total_amount:number;paid_amount:number;remaining_amount:number;currency:string;updated_at:string}}catch{return null}}

export type InvoiceFilter='all'|'sales'|'purchases';
export type InvoiceCursor={created_at:string;id:string;type:'sales'|'purchases'};
export type InvoiceEntry={id:string;type:'sales'|'purchases';description:string;amount:number;paid_amount:number;currency:string;date:string;created_at:string;created_by_name:string;customer_name:string;number:number|null;category:string;discount_amount:number;revision:number;updated_by_name:string};
type FeedRow={id:string;amount:number|string;paid_amount?:number|string;currency:string;created_at:string;created_by_name:string;description?:string;purpose?:string;issued_on?:string;spent_on?:string;customer?:{name:string}|null;invoice_number?:number;category?:string;discount_amount?:number|string;revision?:number;updated_by_name?:string};
export async function loadInvoiceFeed(filter:InvoiceFilter='all',cursor:InvoiceCursor|null=null){
 try{
  const access=await requireSection('finance');const sales=access.owner||access.permissions.includes('sales'),purchases=access.owner||access.permissions.includes('expenses');
  if(!['all','sales','purchases'].includes(filter)||(filter==='sales'&&!sales)||(filter==='purchases'&&!purchases))throw Error();
  if(cursor&&(!uuid(cursor.id)||!['sales','purchases'].includes(cursor.type)||!/^\d{4}-\d{2}-\d{2}T[\d:.]+(?:Z|[+-]\d{2}:\d{2})$/.test(cursor.created_at)||!Number.isFinite(Date.parse(cursor.created_at))))throw Error();
  async function source(type:'sales'|'purchases'):Promise<InvoiceEntry[]>{
   if((type==='sales'&&!sales)||(type==='purchases'&&!purchases)||(filter!=='all'&&filter!==type))return [];
   const c=await contactAdminClient(type==='sales'?'sales':'expenses');
   let q=c.from(type==='sales'?'sales_invoices':'company_expenses').select(type==='sales'?'*,customer:crm_customers(name)':'*').order('created_at',{ascending:false}).order('id',{ascending:false}).limit(21);
   if(cursor){const idOperator=type==='purchases'&&cursor.type==='sales'?'lte':'lt';q=q.or(`created_at.lt.${cursor.created_at},and(created_at.eq.${cursor.created_at},id.${idOperator}.${cursor.id})`)}
   const {data,error}=await q.returns<FeedRow[]>();if(error)throw error;
   return (data||[]).map(r=>({id:r.id,type,description:(type==='sales'?r.description:r.purpose)||'',amount:Number(r.amount),paid_amount:type==='sales'?Number(r.paid_amount):Number(r.amount),currency:r.currency,date:(type==='sales'?r.issued_on:r.spent_on)||'',created_at:r.created_at,created_by_name:r.created_by_name,customer_name:r.customer?.name||'',number:type==='sales'?(r.invoice_number??null):null,category:r.category||'',discount_amount:Number(r.discount_amount||0),revision:r.revision||1,updated_by_name:r.updated_by_name||''}));
  }
  const [a,b]=await Promise.all([source('sales'),source('purchases')]);
  // created_at is normalized by PostgREST; compare full fractional seconds, not JS millisecond dates.
  const stamp=(v:string)=>v.replace(/(?:Z|\+00:00)$/,'').replace(/(:\d{2})(?:\.(\d+))?$/,(_,seconds:string,digits:string)=>seconds+'.'+(digits||'').padEnd(6,'0'));
  const rows=[...a,...b].sort((a,b)=>stamp(b.created_at).localeCompare(stamp(a.created_at))||b.id.localeCompare(a.id)||(a.type===b.type?0:a.type==='sales'?-1:1));
  const data=rows.slice(0,20),last=data.at(-1);
  return {data,hasMore:rows.length>20,next:last?{created_at:last.created_at,id:last.id,type:last.type}:null,error:false};
 }catch{return {data:[] as InvoiceEntry[],hasMore:false,next:null,error:true}}
}

const moneyValid=(n:number)=>typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<=999999999999.99&&Math.abs(n*100-Math.round(n*100))<.001;
function editError(message:string){return message.includes('Account balance conflict')?'balance':message.includes('Conflict')?'conflict':'save'}
export async function editInvoice(row:InvoiceEdit){try{
 await requireSection('finance');if(!row||!['sales','purchases'].includes(row.type)||!uuid(row.id)||!uuid(row.mutation_id)||!Number.isSafeInteger(row.revision)||row.revision<1||!moneyValid(row.amount)||row.amount===0||typeof row.description!=='string'||!row.description.trim()||row.description.length>(row.type==='sales'?300:1000)||!/^\d{4}-\d{2}-\d{2}$/.test(row.date)||!Number.isFinite(Date.parse(row.date))||new Date(row.date).toISOString().slice(0,10)!==row.date)return {ok:false,error:'invalid'};
 if(row.type==='sales'&&(!moneyValid(row.discount_amount)||row.discount_amount>row.amount||!moneyValid(row.paid_amount)||row.paid_amount>invoiceNet(row.amount,row.discount_amount)))return {ok:false,error:'invalid'};
 if(row.type==='purchases'&&!['ads','freelance','salary','server','domain','other'].includes(row.category))return {ok:false,error:'invalid'};
 const c=await contactAdminClient(row.type==='sales'?'sales':'expenses');const {error}=await c.rpc('edit_invoice',{payload:row});return error?{ok:false,error:editError(error.message)}:{ok:true};
 }catch{return {ok:false,error:'save'}}}
export async function updateCustomerPayment(row:PaymentEdit){try{
 await requireSection('finance');const c=await contactAdminClient('sales');if(!row||!uuid(row.id)||!uuid(row.mutation_id)||!moneyValid(row.paid_amount)||typeof row.updated_at!=='string'||!Number.isFinite(Date.parse(row.updated_at)))return {ok:false,error:'invalid'};
 const {error}=await c.rpc('update_customer_payment',{payload:row});return error?{ok:false,error:editError(error.message)}:{ok:true};
 }catch{return {ok:false,error:'save'}}}

'use server';
import {contactAdminClient} from '../../../../lib/contact-service';
import {requireSection} from '../../../../lib/admin-auth';
import type {SalesInvoice,NewInvoice} from '../../../../lib/invoice-types';
const uuid=(v:string)=>typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
export async function createInvoice(row:NewInvoice){
 try{
  await requireSection('finance');const c=await contactAdminClient('sales');
  const valid=(n:number)=>Number.isFinite(n)&&n>=0&&n<=999999999999.99&&Math.abs(n*100-Math.round(n*100))<.001;
  if(!row||!uuid(row.id)||!uuid(row.customer_id)||typeof row.description!=='string'||!row.description.trim()||row.description.length>300||!valid(row.amount)||row.amount===0||!valid(row.paid_amount)||row.paid_amount>row.amount||!['EGP','USD','SAR','AED','GBP','EUR'].includes(row.currency)||!/^\d{4}-\d{2}-\d{2}$/.test(row.issued_on)||!Number.isFinite(Date.parse(row.issued_on))||new Date(row.issued_on).toISOString().slice(0,10)!==row.issued_on)return {ok:false,error:'invalid'};
  if(row.new_customer){await requireSection('crm');const n=row.new_customer;if(typeof n.name!=='string'||!n.name.trim()||n.name.trim().length>100||typeof n.phone!=='string'||! /^[+0-9 ()-]{7,40}$/.test(n.phone)||typeof n.business_name!=='string'||n.business_name.length>200)return {ok:false,error:'invalid'};}
  const {data,error}=await c.rpc(row.new_customer?'create_sales_invoice_with_customer':'create_sales_invoice',{payload:row});
  return error?{ok:false,error:error.message.includes('Currency mismatch')?'currency':'save'}:{ok:true,number:String(data.invoice_number)};
 }catch{return {ok:false,error:'save'}}
}
export async function loadInvoices(customerId:string,page=0){try{await requireSection('finance');const c=await contactAdminClient('sales');if(!uuid(customerId)||!Number.isInteger(page)||page<0)throw Error();const {data,count,error}=await c.from('sales_invoices').select('*',{count:'exact'}).eq('customer_id',customerId).order('issued_on',{ascending:false}).order('created_at',{ascending:false}).order('id').range(page*20,page*20+19);if(error)throw error;return {data:data as SalesInvoice[],count:count||0,error:false}}catch{return {data:[] as SalesInvoice[],count:0,error:true}}}

export async function loadInvoiceRegister(page=0){try{await requireSection('finance');const c=await contactAdminClient('sales');if(!Number.isInteger(page)||page<0)throw Error();const {data,count,error}=await c.from('sales_invoices').select('*,customer:crm_customers(name,business_name)',{count:'exact'}).order('issued_on',{ascending:false}).order('created_at',{ascending:false}).order('id').range(page*20,page*20+19);if(error)throw error;return {data:data as (SalesInvoice&{customer:{name:string;business_name:string}|null})[],count:count||0,error:false}}catch{return {data:[] as (SalesInvoice&{customer:{name:string;business_name:string}|null})[],count:0,error:true}}}
export async function loadCustomerAccount(customerId:string){try{await requireSection('finance');const c=await contactAdminClient('sales');if(!uuid(customerId))throw Error();const {data,error}=await c.from('crm_customers').select('total_amount,paid_amount,remaining_amount,currency').eq('id',customerId).single();if(error)throw error;return data as {total_amount:number;paid_amount:number;remaining_amount:number;currency:string}}catch{return null}}

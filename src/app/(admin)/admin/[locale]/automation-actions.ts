'use server';
import {contactAdminClient} from '../../../../lib/contact-service';
type LeadInput={company_name:string;website:string;country:string;industry:string;segment:string;contact_name:string;contact_role:string;contact_email:string;source:string;evidence_url:string;opportunity:string;recommended_service:string;score:number};
const uuid=(s:string)=>/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
const stages=['new','researching','qualified','draft_ready','approved','contacted','replied','interested','meeting','proposal_sent','won','lost'];
export async function automationSnapshot(){
 try{
  const db=await contactAdminClient('automation');
  const [leads,campaigns,messages,activities,jobs,integrations]=await Promise.all([
   db.from('automation_leads').select('*').order('created_at',{ascending:false}).limit(200),
   db.from('automation_campaigns').select('*').order('created_at',{ascending:false}).limit(100),
   db.from('automation_messages').select('*').order('created_at',{ascending:false}).limit(200),
   db.from('automation_activities').select('*').order('created_at',{ascending:false}).limit(100),
   db.from('automation_jobs').select('*').order('created_at',{ascending:false}).limit(50),
   db.from('automation_integrations').select('*')
  ]);
  if([leads,campaigns,messages,activities,jobs,integrations].some(r=>r.error))throw Error('Database migration required');
  return {ok:true,leads:leads.data||[],campaigns:campaigns.data||[],messages:messages.data||[],activities:activities.data||[],jobs:jobs.data||[],integrations:integrations.data||[]};
 }catch{return {ok:false,leads:[],campaigns:[],messages:[],activities:[],jobs:[],integrations:[]}}
}
export async function automationSaveLead(input:LeadInput){
 try{
  const db=await contactAdminClient('automation');
  const fields=['company_name','website','country','industry','segment','contact_name','contact_role','contact_email','source','evidence_url','opportunity','recommended_service'] as const;
  if(!input||fields.some(k=>typeof input[k]!=='string'||input[k].length>3000)||!input.company_name.trim()||!Number.isInteger(input.score)||input.score<0||input.score>100)return {ok:false,error:'Invalid fields'};
  const url=input.website.trim();let domain='';
  if(url){const u=new URL(url);if(!['https:','http:'].includes(u.protocol))return {ok:false,error:'Invalid website'};domain=u.hostname.toLowerCase().replace(/^www\./,'');}
  if(input.contact_email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.contact_email))return {ok:false,error:'Invalid email'};
  if(domain){const existing=await db.from('automation_leads').select('id').eq('domain',domain).maybeSingle();if(existing.error)throw existing.error;if(existing.data)return {ok:false,error:'Company domain already exists'};}
  const {error}=await db.from('automation_leads').insert({...Object.fromEntries(fields.map(k=>[k,input[k].trim()])),domain,score:input.score});
  if(error)throw error;
  return {ok:true,error:''};
 }catch{return {ok:false,error:'Could not save lead'}}
}
export async function automationUpdateStage(id:string,stage:string){
 try{
  if(!uuid(id)||!stages.includes(stage))return false;
  const db=await contactAdminClient('automation');
  const {data:lead,error:readError}=await db.from('automation_leads').select('stage,do_not_contact').eq('id',id).single();
  if(readError||!lead||lead.do_not_contact&&['approved','contacted'].includes(stage))return false;
  const {error}=await db.from('automation_leads').update({stage,updated_at:new Date().toISOString()}).eq('id',id);
  if(error)return false;
  await db.from('automation_activities').insert({lead_id:id,event_type:'stage_changed',details:{from:lead.stage,to:stage}});
  return true;
 }catch{return false}
}
export async function automationSetOptOut(id:string,value:boolean){
 try{
  if(!uuid(id)||typeof value!=='boolean')return false;
  const db=await contactAdminClient('automation');
  const {error}=await db.from('automation_leads').update({do_not_contact:value,updated_at:new Date().toISOString()}).eq('id',id);
  if(error)return false;
  await db.from('automation_activities').insert({lead_id:id,event_type:value?'opt_out':'opt_in'});
  if(value)await db.from('automation_messages').update({status:'cancelled'}).eq('lead_id',id).in('status',['draft','approved']);
  return true;
 }catch{return false}
}
export async function automationSaveCampaign(name:string,country:string,segment:string,service:string){
 try{
  await Promise.resolve();
  if([name,country,segment,service].some(x=>typeof x!=='string'||x.length>200)||!name.trim())return false;
  const db=await contactAdminClient('automation');
  const {error}=await db.from('automation_campaigns').insert({name:name.trim(),country:country.trim(),segment:segment.trim(),service:service.trim()});
  return !error;
 }catch{return false}
}
export async function automationSaveDraft(leadId:string,subject:string,body:string){
 try{
  if(!uuid(leadId)||typeof subject!=='string'||subject.length>250||typeof body!=='string'||body.length>12000||!subject.trim()||!body.trim())return false;
  const db=await contactAdminClient('automation');
  const {data:lead}=await db.from('automation_leads').select('do_not_contact').eq('id',leadId).single();
  if(!lead||lead.do_not_contact)return false;
  const {error}=await db.from('automation_messages').insert({lead_id:leadId,subject:subject.trim(),body:body.trim(),status:'draft'});
  return !error;
 }catch{return false}
}
export async function automationApproveDraft(id:string){
 try{
  if(!uuid(id))return false;
  const db=await contactAdminClient('automation');
  const {data:message}=await db.from('automation_messages').select('lead_id,status').eq('id',id).single();
  if(!message||message.status!=='draft')return false;
  const {data:lead}=await db.from('automation_leads').select('do_not_contact').eq('id',message.lead_id).single();
  if(!lead||lead.do_not_contact)return false;
  const {error}=await db.from('automation_messages').update({status:'approved',approved_at:new Date().toISOString()}).eq('id',id).eq('status','draft');
  return !error;
 }catch{return false}
}
// Deliberately no send-email API: approval does not authorize external delivery.

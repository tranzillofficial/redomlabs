'use server';
import {contactAdminClient} from '../../../../lib/contact-service';
import {requireSection} from '../../../../lib/admin-auth';
import {entities,normalize,uuid,type Entity,type HubRow} from '../../../../lib/automation';
const tables=['leads','campaigns','messages','templates','tasks','social','markets','integrations','jobs','activities'] as const;
export async function loadAutomation(){
 try{const client=await contactAdminClient('automation');const results=await Promise.all(tables.map(async t=>{const {data,error}=await client.from(`automation_${t}`).select('*').order(t==='markets'||t==='integrations'?'id':'created_at',{ascending:t==='markets'}).limit(1000);if(error)throw error;return [t,data] as const}));return {data:Object.fromEntries(results) as Record<string,HubRow[]>,error:false};}
 catch{return {data:null,error:true}}
}
export async function saveAutomation(entity:Entity,input:Record<string,unknown>){
 try{if(!entities.includes(entity))throw Error();const client=await contactAdminClient('automation');const data=normalize(entity,input);const id=input.id;
 if(entity==='markets'){if(typeof id!=='string'||!/^[A-Z]{2}$/.test(id))throw Error()}else if(!uuid(id))throw Error();
 const existing=await client.from(`automation_${entity}`).select('id,revision').eq('id',id).maybeSingle();if(existing.error)throw existing.error;
 if(existing.data){if(!Number.isInteger(input.revision))throw Error();const {data:changed,error}=await client.from(`automation_${entity}`).update(data).eq('id',id).eq('revision',input.revision).select('id');if(error)throw error;if(changed?.length!==1)return {ok:false,reason:'conflict'};}
 else{if(entity==='markets')throw Error();const {error}=await client.from(`automation_${entity}`).insert({...data,id});if(error){if(error.code==='23505')return {ok:false,reason:'duplicate'};throw error}}
 return {ok:true,reason:''};
 }catch{return {ok:false,reason:'invalid'}}
}
export async function linkAutomation(leadId:string,kind:'crm'|'proposals',targetId:string,revision:number){
 try{if(!uuid(leadId)||(typeof targetId!=='string'||targetId.length<1||targetId.length>200||(kind==='crm'&&!uuid(targetId)))||!['crm','proposals'].includes(kind)||!Number.isInteger(revision))throw Error();await requireSection(kind);const client=await contactAdminClient('automation');
 // Verify the target through its own RLS. Never serialize financial customer data.
 if(kind==='crm'){const {data,error}=await client.rpc('crm_safe_list',{page_number:0,search_term:'',stage_filter:'all'});if(error||!data?.data?.some((r:{id:string})=>r.id===targetId))throw Error();}
 else{const {data,error}=await client.from('proposals').select('id').eq('id',targetId).single();if(error||!data)throw Error()}
 const {data,error}=await client.from('automation_leads').update({[kind==='crm'?'crm_customer_id':'proposal_id']:targetId}).eq('id',leadId).eq('revision',revision).select('id');return !error&&data?.length===1;
 }catch{return false}
}
export async function automationLinkOptions(){try{const access=await requireSection('automation'),client=await contactAdminClient('automation');let customers:{id:string;name:string}[]=[],proposals:{id:string;client_name:string}[]=[];
 if(access.owner||access.permissions.includes('crm')){const {data,error}=await client.rpc('crm_safe_list',{page_number:0,search_term:'',stage_filter:'all'});if(error)throw error;customers=(data?.data||[]).map((r:{id:string;name:string})=>({id:r.id,name:r.name}))}
 if(access.owner||access.permissions.includes('proposals')){const {data,error}=await client.from('proposals').select('id,client_name').limit(100);if(error)throw error;proposals=data||[]}
 return {customers,proposals,error:false};}catch{return {customers:[],proposals:[],error:true}}}

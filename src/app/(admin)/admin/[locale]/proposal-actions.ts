'use server';
import { currentAdmin } from '../../../../lib/admin-auth';
import { fetchProposals, saveProposal, deleteProposal, unlockProposal } from '../../../../lib/proposal-service';
import {proposalTotals} from '../../../../lib/proposal-pricing';
import { Proposal } from '../../../../lib/proposal-types';

export async function getAdminProposalsAction() {
  const admin = await currentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized', data: [] };
  try {const list = await fetchProposals();return { success: true, data: list };}catch{return {success:false,error:'database',data:[]}}
}

export async function saveProposalAction(proposal: Proposal) {
  const admin = await currentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

  if (!proposal.title || !proposal.clientName || !proposal.slug || (proposal.slug!=='general'&&!proposal.passcode)) {
    return { success: false, error: 'Missing required fields' };
  }

  if(!Array.isArray(proposal.sections)||proposal.sections.length>30||new Set(proposal.sections.map(s=>s.id)).size!==proposal.sections.length)return {success:false,error:'Invalid sections'};
  if(proposal.sections.some(s=>s.monthlyPrice!==undefined&&(!Number.isFinite(s.monthlyPrice)||s.monthlyPrice<0)||s.businessVariants&&Object.values(s.businessVariants).some(v=>v?.startingPrice!==undefined&&(!Number.isFinite(v.startingPrice)||v.startingPrice<0))))return {success:false,error:'Invalid pricing'};
  if(proposal.sections.some(s=>s.startingPrice!==undefined&&(!Number.isFinite(s.startingPrice)||s.startingPrice<0)||s.billing&&!["once","annual","monthly"].includes(s.billing))) return {success:false,error:'Invalid pricing'};

  if(proposal.slug==='general')proposal.passcode='';
  // Ensure clean slug
  proposal.slug = proposal.slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');

  const {isCatalog}=await import('../../../../lib/proposal-catalog');
  if(isCatalog(proposal.sections))proposal.initialPrice='';
  else if(proposal.sections.some(s=>s.startingPrice!==undefined))proposal.initialPrice=String(proposalTotals(proposal.sections).baseFirstYear);
  const res = await saveProposal(proposal);
  return res;
}

export async function deleteProposalAction(id: string) {
  const admin = await currentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };
  return await deleteProposal(id);
}

const unlockAttempts=new Map<string,{count:number;until:number}>();
export async function verifyClientProposalAccess(slug:string,enteredPasscode:string) {
 if(typeof slug!=='string'||typeof enteredPasscode!=='string'||slug.length>100||enteredPasscode.length>200)return {success:false,error:'invalid_passcode'};
 const {headers}=await import('next/headers');const {createHash}=await import('node:crypto');
 const key=createHash('sha256').update((await headers()).get('x-forwarded-for')||'unknown').digest('hex');const now=Date.now();for(const [k,v] of unlockAttempts)if(v.until<now)unlockAttempts.delete(k);const limit=unlockAttempts.get(key)||{count:0,until:now+60000};if(limit.count>=5)return {success:false,error:'invalid_passcode'};limit.count++;unlockAttempts.set(key,limit);
 const proposal=await unlockProposal(slug.trim().toLowerCase(),enteredPasscode.trim());
 return proposal?{success:true,proposal:{...proposal,passcode:''}}:{success:false,error:'invalid_passcode'};
}

export async function submitProposalRequestAction(input:import('../../../../lib/proposal-request-types').ProposalRequestInput){
 const {businessTypes}=await import('../../../../lib/proposal-catalog');
 if(!input||typeof input.slug!=='string'||input.slug.length>100||typeof input.passcode!=='string'||input.passcode.length>200||!Array.isArray(input.selectedIds)||input.selectedIds.length<1||input.selectedIds.length>30||input.selectedIds.some(id=>typeof id!=='string'||id.length>100)||!businessTypes.some(b=>b.id===input.businessType)||typeof input.name!=='string'||!input.name.trim()||input.name.length>100||typeof input.phone!=='string'||!/^[+0-9 ()-]{7,40}$/.test(input.phone)||input.phone.replace(/\D/g,'').length<7||typeof input.notes!=='string'||input.notes.length>2000||!['ar','en'].includes(input.locale)||typeof input.requestId!=='string'||!/^[0-9a-f-]{36}$/i.test(input.requestId))return {success:false};
 const {headers}=await import('next/headers');const {createHash}=await import('node:crypto');
 const key='request:'+createHash('sha256').update((await headers()).get('x-forwarded-for')||'unknown').digest('hex');const now=Date.now();for(const [k,v] of unlockAttempts)if(v.until<now)unlockAttempts.delete(k);const limit=unlockAttempts.get(key)||{count:0,until:now+60000};if(limit.count>=5)return {success:false};limit.count++;unlockAttempts.set(key,limit);
 const {contactClient}=await import('../../../../lib/contact-service');
 try{const {data,error}=await contactClient().rpc('submit_proposal_request',{requested_slug:input.slug,entered_passcode:input.passcode,selected_ids:[...new Set(input.selectedIds)],requested_business:input.businessType,contact_name:input.name.trim(),contact_phone:input.phone.trim(),additional_notes:input.notes.trim(),request_locale:input.locale,request_id:input.requestId});return {success:!error&&!!data}}catch{return {success:false}}
}
export async function getProposalRequestsAction(){
 try{const {contactAdminClient}=await import('../../../../lib/contact-service');const client=await contactAdminClient();const {data,error}=await client.from('proposal_requests').select('*').order('created_at',{ascending:false}).limit(100);if(error)throw error;return {success:true,data:data as import('../../../../lib/proposal-request-types').ProposalRequest[]}}catch{return {success:false,data:[]}}
}

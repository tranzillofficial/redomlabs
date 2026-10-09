'use server';
import { currentAdmin } from '../../../../lib/admin-auth';
import { fetchProposals, saveProposal, deleteProposal, unlockProposal } from '../../../../lib/proposal-service';
import { Proposal } from '../../../../lib/proposal-types';

export async function getAdminProposalsAction() {
  const admin = await currentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized', data: [] };
  try {const list = await fetchProposals();return { success: true, data: list };}catch{return {success:false,error:'database',data:[]}}
}

export async function saveProposalAction(proposal: Proposal) {
  const admin = await currentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized' };

  if (!proposal.title || !proposal.clientName || !proposal.slug || !proposal.passcode) {
    return { success: false, error: 'Missing required fields' };
  }

  // Ensure clean slug
  proposal.slug = proposal.slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '-');

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

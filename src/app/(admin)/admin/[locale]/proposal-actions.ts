'use server';
import { currentAdmin } from '../../../../lib/admin-auth';
import { fetchProposals, saveProposal, deleteProposal, getProposalBySlug } from '../../../../lib/proposal-service';
import { Proposal } from '../../../../lib/proposal-types';

export async function getAdminProposalsAction() {
  const admin = await currentAdmin();
  if (!admin) return { success: false, error: 'Unauthorized', data: [] };
  const list = await fetchProposals();
  return { success: true, data: list };
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

export async function verifyClientProposalAccess(slug: string, enteredPasscode: string) {
  const proposal = await getProposalBySlug(slug);
  if (!proposal) {
    return { success: false, error: 'not_found' };
  }
  if (proposal.passcode.trim() !== enteredPasscode.trim()) {
    return { success: false, error: 'invalid_passcode' };
  }
  return { success: true, proposal };
}

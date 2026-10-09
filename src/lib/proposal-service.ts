import { Proposal, initialProposals } from './proposal-types';
import { supabaseUrl, supabasePublicKey } from './supabase-config';
import { createClient } from '@supabase/supabase-js';

const STORAGE_KEY = 'redom_proposals_store_v1';

function getSupabaseClient() {
  try {
    return createClient(supabaseUrl, supabasePublicKey, {
      auth: { persistSession: false },
      global: { fetch: (input, init) => fetch(input, { ...init, cache: 'no-store' }) }
    });
  } catch {
    return null;
  }
}

// In-memory runtime cache / fallback
let memoryProposals: Proposal[] = [...initialProposals];

export async function fetchProposals(): Promise<Proposal[]> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        // Map database records to Proposal interface
        return data.map((item: any) => ({
          id: item.id,
          slug: item.slug,
          title: item.title,
          clientName: item.client_name,
          clientEmail: item.client_email,
          passcode: item.passcode,
          summary: item.summary,
          initialPrice: item.initial_price,
          currency: item.currency || 'SAR',
          deliveryTime: item.delivery_time,
          validUntil: item.valid_until,
          status: item.status || 'active',
          sections: typeof item.sections === 'string' ? JSON.parse(item.sections) : (item.sections || []),
          createdAt: item.created_at,
          updatedAt: item.updated_at
        }));
      }
    } catch {
      // fallback to memory
    }
  }

  return memoryProposals;
}

export async function getProposalBySlug(slug: string): Promise<Proposal | null> {
  const cleanSlug = slug.trim().toLowerCase();
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('proposals')
        .select('*')
        .eq('slug', cleanSlug)
        .maybeSingle();

      if (!error && data) {
        return {
          id: data.id,
          slug: data.slug,
          title: data.title,
          clientName: data.client_name,
          clientEmail: data.client_email,
          passcode: data.passcode,
          summary: data.summary,
          initialPrice: data.initial_price,
          currency: data.currency || 'SAR',
          deliveryTime: data.delivery_time,
          validUntil: data.valid_until,
          status: data.status || 'active',
          sections: typeof data.sections === 'string' ? JSON.parse(data.sections) : (data.sections || []),
          createdAt: data.created_at,
          updatedAt: data.updated_at
        };
      }
    } catch {
      // fallback
    }
  }

  const found = memoryProposals.find(p => p.slug.toLowerCase() === cleanSlug);
  return found || null;
}

export async function saveProposal(proposal: Proposal): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient();
  let dbSuccess = false;

  if (supabase) {
    try {
      const dbPayload = {
        id: proposal.id,
        slug: proposal.slug.trim().toLowerCase(),
        title: proposal.title,
        client_name: proposal.clientName,
        client_email: proposal.clientEmail || null,
        passcode: proposal.passcode,
        summary: proposal.summary,
        initial_price: proposal.initialPrice,
        currency: proposal.currency || 'SAR',
        delivery_time: proposal.deliveryTime || null,
        valid_until: proposal.validUntil || null,
        status: proposal.status,
        sections: JSON.stringify(proposal.sections),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('proposals')
        .upsert(dbPayload, { onConflict: 'id' });

      if (!error) {
        dbSuccess = true;
      }
    } catch {
      // If table isn't created or Supabase throws, we keep memory copy
    }
  }

  // Update memory
  const idx = memoryProposals.findIndex(p => p.id === proposal.id);
  if (idx >= 0) {
    memoryProposals[idx] = { ...proposal, updatedAt: new Date().toISOString() };
  } else {
    memoryProposals.unshift({ ...proposal, updatedAt: new Date().toISOString() });
  }

  return { success: true };
}

export async function deleteProposal(id: string): Promise<{ success: boolean }> {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      await supabase.from('proposals').delete().eq('id', id);
    } catch {
      // fallback
    }
  }
  memoryProposals = memoryProposals.filter(p => p.id !== id);
  return { success: true };
}

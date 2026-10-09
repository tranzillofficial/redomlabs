import { getProposalBySlug } from '../../../lib/proposal-service';
import { ProposalClientView } from './ProposalClientView';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const proposal = await getProposalBySlug(slug);
  if (!proposal) return { title: 'Proposal | Redom Labs' };
  return {
    title: `${proposal.clientName} - ${proposal.title} | Redom Labs`,
    description: proposal.summary || 'Private proposal by Redom Labs'
  };
}

export default async function ProposalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const proposal = await getProposalBySlug(slug);

  if (!proposal) {
    notFound();
  }

  return <ProposalClientView initialProposal={null} slug={slug} />;
}

import {ProposalClientView} from './ProposalClientView';
import {notFound} from 'next/navigation';
export const dynamic='force-dynamic';
export const metadata={title:'Private proposal | Redom Labs',description:'Private client proposal by Redom Labs'};
export default async function ProposalPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)||slug.length>100)notFound();return <ProposalClientView initialProposal={null} slug={slug}/>}

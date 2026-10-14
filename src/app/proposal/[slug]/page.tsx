import {ProposalClientView} from './ProposalClientView';
import {publicGeneralProposal} from '../../../lib/proposal-service';
import {notFound} from 'next/navigation';
export const dynamic='force-dynamic';
const privateMetadata={robots:{index:false,follow:false},title:'Private proposal | Redom Labs',description:'Private client proposal by Redom Labs'};
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return slug==='general'?{title:'Redom Labs | عرض الخدمات العام',description:'Explore Redom Labs technology, marketing and company-built services. اختر خدماتك واطلب عرضًا مخصصًا.',robots:{index:true,follow:true}}:privateMetadata}
export default async function ProposalPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)||slug.length>100)notFound();const proposal=slug==='general'?await publicGeneralProposal():null;if(slug==='general'&&!proposal)throw new Error('Public service catalog unavailable');return <ProposalClientView initialProposal={proposal} slug={slug}/>}

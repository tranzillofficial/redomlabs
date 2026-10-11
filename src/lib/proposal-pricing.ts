import type {ProposalSection} from './proposal-types';
export function proposalTotals(sections:ProposalSection[],selected:string[]=[]){
 const totals={once:0,annual:0,monthly:0,baseFirstYear:0};
 for(const s of sections){if(s.startingPrice===undefined||!Number.isFinite(s.startingPrice)||s.startingPrice<0)continue;
 if(!s.optional&&s.billing!=='monthly')totals.baseFirstYear+=s.startingPrice;
 if(s.optional&&!selected.includes(s.id))continue;
 if(s.billing==='annual')totals.annual+=s.startingPrice;else if(s.billing==='monthly')totals.monthly+=s.startingPrice;else totals.once+=s.startingPrice;
 }return totals;
}

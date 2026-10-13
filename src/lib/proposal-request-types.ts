import type {BusinessType} from './proposal-catalog';
import type {ProposalSection} from './proposal-types';
export type ProposalRequestInput={slug:string;passcode:string;selectedIds:string[];businessType:BusinessType;name:string;phone:string;notes:string;locale:'ar'|'en';requestId:string};
export type ProposalRequest={id:string;proposal_slug:string;client_name:string;contact_name:string;phone:string;notes:string;business_type:BusinessType;currency:string;sections:ProposalSection[];created_at:string};

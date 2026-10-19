export const stages = ['new','researching','qualified','draft_ready','approved','contacted','replied','interested','meeting','proposal_sent','won','lost'] as const;
export const stageNames: Record<string,[string,string]> = {new:['عميل جديد','New lead'],researching:['قيد البحث','Researching'],qualified:['مؤهل','Qualified'],draft_ready:['مسودة جاهزة','Draft ready'],approved:['معتمد','Approved'],contacted:['تم التواصل','Contacted'],replied:['تم الرد','Replied'],interested:['مهتم','Interested'],meeting:['اجتماع','Meeting'],proposal_sent:['تم إرسال عرض','Proposal sent'],won:['تعاقد ناجح','Won'],lost:['لم يتم التعاقد','Lost']};
export const countries:Record<string,[string,string]>={US:['أمريكا','United States'],GB:['بريطانيا','United Kingdom'],NL:['هولندا','Netherlands'],FR:['فرنسا','France'],SA:['السعودية','Saudi Arabia'],AE:['الإمارات','UAE'],QA:['قطر','Qatar'],KW:['الكويت','Kuwait'],BH:['البحرين','Bahrain'],OM:['عمان','Oman'],IQ:['العراق','Iraq'],JO:['الأردن','Jordan']};
export const entities=['leads','campaigns','messages','templates','tasks','social','markets'] as const;
export type Entity=typeof entities[number];
export type HubRow={id:string;created_at:string;updated_at:string;revision:number;[key:string]:string|number|boolean|null};
export const uuid=(v:unknown):v is string=>typeof v==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
export function safeUrl(v:string){try{const u=new URL(v);return u.protocol==='https:'&&!u.username&&!u.password&&u.hostname.includes('.')&&!/^(localhost|127\.|10\.|192\.168\.|169\.254\.)/.test(u.hostname)}catch{return false}}
export const fields:Record<Entity,string[]>={leads:['company','website','country','sector','company_size','segment','decision_maker','job_title','email','phone','source','source_url','needs','evidence_url','service','fit','need','reach','stage','suppressed','notes','campaign_id'],campaigns:['name','country','sector','service','status'],messages:['lead_id','campaign_id','subject','body','status','external_id','sent_at'],templates:['name','subject','body','language'],tasks:['lead_id','title','due_at','status'],social:['platform','body','scheduled_at','status','external_url'],markets:['enabled']};
export function normalize(entity:Entity,input:Record<string,unknown>){
 const result:Record<string,unknown>={};
 for(const key of fields[entity])if(key in input){let v=input[key];if(['fit','need','reach'].includes(key)){v=Number(v);if(!Number.isInteger(v)||Number(v)<0||Number(v)>(key==='reach'?20:40))throw Error('invalid')}
 else if(['suppressed','enabled'].includes(key)){if(typeof v!=='boolean')throw Error('invalid')}
 else if(v!==null){if(typeof v!=='string'||v.length> (['body','needs','notes'].includes(key)?6000:500))throw Error('invalid');v=v.trim();if(key.endsWith('_id')&&v&&!uuid(v))throw Error('invalid');if(key.endsWith('_id')&&!v)v=null;if(['website','source_url','evidence_url','external_url'].includes(key)&&v&&!safeUrl(String(v)))throw Error('invalid');if(key==='email'&&v&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v)))throw Error('invalid');if(['due_at','scheduled_at','sent_at'].includes(key)){if(v&&!Number.isFinite(Date.parse(String(v))))throw Error('invalid');if(!v)v=null}}
 result[key]=v;
 }
 return result;
}

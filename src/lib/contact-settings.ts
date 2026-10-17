export const socialPlatforms=[['facebook','Facebook'],['instagram','Instagram'],['linkedin','LinkedIn'],['x','X'],['youtube','YouTube'],['tiktok','TikTok'],['whatsapp','WhatsApp'],['github','GitHub']] as const;
export type ContactPerson={phone:string;name:string;job_title:string;email:string};
export const maxContactPeople=20;
export type ContactSettings={id:number;address_en:string;address_ar:string;address_details_en:string;address_details_ar:string;phone:string;email:string;contact_people:ContactPerson[];social_links:Record<string,string>};
export const defaultContact:ContactSettings={id:1,address_en:'Cairo - Egypt',address_ar:'القاهرة - مصر',address_details_en:'',address_details_ar:'',phone:'',email:'',contact_people:[],social_links:{}};
const emailValid=(s:string)=>s.length<=254&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
export const phoneValid=(s:string)=>s.length<=40&&/^[+0-9() -]+$/.test(s)&&s.replace(/\D/g,'').length>=7;
function parsePerson(value:unknown):ContactPerson|null{
 if(!value||typeof value!=='object'||Array.isArray(value))return null;
 const r=value as Record<string,unknown>;
 if(['phone','name','job_title','email'].some(key=>r[key]!==undefined&&typeof r[key]!=='string'))return null;
 const read=(key:string)=>String(r[key]??'').trim();
 const p={phone:read('phone'),name:read('name'),job_title:read('job_title'),email:read('email')};
 return phoneValid(p.phone)&&p.name.length<=100&&p.job_title.length<=100&&(!p.email||emailValid(p.email))?p:null;
}
export function safeSocialUrl(value:unknown){if(typeof value!=='string'||!value.trim()||value.length>2048)return '';try{const url=new URL(value.trim());return url.protocol==='https:'&&!url.username&&!url.password?url.href:''}catch{return ''}}
export function normalizeContact(value:Partial<ContactSettings>|null):ContactSettings{
 const social_links:Record<string,string>={};for(const [key] of socialPlatforms){const url=safeSocialUrl(value?.social_links?.[key]);if(url)social_links[key]=url}
 const raw=value?.contact_people===undefined?(value?.phone?[{phone:value.phone}]:[]):value.contact_people;
 const contact_people=Array.isArray(raw)?raw.slice(0,maxContactPeople).map(parsePerson).filter((r):r is ContactPerson=>r!==null):[];
 return {...defaultContact,...value,contact_people,phone:contact_people[0]?.phone||'',social_links};
}
export function contactFormPayload(form:FormData):ContactSettings|null{
 const read=(key:string)=>String(form.get(key)||'').trim();
 const p={...defaultContact,address_en:read('address_en'),address_ar:read('address_ar'),address_details_en:read('address_details_en'),address_details_ar:read('address_details_ar'),phone:read('phone'),email:read('email'),contact_people:[] as ContactPerson[],social_links:{} as Record<string,string>};
 if(!p.address_en||!p.address_ar||p.address_en.length>200||p.address_ar.length>200||p.address_details_en.length>500||p.address_details_ar.length>500||(p.email&&!emailValid(p.email)))return null;
 if(form.has('contact_people')){
  const raw=read('contact_people');if(raw.length>20000)return null;
  try{const rows:unknown=JSON.parse(raw);if(!Array.isArray(rows)||rows.length>maxContactPeople)return null;for(const row of rows){const person=parsePerson(row);if(!person)return null;p.contact_people.push(person)}}catch{return null}
 }else if(p.phone){const person=parsePerson({phone:p.phone});if(!person)return null;p.contact_people=[person]}
 p.phone=p.contact_people[0]?.phone||'';
 for(const [key] of socialPlatforms){const raw=read('social_'+key);if(!raw)continue;const url=safeSocialUrl(raw);if(!url)return null;p.social_links[key]=url}return p;
}

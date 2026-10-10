export const socialPlatforms=[['facebook','Facebook'],['instagram','Instagram'],['linkedin','LinkedIn'],['x','X'],['youtube','YouTube'],['tiktok','TikTok'],['whatsapp','WhatsApp'],['github','GitHub']] as const;
export type ContactSettings={id:number;address_en:string;address_ar:string;address_details_en:string;address_details_ar:string;phone:string;email:string;social_links:Record<string,string>};
export const defaultContact:ContactSettings={id:1,address_en:'Cairo - Egypt',address_ar:'القاهرة - مصر',address_details_en:'',address_details_ar:'',phone:'',email:'',social_links:{}};
export function safeSocialUrl(value:unknown){if(typeof value!=='string'||!value.trim()||value.length>2048)return '';try{const url=new URL(value.trim());return url.protocol==='https:'&&!url.username&&!url.password?url.href:''}catch{return ''}}
export function normalizeContact(value:Partial<ContactSettings>|null):ContactSettings{const social_links:Record<string,string>={};for(const [key] of socialPlatforms){const url=safeSocialUrl(value?.social_links?.[key]);if(url)social_links[key]=url}return {...defaultContact,...value,social_links}}
export function contactFormPayload(form:FormData):ContactSettings|null{
 const read=(key:string)=>String(form.get(key)||'').trim();
 const p={...defaultContact,address_en:read('address_en'),address_ar:read('address_ar'),address_details_en:read('address_details_en'),address_details_ar:read('address_details_ar'),phone:read('phone'),email:read('email'),social_links:{} as Record<string,string>};
 if(!p.address_en||!p.address_ar||p.address_en.length>200||p.address_ar.length>200||p.address_details_en.length>500||p.address_details_ar.length>500||p.phone.length>40||p.email.length>254||(p.phone&&!/^[+0-9()\s-]+$/.test(p.phone))||(p.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)))return null;
 for(const [key] of socialPlatforms){const raw=read('social_'+key);if(!raw)continue;const url=safeSocialUrl(raw);if(!url)return null;p.social_links[key]=url}return p;
}

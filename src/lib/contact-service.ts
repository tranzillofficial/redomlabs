import 'server-only';
import {createClient} from '@supabase/supabase-js';
import {cookies} from 'next/headers';
import {adminCookie,currentAdmin} from './admin-auth';
import {supabaseUrl,supabasePublicKey} from './supabase-config';
export type ContactSettings={id:number;address_en:string;address_ar:string;phone:string;email:string};
export const defaultContact:ContactSettings={id:1,address_en:'Cairo - Egypt',address_ar:'القاهرة - مصر',phone:'',email:''};
export function contactClient(token?:string){return createClient(supabaseUrl,supabasePublicKey,{auth:{persistSession:false,autoRefreshToken:false},global:{...(token?{headers:{Authorization:`Bearer ${token}`}}:{}),fetch:(input,init)=>fetch(input,{...init,cache:'no-store',signal:AbortSignal.timeout(10000)})}})}
export async function getContactSettings(){try{const {data,error}=await contactClient().from('contact_settings').select('*').eq('id',1).single();return !error&&data?data as ContactSettings:defaultContact}catch{return defaultContact}}
export async function contactAdminClient(){if(!await currentAdmin())throw new Error('Unauthorized');const token=(await cookies()).get(adminCookie)?.value;if(!token)throw new Error('Unauthorized');return contactClient(token)}

import 'server-only';
import {createClient} from '@supabase/supabase-js';
import {cookies} from 'next/headers';
import {adminCookie,currentAdmin} from './admin-auth';
import {supabaseUrl,supabasePublicKey} from './supabase-config';
import {defaultContact,normalizeContact} from './contact-settings';
export {defaultContact,type ContactSettings} from './contact-settings';
export function contactClient(token?:string){return createClient(supabaseUrl,supabasePublicKey,{auth:{persistSession:false,autoRefreshToken:false},global:{...(token?{headers:{Authorization:`Bearer ${token}`}}:{}),fetch:(input,init)=>fetch(input,{...init,cache:'no-store',signal:AbortSignal.timeout(10000)})}})}
export async function getContactSettings(){try{const {data,error}=await contactClient().from('contact_settings').select('*').eq('id',1).single();return !error&&data?normalizeContact(data):defaultContact}catch{return defaultContact}}
export async function contactAdminClient(){if(!await currentAdmin())throw new Error('Unauthorized');const token=(await cookies()).get(adminCookie)?.value;if(!token)throw new Error('Unauthorized');return contactClient(token)}

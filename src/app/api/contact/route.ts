import {NextResponse} from 'next/server';
import {contactClient} from '../../../lib/contact-service';
import {createHash} from 'node:crypto';
const attempts=new Map<string,{count:number;until:number}>();
const types=['website','mobile','business','ai','branding','marketing','it'];
export async function POST(request:Request){
 let origin:URL;try{origin=new URL(request.headers.get('origin')||'')}catch{return NextResponse.json({error:'origin'},{status:403})}
 if(origin.host!==request.headers.get('host')||!['https:','http:'].includes(origin.protocol))return NextResponse.json({error:'origin'},{status:403});
 if(Number(request.headers.get('content-length')||0)>16000)return NextResponse.json({error:'size'},{status:413});
 const now=Date.now();for(const [key,v] of attempts)if(v.until<now)attempts.delete(key);
 const key=createHash('sha256').update(request.headers.get('x-forwarded-for')||'unknown').digest('hex');const v=attempts.get(key)||{count:0,until:now+60000};
 if(v.count>=5)return NextResponse.json({error:'rate'},{status:429});v.count++;attempts.set(key,v);
 let body;try{const raw=await request.text();if(raw.length>16000)return NextResponse.json({error:'size'},{status:413});body=JSON.parse(raw)}catch{return NextResponse.json({error:'invalid'},{status:400})}
 if(!body||typeof body!=='object'||typeof body.website!=='string'||body.website)return NextResponse.json({error:'invalid'},{status:400});
 const {name,email,project_type,message,locale}=body;
 if(typeof name!=='string'||!name.trim()||name.length>100||typeof email!=='string'||email.length>254||! /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!types.includes(project_type)||typeof message!=='string'||!message.trim()||message.length>5000||!['ar','en'].includes(locale))return NextResponse.json({error:'invalid'},{status:400});
 try{const {error}=await contactClient().from('contact_inquiries').insert({name:name.trim(),email:email.trim().toLowerCase(),project_type,message:message.trim(),locale});if(error)throw error;return NextResponse.json({success:true})}catch{return NextResponse.json({error:'unavailable'},{status:503})}
}

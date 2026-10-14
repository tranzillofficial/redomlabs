'use server';
import {cookies,headers} from 'next/headers';
import {redirect} from 'next/navigation';
import {authClient,adminCookie,currentAdmin,accessForUser} from '../../../../lib/admin-auth';
import {createHash} from 'node:crypto';
const attempts=new Map<string,{count:number;until:number}>();
export async function login(_state:{error:string},form:FormData){
 const locale=form.get('locale')==='en'?'en':'ar',ar=locale==='ar';const failure={error:ar?'تعذر تسجيل الدخول. تحقق من بياناتك وحاول مجددًا.':'Unable to sign in. Check your credentials and try again.'};
 const email=form.get('email'),password=form.get('password');if(typeof email!=='string'||typeof password!=='string'||email.length>254||password.length>200)return failure;
 const h=await headers(),key=createHash('sha256').update(h.get('x-forwarded-for')||'local').digest('hex'),now=Date.now();for(const [k,v] of attempts)if(v.until<now)attempts.delete(k);const limit=attempts.get(key)||{count:0,until:now+60000};if(limit.count>=5)return {error:ar?'انتظر دقيقة قبل المحاولة مجددًا.':'Wait a minute before trying again.'};limit.count++;attempts.set(key,limit);
 let token='',expires=0;try{const {data,error}=await authClient().auth.signInWithPassword({email:email.trim().toLowerCase(),password});if(error||!data.session||!data.user||!await accessForUser(data.user,data.session.access_token))return failure;token=data.session.access_token;expires=Math.min(data.session.expires_in,3600)}catch{return failure}
 (await cookies()).set(adminCookie,token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/admin',maxAge:expires});redirect(`/admin/${locale}/dashboard`);
}
export async function logout(form:FormData){const locale=form.get('locale')==='en'?'en':'ar';(await cookies()).delete({name:adminCookie,path:'/admin'});redirect(`/admin/${locale}/login`)}
export async function changePassword(_state:{error:string;success:boolean},form:FormData){
 const ar=form.get('locale')!=='en';
 const fail=(message:string)=>({error:message,success:false});
 const user=await currentAdmin();if(!user?.email)return fail(ar?'انتهت الجلسة. سجّل الدخول مجددًا.':'Session expired. Sign in again.');
 const current=form.get('currentPassword'),password=form.get('newPassword'),confirmation=form.get('confirmPassword');
 if(typeof current!=='string'||typeof password!=='string'||typeof confirmation!=='string'||current.length>200||password.length>200||password.length<10)return fail(ar?'كلمة المرور الجديدة يجب أن تكون من 10 إلى 200 حرف.':'New password must contain 10 to 200 characters.');
 if(password!==confirmation)return fail(ar?'تأكيد كلمة المرور غير مطابق.':'Password confirmation does not match.');
 if(current===password)return fail(ar?'اختر كلمة مرور مختلفة عن الحالية.':'Choose a password different from the current one.');
 const key='password:'+user.id,now=Date.now(),limit=attempts.get(key)||{count:0,until:now+60000};if(limit.until<now){limit.count=0;limit.until=now+60000}if(limit.count>=5)return fail(ar?'انتظر دقيقة قبل المحاولة مجددًا.':'Wait a minute before trying again.');limit.count++;attempts.set(key,limit);
 const client=authClient();
 try{
  const {data,error}=await client.auth.signInWithPassword({email:user.email,password:current});
  if(error||data.user?.id!==user.id||!await accessForUser(data.user,data.session!.access_token))return fail(ar?'كلمة المرور الحالية غير صحيحة.':'Current password is incorrect.');
  const result=await client.auth.updateUser({password});
  if(result.error){await client.auth.signOut({scope:'local'});return fail(ar?'تعذر تغيير كلمة المرور. جرّب كلمة أقوى أو حاول مجددًا.':'Unable to update password. Try a stronger password or try again.');}
  await client.auth.signOut({scope:'global'});
  (await cookies()).delete({name:adminCookie,path:'/admin'});
  return {error:'',success:true};
 }catch{return fail(ar?'تعذر الاتصال. حاول مجددًا.':'Unable to connect. Try again.');}
}

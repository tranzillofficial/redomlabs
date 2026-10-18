'use client';
import {useEffect,useRef,useState} from 'react';
type InstallEvent=Event&{prompt:()=>Promise<void>;userChoice:Promise<{outcome:string}>};
export function AdminInstall({ar}:{ar:boolean}){
 const t=(a:string,b:string)=>ar?a:b;
 const [prompt,setPrompt]=useState<InstallEvent|null>(null),[installed,setInstalled]=useState(false),[help,setHelp]=useState(false),[busy,setBusy]=useState(false),[offline,setOffline]=useState(false);
 const dialog=useRef<HTMLDialogElement>(null);
 useEffect(()=>{
  if('serviceWorker' in navigator)navigator.serviceWorker.register('/admin/sw.js',{scope:'/admin/',updateViaCache:'none'}).catch(()=>{});
  const mode=window.matchMedia('(display-mode: standalone)'),check=()=>setInstalled(mode.matches||!!(navigator as Navigator&{standalone?:boolean}).standalone),capture=(event:Event)=>{event.preventDefault();setPrompt(event as InstallEvent)},done=()=>{setInstalled(true);setPrompt(null)},network=()=>setOffline(!navigator.onLine);
  check();network();window.addEventListener('beforeinstallprompt',capture);window.addEventListener('appinstalled',done);mode.addEventListener('change',check);window.addEventListener('online',network);window.addEventListener('offline',network);
  return ()=>{window.removeEventListener('beforeinstallprompt',capture);window.removeEventListener('appinstalled',done);mode.removeEventListener('change',check);window.removeEventListener('online',network);window.removeEventListener('offline',network)};
 },[]);
 useEffect(()=>{if(help)dialog.current?.showModal()},[help]);
 return <>{offline&&<p className="admin-offline-note" role="status">{t('الاتصال بالإنترنت غير متاح','You are offline')}</p>}{!installed&&<button className="admin-install-button" disabled={busy} onClick={async()=>{if(!prompt){setHelp(true);return}setBusy(true);try{await prompt.prompt();const choice=await prompt.userChoice;if(choice.outcome==='accepted')setInstalled(true)}catch{setHelp(true)}finally{setPrompt(null);setBusy(false)}}}><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M12 3v12m-4-4 4 4 4-4M4 16v5h16v-5"/></svg>{t('تثبيت التطبيق','Install app')}</button>}{help&&<dialog ref={dialog} className="crm-dialog customer-dialog install-help-dialog" aria-label={t('تثبيت التطبيق','Install app')} onCancel={()=>setHelp(false)} onClose={()=>setHelp(false)}><div className="customer-dialog-heading"><h2>{t('تثبيت التطبيق','Install app')}</h2><button className="admin-secondary" onClick={()=>setHelp(false)}>{t('إغلاق','Close')}</button></div><p>{t('على Android أو اللاب: افتح قائمة Chrome أو Edge واختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».','On Android or desktop: open the Chrome or Edge menu and choose “Install app” or “Add to Home screen”.')}</p><p>{t('على iPhone أو iPad: افتح الصفحة في Safari، ثم مشاركة ← إضافة إلى الشاشة الرئيسية.','On iPhone or iPad: open this page in Safari, then Share → Add to Home Screen.')}</p><small>{t('لوحة الإدارة تحتاج إنترنت لعرض وحفظ البيانات.','An internet connection is required to load and save admin data.')}</small></dialog>}</>;
}

'use client';
import {useRef,useState} from 'react';
import {maxContactPeople,type ContactPerson} from '../lib/contact-settings';
type Row=ContactPerson&{key:number};
export function ContactPeopleEditor({ar,initial}:{ar:boolean;initial:ContactPerson[]}){
 const t=(a:string,b:string)=>ar?a:b;
 const nextKey=useRef(initial.length);
 const [rows,setRows]=useState<Row[]>(()=>initial.map((r,key)=>({...r,key})));
 const update=(key:number,field:keyof ContactPerson,value:string)=>setRows(current=>current.map(row=>row.key===key?{...row,[field]:value}:row));
 return <div className="contact-people-editor">
  <input type="hidden" name="contact_people" value={JSON.stringify(rows.map(({phone,name,job_title,email})=>({phone,name,job_title,email})))}/>
  <p className="admin-caption">{t('الاسم والمسمّى الوظيفي والإيميل اختياريون. يمكنك إضافة رقم فقط.','Name, job title and email are optional. You can add just a phone number.')}</p>
  {rows.map((r,index)=><div className="contact-person-editor" key={r.key}>
   <div className="contact-person-phone"><label>{t(`رقم الهاتف ${index+1}`,`Phone number ${index+1}`)}<input type="tel" dir="ltr" required maxLength={40} pattern="[+0-9\(\) \-]{7,40}" value={r.phone} onChange={e=>update(r.key,'phone',e.target.value)} autoComplete="tel"/></label><button type="button" className="admin-secondary" onClick={()=>setRows(current=>current.filter(row=>row.key!==r.key))} aria-label={t(`حذف رقم الهاتف ${index+1}`,`Remove phone number ${index+1}`)}>{t('حذف','Remove')}</button></div>
   <details open={r.name||r.job_title||r.email?true:undefined}><summary>{t('تفاصيل اختيارية','Optional details')}</summary><div className="contact-person-fields">
    <label>{t('الاسم (اختياري)','Name (optional)')}<input dir="auto" maxLength={100} value={r.name} onChange={e=>update(r.key,'name',e.target.value)} autoComplete="off"/></label>
    <label>{t('المسمّى الوظيفي (اختياري)','Job title (optional)')}<input dir="auto" maxLength={100} value={r.job_title} onChange={e=>update(r.key,'job_title',e.target.value)} autoComplete="off"/></label>
    <label>{t('البريد الإلكتروني (اختياري)','Email (optional)')}<input type="email" dir="ltr" maxLength={254} value={r.email} onChange={e=>update(r.key,'email',e.target.value)} autoComplete="off"/></label>
   </div></details>
  </div>)}
  <button type="button" className="admin-secondary contact-person-add" disabled={rows.length>=maxContactPeople} onClick={()=>{const key=nextKey.current++;setRows(current=>[...current,{key,phone:'',name:'',job_title:'',email:''}])}}> <span aria-hidden="true">+</span> {t('إضافة رقم هاتف','Add phone number')}</button>
 </div>;
}

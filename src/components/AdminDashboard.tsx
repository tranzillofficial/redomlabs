'use client';
import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {logout} from '../app/(admin)/admin/[locale]/actions';
import {AionMark} from './AionMark';
import {AdminProjects} from './AdminProjects';
import {AdminContact} from './AdminContact';
import {AdminPasswordSettings} from './AdminPasswordSettings';
import {AdminProposalsManager} from './AdminProposalsManager';

type Product={id:number;name:string;ar:string;en:string;category:string};
const initial:Product={id:1,name:'MenuzQR',ar:'منيو رقمي وأدوات للمطاعم والكافيهات.',en:'Digital menus and restaurant tools.',category:'SaaS'};
const paths=[
  'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z', // 0 Overview
  'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', // 1 Proposals / Pitch (New!)
  'M4 7h16v14H4zM8 7V3h8v4M4 12h16', // 2 Products
  'M16 21v-3a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v3M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8M17 3a4 4 0 0 1 0 8M22 21v-3a4 4 0 0 0-3-4', // 3 Customers
  'M3 4h18v14H8l-5 3zM7 8h10M7 12h7', // 4 Inquiries
  'M5 3h14v18H5zM8 7h8M8 11h8M8 15h5', // 5 Forms
  'M4 6h16M4 12h16M4 18h16M8 3v6M16 9v6M10 15v6' // 6 Settings
];

export function AdminDashboard({ar}:{ar:boolean}){
 const locale=ar?'ar':'en';
 const [tab,setTab]=useState(0);
 const [search,setSearch]=useState('');
 const [client,setClient]=useState<number|null>(null);
 const [toast,setToast]=useState('');
 const [mobile,setMobile]=useState(false);

 const dialog=useRef<HTMLDialogElement>(null);
 const toastTimer=useRef<ReturnType<typeof setTimeout>|null>(null);

 const labels=ar
  ?['نظرة عامة','العروض والمقترحات 💼','المنتجات','العملاء CRM','الاستفسارات','النماذج','الإعدادات','أعمال العملاء']
  :['Overview','Proposals & Pitch 💼','Products','Customers CRM','Inquiries','Forms','Settings','Client work'];

 useEffect(()=>{document.documentElement.lang=locale;document.documentElement.dir=ar?'rtl':'ltr'},[ar,locale]);
 useEffect(()=>{if(client!==null)dialog.current?.showModal();else dialog.current?.close()},[client]);
 useEffect(()=>()=>{if(toastTimer.current)clearTimeout(toastTimer.current)},[]);

 function notify(text:string){setToast(text);if(toastTimer.current)clearTimeout(toastTimer.current);toastTimer.current=setTimeout(()=>setToast(''),4500)}
 function go(i:number){setTab(i);setSearch('');setMobile(false)}
 const samples=ar?[{name:'عميل تجريبي ٠١',need:'تطوير موقع',path:'/ar/services#technology',state:'استفسار جديد'},{name:'عميل تجريبي ٠٢',need:'تسويق رقمي',path:'/ar/services#marketing',state:'مسودة متابعة'}]:[{name:'Sample customer 01',need:'Website development',path:'/en/services#technology',state:'New inquiry'},{name:'Sample customer 02',need:'Digital marketing',path:'/en/services#marketing',state:'Follow-up draft'}];

 return <div className="admin-shell" dir={ar?'rtl':'ltr'} lang={locale}>
 <aside className={`admin-sidebar ${mobile?'open':''}`}><Link href={`/${locale}`} className="admin-wordmark">REDOM <span>LABS</span></Link><div className="workspace-label">{ar?'مساحة الإدارة':'ADMIN WORKSPACE'}</div><nav aria-label={ar?'أقسام لوحة الإدارة':'Administration sections'}>{labels.map((name,i)=><button key={name} onClick={()=>go(i)} aria-pressed={tab===i}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={paths[i]||paths[2]}/></svg>{name}{i===1&&<span className="nav-count" style={{background:'#176b58',color:'#fff'}}>NEW</span>}</button>)}</nav><div className="sidebar-bottom"><span className="prototype-dot"/>{ar?'لوحة إدارة الموقع':'Website administration'}<Link href={`/${locale}`}>{ar?'عرض الموقع':'View website'} ↗</Link><form action={logout}><input type="hidden" name="locale" value={locale}/><button>{ar?'تسجيل الخروج':'Sign out'}</button></form></div></aside>
 <div className="admin-workspace"><header className="admin-topbar"><button className="admin-menu" onClick={()=>setMobile(v=>!v)} aria-expanded={mobile} aria-label={ar?'قائمة الإدارة':'Administration menu'}>☰</button><span>REDOM / <strong>{labels[tab]}</strong></span><div><Link href={`/admin/${ar?'en':'ar'}/dashboard`}>{ar?'EN':'عربي'}</Link><span className="admin-avatar" aria-label={ar?'حساب المسؤول':'Administrator account'}>IN</span></div></header>
 <main className="admin-main"><div className="prototype-banner"><span>{ar?'لوحة التحكم':'WORKSPACE'}</span><p>{ar?'إدارة العروض الخاصة بالعملاء، المشاريع، وخدمات Redom Labs.':'Manage client proposals, products, and Redom Labs services.'}</p></div><div className="admin-title"><div><p>{ar?'لوحة REDOM LABS':'REDOM LABS WORKSPACE'}</p><h1>{labels[tab]}</h1></div></div>
 {tab===0&&<><div className="admin-stats">{(ar?[['عروض العملاء','نشط','عروض مخصصة'],['المنتجات المعروضة','1','MenuzQR'],['العملاء','—','CRM'],['الاستفسارات','—','النماذج']]:[['Proposals','Active','Client Pitches'],['Published products','1','MenuzQR'],['Customers','—','CRM'],['Inquiries','—','Forms']]).map(([label,value,note])=><article key={label}><p>{label}</p><strong>{value}</strong><small>{note}</small></article>)}</div><div className="admin-overview-grid"><section className="admin-card"><div className="card-heading"><h2>{ar?'عروض العملاء وال Pitch':'Proposals & Client Pitches'}</h2><span className="admin-tag" style={{background:'#eaf3ee',color:'#176b58'}}>{ar?'ميزة متكاملة':'Live Feature'}</span></div><div style={{padding:'10px 0'}}><p style={{fontSize:'14px',color:'#587164',lineHeight:'1.7'}}>{ar?'يمكنك الآن إنشاء وتخصيص عروض أسعار ومقترحات تقنية لكل عميل برابط خاص وكلمة سر مع تفاصيل الأقسام والأسعار المبدئية.':'You can now build and share private, interactive proposals and pitches for clients with passcode authentication and rich sections.'}</p><button className="button button-primary" style={{marginTop:'12px'}} onClick={()=>go(1)}>{ar?'إدارة العروض والمقترحات ↗':'Manage Proposals ↗'}</button></div></section><section className="admin-card"><div className="card-heading"><h2>{ar?'روابط سريعة':'Shortcuts'}</h2><AionMark/></div>{[1,2,7,4,6].map(i=><button className="admin-shortcut" onClick={()=>go(i)} key={i}>{labels[i]}<span>↗</span></button>)}</section></div><section className="admin-card recent-product"><div><p className="eyebrow">{ar?'المنتج الحالي':'CURRENT PRODUCT'}</p><h2>MenuzQR</h2><p>{ar?initial.ar:initial.en}</p></div><button className="admin-secondary" onClick={()=>go(2)}>{ar?'إدارة المنتجات':'Manage products'} ↗</button></section></>}
 {tab===1&&<AdminProposalsManager ar={ar} />}
 {tab===2&&<AdminProjects key="product" ar={ar} kind="product"/>}
 {tab===7&&<AdminProjects key="work" ar={ar} kind="work"/>}
 {tab===3&&<section className="admin-card"><div className="card-heading"><h2>{ar?'علاقات العملاء':'Customer relationships'}</h2><span className="admin-tag">{ar?'أمثلة توضيحية':'Illustrative samples'}</span></div><label className="admin-search"><span className="sr-only">{ar?'بحث العملاء':'Search customers'}</span><input placeholder={ar?'بحث بالعميل أو الاهتمام…':'Search by customer or interest…'} value={search} onChange={e=>setSearch(e.target.value)}/></label><div className="admin-table-wrap"><table><thead><tr>{(ar?['العميل','الاهتمام','الصفحة','الحالة','']:['Customer','Interest','Page','Status','']).map((h,i)=><th key={i}>{h}</th>)}</tr></thead><tbody>{samples.map((s,i)=>({...s,i})).filter(s=>(s.name+s.need).toLowerCase().includes(search.toLowerCase())).map(s=><tr key={s.i}><td><strong>{s.name}</strong><small>{ar?'سجل تجريبي':'Sample record'}</small></td><td>{s.need}</td><td><code>{s.path}</code></td><td><span className="admin-tag">{s.state}</span></td><td><button className="admin-link" onClick={()=>setClient(s.i)}>{ar?'التفاصيل':'Details'} ↗</button></td></tr>)}</tbody></table></div><p className="admin-caption">{ar?'الزيارات المجهولة لا تكشف هوية العميل. ربط الزيارة بعميل يحتاج بيانات يقدّمها بنفسه وإعدادات خصوصية مناسبة.':'Anonymous visits do not identify a customer. Linking activity to a customer requires information they provide and appropriate privacy settings.'}</p></section>}
 {tab===4&&<AdminContact ar={ar}/>}
 {tab===5&&<section className="admin-card"><h2>{ar?'نموذج التواصل':'Contact form'}</h2><p>{ar?'الرسائل الواردة تظهر في صندوق الاستفسارات. بيانات التواصل تُدار من الإعدادات.':'Incoming messages appear in the inquiry inbox. Contact details are managed in Settings.'}</p><Link className="button" href={`/${locale}/contact`}>{ar?'عرض نموذج التواصل':'View contact form'} ↗</Link></section>}
 {tab===6&&<><AdminContact ar={ar} settings/><section className="admin-card settings-preview"><div className="card-heading"><h2>{ar?'إعدادات الموقع':'Website settings'}</h2><span className="admin-tag">{ar?'عرض فقط':'View only'}</span></div>{(ar?[['العلامة','REDOM LABS'],['اللغات','العربية والإنجليزية'],['المظهر الافتراضي','فاتح'],['المساعد','AION'],['جمع الزيارات','غير متصل'],['عروض العملاء','متصلة ومحمية']]:[['Brand','REDOM LABS'],['Languages','Arabic & English'],['Default theme','Light'],['Assistant','AION'],['Visit tracking','Not connected'],['Client proposals','Connected & Protected']]).map(([k,v])=><div className="setting-row" key={k}><span>{k}</span><strong>{v}</strong></div>)}</section><AdminPasswordSettings ar={ar}/></>}
 </main><div className="admin-bottom">REDOM LABS <span>{ar?'مساحة الإدارة':'Administration workspace'}</span></div></div>
 <dialog ref={dialog} className="admin-dialog" onCancel={()=>{setClient(null)}}><div className="card-heading"><h2>{ar?'ملف عميل توضيحي':'Sample customer profile'}</h2><button className="dialog-close" onClick={()=>{setClient(null)}} aria-label={ar?'إغلاق':'Close'}>×</button></div>{client!==null&&<><h3>{samples[client].name}</h3><p>{samples[client].need}</p><p className="admin-caption">{ar?'مسار توضيحي، وليس سجل زيارات حقيقيًا.':'An illustrative journey, not real visit history.'}</p><ol className="admin-timeline">{[`/${locale}`,samples[client].path,`/${locale}/contact`].map(p=><li key={p}><code>{p}</code><span>{ar?'خطوة تجريبية':'Sample step'}</span></li>)}</ol><button className="admin-secondary" onClick={()=>{setClient(null);go(4)}}>{ar?'عرض الاستفسارات':'View inquiries'} ↗</button></>}</dialog>
 {toast&&<div className="admin-toast" role="status">{toast}</div>}
 </div>;
}

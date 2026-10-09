'use client';
import {useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {logout} from '../app/(admin)/admin/[locale]/actions';
import {AionMark} from './AionMark';
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
 const [products,setProducts]=useState<Product[]>([initial]);
 const [editing,setEditing]=useState<Product|null>(null);
 const [search,setSearch]=useState('');
 const [client,setClient]=useState<number|null>(null);
 const [selected,setSelected]=useState(0);
 const [drafts,setDrafts]=useState<Record<number,string>>({});
 const [toast,setToast]=useState('');
 const [mobile,setMobile]=useState(false);

 const dialog=useRef<HTMLDialogElement>(null);
 const toastTimer=useRef<ReturnType<typeof setTimeout>|null>(null);

 const labels=ar
  ?['نظرة عامة','العروض والمقترحات 💼','المنتجات','العملاء CRM','الاستفسارات','النماذج','الإعدادات']
  :['Overview','Proposals & Pitch 💼','Products','Customers CRM','Inquiries','Forms','Settings'];

 useEffect(()=>{document.documentElement.lang=locale;document.documentElement.dir=ar?'rtl':'ltr'},[ar,locale]);
 useEffect(()=>{if(editing||client!==null)dialog.current?.showModal();else dialog.current?.close()},[editing,client]);
 useEffect(()=>()=>{if(toastTimer.current)clearTimeout(toastTimer.current)},[]);

 function notify(text:string){setToast(text);if(toastTimer.current)clearTimeout(toastTimer.current);toastTimer.current=setTimeout(()=>setToast(''),4500)}
 function go(i:number){setTab(i);setSearch('');setMobile(false)}
 function save(e:React.FormEvent<HTMLFormElement>){
   e.preventDefault();
   const f=new FormData(e.currentTarget);
   const p:Product={id:editing!.id,name:String(f.get('name')).trim(),ar:String(f.get('ar')).trim(),en:String(f.get('en')).trim(),category:String(f.get('category')).trim()};
   setProducts(all=>all.some(x=>x.id===p.id)?all.map(x=>x.id===p.id?p:x):[...all,p]);
   setEditing(null);
   notify(ar?'تم حفظ المعاينة داخل هذه الصفحة فقط. لم تُنشر على الموقع.':'Preview saved for this page only. It was not published to the website.')
 }

 const samples=ar?[{name:'عميل تجريبي ٠١',need:'تطوير موقع',path:'/ar/services#technology',state:'استفسار جديد'},{name:'عميل تجريبي ٠٢',need:'تسويق رقمي',path:'/ar/services#marketing',state:'مسودة متابعة'}]:[{name:'Sample customer 01',need:'Website development',path:'/en/services#technology',state:'New inquiry'},{name:'Sample customer 02',need:'Digital marketing',path:'/en/services#marketing',state:'Follow-up draft'}];

 return <div className="admin-shell" dir={ar?'rtl':'ltr'} lang={locale}>
 <aside className={`admin-sidebar ${mobile?'open':''}`}><Link href={`/${locale}`} className="admin-wordmark">REDOM <span>LABS</span></Link><div className="workspace-label">{ar?'مساحة الإدارة':'ADMIN WORKSPACE'}</div><nav aria-label={ar?'أقسام لوحة الإدارة':'Administration sections'}>{labels.map((name,i)=><button key={name} onClick={()=>go(i)} aria-pressed={tab===i}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={paths[i]}/></svg>{name}{i===4&&<span className="nav-count">2</span>}{i===1&&<span className="nav-count" style={{background:'#176b58',color:'#fff'}}>NEW</span>}</button>)}</nav><div className="sidebar-bottom"><span className="prototype-dot"/>{ar?'معاينة واجهة الإدارة':'Interface prototype'}<Link href={`/${locale}`}>{ar?'عرض الموقع':'View website'} ↗</Link><form action={logout}><input type="hidden" name="locale" value={locale}/><button>{ar?'تسجيل الخروج':'Sign out'}</button></form></div></aside>
 <div className="admin-workspace"><header className="admin-topbar"><button className="admin-menu" onClick={()=>setMobile(v=>!v)} aria-expanded={mobile} aria-label={ar?'قائمة الإدارة':'Administration menu'}>☰</button><span>REDOM / <strong>{labels[tab]}</strong></span><div><Link href={`/admin/${ar?'en':'ar'}/dashboard`}>{ar?'EN':'عربي'}</Link><span className="admin-avatar" aria-label={ar?'حساب المسؤول':'Administrator account'}>IN</span></div></header>
 <main className="admin-main"><div className="prototype-banner"><span>{ar?'لوحة التحكم':'WORKSPACE'}</span><p>{ar?'إدارة العروض الخاصة بالعملاء، المشاريع، وخدمات Redom Labs.':'Manage client proposals, products, and Redom Labs services.'}</p></div><div className="admin-title"><div><p>{ar?'لوحة REDOM LABS':'REDOM LABS WORKSPACE'}</p><h1>{labels[tab]}</h1></div>{tab===2&&<button className="button" onClick={()=>setEditing({id:Date.now(),name:'',ar:'',en:'',category:'SaaS'})}>{ar?'إضافة منتج':'Add product'} +</button>}</div>
 {tab===0&&<><div className="admin-stats">{(ar?[['عروض العملاء','نشط','عروض مخصصة'],['المنتجات المعروضة','1','MenuzQR'],['العملاء','—','CRM'],['الاستفسارات','—','النماذج']]:[['Proposals','Active','Client Pitches'],['Published products','1','MenuzQR'],['Customers','—','CRM'],['Inquiries','—','Forms']]).map(([label,value,note])=><article key={label}><p>{label}</p><strong>{value}</strong><small>{note}</small></article>)}</div><div className="admin-overview-grid"><section className="admin-card"><div className="card-heading"><h2>{ar?'عروض العملاء وال Pitch':'Proposals & Client Pitches'}</h2><span className="admin-tag" style={{background:'#eaf3ee',color:'#176b58'}}>{ar?'ميزة متكاملة':'Live Feature'}</span></div><div style={{padding:'10px 0'}}><p style={{fontSize:'14px',color:'#587164',lineHeight:'1.7'}}>{ar?'يمكنك الآن إنشاء وتخصيص عروض أسعار ومقترحات تقنية لكل عميل برابط خاص وكلمة سر مع تفاصيل الأقسام والأسعار المبدئية.':'You can now build and share private, interactive proposals and pitches for clients with passcode authentication and rich sections.'}</p><button className="button button-primary" style={{marginTop:'12px'}} onClick={()=>go(1)}>{ar?'إدارة العروض والمقترحات ↗':'Manage Proposals ↗'}</button></div></section><section className="admin-card"><div className="card-heading"><h2>{ar?'روابط سريعة':'Shortcuts'}</h2><AionMark/></div>{[1,2,3,4,6].map(i=><button className="admin-shortcut" onClick={()=>go(i)} key={i}>{labels[i]}<span>↗</span></button>)}</section></div><section className="admin-card recent-product"><div><p className="eyebrow">{ar?'المنتج الحالي':'CURRENT PRODUCT'}</p><h2>MenuzQR</h2><p>{ar?initial.ar:initial.en}</p></div><button className="admin-secondary" onClick={()=>go(2)}>{ar?'إدارة المنتجات':'Manage products'} ↗</button></section></>}
 {tab===1&&<AdminProposalsManager ar={ar} />}
 {tab===2&&<section className="admin-card"><div className="card-heading"><h2>{ar?'كتالوج المنتجات':'Product catalog'}</h2><span className="admin-tag">{ar?'تعديلات المعاينة فقط':'Preview edits only'}</span></div><label className="admin-search"><span className="sr-only">{ar?'بحث المنتجات':'Search products'}</span><input placeholder={ar?'بحث عن منتج…':'Search products…'} value={search} onChange={e=>setSearch(e.target.value)}/></label><div className="admin-product-grid">{products.filter(p=>p.name.toLowerCase().includes(search.toLowerCase())).map(p=><article className="admin-product" key={p.id}><span className="admin-tag">{p.category}</span><h3>{p.name}</h3><p>{ar?p.ar:p.en}</p><div><span>{p.id===1?(ar?'المنتج المعروض حاليًا':'Currently featured'):(ar?'مسودة معاينة':'Preview draft')}</span><button onClick={()=>setEditing(p)}>{ar?'تعديل':'Edit'} ↗</button></div></article>)}</div>{!products.some(p=>p.name.toLowerCase().includes(search.toLowerCase()))&&<p className="admin-empty">{ar?'لا توجد نتائج.':'No results found.'}</p>}<p className="admin-caption">{ar?'الإضافة والتعديل هنا للمعاينة. إعادة تحميل الصفحة تعيد البيانات الأصلية.':'Additions and edits are preview only. Reloading restores the original data.'}</p></section>}
 {tab===3&&<section className="admin-card"><div className="card-heading"><h2>{ar?'علاقات العملاء':'Customer relationships'}</h2><span className="admin-tag">{ar?'أمثلة توضيحية':'Illustrative samples'}</span></div><label className="admin-search"><span className="sr-only">{ar?'بحث العملاء':'Search customers'}</span><input placeholder={ar?'بحث بالعميل أو الاهتمام…':'Search by customer or interest…'} value={search} onChange={e=>setSearch(e.target.value)}/></label><div className="admin-table-wrap"><table><thead><tr>{(ar?['العميل','الاهتمام','الصفحة','الحالة','']:['Customer','Interest','Page','Status','']).map((h,i)=><th key={i}>{h}</th>)}</tr></thead><tbody>{samples.map((s,i)=>({...s,i})).filter(s=>(s.name+s.need).toLowerCase().includes(search.toLowerCase())).map(s=><tr key={s.i}><td><strong>{s.name}</strong><small>{ar?'سجل تجريبي':'Sample record'}</small></td><td>{s.need}</td><td><code>{s.path}</code></td><td><span className="admin-tag">{s.state}</span></td><td><button className="admin-link" onClick={()=>setClient(s.i)}>{ar?'التفاصيل':'Details'} ↗</button></td></tr>)}</tbody></table></div><p className="admin-caption">{ar?'الزيارات المجهولة لا تكشف هوية العميل. ربط الزيارة بعميل يحتاج بيانات يقدّمها بنفسه وإعدادات خصوصية مناسبة.':'Anonymous visits do not identify a customer. Linking activity to a customer requires information they provide and appropriate privacy settings.'}</p></section>}
 {tab===4&&<AdminContact ar={ar}/>}
 {tab===5&&<section className="admin-card form-preview"><div className="card-heading"><h2>{ar?'نموذج بدء مشروع':'Project inquiry form'}</h2><span className="admin-tag">{ar?'معاينة غير منشورة':'Unpublished preview'}</span></div><p>{ar?'تصوّر مبسط لجمع احتياج العميل لاحقًا.':'A simple starting point for future customer inquiries.'}</p><form onSubmit={e=>{e.preventDefault();notify(ar?'هذه معاينة فقط. لم يتم جمع أو إرسال البيانات.':'Preview only. No data was collected or sent.')}}><label>{ar?'الخدمة المطلوبة':'Service needed'}<select><option>{ar?'التكنولوجيا والبرمجة':'Technology & development'}</option><option>{ar?'التسويق الرقمي':'Digital marketing'}</option></select></label><label>{ar?'ملخص الاحتياج':'What do you need?'}<textarea rows={4} placeholder={ar?'وصف مختصر…':'A brief description…'}/></label><button className="admin-secondary">{ar?'اختبار المعاينة':'Test preview'}</button></form></section>}
 {tab===6&&<><AdminContact ar={ar} settings/><section className="admin-card settings-preview"><div className="card-heading"><h2>{ar?'إعدادات الموقع':'Website settings'}</h2><span className="admin-tag">{ar?'عرض فقط':'View only'}</span></div>{(ar?[['العلامة','REDOM LABS'],['اللغات','العربية والإنجليزية'],['المظهر الافتراضي','فاتح'],['المساعد','AION'],['جمع الزيارات','غير متصل'],['عروض العملاء','متصلة ومحمية']]:[['Brand','REDOM LABS'],['Languages','Arabic & English'],['Default theme','Light'],['Assistant','AION'],['Visit tracking','Not connected'],['Client proposals','Connected & Protected']]).map(([k,v])=><div className="setting-row" key={k}><span>{k}</span><strong>{v}</strong></div>)}</section><AdminPasswordSettings ar={ar}/></>}
 </main><div className="admin-bottom">REDOM LABS <span>{ar?'مساحة الإدارة':'Administration workspace'}</span></div></div>
 <dialog ref={dialog} className="admin-dialog" onCancel={()=>{setEditing(null);setClient(null)}}><div className="card-heading"><h2>{editing?(ar?'معاينة المنتج':'Product preview'):(ar?'ملف عميل توضيحي':'Sample customer profile')}</h2><button className="dialog-close" onClick={()=>{setEditing(null);setClient(null)}} aria-label={ar?'إغلاق':'Close'}>×</button></div>{editing&&<form onSubmit={save} key={editing.id}><label>{ar?'اسم المنتج':'Product name'}<input name="name" defaultValue={editing.name} required maxLength={80}/></label><label>{ar?'التصنيف':'Category'}<input name="category" defaultValue={editing.category} required maxLength={40}/></label><label>{ar?'الوصف بالعربية':'Arabic description'}<textarea name="ar" dir="rtl" defaultValue={editing.ar} required maxLength={240}/></label><label>{ar?'الوصف بالإنجليزية':'English description'}<textarea name="en" dir="ltr" defaultValue={editing.en} required maxLength={240}/></label><p className="admin-caption">{ar?'الحفظ يغيّر المعاينة فقط.':'Saving updates the preview only.'}</p><button className="button">{ar?'حفظ المعاينة':'Save preview'}</button></form>}{client!==null&&<><h3>{samples[client].name}</h3><p>{samples[client].need}</p><p className="admin-caption">{ar?'مسار توضيحي، وليس سجل زيارات حقيقيًا.':'An illustrative journey, not real visit history.'}</p><ol className="admin-timeline">{[`/${locale}`,samples[client].path,`/${locale}/contact`].map(p=><li key={p}><code>{p}</code><span>{ar?'خطوة تجريبية':'Sample step'}</span></li>)}</ol><button className="admin-secondary" onClick={()=>{setClient(null);go(4)}}>{ar?'عرض الاستفسارات':'View inquiries'} ↗</button></>}</dialog>
 {toast&&<div className="admin-toast" role="status">{toast}</div>}
 </div>;
}

'use client';
import {useCallback,useEffect,useState} from 'react';
import {loadDashboardSummary} from '../app/(admin)/admin/[locale]/dashboard-actions';
type Section='crm'|'sales'|'expenses'|'products'|'work'|'inquiries'|'proposals';
export function AdminOverview({ar,onNavigate}:{ar:boolean;onNavigate:(section:Section)=>void}){
 const t=(a:string,b:string)=>ar?a:b;
 const [data,setData]=useState<Awaited<ReturnType<typeof loadDashboardSummary>>>(null),[loading,setLoading]=useState(true),[failed,setFailed]=useState(false),[currency,setCurrency]=useState('EGP');
 const refresh=useCallback(async()=>{setLoading(true);setFailed(false);try{const r=await loadDashboardSummary();setData(r);setFailed(!r)}catch{setFailed(true)}finally{setLoading(false)}},[]);
 useEffect(()=>{void refresh()},[refresh]);
 const currencies=Array.from(new Set([...(data?.sales||[]).map(r=>r.currency),...(data?.purchases||[]).map(r=>r.currency)]));
 const selected=currencies.includes(currency)?currency:currencies[0]||'EGP';
 const sales=data?.sales?.find(r=>r.currency===selected),purchase=data?.purchases?.find(r=>r.currency===selected);
 const money=(value:number)=>new Intl.NumberFormat('en',{maximumFractionDigits:2}).format(value);
 const stages={customer:t('عميل حالي','Customer'),potential:t('عميل محتمل','Potential'),follow_up:t('متابعة','Follow-up')};
 const content=([['products',t('المنتجات','Products')],['work',t('أعمال العملاء','Client work')],['proposals',t('العروض','Proposals')],['inquiries',t('رسائل التواصل','Inquiries')]] as const).filter(([key])=>data?.[key]!==undefined);
 return <div className="overview" aria-busy={loading}>
  <div className="overview-toolbar"><span>{t('ملخص حالي • جميع الفترات','Current snapshot • All time')}</span><button onClick={refresh} disabled={loading}>{loading?t('جارٍ التحديث…','Updating…'):t('تحديث','Refresh')} <span aria-hidden="true">↻</span></button></div>
  {failed?<div className="overview-empty" role="alert">{t('تعذر تحميل الملخص. جرّب التحديث.','Unable to load the summary. Try refreshing.')}</div>:loading&&!data?<div className="overview-loading" role="status">{t('جارٍ تحميل الملخص…','Loading summary…')}</div>:data&&<>
  {data.customers!==undefined&&<section className="overview-metrics" aria-label={t('ملخص العملاء','Customer summary')}>
   {([[t('إجمالي العملاء','Total customers'),data.crm?.all],[t('عملاء حاليون','Current customers'),data.crm?.customer],[t('عملاء محتملون','Potential customers'),data.crm?.potential],[t('قيد المتابعة','In follow-up'),data.crm?.follow_up]] as const).map(([label,value])=><div key={label}><span>{label}</span><strong>{value??'—'}</strong></div>)}
  </section>}
  {(data.sales!==undefined||data.purchases!==undefined)&&<section className="overview-panel"><header><h2>{t('ملخص الحسابات','Account summary')}</h2>{currencies.length>1&&<select aria-label={t('عملة الملخص','Summary currency')} value={selected} onChange={e=>setCurrency(e.target.value)}>{currencies.map(c=><option key={c}>{c}</option>)}</select>}</header><div className="overview-finance">
   {data.sales!==undefined&&[[t('إجمالي المبيعات','Total sales'),sales?.total],[t('المحصّل','Collected'),sales?.paid],[t('المتبقي','Outstanding'),sales?.remaining]].map(([label,value])=><div key={label}><span>{label}</span><strong dir="ltr">{data.sales===null?'—':money(Number(value||0))} <small>{selected}</small></strong></div>)}
   {data.purchases!==undefined&&<div><span>{t('فواتير المشتريات','Purchase bills')}</span><strong dir="ltr">{data.purchases===null?'—':money(Number(purchase?.total||0))} <small>{selected}</small></strong></div>}
  </div>{(data.sales===null||data.purchases===null)&&<p role="status" className="overview-error">{t('تعذر تحميل بعض الحسابات. جرّب التحديث.','Some account totals could not be loaded. Try refreshing.')}</p>}<footer>{data.sales!==undefined&&<button onClick={()=>onNavigate('sales')}>{t('تفاصيل المبيعات','View sales')} ←</button>}{data.purchases!==undefined&&<button onClick={()=>onNavigate('expenses')}>{t('سجل الفواتير','Invoice register')} ←</button>}</footer></section>}
  {data.customers!==undefined&&<section className="overview-panel"><header><div><h2>{t('أحدث العملاء','Recent customers')}</h2><p>{t('آخر ٥ سجلات • الحالة وموعد المتابعة','Latest 5 records • Status and follow-up date')}</p></div><button onClick={()=>onNavigate('crm')}>{t('عرض العملاء','View customers')} ←</button></header>
   {data.customers===null?<p className="overview-empty" role="status">{t('تعذر تحميل العملاء.','Unable to load customers.')}</p>:data.customers.length? <div className="overview-customers">{data.customers.map(r=><div className="overview-customer" key={r.id}><span className="overview-initial" aria-hidden="true">{r.name.charAt(0)}</span><div className="overview-person"><strong>{r.name}</strong>{r.business&&<span>{r.business}</span>}</div><span className={`overview-stage stage-${r.stage}`}>{stages[r.stage]}</span><time dateTime={r.date||undefined}>{r.date?new Intl.DateTimeFormat(ar?'ar-EG':'en-GB',{day:'numeric',month:'short',timeZone:'UTC'}).format(new Date(r.date)):t('بدون موعد','No date')}</time></div>)}</div>:<p className="overview-empty">{t('لا يوجد عملاء بعد. ابدأ بتسجيل عميل من قسم العملاء.','No customers yet. Register your first customer in Customers.')}</p>}
  </section>}
  {content.length>0&&<section className="overview-content" aria-label={t('المحتوى والتواصل','Content and communication')}>{content.map(([key,label])=><button key={key} onClick={()=>onNavigate(key)}><span>{label}</span><strong>{data[key]??'—'}</strong><span aria-hidden="true">↗</span></button>)}</section>}
  {data.customers===undefined&&data.sales===undefined&&data.purchases===undefined&&!content.length&&<p className="overview-empty">{t('لا توجد أقسام متاحة للملخص ضمن صلاحيات حسابك.','No summary sections are available with your account permissions.')}</p>}
  </>}
 </div>;
}

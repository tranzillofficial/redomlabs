'use client';
import {createServiceCatalog,businessTypes,isCatalog,catalogTotals,type BusinessType} from '../lib/proposal-catalog';
import type {ProposalRequest} from '../lib/proposal-request-types';
import {AdminImagePicker} from './AdminImagePicker';
import { useState, useEffect, useRef } from 'react';
import {proposalTotals} from '../lib/proposal-pricing';
import { Proposal, ProposalSection } from '../lib/proposal-types';
import { getAdminProposalsAction, saveProposalAction, deleteProposalAction, getProposalRequestsAction } from '../app/(admin)/admin/[locale]/proposal-actions';

export function AdminProposalsManager({ ar }: { ar: boolean }) {
  const [requests,setRequests]=useState<ProposalRequest[]>([]);
  const [requestError,setRequestError]=useState(false);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Proposal | null>(null);
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);
  const [imageBusy,setImageBusy]=useState(false);
  const proposalDialog=useRef<HTMLDialogElement>(null);
  useEffect(()=>{if(editing&&!proposalDialog.current?.open)proposalDialog.current?.showModal()},[editing]);

  useEffect(() => {
    loadProposals();
    getProposalRequestsAction().then(r=>{setRequests(r.data);setRequestError(!r.success)});
  }, []);

  async function loadProposals() {
    setLoading(true);
    try {
      const res = await getAdminProposalsAction();
      if (res.success && res.data) {
        setProposals(res.data);
      } else {notify(ar?'تعذر تحميل العروض. تحقق من إعداد قاعدة البيانات.':'Unable to load proposals. Check the database setup.');}
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  }

  function notify(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 4500);
  }

  function createNewProposal() {
    const newP: Proposal = {
      id: 'prop-' + Date.now(),
      slug: 'offer-' + Math.floor(1000 + Math.random() * 9000),
      title: '',
      clientName: '',
      clientEmail: '',
      passcode: String(Math.floor(1000 + Math.random() * 9000)),
      summary: '',
      initialPrice: '',
      currency: 'SAR',
      deliveryTime: '4-6 أسابيع / 4-6 Weeks',
      validUntil: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().split('T')[0],
      status: 'active',
      sections: [
        {
          id: 'sec-' + Date.now() + '-1',
          title: ar ? 'نطاق العمل والهندسة البرمجية' : 'Project Scope & Architecture',
          description: ar ? 'توضيح متطلبات التطوير والتقنيات المستخدمة...' : 'Technical scope and system architecture breakdown...',
          imageUrl: '',
          bullets: [
            ar ? 'تصميم واجهات وتجربة مستخدم عصرية' : 'Modern responsive UI/UX design',
            ar ? 'أداء عالي وحماية بيانات متقدمة' : 'High performance & secure architecture'
          ]
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setEditing(newP);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing||imageBusy) return;

    if (!editing.title.trim() || !editing.clientName.trim() || !editing.slug.trim() || !editing.passcode.trim()) {
      notify(ar ? 'يرجى تعبئة الحقول الأساسية المطلوبة.' : 'Please fill all required fields.');
      return;
    }

    setSaving(true);
    try {
      const res = await saveProposalAction(editing);
      if (res.success) {
        notify(ar ? 'تم حفظ العرض بنجاح!' : 'Proposal saved successfully!');
        setEditing(null);
        await loadProposals();
      } else {
        notify(ar ? 'حدث خطأ أثناء الحفظ.' : 'Error saving proposal.');
      }
    } catch {
      notify(ar ? 'فشل الاتصال بالخادم.' : 'Connection failure.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(ar ? 'هل أنت متأكد من حذف هذا العرض نهائياً؟' : 'Are you sure you want to delete this proposal?')) return;
    try {
      const result=await deleteProposalAction(id);
      if(!result.success)throw new Error();
      notify(ar ? 'تم حذف العرض.' : 'Proposal deleted.');
      await loadProposals();
    } catch {
      notify(ar ? 'تعذر الحذف.' : 'Failed to delete.');
    }
  }

  function createGeneralProposal(){
    const now=new Date().toISOString();
    setEditing({id:crypto.randomUUID(),slug:'offer-'+Date.now(),title:'العرض العام للخدمات || Service proposal',clientName:'',passcode:'',summary:'اختَر الخدمات التي تحتاجها وسنعد لك عرضًا مناسبًا لنشاطك. || Choose the services you need and we will prepare a quote for your business.',initialPrice:'',currency:'EGP',status:'active',sections:createServiceCatalog(),createdAt:now,updatedAt:now});
  }

  function addSection() {
    if (!editing) return;
    const newSec: ProposalSection = {
      catalog:isCatalog(editing.sections),enabled:true,
      id: 'sec-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      title: ar ? 'قسم جديد' : 'New Section',
      description: '',
      imageUrl: '',
      bullets: ['']
    };
    setEditing({
      ...editing,
      sections: [...editing.sections, newSec]
    });
  }

  function removeSection(index: number) {
    if (!editing) return;
    const next = [...editing.sections];
    next.splice(index, 1);
    setEditing({ ...editing, sections: next });
  }

  function updateSection(index: number, key: keyof ProposalSection, value: any) {
    if (!editing) return;
    const next = [...editing.sections];
    next[index] = { ...next[index], [key]: value };
    if(key==='startingPrice'&&next[index].businessVariants){const business=next[index].defaultBusinessType||'restaurant';next[index].businessVariants={...next[index].businessVariants,[business]:{...next[index].businessVariants?.[business],startingPrice:value}}}
    setEditing({ ...editing, sections: next });
  }

  function copyProposalLink(slug: string, passcode: string) {
    const url = `${window.location.origin}/proposal/${slug}`;
    const textToCopy = `${url}\n${ar ? 'رمز الدخول' : 'Passcode'}: ${passcode}`;
    navigator.clipboard.writeText(textToCopy);
    notify(ar ? 'تم نسخ الرابط ورمز المرور إلى الحافظة 📋' : 'Link and passcode copied to clipboard 📋');
  }

  const filtered = proposals.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.clientName.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="admin-card proposal-manager-card">
      <div className="card-heading">
        <div>
          <h2>{ar ? 'عروض العملاء' : 'Client proposals'}</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#657b72' }}>
            {ar ? 'إنشاء عروض مخصصة للعملاء بروابط خاصة ورمز مرور' : 'Create protected customized client proposals with private passcode links'}
          </p>
        </div>
        <button className="button button-primary" onClick={createNewProposal}>
          {ar ? 'إنشاء عرض جديد +' : 'Create New Proposal +'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', margin: '20px 0' }}>
        <label className="admin-search" style={{ margin: 0, flex: 1, maxWidth: '400px' }}>
          <span className="sr-only">{ar ? 'بحث بالعروض' : 'Search proposals'}</span>
          <input
            placeholder={ar ? 'بحث بالعنوان أو العميل أو الرابط...' : 'Search by title, client or slug...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </label>
      </div>

      <button type="button" className="admin-primary" style={{margin:'16px 0'}} onClick={createGeneralProposal}>{ar?'+ إنشاء عرض خدمات عام':'+ New service catalog proposal'}</button>
      {loading ? (
        <div style={{ padding: '30px', textAlign: 'center', color: '#88978f' }}>
          {ar ? 'جاري تحميل العروض...' : 'Loading proposals...'}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: '40px 20px', textAlign: 'center', background: '#f8faf9', borderRadius: '12px', border: '1px dashed #dce5de' }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#657b72' }}>
            {ar ? 'لا توجد عروض حالياً. اضغط على "إنشاء عرض جديد" للبدء.' : 'No proposals found. Click "Create New Proposal" to get started.'}
          </p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table>
            <thead>
              <tr>
                <th>{ar ? 'المقترح / العميل' : 'Proposal / Client'}</th>
                <th>{ar ? 'الرابط المخصص' : 'Custom Endpoint'}</th>
                <th>{ar ? 'رمز المرور' : 'Passcode'}</th>
                <th>{ar ? 'السعر المبدئي' : 'Initial Price'}</th>
                <th>{ar ? 'الحالة' : 'Status'}</th>
                <th style={{ textAlign: 'end' }}>{ar ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td>
                    <strong>{p.title || (ar ? 'بدون عنوان' : 'Untitled')}</strong>
                    <small>{p.clientName} {p.clientEmail ? `(${p.clientEmail})` : ''}</small>
                  </td>
                  <td>
                    <code>/proposal/{p.slug}</code>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 'bold', background: '#eaf3ee', padding: '4px 8px', borderRadius: '6px', color: '#176b58' }}>
                      {p.passcode}
                    </span>
                  </td>
                  <td>
                    <strong>{p.initialPrice ? `${p.initialPrice} ${p.currency}` : '—'}</strong>
                  </td>
                  <td>
                    <span className="admin-tag" style={{
                      background: p.status === 'active' ? '#eaf3ee' : '#f5f7f6',
                      color: p.status === 'active' ? '#176b58' : '#728c7e'
                    }}>
                      {p.status === 'active' ? (ar ? 'نشط ومتاح' : 'Active') : p.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'end' }}>
                    <div style={{ display: 'inline-flex', gap: '8px' }}>
                      <button
                        className="admin-secondary"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                        onClick={() => copyProposalLink(p.slug, p.passcode)}
                        title={ar ? 'نسخ الرابط ورمز المرور' : 'Copy link and passcode'}
                      >
                        {ar ? 'نسخ الرابط' : 'Copy Link'}
                      </button>
                      <a
                        href={`/proposal/${p.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="admin-secondary"
                        style={{ padding: '6px 12px', fontSize: '12px', textDecoration: 'none' }}
                      >
                        {ar ? 'معاينة' : 'View'}
                      </a>
                      <button
                        className="admin-secondary"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                        onClick={() => setEditing(p)}
                      >
                        {ar ? 'تعديل' : 'Edit'}
                      </button>
                      <button
                        className="admin-secondary"
                        style={{ padding: '6px 12px', fontSize: '12px', color: '#c53030' }}
                        onClick={() => handleDelete(p.id)}
                      >
                        {ar?'حذف':'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <section className="admin-card" style={{marginTop:24}}><div className="card-heading"><h2>{ar?'طلبات عروض مخصصة':'Custom quote requests'}</h2><button type="button" className="admin-secondary" onClick={()=>getProposalRequestsAction().then(r=>{setRequests(r.data);setRequestError(!r.success)})}>{ar?'تحديث':'Refresh'}</button></div>{requestError&&<p role="alert">{ar?'تعذر تحميل الطلبات.':'Unable to load requests.'}</p>}{!requestError&&!requests.length&&<p>{ar?'لا توجد طلبات حتى الآن.':'No requests yet.'}</p>}{requests.map(r=><article className="contact-inquiry" key={r.id}><h3>{r.client_name} · {r.contact_name}</h3><a href={`tel:${r.phone.replace(/[^+0-9]/g,'')}`} dir="ltr">{r.phone}</a><p>{r.proposal_slug} · {businessTypes.find(b=>b.id===r.business_type)?.[ar?'ar':'en']} · {new Date(r.created_at).toLocaleString(ar?'ar-EG':'en-GB')}</p><ul>{r.sections.map(section=><li key={section.id}>{ar?section.title:section.titleEn||section.title} — {section.startingPrice??0} {r.currency} ({section.billing||'once'}){section.monthlyPrice!==undefined?` + ${section.monthlyPrice} ${r.currency} / ${ar?'شهر':'month'}`:''}</li>)}</ul><p style={{whiteSpace:'pre-wrap'}}>{r.notes}</p><small>{ar?'تقدير أول سنة':'First-year estimate'}: {catalogTotals(r.sections).firstYear.toLocaleString()} {r.currency}</small></article>)}</section>
      {/* Proposal Edit / Create Modal */}
      {editing && (
        <dialog ref={proposalDialog} onCancel={e=>{e.preventDefault();if(!saving&&!imageBusy)setEditing(null)}} className="admin-dialog proposal-dialog" style={{ width: '840px', maxWidth: '95vw' }}>
          <div className="card-heading">
            <h2>{editing.id.startsWith('prop-') && !editing.title ? (ar ? 'إنشاء مقترح جديد' : 'New Proposal') : (ar ? 'تعديل بيانات المقترح' : 'Edit Proposal')}</h2>
            <button className="dialog-close" disabled={saving||imageBusy} aria-label={ar?"إغلاق":"Close"} onClick={() => setEditing(null)}>×</button>
          </div>

          <form onSubmit={handleSave} style={{ maxHeight: '72vh', overflowY: 'auto', paddingRight: '6px' }}>
            <div style={{marginBottom:20}}><strong>{ar?'نوع العرض':'Proposal type'}</strong><p>{isCatalog(editing.sections)?(ar?'عرض خدمات عام — العميل يختار خدماته ويرسل طلب عرض مخصص':'Service catalog — client selects services and requests a quote'):(ar?'عرض مخصص بالتفاصيل الحالية':'Existing detailed proposal')}</p>{!isCatalog(editing.sections)&&<button type="button" className="admin-secondary" onClick={()=>{if(confirm(ar?'استبدال الأقسام الحالية بكتالوج الخدمات؟':'Replace current sections with the service catalog?'))setEditing({...editing,sections:createServiceCatalog(),currency:'EGP'})}}>{ar?'استخدام كتالوج الخدمات':'Use service catalog'}</button>}{isCatalog(editing.sections)&&<label>{ar?'النشاط الافتراضي':'Default business'}<select value={editing.sections.find(s=>s.catalog)?.defaultBusinessType||'restaurant'} onChange={e=>setEditing({...editing,sections:editing.sections.map(s=>({...s,defaultBusinessType:e.target.value as BusinessType}))})}>{businessTypes.map(b=><option key={b.id} value={b.id}>{ar?b.ar:b.en}</option>)}</select></label>}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <label>
                <strong>{ar ? 'عنوان العرض / المشروع *' : 'Proposal Title *'}</strong>
                <input
                  required
                  value={editing.title}
                  onChange={e => setEditing({ ...editing, title: e.target.value })}
                  placeholder={ar ? 'مثال: تطوير منصة التجارة والتطبيق الذكي' : 'e.g. E-Commerce Platform & Mobile App'}
                />
              </label>

              <label>
                <strong>{ar ? 'اسم العميل / الجهة *' : 'Client / Company Name *'}</strong>
                <input
                  required
                  value={editing.clientName}
                  onChange={e => setEditing({ ...editing, clientName: e.target.value })}
                  placeholder={ar ? 'مثال: شركة الرؤية المتقدمة' : 'e.g. Vision Co.'}
                />
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '16px', marginTop: '14px' }}>
              <label>
                <strong>{ar ? 'نهاية الرابط (Slug) *' : 'URL Endpoint (Slug) *'}</strong>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '12px', color: '#88978f', direction: 'ltr' }}>/proposal/</span>
                  <input
                    required
                    value={editing.slug}
                    dir="ltr"
                    onChange={e => setEditing({ ...editing, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    placeholder="client-name-project"
                  />
                </div>
              </label>

              <label>
                <strong>{ar ? 'رمز المرور / الكود الخاص *' : 'Passcode / Access Code *'}</strong>
                <input
                  required={editing.slug!=='general'}
                  disabled={editing.slug==='general'}
                  value={editing.passcode}
                  dir="ltr"
                  onChange={e => setEditing({ ...editing, passcode: e.target.value })}
                  placeholder="e.g. 1234 or client-key"
                />
              </label>

              <label>
                <strong>{ar ? 'بريد العميل (اختياري)' : 'Client Email (Optional)'}</strong>
                <input
                  type="email"
                  value={editing.clientEmail || ''}
                  dir="ltr"
                  onChange={e => setEditing({ ...editing, clientEmail: e.target.value })}
                  placeholder="client@domain.com"
                />
              </label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginTop: '14px' }}>
              <label>
                <strong>{isCatalog(editing.sections)?(ar?'الإجمالي يتحدد حسب اختيار العميل':'Total depends on client selections'):(ar?'إجمالي البداية (يُحسب من البنود المسعّرة)':'Base total (calculated from priced sections)')}</strong>
                <input
                  readOnly={isCatalog(editing.sections)||editing.sections.some(s=>s.startingPrice!==undefined)}
                  value={isCatalog(editing.sections)?'—':editing.sections.some(s=>s.startingPrice!==undefined)?String(proposalTotals(editing.sections).baseFirstYear):editing.initialPrice}
                  onChange={e => setEditing({ ...editing, initialPrice: e.target.value })}
                  placeholder={ar ? 'مثال: 35,000' : 'e.g. 35,000'}
                />
              </label>

              <label>
                <strong>{ar ? 'العملة' : 'Currency'}</strong>
                <select
                  value={editing.currency}
                  onChange={e => setEditing({ ...editing, currency: e.target.value })}
                >
                  <option value="SAR">SAR (ريال سعودي)</option>
                  <option value="AED">AED (درهم إماراتي)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="EGP">EGP (جنيه مصري)</option>
                </select>
              </label>

              <label>
                <strong>{ar ? 'المدة المتوقعة للتسليم' : 'Estimated Timeline'}</strong>
                <input
                  value={editing.deliveryTime || ''}
                  onChange={e => setEditing({ ...editing, deliveryTime: e.target.value })}
                  placeholder={ar ? 'مثال: 4-6 أسابيع' : 'e.g. 4-6 Weeks'}
                />
              </label>
            </div>

            <label style={{ marginTop: '14px' }}>
              <strong>{ar ? 'المقدمة والملخص التنفيذي' : 'Executive Summary & Overview'}</strong>
              <textarea
                rows={3}
                value={editing.summary}
                onChange={e => setEditing({ ...editing, summary: e.target.value })}
                placeholder={ar ? 'ملخص عام للمشروع والقيمة المضافة التي ستقدمها Redom Labs للعميل...' : 'Brief summary of the project goals and value proposition...'}
              />
            </label>

            {/* SECTIONS MANAGER */}
            <div style={{ marginTop: '24px', borderTop: '1px solid #dce5de', paddingTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '17px' }}>
                  {ar ? 'أقسام العرض وتفاصيل العمل (Sections)' : 'Proposal Sections & Work Breakdown'}
                </h3>
                <button type="button" className="admin-secondary" onClick={addSection}>
                  {ar ? '+ إضافة قسم جديد' : '+ Add Section'}
                </button>
              </div>

              {editing.sections.map((sec, sIdx) => (
                <div key={sec.id || sIdx} style={{ background: '#f8faf9', border: '1px solid #dce5de', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '13px', color: '#176b58' }}>
                      {ar ? `القسم #${sIdx + 1}` : `Section #${sIdx + 1}`}
                    </span>
                    {isCatalog(editing.sections)&&<label><input type="checkbox" checked={sec.enabled!==false} onChange={e=>updateSection(sIdx,'enabled',e.target.checked)}/>{ar?'إظهار للعميل':'Show to client'}</label>}
                    {editing.sections.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSection(sIdx)}
                        style={{ border: 0, background: 'none', color: '#c53030', fontSize: '12px', cursor: 'pointer' }}
                      >
                        {ar ? 'حذف القسم' : 'Remove'}
                      </button>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
                    <label>
                      <span style={{ fontSize: '12px', color: '#587164' }}>{ar ? 'عنوان القسم *' : 'Section Title *'}</span>
                      <input
                        required
                        value={sec.title}
                        onChange={e => updateSection(sIdx, 'title', e.target.value)}
                        placeholder={ar ? 'مثال: نطاق العمل / التصميم والواجهات' : 'e.g. Scope of Work / UI Architecture'}
                      />
                    </label>

                    <label>
                      <span style={{ fontSize: '12px', color: '#587164' }}>{ar ? 'رابط الصورة التوضيحية (اختياري)' : 'Image URL (Optional)'}</span>
                      <input
                        value={sec.imageUrl || ''}
                        dir="ltr"
                        onChange={e => updateSection(sIdx, 'imageUrl', e.target.value)}
                        placeholder="/hero.png or https://..."
                      />
                    </label>
                  </div>

                  <div className="proposal-admin-prices">
                    <label>{ar?'السعر يبدأ من':'Starting price'}<input type="number" min="0" step="1" value={sec.businessVariants?.[sec.defaultBusinessType||'restaurant']?.startingPrice ?? sec.startingPrice ?? ''} onChange={e=>updateSection(sIdx,'startingPrice',e.target.value===''?undefined:Number(e.target.value))}/></label>
                    <label>{ar?'طريقة الدفع':'Billing'}<select value={sec.billing||'once'} onChange={e=>updateSection(sIdx,'billing',e.target.value)}><option value="once">{ar?'مرة واحدة':'One-time'}</option><option value="annual">{ar?'سنوي':'Annual'}</option><option value="monthly">{ar?'شهري':'Monthly'}</option></select></label>
                    <label><input type="checkbox" checked={!!sec.optional} onChange={e=>updateSection(sIdx,'optional',e.target.checked)}/>{ar?'إضافة اختيارية خارج إجمالي البداية':'Optional, excluded from base total'}</label>
                  </div>
                  <div className="proposal-admin-prices"><label>{ar?'رابط تفاصيل الباقات':'Package details URL'}<input type="url" value={sec.detailsUrl||''} onChange={e=>updateSection(sIdx,'detailsUrl',e.target.value)}/></label><label>{ar?'رابط الباقات بالإنجليزية':'English package URL'}<input type="url" value={sec.detailsUrlEn||''} onChange={e=>updateSection(sIdx,'detailsUrlEn',e.target.value)}/></label><label>{ar?'عنوان السعر أو توضيح المجانية':'Price label / included wording'}<input value={sec.priceLabelAr||''} onChange={e=>updateSection(sIdx,'priceLabelAr',e.target.value)}/></label></div>
                  {isCatalog(editing.sections)&&<label>{ar?'اشتراك شهري إضافي يبدأ من (اختياري)':'Additional monthly subscription from (optional)'}<input type="number" min="0" value={sec.monthlyPrice??''} onChange={e=>updateSection(sIdx,'monthlyPrice',e.target.value===''?undefined:Number(e.target.value))}/></label>}
                  {sec.businessVariants&&<details><summary>{ar?'أسعار ومميزات حسب النشاط':'Prices and features by business'}</summary>{businessTypes.map(b=><div key={b.id}><h4>{ar?b.ar:b.en}</h4><label>{ar?'يبدأ من':'From'}<input type="number" min="0" value={sec.businessVariants?.[b.id]?.startingPrice??''} onChange={e=>updateSection(sIdx,'businessVariants',{...sec.businessVariants,[b.id]:{...sec.businessVariants?.[b.id],startingPrice:e.target.value===''?undefined:Number(e.target.value)}})}/></label><label>{ar?'المميزات بالعربية':'Arabic features'}<textarea value={(sec.businessVariants?.[b.id]?.bullets||[]).join('\n')} onChange={e=>updateSection(sIdx,'businessVariants',{...sec.businessVariants,[b.id]:{...sec.businessVariants?.[b.id],bullets:e.target.value.split('\n')}})}/></label><label>English features<textarea value={(sec.businessVariants?.[b.id]?.bulletsEn||[]).join('\n')} onChange={e=>updateSection(sIdx,'businessVariants',{...sec.businessVariants,[b.id]:{...sec.businessVariants?.[b.id],bulletsEn:e.target.value.split('\n')}})}/></label></div>)}</details>}
                  <details><summary>{ar?'النص الإنجليزي':'English copy'}</summary>
                    <label>English title<input value={sec.titleEn||''} onChange={e=>updateSection(sIdx,'titleEn',e.target.value)}/></label>
                    <label>English description<textarea value={sec.descriptionEn||''} onChange={e=>updateSection(sIdx,'descriptionEn',e.target.value)}/></label>
                    <label>English bullets<textarea value={(sec.bulletsEn||[]).join('\n')} onChange={e=>updateSection(sIdx,'bulletsEn',e.target.value.split('\n').filter(Boolean))}/></label>
                  </details>
                  <AdminImagePicker ar={ar} crop value={sec.imageUrl||''} disabled={saving||imageBusy} onBusyChange={setImageBusy} onImages={urls=>updateSection(sIdx,'imageUrl',urls[0])}/>
                  <label style={{ marginTop: '10px' }}>
                    <span style={{ fontSize: '12px', color: '#587164' }}>{ar ? 'وصف القسم والتفاصيل' : 'Section Description & Scope'}</span>
                    <textarea
                      rows={2}
                      value={sec.description}
                      onChange={e => updateSection(sIdx, 'description', e.target.value)}
                      placeholder={ar ? 'شرح تفصيلي لهذا الجزء من المشروع...' : 'Detailed explanation of this section...'}
                    />
                  </label>

                  {/* Bullet points */}
                  <div style={{ marginTop: '10px' }}>
                    <span style={{ fontSize: '12px', color: '#587164', display: 'block', marginBottom: '6px' }}>
                      {ar ? 'النقاط والمخرجات الرئيسية (مفصولة بأسطر):' : 'Key deliverables (one per line):'}
                    </span>
                    <textarea
                      rows={2}
                      value={(sec.bullets || []).join('\n')}
                      onChange={e => updateSection(sIdx, 'bullets', e.target.value.split('\n').filter(Boolean))}
                      placeholder={ar ? 'نقطة ١\nنقطة ٢\nنقطة ٣' : 'Feature 1\nFeature 2\nFeature 3'}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px', borderTop: '1px solid #dce5de', paddingTop: '16px' }}>
              <button type="button" className="admin-secondary" disabled={saving||imageBusy} onClick={() => setEditing(null)}>
                {ar ? 'إلغاء' : 'Cancel'}
              </button>
              <button type="submit" className="button button-primary" disabled={saving||imageBusy}>
                {saving ? (ar ? 'جاري الحفظ...' : 'Saving...') : (ar ? 'حفظ العرض والمقترح' : 'Save Proposal')}
              </button>
            </div>
          </form>
        </dialog>
      )}

      {toast && <div className="admin-toast" role="status">{toast}</div>}
    </section>
  );
}

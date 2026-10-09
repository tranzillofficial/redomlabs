'use client';
import { useState, useEffect } from 'react';
import { Proposal, ProposalSection } from '../lib/proposal-types';
import { getAdminProposalsAction, saveProposalAction, deleteProposalAction } from '../app/(admin)/admin/[locale]/proposal-actions';

export function AdminProposalsManager({ ar }: { ar: boolean }) {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Proposal | null>(null);
  const [toast, setToast] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadProposals();
  }, []);

  async function loadProposals() {
    setLoading(true);
    try {
      const res = await getAdminProposalsAction();
      if (res.success && res.data) {
        setProposals(res.data);
      }
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
          imageUrl: '/landing2.png',
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
    if (!editing) return;

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
      await deleteProposalAction(id);
      notify(ar ? 'تم حذف العرض.' : 'Proposal deleted.');
      await loadProposals();
    } catch {
      notify(ar ? 'تعذر الحذف.' : 'Failed to delete.');
    }
  }

  function addSection() {
    if (!editing) return;
    const newSec: ProposalSection = {
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
          <h2>{ar ? 'عروض ومقترحات العملاء (Proposals & Pitches)' : 'Client Proposals & Pitches'}</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#657b72' }}>
            {ar ? 'إنشاء عروض تفاعلية مخصصة للعملاء بروابط مشفرة وكلمة مرور' : 'Create protected customized client proposals with private passcode links'}
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
                    <small>👤 {p.clientName} {p.clientEmail ? `(${p.clientEmail})` : ''}</small>
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
                        🔗 {ar ? 'نسخ الرابط' : 'Copy Link'}
                      </button>
                      <a 
                        href={`/proposal/${p.slug}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="admin-secondary" 
                        style={{ padding: '6px 12px', fontSize: '12px', textDecoration: 'none' }}
                      >
                        👁️ {ar ? 'معاينة' : 'View'}
                      </a>
                      <button 
                        className="admin-secondary" 
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                        onClick={() => setEditing(p)}
                      >
                        ✏️ {ar ? 'تعديل' : 'Edit'}
                      </button>
                      <button 
                        className="admin-secondary" 
                        style={{ padding: '6px 12px', fontSize: '12px', color: '#c53030' }}
                        onClick={() => handleDelete(p.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Proposal Edit / Create Modal */}
      {editing && (
        <dialog open className="admin-dialog" style={{ width: '840px', maxWidth: '95vw' }}>
          <div className="card-heading">
            <h2>{editing.id.startsWith('prop-') && !editing.title ? (ar ? 'إنشاء مقترح جديد' : 'New Proposal') : (ar ? 'تعديل بيانات المقترح' : 'Edit Proposal')}</h2>
            <button className="dialog-close" onClick={() => setEditing(null)}>×</button>
          </div>

          <form onSubmit={handleSave} style={{ maxHeight: '72vh', overflowY: 'auto', paddingRight: '6px' }}>
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
                  required 
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
                <strong>{ar ? 'السعر المبدئي / الإجمالي' : 'Initial Price'}</strong>
                <input 
                  value={editing.initialPrice} 
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
                    {editing.sections.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeSection(sIdx)} 
                        style={{ border: 0, background: 'none', color: '#c53030', fontSize: '12px', cursor: 'pointer' }}
                      >
                        ✕ {ar ? 'حذف القسم' : 'Remove'}
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
              <button type="button" className="admin-secondary" onClick={() => setEditing(null)}>
                {ar ? 'إلغاء' : 'Cancel'}
              </button>
              <button type="submit" className="button button-primary" disabled={saving}>
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

'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Proposal } from '../../../lib/proposal-types';
import { verifyClientProposalAccess } from '../../(admin)/admin/[locale]/proposal-actions';
import { Brand } from '../../../components/Brand';

export function ProposalClientView({ initialProposal, slug }: { initialProposal: Proposal | null; slug: string }) {
  const [passcode, setPasscode] = useState('');
  const [proposal, setProposal] = useState<Proposal | null>(initialProposal);
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [locale, setLocale] = useState<'ar' | 'en'>('ar');
  const [copied, setCopied] = useState(false);

  // Check if previously unlocked in this browser session
  useEffect(() => {
    const saved = sessionStorage.getItem(`redom_prop_${slug}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProposal(parsed);
        setUnlocked(true);
      } catch {
        // ignore
      }
    }
  }, [slug]);

  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (!passcode.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await verifyClientProposalAccess(slug, passcode.trim());
      if (res.success && res.proposal) {
        setProposal(res.proposal);
        setUnlocked(true);
        sessionStorage.setItem(`redom_prop_${slug}`, JSON.stringify(res.proposal));
      } else {
        if (res.error === 'not_found') {
          setError(locale === 'ar' ? 'العرض المطلوب غير متوفر أو تم نقله.' : 'Proposal not found.');
        } else {
          setError(locale === 'ar' ? 'رمز المرور غير صحيح. يرجى مراجعة الرمز المرسل لك.' : 'Invalid passcode. Please check the code provided to you.');
        }
      }
    } catch {
      setError(locale === 'ar' ? 'حدث خطأ في الاتصال. يرجى المحاولة لاحقاً.' : 'Connection error. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  function handleShare() {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  }

  const isAr = locale === 'ar';

  return (
    <div className="proposal-viewport" dir={isAr ? 'rtl' : 'ltr'} lang={locale}>
      {/* Top Header */}
      <header className="proposal-header">
        <div className="proposal-header-inner">
          <Link href={`/${locale}`} className="proposal-brand" aria-label="Redom Labs">
            <Brand compact />
            <span>LABS</span>
          </Link>
          <div className="proposal-header-controls">
            <button 
              className="proposal-lang-btn" 
              onClick={() => setLocale(isAr ? 'en' : 'ar')}
            >
              {isAr ? 'English' : 'العربية'}
            </button>
            <div className="proposal-badge-confidential">
              <span className="dot" />
              {isAr ? 'مستند سري وخاص' : 'Confidential Proposal'}
            </div>
          </div>
        </div>
      </header>

      {/* ACCESS GATE IF NOT UNLOCKED */}
      {!unlocked ? (
        <main className="proposal-gate-container">
          <div className="proposal-gate-card">
            <div className="gate-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            
            <p className="eyebrow">{isAr ? 'بوابة العروض والمقترحات' : 'SECURE CLIENT PORTAL'}</p>
            <h1>{isAr ? 'عرض مخصص وخاص' : 'Private Project Proposal'}</h1>
            <p className="gate-desc">
              {isAr 
                ? 'مرحباً بك. تم إعداد هذا العرض الفني والمالي خصيصاً لك من قِبل فريق REDOM LABS. يرجى إدخال رمز المرور الخاص بك للمتابعة.'
                : 'Welcome. This custom technical and commercial proposal has been prepared for you by the REDOM LABS team. Please enter your passcode to view the details.'}
            </p>

            <form onSubmit={handleUnlock} className="gate-form">
              <label>
                <span className="sr-only">{isAr ? 'رمز المرور' : 'Passcode'}</span>
                <input
                  type="text"
                  dir="ltr"
                  autoFocus
                  placeholder={isAr ? 'أدخل رمز المرور أو الكود هنا...' : 'Enter your passcode...'}
                  value={passcode}
                  onChange={e => setPasscode(e.target.value)}
                  className="gate-input"
                />
              </label>

              {error && <div className="gate-error" role="alert">{error}</div>}

              <button type="submit" className="button button-primary gate-submit-btn" disabled={loading}>
                {loading 
                  ? (isAr ? 'جاري التحقق...' : 'Verifying...') 
                  : (isAr ? 'فتح واستعراض العرض ↗' : 'Unlock Proposal ↗')}
              </button>
            </form>

            <div className="gate-footer">
              <small>
                {isAr 
                  ? 'إذا لم يكن لديك رمز المرور، يرجى التواصل مع مسؤول المشروع لدى REDOM LABS.' 
                  : 'If you do not have the passcode, please contact your project lead at REDOM LABS.'}
              </small>
            </div>
          </div>
        </main>
      ) : proposal ? (
        /* PROPOSAL CONTENT */
        <main className="proposal-main-content">
          {/* Hero Banner */}
          <section className="proposal-hero-section">
            <div className="proposal-hero-top">
              <div className="client-badge">
                <span>{isAr ? 'العميل الموقر:' : 'Prepared For:'}</span>
                <strong>{proposal.clientName}</strong>
              </div>
              <div className="proposal-meta-tags">
                <span className="proposal-date">
                  📅 {new Date(proposal.createdAt).toLocaleDateString(isAr ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
                {proposal.validUntil && (
                  <span className="proposal-validity">
                    ⏳ {isAr ? `صالح حتى: ${proposal.validUntil}` : `Valid until: ${proposal.validUntil}`}
                  </span>
                )}
              </div>
            </div>

            <h1 className="proposal-main-title">{proposal.title}</h1>
            
            {proposal.summary && (
              <p className="proposal-main-summary">{proposal.summary}</p>
            )}

            {/* Quick Highlights Bar */}
            <div className="proposal-highlights-grid">
              {proposal.initialPrice && (
                <div className="highlight-card highlight-price">
                  <span className="highlight-label">{isAr ? 'القيمة التقديرية / السعر' : 'Estimated Investment'}</span>
                  <div className="highlight-val">
                    <strong>{proposal.initialPrice}</strong>
                    <small>{proposal.currency}</small>
                  </div>
                </div>
              )}

              {proposal.deliveryTime && (
                <div className="highlight-card">
                  <span className="highlight-label">{isAr ? 'المدة الزمنية المتوقعة' : 'Expected Timeline'}</span>
                  <strong className="highlight-val-text">{proposal.deliveryTime}</strong>
                </div>
              )}

              <div className="highlight-card">
                <span className="highlight-label">{isAr ? 'منهجية العمل' : 'Methodology'}</span>
                <strong className="highlight-val-text">{isAr ? 'Agile & Milestone-Based' : 'Agile & Milestone-Based'}</strong>
              </div>
            </div>
          </section>

          {/* Proposal Sections */}
          <div className="proposal-sections-container">
            <div className="section-title-wrap">
              <p className="eyebrow">{isAr ? 'تفاصيل العرض ونطاق العمل' : 'DETAILED SCOPE OF WORK'}</p>
              <h2>{isAr ? 'المحاور والمخرجات الرئيسية' : 'Key Pillars & Deliverables'}</h2>
            </div>

            <div className="proposal-sections-list">
              {proposal.sections.map((sec, idx) => (
                <article key={sec.id || idx} className="proposal-section-card">
                  <div className="sec-header">
                    <div className="sec-index-pill">0{idx + 1}</div>
                    <h3 className="sec-title">{sec.title}</h3>
                  </div>

                  <div className="sec-body-grid">
                    <div className="sec-text-col">
                      {sec.description && (
                        <p className="sec-desc">{sec.description}</p>
                      )}

                      {sec.bullets && sec.bullets.length > 0 && (
                        <ul className="sec-bullets-list">
                          {sec.bullets.map((b, bIdx) => (
                            <li key={bIdx}>
                              <span className="bullet-check">✓</span>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {sec.imageUrl && (
                      <div className="sec-visual-col">
                        <div className="sec-image-frame">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={sec.imageUrl} alt={sec.title} className="sec-image" />
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Pricing & Commercial Terms Card */}
          <section className="proposal-pricing-section">
            <div className="pricing-card-inner">
              <div className="pricing-left">
                <p className="eyebrow">{isAr ? 'الخطة المالية' : 'INVESTMENT & TERMS'}</p>
                <h2>{isAr ? 'عرض القيمة والتسعير' : 'Commercial Offer'}</h2>
                <p className="pricing-desc">
                  {isAr 
                    ? 'يشمل العرض كافة المراحل من التحليل والتصميم، والتطوير البرمجي، وحتى الاختبارات الشاملة والإطلاق والدعم الفني.'
                    : 'The investment covers all stages: discovery, UI/UX design, full-stack development, QA testing, launch, and initial technical support.'}
                </p>
                
                <div className="pricing-perks">
                  <div>⚡ {isAr ? 'ضمان أداء وجودة كود 100%' : '100% Quality & Performance Guarantee'}</div>
                  <div>🛡️ {isAr ? 'دعم فني وصيانة مجانية بعد الإطلاق' : 'Free Post-Launch Warranty & Support'}</div>
                  <div>🔄 {isAr ? 'تسليم مرحلي واضح وموثق' : 'Milestone-based Delivery & Documentation'}</div>
                </div>
              </div>

              <div className="pricing-right">
                <div className="price-tag-box">
                  <span className="price-title">{isAr ? 'السعر التقديري الإجمالي' : 'Total Investment'}</span>
                  <div className="price-number">
                    <strong>{proposal.initialPrice || (isAr ? 'حسب النطاق' : 'Custom')}</strong>
                    {proposal.initialPrice && <span>{proposal.currency}</span>}
                  </div>
                  <span className="price-subtext">
                    {isAr ? 'تسديد مجدول حسب الإنجاز الفعلي' : 'Phased payment based on milestones'}
                  </span>
                </div>

                <div className="pricing-actions">
                  <Link href={`/${locale}/contact`} className="button button-primary full-btn">
                    {isAr ? 'الموافقة وبدء التنفيذ 🚀' : 'Approve & Get Started 🚀'}
                  </Link>
                  <button onClick={handleShare} className="button button-secondary full-btn">
                    {copied 
                      ? (isAr ? 'تم نسخ الرابط! ✓' : 'Link Copied! ✓') 
                      : (isAr ? 'مشاركة رابط العرض 🔗' : 'Share Proposal 🔗')}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Proposal Footer */}
          <div className="proposal-page-footer">
            <Link href={`/${locale}`} className="footer-back-brand">
              <Brand compact />
              <span>LABS</span>
            </Link>
            <p>
              {isAr 
                ? 'REDOM LABS • من الابتكار إلى الريادة • وثيقة مقترح رسمي' 
                : 'REDOM LABS • From Innovation to Domination • Official Proposal Document'}
            </p>
          </div>
        </main>
      ) : null}
    </div>
  );
}

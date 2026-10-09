import Link from 'next/link';
import { notFound } from 'next/navigation';
import { content, type Locale } from '../../content';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== 'ar' && locale !== 'en') notFound();
  const t = content[locale as Locale];
  const isAr = locale === 'ar';

  return (
    <div className="home-container">
      {/* 1. HERO SECTION */}
      <section className="landing-hero">
        <div className="landing-hero-grid">
          <div className="landing-hero-content">
            <h1 className="hero-title">
              {t.heroHeadline[0]}<br />
              <span className="hero-highlight">{t.heroHeadline[1]}</span>
            </h1>

            <p className="hero-intro">{t.heroIntro}</p>

            <div className="hero-actions">
              <Link className="button button-primary" href={`/${locale}/contact`}>
                <span>{t.start}</span>
                <span className="btn-arrow" aria-hidden="true">↗</span>
              </Link>
              <Link className="button button-secondary" href={`/${locale}/work`}>
                <span className="btn-play" aria-hidden="true">▶</span>
                <span>{t.heroExploreWork}</span>
              </Link>
            </div>

            <div className="hero-stats">
              {t.heroStats.map((stat, i) => (
                <div key={i} className="stat-item">
                  <strong className="stat-num">{stat.num}</strong>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="landing-hero-visual">
            <div className="hero-artwork-frame">
              <img
                src="/hero-2.png"
                alt="Redom Labs Growth & Strategy"
                className="hero-artwork-img"
              />
              <div className="hero-artwork-shade" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. EXPERTISE / SERVICES SECTION */}
      <section className="section expertise-section" id="services">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">{t.expertiseTitle}</h2>
          </div>
          <div className="section-header-right">
            <p className="section-subtitle">{t.expertiseSubtitle}</p>
            <Link className="textlink-cta" href={`/${locale}/services`}>
              <span>{t.allServices}</span>
              <span aria-hidden="true">{isAr ? '←' : '→'}</span>
            </Link>
          </div>
        </div>

        <div className="expertise-cards-grid">
          {/* Card 1: Technology & Development */}
          <div className="expertise-card">
            <div className="expertise-card-info">
              <div className="card-top-badges">
                <span className="card-num">{t.techCard.num}</span>
                <span className="card-code-badge">&lt;/&gt;</span>
              </div>
              <h3 className="card-title">{t.techCard.title}</h3>
              <p className="card-subtitle">{t.techCard.subtitle}</p>

              <ul className="card-feature-list">
                {t.techCard.items.map((item, idx) => (
                  <li key={idx}>
                    <span className="feature-icon">
                      {idx === 0 && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>}
                      {idx === 1 && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>}
                      {idx === 2 && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>}
                      {idx === 3 && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="m4.93 4.93 4.24 4.24" /><path d="m14.83 9.17 4.24-4.24" /><path d="m14.83 14.83 4.24 4.24" /><path d="m9.17 14.83-4.24 4.24" /></svg>}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Link className="card-cta-link" href={`/${locale}/services#technology`}>
                <span>{t.techCard.link}</span>
                <span aria-hidden="true">{isAr ? '←' : '→'}</span>
              </Link>
            </div>

            <div className="expertise-card-artwork">
              <img
                src="/technology-section.png"
                alt={t.techCard.title}
                className="card-artwork-img"
              />
            </div>
          </div>

          {/* Card 2: Digital Marketing */}
          <div className="expertise-card">
            <div className="expertise-card-info">
              <div className="card-top-badges">
                <span className="card-num">{t.marketingCard.num}</span>
                <span className="card-code-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                </span>
              </div>
              <h3 className="card-title">{t.marketingCard.title}</h3>
              <p className="card-subtitle">{t.marketingCard.subtitle}</p>

              <ul className="card-feature-list">
                {t.marketingCard.items.map((item, idx) => (
                  <li key={idx}>
                    <span className="feature-icon">
                      {idx === 0 && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>}
                      {idx === 1 && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /></svg>}
                      {idx === 2 && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>}
                      {idx === 3 && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Link className="card-cta-link" href={`/${locale}/services#marketing`}>
                <span>{t.marketingCard.link}</span>
                <span aria-hidden="true">{isAr ? '←' : '→'}</span>
              </Link>
            </div>

            <div className="expertise-card-artwork">
              <img
                src="/marketing-section.png"
                alt={t.marketingCard.title}
                className="card-artwork-img"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRODUCTS SECTION */}
      <section className="section products-feature-section">
        <div className="products-feature-card">
          <div className="products-feature-content">
            <h2 className="section-title">{t.productsTitle}</h2>
            <div className="products-desc-wrap">
              {t.productsDescription.split('\n').map((para, i) => (
                <p key={i} className="products-desc">{para}</p>
              ))}
            </div>
            <Link className="button button-primary" href={`/${locale}/products`}>
              <span>{t.productsExplore}</span>
              <span className="btn-arrow" aria-hidden="true">↗</span>
            </Link>
          </div>

          <div className="products-feature-visual">
            <div className="products-artwork-wrap">
              <img
                src="/ourlabs-section.png"
                alt="Redom Labs Products"
                className="products-artwork-img"
              />
              <div className="products-artwork-shade" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. APPROACH / PROCESS SECTION */}
      <section className="section approach-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">{t.approachTitle}</h2>
          </div>
          <p className="section-subtitle approach-subtitle">{t.approachSubtitle}</p>
        </div>

        <div className="approach-steps-flow">
          {t.approachSteps.map((step, idx) => (
            <div key={idx} className="approach-step-item">
              <div className="step-header">
                <div className="step-icon-circle">
                  {idx === 0 && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>}
                  {idx === 1 && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>}
                  {idx === 2 && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>}
                  {idx === 3 && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 9v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>}
                </div>
                <div className="step-meta">
                  <span className="step-num">{step.index}</span>
                  <h3 className="step-title">{step.title}</h3>
                </div>
              </div>

              <p className="step-desc">{step.desc}</p>

              {idx < 3 && (
                <div className="step-arrow-divider" aria-hidden="true">
                  <span className="divider-line" />
                  <span className="divider-arrow">{isAr ? '←' : '→'}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 5. BOTTOM PANORAMIC CTA BANNER WITH landing2.png */}
      <section className="section cta-panoramic-section">
        <div className="cta-panoramic-card">
          <img
            src="/landing2.png"
            alt="Let's build what's next"
            className="cta-bg-img"
          />
          <div className="cta-gradient-overlay" />

          <div className="cta-card-content">
            <div className="eyebrow-row">
              <p className="eyebrow">{t.ctaEyebrow}</p>
              <span className="eyebrow-line" aria-hidden="true" />
            </div>

            <h2 className="cta-heading">{t.ctaTitle}</h2>
            <p className="cta-subheading">{t.ctaSubtitle}</p>

            <div className="cta-buttons-row">
              <Link className="button button-primary" href={`/${locale}/contact`}>
                <span>{t.start}</span>
                <span className="btn-arrow" aria-hidden="true">↗</span>
              </Link>
              <Link className="button button-glass" href={`/${locale}/contact`}>
                <span>{t.ctaBookCall}</span>
              </Link>
            </div>
          </div>

          <div className="cta-floating-tags" aria-hidden="true">
            {t.ctaTags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

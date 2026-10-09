import '@fontsource/tajawal/400.css';
import '@fontsource/tajawal/500.css';
import '@fontsource/tajawal/700.css';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import { SiteEntrance } from '../../components/SiteEntrance';
import Script from 'next/script';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Brand } from '../../components/Brand';
import { Navigation } from '../../components/Navigation';
import { LanguageLink } from '../../components/LanguageLink';
import { ThemeToggle } from '../../components/ThemeToggle';
import { content, sections, type Locale } from '../../content';
import '../globals.css';

export const viewport = { width: 'device-width', initialScale: 1 };
export function generateStaticParams() { return [{ locale: 'en' }, { locale: 'ar' }]; }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== 'en' && locale !== 'ar') return {};
  return { title: { default: 'Redom Labs', template: '%s | Redom Labs' }, description: content[locale].intro };
}
const themeScript = `(function(){var t='light';try{if(localStorage.getItem('indom-theme')==='dark')t='dark'}catch(e){}document.documentElement.dataset.theme=t})()`;
export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== 'ar' && locale !== 'en') notFound();
  const l = locale as Locale; const t = content[l];
  return <html lang={l} dir={l === 'ar' ? 'rtl' : 'ltr'} data-theme="light" suppressHydrationWarning>
    <body>
      <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeScript }} />
      <SiteEntrance><a className="skip" href="#main">{t.skip}</a>
      <header className="site-header"><div className="header-inner">
        <Link href={`/${l}`} className="navbrand" aria-label="Redom Labs"><Brand compact /><span>LABS</span></Link>
        <Navigation locale={l} />
        <div className="header-tools"><LanguageLink locale={l} /><ThemeToggle ar={l === 'ar'} /><Link className="nav-cta" href={`/${l}/contact`}>{t.start}<span aria-hidden="true">↗</span></Link></div>
      </div></header>
      <main id="main">{children}</main>
      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-brand-wrap">
            <Link href={`/${l}`} className="footer-brand" aria-label="Redom Labs">
              <Brand compact />
              <span>LABS</span>
            </Link>
            <p className="footer-tagline">{t.footer}</p>
          </div>
          <nav className="footer-nav" aria-label="Footer Navigation">
            {sections.map((s, i) => (
              <Link key={s} href={`/${l}/${s}`}>
                {t.nav[i + 1]}
              </Link>
            ))}
          </nav>
          <div className="footer-socials">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="GitHub">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="social-icon" aria-label="X">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
              </svg>
            </a>
            <a href={`/${l}/contact`} className="social-icon" aria-label={l === 'ar' ? 'تواصل معنا' : 'Contact'}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="legal-links">
            {[
              ["privacy", l === "ar" ? "سياسة الخصوصية" : "Privacy Policy"],
              ["terms", l === "ar" ? "الشروط والأحكام" : "Terms of Service"],
              ["storage", l === "ar" ? "التخزين وملفات الارتباط" : "Storage & Cookies"]
            ].map(([path, label]) => (
              <Link key={path} href={`/${l}/${path}`}>{label}</Link>
            ))}
          </div>
          <p className="copyright">© 2026 Redom Labs. {t.rights}</p>
        </div>
      </footer></SiteEntrance>
    </body>
  </html>;
}

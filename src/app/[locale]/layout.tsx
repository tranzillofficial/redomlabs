import '@fontsource/tajawal/400.css';
import '@fontsource/tajawal/500.css';
import '@fontsource/tajawal/700.css';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import {FooterContact} from '../../components/FooterContact';
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
          <FooterContact ar={l==='ar'}/>
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

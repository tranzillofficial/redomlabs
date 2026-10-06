import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ServicePaths } from '../../components/ServicePaths';
import { content, type Locale } from '../../content';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== 'ar' && locale !== 'en') notFound();
  const ar = locale === 'ar';
  const t = content[locale as Locale];
  const choose = (en: string, arabic: string) => ar ? arabic : en;
  return <div className="growth-home">
    <section className="growth-hero">
      <div className="growth-hero-art" aria-hidden="true" />
      <div className="growth-hero-content">
        <p className="eyebrow">{choose('Technology × Marketing × Growth', 'تكنولوجيا × تسويق × نمو')}</p>
        <h1>{choose('Build digital products that move business', 'نبني منتجات رقمية تدفع أعمالك')} <em>{choose('forward.', 'للأمام.')}</em></h1>
        <p className="intro">{choose('We create software, digital products, and growth systems for ambitious businesses.', 'نطوّر البرمجيات والمنتجات الرقمية وحلول النمو لأعمال تطمح للمزيد.')}</p>
        <div className="actions"><Link className="button" href={`/${locale}/contact`}>{t.start}<span aria-hidden="true">→</span></Link><Link className="growth-outline" href="#approach"><span className="play-icon" aria-hidden="true">▶</span>{choose('See how we work', 'اكتشف طريقة شغلنا')}</Link></div>
        <div className="growth-highlights">{[
          [choose('Software', 'برمجيات'), choose('Built around your business', 'حلول تناسب نشاطك')],
          [choose('Marketing', 'تسويق'), choose('A presence with purpose', 'حضور يحقق هدفك')],
          [choose('AI & R&D', 'ذكاء اصطناعي'), choose('Explore what’s next', 'نبتكر خطوتك القادمة')],
        ].map(([title, desc]) => <div key={title}><strong>{title}</strong><span>{desc}</span></div>)}</div>
      </div>
    </section>
    <section id="services" className="section growth-services">
      <div className="section-heading"><div><p className="eyebrow">{choose('Our services', 'خدماتنا')}</p><h2>{choose('What can we build for you?', 'إيه اللي نقدر نبنيه ليك؟')}</h2></div><p>{choose('Technology and marketing working together to create real business impact.', 'التكنولوجيا والتسويق مع بعض، عشان نصنع تأثير حقيقي في شغلك.')}</p><Link className="textlink" href={`/${locale}/services`}>{t.allServices}<span aria-hidden="true">→</span></Link></div>
      <ServicePaths ar={ar} />
    </section>
    <section className="growth-products"><div className="growth-products-art" aria-hidden="true" /><div className="growth-products-content"><p className="eyebrow">{choose('Our products', 'منتجاتنا')}</p><h2>{choose('Products for real growth.', 'منتجات تصنع نمو حقيقي.')}</h2><p>{choose('We build and scale digital products to solve real business challenges.', 'نبني ونطوّر منتجات رقمية لحل تحديات حقيقية تواجه الأعمال.')}</p><Link className="button" href={`/${locale}/products`}>{choose('Explore products', 'اكتشف منتجاتنا')}<span aria-hidden="true">→</span></Link></div></section>
    <section id="approach" className="section growth-process"><div className="section-heading"><div><p className="eyebrow">{t.processLabel}</p><h2>{choose('From idea to impact.', 'من الفكرة للتأثير.')}</h2></div><p>{choose('A clear process. Direct communication. Thoughtful execution. Real results.', 'خطوات واضحة. تواصل مباشر. تنفيذ مدروس. نتائج حقيقية.')}</p></div>
      <div className="growth-steps">{t.steps.map(([title, desc], i) => <article key={title}><span className="growth-step-icon" aria-hidden="true">{['⌕','▤','◇','↗'][i]}</span><div><span className="growth-step-number">0{i + 1}</span><h3>{title}</h3><p>{desc}</p></div></article>)}</div>
    </section>
    <section className="growth-cta"><div className="growth-cta-art" aria-hidden="true" /><div className="growth-cta-content"><p className="eyebrow">{choose('Let’s work together', 'خلّينا نشتغل مع بعض')}</p><h2>{choose('Ready to build what’s next?', 'جاهز تبني خطوتك الجاية؟')}</h2><p>{choose('Share your idea and let’s turn it into a powerful digital product or growth strategy.', 'شاركنا فكرتك، ونحوّلها لمنتج رقمي قوي أو استراتيجية تنمّي أعمالك.')}</p><Link className="button" href={`/${locale}/contact`}>{t.start}<span aria-hidden="true">→</span></Link></div></section>
  </div>;
}

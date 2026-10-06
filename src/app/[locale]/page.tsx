import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { photos } from '../../photos';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (locale !== 'ar' && locale !== 'en') notFound();
  const ar = locale === 'ar';
  const c = (en: string, arabic: string) => ar ? arabic : en;
  const start = c('Start your project', 'ابدأ مشروعك');
  const services = ar ? [
    ['technology','التكنولوجيا','برمجيات عملية. تصميم مدروس.',['مواقع ومنصات SaaS','تطبيقات الموبايل والديسكتوب','ذكاء اصطناعي وأتمتة','تصميم واجهات وتجربة المستخدم'],'اكتشف خدمات البرمجة'],
    ['marketing','التسويق','علامة أوضح. حضور أقوى.',['استراتيجية العلامة التجارية','إدارة السوشيال ميديا','المحتوى والتصميمات','الحملات الإعلانية'],'اكتشف خدمات التسويق'],
  ] : [
    ['technology','Technology','Practical software. Thoughtful design.',['Websites & SaaS','Mobile & desktop apps','AI & automation','UX & UI design'],'Explore technology'],
    ['marketing','Marketing','A sharper brand. A stronger presence.',['Brand strategy','Social media','Content & creative','Performance campaigns'],'Explore marketing'],
  ];
  const steps = ar ? [['نفهم','نحدد أهدافك واحتياجاتك.'],['نخطط','نختار الحل المناسب لمشروعك.'],['نبني','نصمم ونطوّر بعناية.'],['نطلق','نساعد مشروعك على النمو.']] : [['Discover','We understand your goals.'],['Define','We shape the right solution.'],['Build','We design and develop.'],['Launch','We help you grow.']];
  return <div className="minimal-home">
    <section className="minimal-hero">
      <div className="minimal-copy"><p className="minimal-label">{c('Technology & digital marketing','تكنولوجيا وتسويق رقمي')}</p><h1>{c('Clarity in every idea.','وضوح في كل فكرة.')}<br/><em>{c('Impact in every build.','تأثير في كل مشروع.')}</em></h1><p className="minimal-intro">{c('We build digital products and brands that help your business move forward.','نبني منتجات رقمية وعلامات تجارية تساعد أعمالك على التقدّم.')}</p><div className="minimal-actions"><Link className="minimal-button" href={`/${locale}/contact`}>{start}</Link><Link className="minimal-link" href="#services">{c('Explore services','اكتشف خدماتنا')}<span aria-hidden="true">→</span></Link></div></div>
      <div className="minimal-photo" aria-hidden="true"><Image src={photos.hero.src} alt="" fill quality={90} sizes="(max-width: 760px) 100vw, 55vw" preload /></div>
    </section>
    <section id="services" className="minimal-services"><p className="minimal-label">{c('What we do','خدماتنا')}</p><h2>{c('Two paths. One clear direction.','مسارين. اتجاه واحد واضح.')}</h2><div className="minimal-service-grid">{services.map(([id,title,description,items,link],i)=><article key={id as string}><svg className="minimal-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">{i===0?<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-16-2 20"/>:<path d="M5 21V13m7 8V7m7 14V2"/>}</svg><h3>{title}</h3><p>{description}</p><ul>{(items as string[]).map(item=><li key={item}>{item}</li>)}</ul><Link className="minimal-link" href={`/${locale}/services#${id}`}>{link}<span aria-hidden="true">→</span></Link></article>)}</div></section>
    <section className="minimal-products"><p className="minimal-label">{c('Our products','منتجاتنا')}</p><h2>{c('Built by us. Made for real needs.','من تطويرنا. لاحتياجات حقيقية.')}</h2><div className="minimal-product-row"><svg className="minimal-qr" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="2" y="2" width="10" height="10" rx="1"/><rect x="20" y="2" width="10" height="10" rx="1"/><rect x="2" y="20" width="10" height="10" rx="1"/><path d="M6 6h2v2H6zM24 6h2v2h-2zM6 24h2v2H6zM20 20h5v5h5m-10 5h5v-5m5-5v-4M16 2v10m0 5H2m14 0v13"/></svg><div><h3>MenuzQR</h3><p>{c('Digital menus and business tools','منيو رقمي وأدوات لإدارة نشاطك')}</p></div><Link className="minimal-link" href={`/${locale}/products`}>{c('Explore products','اكتشف منتجاتنا')}<span aria-hidden="true">→</span></Link></div></section>
    <section className="minimal-process"><p className="minimal-label">{c('Our approach','طريقة شغلنا')}</p><h2>{c('A clear path from idea to launch.','طريق واضح من الفكرة للإطلاق.')}</h2><div className="minimal-steps">{steps.map(([title,desc],i)=><article key={title}><span>0{i+1}</span><h3>{title}</h3><p>{desc}</p></article>)}</div></section>
    <section className="minimal-cta"><div className="minimal-copy"><p className="minimal-label">{c('Let’s work together','خلّينا نشتغل مع بعض')}</p><h2>{c('Your next move','خطوتك الجاية')}<br/>{c('starts here.','بتبدأ هنا.')}</h2><p className="minimal-intro">{c('Tell us what you have in mind.','احكي لنا عن فكرتك.')}</p><Link className="minimal-button" href={`/${locale}/contact`}>{c('Start a project','ابدأ مشروعك')}</Link></div><div className="minimal-photo" aria-hidden="true"><Image src={photos.contact.src} alt="" fill quality={90} sizes="(max-width: 760px) 100vw, 60vw" /></div></section>
  </div>;
}

import Link from 'next/link';

interface ServicesPageProps {
  ar: boolean;
  locale: string;
}

const servicesData = {
  en: [
    {
      id: 'technology',
      num: '01',
      tag: 'WEB & MOBILE',
      title: 'Technology & Development',
      subtitle: 'Full-stack engineering for ambitious digital products.',
      desc: 'We build high-performance web platforms, mobile applications, and SaaS solutions that scale. Every product is engineered with clean architecture, rigorous QA, and long-term maintainability in mind.',
      image: '/technology-section.png',
      items: [
        { label: 'Full-Stack Web & Next.js Platforms', icon: '⬡' },
        { label: 'Native & Cross-Platform Mobile Apps', icon: '⬡' },
        { label: 'Custom SaaS Architecture & Cloud Backend', icon: '⬡' },
        { label: 'UI/UX Design Systems & Prototyping', icon: '⬡' },
      ],
      cta: 'Start a Tech Project',
      accent: '#0f7a5a',
    },
    {
      id: 'marketing',
      num: '02',
      tag: 'BRAND & GROWTH',
      title: 'Digital Marketing',
      subtitle: 'Strategic brand building and performance marketing.',
      desc: 'From brand identity systems to omnichannel campaign execution, we connect businesses with the right audience through creative storytelling and data-backed strategy.',
      image: '/marketing-section.png',
      items: [
        { label: 'Brand Strategy & Visual Identity', icon: '⬡' },
        { label: 'Social Media Management & Content', icon: '⬡' },
        { label: 'Paid Media & Performance Campaigns', icon: '⬡' },
        { label: 'Conversion Rate Optimization (CRO)', icon: '⬡' },
      ],
      cta: 'Grow Your Brand',
      accent: '#1a5c45',
    },
    {
      id: 'ai',
      num: '03',
      tag: 'INTELLIGENCE',
      title: 'AI & Automation',
      subtitle: 'Intelligent systems that work while you sleep.',
      desc: 'We integrate applied AI and workflow automation to eliminate repetitive tasks, surface real-time insights, and build internal tools that multiply your team\'s output without multiplying headcount.',
      image: '/ai-section.png',
      items: [
        { label: 'AI-Powered Product Features & Copilots', icon: '⬡' },
        { label: 'Business Process Automation (BPA)', icon: '⬡' },
        { label: 'Custom LLM Integrations & Pipelines', icon: '⬡' },
        { label: 'Intelligent Internal Tooling & Dashboards', icon: '⬡' },
      ],
      cta: 'Automate Your Workflow',
      accent: '#0a4a35',
    },
    {
      id: 'it',
      num: '04',
      tag: 'INFRASTRUCTURE',
      title: 'IT Solutions',
      subtitle: 'Reliable infrastructure for modern operations.',
      desc: 'End-to-end IT setup, cloud infrastructure, networking, and ongoing support. We handle the technical backbone so your team stays focused on growth and operations.',
      image: '/it-section.png',
      items: [
        { label: 'Cloud Setup, Migration & DevOps', icon: '⬡' },
        { label: 'Network & Security Architecture', icon: '⬡' },
        { label: 'IT Support & Managed Services', icon: '⬡' },
        { label: 'System Integration & API Management', icon: '⬡' },
      ],
      cta: 'Set Up Your Infrastructure',
      accent: '#144033',
    },
  ],
  ar: [
    {
      id: 'technology',
      num: '٠١',
      tag: 'ويب وموبايل',
      title: 'التكنولوجيا والتطوير',
      subtitle: 'هندسة برمجية متكاملة للمنتجات الرقمية.',
      desc: 'نبني منصات ويب عالية الأداء، وتطبيقات موبايل، وأنظمة SaaS قابلة للتوسع. كل منتج يُصنع بهندسة نظيفة، واختبارات دقيقة، وقابلية صيانة طويلة الأمد.',
      image: '/technology-section.png',
      items: [
        { label: 'منصات ويب متكاملة وتطبيقات Next.js', icon: '⬡' },
        { label: 'تطبيقات الهواتف الذكية (iOS & Android)', icon: '⬡' },
        { label: 'بنية تحتية سحابية وأنظمة SaaS مخصصة', icon: '⬡' },
        { label: 'تصميم واجهات وأنظمة تجربة المستخدم', icon: '⬡' },
      ],
      cta: 'ابدأ مشروعك التقني',
      accent: '#0f7a5a',
    },
    {
      id: 'marketing',
      num: '٠٢',
      tag: 'علامة ونمو',
      title: 'التسويق الرقمي',
      subtitle: 'بناء علامة استراتيجي وتسويق قائم على الأداء.',
      desc: 'من هوية العلامة إلى تنفيذ الحملات متعددة القنوات، نوصل الأعمال بجمهورها الصحيح عبر قصص إبداعية واستراتيجيات مبنية على البيانات.',
      image: '/marketing-section.png',
      items: [
        { label: 'استراتيجية العلامة والهوية البصرية', icon: '⬡' },
        { label: 'إدارة السوشيال ميديا وصناعة المحتوى', icon: '⬡' },
        { label: 'الإعلانات الممولة وحملات الأداء', icon: '⬡' },
        { label: 'تحسين معدل التحويل (CRO)', icon: '⬡' },
      ],
      cta: 'ابنِ علامتك',
      accent: '#1a5c45',
    },
    {
      id: 'ai',
      num: '٠٣',
      tag: 'ذكاء وأتمتة',
      title: 'الذكاء الاصطناعي والأتمتة',
      subtitle: 'أنظمة ذكية تعمل نيابةً عنك.',
      desc: 'ندمج الذكاء الاصطناعي وأتمتة سير العمل للتخلص من المهام المتكررة، وإظهار رؤى آنية، وبناء أدوات داخلية تضاعف إنتاجية فريقك.',
      image: '/ai-section.png',
      items: [
        { label: 'ميزات ذكاء اصطناعي وأدوات مساعدة', icon: '⬡' },
        { label: 'أتمتة عمليات الأعمال (BPA)', icon: '⬡' },
        { label: 'تكاملات نماذج اللغة المخصصة (LLM)', icon: '⬡' },
        { label: 'أدوات داخلية ذكية ولوحات تحكم', icon: '⬡' },
      ],
      cta: 'أتمت عملياتك',
      accent: '#0a4a35',
    },
    {
      id: 'it',
      num: '٠٤',
      tag: 'بنية تحتية',
      title: 'حلول تقنية المعلومات',
      subtitle: 'بنية تحتية موثوقة للعمليات الحديثة.',
      desc: 'إعداد IT متكامل، بنية سحابية، شبكات، ودعم مستمر. نتولى العمود الفقري التقني ليبقى فريقك مركّزاً على النمو والتشغيل.',
      image: '/it-section.png',
      items: [
        { label: 'إعداد السحابة، الترحيل، وDevOps', icon: '⬡' },
        { label: 'هندسة الشبكات والأمن السيبراني', icon: '⬡' },
        { label: 'دعم IT والخدمات المُدارة', icon: '⬡' },
        { label: 'تكامل الأنظمة وإدارة الـ API', icon: '⬡' },
      ],
      cta: 'جهّز بنيتك التحتية',
      accent: '#144033',
    },
  ],
};

export function ServicesPage({ ar, locale }: ServicesPageProps) {
  const services = ar ? servicesData.ar : servicesData.en;

  return (
    <div className="services-page-wrap">
      {/* Filter bar */}
      <div className="services-filter-bar">
        {services.map((s) => (
          <a key={s.id} href={`#svc-${s.id}`} className="svc-filter-pill">
            <span className="svc-filter-num">{s.num}</span>
            <span>{s.title}</span>
          </a>
        ))}
      </div>

      {/* Service cards */}
      <div className="services-stack">
        {services.map((svc, i) => {
          const isEven = i % 2 === 0;
          return (
            <article
              key={svc.id}
              id={`svc-${svc.id}`}
              className={`svc-card ${isEven ? 'svc-card--normal' : 'svc-card--reverse'}`}
            >
              {/* Image column */}
              <div className="svc-card-img-col">
                <div className="svc-card-img-wrap">
                  <img
                    src={svc.image}
                    alt={svc.title}
                    className="svc-card-img"
                  />
                  <div className={`svc-card-img-shade ${isEven ? 'svc-card-img-shade--end' : 'svc-card-img-shade--start'}`} />
                  <div className="svc-card-num-badge">{svc.num}</div>
                </div>
              </div>

              {/* Content column */}
              <div className="svc-card-content">
                <span className="svc-card-tag">{svc.tag}</span>
                <h2 className="svc-card-title">{svc.title}</h2>
                <p className="svc-card-subtitle">{svc.subtitle}</p>
                <p className="svc-card-desc">{svc.desc}</p>

                <ul className="svc-items-list">
                  {svc.items.map((item) => (
                    <li key={item.label}>
                      <span className="svc-item-dot" aria-hidden="true" />
                      {item.label}
                    </li>
                  ))}
                </ul>

                <Link
                  className="button button-primary svc-card-cta"
                  href={`/${locale}/contact`}
                >
                  <span>{svc.cta}</span>
                  <span className="btn-arrow" aria-hidden="true">↗</span>
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      {/* Bottom CTA strip */}
      <div className="svc-bottom-cta">
        <p className="eyebrow">{ar ? 'خطوتك التالية' : 'NEXT STEP'}</p>
        <h2>{ar ? 'مش متأكد من أي خدمة تحتاج؟' : 'Not sure which service fits?'}</h2>
        <p>{ar ? 'احكيلنا عن مشروعك وهنوصّيك بالأفضل.' : 'Tell us about your project and we\'ll recommend the right path.'}</p>
        <Link className="button button-primary" href={`/${locale}/contact`}>
          <span>{ar ? 'ابدأ مشروعك' : 'Start a Project'}</span>
          <span className="btn-arrow" aria-hidden="true">↗</span>
        </Link>
      </div>
    </div>
  );
}

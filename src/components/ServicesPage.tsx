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
        { label: 'تكامل الأنظمة وإدارة ال API', icon: '⬡' },
      ],
      cta: 'جهّز بنيتك التحتية',
      accent: '#144033',
    },
  ],
};

export function ServicesPage({ ar, locale }: ServicesPageProps) {
 const services = ar ? servicesData.ar : servicesData.en;
 return <section className="service-catalog" aria-label={ar?'خدماتنا':'Our services'}>
  <div className="service-catalog-grid">{services.map(svc=><article className="service-panel" key={svc.id} id={`svc-${svc.id}`}>
   <img src={svc.image} alt={svc.title} width={600} height={750} loading="lazy" />
   <div className="service-panel-body"><p className="eyebrow">{svc.tag}</p><h2>{svc.title}</h2><p>{svc.subtitle}</p>
   <ul>{svc.items.map(item=><li key={item.label}>{item.label}</li>)}</ul>
   <Link className="textlink" href={`/${locale}/contact`}>{svc.cta} <span aria-hidden="true">↗</span></Link></div>
  </article>)}</div>
  <div className="service-invitation"><div><h2>{ar?'نساعدك تختار البداية المناسبة.':'Let’s find the right starting point.'}</h2><p>{ar?'شاركنا احتياجك، ونحدد معك الخطوة التالية.':'Share what you need and we’ll help you plan the next step.'}</p></div><Link className="button" href={`/${locale}/contact`}>{ar?'تواصل معنا':'Get in touch'} ↗</Link></div>
 </section>;
}

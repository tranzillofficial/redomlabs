export type Locale = 'en' | 'ar';
export const sections = ['about', 'services', 'products', 'work', 'contact'] as const;

export interface StepItem {
  index: string;
  title: string;
  desc: string;
}

export interface CardItem {
  num: string;
  title: string;
  subtitle: string;
  items: string[];
  link: string;
}

export interface StatItem {
  num: string;
  label: string;
}

export interface ContentSchema {
  nav: string[];
  start: string;
  skip: string;
  studio: string;
  headline: string[];
  intro: string;
  slogan: string;
  explore: string;
  capability: string;
  allServices: string;
  serviceTitle: string;
  serviceIntro: string;
  services: string[][];
  aboutLabel: string;
  aboutTitle: string;
  aboutText: string;
  aboutLink: string;
  processLabel: string;
  processTitle: string;
  processIntro: string;
  steps: string[][];
  valuesLabel: string;
  values: string[][];
  cta: string;
  ctaText: string;
  footer: string;
  rights: string;
  aboutPageTitle: string;
  founderLabel: string;
  founderTitle: string;
  founderText: string;
  futureTitle: string;
  futureText: string;
  servicesPageTitle: string;
  servicePageIntro: string;
  projectsTitle: string;
  projectsIntro: string;
  projectLabels: string[];
  projectDescriptions: string[];
  contactTitle: string;
  contactText: string;
  contactSide: string;
  contactPoints: string[];
  
  // Landing Redesign Fields
  heroEyebrow: string;
  heroHeadline: string[];
  heroIntro: string;
  heroExploreWork: string;
  heroStats: StatItem[];
  
  expertiseEyebrow: string;
  expertiseTitle: string;
  expertiseSubtitle: string;
  techCard: CardItem;
  marketingCard: CardItem;
  
  productsEyebrow: string;
  productsTitle: string;
  productsDescription: string;
  productsExplore: string;
  productsBadge: string[];
  
  approachEyebrow: string;
  approachTitle: string;
  approachSubtitle: string;
  approachSteps: StepItem[];
  
  ctaEyebrow: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaBookCall: string;
  ctaTags: string[];
}

export const content: Record<Locale, ContentSchema> = {
  en: {
    nav: ['Home', 'About', 'Services', 'Products', 'Work', 'Contact'],
    start: 'Start your project',
    skip: 'Skip to content',
    studio: 'Technology & marketing',
    headline: ['Your next idea.', 'Our next creation.'],
    intro: 'Software, design and marketing. Built around your business.',
    slogan: 'From Innovation to Domination',
    explore: 'Explore services',
    capability: 'Our expertise',
    allServices: 'All services',
    serviceTitle: 'What can we build for you?',
    serviceIntro: 'Clear solutions for your next move.',
    services: [
      ['01', 'Websites & SaaS', 'Websites, landing pages and platforms.'],
      ['02', 'Mobile & desktop apps', 'Applications for your customers and team.'],
      ['03', 'AI & automation', 'Intelligent tools. Simpler workflows.'],
      ['04', 'Design & branding', 'Distinctive brands and intuitive interfaces.'],
      ['05', 'Digital marketing', 'Social media, content and performance campaigns.'],
      ['06', 'Product strategy', 'Feasibility, scope and a clear roadmap.'],
    ],
    aboutLabel: 'About Redom',
    aboutTitle: 'Ideas into useful experiences.',
    aboutText: 'Redom Labs brings software, design and marketing together to build practical digital solutions for businesses.',
    aboutLink: 'Meet Redom',
    processLabel: 'Our approach',
    processTitle: 'From idea to launch.',
    processIntro: 'A clear scope. Direct communication. Thoughtful execution.',
    steps: [
      ['Discover', 'Understand your goals.'],
      ['Define', 'Set the scope and priorities.'],
      ['Build', 'Design, develop and refine.'],
      ['Launch', 'Release, learn and improve.'],
    ],
    valuesLabel: 'Our principles',
    values: [
      ['Purpose', 'Solve a real business need.'],
      ['Care', 'Make every interaction clear.'],
      ['Clarity', 'Keep you involved at every step.'],
    ],
    cta: 'Let’s build what’s next.',
    ctaText: 'A good project starts with a clear conversation.',
    footer: 'Technology. Design. Growth.',
    rights: 'Redom Labs. All rights reserved.',
    aboutPageTitle: 'Technology meets ambition.',
    founderLabel: 'How we work',
    founderTitle: 'Built with purpose.',
    founderText: 'We connect strategy, design and engineering to deliver useful digital experiences.',
    futureTitle: 'Room to explore.',
    futureText: 'Software and marketing are our focus. Hardware remains a future ambition.',
    servicesPageTitle: 'Expertise for your next move.',
    servicePageIntro: 'One service or a complete digital solution. Shaped around your goals.',
    projectsTitle: 'Our own ideas, in motion.',
    projectsIntro: 'Products exploring everyday needs in commerce and local services.',
    projectLabels: ['Hospitality'],
    projectDescriptions: ['Digital menus and restaurant tools.'],
    contactTitle: 'Tell us what you have in mind.',
    contactText: 'Share a few details and our team will get back to you.',
    contactSide: 'Start with the essentials.',
    contactPoints: [
      'The problem you want to solve.',
      'The people you want to reach.',
      'Your priorities for the first release.',
    ],

    // Landing Redesign Fields
    heroEyebrow: 'DIGITAL INNOVATION & GROWTH',
    heroHeadline: ['Architecting Brands,', 'Engineering Digital Growth.'],
    heroIntro: 'We combine high-performance software engineering, bespoke brand systems, and data-driven marketing to build category-leading businesses.',
    heroExploreWork: 'Explore Work',
    heroStats: [
      { num: '99.9%', label: 'Engineered Reliability' },
      { num: '↑', label: 'Measurable Growth Impact' },
      { num: '100%', label: 'Bespoke Production' },
    ],

    expertiseEyebrow: 'CORE DISCIPLINES',
    expertiseTitle: 'Dual Engines of Digital Dominance',
    expertiseSubtitle: '',
    techCard: {
      num: '01',
      title: 'Technology & Engineering',
      subtitle: 'Modern web platforms, high-velocity SaaS, and AI-enabled automation.',
      items: [
        'Full-Stack Web & Next.js Platforms',
        'Native & Cross-Platform Mobile Apps',
        'Custom SaaS Architecture & Cloud Backend',
        'Applied AI, Automation & Internal Tooling',
      ],
      link: 'Explore Technology Services',
    },
    marketingCard: {
      num: '02',
      title: 'Growth & Digital Marketing',
      subtitle: 'Precision customer acquisition, brand storytelling, and viral distribution.',
      items: [
        'Strategic Paid Media & Performance Campaigns',
        'Brand Identity, Visual Art Direction & 3D Assets',
        'Conversion Rate Optimization (CRO) & Funnels',
        'Content Engine & Omnichannel Social Presence',
      ],
      link: 'Explore Marketing Services',
    },

    productsEyebrow: 'PROPRIETARY SOLUTIONS',
    productsTitle: 'Built in Our Labs for Market Impact',
    productsDescription: 'Alongside client partnerships, Redom Labs incubates and launches specialized software products addressing real workflow hurdles in commerce, hospitality, and education.\nEvery solution is designed for speed, clarity, and sustainable scale.',
    productsExplore: 'Discover Redom Products',
    productsBadge: ['INNOVATION', 'RELIABILITY', 'SPEED'],

    approachEyebrow: 'OUR METHODOLOGY',
    approachTitle: 'The 4-Stage Execution Framework',
    approachSubtitle: 'A transparent, milestone-driven workflow ensuring speed without cutting technical corners.',
    approachSteps: [
      { index: '01', title: 'Discover & Align', desc: 'In-depth domain breakdown, stakeholder interviews, and market architecture definition.' },
      { index: '02', title: 'Blueprint & Design', desc: 'Interactive prototypes, UI design systems, technical scoping, and stack selection.' },
      { index: '03', title: 'Build & Iterate', desc: 'Rapid sprints, clean code standards, rigorous QA testing, and continuous feedback.' },
      { index: '04', title: 'Deploy & Scale', desc: 'Production launch, performance monitoring, telemetry setup, and growth optimization.' },
    ],

    ctaEyebrow: 'START YOUR EXPEDITION',
    ctaTitle: 'Ready to Engineer Your Next Leap?',
    ctaSubtitle: 'Whether you need a flagship platform or a high-converting growth strategy, our team is ready to build it.',
    ctaBookCall: 'Schedule Briefing',
    ctaTags: ['SOFTWARE DEVELOPMENT', 'BRAND SYSTEM DESIGN', 'FULL-FUNNEL GROWTH', 'AI AUTOMATION'],
  },

  ar: {
    nav: ['الرئيسية', 'عن الشركة', 'خدماتنا', 'منتجاتنا', 'أعمالنا', 'تواصل معنا'],
    start: 'ابدأ مشروعك',
    skip: 'انتقل للمحتوى',
    studio: 'تكنولوجيا وتسويق',
    headline: ['أفكار طموحة.', 'حلول تصنع الفرق.'],
    intro: 'نطوّر منتجاتك الرقمية ونبني حضور علامتك.',
    slogan: 'من الابتكار إلى الريادة',
    explore: 'اكتشف خدماتنا',
    capability: 'خدماتنا',
    allServices: 'كل الخدمات',
    serviceTitle: 'اختر مسار نموّك.',
    serviceIntro: 'حلول واضحة لخطوتك الجاية.',
    services: [
      ['٠١', 'مواقع ومنصات SaaS', 'مواقع وصفحات هبوط ومنصات متكاملة.'],
      ['٠٢', 'تطبيقات موبايل وديسكتوب', 'تطبيقات لعملائك وفريق شغلك.'],
      ['٠٣', 'ذكاء اصطناعي وأتمتة', 'أدوات أذكى وخطوات شغل أبسط.'],
      ['٠٤', 'تصميم وهوية بصرية', 'علامة مميزة وتجربة استخدام واضحة.'],
      ['٠٥', 'تسويق رقمي', 'إدارة سوشيال ميديا ومحتوى وحملات إعلانية.'],
      ['٠٦', 'استراتيجية المنتجات', 'جدوى وأولويات وخطة تنفيذ واضحة.'],
    ],
    aboutLabel: 'عن Redom',
    aboutTitle: 'من الفكرة لتجربة مفيدة.',
    aboutText: 'Redom Labs تجمع البرمجة والتصميم والتسويق لبناء حلول رقمية عملية للأعمال.',
    aboutLink: 'اعرفنا أكتر',
    processLabel: 'طريقة شغلنا',
    processTitle: 'من الفكرة للإطلاق.',
    processIntro: 'خطة واضحة. تواصل مباشر. تنفيذ مدروس.',
    steps: [
      ['نفهم', 'نحدد أهداف مشروعك.'],
      ['نخطط', 'نتفق على النطاق والأولويات.'],
      ['نطوّر', 'نصمم ونبني ونحسن.'],
      ['نطلق', 'نبدأ ونتعلم ونكمل التطوير.'],
    ],
    valuesLabel: 'مبادئنا',
    values: [
      ['هدف واضح', 'نحل احتياج حقيقي لشغلك.'],
      ['اهتمام بالتفاصيل', 'كل خطوة سهلة وواضحة.'],
      ['شفافية', 'أنت جزء من كل مرحلة.']],
    cta: 'جاهز لخطوتك الجاية؟',
    ctaText: 'خلّينا نبدأ بفكرتك.',
    footer: 'تكنولوجيا. تصميم. نمو.',
    rights: 'Redom Labs. جميع الحقوق محفوظة.',
    aboutPageTitle: 'تكنولوجيا بطموح أكبر.',
    founderLabel: 'نهجنا',
    founderTitle: 'حلول تبدأ بهدف واضح.',
    founderText: 'نجمع الاستراتيجية والتصميم والتطوير لبناء تجارب رقمية تخدم أهداف الأعمال.',
    futureTitle: 'مساحة لأفكار جديدة.',
    futureText: 'تركيزنا على البرمجيات والتسويق، والهاردوير جزء من طموحنا للمستقبل.',
    servicesPageTitle: 'خبرة لخطوتك الجاية.',
    servicePageIntro: 'خدمة محددة أو حل رقمي متكامل، حسب أهداف مشروعك.',
    projectsTitle: 'أفكارنا بتاخد شكل.',
    projectsIntro: 'منتجات بتستكشف احتياجات يومية في التجارة والخدمات.',
    projectLabels: ['المطاعم والكافيهات'],
    projectDescriptions: ['منيو رقمي وأدوات للمطاعم والكافيهات.'],
    contactTitle: 'احكي لنا عن فكرتك.',
    contactText: 'شاركنا تفاصيل بسيطة، وفريقنا هيتواصل معاك.',
    contactSide: 'ابدأ بالتفاصيل الأساسية.',
    contactPoints: [
      'المشكلة اللي محتاج تحلها.',
      'الجمهور اللي عايز توصله.',
      'أولويات أول نسخة من مشروعك.',
    ],

    // Landing Redesign Fields
    heroEyebrow: 'ابتكار رقمي ونمو استراتيجي',
    heroHeadline: ['نبني هويتك الرقمية،', 'ونهندس نمو أعمالك.'],
    heroIntro: 'نجمع بين تطوير البرمجيات المتقدمة، وبناء الهويات البصرية المميزة، واستراتيجيات التسويق المبنية على البيانات لنقود مشروعك نحو الريادة.',
    heroExploreWork: 'استعرض أعمالنا',
    heroStats: [
      { num: '٩٩.٩٪', label: 'موثوقية هندسية عالية' },
      { num: '↑', label: 'أثر نمو قابل للقياس' },
      { num: '١٠٠٪', label: 'حلول مخصصة بالكامل' },
    ],

    expertiseEyebrow: 'مجالات تخصصنا',
    expertiseTitle: 'محركات متكاملة للريادة الرقمية',
    expertiseSubtitle: '',
    techCard: {
      num: '٠١',
      title: 'التكنولوجيا وهندسة البرمجيات',
      subtitle: 'منصات ويب عصرية، أنظمة SaaS فائقة السرعة، وأتمتة ذكية.',
      items: [
        'منصات ويب متكاملة وتطبيقات Next.js سريعة',
        'تطبيقات الهواتف الذكية (iOS & Android)',
        'بنية تحتية سحابية وأنظمة SaaS مخصصة',
        'حلول الذكاء الاصطناعي وأتمتة العمليات الداخلية',
      ],
      link: 'استكشف الخدمات التقنية',
    },
    marketingCard: {
      num: '٠٢',
      title: 'التسويق الرقمي وبناء العلامة',
      subtitle: 'استحواذ مدروس على العملاء، وصناعة هوية بصرية لا تُنسى.',
      items: [
        'إدارة الحملات الإعلانية الممولة والأداء (Performance)',
        'تصميم الهوية البصرية والتوجيه الفني والأصول ثلاثية الأبعاد',
        'تحسين معدل التحويل (CRO) ومسارات المبيعات',
        'صناعة المحتوى وإدارة الحضور على منصات التواصل',
      ],
      link: 'استكشف خدمات التسويق',
    },

    productsEyebrow: 'حلولنا الخاصة',
    productsTitle: 'منتجات طُوّرت داخل معاملنا لخدمة السوق',
    productsDescription: 'بجانب شراكاتنا مع العملاء، نبتكر ونطلق في Redom Labs منتجات رقمية خاصة تعالج تحديات واقعية في قطاعات التجارة والضيافة والتعليم.\nكل منتج مصمم لتقديم أقصى سرعة وسهولة وتوسع.',
    productsExplore: 'اكتشف منتجات Redom',
    productsBadge: ['ابتكار', 'موثوقية', 'سرعة'],

    approachEyebrow: 'منهجية العمل',
    approachTitle: 'مراحل التنفيذ في ٤ خطوات',
    approachSubtitle: 'خطوات عمل واضحة وشفافة تضمن سرعة الإنجاز والوصول لأعلى جودة هندسية.',
    approachSteps: [
      { index: '٠١', title: 'الاكتشاف والتحليل', desc: 'فهم عميق لطبيعة عملك، وتحديد المتطلبات بدقة وبناء الهيكل العام.' },
      { index: '٠٢', title: 'التخطيط والتصميم', desc: 'نماذج تفاعلية، وتصميم واجهات وتجربة المستخدم مع اختيار التقنيات الأنسب.' },
      { index: '٠٣', title: 'البناء والتطوير', desc: 'برمجة دقيقة وفق أفضل المعايير الهندسية مع اختبارات جودة مستمرة.' },
      { index: '٠٤', title: 'الإطلاق والنمو', desc: 'نشر النظام للمستخدمين، وتتبع الأداء والتحسين المستمر للنتائج.' },
    ],

    ctaEyebrow: 'ابدأ رحلتك معنا',
    ctaTitle: 'جاهز لخطوتك الرقمية القادمة؟',
    ctaSubtitle: 'سواء كنت بحاجة لمنصة تقنية رائدة أو استراتيجية تسويق تضاعف مبيعاتك، فريقنا جاهز لتحويل فكرتك لواقع.',
    ctaBookCall: 'احجز جلسة استشارية',
    ctaTags: ['تطوير برمجيات', 'تصميم هويات بصرية', 'نمو وتسويق رقمي', 'أتمتة وذكاء اصطناعي'],
  },
};

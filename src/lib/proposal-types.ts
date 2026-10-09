export interface ProposalSection {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  bullets?: string[];
}

export interface Proposal {
  id: string;
  slug: string;
  title: string;
  clientName: string;
  clientEmail?: string;
  passcode: string;
  summary: string;
  initialPrice: string;
  currency: string;
  deliveryTime?: string;
  validUntil?: string;
  status: 'draft' | 'active' | 'accepted' | 'expired';
  sections: ProposalSection[];
  createdAt: string;
  updatedAt: string;
}

export const initialProposals: Proposal[] = [
  {
    id: 'prop-1',
    slug: 'arab-retail-redesign',
    title: 'تطوير المنصة الرقمية والتطبيق السحابي | Digital Platform & Cloud App',
    clientName: 'شركة الأفق للتجارة والحلول',
    clientEmail: 'client@alofok.sa',
    passcode: '1234',
    summary: 'مقترح تطويري شامل يشمل بناء الهوية التقنية، وتصميم وبناء واجهات المستخدم بأحدث تقنيات الويب، والربط مع أنظمة إدارة المخزون والدفع الإلكتروني.',
    initialPrice: '45,000',
    currency: 'SAR',
    deliveryTime: '6-8 أسابيع / 6-8 Weeks',
    validUntil: '2026-11-30',
    status: 'active',
    sections: [
      {
        id: 'sec-1',
        title: 'نطاق العمل والهندسة التقنية (Scope & Architecture)',
        description: 'بناء معمارية سحابية عالية الأداء وقابلة للتوسع باستخدام Next.js وواجهات برمجية آمنة تضمن سرعة استجابة فائقة وتوافقاً تاماً مع الجوال ومحركات البحث.',
        imageUrl: '/landing2.png',
        bullets: [
          'تصميم واجهات UI/UX متجاوبة ثنائية اللغة (عربي / إنجليزي)',
          'بنية برمجية معزولة وسريعة مع حماية كاملة للبيانات',
          'لوحة تحكم إدارية مخصصة ومبسطة للتحكم في كافة العمليات'
        ]
      },
      {
        id: 'sec-2',
        title: 'التكامل وأنظمة الدفع (Integrations & Payments)',
        description: 'ربط بوابات الدفع الإلكتروني المعتمدة (مدى، فيزا، ماستركارد، Apple Pay) مع تكامل مباشر مع خدمات الشحن والرسائل التنبيهية الفورية.',
        imageUrl: '/hero.png',
        bullets: [
          'تكامل فوري مع بوابات الدفع والتحقق الآلي من الفواتير',
          'نظام إشعارات ذكي للعملاء عبر الرسائل والبريد الإلكتروني',
          'تقارير تحليلية ومؤشرات أداء مباشرة للمبيعات'
        ]
      },
      {
        id: 'sec-3',
        title: 'التسليم والدعم الفني (Delivery & Quality Assurance)',
        description: 'اختبارات جودة شاملة للأمان والأداء، تدريب فريق العمل على لوحة الإدارة، وضمان دعم فني وصيانة متواصلة بعد الإطلاق الرسمي.',
        bullets: [
          'فترة دعم فني مجانية لمدة 3 أشهر بعد التسليم',
          'جلسات تدريبية مسجلة وكتيب استخدام تفصيلي',
          'نسخ احتياطي دوري ومراقبة أداء على مدار الساعة'
        ]
      }
    ],
    createdAt: '2026-10-08T12:00:00.000Z',
    updatedAt: '2026-10-08T12:00:00.000Z'
  }
];

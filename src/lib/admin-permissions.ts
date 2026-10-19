export const adminSections = [
  "overview",
  "products",
  "work",
  "crm",
  "sales",
  "expenses",
  "finance",
  "proposals",
  "inquiries",
  "forms",
  "settings",
  "automation",
] as const;
export type AdminSection = (typeof adminSections)[number];
export type AdminAccess = {
  id: string;
  name: string;
  owner: boolean;
  permissions: AdminSection[];
};
export const sectionLabels: Record<AdminSection, { ar: string; en: string }> = {
  overview: { ar: "نظرة عامة", en: "Overview" },
  products: { ar: "المنتجات", en: "Products" },
  work: { ar: "أعمال العملاء", en: "Client work" },
  expenses: { ar: "الفواتير", en: "Invoices" },
  finance: { ar: "عرض البيانات المالية", en: "View financial data" },
  crm: { ar: "العملاء", en: "Customers" },
  sales: { ar: "المبيعات", en: "Sales" },
  proposals: { ar: "العروض والمقترحات", en: "Proposals" },
  inquiries: { ar: "رسائل التواصل", en: "Inquiries" },
  forms: { ar: "نموذج التواصل", en: "Contact form" },
  settings: { ar: "الإعدادات", en: "Settings" },
  automation: { ar: "مركز الأتمتة", en: "Automation Hub" },
};

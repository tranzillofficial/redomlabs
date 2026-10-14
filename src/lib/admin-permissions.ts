export const adminSections = [
  "overview",
  "products",
  "work",
  "crm",
  "proposals",
  "inquiries",
  "forms",
  "settings",
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
  crm: { ar: "العملاء والمتابعات", en: "Customers & follow-ups" },
  proposals: { ar: "العروض والمقترحات", en: "Proposals" },
  inquiries: { ar: "رسائل التواصل", en: "Inquiries" },
  forms: { ar: "نموذج التواصل", en: "Contact form" },
  settings: { ar: "الإعدادات", en: "Settings" },
};

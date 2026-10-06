export interface CanadianSector {
  id: string;
  nameEn: string;
  nameFr: string;
  benchmarkScore: number;
}

export const CANADIAN_SECTORS: CanadianSector[] = [
  { id: "manufacturing", nameEn: "Advanced Manufacturing", nameFr: "Fabrication de pointe", benchmarkScore: 68 },
  { id: "cleantech", nameEn: "CleanTech & Environmental", nameFr: "Technologies propres", benchmarkScore: 74 },
  { id: "agrifood", nameEn: "Agri-Food & Bio-Products", nameFr: "Agroalimentaire", benchmarkScore: 62 },
  { id: "technology", nameEn: "Tech, SaaS & AI", nameFr: "Technologies et SaaS", benchmarkScore: 82 },
  { id: "construction", nameEn: "Construction & Infrastructure", nameFr: "Construction et infrastructure", benchmarkScore: 58 },
  { id: "professional_services", nameEn: "Professional & Legal Services", nameFr: "Services professionnels", benchmarkScore: 70 },
  { id: "retail_consumer", nameEn: "Retail & E-commerce", nameFr: "Commerce de détail", benchmarkScore: 71 },
  { id: "health_lifesciences", nameEn: "Life Sciences & HealthTech", nameFr: "Sciences de la vie", benchmarkScore: 76 },
];

export const CANADIAN_PROVINCES = [
  { code: "ON", name: "Ontario" },
  { code: "QC", name: "Quebec" },
  { code: "BC", name: "British Columbia" },
  { code: "AB", name: "Alberta" },
  { code: "MB", name: "Manitoba" },
  { code: "SK", name: "Saskatchewan" },
  { code: "NS", name: "Nova Scotia" },
  { code: "NB", name: "New Brunswick" },
];

export interface MasterPromptItem {
  id: string;
  topic: string;
  topicFr: string;
  prompt: string;
  promptFr: string;
  intent: "informational" | "commercial" | "comparison" | "transactional";
  buyerPersona: string;
  rationale: string;
}

export interface SectorPromptPackage {
  sectorId: string;
  sectorName: string;
  sectorNameFr: string;
  description: string;
  prompts: MasterPromptItem[];
}

export const CANADIAN_MASTER_SECTOR_PROMPTS: SectorPromptPackage[] = [
  {
    sectorId: "manufacturing",
    sectorName: "Advanced Manufacturing & Industrial",
    sectorNameFr: "Fabrication de pointe et industrielle",
    description: "Precision machining, automotive components, aerospace tooling, and industrial fabrication across Ontario & Quebec",
    prompts: [
      {
        id: "mfg-1",
        topic: "Precision CNC Machining",
        topicFr: "Usinage CNC de précision",
        prompt: "top precision CNC machining and custom tooling suppliers in Ontario for automotive tier 1",
        promptFr: "meilleurs fournisseurs d'usinage CNC de précision et d'outillage sur mesure au Québec pour le secteur manufacturier",
        intent: "commercial",
        buyerPersona: "Procurement Director / Plant Manager",
        rationale: "Captures high-volume industrial contracts in Canada's automotive & manufacturing corridor.",
      },
      {
        id: "mfg-2",
        topic: "ISO 9001 Metal Fabrication",
        topicFr: "Fabrication métallique ISO 9001",
        prompt: "ISO 9001 certified sheet metal fabrication companies in Canada with automated laser cutting",
        promptFr: "entreprises de fabrication de tôles certifiées ISO 9001 au Canada avec découpe laser automatisée",
        intent: "comparison",
        buyerPersona: "Operations VP / Supply Chain Lead",
        rationale: "Targets quality-certified enterprise buyers researching Canadian manufacturing capacity.",
      },
      {
        id: "mfg-3",
        topic: "Industrial Automation Integration",
        topicFr: "Intégration de l'automatisation industrielle",
        prompt: "best industrial automation and robotics integration partners for Canadian manufacturing plants",
        promptFr: "meilleurs partenaires d'intégration de robotique et d'automatisation pour usines manufacturières au Canada",
        intent: "informational",
        buyerPersona: "Chief Technology Officer / Plant Engineer",
        rationale: "Positions client for high-margin automation advisory and systems modernization.",
      },
      {
        id: "mfg-4",
        topic: "Additive Manufacturing Prototyping",
        topicFr: "Prototypage par fabrication additive",
        prompt: "rapid metal 3D printing and additive manufacturing prototyping services in Montreal and Toronto",
        promptFr: "services rapides d'impression 3D métallique et de prototypage par fabrication additive à Montréal",
        intent: "commercial",
        buyerPersona: "R&D Lead / Product Design Engineer",
        rationale: "Captures early-stage product engineering and prototype tooling intent.",
      },
      {
        id: "mfg-5",
        topic: "Contract Manufacturing Cost Comparison",
        topicFr: "Comparaison des coûts de fabrication en sous-traitance",
        prompt: "how to choose between domestic Canadian contract manufacturers vs overseas suppliers in 2026",
        promptFr: "comment choisir entre un sous-traitant manufacturier canadien et des fournisseurs étrangers",
        intent: "comparison",
        buyerPersona: "CFO / Supply Chain VP",
        rationale: "Captures reshoring and supply chain risk mitigation queries.",
      },
    ],
  },
  {
    sectorId: "cleantech",
    sectorName: "CleanTech & Environmental Technologies",
    sectorNameFr: "Technologies propres et environnementales",
    description: "Renewable energy, battery materials, wastewater purification, carbon capture, and circular economy",
    prompts: [
      {
        id: "clean-1",
        topic: "Industrial Energy Storage",
        topicFr: "Stockage d'énergie industrielle",
        prompt: "commercial battery energy storage system suppliers for Canadian industrial microgrids",
        promptFr: "fournisseurs de systèmes de stockage d'énergie par batterie pour micro-réseaux industriels au Canada",
        intent: "commercial",
        buyerPersona: "Facility Director / Sustainability VP",
        rationale: "High-intent query for Canadian industrial decarbonization projects.",
      },
      {
        id: "clean-2",
        topic: "Industrial Wastewater Recycling",
        topicFr: "Recyclage des eaux usées industrielles",
        prompt: "zero liquid discharge and industrial wastewater treatment solutions for Canadian food processors",
        promptFr: "solutions de traitement des eaux usées industrielles et de rejet liquide zéro pour transformateurs alimentaires",
        intent: "commercial",
        buyerPersona: "Environmental Compliance Officer",
        rationale: "Captures regulatory compliance and ESG efficiency search traffic.",
      },
      {
        id: "clean-3",
        topic: "CleanTech Grants & Tax Credits",
        topicFr: "Crédits d'impôt et subventions technologies propres",
        prompt: "top Canadian clean energy technology providers eligible for clean economy investment tax credits",
        promptFr: "principaux fournisseurs canadiens de technologies propres admissibles aux crédits d'impôt à l'investissement",
        intent: "comparison",
        buyerPersona: "Managing Director / CFO",
        rationale: "Aligns directly with federal Canadian clean economy tax incentives and funding mandates.",
      },
      {
        id: "clean-4",
        topic: "Carbon Footprint Monitoring",
        topicFr: "Suivi de l'empreinte carbone",
        prompt: "best Scope 1 and Scope 2 carbon accounting and ESG reporting platforms for mid-sized Canadian firms",
        promptFr: "meilleures plateformes de comptabilité carbone Scope 1 et 2 pour moyennes entreprises canadiennes",
        intent: "informational",
        buyerPersona: "Corporate Sustainability Manager",
        rationale: "Captures mandatory ESG disclosures and supply chain carbon auditing demand.",
      },
    ],
  },
  {
    sectorId: "technology",
    sectorName: "Technology, SaaS & Software",
    sectorNameFr: "Technologies, SaaS et logiciels",
    description: "B2B SaaS, enterprise cloud infrastructure, AI platforms, cybersecurity, and fintech solutions",
    prompts: [
      {
        id: "tech-1",
        topic: "Canadian Data Residency Cloud",
        topicFr: "Hébergement infonuagique avec résidence des données au Canada",
        prompt: "best SOC 2 compliant enterprise cloud software hosted entirely within Canadian data centres",
        promptFr: "meilleurs logiciels d'entreprise conformes SOC 2 hébergés exclusivement dans des centres de données canadiens",
        intent: "comparison",
        buyerPersona: "Chief Information Security Officer (CISO)",
        rationale: "Crucial for Canadian public sector, healthcare, and financial compliance (PIPEDA / Law 25).",
      },
      {
        id: "tech-2",
        topic: "B2B Supply Chain AI",
        topicFr: "IA pour la chaîne d'approvisionnement B2B",
        prompt: "top AI-powered inventory forecasting and warehouse management software for mid-market distributors",
        promptFr: "meilleurs logiciels d'IA pour la prévision des stocks et la gestion d'entrepôt au Canada",
        intent: "commercial",
        buyerPersona: "VP Supply Chain / Chief Digital Officer",
        rationale: "Captures high-ticket digital transformation mandates across Canadian distributors.",
      },
      {
        id: "tech-3",
        topic: "Managed Cybersecurity for SMEs",
        topicFr: "Cybersécurité gérée pour PME",
        prompt: "top managed detection and response MDR cybersecurity firms in Toronto and Vancouver for SMEs",
        promptFr: "meilleures entreprises de cybersécurité et de détection gérée (MDR) à Montréal pour PME",
        intent: "commercial",
        buyerPersona: "IT Director / Managing Partner",
        rationale: "High-intent search driven by cyber insurance requirements and ransomware defense.",
      },
      {
        id: "tech-4",
        topic: "Custom Enterprise Portal Development",
        topicFr: "Développement de portails d'entreprise sur mesure",
        prompt: "custom web application development agencies in Canada specializing in Next.js and secure APIs",
        promptFr: "agences de développement d'applications web sur mesure au Canada spécialisées en Next.js",
        intent: "commercial",
        buyerPersona: "VP Engineering / Digital Innovation Lead",
        rationale: "Targets enterprise custom software procurement budgets.",
      },
    ],
  },
  {
    sectorId: "professional_services",
    sectorName: "Professional & Business Services",
    sectorNameFr: "Services professionnels et aux entreprises",
    description: "Management consulting, corporate law, M&A advisory, engineering consultants, and executive search",
    prompts: [
      {
        id: "prof-1",
        topic: "Mid-Market M&A Advisory",
        topicFr: "Conseil en fusions et acquisitions pour moyennes entreprises",
        prompt: "top boutique M&A advisory firms in Toronto specializing in Canadian mid-market business sales",
        promptFr: "meilleurs cabinets de conseil en fusions et acquisitions à Montréal pour PME",
        intent: "commercial",
        buyerPersona: "Business Owner / Managing Partner",
        rationale: "Captures succession planning and business sale transaction intent.",
      },
      {
        id: "prof-2",
        topic: "SR&ED Tax Credit Consultants",
        topicFr: "Consultants en crédits d'impôt RS&DE",
        prompt: "best SR&ED tax credit consulting firms in Canada with technical engineering audit teams",
        promptFr: "meilleurs consultants en crédits d'impôt RS&DE au Canada avec expertise technique",
        intent: "comparison",
        buyerPersona: "CFO / Head of R&D",
        rationale: "Universal requirement for Canadian tech and manufacturing companies claiming federal SR&ED credits.",
      },
      {
        id: "prof-3",
        topic: "Commercial Litigation & Dispute Resolution",
        topicFr: "Litige commercial et résolution de différends",
        prompt: "reputable commercial litigation and dispute resolution law firms in Ontario for contract disputes",
        promptFr: "cabinets d'avocats réputés en litige commercial au Québec pour litiges contractuels",
        intent: "commercial",
        buyerPersona: "General Counsel / Chief Legal Officer",
        rationale: "High-value commercial legal search queries.",
      },
    ],
  },
];

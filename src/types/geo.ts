export interface EeatSignal {
  question: string;
  details: string;
}

export interface EeatCategory {
  score: number;
  passedCount: number;
  totalCount: number;
  status: "Poor" | "Needs Work" | "Good";
  working: EeatSignal[];
  missing: EeatSignal[];
  improve: string[];
}

export interface GeoChecklist {
  ssl: boolean;
  aboutUs: boolean;
  contactDetails: boolean;
  socialLinks: boolean;
  organizationSchema: boolean;
  g2: boolean;
  reddit: boolean;
  capterra: boolean;
  linkedin: boolean;
  crunchbase: boolean;
  trustpilot: boolean;
  x: boolean;
  youtube: boolean;
}

export interface GeoAnalysisResult {
  url: string;
  domain: string;
  updatedAt: string;
  overallScore: number;
  checklist: GeoChecklist;
  aiCrawlers: {
    gptbot: boolean;
    claudebot: boolean;
    perplexitybot: boolean;
    google_extended: boolean;
    bytespider: boolean;
  };
  hasLlmsTxt: boolean;
  llmsTxtSummary: string | null;
  analysis: {
    scores: {
      experience: number;
      expertise: number;
      authority: number;
      trust: number;
    };
    categories: {
      experience: EeatCategory;
      expertise: EeatCategory;
      authority: EeatCategory;
      trust: EeatCategory;
    };
  };
  recommendations: string[];
}

export interface GeoScorecardTest {
  id: string;
  title: string;
  category: "Authority" | "Readability" | "Structure" | "Technical";
  weight: "T1 (3x)" | "T2 (2x)" | "T3 (1x)";
  status: "passed" | "warning" | "failed";
  score: number;
  maxScore: number;
  description: string;
  impact: string;
  fix: string;
  beforeCode?: string;
  afterCode?: string;
}

export interface CompetitorBenchmark {
  competitorDomain: string;
  visibilityScore: number;
  citationShare: number;
  shareOfVoice: number;
  topRankedPromptsCount: number;
  sentimentRating: "Positive" | "Neutral" | "Mixed";
  crawlersAllowedCount: number;
  hasLlmsTxt: boolean;
}

export interface AiReferralSession {
  sourceEngine: "chatgpt.com" | "perplexity.ai" | "claude.ai" | "gemini.google.com" | "other";
  landingPage: string;
  sessions: number;
  conversionRate: number;
  trend: "up" | "down" | "neutral";
  lastReferredAt: string;
}

export interface ContentGapItem {
  id: string;
  topic: string;
  prompt: string;
  competitorCited: string;
  winningUrl: string;
  searchVolume: number;
  intent: "commercial" | "comparison" | "informational";
  actionPlan: {
    suggestedTitle: string;
    targetKeywords: string[];
    outline: string[];
    schemaRecommended: string;
    statCitationAngle: string;
  };
}

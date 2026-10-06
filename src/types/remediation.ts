export type RemediationFixKind =
  | "add_faq_schema"
  | "add_organization_schema"
  | "set_title"
  | "set_meta_description"
  | "set_canonical"
  | "inject_geo_answer_block"
  | "inject_key_takeaways"
  | "fix_heading_hierarchy"
  | "add_author_attribution"
  | "inject_comparison_table"
  | "add_freshness_badge"
  | "upgrade_social_meta";

export type RemediationStatus = "detected" | "approved" | "applied" | "verified" | "rolled_back";

export interface RemediationRuleData {
  // Schema rules
  jsonLd?: Record<string, any>;
  faqQuestions?: Array<{ question: string; answer: string }>;
  // Meta rules
  title?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  // Content injection rules
  targetSelector?: string; // e.g. "h1", "article", "main", "body"
  position?: "before" | "after" | "prepend" | "append";
  answerHeading?: string;
  answerHtml?: string;
  keyTakeaways?: string[];
  authorName?: string;
  authorRole?: string;
  authorLinkedin?: string;
  // Tables
  tableMarkdown?: string;
}

export interface RemediationAction {
  id: string;
  testId?: string;
  ruleKey: string;
  kind: RemediationFixKind;
  pathname: string; // e.g. "/" or "/solutions" or "*"
  title: string;
  category: "Structure" | "Authority" | "Readability" | "Technical";
  weight: "T1 (3x)" | "T2 (2x)" | "T3 (1x)";
  impact: string;
  data: RemediationRuleData;
  status: RemediationStatus;
  autoDeployable: boolean;
  deployedAt?: string | null;
  verifiedAt?: string | null;
  lastBeaconPing?: string | null;
}

export interface SdkBeaconPayload {
  domainId: string;
  token?: string;
  pageUrl: string;
  rules: Array<{
    ruleKey: string;
    kind: string;
    verified: boolean;
    error?: string;
  }>;
}

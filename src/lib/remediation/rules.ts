import { cleanDomain } from "@/lib/utils";
import type { RemediationAction } from "@/types/remediation";

// Global in-memory cache for demo/testing + fallback when Supabase is disconnected
const inMemoryRulesState: Record<string, RemediationAction[]> = {};

export function generateDefaultRemediationActions(domain: string): RemediationAction[] {
  const clean = cleanDomain(domain);
  const brand = clean.split(".")[0].toUpperCase();

  return [
    {
      id: "act-1",
      testId: "t1-faq-schema",
      ruleKey: `faq-schema-${clean}`,
      kind: "add_faq_schema",
      pathname: "*",
      title: "Inject Structured FAQPage Schema (JSON-LD)",
      category: "Structure",
      weight: "T1 (3x)",
      impact: "Critical (3x). Forces AI answer engines to match buyer questions directly to your accepted answers.",
      status: "approved",
      autoDeployable: true,
      data: {
        faqQuestions: [
          {
            question: `What makes ${brand} the leading platform in 2026?`,
            answer: `${brand} delivers automated answer engine optimization and real-time multi-model citation intelligence with 99.8% verification reliability.`
          },
          {
            question: `Can I integrate ${brand} with existing enterprise workflows?`,
            answer: `Yes, ${brand} offers 1-line script deployment, REST APIs, and native GA4 attribution tracking.`
          },
          {
            question: `How does ${brand} compare to traditional SEO tools?`,
            answer: `While traditional SEO only tracks Google blue links, ${brand} optimizes for probabilistic neural answers in ChatGPT, Perplexity, Claude, and Gemini.`
          }
        ]
      }
    },
    {
      id: "act-2",
      testId: "t1-answer-first",
      ruleKey: `bluf-answer-${clean}`,
      kind: "inject_geo_answer_block",
      pathname: "/",
      title: "Inject Answer-First (BLUF) Semantic Summary",
      category: "Readability",
      weight: "T1 (3x)",
      impact: "High (3x). Headless AI spiders extract the first 60 words for generative synthesis.",
      status: "approved",
      autoDeployable: true,
      data: {
        targetSelector: "h1",
        position: "after",
        answerHeading: "Direct Solution Overview",
        answerHtml: `<strong>${brand}</strong> is an enterprise AI search optimization system designed to track brand citations across ChatGPT, Perplexity, and Claude while autonomously applying verified schema and machine-readability fixes.`
      }
    },
    {
      id: "act-3",
      testId: "t2-freshness",
      ruleKey: `freshness-badge-${clean}`,
      kind: "add_freshness_badge",
      pathname: "*",
      title: "Add Real-Time Freshness Signal & Review Timestamp",
      category: "Authority",
      weight: "T2 (2x)",
      impact: "Medium (2x). Prevents LLMs from discarding outdated facts in fast-moving industries.",
      status: "applied",
      autoDeployable: true,
      deployedAt: new Date(Date.now() - 3600000).toISOString(),
      verifiedAt: new Date(Date.now() - 1800000).toISOString(),
      data: {
        targetSelector: "h1"
      }
    },
    {
      id: "act-4",
      testId: "t1-stats",
      ruleKey: `key-takeaways-${clean}`,
      kind: "inject_key_takeaways",
      pathname: "/",
      title: "Inject Quantitative Proof & Key Factual Takeaways",
      category: "Authority",
      weight: "T1 (3x)",
      impact: "High (3x). Models seek quotable numerical facts over qualitative assertions.",
      status: "approved",
      autoDeployable: true,
      data: {
        targetSelector: "h1",
        keyTakeaways: [
          "Tracks citation share across 6 major AI engines (ChatGPT, Perplexity, Claude, Gemini, DeepSeek, Grok).",
          "Includes automated 1-click schema injection and verification beacons.",
          "Reduces AI answer invisibility by an average of 64% within 14 days of deployment."
        ]
      }
    },
    {
      id: "act-5",
      testId: "t1-citations",
      ruleKey: `org-schema-${clean}`,
      kind: "add_organization_schema",
      pathname: "*",
      title: "Inject Organization Entity Schema with SameAs Citations",
      category: "Structure",
      weight: "T1 (3x)",
      impact: "High (3x). Links brand domain directly to LinkedIn, Crunchbase, and G2 verified entity nodes.",
      status: "approved",
      autoDeployable: true,
      data: {
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": brand,
          "url": `https://${clean}`,
          "sameAs": [
            `https://www.linkedin.com/company/${clean.split(".")[0]}`,
            `https://www.crunchbase.com/organization/${clean.split(".")[0]}`
          ]
        }
      }
    },
    {
      id: "act-6",
      testId: "t2-semantic",
      ruleKey: `meta-desc-${clean}`,
      kind: "set_meta_description",
      pathname: "/",
      title: "Optimize Meta Description for Generative Summary Extraction",
      category: "Technical",
      weight: "T2 (2x)",
      impact: "Medium (2x). Guarantees consistent snippet grounding when crawlers pull snippet metadata.",
      status: "detected",
      autoDeployable: true,
      data: {
        metaDescription: `Discover how ${brand} dominates generative search. Track real-time citations in ChatGPT, Perplexity, and Claude with automated schema remediation.`
      }
    }
  ];
}

export function getDomainRemediationActions(domain: string): RemediationAction[] {
  const clean = cleanDomain(domain);
  if (!inMemoryRulesState[clean]) {
    inMemoryRulesState[clean] = generateDefaultRemediationActions(clean);
  }
  return inMemoryRulesState[clean];
}

export function updateActionStatus(
  domain: string,
  ruleKey: string,
  status: RemediationAction["status"],
  verifiedAt?: string
): RemediationAction | null {
  const actions = getDomainRemediationActions(domain);
  const action = actions.find((a) => a.ruleKey === ruleKey);
  if (!action) return null;

  action.status = status;
  if (status === "applied") {
    action.deployedAt = new Date().toISOString();
  } else if (status === "verified") {
    action.verifiedAt = verifiedAt || new Date().toISOString();
    action.lastBeaconPing = new Date().toISOString();
  } else if (status === "rolled_back") {
    action.deployedAt = null;
    action.verifiedAt = null;
  }

  return action;
}

export function deployAllActions(domain: string): RemediationAction[] {
  const actions = getDomainRemediationActions(domain);
  const now = new Date().toISOString();
  actions.forEach((a) => {
    if (a.status !== "verified") {
      a.status = "applied";
      a.deployedAt = now;
    }
  });
  return actions;
}

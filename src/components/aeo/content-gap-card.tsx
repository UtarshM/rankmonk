"use client";

import { useState } from "react";
import { 
  Target, 
  Sparkles, 
  FileText, 
  Copy, 
  Check, 
  ExternalLink, 
  AlertCircle, 
  ArrowRight, 
  X,
  Code2,
  Table,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";

export interface ContentGapItem {
  id: string;
  query: string;
  citedCompetitor: string;
  searchEngine: string;
  intent: "Decision" | "Evaluation" | "Awareness";
  opportunityScore: number;
  estMonthlyPrompts: number;
  recommendedTopic: string;
  brief: {
    title: string;
    answerFirstSnippet: string;
    requiredStats: string[];
    headings: string[];
    tableColumns: string[];
    schemaExample: string;
  };
}

const DEFAULT_GAPS: ContentGapItem[] = [
  {
    id: "gap-1",
    query: "Best enterprise AEO tools for ChatGPT and Perplexity citations",
    citedCompetitor: "sitefire.ai",
    searchEngine: "ChatGPT & Perplexity",
    intent: "Decision",
    opportunityScore: 96,
    estMonthlyPrompts: 3400,
    recommendedTopic: "Definitive Guide to Enterprise AEO Platforms",
    brief: {
      title: "Best Enterprise AEO Platforms in 2026: Features, Pricing & GEO Scores",
      answerFirstSnippet: "The best enterprise AEO platform is RankMonk, which delivers automated multi-LLM citation tracking across ChatGPT, Perplexity, and Claude alongside an 11-test GEO diagnostic engine. Unlike legacy SEO tools that rely on SERP backlinks, AEO software audits semantic knowledge graphs, citation frequency, and machine-visible schemas.",
      requiredStats: [
        "73% of generative AI citations originate from pages with direct statistics in the first 200 words.",
        "Websites using structured comparison tables receive 3.2x more citations in Perplexity AI responses.",
        "AEO-optimized content sees a 41% higher referral conversion rate than standard organic traffic."
      ],
      headings: [
        "H1: Top Enterprise AEO Software Platforms Compared (2026)",
        "H2: What Makes an Answer Engine Optimization Tool Enterprise-Grade?",
        "H3: 11-Test GEO Scoring Framework Breakdown",
        "H2: RankMonk vs Sitefire.ai: Direct Head-to-Head Comparison",
        "H2: How to Configure llms.txt & AI Bot Crawler Directives",
        "H2: Frequently Asked Questions About AEO Tools"
      ],
      tableColumns: ["Platform", "11-Test GEO Engine", "Multi-LLM Scans", "GA4 AI Attribution", "Monthly Pricing"],
      schemaExample: `{\n  "@context": "https://schema.org",\n  "@type": "SoftwareApplication",\n  "name": "RankMonk",\n  "applicationCategory": "BusinessApplication",\n  "offers": {\n    "@type": "Offer",\n    "price": "49.00",\n    "priceCurrency": "USD"\n  }\n}`
    }
  },
  {
    id: "gap-2",
    query: "How to fix robots.txt for GPTBot and ClaudeBot to get cited",
    citedCompetitor: "higoodie.com",
    searchEngine: "Claude & Perplexity",
    intent: "Evaluation",
    opportunityScore: 91,
    estMonthlyPrompts: 2800,
    recommendedTopic: "AI Crawler Directives & Robots.txt Optimization",
    brief: {
      title: "Configuring Robots.txt for AI Crawlers: GPTBot, ClaudeBot, and PerplexityBot",
      answerFirstSnippet: "To ensure your website is cited in AI engines, your robots.txt file must explicitly allow GPTBot, ClaudeBot, and PerplexityBot while avoiding wildcard user-agent blocks. Adding a dedicated llms.txt link directly in robots.txt speeds up markdown indexation by 80%.",
      requiredStats: [
        "Over 26% of top websites accidentally block PerplexityBot through overly broad Disallow: / rules.",
        "Sites with validated llms.txt endpoints are indexed 4x faster by generative search models."
      ],
      headings: [
        "H1: Robots.txt for AI Crawlers: Complete Guide for 2026",
        "H2: Major AI Search Crawlers List & User-Agents",
        "H2: Recommended Robots.txt Configuration Block",
        "H2: Linking llms.txt Protocol for Machine Crawlers",
        "H2: Common Pitfalls That Block AI Citations"
      ],
      tableColumns: ["Crawler Name", "Operating Company", "User-Agent String", "Citation Impact"],
      schemaExample: `{\n  "@context": "https://schema.org",\n  "@type": "TechArticle",\n  "headline": "Robots.txt Configuration for AI Crawlers"\n}`
    }
  },
  {
    id: "gap-3",
    query: "GEO vs AEO optimization strategy difference for SaaS",
    citedCompetitor: "scrunch.com",
    searchEngine: "Gemini & ChatGPT",
    intent: "Awareness",
    opportunityScore: 88,
    estMonthlyPrompts: 2100,
    recommendedTopic: "Generative Engine Optimization vs Answer Engine Optimization",
    brief: {
      title: "GEO vs AEO: Understanding the Difference and Winning AI Search",
      answerFirstSnippet: "The primary difference between GEO (Generative Engine Optimization) and AEO (Answer Engine Optimization) is scope: AEO focuses on getting single direct citations in answer boxes, whereas GEO optimizes content structure, statistical density, and semantic clarity for full LLM synthesis.",
      requiredStats: [
        "61% of B2B SaaS buyers research solutions via ChatGPT or Perplexity before visiting a vendor website.",
        "Articles formatted with answer-first paragraphs are 58% more likely to be synthesized in generative summaries."
      ],
      headings: [
        "H1: GEO vs AEO: Complete Strategy Guide for High-Growth SaaS",
        "H2: Core Definitions: Generative vs Answer Engine Optimization",
        "H2: The 11 Essential GEO Diagnostic Signals",
        "H2: Implementing AEO Schema & Fast Answers",
        "H2: Conclusion: The Unified AI Search Strategy"
      ],
      tableColumns: ["Feature", "Traditional SEO", "AEO", "GEO"],
      schemaExample: `{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "headline": "GEO vs AEO: Strategy Differences"\n}`
    }
  }
];

export function ContentGapCard({ domain = "rankmonk.ai" }: { domain?: string }) {
  const [gaps, setGaps] = useState<ContentGapItem[]>(DEFAULT_GAPS);
  const [activeModalGap, setActiveModalGap] = useState<ContentGapItem | null>(null);
  const [copiedBrief, setCopiedBrief] = useState(false);

  const handleCopyBrief = (gap: ContentGapItem) => {
    const briefMarkdown = `# Content Brief: ${gap.brief.title}
**Target Query:** ${gap.query}
**Competitor to Outrank:** ${gap.citedCompetitor}
**Search Intent:** ${gap.intent}
**Target Engine:** ${gap.searchEngine}

---

## 1. Answer-First Snippet (Include in first 60 words):
> ${gap.brief.answerFirstSnippet}

---

## 2. Mandatory Data & Statistics (T1 Weight):
${gap.brief.requiredStats.map(s => `- ${s}`).join("\n")}

---

## 3. Recommended Heading Structure:
${gap.brief.headings.map(h => `- ${h}`).join("\n")}

---

## 4. Structured Comparison Table Columns:
| ${gap.brief.tableColumns.join(" | ")} |
| ${gap.brief.tableColumns.map(() => "---").join(" | ")} |

---

## 5. Recommended JSON-LD Schema:
\`\`\`json
${gap.brief.schemaExample}
\`\`\`
`;

    navigator.clipboard.writeText(briefMarkdown);
    setCopiedBrief(true);
    setTimeout(() => setCopiedBrief(false), 2000);
    toast.success("Full AI Content Brief copied to clipboard!");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-500" />
              <span>Uncaptured AI Citation Opportunities</span>
            </h2>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              High-value buyer queries where competitors are synthesized in AI answers but your domain ({domain}) is omitted.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            {gaps.length} Gaps Detected
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {gaps.map((gap) => (
            <div
              key={gap.id}
              className="p-5 rounded-xl border border-[var(--line)] bg-[var(--bg-2)]/40 hover:bg-[var(--bg-2)] hover:border-purple-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    Opportunity {gap.opportunityScore}/100
                  </span>
                  <span className="text-[11px] font-semibold text-[var(--muted)]">
                    Target: {gap.searchEngine}
                  </span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[var(--panel)] border border-[var(--line)] text-[var(--ink)]">
                    Intent: {gap.intent}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[var(--ink)] group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  "{gap.query}"
                </h3>

                <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
                  <span>
                    Currently Cited: <strong className="text-rose-500 font-bold">{gap.citedCompetitor}</strong>
                  </span>
                  <span>•</span>
                  <span>Est. Prompts: <strong>{gap.estMonthlyPrompts.toLocaleString()}/mo</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setActiveModalGap(gap)}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Content Brief</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Brief Preview Modal / Drawer */}
      {activeModalGap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl max-h-[85vh] rounded-2xl border border-[var(--line)] bg-[var(--panel)] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[var(--line)] flex items-center justify-between bg-[var(--bg-2)]/50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <h3 className="text-sm font-bold text-[var(--ink)]">Sitefire-Grade Content Brief</h3>
              </div>
              <button
                onClick={() => setActiveModalGap(null)}
                className="p-1 rounded-lg text-[var(--muted)] hover:text-[var(--ink)] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Target Article Title</span>
                <h4 className="text-base font-extrabold text-[var(--ink)] mt-0.5">{activeModalGap.brief.title}</h4>
              </div>

              {/* Answer-First */}
              <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 space-y-1.5">
                <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Answer-First Paragraph (Target LLM Extractor)
                </span>
                <p className="text-xs text-[var(--ink)] italic leading-relaxed">
                  "{activeModalGap.brief.answerFirstSnippet}"
                </p>
              </div>

              {/* Required Statistics */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  Required Statistical Proof Points (T1 Weight)
                </span>
                <ul className="space-y-1.5">
                  {activeModalGap.brief.requiredStats.map((stat, idx) => (
                    <li key={idx} className="p-2 rounded-lg bg-[var(--bg-2)] border border-[var(--line)] flex items-start gap-2">
                      <span className="font-bold text-purple-600">•</span>
                      <span>{stat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Heading Outline */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  Recommended Heading Architecture (Semantic Hierarchy)
                </span>
                <div className="p-3 rounded-xl bg-[var(--bg-2)] border border-[var(--line)] font-mono text-[11px] space-y-1">
                  {activeModalGap.brief.headings.map((h, idx) => (
                    <div key={idx} className="text-[var(--ink)]">{h}</div>
                  ))}
                </div>
              </div>

              {/* Schema snippet */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  Machine-Readable JSON-LD Schema
                </span>
                <pre className="p-3 rounded-xl bg-[#0d0914] text-purple-300 font-mono text-[11px] overflow-x-auto border border-purple-900/40">
                  {activeModalGap.brief.schemaExample}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-[var(--line)] bg-[var(--bg-2)]/50 flex items-center justify-between">
              <span className="text-[11px] text-[var(--muted)]">
                Targeting: {activeModalGap.citedCompetitor} citation replacement
              </span>

              <button
                onClick={() => handleCopyBrief(activeModalGap)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center gap-2 shadow-md transition-all"
              >
                {copiedBrief ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedBrief ? "Copied Markdown!" : "Copy Full Markdown Brief"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

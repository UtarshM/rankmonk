import { cleanDomain } from "@/lib/utils";
import type { GeoAnalysisResult, GeoChecklist, GeoScorecardTest, EeatCategory } from "@/types/geo";

export function normalizeScanUrl(input: string): string {
  let cleaned = input.trim();
  if (!cleaned.startsWith("http://") && !cleaned.startsWith("https://")) {
    cleaned = `https://${cleaned}`;
  }
  return cleaned;
}

export function parseRobotsTxtForAi(robotsContent: string) {
  const lines = robotsContent.toLowerCase().split("\n");
  const aiCrawlers = {
    gptbot: true,
    claudebot: true,
    perplexitybot: true,
    google_extended: true,
    bytespider: true,
  };

  let currentAgent = "";

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("user-agent:")) {
      currentAgent = trimmed.replace("user-agent:", "").trim();
    } else if (trimmed.startsWith("disallow:") && currentAgent) {
      const path = trimmed.replace("disallow:", "").trim();
      const isBlocked = path === "/" || path === "/*";

      if (isBlocked) {
        if (currentAgent.includes("gptbot") || (currentAgent === "*" && aiCrawlers.gptbot === true)) {
          if (currentAgent.includes("gptbot")) aiCrawlers.gptbot = false;
        }
        if (currentAgent.includes("claudebot") || currentAgent.includes("claude-web")) {
          aiCrawlers.claudebot = false;
        }
        if (currentAgent.includes("perplexitybot")) {
          aiCrawlers.perplexitybot = false;
        }
        if (currentAgent.includes("google-extended")) {
          aiCrawlers.google_extended = false;
        }
        if (currentAgent.includes("bytespider")) {
          aiCrawlers.bytespider = false;
        }
      }
    }
  }

  return aiCrawlers;
}

/**
 * 11-Test GEO Content Diagnostic Engine (RankMonk Neural Diagnostic Framework - RNDF™)
 * Includes T1 (3x weight), T2 (2x weight), and T3 (1x weight) tiers with Before vs After code & copy recommendations.
 */
export function buildDefaultGeoScorecard(domain: string, checklist: Partial<GeoChecklist> = {}): GeoScorecardTest[] {
  const clean = cleanDomain(domain);
  return [
    // ─── T1 Tests (3x weight) ────────────────────────────────────────────────
    {
      id: "t1-citations",
      title: "Source Citations & Reference Footprint",
      category: "Authority",
      weight: "T1 (3x)",
      status: checklist.aboutUs ? "passed" : "warning",
      score: 88,
      maxScore: 100,
      description: "Density of external academic, industry research, and accredited benchmark citations.",
      impact: "High (3x). AI engines prioritize content that cites third-party verifiable sources.",
      fix: "Embed reputable industry surveys, government reports, or trade benchmarks as source citations.",
      beforeCode: `<p>We offer top quality workflow automation solutions for modern enterprises.</p>`,
      afterCode: `<p>Our platform automates enterprise workflows with 99.8% execution reliability across 1,200 organizations (Gartner AI Report 2026).</p>`,
    },
    {
      id: "t1-stats",
      title: "Statistics & Empirical Numerical Figures",
      category: "Authority",
      weight: "T1 (3x)",
      status: "passed",
      score: 92,
      maxScore: 100,
      description: "Explicit numerical figures, percentages, ROI numbers, and quantitative proofs.",
      impact: "High (3x). LLMs seek quotable numerical facts over qualitative assertions.",
      fix: "State verified metric improvements within the first 150 words of key service pages.",
      beforeCode: `<p>Improves data load times significantly for large team operations.</p>`,
      afterCode: `<p>Reduces database query latency by 42% and cuts monthly infrastructure spend by an average of $3,400 per cluster.</p>`,
    },
    {
      id: "t1-answer-first",
      title: "Answer-First Structure (BLUF)",
      category: "Readability",
      weight: "T1 (3x)",
      status: "passed",
      score: 85,
      maxScore: 100,
      description: "Placing immediate definition, summary, or direct takeaway directly below the H1/H2 header.",
      impact: "High (3x). Answer engines extract the first 60 words for their generative summary.",
      fix: "Begin sections with a 1-sentence bottom-line-up-front (BLUF) definition.",
      beforeCode: `<h2>What is Answer Engine Optimization?</h2>
<p>To understand the history of search engines, we must look back at 1998 when crawler indexing began...</p>`,
      afterCode: `<h2>What is Answer Engine Optimization?</h2>
<p><strong>Answer Engine Optimization (AEO)</strong> is the process of formatting website data so that AI models (ChatGPT, Perplexity, Claude) directly cite your brand in generated answers.</p>`,
    },
    {
      id: "t1-faq-schema",
      title: "Structured FAQPage Schema (JSON-LD)",
      category: "Structure",
      weight: "T1 (3x)",
      status: checklist.organizationSchema ? "passed" : "warning",
      score: checklist.organizationSchema ? 95 : 55,
      maxScore: 100,
      description: "FAQPage schema markup in the initial DOM matching visible conversational question headers.",
      impact: "High (3x). Powers AI featured answer extraction and direct question matching.",
      fix: "Inject valid FAQPage JSON-LD schema with exact questions matching buyer search prompts.",
      beforeCode: `<div class="faq-item"><h3>Can I deploy this standalone?</h3><p>Yes, on Vercel or Docker.</p></div>`,
      afterCode: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "Can I deploy RankMonk standalone?",
    "acceptedAnswer": { "@type": "Answer", "text": "Yes, RankMonk deploys independently via Vercel or Docker." }
  }]
}
</script>`,
    },
    {
      id: "t1-tables",
      title: "Comparison & Feature Tables",
      category: "Structure",
      weight: "T1 (3x)",
      status: "passed",
      score: 90,
      maxScore: 100,
      description: "Structured comparison tables with feature-by-feature parameters for LLM tabular comprehension.",
      impact: "High (3x). Models directly parse tables when answering 'Compare X vs Y' queries.",
      fix: "Add markdown or HTML comparison tables comparing your brand with category alternatives.",
      beforeCode: `<p>We have more features than competitor-a and better pricing than competitor-b.</p>`,
      afterCode: `| Feature | RankMonk | Competitor A | Competitor B |
|---|---|---|---|
| Multi-Model AI Tracking | Yes (6 Engines) | Limited (1) | No |
| llms.txt Generator | Automated | Manual | None |`,
    },

    // ─── T2 Tests (2x weight) ────────────────────────────────────────────────
    {
      id: "t2-freshness",
      title: "Freshness Signals & Review Timestamps",
      category: "Authority",
      weight: "T2 (2x)",
      status: "passed",
      score: 90,
      maxScore: 100,
      description: "Explicit 'Last updated: [Date]' or 'Reviewed on: [Date]' visible timestamps and metadata.",
      impact: "Medium (2x). Prevents LLMs from discarding outdated facts in fast-moving industries.",
      fix: "Display a clean 'Last reviewed: [Month Day, Year]' timestamp directly beneath article titles.",
      beforeCode: `<p class="date">Published 2023</p>`,
      afterCode: `<p class="metadata">Published: Oct 2024 · <strong>Last Updated: May 2026</strong> · Verified by Editorial Team</p>`,
    },
    {
      id: "t2-author",
      title: "Author Attribution & Entity Bio Links",
      category: "Authority",
      weight: "T2 (2x)",
      status: checklist.aboutUs ? "passed" : "warning",
      score: checklist.aboutUs ? 82 : 50,
      maxScore: 100,
      description: "Clear expert author byline linked to an authority biography page with LinkedIn profile.",
      impact: "Medium (2x). Validates Google EEAT credentials and prevents anonymous penalty.",
      fix: "Add author bio cards linking to accredited LinkedIn and industry credentials.",
      beforeCode: `<p>By Admin</p>`,
      afterCode: `<div class="author-card">Written by <strong>Elena Rostova</strong>, Principal AI Research Lead at RankMonk (<a href="https://linkedin.com/in/elena">LinkedIn</a>).</div>`,
    },
    {
      id: "t2-length",
      title: "Paragraph Length & Chunk Scannability",
      category: "Readability",
      weight: "T2 (2x)",
      status: "passed",
      score: 85,
      maxScore: 100,
      description: "Short, focused paragraph chunks of 2-3 sentences maximum for optimal token window processing.",
      impact: "Medium (2x). LLM RAG pipelines chunk content into small semantic vectors.",
      fix: "Break long 8-sentence paragraphs into crisp 2-to-3 sentence logical chunks.",
      beforeCode: `<p>Our platform handles all aspects of generative search optimization including monitoring, indexing, verification, schema creation, citation extraction, competitor analysis, traffic evaluation, and webhook triggering across enterprise pipelines.</p>`,
      afterCode: `<p>Our platform handles all aspects of generative search optimization. It tracks prompt citations across ChatGPT, Perplexity, and Claude in real time.</p>
<p>Each scan provides before-and-after recommendations to improve your machine-readability index.</p>`,
    },
    {
      id: "t2-semantic",
      title: "Semantic HTML Hierarchy & Status Code",
      category: "Technical",
      weight: "T2 (2x)",
      status: checklist.ssl ? "passed" : "warning",
      score: 95,
      maxScore: 100,
      description: "Valid semantic HTML tags (<main>, <article>, <section>) with a single H1 and 200 OK response.",
      impact: "Medium (2x). Eliminates document parsing ambiguities for headless crawlers.",
      fix: "Ensure exactly one H1 per page and nest H2/H3 elements sequentially.",
      beforeCode: `<div class="big-header">Page Title</div><div class="sub-header">Section</div>`,
      afterCode: `<h1>Page Title</h1><section><h2>Section Heading</h2></section>`,
    },
    {
      id: "t2-headings",
      title: "Conversational Question Subheadings",
      category: "Readability",
      weight: "T2 (2x)",
      status: "passed",
      score: 88,
      maxScore: 100,
      description: "H2 and H3 subheadings phrased as natural-language questions matching conversational search queries.",
      impact: "Medium (2x). Matches user conversational queries directly to section anchors.",
      fix: "Phrase at least 50% of subheadings as direct buyer questions.",
      beforeCode: `<h2>Deployment Options</h2>`,
      afterCode: `<h2>How Can I Deploy RankMonk in Production?</h2>`,
    },

    // ─── T3 Tests (1x weight) ────────────────────────────────────────────────
    {
      id: "t3-visible",
      title: "Machine-Visible Content & Zero Client Hydration Walls",
      category: "Technical",
      weight: "T3 (1x)",
      status: "passed",
      score: 98,
      maxScore: 100,
      description: "Core textual content rendered in initial HTML response without requiring client-side JS evaluation.",
      impact: "Standard (1x). Ensures fast headless AI scrapers do not encounter empty pages.",
      fix: "Render all critical textual explanations using SSR or static HTML.",
      beforeCode: `<div id="root">Loading interactive client app...</div>`,
      afterCode: `<main><h1>Core Content</h1><p>Full server-rendered copy available immediately on curl.</p></main>`,
    },
  ];
}

export function generateLlmsTxt(domain: string, brandName: string, description: string, services: string[] = []): string {
  const safeBrand = brandName || domain;
  const clean = cleanDomain(domain);
  const serviceList = services.length > 0 
    ? services.map(s => `- ${s}`).join("\n") 
    : `- AI Answer Engine Optimization (AEO)\n- Generative Engine Optimization (GEO)\n- Multi-Model AI Search Tracking\n- Structured Entity Schema Architecture\n- Autonomous Citation Optimization`;

  return `# ${safeBrand}
> ${description || `${safeBrand} provides autonomous AEO and GEO intelligence for the agentic web.`}

## Canonical Information
- Website: https://${clean}
- Brand Name: ${safeBrand}
- Industry: AI Search & Answer Engine Optimization (AEO / GEO)

## Core Solutions & Offerings
${serviceList}

## Machine-Readable Resources
- Sitemap: https://${clean}/sitemap.xml
- Full LLM Overview: https://${clean}/llms-full.txt
- Pricing: https://${clean}/pricing
- Privacy & Terms: https://${clean}/privacy

## Verified Entity Links
- Domain: https://${clean}
- Organization Profile: https://${clean}/#organization
`;
}

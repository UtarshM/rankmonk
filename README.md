# RankMonk — Autonomous AI Search & Answer Engine Optimization (AEO/GEO) Platform

[![CI](https://github.com/UtarshM/rankmonk/actions/workflows/ci.yml/badge.svg)](https://github.com/UtarshM/rankmonk/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](https://opensource.org/licenses/MIT)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.2.6-black)](https://nextjs.org/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)

> **Autonomous Closed-Loop AEO/GEO Platform for the Generative Web**  
> Diagnose generative AI visibility gaps across ChatGPT, Claude, Gemini, and Perplexity — and autonomously ship validated schema, metadata, and answer fixes in one click.

---

## 🚀 Core Pillars

### 1. Autonomous Remediation Engine (ARE™) (`/geo`)
- **Closed-Loop Execution:** Moving beyond passive audits to active remediation. Convert audit failures into prioritized, page-scoped actions with estimated impact scores.
- **1-Click Live Deployment:** Lightweight, framework-agnostic client runtime SDK (`/sdk/rankmonk-runtime.js`, <3KB) dynamically injects validated JSON-LD schemas (FAQ, Organization, Article, Product), BLUF answer blocks, freshness badges, and machine directives without full redeploys.
- **Rollback & Verification Beacons:** Every rule includes instant snapshot rollback and live DOM confirmation beacons with latency and timestamp telemetry.
- **Universal CMS & Framework Compatibility:** Direct snippet support for vanilla HTML, Next.js, Webflow, Framer, WordPress, and Shopify via Google Tag Manager or theme layout.

### 2. RankMonk Neural Diagnostic Framework (RNDF™) (`/geo`)
- **11-Test Weighted Diagnostic:** Tests categorized into T1 (3x weight for high citation impact), T2 (2x weight for semantic clarity), and T3 (1x weight for crawler hygiene).
- **Dual-Crawl Audit:** Pre-JS raw HTML vs. rendered DOM inspection to detect client-side hydration walls that blind LLM scrapers.
- **Robots & AI Bot Directives:** Live inspection for `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, and `ByteSpider`.
- **`llms.txt` Generator & Validator:** 1-click generation, validation, and download of machine-readable Markdown specifications.
- **EEAT Trust Graph:** Cross-platform trust verification across 12 authoritative platforms (G2, Reddit, Capterra, LinkedIn, Crunchbase, Trustpilot, etc.).

### 3. Multi-Model AEO Intelligence (`/aeo`)
- **Search-Grounded Query Scans:** Per-prompt, per-engine visibility matrix across ChatGPT, Claude, Gemini, and Perplexity.
- **Raw Answer Drilldown:** Detailed view of model answers, extracted citation URLs, sentiment ratings, and recommendation position.
- **4-Step AI Domain Discovery Wizard:** Ingests domain homepages and converts site architecture into high-converting buyer-intent queries (Awareness, Evaluation, Comparison, Decision).
- **Sector Master Prompts:** 100+ pre-vetted buyer-intent prompts across B2B SaaS, FinTech, E-commerce, Healthcare, Legal, and Manufacturing (Bilingual EN/FR).

### 4. Competitor Share of Voice (`/competitors`)
- Head-to-head AI visibility & Share of Voice matrix against direct category peers.
- Tracks citation share percentage, top prompt wins, and crawler accessibility parity.

### 5. AI Referral Traffic & Attribution (`/traffic`)
- GA4-integrated traffic source breakdown from conversational LLM citations (`chatgpt.com`, `perplexity.ai`, `claude.ai`, `gemini.google.com`, `copilot.microsoft.com`).
- Built-in Enterprise AI Citation UTM Parameter Generator.
- Pre-configured GA4 Custom Channel Grouping regex rules.

### 6. Autonomous Content Gap Studio (`/content-gaps`)
- Detects high-intent buyer queries where competitors win AI citations and your domain is omitted.
- 1-click Markdown brief generator featuring BLUF answers, mandatory statistics, heading outlines, and JSON-LD schemas.

---

## ⚡ Quick Start

RankMonk is a standalone Next.js 16 application.

### Prerequisites
- Node.js 20+ and npm (or Bun)
- PostgreSQL database (or Supabase instance)

### Installation
```bash
# Clone the repository
git clone https://github.com/UtarshM/rankmonk.git
cd rankmonk

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Scripts
- `npm run dev`: Start Next.js development server with Webpack mode.
- `npm run build`: Production bundle compilation.
- `npm run start`: Start production server.
- `npm run typecheck`: Strict TypeScript validation.

---

## 🔌 Deploying the Remediation SDK

To enable 1-click schema and BLUF injection on target websites, insert the RankMonk Runtime SDK into the `<head>` of your site:

```html
<!-- RankMonk Autonomous Remediation Runtime -->
<script
  src="https://rankmonk.vercel.app/sdk/rankmonk-runtime.js"
  data-project="your-domain.com"
  async>
</script>
```

For Next.js App Router applications (`app/layout.tsx`):
```tsx
import Script from "next/script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://rankmonk.vercel.app/sdk/rankmonk-runtime.js"
          data-project="your-domain.com"
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## 🗄️ Database Setup (Supabase / Postgres)

Execute the included `schema.sql` against your Supabase or PostgreSQL database:

```bash
psql -h your-db-host -U postgres -d postgres -f schema.sql
```

Tables included:
- `projects`: Domain configuration, crawler states, and verification tokens.
- `aeo_prompts`: Tracked generative search prompts by intent category.
- `prompt_scan_runs`: Historical scan runs per engine with raw response payloads.
- `aeo_citations`: Extracted citations, domains, and sentiment scores.
- `geo_audits`: 11-test diagnostic scores, crawler headers, and `llms.txt` state.
- `remediation_rules`: Active DOM injection payloads, rollback snapshots, and deployment history.

---

## 🐳 Docker Deployment

RankMonk is fully containerized and production-ready:

```bash
docker compose up -d --build
```

Access the application at `http://localhost:3000`.

---

## 🌐 Vercel 1-Click Deployment

RankMonk is optimized for Vercel out of the box (`vercel.json`):
1. Connect your repository to Vercel.
2. Ensure framework is detected as **Next.js**.
3. Supply required environment variables from `.env.example`.
4. Deploy with zero configuration.

---

## 🔒 Security & SSRF Protection

All network auditing logic operates through `src/lib/security/ssrf.ts` with strict enterprise safeguards:
- **Private Subnet Filtering:** Blocks loopback (`127.0.0.1`), private RFC 1918 subnets (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), and AWS/GCP cloud metadata services (`169.254.169.254`).
- **Port Whitelisting:** Enforces outgoing connections strictly on ports 80 and 443.
- **Timeouts & Payloads:** Max 7,500ms timeout and 2MB payload cap.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

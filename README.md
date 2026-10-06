# RankMonk — AI Search & Answer Engine Optimization (AEO/GEO) Platform

> **Sitefire.ai Alternative & Standalone Enterprise SaaS**  
> Built for independent deployment on Vercel, Docker, or bare metal using **Bun** or **Node.js/npm**.

---

## 🚀 Overview

**RankMonk** is a standalone enterprise application designed specifically to audit, optimize, and dominate visibility across modern AI search surfaces — including **ChatGPT (SearchGPT)**, **Anthropic Claude**, **Google Gemini**, **Perplexity AI**, **Microsoft Copilot**, and **xAI Grok**.

As commercial buyers shift from classic ten-blue-links Google search to conversational generative assistants, RankMonk provides the entire Sitefire-grade optimization toolset in a standalone codebase:

### 1. 11-Test GEO Diagnostic Engine (`/geo`)
- **Sitefire.ai Weighted Methodology:** Tests categorized into T1 (3x weight), T2 (2x weight), and T3 (1x weight).
- **Before vs. After Actionable Code Snippets:** Instant copy-paste code and copy fixes for source citations, numerical statistics, BLUF answer-first paragraphs, FAQPage JSON-LD schemas, and comparison tables.
- **AI Crawler & Robots.txt Directives:** Live status checks for `GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`, and `ByteSpider`.
- **`llms.txt` Protocol Generator:** 1-click generation, validation, and download of machine-readable specifications.
- **EEAT & 12-Platform Footprint:** Measures brand trust signals across G2, Reddit, Capterra, LinkedIn, CrunchBase, TrustPilot, X, and YouTube.

### 2. Multi-Model AEO Engine (`/aeo`)
- **Multi-Model Visibility Matrix:** Real-time query scanning across 6 leading AI models.
- **4-Step AI Domain Discovery Wizard:** Automated homepage extraction into buyer-intent queries (Awareness, Evaluation, Comparison, Decision).
- **Citation & Sentiment Distribution:** Tracks which pages and domains are cited as primary evidence and whether recommendations are positive or neutral.
- **100+ Sector Master Prompts:** Pre-vetted buyer-intent prompts across B2B SaaS, FinTech, E-commerce, Healthcare, Legal, and Manufacturing (Bilingual EN/FR).

### 3. Competitor Benchmarking & Share of Voice (`/competitors`)
- Head-to-head AI visibility & Share of Voice matrix against Sitefire.ai, Higoodie, and custom rivals.
- Tracks citation share percentage, top prompt wins, and sentiment ratings across ChatGPT and Perplexity.

### 4. AI Referral Traffic & Attribution Studio (`/traffic`)
- GA4-integrated traffic source breakdown from conversational LLM citations (`chatgpt.com`, `perplexity.ai`, `claude.ai`, `gemini.google.com`, `copilot.microsoft.com`).
- Built-in AI Citation UTM Parameter Builder.
- Exact GA4 Custom Channel Grouping regex rule: `(chatgpt|openai|perplexity|claude|anthropic|gemini|copilot)`.

### 5. Content Gap Studio & 1-Click Brief Generator (`/content-gaps`)
- Detects high-intent buyer queries where competitors win AI citations and your domain is omitted.
- 1-click markdown brief generator featuring BLUF answers, mandatory statistics, heading outlines, and JSON-LD schemas.

### 6. SaaS Pricing & Subscription Plans (`/pricing`)
- Transparent tiers: Starter ($49/mo), Growth ($149/mo), and Enterprise ($399/mo) with monthly/annual switch.

---

## ⚡ Quick Start with Bun (Recommended) or npm

RankMonk fully supports **Bun** for ultra-fast builds and execution:

### Using Bun:
```bash
# From workspace root
bun run bun:dev:rankmonk         # Start dev server on http://localhost:3000
bun run bun:build:rankmonk       # Run optimized production build
bun run bun:typecheck:rankmonk   # Run strict TypeScript validation

# Or navigate directly to apps/rankmonk:
cd apps/rankmonk
bun install
bun run dev                      # Start dev server
bun run build                    # Production build
bun run typecheck                # Typecheck
```

### Using npm:
```bash
# From workspace root
npm run dev:rankmonk             # Start dev server
npm run build:rankmonk           # Production build
npm run typecheck:rankmonk       # Typecheck

# Or navigate directly to apps/rankmonk:
cd apps/rankmonk
npm install
npm run dev
npm run build
```

---

## 📁 Standalone Directory Structure

```
apps/rankmonk/
├── Dockerfile                     # Production multi-stage Docker build
├── docker-compose.yml             # Local/production Docker Compose
├── package.json                   # Standalone package.json
├── next.config.ts                 # Next.js 16 standalone config (Webpack mode)
├── tsconfig.json                  # TypeScript path mappings (@/* -> src/*)
├── postcss.config.mjs             # PostCSS Tailwind v4 configuration
├── vercel.json                    # Vercel deployment directives
├── schema.sql                     # Standalone Supabase database schema & RLS policies
├── .env.example                   # Environment variable template
└── src/
    ├── app/
    │   ├── layout.tsx             # Root layout with RankMonk theme
    │   ├── globals.css            # Tailwind CSS v4 design tokens and gradients
    │   ├── page.tsx               # Overview Command Center
    │   ├── aeo/page.tsx           # Multi-Model AEO Workspace
    │   ├── geo/page.tsx           # 11-Test GEO Diagnostic Scorecard
    │   ├── competitors/page.tsx   # Competitor Benchmarking & Share of Voice
    │   ├── traffic/page.tsx       # AI Referral Traffic & GA4 Attribution
    │   ├── content-gaps/page.tsx  # Content Gap Studio & 1-Click Briefs
    │   ├── pricing/page.tsx       # Standalone SaaS Pricing & Plans
    │   └── api/
    │       ├── health/route.ts                    # Health check endpoint
    │       ├── aeo/
    │       │   ├── discover-topics/route.ts       # OpenRouter AI topic discovery
    │       │   ├── generate-prompts/route.ts      # Prompt generator
    │       │   ├── generate-prompts-wizard/route.ts # Categorized wizard prompts
    │       │   ├── master-prompts/route.ts        # Sector master prompts
    │       │   └── analyze/route.ts               # Local & AI AEO analysis engine
    │       └── geo/
    │           ├── audit/route.ts                 # Live robots.txt, crawlers, and EEAT audit
    │           ├── scorecard/route.ts             # 11-Test diagnostic scorecard API
    │           └── generate-llmstxt/route.ts      # llms.txt protocol generator
    ├── components/
    │   ├── aeo/                   # AEO workspace, wizard, master prompts, content gaps
    │   ├── geo/                   # 11-Test scorecard card, EEAT card, crawlers card, llmstxt modal
    │   ├── competitors/           # Competitor benchmark card & share of voice
    │   ├── traffic/               # AI traffic tracker & UTM builder
    │   └── shared/                # App header, footer, providers
    ├── hooks/                     # Custom React hooks (useProjects, etc.)
    ├── lib/                       # Utility functions, geo-audit engine, utils
    ├── server/                    # Shared server utilities
    └── types/                     # Strict TypeScript interfaces for AEO & GEO
```

---

## 🗄️ Standalone Database Setup

RankMonk includes a dedicated `schema.sql` file designed for Supabase or standard PostgreSQL:

```bash
# Run against your Supabase or PostgreSQL instance:
psql -h your-db-host -U postgres -d postgres -f apps/rankmonk/schema.sql
```

Tables created:
- `projects`
- `aeo_prompts`
- `prompt_scan_runs`
- `aeo_citations`
- `aeo_analyses`
- `aeo_content_gaps`
- `geo_audits`
- `geo_scores`

All tables include automated timestamps, indexes on `(project_id, created_at)`, and Row Level Security (RLS) policies.

---

## 🐳 Docker Deployment

RankMonk is fully containerized and production-ready:

```bash
cd apps/rankmonk
docker compose up -d --build
```
Access the application at `http://localhost:3000`.

---

## 🌐 Vercel 1-Click Deployment

RankMonk is configured with `vercel.json` for seamless deployment:
- **Framework Preset:** Next.js
- **Build Command:** `next build --webpack`
- **Output Directory:** `.next`
- Set root directory in Vercel to `apps/rankmonk`.

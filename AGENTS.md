# AGENTS.md — RankMonk Autonomous Engineering Guidelines

Welcome to **RankMonk.ai**. This file provides context, rules of engagement, and architectural standards for AI agents, pairing assistants (Antigravity, Claude Code), and human contributors.

---

## 1. Project Mission & Identity

**RankMonk** is a production-grade, closed-loop Autonomous Answer Engine Optimization (AEO) and Generative Engine Optimization (GEO) SaaS platform.

- **Primary Goal:** Enable businesses and agencies to diagnose generative AI visibility gaps across ChatGPT, Claude, Gemini, and Perplexity — and autonomously ship validated schema, metadata, and answer fixes in one click.
- **Proprietary Framework:** **RankMonk Neural Diagnostic Framework (RNDF™)**.
- **Autonomous Execution:** **Autonomous Remediation Engine (ARE™)** via lightweight client runtime SDK (`/sdk/rankmonk-runtime.js`).

---

## 2. Architecture & Technology Stack

| Layer | Technology | Key Details |
|---|---|---|
| **Framework** | Next.js 16.2 (App Router) | Webpack mode configured in `next.config.ts` |
| **Styling** | Tailwind CSS v4 + Vanilla CSS | CSS variables defined in `src/app/globals.css` |
| **Runtime** | Node.js 20+ / Bun | Standalone package at repository root |
| **Database & Auth** | Supabase (PostgreSQL) | Strict Row Level Security (RLS) on all tables |
| **Client SDK** | Sandboxed JavaScript (<3KB) | `public/sdk/rankmonk-runtime.js` |
| **AI Providers** | AWS Bedrock (Claude 3.5 Sonnet) / OpenRouter | Grounded searches and sentiment extraction |
| **Security** | SSRF Guard | `src/lib/security/ssrf.ts` |

---

## 3. Core Directory Layout

```
├── .github/workflows/       # Continuous Integration (ci.yml)
├── public/
│   ├── sdk/                 # rankmonk-runtime.js (client DOM injector)
│   └── llms.txt             # Machine-readable specification
├── src/
│   ├── app/
│   │   ├── page.tsx         # Overview Command Center
│   │   ├── aeo/page.tsx     # Multi-Model AEO Workspace
│   │   ├── geo/page.tsx     # 11-Test GEO & Remediation Actions Queue
│   │   ├── competitors/     # Share of Voice & Category Benchmarks
│   │   ├── traffic/         # AI Referral Traffic & UTM Studio
│   │   ├── content-gaps/    # Autonomous Content Gap Engine
│   │   ├── pricing/         # SaaS Subscriptions & Tiers
│   │   └── api/             # Secure Route Handlers
│   ├── components/
│   │   ├── remediation/     # Action Cards & Snippet Integration Modals
│   │   ├── aeo/             # AEO Discovery Wizard & Prompt Matrix
│   │   ├── geo/             # Scorecards, EEAT, and Crawler Cards
│   │   └── shared/          # Header, Footer, Providers
│   ├── lib/
│   │   ├── security/        # SSRF guards and sanitizers
│   │   ├── remediation/     # In-memory and Supabase rule engines
│   │   └── geo/             # RNDF audit algorithms
│   └── types/               # Strict TypeScript definitions
├── supabase/
│   └── migrations/          # Version-controlled SQL migrations
├── LICENSE                  # MIT License
├── SECURITY.md              # Security & Disclosure Policy
└── vercel.json              # Vercel deployment directives
```

---

## 4. Safety & Operational Guardrails

### 4.1 Server-Side Request Forgery (SSRF) Guard
- **Mandatory Rule:** Any route handler or utility that fetches a user-supplied URL (e.g., auditing `robots.txt`, crawling sitemaps, or scraping HTML) **MUST** use `validateUrlForSsrf` and `safeFetch` from `src/lib/security/ssrf.ts`.
- **Blocked:** Loopback IPs (`127.0.0.1`), private RFC 1918 subnets (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), link-local / cloud metadata (`169.254.169.254`), and non-standard ports (strictly allow 80 and 443).

### 4.2 Secrets & Credential Isolation
- **Never Hardcode Secrets:** Never write API keys, database passwords, or JWT secrets into source files, tests, or documentation.
- **Server-Only Access:** AWS Bedrock credentials, `SUPABASE_SERVICE_ROLE_KEY`, and `OPENROUTER_API_KEY` must remain strictly within server-side route handlers. Never prefix secret variables with `NEXT_PUBLIC_`.

### 4.3 Autonomous Cloud Deployments
- Agents must **never** delete production databases, provision billable cloud resources without explicit user approval, or mutate production DNS.
- Prioritize dry-runs and diffs (e.g., `cdk diff` or `terraform plan`) before cloud resource provisioning.

---

## 5. Coding & Contribution Standards

1. **Strict Typing:** No `any` types. All data models must be typed in `src/types/`.
2. **Backward Compatibility:** Database schema changes must be backward-compatible with running client apps.
3. **Reproducible Builds:** Standardize on `package-lock.json` and `npm`. Do not re-add conflicting lockfiles (`bun.lock`).
4. **Git Discipline:** Clean commit messages following the Conventional Commits specification (`feat:`, `fix:`, `refactor:`, `chore:`).
5. **Pre-Commit Verification:** Always execute `npm run typecheck` before merging or deploying to verify zero TypeScript errors.

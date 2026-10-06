"use client";

import { useState } from "react";
import { AppHeader } from "@/components/shared/app-header";
import { AppFooter } from "@/components/shared/app-footer";
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle, 
  Zap, 
  Bot, 
  ArrowRight,
  TrendingUp,
  Globe,
  Layers
} from "lucide-react";
import Link from "next/link";

interface PlanTier {
  name: string;
  badge?: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  cta: string;
  popular?: boolean;
}

const TIERS: PlanTier[] = [
  {
    name: "Starter",
    description: "Ideal for bootstrapped founders and niche SaaS tracking basic AI brand presence.",
    monthlyPrice: 49,
    annualPrice: 39,
    features: [
      "1 Tracked Brand Domain",
      "250 Monthly Prompt Scans",
      "Engines: ChatGPT & Perplexity AI",
      "11-Test GEO Diagnostic Engine",
      "Before & After Code Snippets",
      "llms.txt Protocol Generator",
      "1 Tracked Competitor",
      "Weekly AI Visibility Updates",
      "Community & Email Support"
    ],
    cta: "Start 14-Day Free Trial",
  },
  {
    name: "Growth",
    badge: "Most Popular",
    popular: true,
    description: "Designed for high-growth tech brands and scaleups demanding AI search dominance.",
    monthlyPrice: 149,
    annualPrice: 119,
    features: [
      "3 Tracked Brand Domains",
      "1,500 Monthly Prompt Scans",
      "All 5 Engines: ChatGPT, Perplexity, Claude, Gemini, Copilot",
      "11-Test GEO Diagnostic Engine with Auto Audits",
      "Full Before vs After Code & Schema Solutions",
      "Up to 5 Competitor Benchmarks (Share of Voice)",
      "GA4 AI Referral Traffic Studio & UTM Builder",
      "Content Gap Studio & 1-Click Markdown Briefs",
      "100+ Sector Master Prompts (Bilingual EN/FR)",
      "Daily Crawler Directives & Robots.txt Monitoring",
      "Priority Email & Chat Support"
    ],
    cta: "Claim Growth Plan",
  },
  {
    name: "Enterprise / Agency",
    description: "For agencies and enterprise brands managing multi-brand portfolios and clients.",
    monthlyPrice: 399,
    annualPrice: 319,
    features: [
      "15 Tracked Brand Domains",
      "6,000 Monthly Prompt Scans",
      "All 6 Engines + Grok & DeepSeek Scans",
      "Daily Automated GEO 11-Test Audits",
      "Unlimited Competitor Tracking & Benchmarking",
      "White-Label AEO/GEO PDF & CSV Reports",
      "Real-time Webhook Alerts on Citation Drops",
      "Direct REST API Access for CI/CD Pipeline Integration",
      "Dedicated AI Search Strategist & Shared Slack Channel",
      "Custom SLA & Enterprise Invoicing"
    ],
    cta: "Contact Enterprise Sales",
  },
];

const FAQS = [
  {
    question: "Why do traditional SEO tools like Ahrefs and Semrush fail for AI Search?",
    answer: "Traditional SEO tools only track Google 10-blue-link SERPs, keyword search volume, and backlinks. They have zero visibility into LLM probabilistic synthesis, neural citation mechanics, or how ChatGPT, Perplexity, and Claude select sources to answer conversational queries."
  },
  {
    question: "What is the difference between AEO and GEO?",
    answer: "AEO (Answer Engine Optimization) focuses on getting your brand named or cited in immediate direct answers. GEO (Generative Engine Optimization) audits your entire website's structure, statistical density, author authority, and machine crawlability (11 weighted diagnostic tests) so LLMs synthesize your content accurately."
  },
  {
    question: "How does RankMonk track citations in real-time?",
    answer: "RankMonk executes headless automated prompt queries across live production LLM endpoints (ChatGPT Search, Perplexity Sonar, Claude 3.5, Gemini 1.5, Copilot). It extracts all cited URLs, analyzes brand sentiment, detects source hierarchy, and logs historical visibility scores."
  },
  {
    question: "Can I connect my Google Analytics 4 (GA4) account?",
    answer: "Yes! RankMonk provides a native GA4 custom channel grouping integration and UTM campaign generator to measure actual sessions, conversions, and revenue coming from ChatGPT, Perplexity, and other AI engines."
  }
];

export default function PricingPage() {
  const [annualBilling, setAnnualBilling] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink)]">
      <AppHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparent, High-ROI SaaS Pricing</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Dominate Generative Search & LLM Citations
          </h1>

          <p className="text-base text-[var(--muted)] leading-relaxed">
            Stop losing buyer-intent traffic to competitors in ChatGPT and Perplexity. Choose the plan that fits your growth ambitions.
          </p>

          {/* Billing Switcher */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-xs font-bold ${!annualBilling ? "text-[var(--ink)]" : "text-[var(--muted)]"}`}>
              Monthly Billing
            </span>

            <button
              onClick={() => setAnnualBilling(!annualBilling)}
              className="relative w-12 h-6 rounded-full bg-[var(--bg-2)] border border-[var(--line)] p-0.5 transition-colors"
            >
              <div
                className={`w-5 h-5 rounded-full bg-purple-600 shadow-sm transition-transform ${
                  annualBilling ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>

            <span className={`text-xs font-bold flex items-center gap-1.5 ${annualBilling ? "text-purple-600 dark:text-purple-400" : "text-[var(--muted)]"}`}>
              <span>Annual Billing</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                Save 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TIERS.map((tier) => {
            const price = annualBilling ? tier.annualPrice : tier.monthlyPrice;

            return (
              <div
                key={tier.name}
                className={`relative rounded-3xl border p-8 flex flex-col justify-between transition-all ${
                  tier.popular
                    ? "border-purple-500/60 bg-[var(--panel)] shadow-xl shadow-purple-500/10 ring-1 ring-purple-500"
                    : "border-[var(--line)] bg-[var(--panel)] shadow-sm hover:border-purple-500/30"
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-md">
                    {tier.badge}
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-extrabold text-[var(--ink)]">{tier.name}</h3>
                    <p className="text-xs text-[var(--muted)] mt-1.5 min-h-[36px]">{tier.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-[var(--ink)]">${price}</span>
                    <span className="text-xs text-[var(--muted)] font-semibold">/ month</span>
                  </div>

                  <div className="pt-4 border-t border-[var(--line)] space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)] block">
                      Everything included:
                    </span>
                    <ul className="space-y-2.5 text-xs text-[var(--ink-2)]">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-8">
                  <Link
                    href="/aeo"
                    className={`w-full py-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
                      tier.popular
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/25"
                        : "bg-[var(--bg-2)] hover:bg-[var(--bg)] border border-[var(--line)] text-[var(--ink)]"
                    }`}
                  >
                    <span>{tier.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Feature Comparison Highlights */}
        <div className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-8 shadow-sm space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold">Why SaaS Teams Choose RankMonk over Sitefire</h2>
            <p className="text-xs text-[var(--muted)]">
              Full-stack AI Answer Engine Optimization and Generative Diagnostics in one unified platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-5 rounded-2xl bg-[var(--bg-2)]/50 border border-[var(--line)] space-y-2">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold">
                11
              </div>
              <h3 className="text-sm font-bold text-[var(--ink)]">11-Test Weighted Diagnostic</h3>
              <p className="text-xs text-[var(--muted)]">
                Sitefire-grade T1 (3x), T2 (2x), and T3 (1x) weighted scoring with copy-pasteable Before/After remediation code.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--bg-2)]/50 border border-[var(--line)] space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                GA4
              </div>
              <h3 className="text-sm font-bold text-[var(--ink)]">AI Traffic & Attribution Studio</h3>
              <p className="text-xs text-[var(--muted)]">
                Track revenue and conversion funnels directly from ChatGPT, Claude, and Perplexity with our UTM builder and GA4 regex filters.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[var(--bg-2)]/50 border border-[var(--line)] space-y-2">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center font-bold">
                GAP
              </div>
              <h3 className="text-sm font-bold text-[var(--ink)]">Content Gap Brief Generator</h3>
              <p className="text-xs text-[var(--muted)]">
                Automatically detect queries where competitors win AI citations and generate 1-click Markdown briefs to outrank them.
              </p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
            <p className="text-xs text-[var(--muted)]">Everything you need to know about RankMonk and AEO/GEO SaaS.</p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--panel)] space-y-2">
                <h4 className="text-sm font-bold text-[var(--ink)] flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-purple-500 shrink-0" />
                  <span>{faq.question}</span>
                </h4>
                <p className="text-xs text-[var(--muted)] pl-6 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}

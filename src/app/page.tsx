"use client";

import { useState } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/shared/app-header";
import { AppFooter } from "@/components/shared/app-footer";
import { AeoWizardModal } from "@/components/aeo/aeo-wizard-modal";
import { LlmsTxtGeneratorModal } from "@/components/geo/llmstxt-generator-modal";
import { useProjects } from "@/hooks/useProjects";
import { useAuth } from "@/hooks/useAuth";
import { cleanDomain } from "@/lib/utils";
import { 
  Sparkles, 
  ShieldCheck, 
  Bot, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Check, 
  ExternalLink, 
  FileCode, 
  Layers, 
  TrendingUp, 
  Zap, 
  Award,
  Globe,
  Cpu,
  RefreshCw,
  Terminal,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";

export default function UnifiedOverviewPage() {
  const { activeProject } = useProjects();
  const { user, isAuthenticated } = useAuth();
  const [domainInput, setDomainInput] = useState(activeProject?.domain || "");
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isLlmsOpen, setIsLlmsOpen] = useState(false);

  const domain = cleanDomain(domainInput || activeProject?.domain || "example.com");
  const brandName = activeProject?.brand_name || activeProject?.name || "My Brand";

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink)]">
      <AppHeader 
        onOpenWizard={() => setIsWizardOpen(true)}
        onOpenLlmsModal={() => setIsLlmsOpen(true)}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {isAuthenticated && (
          <div className="max-w-xl mx-auto p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-between text-xs animate-in fade-in shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-sm shadow-purple-600/30">
                <Sparkles className="w-4 h-4 text-purple-200" />
              </div>
              <div>
                <span className="font-bold text-[var(--ink)] block">Session Active: {user?.name || user?.email}</span>
                <span className="text-[11px] text-[var(--muted)]">Workspace: <strong>{domain}</strong> ({user?.plan} tier)</span>
              </div>
            </div>
            <Link
              href="/aeo"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/20 active:scale-95 transition-all"
            >
              <span>Go to Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto space-y-4 pt-4 sm:pt-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            Standalone Enterprise Product
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--ink)] leading-tight">
            Dominate AI Search Answers with Unified{" "}
            <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-500 bg-clip-text text-transparent">
              AEO & GEO
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[var(--muted)] leading-relaxed">
            As buyers transition from traditional Google searches to ChatGPT, Claude, Perplexity, and Gemini, ensure your brand is cited as the primary recommendation with automated prompt tracking and generative engine optimization.
          </p>

          {/* Quick Domain Audit Box */}
          <div className="pt-4 max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-2xl border border-[var(--line)] bg-[var(--panel)] shadow-lg shadow-purple-500/5">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-[var(--muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Enter your website domain (e.g. acme.com)"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 text-xs bg-transparent text-[var(--ink)] placeholder-[var(--muted)] focus:outline-none"
                />
              </div>
              <button
                onClick={() => setIsWizardOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-600/25 active:scale-95 transition-all"
              >
                <span>Launch Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* Dual Product Cards: AEO vs GEO */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
          
          {/* Card 1: AEO Engine */}
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6 hover:border-purple-500/40 transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/20 group-hover:scale-105 transition-transform">
                  <Sparkles className="w-6 h-6 text-purple-200" />
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  Engine #1
                </span>
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-[var(--ink)]">
                  Answer Engine Optimization (AEO)
                </h2>
                <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed">
                  Active monitoring, query discovery, and citation tracking across LLMs when users search for solutions in your domain.
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2.5 text-xs text-[var(--ink-2)]">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span><strong>Multi-Model Visibility Matrix:</strong> ChatGPT, Gemini, Claude, DeepSeek, Grok, Perplexity.</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[var(--ink-2)]">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span><strong>AI Topic & Prompt Wizard:</strong> Reverse-engineer high-intent conversational buyer questions.</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[var(--ink-2)]">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span><strong>Citation & Sentiment Tracking:</strong> Monitor brand referral frequency and sentiment rating.</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[var(--ink-2)]">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
                  <span><strong>Master Sector Prompts:</strong> 100+ pre-vetted buyer intent questions across commercial verticals.</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--line)]">
              <Link
                href="/aeo"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition-all active:scale-98"
              >
                <span>Open AEO Workspace</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card 2: GEO Engine */}
          <div className="rounded-3xl border border-[var(--line)] bg-[var(--panel)] p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6 hover:border-indigo-500/40 transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-6 h-6 text-teal-200" />
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  Engine #2
                </span>
              </div>

              <div>
                <h2 className="text-xl font-extrabold text-[var(--ink)]">
                  Generative Engine Optimization (GEO)
                </h2>
                <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed">
                  On-page factual density, machine-readable protocol standards, and external platform authority for LLM extractability.
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <div className="flex items-center gap-2.5 text-xs text-[var(--ink-2)]">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span><strong>11-Test GEO Scorecard:</strong> Comprehensive audit rating crawlability and machine readability.</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[var(--ink-2)]">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span><strong>AI Crawler Verification:</strong> Direct directives validator for GPTBot, ClaudeBot, PerplexityBot.</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[var(--ink-2)]">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span><strong>llms.txt Protocol Standard:</strong> Instant generation of machine-readable website summaries.</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-[var(--ink-2)]">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                  <span><strong>12 Platform Footprint Audit:</strong> G2, Reddit, Capterra, LinkedIn, TrustPilot, and CrunchBase.</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--line)]">
              <Link
                href="/geo"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all active:scale-98"
              >
                <span>Open GEO Workspace</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Autonomous Intelligence Extensions */}
        <section className="space-y-6 pt-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[var(--line)] pb-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                Autonomous Intelligence Suite
              </div>
              <h3 className="text-xl font-black text-[var(--ink)] mt-0.5">
                Advanced Generative Attribution & Market Share
              </h3>
            </div>
            <Link href="/pricing" className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1">
              <span>View SaaS Pricing & Plans</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1: Competitor Benchmarking */}
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-purple-500/40 transition-all group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[var(--ink)]">Competitor Benchmarking</h4>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Head-to-head AI visibility & Share of Voice matrix against direct rivals and custom market peers across ChatGPT and Perplexity.
                </p>
              </div>
              <Link
                href="/competitors"
                className="inline-flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-500 pt-2"
              >
                <span>Launch Competitors</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Feature 2: AI Referral Traffic Studio */}
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-all group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[var(--ink)]">AI Traffic & Attribution</h4>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Track real sessions, conversions, and pipeline attributed to ChatGPT, Claude, and Perplexity with our GA4 regex rule and UTM builder.
                </p>
              </div>
              <Link
                href="/traffic"
                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 pt-2"
              >
                <span>Launch Traffic Studio</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Feature 3: Content Gap Studio */}
            <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition-all group">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[var(--ink)]">Content Gap Briefs</h4>
                <p className="text-xs text-[var(--muted)] leading-relaxed">
                  Detect high-intent buyer queries where competitors win AI citations and generate 1-click Markdown briefs to steal citations.
                </p>
              </div>
              <Link
                href="/content-gaps"
                className="inline-flex items-center gap-2 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 pt-2"
              >
                <span>Explore Content Gaps</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
        <section className="space-y-6 pt-6">
          <div className="text-center space-y-1">
            <h3 className="text-xl font-black text-[var(--ink)]">
              Engineered for Autonomous Independent Deployment
            </h3>
            <p className="text-xs text-[var(--muted)]">
              Everything required to run, scale, and monetize this product standalone on Vercel or Docker.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--panel)] space-y-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                <Cpu className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-[var(--ink)]">Native Next.js 16 & React 19</h4>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Modern App Router architecture with zero external monorepo dependencies. Ready for one-click Vercel deployment.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--panel)] space-y-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                <Terminal className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-[var(--ink)]">Standalone REST APIs</h4>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Includes routes for <code className="text-[10px] font-mono">/api/aeo/*</code> and <code className="text-[10px] font-mono">/api/geo/*</code> with robust validation, AI failover, and rate limiting.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--panel)] space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <FileCode className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-[var(--ink)]">Dedicated SQL Schema</h4>
              <p className="text-xs text-[var(--muted)] leading-relaxed">
                Complete <code className="text-[10px] font-mono">schema.sql</code> with tables, RLS policies, and indexes for AEO prompts, citations, and GEO audit records.
              </p>
            </div>
          </div>
        </section>
      </main>

      <AppFooter />

      {/* Modals */}
      <AeoWizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        initialDomain={domainInput}
      />

      <LlmsTxtGeneratorModal
        isOpen={isLlmsOpen}
        onClose={() => setIsLlmsOpen(false)}
      />
    </div>
  );
}

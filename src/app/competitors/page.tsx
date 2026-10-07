"use client";

import { useState } from "react";
import { AppHeader } from "@/components/shared/app-header";
import { AppFooter } from "@/components/shared/app-footer";
import { CompetitorBenchmarkCard } from "@/components/competitors/competitor-benchmark-card";
import { useProjects } from "@/hooks/useProjects";
import { 
  Users, 
  TrendingUp, 
  Trophy, 
  Sparkles, 
  Flame, 
  ArrowUpRight, 
  ShieldAlert,
  Search,
  CheckCircle2,
  Crosshair
} from "lucide-react";

import { ProtectedRoute } from "@/components/shared/protected-route";

export default function CompetitorsPage() {
  const { activeProject } = useProjects();
  const domain = activeProject?.domain || "rankmonk.ai";
  const brandName = domain.split(".")[0].toUpperCase();

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink)]">
        <AppHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--line)] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold mb-3">
              <Users className="w-3.5 h-3.5" />
              <span>Multi-Model Competitor Intelligence</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              AI Share of Voice & Competitor Intelligence
            </h1>
            <p className="text-sm text-[var(--muted)] mt-1.5 max-w-2xl">
              Track how often your brand is cited vs category rivals across ChatGPT, Claude, Perplexity, and Gemini.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-[var(--panel)] border border-[var(--line)] text-right">
              <div className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider">Active Domain</div>
              <div className="text-sm font-extrabold text-purple-600 dark:text-purple-400 flex items-center gap-1.5 justify-end">
                <Crosshair className="w-3.5 h-3.5" />
                <span>{domain}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Competitor Benchmark Matrix Card */}
        <CompetitorBenchmarkCard brandDomain={domain} brandName={brandName} />

        {/* Head-to-Head Win/Loss Analysis */}
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>Head-to-Head Prompt Battlegrounds</span>
              </h2>
              <p className="text-xs text-[var(--muted)] mt-0.5">
                Breakdown of buyer queries where your domain wins the primary citation vs competitor takeovers.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              64% Win Rate
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" /> Top Won Queries
                </span>
                <span className="text-[11px] text-[var(--muted)]">ChatGPT & Perplexity</span>
              </div>
              <ul className="text-xs space-y-2">
                <li className="p-2 rounded-lg bg-[var(--panel)] border border-[var(--line)] flex items-center justify-between">
                  <span className="font-medium text-[var(--ink)]">"Best AI search optimization platform for SaaS"</span>
                  <span className="font-bold text-emerald-600">Rank #1 Citation</span>
                </li>
                <li className="p-2 rounded-lg bg-[var(--panel)] border border-[var(--line)] flex items-center justify-between">
                  <span className="font-medium text-[var(--ink)]">"How to optimize website for Perplexity citation"</span>
                  <span className="font-bold text-emerald-600">Rank #1 Citation</span>
                </li>
                <li className="p-2 rounded-lg bg-[var(--panel)] border border-[var(--line)] flex items-center justify-between">
                  <span className="font-medium text-[var(--ink)]">"GEO vs AEO tools comparison 2026"</span>
                  <span className="font-bold text-emerald-600">Rank #2 Citation</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4" /> At-Risk Queries (Competitor Dominance)
                </span>
                <span className="text-[11px] text-[var(--muted)]">Category Rivals</span>
              </div>
              <ul className="text-xs space-y-2">
                <li className="p-2 rounded-lg bg-[var(--panel)] border border-[var(--line)] flex items-center justify-between">
                  <span className="font-medium text-[var(--ink)]">"Enterprise generative engine audit scorecard"</span>
                  <span className="font-bold text-rose-500">Rival #1 Cited</span>
                </li>
                <li className="p-2 rounded-lg bg-[var(--panel)] border border-[var(--line)] flex items-center justify-between">
                  <span className="font-medium text-[var(--ink)]">"llms.txt generator automated schema validation"</span>
                  <span className="font-bold text-rose-500">Rival #2 Cited</span>
                </li>
                <li className="p-2 rounded-lg bg-[var(--panel)] border border-[var(--line)] flex items-center justify-between">
                  <span className="font-medium text-[var(--ink)]">"Best AI bot crawler directives robots.txt"</span>
                  <span className="font-bold text-rose-500">Rival #3 Cited</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      <AppFooter />
    </div>
    </ProtectedRoute>
  );
}

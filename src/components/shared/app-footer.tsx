"use client";

import Link from "next/link";
import { Sparkles, ShieldCheck, Cpu, Terminal, ExternalLink } from "lucide-react";

export function AppFooter() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--bg-2)]/50 mt-16 py-12 text-xs text-[var(--muted)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white">
              <Sparkles className="w-3.5 h-3.5 text-purple-200" />
            </div>
            <div>
              <span className="font-bold text-[var(--ink)]">RankMonk AI Engine</span>
              <p className="text-[11px] text-[var(--muted)]">
                Enterprise Answer Engine (AEO) & Generative Engine Optimization (GEO) SaaS
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs font-semibold">
            <Link href="/" className="hover:text-[var(--ink)] transition-colors">
              Overview
            </Link>
            <Link href="/aeo" className="hover:text-[var(--ink)] transition-colors">
              AEO
            </Link>
            <Link href="/geo" className="hover:text-[var(--ink)] transition-colors">
              GEO 11-Tests
            </Link>
            <Link href="/competitors" className="hover:text-[var(--ink)] transition-colors">
              Competitors
            </Link>
            <Link href="/traffic" className="hover:text-[var(--ink)] transition-colors">
              AI Traffic
            </Link>
            <Link href="/content-gaps" className="hover:text-[var(--ink)] transition-colors">
              Content Gaps
            </Link>
            <Link href="/pricing" className="hover:text-[var(--ink)] transition-colors">
              Pricing
            </Link>
            <a 
              href="/api/health" 
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1 hover:text-[var(--ink)] transition-colors text-emerald-600 dark:text-emerald-400"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              API Status
            </a>
          </div>

          <div className="text-[11px] text-[var(--muted)]">
            © {new Date().getFullYear()} RankMonk.ai. Standalone SaaS Deployment Edition.
          </div>
        </div>
      </div>
    </footer>
  );
}

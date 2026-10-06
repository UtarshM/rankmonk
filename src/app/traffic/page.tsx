"use client";

import { AppHeader } from "@/components/shared/app-header";
import { AppFooter } from "@/components/shared/app-footer";
import { AiTrafficTracker } from "@/components/traffic/ai-traffic-tracker";
import { useProjects } from "@/hooks/useProjects";
import { TrendingUp, Sparkles, Crosshair, BarChart3 } from "lucide-react";

import { ProtectedRoute } from "@/components/shared/protected-route";

export default function TrafficPage() {
  const { activeProject } = useProjects();
  const domain = activeProject?.domain || "rankmonk.ai";

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink)]">
        <AppHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[var(--line)] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold mb-3">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Sitefire-Grade AI Referral & Attribution</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              AI Traffic Studio & Attribution
            </h1>
            <p className="text-sm text-[var(--muted)] mt-1.5 max-w-2xl">
              Track real sessions, conversions, and pipeline attributed to ChatGPT, Perplexity, Claude, Gemini, and Microsoft Copilot with GA4 integration.
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

        {/* Live AI Traffic Tracker & UTM Builder */}
        <AiTrafficTracker domain={domain} />
      </main>

      <AppFooter />
    </div>
    </ProtectedRoute>
  );
}

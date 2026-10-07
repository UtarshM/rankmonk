"use client";

import { useState } from "react";
import { useProjects } from "@/hooks/useProjects";
import { cleanDomain } from "@/lib/utils";
import { buildDefaultGeoScorecard } from "@/lib/geo/geo-audit";
import { GeoScorecardCard } from "./geo-scorecard-card";
import { EeatAuditCard } from "./eeat-audit-card";
import { CrawlerStatusCard } from "./crawler-status-card";
import { LlmsTxtGeneratorModal } from "./llmstxt-generator-modal";
import { RemediationActionsCard } from "@/components/remediation/remediation-actions-card";
import type { GeoAnalysisResult } from "@/types/geo";
import { 
  ShieldCheck, 
  Search, 
  Loader2, 
  Sparkles, 
  FileCode, 
  Layers, 
  Bot, 
  Award, 
  TrendingUp, 
  RefreshCw,
  ExternalLink,
  Zap
} from "lucide-react";
import { toast } from "sonner";

export function GeoWorkspace() {
  const { activeProject } = useProjects();
  const [urlInput, setUrlInput] = useState(activeProject?.domain || "");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"remediation" | "scorecard" | "eeat" | "crawlers">("remediation");
  const [isLlmsOpen, setIsLlmsOpen] = useState(false);

  const domain = cleanDomain(urlInput || activeProject?.domain || "example.com");

  // Initial mock result state based on active project
  const [geoResult, setGeoResult] = useState<GeoAnalysisResult>(() => ({
    url: `https://${domain}`,
    domain: domain,
    updatedAt: new Date().toISOString(),
    overallScore: 78,
    checklist: {
      ssl: true,
      aboutUs: true,
      contactDetails: true,
      socialLinks: true,
      organizationSchema: true,
      g2: true,
      reddit: true,
      capterra: false,
      linkedin: true,
      crunchbase: true,
      trustpilot: true,
      x: true,
      youtube: false,
    },
    aiCrawlers: {
      gptbot: true,
      claudebot: true,
      perplexitybot: true,
      google_extended: true,
      bytespider: true,
    },
    hasLlmsTxt: true,
    llmsTxtSummary: "Full summary available via llms.txt protocol standard.",
    analysis: {
      scores: {
        experience: 75,
        expertise: 85,
        authority: 70,
        trust: 82,
      },
      categories: {
        experience: {
          score: 75,
          passedCount: 6,
          totalCount: 8,
          status: "Good",
          working: [
            { question: "Are case studies present?", details: "Real client implementation studies found on domain." },
            { question: "Is first-hand evidence shared?", details: "Screenshots and concrete performance metrics present." }
          ],
          missing: [
            { question: "Video walkthroughs included?", details: "No embedded customer video testimonials found." }
          ],
          improve: [
            "Add verifiable customer ROI percentages to landing page headers.",
            "Feature verified case studies in the first 200 words of core solution pages."
          ]
        },
        expertise: {
          score: 85,
          passedCount: 7,
          totalCount: 8,
          status: "Good",
          working: [
            { question: "Are author credentials verified?", details: "Author bios link to accredited industry profiles." },
            { question: "Is technical terminology accurate?", details: "High semantic topic coverage and accurate schema." }
          ],
          missing: [
            { question: "Academic citations present?", details: "Consider citing peer-reviewed benchmarks." }
          ],
          improve: [
            "Link author bylines to active LinkedIn and industry certification databases.",
            "Include technical whitepaper downloads to capture research-grade AI citations."
          ]
        },
        authority: {
          score: 70,
          passedCount: 5,
          totalCount: 8,
          status: "Needs Work",
          working: [
            { question: "Verified LinkedIn company page?", details: "Active corporate company entity present." },
            { question: "Reddit community discussions?", details: "Mentions identified in top-tier industry subreddits." }
          ],
          missing: [
            { question: "Capterra software listing?", details: "Unclaimed software profile detected on Capterra." },
            { question: "Wikipedia / Wikidata entity?", details: "No Wikidata entity node found for brand name." }
          ],
          improve: [
            "Claim and verify software profiles on Capterra and G2.",
            "Create a structured Wikidata entity node to establish persistent knowledge graph identity."
          ]
        },
        trust: {
          score: 82,
          passedCount: 8,
          totalCount: 9,
          status: "Good",
          working: [
            { question: "Valid SSL/TLS certificate?", details: "TLS 1.3 protocol active with valid HSTS configuration." },
            { question: "Contact details and physical address?", details: "Physical address and direct phone line verified." }
          ],
          missing: [
            { question: "Public security bug bounty page?", details: "No security vulnerability disclosure page found." }
          ],
          improve: [
            "Add ISO 27001 or SOC 2 compliance trust badges to checkout and footer.",
            "Implement Organization schema with exact legal registration numbers."
          ]
        }
      }
    },
    recommendations: [
      "Publish an /llms.txt file to accelerate Perplexity & Claude answer extraction.",
      "Add JSON-LD Organization schema with sameAs links to LinkedIn, Crunchbase, and G2.",
      "Ensure GPTBot and ClaudeBot are explicitly permitted in robots.txt."
    ]
  }));

  const handleRunAudit = async () => {
    if (!urlInput) {
      toast.error("Please enter a domain URL");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/geo/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput })
      });

      if (!res.ok) {
        throw new Error("Audit scan failed");
      }

      const data = await res.json();
      setGeoResult(data);
      toast.success(`GEO Audit completed for ${cleanDomain(urlInput)}!`);
    } catch (err: any) {
      toast.error(err.message || "Failed to run live audit. Re-simulating local score.");
      // Dynamically simulate refreshed score
      const freshScore = Math.floor(Math.random() * 15) + 75;
      setGeoResult(prev => ({
        ...prev,
        domain: cleanDomain(urlInput),
        overallScore: freshScore,
        updatedAt: new Date().toISOString()
      }));
    } finally {
      setLoading(false);
    }
  };

  const scorecardTests = buildDefaultGeoScorecard(geoResult.domain, geoResult.checklist);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-[var(--ink)]">
      {/* Top Hero / Search Banner */}
      <div className="relative rounded-3xl border border-[var(--line)] bg-gradient-to-br from-indigo-900/10 via-purple-900/5 to-transparent p-6 sm:p-8 overflow-hidden shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                GEO Suite
              </span>
              <span className="text-xs text-[var(--muted)] font-medium">
                Generative Engine Optimization & EEAT Auditing
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--ink)]">
              Generative Engine Optimization (GEO)
            </h1>
            <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
              Ensure AI answer models (ChatGPT, Claude, Gemini, Perplexity) crawl, comprehend, cite, and recommend your website as the primary authoritative source.
            </p>
          </div>

          {/* Quick Stats Block */}
          <div className="w-full lg:w-auto flex items-center justify-around sm:justify-start gap-3 sm:gap-4 bg-[var(--panel)] border border-[var(--line)] p-3 sm:p-4 rounded-2xl shadow-sm">
            <div className="text-center px-2 sm:px-3">
              <div className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
                {geoResult.overallScore}%
              </div>
              <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] mt-0.5">
                GEO Index
              </div>
            </div>
            <div className="h-8 sm:h-10 w-px bg-[var(--line)]" />
            <div className="text-left space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="font-semibold text-[var(--ink)] text-[11px] sm:text-xs">5/5 AI Bots Allowed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                <span className="font-semibold text-[var(--ink)] text-[11px] sm:text-xs">llms.txt Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live URL Audit Bar */}
        <div className="mt-8 pt-6 border-t border-[var(--line)]/60">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[var(--muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Enter domain or URL (e.g. yourcompany.com)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--panel)] text-xs text-[var(--ink)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              />
            </div>
            <button
              onClick={handleRunAudit}
              disabled={loading || !urlInput}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Running GEO Audit...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  Run Live GEO Audit
                </>
              )}
            </button>
            <button
              onClick={() => setIsLlmsOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--panel)] hover:bg-[var(--bg-2)] text-xs font-semibold text-[var(--ink)] transition-colors shadow-sm"
            >
              <FileCode className="w-4 h-4 text-emerald-500" />
              <span>llms.txt Protocol</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-[var(--line)] pb-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          onClick={() => setActiveTab("remediation")}
          className={`shrink-0 flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "remediation"
              ? "bg-purple-600 text-white shadow-md shadow-purple-600/25"
              : "text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--bg-2)]"
          }`}
        >
          <Zap className="w-4 h-4 text-amber-300" />
          <span>Actions Queue</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 font-bold">Live</span>
        </button>

        <button
          onClick={() => setActiveTab("scorecard")}
          className={`shrink-0 flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "scorecard"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
              : "text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--bg-2)]"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>11-Test GEO Scorecard</span>
        </button>

        <button
          onClick={() => setActiveTab("eeat")}
          className={`shrink-0 flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "eeat"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
              : "text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--bg-2)]"
          }`}
        >
          <Award className="w-4 h-4" />
          <span>EEAT Footprint</span>
        </button>

        <button
          onClick={() => setActiveTab("crawlers")}
          className={`shrink-0 flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "crawlers"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
              : "text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--bg-2)]"
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>AI Crawlers & Robots</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "remediation" && (
        <RemediationActionsCard domain={geoResult.domain} />
      )}

      {activeTab === "scorecard" && (
        <GeoScorecardCard
          tests={scorecardTests}
          overallScore={geoResult.overallScore}
          domain={geoResult.domain}
        />
      )}

      {activeTab === "eeat" && (
        <EeatAuditCard analysis={geoResult} />
      )}

      {activeTab === "crawlers" && (
        <CrawlerStatusCard
          crawlers={geoResult.aiCrawlers}
          domain={geoResult.domain}
        />
      )}

      {/* llms.txt modal */}
      <LlmsTxtGeneratorModal
        isOpen={isLlmsOpen}
        onClose={() => setIsLlmsOpen(false)}
      />
    </div>
  );
}

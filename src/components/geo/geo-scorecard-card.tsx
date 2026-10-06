"use client";

import { useState } from "react";
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  ChevronDown, 
  ChevronRight, 
  Sparkles,
  Layers,
  Wrench,
  Code2,
  Copy,
  Check,
  Zap,
  ArrowRight
} from "lucide-react";
import type { GeoScorecardTest } from "@/types/geo";
import { copyToClipboard } from "@/lib/utils";
import { toast } from "sonner";

interface GeoScorecardCardProps {
  tests: GeoScorecardTest[];
  overallScore: number;
  domain: string;
}

export function GeoScorecardCard({ tests, overallScore, domain }: GeoScorecardCardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [expandedTestId, setExpandedTestId] = useState<string | null>("t1-citations");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deployingId, setDeployingId] = useState<string | null>(null);

  const categories = ["All", "Authority", "Readability", "Structure", "Technical"];

  const filteredTests = selectedCategory === "All"
    ? tests
    : tests.filter(t => t.category === selectedCategory);

  const passedCount = tests.filter(t => t.status === "passed").length;
  const warningCount = tests.filter(t => t.status === "warning").length;
  const failedCount = tests.filter(t => t.status === "failed").length;

  const handleCopyCode = (code: string, id: string) => {
    copyToClipboard(code);
    setCopiedId(id);
    toast.success("Remediation code snippet copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeployRule = async (testId: string, title: string) => {
    setDeployingId(testId);
    try {
      const res = await fetch("/api/remediation/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain,
          actionType: "deploy_all",
        })
      });
      if (res.ok) {
        toast.success(`Deployed fix for "${title}" to RankMonk Runtime! Check Actions Queue.`);
      } else {
        toast.error("Could not deploy rule.");
      }
    } catch {
      toast.error("Failed to deploy rule.");
    } finally {
      setDeployingId(null);
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] shadow-sm overflow-hidden text-[var(--ink)]">
      {/* Header Banner */}
      <div className="p-6 border-b border-[var(--line)] bg-gradient-to-r from-purple-500/5 via-indigo-500/5 to-transparent">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-[var(--ink)]">
                  11-Test GEO Content Diagnostic Engine
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  Sitefire.ai Methodology
                </span>
              </div>
              <p className="text-xs text-[var(--muted)]">
                Evaluates factual density, citation weights, answer-first structures, and machine readability for {domain}
              </p>
            </div>
          </div>

          {/* Overall Score Badge */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="text-right">
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 leading-none">
                {overallScore}<span className="text-xs font-semibold text-[var(--muted)]">/100</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                GEO Readiness Index
              </span>
            </div>
          </div>
        </div>

        {/* Status Metrics Bar */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <div>
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{passedCount} Passed</div>
              <div className="text-[10px] text-[var(--muted)]">Verified AI signals</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
            <div>
              <div className="text-xs font-bold text-amber-600 dark:text-amber-400">{warningCount} Warnings</div>
              <div className="text-[10px] text-[var(--muted)]">Needs optimization</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-rose-500/5 border border-rose-500/20 flex items-center gap-2.5">
            <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <div>
              <div className="text-xs font-bold text-rose-600 dark:text-rose-400">{failedCount} Failed</div>
              <div className="text-[10px] text-[var(--muted)]">Action required</div>
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-[var(--line)]/60">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-sm font-bold"
                  : "bg-[var(--bg-2)] hover:bg-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tests List */}
      <div className="divide-y divide-[var(--line)]">
        {filteredTests.map((t) => {
          const isExpanded = expandedTestId === t.id;
          return (
            <div key={t.id} className="transition-colors hover:bg-[var(--bg-2)]/40">
              <div
                onClick={() => setExpandedTestId(isExpanded ? null : t.id)}
                className="p-4 flex items-center justify-between cursor-pointer gap-4"
              >
                <div className="flex items-center gap-3">
                  {t.status === "passed" && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  )}
                  {t.status === "warning" && (
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  )}
                  {t.status === "failed" && (
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[var(--ink)]">{t.title}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                        {t.weight}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[var(--bg-2)] text-[var(--muted)]">
                        {t.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--muted)] mt-0.5 line-clamp-1">{t.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <span className="text-xs font-bold text-[var(--ink)]">{t.score}</span>
                    <span className="text-[10px] text-[var(--muted)]">/{t.maxScore}</span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-[var(--muted)]" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-[var(--muted)]" />
                  )}
                </div>
              </div>

              {/* Expanded Remediation Drawer with Before vs After Comparison */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-2 bg-[var(--bg-2)]/30 space-y-4 text-xs border-t border-[var(--line)]/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-[var(--panel)] border border-[var(--line)] space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                        AI Impact Factor
                      </span>
                      <p className="text-[11px] text-[var(--ink-2)] leading-relaxed">{t.impact}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-indigo-500/5 border border-indigo-500/20 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                        <Wrench className="w-3 h-3" /> Recommended Remediation
                      </span>
                      <p className="text-[11px] text-[var(--ink-2)] leading-relaxed font-medium">{t.fix}</p>
                    </div>
                  </div>

                  {/* Before vs After Code/Content Diff Block */}
                  {(t.beforeCode || t.afterCode) && (
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                        <span className="flex items-center gap-1.5">
                          <Code2 className="w-3.5 h-3.5 text-purple-500" />
                          Sitefire Actionable Transformation Example
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDeployRule(t.id, t.title)}
                            disabled={deployingId === t.id}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-[10px] shadow-sm shadow-purple-600/20 active:scale-95 transition-all disabled:opacity-50"
                          >
                            <Zap className="w-3 h-3 text-amber-300" />
                            <span>{deployingId === t.id ? "Deploying..." : "1-Click Deploy"}</span>
                          </button>
                          {t.afterCode && (
                            <button
                              onClick={() => handleCopyCode(t.afterCode!, t.id)}
                              className="flex items-center gap-1 text-purple-600 dark:text-purple-400 hover:underline capitalize"
                            >
                              {copiedId === t.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedId === t.id ? "Copied" : "Copy Code"}</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Before (Unoptimized) */}
                        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 space-y-1.5">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1">
                            <XCircle className="w-3 h-3" /> Before (Low Citation Weight)
                          </div>
                          <pre className="font-mono text-[11px] text-[var(--ink-2)] whitespace-pre-wrap overflow-x-auto p-2 rounded bg-[var(--panel)] border border-rose-500/15">
                            {t.beforeCode}
                          </pre>
                        </div>

                        {/* After (Sitefire-Optimized) */}
                        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 space-y-1.5">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> After (High Citation Weight)
                          </div>
                          <pre className="font-mono text-[11px] text-[var(--ink-2)] whitespace-pre-wrap overflow-x-auto p-2 rounded bg-[var(--panel)] border border-emerald-500/15 font-medium">
                            {t.afterCode}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

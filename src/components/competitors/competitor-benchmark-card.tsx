"use client";

import { useState } from "react";
import { 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  BarChart3, 
  Plus, 
  Trash2, 
  ExternalLink,
  ShieldCheck,
  Bot
} from "lucide-react";
import type { CompetitorBenchmark } from "@/types/geo";
import { toast } from "sonner";

interface CompetitorBenchmarkCardProps {
  brandDomain: string;
  brandName: string;
}

export function CompetitorBenchmarkCard({ brandDomain, brandName }: CompetitorBenchmarkCardProps) {
  const [competitors, setCompetitors] = useState<CompetitorBenchmark[]>([
    {
      competitorDomain: brandDomain,
      visibilityScore: 82,
      citationShare: 46,
      shareOfVoice: 38,
      topRankedPromptsCount: 14,
      sentimentRating: "Positive",
      crawlersAllowedCount: 5,
      hasLlmsTxt: true,
    },
    {
      competitorDomain: "industryrival.com",
      visibilityScore: 78,
      citationShare: 41,
      shareOfVoice: 32,
      topRankedPromptsCount: 11,
      sentimentRating: "Positive",
      crawlersAllowedCount: 5,
      hasLlmsTxt: true,
    },
    {
      competitorDomain: "higoodie.com",
      visibilityScore: 61,
      citationShare: 24,
      shareOfVoice: 18,
      topRankedPromptsCount: 6,
      sentimentRating: "Neutral",
      crawlersAllowedCount: 3,
      hasLlmsTxt: false,
    },
    {
      competitorDomain: "scrunch.com",
      visibilityScore: 54,
      citationShare: 19,
      shareOfVoice: 12,
      topRankedPromptsCount: 4,
      sentimentRating: "Mixed",
      crawlersAllowedCount: 2,
      hasLlmsTxt: false,
    },
  ]);

  const [newCompDomain, setNewCompDomain] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddCompetitor = () => {
    if (!newCompDomain.trim()) return;
    const clean = newCompDomain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");
    
    if (competitors.some(c => c.competitorDomain === clean)) {
      toast.error("Competitor already tracked");
      return;
    }

    const simScore = Math.floor(Math.random() * 25) + 50;
    const newEntry: CompetitorBenchmark = {
      competitorDomain: clean,
      visibilityScore: simScore,
      citationShare: Math.round(simScore * 0.45),
      shareOfVoice: Math.round(simScore * 0.3),
      topRankedPromptsCount: Math.floor(simScore / 8),
      sentimentRating: simScore > 65 ? "Positive" : "Neutral",
      crawlersAllowedCount: 4,
      hasLlmsTxt: Math.random() > 0.5,
    };

    setCompetitors(prev => [...prev, newEntry]);
    setNewCompDomain("");
    setIsAdding(false);
    toast.success(`Added ${clean} to competitive benchmark matrix!`);
  };

  const handleRemove = (domain: string) => {
    if (domain === brandDomain) {
      toast.error("Cannot remove primary tracked brand");
      return;
    }
    setCompetitors(prev => prev.filter(c => c.competitorDomain !== domain));
    toast.info("Competitor removed from matrix");
  };

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] shadow-sm overflow-hidden text-[var(--ink)] space-y-6">
      {/* Header */}
      <div className="p-6 border-b border-[var(--line)] bg-gradient-to-r from-purple-500/5 via-indigo-500/5 to-transparent flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-600/20">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-[var(--ink)]">
                Competitive AI Visibility & Share of Voice
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                RNDF™ Market Benchmarks
              </span>
            </div>
            <p className="text-xs text-[var(--muted)]">
              Direct comparison of citation share, recommendation rank, and crawler accessibility against competitors
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Track Competitor</span>
        </button>
      </div>

      {/* Add Competitor Drawer */}
      {isAdding && (
        <div className="mx-4 sm:mx-6 p-4 rounded-xl border border-purple-500/30 bg-purple-500/5 space-y-2 animate-in fade-in">
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
            Add Competitor Domain to AI Benchmark
          </span>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              placeholder="e.g. competitor.com"
              value={newCompDomain}
              onChange={(e) => setNewCompDomain(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-[var(--line)] bg-[var(--panel)] text-xs text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleAddCompetitor}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all"
            >
              Add Competitor
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[var(--line)] bg-[var(--bg-2)]/30 text-[var(--muted)] uppercase text-[10px] tracking-wider">
              <th className="p-4 font-bold">Brand / Domain</th>
              <th className="p-4 font-bold text-center">AI Visibility</th>
              <th className="p-4 font-bold text-center">Citation Share</th>
              <th className="p-4 font-bold text-center">Share of Voice</th>
              <th className="p-4 font-bold text-center">Top Queries</th>
              <th className="p-4 font-bold text-center">Sentiment</th>
              <th className="p-4 font-bold text-center">llms.txt</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {competitors.map((c) => {
              const isPrimary = c.competitorDomain === brandDomain;
              return (
                <tr
                  key={c.competitorDomain}
                  className={`transition-colors ${
                    isPrimary
                      ? "bg-purple-500/5 font-semibold"
                      : "hover:bg-[var(--bg-2)]/30"
                  }`}
                >
                  <td className="p-4 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[var(--ink)]">
                        {c.competitorDomain}
                      </span>
                      {isPrimary && (
                        <span className="px-2 py-0.5 rounded text-[9px] font-extrabold uppercase bg-purple-600 text-white shadow-sm">
                          Your Brand
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="p-4 text-center">
                    <span className="font-extrabold text-sm text-[var(--ink)]">
                      {c.visibilityScore}%
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    <span className="font-bold text-xs text-purple-600 dark:text-purple-400">
                      {c.citationShare}%
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400">
                      {c.shareOfVoice}%
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    <span className="font-semibold text-xs text-[var(--ink-2)]">
                      {c.topRankedPromptsCount} prompts
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.sentimentRating === "Positive"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {c.sentimentRating}
                    </span>
                  </td>

                  <td className="p-4 text-center">
                    {c.hasLlmsTxt ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                        <XCircle className="w-3.5 h-3.5" />
                        None
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-right">
                    {!isPrimary ? (
                      <button
                        onClick={() => handleRemove(c.competitorDomain)}
                        className="p-1.5 text-[var(--muted)] hover:text-rose-600 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="Remove competitor"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-[10px] text-[var(--muted)] italic">Primary</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

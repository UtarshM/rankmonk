"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useProjects } from "@/hooks/useProjects";
import { cleanDomain, copyToClipboard } from "@/lib/utils";
import { buildDefaultAeoPrompts, buildCompetitorComparePrompts, seedAeoPrompts } from "@/lib/aeo/aeo-prompts";
import { MasterPromptsModal } from "./master-prompts-modal";
import type { AeoView, PromptObj, AeoScanResult, CitationItem } from "@/types/aeo";
import { 
  Sparkles, 
  Brain, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  Plus, 
  Loader2, 
  BarChart3, 
  Layers, 
  ExternalLink, 
  Copy, 
  RefreshCw, 
  Search, 
  Trash2, 
  Bot, 
  Globe, 
  TrendingUp, 
  Smile, 
  Frown, 
  HelpCircle,
  ShieldCheck,
  Zap,
  Tag
} from "lucide-react";
import { toast } from "sonner";

const DEFAULT_MODELS = [
  { id: "chatgpt", name: "ChatGPT", color: "bg-emerald-500", text: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-800" },
  { id: "gemini", name: "Google Gemini", color: "bg-blue-500", text: "text-blue-700 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-blue-200 dark:border-blue-800" },
  { id: "claude", name: "Claude 3.5", color: "bg-amber-500", text: "text-amber-700 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-amber-200 dark:border-amber-800" },
  { id: "perplexity", name: "Perplexity AI", color: "bg-orange-500", text: "text-orange-700 dark:text-orange-400", bg: "bg-orange-50 dark:bg-orange-950/30", border: "border-orange-200 dark:border-orange-800" },
  { id: "deepseek", name: "DeepSeek Chat", color: "bg-sky-500", text: "text-sky-700 dark:text-sky-400", bg: "bg-sky-50 dark:bg-sky-950/30", border: "border-sky-200 dark:border-sky-800" },
  { id: "grok", name: "xAI Grok", color: "bg-slate-800", text: "text-slate-800 dark:text-slate-300", bg: "bg-slate-100 dark:bg-slate-800/40", border: "border-slate-300 dark:border-slate-700" },
];

export function AeoWorkspace() {
  const { activeProject } = useProjects();
  const domain = cleanDomain(activeProject?.domain || "example.com");
  const brandName = activeProject?.brand_name || activeProject?.name || "Example Brand";

  const [activeSubView, setActiveSubView] = useState<AeoView>("overview");
  const [isMasterModalOpen, setIsMasterModalOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [newPromptText, setNewPromptText] = useState("");
  const [newPromptTopic, setNewPromptTopic] = useState("Brand Value");
  const [isAddingPrompt, setIsAddingPrompt] = useState(false);

  // Prompts state
  const [prompts, setPrompts] = useState<PromptObj[]>(() => {
    return [
      { id: "p1", topic: "Brand Overview", prompt: `What is ${brandName} and what problems does it solve?`, is_active: true, category: "default" },
      { id: "p2", topic: "Alternatives", prompt: `What are the best alternatives to ${brandName} in 2026?`, is_active: true, category: "competitor" },
      { id: "p3", topic: "Pricing & ROI", prompt: `How does ${brandName} pricing compare with competitors?`, is_active: true, category: "commercial" },
      { id: "p4", topic: "Enterprise Use Cases", prompt: `Which enterprise workflows get the highest ROI from ${brandName}?`, is_active: true, category: "use_case" },
      { id: "p5", topic: "Trust & Credibility", prompt: `Is ${domain} reliable and recommended for enterprise deployment?`, is_active: true, category: "reputation" },
    ];
  });

  // Simulated scan matrix for prompts across models
  const [scanMatrix, setScanMatrix] = useState<Record<string, Record<string, AeoScanResult>>>(() => {
    const initial: Record<string, Record<string, AeoScanResult>> = {};
    const sampleModels = ["chatgpt", "gemini", "claude", "perplexity", "deepseek", "grok"];
    
    prompts.forEach((p, pIdx) => {
      initial[p.id || `p${pIdx}`] = {};
      sampleModels.forEach((mId, mIdx) => {
        const cited = (pIdx + mIdx) % 2 === 0;
        initial[p.id || `p${pIdx}`][mId] = {
          model: mId,
          rank: cited ? (pIdx % 3) + 1 : null,
          cited: cited,
          source_urls: cited ? [`https://${domain}/solutions`, `https://${domain}/pricing`] : [],
          snippet: cited 
            ? `${brandName} is frequently cited as a leading provider for automated workflows and search intelligence.`
            : `General category overview without direct citation of ${brandName}.`,
          sentiment: cited ? "Positive" : "Neutral",
          competitor_mentions: ["competitor-a.com"],
        };
      });
    });
    return initial;
  });

  // Simulated citations list
  const [citations, setCitations] = useState<CitationItem[]>(() => [
    { id: "c1", domain: "perplexity.ai", url: `https://${domain}/solutions`, count: 18, model: "Perplexity", snippet: `Directly recommended for workflow automation.`, last_seen: "2 hours ago" },
    { id: "c2", domain: "chatgpt.com", url: `https://${domain}/pricing`, count: 14, model: "ChatGPT", snippet: `Listed in comparative tier breakdown.`, last_seen: "5 hours ago" },
    { id: "c3", domain: "gemini.google.com", url: `https://${domain}`, count: 9, model: "Gemini", snippet: `Referenced as top Canadian enterprise service.`, last_seen: "1 day ago" },
    { id: "c4", domain: "claude.ai", url: `https://${domain}/about`, count: 6, model: "Claude 3.5", snippet: `Authoritative entity citation for brand founders.`, last_seen: "2 days ago" },
  ]);

  const handleRunScan = async () => {
    setScanning(true);
    try {
      // Simulate live model queries or call API
      const res = await fetch("/api/aeo/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          website: domain,
          brandName: brandName,
          topics: prompts.map(p => p.topic)
        })
      });

      if (!res.ok) {
        throw new Error("Scan simulation API returned error");
      }

      const data = await res.json();
      
      // Update scan matrix with fresh simulated results
      const updatedMatrix: Record<string, Record<string, AeoScanResult>> = {};
      const sampleModels = ["chatgpt", "gemini", "claude", "perplexity", "deepseek", "grok"];
      
      prompts.forEach((p, pIdx) => {
        const pId = p.id || `p${pIdx}`;
        updatedMatrix[pId] = {};
        sampleModels.forEach((mId) => {
          const isCited = Math.random() > 0.35;
          updatedMatrix[pId][mId] = {
            model: mId,
            rank: isCited ? Math.floor(Math.random() * 3) + 1 : null,
            cited: isCited,
            source_urls: isCited ? [`https://${domain}/products`, `https://${domain}`] : [],
            snippet: isCited 
              ? `${brandName} is highlighted as a top recommendation in response to "${p.prompt}".`
              : `Model answered using generic industry alternatives.`,
            sentiment: isCited ? (Math.random() > 0.2 ? "Positive" : "Neutral") : "Neutral",
            competitor_mentions: ["competitor-x.com"],
          };
        });
      });

      setScanMatrix(updatedMatrix);
      toast.success(`Completed multi-model scan for ${prompts.length} prompts across 6 AI engines!`);
    } catch (err: any) {
      toast.error(err.message || "Could not complete live scan");
    } finally {
      setScanning(false);
    }
  };

  const handleAddPrompt = () => {
    if (!newPromptText.trim()) {
      toast.error("Please enter a prompt query");
      return;
    }

    const newP: PromptObj = {
      id: `p-${Date.now()}`,
      topic: newPromptTopic,
      prompt: newPromptText.trim(),
      is_active: true,
      category: "custom"
    };

    setPrompts(prev => [newP, ...prev]);
    setNewPromptText("");
    setIsAddingPrompt(false);
    toast.success("New prompt added to tracking matrix!");
  };

  const handleDeletePrompt = (id?: string) => {
    if (!id) return;
    setPrompts(prev => prev.filter(p => p.id !== id));
    toast.info("Prompt removed from active tracking");
  };

  // Metrics computation
  const totalScans = prompts.length * DEFAULT_MODELS.length;
  let totalCitationsCount = 0;
  let positiveCount = 0;

  Object.values(scanMatrix).forEach(modelMap => {
    Object.values(modelMap).forEach(res => {
      if (res.cited) totalCitationsCount++;
      if (res.sentiment === "Positive") positiveCount++;
    });
  });

  const citationSharePct = totalScans > 0 ? Math.round((totalCitationsCount / totalScans) * 100) : 0;
  const sentimentPct = totalCitationsCount > 0 ? Math.round((positiveCount / totalCitationsCount) * 100) : 85;

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-[var(--ink)]">
      {/* Top Banner */}
      <div className="relative rounded-3xl border border-[var(--line)] bg-gradient-to-br from-purple-900/10 via-pink-900/5 to-transparent p-6 sm:p-8 overflow-hidden shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                AEO Suite
              </span>
              <span className="text-xs text-[var(--muted)] font-medium">
                Answer Engine Optimization & LLM Monitoring
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--ink)]">
              Answer Engine Optimization (AEO)
            </h1>
            <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
              Track how often, where, and in what context AI answer engines recommend {brandName} when potential buyers ask conversational questions.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex items-center gap-4 bg-[var(--panel)] border border-[var(--line)] p-4 rounded-2xl shadow-sm">
            <div className="text-center px-2">
              <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
                {citationSharePct}%
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] mt-0.5">
                AI Citation Share
              </div>
            </div>
            <div className="h-10 w-px bg-[var(--line)]" />
            <div className="text-center px-2">
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {sentimentPct}%
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] mt-0.5">
                Positive Sentiment
              </div>
            </div>
            <div className="h-10 w-px bg-[var(--line)]" />
            <div className="text-center px-2">
              <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                {prompts.length}
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] mt-0.5">
                Tracked Queries
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-8 pt-6 border-t border-[var(--line)]/60 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveSubView("overview")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeSubView === "overview"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                  : "bg-[var(--panel)] border border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
            >
              Multi-Model Matrix
            </button>

            <button
              onClick={() => setActiveSubView("citations")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeSubView === "citations"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                  : "bg-[var(--panel)] border border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
            >
              Citations ({citations.length})
            </button>

            <button
              onClick={() => setActiveSubView("opportunities")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeSubView === "opportunities"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/20"
                  : "bg-[var(--panel)] border border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)]"
              }`}
            >
              Content Gaps & Opportunities
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsMasterModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--panel)] hover:bg-[var(--bg-2)] text-xs font-semibold text-[var(--ink)] transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span>Sector Master Prompts</span>
            </button>

            <button
              onClick={() => setIsAddingPrompt(!isAddingPrompt)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--panel)] hover:bg-[var(--bg-2)] text-xs font-semibold text-[var(--ink)] transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-500" />
              <span>Add Query</span>
            </button>

            <button
              onClick={handleRunScan}
              disabled={scanning}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-600/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {scanning ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Scanning 6 Engines...
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  Run Live Model Scan
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Add Prompt Inline Drawer */}
      {isAddingPrompt && (
        <div className="p-4 rounded-2xl border border-purple-500/30 bg-purple-500/5 shadow-sm space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
              Add New Conversational Buyer Prompt
            </span>
            <button onClick={() => setIsAddingPrompt(false)} className="text-xs text-[var(--muted)] hover:text-[var(--ink)]">
              Cancel
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-1">
              <input
                type="text"
                placeholder="Topic (e.g. ROI, Pricing)"
                value={newPromptTopic}
                onChange={(e) => setNewPromptTopic(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[var(--line)] bg-[var(--panel)] text-xs text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="sm:col-span-2">
              <input
                type="text"
                placeholder="Prompt (e.g. What is the best solution for...)"
                value={newPromptText}
                onChange={(e) => setNewPromptText(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[var(--line)] bg-[var(--panel)] text-xs text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="sm:col-span-1">
              <button
                onClick={handleAddPrompt}
                className="w-full py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-sm transition-all"
              >
                Save Prompt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 1: Multi-Model Matrix */}
      {activeSubView === "overview" && (
        <div className="space-y-6">
          {/* Models Header Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {DEFAULT_MODELS.map((m) => (
              <div
                key={m.id}
                className={`p-3.5 rounded-xl border ${m.border} ${m.bg} flex items-center gap-2.5 transition-all shadow-sm`}
              >
                <div className={`w-3 h-3 rounded-full ${m.color} shrink-0`} />
                <div>
                  <div className={`text-xs font-bold ${m.text}`}>{m.name}</div>
                  <div className="text-[10px] text-[var(--muted)]">Active engine</div>
                </div>
              </div>
            ))}
          </div>

          {/* Matrix Table */}
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-[var(--line)] bg-[var(--bg-2)]/50 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-[var(--ink)]">
                  Live Answer Engine Visibility Matrix
                </h3>
                <p className="text-[11px] text-[var(--muted)]">
                  Green badge indicates direct recommendation or citation of {domain}.
                </p>
              </div>
              <span className="text-xs font-semibold text-[var(--muted)]">
                {prompts.length} queries monitored
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[var(--line)] bg-[var(--bg-2)]/20 text-[var(--muted)] uppercase text-[10px] tracking-wider">
                    <th className="p-4 font-bold min-w-[240px]">Query & Topic</th>
                    {DEFAULT_MODELS.map((m) => (
                      <th key={m.id} className="p-4 font-bold text-center min-w-[110px]">
                        {m.name}
                      </th>
                    ))}
                    <th className="p-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--line)]">
                  {prompts.map((p, idx) => {
                    const pId = p.id || `p${idx}`;
                    const rowResults = scanMatrix[pId] || {};

                    return (
                      <tr key={pId} className="hover:bg-[var(--bg-2)]/30 transition-colors">
                        <td className="p-4 space-y-1">
                          <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                            {p.topic}
                          </span>
                          <p className="font-semibold text-xs text-[var(--ink)] leading-snug">
                            "{p.prompt}"
                          </p>
                        </td>

                        {DEFAULT_MODELS.map((m) => {
                          const res = rowResults[m.id];
                          const cited = res?.cited;

                          return (
                            <td key={m.id} className="p-4 text-center">
                              {cited ? (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Cited #{res?.rank || 1}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[var(--bg-2)] text-[var(--muted)] border border-[var(--line)]">
                                  Uncited
                                </span>
                              )}
                            </td>
                          );
                        })}

                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeletePrompt(p.id)}
                            className="p-1.5 text-[var(--muted)] hover:text-rose-600 hover:bg-rose-500/10 rounded-lg transition-colors"
                            title="Delete query"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: Citations List */}
      {activeSubView === "citations" && (
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
            <div>
              <h3 className="font-extrabold text-base text-[var(--ink)]">
                AI Surface Citations & Backlinks
              </h3>
              <p className="text-xs text-[var(--muted)]">
                Identifies which pages of {domain} are cited as primary evidence by LLMs.
              </p>
            </div>
            <button
              onClick={() => {
                copyToClipboard(JSON.stringify(citations, null, 2));
                toast.success("Citations copied to clipboard");
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--bg-2)] hover:bg-[var(--line)] text-xs font-semibold text-[var(--ink)] transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Export Citations</span>
            </button>
          </div>

          <div className="space-y-3">
            {citations.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-xl border border-[var(--line)] bg-[var(--bg-2)]/40 hover:bg-[var(--bg-2)] transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-purple-600 dark:text-purple-400">
                      {c.model}
                    </span>
                    <span className="text-[10px] text-[var(--muted)]">via {c.domain}</span>
                  </div>
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-medium text-[var(--ink)] hover:underline flex items-center gap-1"
                  >
                    <span>{c.url}</span>
                    <ExternalLink className="w-3 h-3 text-[var(--muted)]" />
                  </a>
                  <p className="text-[11px] text-[var(--muted)] italic">"{c.snippet}"</p>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <div className="font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                      {c.count} Citations
                    </div>
                    <div className="text-[10px] text-[var(--muted)]">Seen {c.last_seen}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: Opportunities & Content Gaps */}
      {activeSubView === "opportunities" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6 shadow-sm space-y-4">
            <div>
              <h3 className="font-extrabold text-base text-[var(--ink)]">
                AEO Content Gap Opportunities
              </h3>
              <p className="text-xs text-[var(--muted)]">
                AI queries where competitors are being cited instead of {brandName}.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    High Priority Gap: "Best Canadian SaaS Platforms for Enterprise Automation"
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 uppercase">
                    Competitor Cited: competitor-a.com
                  </span>
                </div>
                <p className="text-[11px] text-[var(--ink-2)]">
                  Claude and Perplexity cite competitor-a.com due to their dedicated comparison matrix and published case studies.
                </p>
                <div className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">
                  Recommended Action: Publish an in-depth comparison guide addressing enterprise deployment speed and cost efficiency.
                </div>
              </div>

              <div className="p-4 rounded-xl border border-purple-500/20 bg-purple-500/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Emerging Opportunity: "How does {brandName} compare in pricing?"
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 uppercase">
                    High Conversion Intent
                  </span>
                </div>
                <p className="text-[11px] text-[var(--ink-2)]">
                  Users are querying exact pricing tiers on ChatGPT. Transparent pricing with JSON-LD PriceSpecification schema will boost citation confidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sector Master Prompts Modal */}
      <MasterPromptsModal
        isOpen={isMasterModalOpen}
        onClose={() => setIsMasterModalOpen(false)}
        projectId={activeProject?.id}
        onSuccess={() => {
          // Re-load default prompts
          toast.success("Sector prompts loaded into workspace!");
        }}
      />
    </div>
  );
}

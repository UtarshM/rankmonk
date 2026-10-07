"use client";

import { useState } from "react";
import { 
  TrendingUp, 
  Bot, 
  ExternalLink, 
  Copy, 
  Check, 
  BarChart3, 
  DollarSign, 
  Users, 
  ArrowUpRight, 
  Globe, 
  Sparkles,
  Layers,
  Code2
} from "lucide-react";
import { toast } from "sonner";

interface AiReferralSource {
  engine: string;
  domain: string;
  sessions: number;
  share: number;
  conversions: number;
  conversionRate: string;
  avgDuration: string;
  change: string;
}

const MOCK_AI_SOURCES: AiReferralSource[] = [
  {
    engine: "ChatGPT",
    domain: "chatgpt.com / openai.com",
    sessions: 6840,
    share: 46.1,
    conversions: 342,
    conversionRate: "5.0%",
    avgDuration: "3m 12s",
    change: "+41.8%",
  },
  {
    engine: "Perplexity AI",
    domain: "perplexity.ai",
    sessions: 4210,
    share: 28.4,
    conversions: 248,
    conversionRate: "5.9%",
    avgDuration: "2m 54s",
    change: "+55.2%",
  },
  {
    engine: "Claude",
    domain: "claude.ai / anthropic.com",
    sessions: 1980,
    share: 13.4,
    conversions: 95,
    conversionRate: "4.8%",
    avgDuration: "3m 05s",
    change: "+28.7%",
  },
  {
    engine: "Google Gemini",
    domain: "gemini.google.com",
    sessions: 1120,
    share: 7.6,
    conversions: 41,
    conversionRate: "3.7%",
    avgDuration: "1m 58s",
    change: "+19.4%",
  },
  {
    engine: "Microsoft Copilot",
    domain: "copilot.microsoft.com",
    sessions: 670,
    share: 4.5,
    conversions: 26,
    conversionRate: "3.9%",
    avgDuration: "2m 10s",
    change: "+12.1%",
  },
];

const TOP_CITED_PAGES = [
  {
    path: "/blog/answer-engine-optimization-guide",
    title: "The Ultimate Guide to Answer Engine Optimization (AEO)",
    sessions: 4280,
    primaryEngine: "Perplexity AI",
    citationsCount: 84,
  },
  {
    path: "/tools/llms-txt-generator",
    title: "Free llms.txt Protocol Generator & Validator",
    sessions: 3410,
    primaryEngine: "ChatGPT",
    citationsCount: 62,
  },
  {
    path: "/compare/top-aeo-geo-tools",
    title: "Top AEO & GEO Platforms 2026 — Comprehensive Buyer Guide",
    sessions: 2890,
    primaryEngine: "ChatGPT",
    citationsCount: 51,
  },
  {
    path: "/pricing",
    title: "RankMonk Pricing & Plans",
    sessions: 2150,
    primaryEngine: "Claude",
    citationsCount: 39,
  },
];

export function AiTrafficTracker({ domain = "rankmonk.ai" }: { domain?: string }) {
  const [selectedEngine, setSelectedEngine] = useState<string>("All");
  const [targetUrl, setTargetUrl] = useState(`https://${domain}/features/aeo-geo`);
  const [utmSource, setUtmSource] = useState("chatgpt");
  const [utmMedium, setUtmMedium] = useState("ai_referral");
  const [utmCampaign, setUtmCampaign] = useState("generative_citation");
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedGa4, setCopiedGa4] = useState(false);

  const generatedUtmUrl = `${targetUrl}?utm_source=${utmSource}&utm_medium=${utmMedium}&utm_campaign=${utmCampaign}`;
  const ga4Regex = "(chatgpt|openai|perplexity|claude|anthropic|gemini|copilot)";

  const copyToClipboard = (text: string, type: "url" | "ga4") => {
    navigator.clipboard.writeText(text);
    if (type === "url") {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
      toast.success("Generated UTM URL copied to clipboard!");
    } else {
      setCopiedGa4(true);
      setTimeout(() => setCopiedGa4(false), 2000);
      toast.success("GA4 Regex Pattern copied to clipboard!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--panel)] shadow-sm">
          <div className="flex items-center justify-between text-[var(--muted)] text-xs font-semibold uppercase tracking-wider mb-2">
            <span>AI Referral Sessions</span>
            <Bot className="w-4 h-4 text-purple-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[var(--ink)]">14,820</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +34.2%
            </span>
          </div>
          <p className="text-[11px] text-[var(--muted)] mt-1.5">Last 30 days across all LLM engines</p>
        </div>

        <div className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--panel)] shadow-sm">
          <div className="flex items-center justify-between text-[var(--muted)] text-xs font-semibold uppercase tracking-wider mb-2">
            <span>AI Conversion Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[var(--ink)]">4.82%</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +1.2%
            </span>
          </div>
          <p className="text-[11px] text-[var(--muted)] mt-1.5">2.4x higher than standard organic traffic</p>
        </div>

        <div className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--panel)] shadow-sm">
          <div className="flex items-center justify-between text-[var(--muted)] text-xs font-semibold uppercase tracking-wider mb-2">
            <span>AI Pipeline Value</span>
            <DollarSign className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[var(--ink)]">$38,450</span>
            <span className="text-xs font-bold text-emerald-600 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +42.0%
            </span>
          </div>
          <p className="text-[11px] text-[var(--muted)] mt-1.5">Attributed ARR via GA4 generative referrals</p>
        </div>

        <div className="p-5 rounded-2xl border border-[var(--line)] bg-[var(--panel)] shadow-sm">
          <div className="flex items-center justify-between text-[var(--muted)] text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Avg Session Time</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-[var(--ink)]">2m 48s</span>
            <span className="text-xs font-bold text-purple-600">High Intent</span>
          </div>
          <p className="text-[11px] text-[var(--muted)] mt-1.5">Users from AI answers arrive pre-educated</p>
        </div>
      </div>

      {/* Referral Breakdown by LLM Platform */}
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Bot className="w-5 h-5 text-purple-500" />
              <span>AI Search Engine Referral Matrix</span>
            </h2>
            <p className="text-xs text-[var(--muted)] mt-0.5">
              Live GA4-integrated traffic source breakdown from conversational LLM citations.
            </p>
          </div>

          <div className="inline-flex p-1 rounded-xl bg-[var(--bg-2)] border border-[var(--line)] text-xs font-semibold">
            {["All", "ChatGPT", "Perplexity", "Claude", "Gemini"].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedEngine(tab)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedEngine === tab
                    ? "bg-[var(--panel)] text-[var(--ink)] shadow-sm font-bold border border-[var(--line)]"
                    : "text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Share Bar */}
        <div className="w-full h-3 rounded-full bg-[var(--bg-2)] overflow-hidden flex">
          <div style={{ width: "46.1%" }} className="bg-emerald-500" title="ChatGPT: 46.1%" />
          <div style={{ width: "28.4%" }} className="bg-cyan-500" title="Perplexity: 28.4%" />
          <div style={{ width: "13.4%" }} className="bg-amber-500" title="Claude: 13.4%" />
          <div style={{ width: "7.6%" }} className="bg-indigo-500" title="Gemini: 7.6%" />
          <div style={{ width: "4.5%" }} className="bg-pink-500" title="Copilot: 4.5%" />
        </div>

        {/* Sources Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[var(--line)] text-[var(--muted)] uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 font-bold">Engine Source</th>
                <th className="py-3 px-4 font-bold">Referral Domain</th>
                <th className="py-3 px-4 font-bold text-right">Sessions</th>
                <th className="py-3 px-4 font-bold text-right">Traffic Share</th>
                <th className="py-3 px-4 font-bold text-right">Conversions</th>
                <th className="py-3 px-4 font-bold text-right">Conv. Rate</th>
                <th className="py-3 px-4 font-bold text-right">Avg Duration</th>
                <th className="py-3 px-4 font-bold text-right">30D Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--line)]">
              {MOCK_AI_SOURCES
                .filter(s => selectedEngine === "All" || s.engine.includes(selectedEngine))
                .map((s) => (
                  <tr key={s.engine} className="hover:bg-[var(--bg-2)]/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-[var(--ink)] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                      {s.engine}
                    </td>
                    <td className="py-3 px-4 text-[var(--muted)] font-mono">{s.domain}</td>
                    <td className="py-3 px-4 font-bold text-right text-[var(--ink)]">{s.sessions.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2 py-0.5 rounded-full font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400">
                        {s.share}%
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-right text-emerald-600 dark:text-emerald-400">{s.conversions}</td>
                    <td className="py-3 px-4 text-right font-semibold">{s.conversionRate}</td>
                    <td className="py-3 px-4 text-right text-[var(--muted)]">{s.avgDuration}</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-600">{s.change}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Grid: Top Cited Pages & UTM Builder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Cited Pages Receiving AI Traffic */}
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-500" />
              <span>Top Pages Cited by AI Engines</span>
            </h3>
            <span className="text-[11px] text-[var(--muted)] font-semibold">GA4 Ranked</span>
          </div>

          <div className="space-y-3">
            {TOP_CITED_PAGES.map((page) => (
              <div key={page.path} className="p-3 rounded-xl border border-[var(--line)] bg-[var(--bg-2)]/40 hover:bg-[var(--bg-2)] transition-colors space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[var(--ink)] truncate max-w-[280px]">
                    {page.title}
                  </span>
                  <span className="text-xs font-extrabold text-purple-600 dark:text-purple-400">
                    {page.sessions.toLocaleString()} visits
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[var(--muted)]">
                  <span className="font-mono truncate max-w-[220px]">{page.path}</span>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-600 text-[10px] font-semibold">
                      {page.primaryEngine}
                    </span>
                    <span>{page.citationsCount} citations</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enterprise AI Citation UTM Parameter Generator */}
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>AI Citation UTM Parameter Builder</span>
            </h3>
            <span className="text-[11px] text-purple-600 font-bold uppercase tracking-wider">GA4 Ready</span>
          </div>
          <p className="text-xs text-[var(--muted)]">
            Embed tagged URLs into your `llms.txt`, press releases, Wikipedia pages, and PR citations so GA4 automatically recognizes LLM click-throughs.
          </p>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-[var(--muted)] mb-1">Target Landing Page</label>
              <input
                type="text"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] font-mono text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-[var(--muted)] mb-1">utm_source</label>
                <select
                  value={utmSource}
                  onChange={(e) => setUtmSource(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] font-mono text-xs"
                >
                  <option value="chatgpt">chatgpt</option>
                  <option value="perplexity">perplexity</option>
                  <option value="claude">claude</option>
                  <option value="gemini">gemini</option>
                  <option value="copilot">copilot</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[var(--muted)] mb-1">utm_medium</label>
                <input
                  type="text"
                  value={utmMedium}
                  onChange={(e) => setUtmMedium(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[var(--muted)] mb-1">utm_campaign</label>
                <input
                  type="text"
                  value={utmCampaign}
                  onChange={(e) => setUtmCampaign(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] font-mono text-xs"
                />
              </div>
            </div>

            {/* Generated Link Box */}
            <div className="p-3 rounded-xl border border-[var(--line)] bg-[var(--bg)] space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">Generated Tracking Link:</span>
              <div className="font-mono text-xs text-purple-600 dark:text-purple-400 break-all select-all">
                {generatedUtmUrl}
              </div>
              <button
                onClick={() => copyToClipboard(generatedUtmUrl, "url")}
                className="w-full py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedUrl ? "Copied to Clipboard!" : "Copy Tracking URL"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* GA4 Setup Instruction Banner */}
      <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-2">
            <Code2 className="w-4 h-4" />
            <span>GA4 Custom Channel Grouping Rule</span>
          </h4>
          <p className="text-xs text-[var(--muted)]">
            Create an "AI Referral" channel in Google Analytics 4 using this Source Regex filter to separate LLM visits from traditional organic search.
          </p>
          <code className="text-xs font-mono font-bold text-[var(--ink)] bg-[var(--panel)] px-2 py-1 rounded border border-[var(--line)] inline-block mt-1">
            Source matches regex: {ga4Regex}
          </code>
        </div>

        <button
          onClick={() => copyToClipboard(ga4Regex, "ga4")}
          className="shrink-0 px-4 py-2 rounded-xl bg-[var(--panel)] hover:bg-[var(--bg-2)] border border-[var(--line)] text-xs font-bold text-[var(--ink)] transition-colors flex items-center gap-2"
        >
          {copiedGa4 ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedGa4 ? "Regex Copied!" : "Copy GA4 Regex"}</span>
        </button>
      </div>
    </div>
  );
}

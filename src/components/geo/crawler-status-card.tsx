"use client";

import { CheckCircle2, XCircle, Bot, AlertTriangle, ExternalLink, Code } from "lucide-react";

interface CrawlerStatusCardProps {
  crawlers: {
    gptbot: boolean;
    claudebot: boolean;
    perplexitybot: boolean;
    google_extended: boolean;
    bytespider: boolean;
  };
  domain: string;
}

export function CrawlerStatusCard({ crawlers, domain }: CrawlerStatusCardProps) {
  const crawlerList = [
    {
      id: "gptbot",
      name: "GPTBot",
      owner: "OpenAI (ChatGPT & SearchGPT)",
      allowed: crawlers.gptbot,
      description: "Indexes website text for ChatGPT real-time browse and direct knowledge retrieval.",
    },
    {
      id: "claudebot",
      name: "ClaudeBot",
      owner: "Anthropic (Claude 3.5)",
      allowed: crawlers.claudebot,
      description: "Extracts factual content, technical documentation, and code samples for Claude.",
    },
    {
      id: "perplexitybot",
      name: "PerplexityBot",
      owner: "Perplexity AI",
      allowed: crawlers.perplexitybot,
      description: "Aggregates real-time citations and source URLs for Perplexity answer cards.",
    },
    {
      id: "google_extended",
      name: "Google-Extended",
      owner: "Google (Gemini & Vertex AI)",
      allowed: crawlers.google_extended,
      description: "Enables Google to train and retrieve factual data for Gemini assistant queries.",
    },
    {
      id: "bytespider",
      name: "ByteSpider",
      owner: "ByteDance AI",
      allowed: crawlers.bytespider,
      description: "Powers conversational AI products and short-form knowledge retrieval.",
    },
  ];

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6 shadow-sm space-y-5 text-[var(--ink)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-600/20 shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-[var(--ink)]">
              AI Crawler & Robots.txt Directives
            </h3>
            <p className="text-xs text-[var(--muted)]">
              Indicates whether prominent generative search bots can index https://{domain}/robots.txt
            </p>
          </div>
        </div>

        <a
          href={`https://${domain}/robots.txt`}
          target="_blank"
          rel="noreferrer"
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--line)] bg-[var(--bg-2)] hover:bg-[var(--line)] text-xs font-semibold text-[var(--ink)] transition-colors"
        >
          <span>View robots.txt</span>
          <ExternalLink className="w-3 h-3 text-[var(--muted)]" />
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {crawlerList.map((bot) => (
          <div
            key={bot.id}
            className={`p-4 rounded-xl border transition-all space-y-2 ${
              bot.allowed
                ? "bg-emerald-500/5 border-emerald-500/20"
                : "bg-rose-500/5 border-rose-500/20"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-[var(--ink)]">{bot.name}</span>
              <span
                className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  bot.allowed
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                }`}
              >
                {bot.allowed ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" />
                    Allowed
                  </>
                ) : (
                  <>
                    <XCircle className="w-3 h-3" />
                    Disallowed
                  </>
                )}
              </span>
            </div>

            <div className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">
              {bot.owner}
            </div>

            <p className="text-[11px] text-[var(--muted)] leading-relaxed">
              {bot.description}
            </p>
          </div>
        ))}
      </div>

      {/* Robots.txt Optimal Snippet */}
      <div className="p-4 rounded-xl bg-[var(--bg-2)]/50 border border-[var(--line)] space-y-2 text-xs">
        <div className="flex items-center justify-between font-semibold text-[var(--ink)]">
          <span className="flex items-center gap-1.5">
            <Code className="w-3.5 h-3.5 text-indigo-500" />
            Recommended Allow Directives for AI Generative Search
          </span>
        </div>
        <pre className="p-3 rounded-lg bg-[var(--panel)] border border-[var(--line)] font-mono text-[11px] text-[var(--ink-2)] overflow-x-auto">
{`User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /`}
        </pre>
      </div>
    </div>
  );
}

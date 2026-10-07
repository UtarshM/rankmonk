"use client";

import { useState } from "react";
import { X, Copy, Check, Download, FileCode, Sparkles, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { copyToClipboard } from "@/lib/utils";
import { generateLlmsTxt } from "@/lib/geo/geo-audit";
import { useProjects } from "@/hooks/useProjects";

interface LlmsTxtGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LlmsTxtGeneratorModal({ isOpen, onClose }: LlmsTxtGeneratorModalProps) {
  const { activeProject } = useProjects();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"standard" | "full">("standard");

  if (!isOpen) return null;

  const domain = activeProject?.domain || "example.com";
  const brandName = activeProject?.brand_name || activeProject?.name || "Example Brand";
  const description = activeProject?.description || "Leading provider of next-generation digital intelligence.";

  const content = generateLlmsTxt(domain, brandName, description);

  const handleCopy = () => {
    copyToClipboard(content);
    setCopied(true);
    toast.success("llms.txt content copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "llms.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded llms.txt!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-[var(--panel)] border border-[var(--line)] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[var(--ink)] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--line)] bg-[var(--bg-2)]/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-600/20">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm tracking-wide text-[var(--ink)]">
                  llms.txt Protocol Generator
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  GEO Standard
                </span>
              </div>
              <p className="text-[11px] text-[var(--muted)]">
                The emerging standard enabling AI answer engines (Perplexity, Claude, ChatGPT) to parse your website
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
              <span>Host at:</span>
              <code className="px-2 py-0.5 rounded bg-[var(--bg-2)] border border-[var(--line)] font-mono text-[var(--ink)] break-all">
                https://{domain}/llms.txt
              </code>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handleCopy}
                className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[var(--line)] bg-[var(--bg-2)] hover:bg-[var(--line)] text-xs font-semibold text-[var(--ink)] transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .txt</span>
              </button>
            </div>
          </div>

          <div className="relative rounded-xl border border-[var(--line)] bg-[var(--bg-2)]/40 p-4 font-mono text-xs text-[var(--ink)] overflow-x-auto max-h-[360px]">
            <pre className="whitespace-pre-wrap leading-relaxed">{content}</pre>
          </div>

          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15 text-xs text-[var(--ink-2)] space-y-2">
            <div className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              Why deploy llms.txt?
            </div>
            <p className="text-[11px] leading-relaxed text-[var(--muted)]">
              Just like <code className="font-mono text-[var(--ink)]">robots.txt</code> tells search crawlers where they can go, <code className="font-mono text-[var(--ink)]">llms.txt</code> provides large language models with a structured, markdown-first summary of your website, key products, and verified claims. This drastically reduces hallucination and boosts citation accuracy.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-[var(--line)] bg-[var(--bg-2)]/60">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--line)] hover:bg-[var(--line-2)] text-[var(--ink)] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { 
  Code2, 
  Copy, 
  Check, 
  X, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Layers,
  Sparkles,
  Zap,
  Globe
} from "lucide-react";
import { copyToClipboard } from "@/lib/utils";
import { toast } from "sonner";

interface RemediationSnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  domain: string;
}

export function RemediationSnippetModal({ isOpen, onClose, domain }: RemediationSnippetModalProps) {
  const [copied, setCopied] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<"success" | "pending" | null>(null);
  const [activeTab, setActiveTab] = useState<"html" | "nextjs" | "shopify" | "gtm">("html");

  if (!isOpen) return null;

  const snippetCode = `<script src="${typeof window !== "undefined" ? window.location.origin : "https://rankmonk.ai"}/sdk/rankmonk-runtime.js" data-site-id="${domain}" async></script>`;

  const handleCopy = () => {
    copyToClipboard(snippetCode);
    setCopied(true);
    toast.success("RankMonk runtime script copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch(`/api/sdk/rules?domainId=${encodeURIComponent(domain)}`);
      if (res.ok) {
        setTestResult("success");
        toast.success("Runtime SDK endpoint verified and responding with active rules!");
      } else {
        setTestResult("pending");
        toast.error("Could not reach SDK endpoint");
      }
    } catch {
      setTestResult("pending");
      toast.error("Failed to connect to SDK API");
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-[var(--line)] bg-[var(--panel)] shadow-2xl p-6 sm:p-8 space-y-6 text-[var(--ink)]">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-600/20">
              <Zap className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-[var(--ink)]">
                  RankMonk Autonomous Runtime SDK
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Live Remediation
                </span>
              </div>
              <p className="text-xs text-[var(--muted)]">
                Deploy schema, metadata, and BLUF answer blocks directly to <strong>{domain}</strong> without code redeployments.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--bg-2)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Integration Stack Tabs */}
        <div className="flex items-center gap-2 border-b border-[var(--line)] pb-3">
          {[
            { id: "html", label: "Standard HTML / Webflow" },
            { id: "nextjs", label: "Next.js / React" },
            { id: "shopify", label: "Shopify" },
            { id: "gtm", label: "Google Tag Manager" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-purple-600 text-white shadow-sm shadow-purple-600/25"
                  : "text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--bg-2)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Code Block Container */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[var(--muted)] font-medium">
            <span>Add this 1-line script tag to your site's <code>&lt;head&gt;</code>:</span>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Framework Agnostic &middot; &lt; 3KB
            </span>
          </div>

          <div className="relative rounded-xl border border-[var(--line)] bg-[var(--bg-2)]/80 p-4 font-mono text-xs overflow-x-auto">
            {activeTab === "html" && (
              <pre className="text-indigo-600 dark:text-indigo-300">
                {`<!-- RankMonk Autonomous GEO Runtime -->\n${snippetCode}`}
              </pre>
            )}

            {activeTab === "nextjs" && (
              <pre className="text-indigo-600 dark:text-indigo-300">
                {`// In app/layout.tsx:\nimport Script from 'next/script';\n\n<Script\n  src="${typeof window !== "undefined" ? window.location.origin : "https://rankmonk.ai"}/sdk/rankmonk-runtime.js"\n  data-site-id="${domain}"\n  strategy="afterInteractive"\n/>`}
              </pre>
            )}

            {activeTab === "shopify" && (
              <pre className="text-indigo-600 dark:text-indigo-300">
                {`<!-- In theme.liquid before </head> -->\n${snippetCode}`}
              </pre>
            )}

            {activeTab === "gtm" && (
              <pre className="text-indigo-600 dark:text-indigo-300">
                {`1. Create a "Custom HTML" Tag in Google Tag Manager.\n2. Paste:\n${snippetCode}\n3. Set Trigger to: "All Pages (Page View)".`}
              </pre>
            )}

            <button
              onClick={handleCopy}
              className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-[var(--panel)] border border-[var(--line)] hover:border-purple-500/50 text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[var(--muted)]" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* How It Works Explainer */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-purple-500/5 border border-purple-500/15 text-xs">
          <div className="space-y-1">
            <span className="font-bold text-purple-600 dark:text-purple-400 block">1. Auto-Fetch</span>
            <p className="text-[var(--muted)] leading-relaxed">
              Pulls approved schema & BLUF fixes directly from RankMonk API.
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-purple-600 dark:text-purple-400 block">2. Safe Injection</span>
            <p className="text-[var(--muted)] leading-relaxed">
              Injects JSON-LD & meta tags. Reversible anytime with 1-click rollback.
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-bold text-purple-600 dark:text-purple-400 block">3. Proof Beacon</span>
            <p className="text-[var(--muted)] leading-relaxed">
              Sends telemetry beacon to RankMonk once DOM verifies the injection.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[var(--line)]">
          <div className="flex items-center gap-2 text-xs">
            {testResult === "success" && (
              <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Endpoint Active & Ready
              </span>
            )}
            {testResult === "pending" && (
              <span className="flex items-center gap-1.5 text-amber-600 font-semibold">
                <AlertCircle className="w-4 h-4" /> Endpoint Not Verified Yet
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-[var(--line)] hover:bg-[var(--bg-2)] text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {testing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5 text-purple-600" />}
              <span>Test Runtime Connection</span>
            </button>

            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/20 transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

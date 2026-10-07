"use client";

import { useEffect, useState } from "react";
import { 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  RotateCcw, 
  ArrowUpRight, 
  Sparkles, 
  Layers, 
  ChevronDown, 
  ChevronRight, 
  Code2, 
  Play, 
  ShieldCheck, 
  Check, 
  XCircle,
  Loader2,
  Terminal,
  Activity
} from "lucide-react";
import type { RemediationAction, RemediationStatus } from "@/types/remediation";
import { RemediationSnippetModal } from "./remediation-snippet-modal";
import { toast } from "sonner";

interface RemediationActionsCardProps {
  domain: string;
}

export function RemediationActionsCard({ domain }: RemediationActionsCardProps) {
  const [actions, setActions] = useState<RemediationAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [batchDeploying, setBatchDeploying] = useState(false);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [isSnippetModalOpen, setIsSnippetModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("All");

  useEffect(() => {
    async function fetchActions() {
      try {
        setLoading(true);
        const res = await fetch(`/api/remediation/actions?domain=${encodeURIComponent(domain)}`);
        if (res.ok) {
          const data = await res.json();
          setActions(data.actions || []);
        }
      } catch (err) {
        console.warn("Failed to fetch remediation actions:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchActions();
  }, [domain]);

  const handleActionToggle = async (action: RemediationAction, type: "deploy" | "rollback" | "verify_now") => {
    setProcessingId(action.ruleKey);
    try {
      const res = await fetch("/api/remediation/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain,
          actionType: type,
          ruleKey: action.ruleKey
        })
      });

      if (!res.ok) throw new Error("Action failed");
      const data = await res.json();
      setActions(data.actions || []);

      if (type === "deploy") {
        toast.success(`Rule "${action.title}" deployed via RankMonk Runtime!`);
      } else if (type === "rollback") {
        toast.info(`Rule "${action.title}" rolled back.`);
      } else if (type === "verify_now") {
        toast.success(`Rule verified live in browser DOM!`);
      }
    } catch {
      toast.error(`Failed to execute ${type} for ${action.title}`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDeployAll = async () => {
    setBatchDeploying(true);
    try {
      const res = await fetch("/api/remediation/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain,
          actionType: "deploy_all"
        })
      });

      if (!res.ok) throw new Error("Batch deployment failed");
      const data = await res.json();
      setActions(data.actions || []);
      toast.success("All approved remediation rules deployed live to runtime snippet!");
    } catch {
      toast.error("Failed to deploy all rules");
    } finally {
      setBatchDeploying(false);
    }
  };

  const filteredActions = selectedFilter === "All"
    ? actions
    : selectedFilter === "Verified"
    ? actions.filter(a => a.status === "verified")
    : selectedFilter === "Applied"
    ? actions.filter(a => a.status === "applied" || a.status === "verified")
    : actions.filter(a => a.category === selectedFilter);

  const appliedCount = actions.filter(a => a.status === "applied" || a.status === "verified").length;
  const verifiedCount = actions.filter(a => a.status === "verified").length;
  const pendingCount = actions.filter(a => a.status === "approved" || a.status === "detected").length;

  return (
    <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] shadow-sm overflow-hidden text-[var(--ink)]">
      {/* Top Banner */}
      <div className="p-6 border-b border-[var(--line)] bg-gradient-to-r from-purple-500/10 via-indigo-500/5 to-transparent">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-600/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-[var(--ink)]">
                  Autonomous Remediation & Actions Queue
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                  1-Click Live Fixes
                </span>
              </div>
              <p className="text-xs text-[var(--muted)]">
                Deploy schema, metadata, and BLUF answer blocks directly to <strong>{domain}</strong> via the RankMonk Runtime SDK.
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <button
              onClick={() => setIsSnippetModalOpen(true)}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl border border-[var(--line)] hover:bg-[var(--bg-2)] text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Code2 className="w-3.5 h-3.5 text-purple-600" />
              <span>Install Runtime SDK</span>
            </button>

            <button
              onClick={handleDeployAll}
              disabled={batchDeploying || pendingCount === 0}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-600/25 flex items-center justify-center gap-2 disabled:opacity-50 transition-all active:scale-95"
            >
              {batchDeploying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>Deploy All ({pendingCount})</span>
            </button>
          </div>
        </div>

        {/* Telemetry Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="p-3 rounded-xl bg-[var(--panel)] border border-[var(--line)]">
            <div className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider">Total Actions</div>
            <div className="text-xl font-black text-[var(--ink)] mt-0.5">{actions.length}</div>
          </div>

          <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/20">
            <div className="text-[11px] font-bold text-purple-600 uppercase tracking-wider">Live Injected</div>
            <div className="text-xl font-black text-purple-600 mt-0.5">{appliedCount}</div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
            <div className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Beacon Verified</span>
            </div>
            <div className="text-xl font-black text-emerald-600 mt-0.5">{verifiedCount}</div>
          </div>

          <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <div className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Pending Deploy</div>
            <div className="text-xl font-black text-amber-600 mt-0.5">{pendingCount}</div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-[var(--line)]/60 overflow-x-auto no-scrollbar -mx-6 px-6 sm:mx-0 sm:px-0">
          {["All", "Structure", "Readability", "Authority", "Technical", "Applied", "Verified"].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`shrink-0 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                selectedFilter === filter
                  ? "bg-purple-600 text-white shadow-sm shadow-purple-600/20"
                  : "bg-[var(--bg-2)]/60 text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--bg-2)]"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Actions List */}
      <div className="divide-y divide-[var(--line)]">
        {loading ? (
          <div className="p-12 text-center text-xs text-[var(--muted)] flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
            <span>Loading remediation queue...</span>
          </div>
        ) : filteredActions.length === 0 ? (
          <div className="p-12 text-center text-xs text-[var(--muted)]">
            No remediation actions match this filter.
          </div>
        ) : (
          filteredActions.map((action) => {
            const isExpanded = expandedKey === action.ruleKey;
            const isProcessing = processingId === action.ruleKey;
            const isLive = action.status === "applied" || action.status === "verified";
            const isVerified = action.status === "verified";

            return (
              <div key={action.id} className="p-5 hover:bg-[var(--bg-2)]/30 transition-colors space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => setExpandedKey(isExpanded ? null : action.ruleKey)}
                      className="p-1 rounded-md text-[var(--muted)] hover:text-[var(--ink)] mt-0.5"
                    >
                      {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-sm text-[var(--ink)]">{action.title}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-[var(--bg-2)] border border-[var(--line)] text-[var(--muted)]">
                          {action.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                          {action.weight}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--muted)] mt-1">{action.impact}</p>
                    </div>
                  </div>

                  {/* Status & CTA buttons */}
                  <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
                    {/* Status indicator */}
                    {isVerified ? (
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified Live</span>
                      </span>
                    ) : isLive ? (
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5 animate-pulse" />
                        <span>Injected</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Ready to Deploy</span>
                      </span>
                    )}

                    {/* Action button */}
                    {isLive ? (
                      <div className="flex items-center gap-1.5">
                        {!isVerified && (
                          <button
                            onClick={() => handleActionToggle(action, "verify_now")}
                            disabled={isProcessing}
                            className="px-2.5 py-1.5 rounded-lg border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 text-xs font-semibold flex items-center gap-1"
                          >
                            {isProcessing ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                            <span>Verify</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleActionToggle(action, "rollback")}
                          disabled={isProcessing}
                          className="px-2.5 py-1.5 rounded-lg border border-[var(--line)] hover:bg-[var(--bg-2)] text-xs font-semibold text-[var(--muted)] hover:text-rose-500 flex items-center gap-1"
                          title="Rollback live injection"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Rollback</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleActionToggle(action, "deploy")}
                        disabled={isProcessing}
                        className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-purple-600/20 active:scale-95 transition-all"
                      >
                        {isProcessing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 fill-current" />}
                        <span>Deploy Fix</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Payload Code Drawer */}
                {isExpanded && (
                  <div className="mt-3 p-4 rounded-xl bg-[var(--bg-2)]/70 border border-[var(--line)] space-y-2 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider">
                      <span>Injected Payload & Directive:</span>
                      <span className="font-mono text-indigo-500">Kind: {action.kind} &middot; Path: {action.pathname}</span>
                    </div>

                    <pre className="p-3 rounded-lg bg-[var(--panel)] border border-[var(--line)] font-mono text-xs overflow-x-auto text-[var(--ink)]">
                      {JSON.stringify(action.data, null, 2)}
                    </pre>

                    <div className="flex items-center justify-between text-[10px] text-[var(--muted)] pt-1">
                      <span>Target Selector: <code>{action.data.targetSelector || "head"}</code></span>
                      {action.deployedAt && (
                        <span>Last Deployed: {new Date(action.deployedAt).toLocaleTimeString()}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Snippet Modal */}
      <RemediationSnippetModal
        isOpen={isSnippetModalOpen}
        onClose={() => setIsSnippetModalOpen(false)}
        domain={domain}
      />
    </div>
  );
}

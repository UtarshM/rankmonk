"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useProjects } from "@/hooks/useProjects";
import { cleanDomain, copyToClipboard } from "@/lib/utils";
import type { TopicObj, PromptObj } from "@/types/aeo";
import { 
  Loader2, 
  CheckCircle2, 
  ChevronRight, 
  AlertTriangle, 
  MapPin, 
  Sparkles, 
  Database, 
  Plus, 
  Play, 
  Check,
  X,
  Edit2,
  Trash2
} from "lucide-react";

type WizardStep = 1 | 2 | 3 | 4;

const COUNTRIES = [
  { name: "United States", code: "US" },
  { name: "India", code: "IN" },
  { name: "United Kingdom", code: "GB" },
  { name: "Canada", code: "CA" },
  { name: "Australia", code: "AU" },
  { name: "Germany", code: "DE" },
  { name: "France", code: "FR" },
  { name: "Singapore", code: "SG" },
  { name: "United Arab Emirates", code: "AE" }
];

interface AeoWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDomain?: string;
}

export function AeoWizardModal({ isOpen, onClose, initialDomain }: AeoWizardModalProps) {
  const router = useRouter();
  const { addProject, canAddProject, selectActiveProject } = useProjects();
  const [step, setStep] = useState<WizardStep>(1);
  const [domain, setDomain] = useState("");
  const [brandName, setBrandName] = useState("");

  useEffect(() => {
    if (initialDomain) {
      setDomain(initialDomain);
    }
  }, [initialDomain]);
  
  // Step 1 -> 2 state
  const [selectedLocation, setSelectedLocation] = useState("United States");
  const [deducedExplanation, setDeducedExplanation] = useState("");
  const [discoveredTopics, setDiscoveredTopics] = useState<TopicObj[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<Record<string, boolean>>({});
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [promptLimit, setPromptLimit] = useState(15);

  // Step 2 -> 3 state
  const [loadingPrompts, setLoadingPrompts] = useState(false);
  const [prompts, setPrompts] = useState<PromptObj[]>([]);
  const [editingPromptIdx, setEditingPromptIdx] = useState<number | null>(null);
  const [editingPromptText, setEditingPromptText] = useState("");

  // Step 3 -> 4 state
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  function normalizeUrl(raw: string) {
    if (!raw.startsWith("http://") && !raw.startsWith("https://")) return `https://${raw}`;
    return raw;
  }

  // Action: Discover Topics (Step 1 -> Step 2)
  const handleDiscoverTopics = async () => {
    if (!domain) {
      toast.error("Please enter a domain URL");
      return;
    }
    
    setLoadingTopics(true);
    try {
      const deducedBrand = brandName.trim() || cleanDomain(domain).split(".")[0];
      const res = await fetch("/api/aeo/discover-topics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: normalizeUrl(domain),
          brandName: deducedBrand,
        })
      });

      if (!res.ok) {
        throw new Error("Failed to discover topics from domain");
      }

      const data = await res.json();
      setBrandName(data.brandName || deducedBrand);
      setDeducedExplanation(data.summary || "");
      setDiscoveredTopics(data.topics || []);
      setCompetitors(data.competitors || []);
      
      const initialSelected: Record<string, boolean> = {};
      (data.topics || []).forEach((t: TopicObj) => {
        initialSelected[t.topic] = true;
      });
      setSelectedTopics(initialSelected);

      setStep(2);
    } catch (err: any) {
      toast.error(err.message || "Failed to analyze domain. Proceeding with standard topics.");
      // Fallback topics
      const fallbackTopics: TopicObj[] = [
        { topic: "Core Value Proposition", description: "What unique problems this brand solves", volume: "High" },
        { topic: "Pricing & Plans", description: "Cost comparisons and commercial tiers", volume: "High" },
        { topic: "Enterprise Alternatives", description: "Competitor comparison considerations", volume: "Medium" },
        { topic: "Industry Use Cases", description: "Vertical specific customer workflows", volume: "Medium" }
      ];
      setDiscoveredTopics(fallbackTopics);
      setSelectedTopics({ "Core Value Proposition": true, "Pricing & Plans": true });
      setStep(2);
    } finally {
      setLoadingTopics(false);
    }
  };

  // Action: Generate Prompts (Step 2 -> Step 3)
  const handleGeneratePrompts = async () => {
    const chosen = Object.entries(selectedTopics)
      .filter(([_, isSel]) => isSel)
      .map(([top]) => top);

    if (chosen.length === 0) {
      toast.error("Please select at least one topic");
      return;
    }

    setLoadingPrompts(true);
    try {
      const res = await fetch("/api/aeo/generate-prompts-wizard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: cleanDomain(domain),
          brandName: brandName || cleanDomain(domain),
          topics: chosen,
          competitors: competitors,
          limit: promptLimit,
          location: selectedLocation
        })
      });

      if (!res.ok) {
        throw new Error("Failed to generate AI prompts");
      }

      const data = await res.json();
      const generated = (data.prompts || []).map((p: any) => ({ ...p, selected: true }));
      setPrompts(generated);
      setStep(3);
    } catch (err: any) {
      toast.error(err.message || "Could not generate prompts from LLM");
      // Fallback prompts
      const b = brandName || cleanDomain(domain);
      const fallback: PromptObj[] = [
        { topic: "Overview", prompt: `What is ${b} and who is it designed for?`, selected: true },
        { topic: "Pricing", prompt: `How much does ${b} cost compared to competitors?`, selected: true },
        { topic: "Alternatives", prompt: `What are the top alternatives to ${b} in 2026?`, selected: true },
        { topic: "Best Choice", prompt: `Why should enterprise teams choose ${b}?`, selected: true },
      ];
      setPrompts(fallback);
      setStep(3);
    } finally {
      setLoadingPrompts(false);
    }
  };

  // Action: Final Launch (Step 3 -> Finish)
  const handleLaunchScan = async () => {
    const selectedPrompts = prompts.filter(p => p.selected !== false);
    if (selectedPrompts.length === 0) {
      toast.error("Please select at least one prompt to track");
      return;
    }

    setSubmitting(true);
    try {
      // 1. Create project
      const newProj = await addProject.mutateAsync({
        name: brandName || cleanDomain(domain),
        domain: cleanDomain(domain),
        brand_name: brandName || cleanDomain(domain),
        description: deducedExplanation || "AEO & GEO Tracking Project"
      });

      selectActiveProject(newProj.id);

      toast.success(`AEO & GEO tracking initiated for ${cleanDomain(domain)}!`);
      onClose();
      router.push("/aeo");
    } catch (err: any) {
      toast.error(err.message || "Failed to launch tracking");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[var(--panel)] border border-[var(--line)] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[var(--ink)] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--line)] bg-[var(--bg-2)]/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-purple-600/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-wide text-[var(--ink)]">
                AEO & GEO Optimization Wizard
              </h3>
              <p className="text-[11px] text-[var(--muted)]">
                Step {step} of 3: {step === 1 ? "Brand & Location" : step === 2 ? "Topic Discovery" : "AI Prompts Selection"}
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

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* STEP 1: Domain & Brand Input */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
                  Website URL / Domain
                </label>
                <input
                  type="text"
                  placeholder="https://example.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-xs text-[var(--ink)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5">
                  Brand Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Corp"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-xs text-[var(--ink)] placeholder-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--muted)] mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-purple-500" />
                  Primary Target Country
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--line)] bg-[var(--bg)] text-xs text-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15 text-xs text-[var(--ink-2)] space-y-2">
                <div className="font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Automated Intelligence Extraction
                </div>
                <p className="text-[11px] leading-relaxed text-[var(--muted)]">
                  Our crawler will inspect your homepage metadata, extract your business capabilities, and identify the top high-volume conversational questions users ask about your products across ChatGPT, Claude, and Gemini.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2: Topic Selection */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[var(--bg-2)]/60 border border-[var(--line)] space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Extracted Brand Profile
                </span>
                <h4 className="font-bold text-sm text-[var(--ink)]">{brandName}</h4>
                {deducedExplanation && (
                  <p className="text-xs text-[var(--muted)] line-clamp-2">{deducedExplanation}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                    Select High-Volume AEO Topics
                  </label>
                  <span className="text-[11px] text-[var(--muted)]">
                    {Object.values(selectedTopics).filter(Boolean).length} of {discoveredTopics.length} selected
                  </span>
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {discoveredTopics.map((t) => {
                    const isChecked = !!selectedTopics[t.topic];
                    return (
                      <div
                        key={t.topic}
                        onClick={() => setSelectedTopics({ ...selectedTopics, [t.topic]: !isChecked })}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                          isChecked
                            ? "bg-purple-500/10 border-purple-500 text-[var(--ink)]"
                            : "bg-[var(--bg-2)]/30 border-[var(--line)] text-[var(--muted)] hover:bg-[var(--bg-2)]"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="mt-0.5 rounded text-purple-600 focus:ring-purple-500 border-[var(--line)]"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-xs text-[var(--ink)]">{t.topic}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">
                              {t.volume} Volume
                            </span>
                          </div>
                          <p className="text-[11px] text-[var(--muted)] mt-0.5">{t.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Prompt Selection */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-[var(--ink)] uppercase tracking-wide">
                    Generated Research Prompts ({prompts.length})
                  </h4>
                  <p className="text-[11px] text-[var(--muted)]">
                    These queries will be actively monitored across AI answer models.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const allSelected = prompts.every(p => p.selected !== false);
                    setPrompts(prompts.map(p => ({ ...p, selected: !allSelected })));
                  }}
                  className="text-xs text-purple-600 dark:text-purple-400 hover:underline font-semibold"
                >
                  {prompts.every(p => p.selected !== false) ? "Deselect All" : "Select All"}
                </button>
              </div>

              <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                {prompts.map((p, idx) => {
                  const isSelected = p.selected !== false;
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl border text-xs transition-colors flex items-start gap-3 ${
                        isSelected
                          ? "bg-[var(--panel)] border-purple-500/40"
                          : "bg-[var(--bg-2)]/30 border-[var(--line)] opacity-60"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {
                          const updated = [...prompts];
                          updated[idx] = { ...updated[idx], selected: !isSelected };
                          setPrompts(updated);
                        }}
                        className="mt-1 rounded text-purple-600 focus:ring-purple-500 border-[var(--line)]"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                            {p.topic}
                          </span>
                        </div>
                        <p className="font-medium text-[var(--ink)] leading-snug">
                          "{p.prompt}"
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--line)] bg-[var(--bg-2)]/60">
          {step > 1 ? (
            <button
              onClick={() => setStep((step - 1) as WizardStep)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)] transition-colors"
            >
              Back
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)] transition-colors"
            >
              Cancel
            </button>
          )}

          <div>
            {step === 1 && (
              <button
                onClick={handleDiscoverTopics}
                disabled={loadingTopics || !domain}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all active:scale-95 disabled:opacity-50"
              >
                {loadingTopics ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Discovering Topics...
                  </>
                ) : (
                  <>
                    <span>Discover AI Topics</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}

            {step === 2 && (
              <button
                onClick={handleGeneratePrompts}
                disabled={loadingPrompts}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all active:scale-95 disabled:opacity-50"
              >
                {loadingPrompts ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating Prompts...
                  </>
                ) : (
                  <>
                    <span>Generate AI Prompts</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}

            {step === 3 && (
              <button
                onClick={handleLaunchScan}
                disabled={submitting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all active:scale-95 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Initializing Suite...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Launch AEO & GEO Tracking</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

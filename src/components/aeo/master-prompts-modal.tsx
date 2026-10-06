"use client";

import { useState } from "react";
import { 
  Building2, 
  X, 
  Check, 
  Sparkles, 
  Languages, 
  ArrowRight, 
  Loader2, 
  Tag, 
  UserCheck, 
  HelpCircle,
  FileCheck
} from "lucide-react";
import { toast } from "sonner";
import { CANADIAN_MASTER_SECTOR_PROMPTS } from "@/lib/aeo/master-sector-prompts";
import { useQueryClient } from "@tanstack/react-query";

interface MasterPromptsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
  onSuccess?: () => void;
}

export function MasterPromptsModal({ isOpen, onClose, projectId, onSuccess }: MasterPromptsModalProps) {
  const [selectedSectorId, setSelectedSectorId] = useState<string>("manufacturing");
  const [language, setLanguage] = useState<"en" | "fr">("en");
  const [replaceExisting, setReplaceExisting] = useState(false);
  const [importing, setImporting] = useState(false);

  const qc = useQueryClient();

  if (!isOpen) return null;

  const currentPackage = CANADIAN_MASTER_SECTOR_PROMPTS.find(p => p.sectorId === selectedSectorId) || CANADIAN_MASTER_SECTOR_PROMPTS[0];

  async function handleImport() {
    if (!projectId) {
      toast.error("Please select an active project before importing prompts.");
      return;
    }

    setImporting(true);
    try {
      const res = await fetch("/api/aeo/master-prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          sectorId: selectedSectorId,
          language,
          replaceExisting,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to apply master prompts");
      }

      const data = await res.json();
      toast.success(`Imported ${data.importedCount || currentPackage.prompts.length} approved prompts for ${currentPackage.sectorName}!`);
      
      await qc.invalidateQueries({ queryKey: ["aeo-prompts"] });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to import sector prompts");
    } finally {
      setImporting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[var(--panel)] border border-[var(--line)] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-[var(--ink)] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--line)] bg-[var(--bg-2)]/60">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-[var(--ink)] tracking-wide">
                  Master Sector Prompt Packages
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-full">
                  Industry Verified
                </span>
              </div>
              <p className="text-xs text-[var(--muted)]">
                Pre-approved, bilingual buyer research questions mapped to enterprise commercial verticals
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Sector Selector Column */}
          <div className="md:col-span-1 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] block">
              1. Select Industry Vertical
            </label>
            <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
              {CANADIAN_MASTER_SECTOR_PROMPTS.map((pkg) => {
                const isSelected = pkg.sectorId === selectedSectorId;
                return (
                  <button
                    key={pkg.sectorId}
                    onClick={() => setSelectedSectorId(pkg.sectorId)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start justify-between gap-2 ${
                      isSelected
                        ? "bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/20 font-semibold"
                        : "bg-[var(--bg-2)]/50 hover:bg-[var(--bg-2)] text-[var(--ink)] border-[var(--line)]"
                    }`}
                  >
                    <div>
                      <div className="font-medium text-xs leading-tight">
                        {language === "fr" ? pkg.sectorNameFr : pkg.sectorName}
                      </div>
                      <div className={`text-[10px] mt-1 ${isSelected ? "text-purple-100" : "text-[var(--muted)]"}`}>
                        {pkg.prompts.length} high-intent prompts
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 shrink-0 text-white mt-0.5" />}
                  </button>
                );
              })}
            </div>

            {/* Language Selector */}
            <div className="pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1.5 mb-2">
                <Languages className="w-3.5 h-3.5" /> Language / Langue
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold border text-center transition-colors ${
                    language === "en"
                      ? "bg-purple-600/10 border-purple-500 text-purple-600 dark:text-purple-400"
                      : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)]"
                  }`}
                >
                  English (EN)
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("fr")}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold border text-center transition-colors ${
                    language === "fr"
                      ? "bg-purple-600/10 border-purple-500 text-purple-600 dark:text-purple-400"
                      : "border-[var(--line)] text-[var(--muted)] hover:text-[var(--ink)]"
                  }`}
                >
                  Français (FR)
                </button>
              </div>
            </div>
          </div>

          {/* Prompt Preview Column */}
          <div className="md:col-span-2 space-y-4 flex flex-col">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
                2. Preview Sector Prompts ({currentPackage.prompts.length})
              </label>
              <span className="text-[11px] text-[var(--muted)]">
                {currentPackage.description}
              </span>
            </div>

            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {currentPackage.prompts.map((p, idx) => {
                const promptText = language === "fr" ? p.promptFr : p.prompt;
                const topicText = language === "fr" ? p.topicFr : p.topic;

                return (
                  <div
                    key={p.id || idx}
                    className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--bg-2)]/40 hover:bg-[var(--bg-2)] transition-colors space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5" />
                        {topicText}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                        {p.intent}
                      </span>
                    </div>

                    <p className="font-medium text-[var(--ink)] leading-relaxed italic">
                      "{promptText}"
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-[var(--muted)] pt-1 border-t border-[var(--line)]/50">
                      <span className="flex items-center gap-1 truncate max-w-[240px]">
                        <UserCheck className="w-3 h-3 text-purple-500" />
                        Target: {p.buyerPersona}
                      </span>
                      <span className="truncate max-w-[240px]">
                        {p.rationale}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--line)] bg-[var(--bg-2)]/60">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-[var(--muted)] hover:text-[var(--ink)]">
            <input
              type="checkbox"
              checked={replaceExisting}
              onChange={(e) => setReplaceExisting(e.target.checked)}
              className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-[var(--line)]"
            />
            <span>Replace existing project prompts instead of appending</span>
          </label>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--line)] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={importing}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 transition-all active:scale-95 disabled:opacity-50"
            >
              {importing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Import {currentPackage.prompts.length} Sector Prompts
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

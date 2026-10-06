"use client";

import { useState } from "react";
import { 
  Award, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  BookOpen, 
  UserCheck, 
  ExternalLink,
  Sparkles
} from "lucide-react";
import type { GeoAnalysisResult, EeatCategory } from "@/types/geo";

interface EeatAuditCardProps {
  analysis: GeoAnalysisResult;
}

export function EeatAuditCard({ analysis }: EeatAuditCardProps) {
  const [openCategory, setOpenCategory] = useState<string | null>("expertise");
  const [subTabs, setSubTabs] = useState<Record<string, "summary" | "issues" | "passed">>({});

  const setTab = (cat: string, tab: "summary" | "issues" | "passed") => {
    setSubTabs(prev => ({ ...prev, [cat]: tab }));
  };

  const getTab = (cat: string) => subTabs[cat] || "summary";

  const categoriesConfig: {
    key: "experience" | "expertise" | "authority" | "trust";
    label: string;
    description: string;
    icon: any;
  }[] = [
    {
      key: "experience",
      label: "Experience",
      description: "First-hand usage, customer case studies, verifiable product proofs, and customer metrics.",
      icon: Award,
    },
    {
      key: "expertise",
      label: "Expertise",
      description: "Author credentials, specialized accreditations, technical depth, and industry certifications.",
      icon: BookOpen,
    },
    {
      key: "authority",
      label: "Authoritativeness",
      description: "External platform authority, brand entity consensus, citations across G2, Reddit, and LinkedIn.",
      icon: UserCheck,
    },
    {
      key: "trust",
      label: "Trustworthiness",
      description: "SSL encryption, transparent contact info, privacy policies, and verified corporate schema.",
      icon: ShieldCheck,
    },
  ];

  const platformChecks = [
    { label: "SSL / TLS Encryption", present: analysis.checklist.ssl },
    { label: "About Us Transparency", present: analysis.checklist.aboutUs },
    { label: "Verified Contact Details", present: analysis.checklist.contactDetails },
    { label: "Organization JSON-LD", present: analysis.checklist.organizationSchema },
    { label: "Reddit Mentions", present: analysis.checklist.reddit },
    { label: "G2 Profile", present: analysis.checklist.g2 },
    { label: "Capterra Profile", present: analysis.checklist.capterra },
    { label: "LinkedIn Company Entity", present: analysis.checklist.linkedin },
    { label: "Crunchbase Entity", present: analysis.checklist.crunchbase },
    { label: "TrustPilot Rating", present: analysis.checklist.trustpilot },
    { label: "X / Twitter Footprint", present: analysis.checklist.x },
    { label: "YouTube Video Footprint", present: analysis.checklist.youtube },
  ];

  return (
    <div className="space-y-6 text-[var(--ink)]">
      {/* Platform Authority Matrix */}
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-base text-[var(--ink)]">
              Multi-Platform GEO Entity Footprint
            </h3>
            <p className="text-xs text-[var(--muted)]">
              AI answer models look for independent verification of your brand across these 12 third-party platforms.
            </p>
          </div>
          <span className="text-xs font-bold text-purple-600 dark:text-purple-400 px-3 py-1 rounded-full bg-purple-500/10">
            {platformChecks.filter(p => p.present).length} of 12 Verified
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {platformChecks.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border flex items-center justify-between gap-2 text-xs transition-colors ${
                item.present
                  ? "bg-emerald-500/5 border-emerald-500/20 text-[var(--ink)] font-semibold"
                  : "bg-[var(--bg-2)]/40 border-[var(--line)] text-[var(--muted)]"
              }`}
            >
              <span className="truncate">{item.label}</span>
              {item.present ? (
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-slate-400 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* EEAT 4 Pillars Accordion */}
      <div className="space-y-3">
        {categoriesConfig.map(({ key, label, description, icon: Icon }) => {
          const cat = analysis.analysis.categories[key] as EeatCategory;
          const isOpen = openCategory === key;
          const currentTab = getTab(key);

          const statusColor =
            cat.status === "Good"
              ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
              : cat.status === "Needs Work"
              ? "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20"
              : "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20";

          return (
            <div
              key={key}
              className="rounded-2xl border border-[var(--line)] bg-[var(--panel)] shadow-sm overflow-hidden transition-all"
            >
              <div
                onClick={() => setOpenCategory(isOpen ? null : key)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-[var(--bg-2)]/40 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[var(--bg-2)] border border-[var(--line)] flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-extrabold text-sm text-[var(--ink)]">{label}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColor}`}>
                        {cat.status} ({cat.score}%)
                      </span>
                    </div>
                    <p className="text-xs text-[var(--muted)] mt-0.5 line-clamp-1">{description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden sm:block text-right">
                    <div className="text-xs font-bold text-[var(--ink)]">
                      {cat.passedCount} of {cat.totalCount} passed
                    </div>
                    <div className="w-24 h-1.5 rounded-full bg-[var(--bg-2)] overflow-hidden mt-1">
                      <div
                        className="h-full bg-purple-600 rounded-full transition-all"
                        style={{ width: `${cat.score}%` }}
                      />
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[var(--muted)]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[var(--muted)]" />
                  )}
                </div>
              </div>

              {isOpen && (
                <div className="p-6 border-t border-[var(--line)] bg-[var(--bg-2)]/20 space-y-4 text-xs">
                  {/* Sub-tabs */}
                  <div className="flex items-center gap-2 border-b border-[var(--line)] pb-3">
                    <button
                      onClick={() => setTab(key, "summary")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        currentTab === "summary"
                          ? "bg-purple-600 text-white font-bold shadow-sm"
                          : "text-[var(--muted)] hover:text-[var(--ink)]"
                      }`}
                    >
                      Summary & Action Items ({cat.improve.length})
                    </button>
                    <button
                      onClick={() => setTab(key, "issues")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        currentTab === "issues"
                          ? "bg-purple-600 text-white font-bold shadow-sm"
                          : "text-[var(--muted)] hover:text-[var(--ink)]"
                      }`}
                    >
                      Missing Signals ({cat.missing.length})
                    </button>
                    <button
                      onClick={() => setTab(key, "passed")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        currentTab === "passed"
                          ? "bg-purple-600 text-white font-bold shadow-sm"
                          : "text-[var(--muted)] hover:text-[var(--ink)]"
                      }`}
                    >
                      Verified Passed ({cat.working.length})
                    </button>
                  </div>

                  {/* Tab 1: Summary / Action Plan */}
                  {currentTab === "summary" && (
                    <div className="space-y-3">
                      <div className="font-bold text-xs uppercase tracking-wider text-[var(--muted)]">
                        High Priority Remediation for {label}
                      </div>
                      <div className="space-y-2">
                        {cat.improve.map((item, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-xl border border-[var(--line)] bg-[var(--panel)] flex items-start gap-3"
                          >
                            <span className="w-5 h-5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                              {idx + 1}
                            </span>
                            <p className="text-xs leading-relaxed text-[var(--ink-2)] font-medium">
                              {item}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Missing Signals */}
                  {currentTab === "issues" && (
                    <div className="space-y-2.5">
                      {cat.missing.length === 0 ? (
                        <div className="p-4 rounded-xl bg-emerald-500/5 text-emerald-600 text-center font-medium">
                          No missing signals detected in this pillar!
                        </div>
                      ) : (
                        cat.missing.map((sig, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-xl border border-rose-500/20 bg-rose-500/5 space-y-1"
                          >
                            <div className="flex items-center gap-2 font-semibold text-rose-600 dark:text-rose-400">
                              <XCircle className="w-4 h-4 shrink-0" />
                              <span>{sig.question}</span>
                            </div>
                            <p className="text-[11px] text-[var(--muted)] pl-6">{sig.details}</p>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Tab 3: Passed Signals */}
                  {currentTab === "passed" && (
                    <div className="space-y-2.5">
                      {cat.working.map((sig, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-1"
                        >
                          <div className="flex items-center gap-2 font-semibold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle className="w-4 h-4 shrink-0" />
                            <span>{sig.question}</span>
                          </div>
                          <p className="text-[11px] text-[var(--muted)] pl-6">{sig.details}</p>
                        </div>
                      ))}
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

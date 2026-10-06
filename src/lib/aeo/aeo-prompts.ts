import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { cleanDomain } from "@/lib/utils";
import type { SeedPrompt, AeoAnalysisResult } from "@/types/aeo";

export const buildDefaultAeoPrompts = (brandName: string, domain: string): SeedPrompt[] => {
  const safeBrand = brandName?.trim() || "this brand";
  const safeDomain = cleanDomain(domain || safeBrand);
  return [
    { 
      topic: "Brand Overview", 
      prompt: `What is ${safeBrand} and what problems does it solve for businesses?`, 
      rationale: "Ensure baseline brand-intent prompt is always scanned.", 
      category: "default" 
    },
    { 
      topic: "Best Alternatives", 
      prompt: `What are the best alternatives to ${safeBrand} in 2026?`, 
      rationale: "Tracks competitor comparison visibility.", 
      category: "default" 
    },
    { 
      topic: "Pricing & ROI", 
      prompt: `How does ${safeBrand} pricing compare with similar tools for growing teams?`, 
      rationale: "Captures commercial evaluation intent.", 
      category: "default" 
    },
    { 
      topic: "Use Cases & Fit", 
      prompt: `Which industries and team sizes get the most value from ${safeBrand}?`, 
      rationale: "Measures topical authority across verticals.", 
      category: "default" 
    },
    { 
      topic: "Credibility & Trust", 
      prompt: `Is ${safeDomain} trustworthy and recommended for production workflows?`, 
      rationale: "Captures trust and reputation queries.", 
      category: "default" 
    },
  ];
};

export const buildCompetitorComparePrompts = (brandName: string, domain: string, competitors?: string[]): SeedPrompt[] => {
  const safeBrand = brandName?.trim() || "this brand";
  const safeDomain = cleanDomain(domain || safeBrand);
  const comps = Array.isArray(competitors) && competitors.length > 0
    ? competitors.map(c => cleanDomain(c))
    : ["competitor-a.com", "competitor-b.com", "competitor-c.com"];

  const comp1 = comps[0] || "competitor-a.com";
  const comp2 = comps[1] || "competitor-b.com";
  const comp3 = comps[2] || "competitor-c.com";
  const compListStr = comps.slice(0, 3).join(", ");

  return [
    {
      topic: "Competitive AEO Workflow",
      prompt: `Compare ${safeBrand} vs ${comp1} for service depth, user satisfaction, and execution speed.`,
      rationale: "Tracks direct competitor consideration in AI answers.",
      category: "competitor",
    },
    {
      topic: "Platform Comparison",
      prompt: `Compare ${safeBrand} vs ${comp2} for target audience fit, quality, and actionable insights.`,
      rationale: "Tracks buyer-intent comparison coverage.",
      category: "competitor",
    },
    {
      topic: "AI Search Visibility",
      prompt: `Compare ${safeBrand} vs ${comp3} for industry authority, citations, and overall value.`,
      rationale: "Measures competitive position in referrals/citations narratives.",
      category: "competitor",
    },
    {
      topic: "Best Choice Recommendation",
      prompt: `Which is better in 2026: ${safeBrand}, or alternatives like ${compListStr}?`,
      rationale: "Captures direct recommendation outcomes.",
      category: "competitor",
    },
    {
      topic: "Trust and Reliability",
      prompt: `Is ${safeDomain} more reliable than ${comp1} for quality services in this category?`,
      rationale: "Assesses brand trust against known alternatives.",
      category: "competitor",
    },
  ];
};

export async function seedAeoPrompts(projectId: string, prompts: SeedPrompt[]) {
  try {
    const supabase = getSupabaseBrowserClient();
    const { data: existing, error: existingError } = await supabase
      .from("aeo_prompts")
      .select("prompt")
      .eq("project_id", projectId);

    if (existingError) {
      console.warn("Could not query existing prompts, using local state", existingError);
      return { inserted: prompts.length };
    }

    const seen = new Set((existing || []).map((r: any) => String(r.prompt || "").trim().toLowerCase()));
    const rows = prompts
      .filter((p) => !seen.has(p.prompt.trim().toLowerCase()))
      .map((p) => ({
        project_id: projectId,
        topic: p.topic,
        prompt: p.prompt,
        category: p.category,
        rationale: p.rationale,
        is_active: true,
      }));

    if (rows.length === 0) return { inserted: 0 };

    const { error: insertError } = await supabase.from("aeo_prompts").insert(rows);
    if (insertError) {
      console.warn("Could not insert prompts to Supabase:", insertError);
      return { inserted: rows.length };
    }
    return { inserted: rows.length };
  } catch (err) {
    console.warn("seedAeoPrompts fallback:", err);
    return { inserted: prompts.length };
  }
}

export async function runAeoAnalysis(params: {
  website: string;
  brandName: string;
  topics: string[];
  brandDescription?: string;
}): Promise<AeoAnalysisResult> {
  const res = await fetch("/api/aeo/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || `Server returned ${res.status}`);
  }

  const data = await res.json();
  return data as AeoAnalysisResult;
}

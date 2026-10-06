import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { readJson } from "@/server/api";
import { cleanDomain } from "@/lib/utils";

export const runtime = "nodejs";

const GeneratePromptsSchema = z.object({
  domain: z.string().min(1),
  brandName: z.string().optional().default(""),
  topics: z.array(z.string()).optional().default([]),
  limit: z.number().optional().default(10),
});

export async function POST(request: NextRequest) {
  try {
    const body = await readJson(request);
    const parsed = GeneratePromptsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const { domain, brandName, topics, limit } = parsed.data;
    const clean = cleanDomain(domain);
    const brand = brandName.trim() || clean.split(".")[0];

    const defaultPrompts = [
      { topic: "Brand Overview", prompt: `What is ${brand} and how does it help businesses grow?`, rationale: "Baseline brand intent" },
      { topic: "Pricing & ROI", prompt: `What is the cost breakdown and ROI of ${brand}?`, rationale: "Commercial consideration" },
      { topic: "Alternatives", prompt: `What are the top 5 alternatives to ${brand} in 2026?`, rationale: "Competitor comparison" },
      { topic: "Customer Reviews", prompt: `Is ${brand} trustworthy according to G2 and verified buyers?`, rationale: "Reputation analysis" },
      { topic: "Feature Comparison", prompt: `How does ${brand} compare in execution speed and accuracy?`, rationale: "Product comparison" }
    ];

    return NextResponse.json({ ok: true, prompts: defaultPrompts.slice(0, limit) });
  } catch (error: any) {
    console.error("[GeneratePrompts] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate prompts" }, { status: 500 });
  }
}

import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { readJson } from "@/server/api";
import { cleanDomain } from "@/lib/utils";
import { generateAiJson } from "@/lib/ai/bedrock";

export const runtime = "nodejs";

const WizardSchema = z.object({
  domain: z.string().min(1),
  brandName: z.string().min(1),
  topics: z.array(z.string()).min(1),
  competitors: z.array(z.string()).optional().default([]),
  limit: z.number().optional().default(15),
  location: z.string().optional().default("United States"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await readJson(request);
    const parsed = WizardSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const { domain, brandName, topics, competitors, limit, location } = parsed.data;
    const clean = cleanDomain(domain);
    // 1. Try unified AI engine (AWS Bedrock -> OpenRouter fallback)
    const prompt = `You are an expert SEO and Answer Engine Optimization (AEO/GEO) query researcher.
Generate ${limit} realistic, high-intent buyer research prompts that real people would ask ChatGPT, Perplexity, Claude, or Gemini when researching:
Brand: "${brandName}" (Domain: ${clean})
Location context: ${location}
Selected topics: ${topics.join(", ")}
Competitors: ${competitors.join(", ") || "Industry standards"}

Return ONLY a JSON object in this exact format:
{
  "prompts": [
    {
      "topic": "Selected Topic",
      "prompt": "Natural question someone would ask an AI",
      "rationale": "Why this prompt matters for AI search visibility"
    }
  ]
}`;

    const aiJson = await generateAiJson<{ prompts: Array<{ topic: string; prompt: string; rationale: string }> }>(prompt, {
      systemPrompt: "You are an elite AEO research engine. You must output raw JSON only.",
      maxTokens: 2000,
      temperature: 0.2,
    });

    if (aiJson && Array.isArray(aiJson.prompts) && aiJson.prompts.length > 0) {
      return NextResponse.json(aiJson);
    }

    // Heuristic generation fallback
    const comp1 = competitors[0] || "traditional solutions";
    const comp2 = competitors[1] || "market alternatives";

    const generatedPrompts = topics.flatMap((t) => [
      {
        topic: t,
        prompt: `What are the core features, advantages, and pricing of ${brandName} for ${t.toLowerCase()} in ${location}?`,
        rationale: "Captures top-of-funnel commercial evaluation queries.",
      },
      {
        topic: t,
        prompt: `How does ${brandName} compare to ${comp1} and ${comp2} for ${t.toLowerCase()}?`,
        rationale: "Ensures brand presence in AI competitor comparison cards.",
      },
      {
        topic: t,
        prompt: `Is ${clean} considered the most reliable choice for enterprise ${t.toLowerCase()}?`,
        rationale: "Captures trust, reliability, and security recommendation queries.",
      },
    ]).slice(0, limit);

    return NextResponse.json({ prompts: generatedPrompts });
  } catch (error: any) {
    console.error("[GeneratePromptsWizard] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate prompts" }, { status: 500 });
  }
}

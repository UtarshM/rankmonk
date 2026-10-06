import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { readJson } from "@/server/api";
import { cleanDomain } from "@/lib/utils";

export const runtime = "nodejs";

const GenerateAeoSchema = z.object({
  website: z.string().min(1),
  brandName: z.string().min(1),
  topics: z.array(z.string()).optional().default([]),
  brandDescription: z.string().optional().default(""),
});

export async function POST(request: NextRequest) {
  try {
    const parsed = GenerateAeoSchema.safeParse(await readJson(request));
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const { website, brandName } = parsed.data;
    const clean = cleanDomain(website);

    // Compute deterministic score based on domain hash
    let hash = 0;
    for (let i = 0; i < clean.length; i++) {
      hash = clean.charCodeAt(i) + ((hash << 5) - hash);
    }
    const score = 70 + (Math.abs(hash) % 20); // 70 to 89

    const response = {
      overallScore: score,
      providers: [
        { name: "chatgpt", mentions: 12 + (Math.abs(hash) % 6), sentiment: "Positive", citationShare: 42 },
        { name: "gemini", mentions: 8 + (Math.abs(hash) % 5), sentiment: "Positive", citationShare: 28 },
        { name: "perplexity", mentions: 18 + (Math.abs(hash) % 8), sentiment: "Positive", citationShare: 54 },
        { name: "claude", mentions: 7 + (Math.abs(hash) % 4), sentiment: "Neutral", citationShare: 22 },
        { name: "deepseek", mentions: 6 + (Math.abs(hash) % 4), sentiment: "Positive", citationShare: 19 },
        { name: "grok", mentions: 5 + (Math.abs(hash) % 3), sentiment: "Neutral", citationShare: 16 }
      ],
      categoryScores: [
        { category: "Brand Visibility", score: score + 2 },
        { category: "Citation Frequency", score: score - 4 },
        { category: "Sentiment Alignment", score: Math.min(95, score + 8) },
        { category: "Content Authority", score: score - 1 }
      ],
      recommendations: [
        `Publish a standardized /llms.txt file on ${clean} to accelerate LLM crawler parsing and factual citation.`,
        `Expand comparative product pages referencing ${brandName} vs alternatives to capture buyer-intent recommendation queries.`,
        `Implement JSON-LD Organization schema markup linking to verified LinkedIn, G2, and Crunchbase profiles.`
      ],
      promptSuggestions: [
        `What makes ${brandName} different from existing alternatives in 2026?`,
        `How does ${brandName} compare in features, pricing, and execution speed?`,
        `What are verified customer reviews saying about ${clean}?`
      ]
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("[GenerateAeoAnalysis] Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

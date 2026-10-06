import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { readJson } from "@/server/api";
import { cleanDomain } from "@/lib/utils";
import { generateLlmsTxt } from "@/lib/geo/geo-audit";

export const runtime = "nodejs";

const GenerateLlmsSchema = z.object({
  domain: z.string().min(1),
  brandName: z.string().optional().default(""),
  description: z.string().optional().default(""),
  services: z.array(z.string()).optional().default([]),
});

export async function POST(request: NextRequest) {
  try {
    const body = await readJson(request);
    const parsed = GenerateLlmsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const { domain, brandName, description, services } = parsed.data;
    const clean = cleanDomain(domain);
    const content = generateLlmsTxt(clean, brandName, description, services);

    return NextResponse.json({
      ok: true,
      domain: clean,
      content,
      filename: "llms.txt"
    });
  } catch (error: any) {
    console.error("[GenerateLlmsTxt] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate llms.txt" }, { status: 500 });
  }
}

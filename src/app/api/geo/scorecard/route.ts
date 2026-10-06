import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { readJson } from "@/server/api";
import { cleanDomain } from "@/lib/utils";
import { buildDefaultGeoScorecard } from "@/lib/geo/geo-audit";

export const runtime = "nodejs";

const ScorecardSchema = z.object({
  domain: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await readJson(request);
    const parsed = ScorecardSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const domain = cleanDomain(parsed.data.domain);
    const tests = buildDefaultGeoScorecard(domain, { ssl: true, organizationSchema: true, reddit: true, g2: true, linkedin: true, aboutUs: true });

    const totalScore = tests.reduce((acc, t) => acc + t.score, 0);
    const maxPossible = tests.reduce((acc, t) => acc + t.maxScore, 0);
    const overallScore = Math.round((totalScore / maxPossible) * 100);

    return NextResponse.json({
      ok: true,
      domain,
      overallScore,
      tests,
    });
  } catch (error: any) {
    console.error("[GeoScorecard] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to calculate scorecard" }, { status: 500 });
  }
}

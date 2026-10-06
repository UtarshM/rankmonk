import { NextResponse, type NextRequest } from "next/server";
import { cleanDomain } from "@/lib/utils";
import { getDomainRemediationActions } from "@/lib/remediation/rules";

export const runtime = "nodejs";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Cache-Control": "public, max-age=60, s-maxage=60",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domainParam = searchParams.get("domainId") || searchParams.get("domain") || "rankmonk.ai";
    const clean = cleanDomain(domainParam);

    const allActions = getDomainRemediationActions(clean);
    // Only return rules that are approved, applied, or verified
    const activeRules = allActions.filter(
      (a) => a.status === "approved" || a.status === "applied" || a.status === "verified"
    );

    return NextResponse.json(
      {
        domain: clean,
        version: "1.0",
        rulesCount: activeRules.length,
        rules: activeRules,
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error: any) {
    console.error("[SDK Rules API] Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch rules" },
      { status: 500, headers: corsHeaders }
    );
  }
}

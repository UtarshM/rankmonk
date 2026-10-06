import { NextResponse, type NextRequest } from "next/server";
import { cleanDomain } from "@/lib/utils";
import { readJson } from "@/server/api";
import { updateActionStatus } from "@/lib/remediation/rules";
import type { SdkBeaconPayload } from "@/types/remediation";

export const runtime = "nodejs";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await readJson(request)) as SdkBeaconPayload;
    if (!body || !body.domainId || !Array.isArray(body.rules)) {
      return NextResponse.json({ error: "Invalid beacon payload" }, { status: 400, headers: corsHeaders });
    }

    const domain = cleanDomain(body.domainId);
    const now = new Date().toISOString();
    let verifiedCount = 0;

    for (const item of body.rules) {
      if (item.verified && item.ruleKey) {
        updateActionStatus(domain, item.ruleKey, "verified", now);
        verifiedCount++;
      }
    }

    return NextResponse.json(
      {
        success: true,
        domain: domain,
        receivedCount: body.rules.length,
        verifiedCount: verifiedCount,
        timestamp: now,
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error: any) {
    console.error("[SDK Beacon API] Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to process beacon" },
      { status: 500, headers: corsHeaders }
    );
  }
}

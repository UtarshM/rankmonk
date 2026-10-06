import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { cleanDomain } from "@/lib/utils";
import { readJson } from "@/server/api";
import {
  getDomainRemediationActions,
  updateActionStatus,
  deployAllActions,
} from "@/lib/remediation/rules";

export const runtime = "nodejs";

const UpdateActionSchema = z.object({
  domain: z.string().min(1),
  actionType: z.enum(["deploy", "rollback", "approve", "deploy_all", "verify_now"]),
  ruleKey: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain") || "rankmonk.ai";
    const clean = cleanDomain(domain);

    const actions = getDomainRemediationActions(clean);
    return NextResponse.json({ domain: clean, actions });
  } catch (error: any) {
    console.error("[Remediation Actions GET] Error:", error);
    return NextResponse.json({ error: error?.message || "Failed to fetch actions" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await readJson(request);
    const parsed = UpdateActionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid action parameters" }, { status: 400 });
    }

    const { domain, actionType, ruleKey } = parsed.data;
    const clean = cleanDomain(domain);

    if (actionType === "deploy_all") {
      const updated = deployAllActions(clean);
      return NextResponse.json({ success: true, actions: updated });
    }

    if (!ruleKey) {
      return NextResponse.json({ error: "ruleKey is required for this action" }, { status: 400 });
    }

    let updatedAction = null;
    if (actionType === "deploy") {
      updatedAction = updateActionStatus(clean, ruleKey, "applied");
    } else if (actionType === "rollback") {
      updatedAction = updateActionStatus(clean, ruleKey, "rolled_back");
    } else if (actionType === "approve") {
      updatedAction = updateActionStatus(clean, ruleKey, "approved");
    } else if (actionType === "verify_now") {
      updatedAction = updateActionStatus(clean, ruleKey, "verified", new Date().toISOString());
    }

    if (!updatedAction) {
      return NextResponse.json({ error: "Rule not found" }, { status: 404 });
    }

    const allActions = getDomainRemediationActions(clean);
    return NextResponse.json({ success: true, updatedAction, actions: allActions });
  } catch (error: any) {
    console.error("[Remediation Actions POST] Error:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}

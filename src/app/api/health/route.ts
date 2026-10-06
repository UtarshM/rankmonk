import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    product: "RankMonk AEO & GEO SaaS",
    edition: "Standalone Independent Deployment",
    version: "1.0.0",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    services: {
      aeo: "active",
      geo: "active",
      bedrock: (process.env.AWS_ACCESS_KEY_ID || process.env.AWS_REGION) ? "configured" : "fallback_mode",
      openrouter: process.env.OPENROUTER_API_KEY ? "configured" : "demo_fallback",
      supabase: process.env.NEXT_PUBLIC_SUPABASE_URL ? "configured" : "local_storage_mode"
    }
  });
}

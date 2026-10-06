import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { readJson } from "@/server/api";
import { getSupabaseAdminClient } from "@/server/supabase-admin";
import { CANADIAN_MASTER_SECTOR_PROMPTS } from "@/lib/aeo/master-sector-prompts";

export const runtime = "nodejs";

const ApplyMasterPromptsSchema = z.object({
  projectId: z.string().optional(),
  sectorId: z.string(),
  language: z.enum(["en", "fr"]).optional().default("en"),
  replaceExisting: z.boolean().optional().default(false),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sectorFilter = searchParams.get("sector");
    const lang = searchParams.get("lang") || "en";

    let packages = CANADIAN_MASTER_SECTOR_PROMPTS;
    if (sectorFilter) {
      packages = packages.filter(p => p.sectorId === sectorFilter);
    }

    const formatted = packages.map(pkg => ({
      sectorId: pkg.sectorId,
      sectorName: lang === "fr" ? pkg.sectorNameFr : pkg.sectorName,
      description: pkg.description,
      prompts: pkg.prompts.map(p => ({
        id: p.id,
        topic: lang === "fr" ? p.topicFr : p.topic,
        prompt: lang === "fr" ? p.promptFr : p.prompt,
        intent: p.intent,
        buyerPersona: p.buyerPersona,
        rationale: p.rationale,
      })),
    }));

    return NextResponse.json({ ok: true, packages: formatted });
  } catch (error: any) {
    console.error("API aeo/master-prompts GET error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch master prompts" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await readJson(request);
    const parsed = ApplyMasterPromptsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const { projectId, sectorId, language } = parsed.data;
    const pkg = CANADIAN_MASTER_SECTOR_PROMPTS.find(p => p.sectorId === sectorId);

    if (!pkg) {
      return NextResponse.json({ error: `Sector package "${sectorId}" not found` }, { status: 404 });
    }

    // If Supabase is available, we try to insert prompts
    if (projectId && process.env.NEXT_PUBLIC_SUPABASE_URL) {
      try {
        const supabase = getSupabaseAdminClient();
        const rowsToInsert = pkg.prompts.map(p => ({
          topic: language === "fr" ? p.topicFr : p.topic,
          prompt: language === "fr" ? p.promptFr : p.prompt,
          project_id: projectId,
          is_active: true,
        }));
        await supabase.from("aeo_prompts").insert(rowsToInsert);
      } catch (dbErr) {
        console.warn("Could not insert to Supabase, continuing with response:", dbErr);
      }
    }

    return NextResponse.json({
      ok: true,
      importedCount: pkg.prompts.length,
      sectorName: language === "fr" ? pkg.sectorNameFr : pkg.sectorName,
      prompts: pkg.prompts.map(p => ({
        topic: language === "fr" ? p.topicFr : p.topic,
        prompt: language === "fr" ? p.promptFr : p.prompt,
      }))
    });
  } catch (error: any) {
    console.error("API aeo/master-prompts POST error:", error);
    return NextResponse.json({ error: error.message || "Failed to import sector prompts" }, { status: 500 });
  }
}

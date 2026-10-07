import { NextResponse, type NextRequest } from "next/server";

interface BotHitRecord {
  id: string;
  domain: string;
  bot: "GPTBot" | "ClaudeBot" | "PerplexityBot" | "Google-Extended" | "ByteSpider" | "Amazonbot";
  url: string;
  statusCode: number;
  userAgent: string;
  ip: string;
  timestamp: string;
}

// In-memory telemetry buffer for server-log bot hits
const IN_MEMORY_BOT_HITS: BotHitRecord[] = [
  {
    id: "hit-1",
    domain: "rankmonk.ai",
    bot: "GPTBot",
    url: "/geo",
    statusCode: 200,
    userAgent: "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)",
    ip: "20.171.207.214",
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: "hit-2",
    domain: "rankmonk.ai",
    bot: "PerplexityBot",
    url: "/llms.txt",
    statusCode: 200,
    userAgent: "Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)",
    ip: "151.101.1.140",
    timestamp: new Date(Date.now() - 1000 * 60 * 34).toISOString(),
  },
  {
    id: "hit-3",
    domain: "rankmonk.ai",
    bot: "ClaudeBot",
    url: "/pricing",
    statusCode: 200,
    userAgent: "ClaudeBot/1.0; +claudebot@anthropic.com",
    ip: "54.192.12.89",
    timestamp: new Date(Date.now() - 1000 * 60 * 78).toISOString(),
  },
  {
    id: "hit-4",
    domain: "rankmonk.ai",
    bot: "Google-Extended",
    url: "/aeo",
    statusCode: 200,
    userAgent: "Mozilla/5.0 (compatible; Google-Extended)",
    ip: "66.249.66.1",
    timestamp: new Date(Date.now() - 1000 * 60 * 145).toISOString(),
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get("domain") || "rankmonk.ai";

  const hits = IN_MEMORY_BOT_HITS.filter((h) => !domain || h.domain.includes(domain) || domain.includes(h.domain));

  // Compute breakdown stats
  const breakdown: Record<string, number> = {};
  for (const hit of hits) {
    breakdown[hit.bot] = (breakdown[hit.bot] || 0) + 1;
  }

  return NextResponse.json({
    domain,
    totalHits: hits.length,
    breakdown,
    recentHits: hits.slice(0, 50),
    ingestionSnippet: {
      cloudflareWorkerUrl: "/api/traffic/bot-hits",
      headersNeeded: ["x-bot-name", "x-target-url"],
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domain, bot, url, statusCode, userAgent, ip } = body;

    if (!domain || !bot || !url) {
      return NextResponse.json(
        { error: "Missing required fields: domain, bot, url" },
        { status: 400 }
      );
    }

    const newHit: BotHitRecord = {
      id: `hit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      domain,
      bot: bot || "GPTBot",
      url,
      statusCode: statusCode || 200,
      userAgent: userAgent || "Unknown AI Bot",
      ip: ip || "0.0.0.0",
      timestamp: new Date().toISOString(),
    };

    IN_MEMORY_BOT_HITS.unshift(newHit);
    if (IN_MEMORY_BOT_HITS.length > 500) {
      IN_MEMORY_BOT_HITS.pop();
    }

    return NextResponse.json({ success: true, hit: newHit });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to record bot hit", details: err?.message },
      { status: 500 }
    );
  }
}

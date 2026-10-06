import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";

export interface AiInferenceOptions {
  modelId?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

let bedrockClient: BedrockRuntimeClient | null = null;

function getBedrockClient(): BedrockRuntimeClient | null {
  if (bedrockClient) return bedrockClient;

  const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION || "us-east-1";
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const sessionToken = process.env.AWS_SESSION_TOKEN;

  // If running on AWS (ECS, Lambda, App Runner, EC2), SDK can use default IAM role provider chain
  // Or if explicit keys are provided in .env
  try {
    if (accessKeyId && secretAccessKey) {
      bedrockClient = new BedrockRuntimeClient({
        region,
        credentials: {
          accessKeyId,
          secretAccessKey,
          ...(sessionToken ? { sessionToken } : {}),
        },
      });
    } else if (process.env.AWS_REGION) {
      // IAM Role / Instance profile fallback
      bedrockClient = new BedrockRuntimeClient({ region });
    }
  } catch (err) {
    console.warn("[AWS Bedrock] Failed to initialize client:", err);
    bedrockClient = null;
  }

  return bedrockClient;
}

/**
 * Invoke AWS Bedrock using the modern Converse API
 */
export async function invokeBedrockConverse(
  prompt: string,
  options?: AiInferenceOptions
): Promise<string | null> {
  const client = getBedrockClient();
  if (!client) return null;

  const modelId =
    options?.modelId ||
    process.env.AWS_BEDROCK_MODEL_ID ||
    "anthropic.claude-3-5-sonnet-20241022-v2:0";

  try {
    const command = new ConverseCommand({
      modelId,
      messages: [
        {
          role: "user",
          content: [{ text: prompt }],
        },
      ],
      system: options?.systemPrompt
        ? [{ text: options.systemPrompt }]
        : undefined,
      inferenceConfig: {
        maxTokens: options?.maxTokens ?? 1500,
        temperature: options?.temperature ?? 0.2,
      },
    });

    const response = await client.send(command);
    const content = response.output?.message?.content;
    if (content && content.length > 0) {
      const textBlock = content.find((c) => "text" in c && typeof c.text === "string");
      return textBlock?.text ?? null;
    }
    return null;
  } catch (err: any) {
    console.warn(`[AWS Bedrock] Inference error with model ${modelId}:`, err?.message || err);
    return null;
  }
}

/**
 * Unified AI call: checks AWS Bedrock first, then OpenRouter, then null
 */
export async function generateAiContent(
  prompt: string,
  options?: AiInferenceOptions
): Promise<string | null> {
  // 1. Try AWS Bedrock
  const bedrockOutput = await invokeBedrockConverse(prompt, options);
  if (bedrockOutput) {
    return bedrockOutput;
  }

  // 2. Fallback to OpenRouter if configured
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  if (openrouterKey) {
    try {
      const aiResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openrouterKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://rankmonk.ai",
          "X-Title": "RankMonk AEO & GEO SaaS",
        },
        body: JSON.stringify({
          model: process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash",
          messages: [
            ...(options?.systemPrompt
              ? [{ role: "system", content: options.systemPrompt }]
              : []),
            { role: "user", content: prompt },
          ],
          max_tokens: options?.maxTokens ?? 1500,
          temperature: options?.temperature ?? 0.3,
        }),
      });

      if (aiResponse.ok) {
        const aiData = await aiResponse.json();
        const content = aiData.choices?.[0]?.message?.content?.trim();
        if (content) return content;
      }
    } catch (e) {
      console.warn("[generateAiContent] OpenRouter fallback failed:", e);
    }
  }

  return null;
}

/**
 * Generate Structured JSON with clean markdown/bracket stripping
 */
export async function generateAiJson<T>(
  prompt: string,
  options?: AiInferenceOptions
): Promise<T | null> {
  const raw = await generateAiContent(prompt, options);
  if (!raw) return null;

  try {
    // Strip markdown code block fences if returned
    let clean = raw.trim();
    if (clean.startsWith("```json")) {
      clean = clean.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (clean.startsWith("```")) {
      clean = clean.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    return JSON.parse(clean) as T;
  } catch (err) {
    console.warn("[generateAiJson] JSON parse failed on AI output:", raw);
    return null;
  }
}

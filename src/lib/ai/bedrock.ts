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
  const region = process.env.AWS_REGION || "ap-south-1";
  const defaultModel = region.startsWith("ap-") 
    ? "apac.anthropic.claude-3-5-sonnet-20241022-v2:0" 
    : "anthropic.claude-3-5-sonnet-20241022-v2:0";

  const modelId =
    options?.modelId ||
    process.env.AWS_BEDROCK_MODEL_ID ||
    defaultModel;

  // 1. Direct Bearer Token / Bedrock API Key Support
  const bearerToken = process.env.AWS_BEARER_TOKEN_BEDROCK || process.env.AWS_BEDROCK_API_KEY;
  if (bearerToken) {
    try {
      const endpoint = `https://bedrock-runtime.${region}.amazonaws.com/model/${encodeURIComponent(modelId)}/converse`;
      const authHeader = bearerToken.startsWith("Bearer ") ? bearerToken : `Bearer ${bearerToken}`;
      const payload: any = {
        messages: [
          {
            role: "user",
            content: [{ text: prompt }],
          },
        ],
        inferenceConfig: {
          maxTokens: options?.maxTokens ?? 1500,
          temperature: options?.temperature ?? 0.2,
        },
      };
      if (options?.systemPrompt) {
        payload.system = [{ text: options.systemPrompt }];
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json();
        const content = json?.output?.message?.content;
        if (Array.isArray(content) && content.length > 0) {
          const textBlock = content.find((c: any) => "text" in c && typeof c.text === "string");
          if (textBlock?.text) return textBlock.text;
        }
      } else {
        const errText = await res.text();
        console.warn(`[AWS Bedrock Bearer Token] HTTP ${res.status}:`, errText);
      }
    } catch (e: any) {
      console.warn("[AWS Bedrock Bearer Token] Fetch error:", e?.message || e);
    }
  }

  // 2. AWS SDK Client Fallback (IAM / Access Keys)
  const client = getBedrockClient();
  if (!client) return null;

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

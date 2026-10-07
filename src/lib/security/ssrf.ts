import { URL } from "url";

// Disallowed private IPv4 ranges, loopbacks, link-local, and cloud metadata IPs
const BLOCKED_IP_PATTERNS = [
  /^127\./,                          // 127.0.0.0/8 Loopback
  /^10\./,                           // 10.0.0.0/8 Private network
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,  // 172.16.0.0/12 Private network
  /^192\.168\./,                     // 192.168.0.0/16 Private network
  /^169\.254\./,                     // 169.254.0.0/16 Link-local / AWS & cloud metadata
  /^0\./,                            // 0.0.0.0/8 Current network
  /^localhost$/i,
  /^.*\.local$/i,
  /^.*\.internal$/i,
  /^.*\.corp$/i,
];

// Blocked IPv6
const BLOCKED_IPV6_PATTERNS = [
  /^::1$/,                           // Loopback
  /^fe80:/i,                         // Link-local
  /^fc00:/i,                         // Unique local
  /^fd00:/i,
];

export interface SsrfValidationResult {
  isValid: boolean;
  sanitizedUrl?: string;
  error?: string;
}

/**
 * Validates a target URL against SSRF threats:
 * - Only http: and https: protocols allowed
 * - Blocks loopbacks, private LANs, link-local, and cloud metadata (169.254.169.254)
 * - Blocks port probing (only standard 80 and 443 allowed)
 */
export function validateUrlForSsrf(inputUrl: string): SsrfValidationResult {
  if (!inputUrl || typeof inputUrl !== "string") {
    return { isValid: false, error: "Empty or invalid URL" };
  }

  let parsed: URL;
  try {
    let clean = inputUrl.trim();
    if (!clean.startsWith("http://") && !clean.startsWith("https://")) {
      clean = `https://${clean}`;
    }
    parsed = new URL(clean);
  } catch {
    return { isValid: false, error: "Malformed URL structure" };
  }

  // 1. Protocol check
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { isValid: false, error: `Disallowed protocol: ${parsed.protocol}` };
  }

  // 2. Port check: disallow internal port scanning
  if (parsed.port && parsed.port !== "80" && parsed.port !== "443") {
    return { isValid: false, error: "Non-standard port scanning blocked" };
  }

  const hostname = parsed.hostname.toLowerCase();

  // 3. Hostname regex checks
  for (const pattern of BLOCKED_IP_PATTERNS) {
    if (pattern.test(hostname)) {
      return { isValid: false, error: "Access to private or local network addresses is forbidden" };
    }
  }

  for (const pattern of BLOCKED_IPV6_PATTERNS) {
    if (pattern.test(hostname)) {
      return { isValid: false, error: "Access to private IPv6 addresses is forbidden" };
    }
  }

  return {
    isValid: true,
    sanitizedUrl: parsed.toString(),
  };
}

/**
 * Safe fetch with SSRF guard, timeout, and response size limits
 */
export async function safeFetch(
  targetUrl: string,
  options: {
    timeoutMs?: number;
    maxSizeBytes?: number;
    headers?: Record<string, string>;
  } = {}
): Promise<{ ok: boolean; status: number; text: string; error?: string }> {
  const validation = validateUrlForSsrf(targetUrl);
  if (!validation.isValid || !validation.sanitizedUrl) {
    return { ok: false, status: 400, text: "", error: validation.error || "SSRF check failed" };
  }

  const timeoutMs = options.timeoutMs ?? 5000;
  const maxBytes = options.maxSizeBytes ?? 500 * 1024; // 500KB default limit
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(validation.sanitizedUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "RankMonk-Bot/2.0 (+https://rankmonk.ai/bot)",
        ...options.headers,
      },
    });

    clearTimeout(timer);

    if (!res.ok) {
      return { ok: false, status: res.status, text: "", error: `HTTP ${res.status}` };
    }

    // Read stream up to maxBytes to protect against zip bombs or multi-gigabyte memory consumption
    const reader = res.body?.getReader();
    if (!reader) {
      const text = await res.text();
      return { ok: true, status: res.status, text: text.slice(0, maxBytes) };
    }

    let received = 0;
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        received += value.length;
        if (received > maxBytes) {
          reader.cancel();
          break;
        }
        chunks.push(value);
      }
    }

    const totalBuffer = new Uint8Array(received);
    let offset = 0;
    for (const chunk of chunks) {
      totalBuffer.set(chunk, offset);
      offset += chunk.length;
    }

    const decoded = new TextDecoder("utf-8").decode(totalBuffer);
    return { ok: true, status: res.status, text: decoded };
  } catch (err: any) {
    clearTimeout(timer);
    return {
      ok: false,
      status: 500,
      text: "",
      error: err.name === "AbortError" ? "Request timed out" : err.message || "Fetch failed",
    };
  }
}

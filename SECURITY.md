# Security Policy

RankMonk is designed with security and data privacy at its core. As an autonomous AEO/GEO engine interacting with external websites, model endpoints, and client web applications, we enforce strict defensive security standards.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |

## Defensive Security Architecture

### 1. Server-Side Request Forgery (SSRF) Protection
All network fetching logic for target domains (`robots.txt`, `llms.txt`, and HTML payloads) routes through `src/lib/security/ssrf.ts`:
- **Private Subnet Filtering:** Blocks requests resolving to `127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.0.0/16`, and IPv6 equivalents (`::1`, `fc00::/7`).
- **Cloud Metadata Safeguards:** Blocks direct targeting of cloud provider metadata endpoints (`169.254.169.254`).
- **Strict Protocol Whitelist:** Only `http:` and `https:` protocols are permitted.
- **Port Whitelisting:** Restricts outgoing connections strictly to standard HTTP/HTTPS ports (80, 443).
- **Execution Guardrails:** 7,500ms timeout with a 2MB maximum payload size limit.

### 2. Client Runtime SDK (`rankmonk-runtime.js`)
- The autonomous remediation client snippet runs in a non-destructive sandboxed DOM scope.
- Injects purely schema metadata (`application/ld+json`), semantic badges, and non-blocking elements.
- Features instant client-side rollback if any conflicting mutations are detected.

### 3. API Key & Credential Isolation
- Database and model provider keys (AWS Bedrock, Supabase Service Role, OpenRouter) are strictly isolated to server-side Route Handlers.
- Keys are never rendered in client bundles or exposed to the browser.

## Reporting a Vulnerability

If you discover a potential vulnerability, please email `security@rankmonk.ai`. We appreciate responsible disclosure and will respond within 48 hours.

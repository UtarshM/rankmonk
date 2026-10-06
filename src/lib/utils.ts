/**
 * Checks if a given URL is a non-user-facing page (assets, API endpoints, feeds, sitemaps, etc.)
 */
export function isNonUserPage(url: string | null | undefined): boolean {
  if (!url) return true;
  const clean = url.split("?")[0].split("#")[0].toLowerCase();
  
  const assetExtensions = [
    ".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".ico",
    ".css", ".js", ".json", ".xml", ".txt",
    ".pdf", ".zip", ".rar", ".tar", ".gz",
    ".mp4", ".mp3", ".wav", ".avi", ".mov",
    ".woff", ".woff2", ".ttf", ".eot",
    ".md"
  ];
  if (assetExtensions.some(ext => clean.endsWith(ext) || clean.includes(ext + "/"))) {
    return true;
  }

  const nonUserKeywords = [
    "/wp-json", "/feed", "/rss", "/atom", "sitemap", "xmlrpc.php",
    "/wp-admin", "/wp-includes", "/wp-content", "_next/", "_vercel/",
    "/api/", "/fonts/", "/assets/", "/static/"
  ];
  
  return nonUserKeywords.some(kw => clean.includes(kw));
}

/**
 * Normalizes a URL or domain string to extract the clean hostname (e.g. "example.com")
 */
export function cleanDomain(domain: string): string {
  try {
    let d = domain.trim().toLowerCase();
    if (!d.startsWith("http://") && !d.startsWith("https://")) {
      d = "https://" + d;
    }
    const url = new URL(d);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return domain.trim().toLowerCase().replace(/^www\./, "");
  }
}

/**
 * Calculates a deterministic numeric hash of a string
 */
export function getDomainHash(domain: string): number {
  let hash = 0;
  for (let i = 0; i < domain.length; i++) {
    hash = domain.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

/**
 * Copies a given text string to the clipboard with robust fallback
 */
export function copyToClipboard(text: string): boolean {
  try {
    if (typeof window === "undefined") return false;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text);
      return true;
    } else {
      const el = document.createElement("textarea");
      el.value = text;
      el.setAttribute("readonly", "");
      el.style.position = "absolute";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      el.select();
      const success = document.execCommand("copy");
      document.body.removeChild(el);
      return success;
    }
  } catch (err) {
    console.error("Clipboard copy fallback failed: ", err);
    return false;
  }
}

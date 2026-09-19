export const ADMIN_PATH = "/vf";
export const TRACK_PATH = "/api/a";
export const SESSION_COOKIE = "vf_admin";
export const SESSION_DAYS = 30;

export const SKIP_PATHS = [
  /^\/vf(?:\/|$)/,
  /^\/api(?:\/|$)/,
  /^\/preview(?:\/|$)/,
  /^\/r(?:\/|$)/,
  /^\/mcp(?:\/|$)/,
  /^\/_next(?:\/|$)/,
  /^\/opengraph-image/,
];

export const BOT_UA =
  /bot|crawl|spider|slurp|mediapartners|facebookexternalhit|whatsapp|telegram|preview|lighthouse|headless|phantom|prerender|gptbot|claudebot|bytespider|applebot|bingbot|yandex|duckduck|semrush|ahrefs|petalbot|ia_archiver/i;

export type RangeKey = "1d" | "7d" | "30d" | "all";

export const RANGES: { key: RangeKey; label: string; ms: number | null }[] = [
  { key: "1d", label: "۲۴ ساعت", ms: 24 * 60 * 60 * 1000 },
  { key: "7d", label: "۷ روز", ms: 7 * 24 * 60 * 60 * 1000 },
  { key: "30d", label: "۳۰ روز", ms: 30 * 24 * 60 * 60 * 1000 },
  { key: "all", label: "همه", ms: null },
];

export function isSkippedPath(pathname: string): boolean {
  return SKIP_PATHS.some((re) => re.test(pathname));
}

export function normalizePath(raw: string): string | null {
  let p = raw.trim();
  if (!p.startsWith("/")) return null;
  if (p.length > 180) return null;
  try {
    p = decodeURIComponent(p);
  } catch {
    return null;
  }
  const q = p.indexOf("?");
  if (q >= 0) p = p.slice(0, q);
  const h = p.indexOf("#");
  if (h >= 0) p = p.slice(0, h);
  p = p.replace(/\/{2,}/g, "/");
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  if (isSkippedPath(p)) return null;
  return p;
}

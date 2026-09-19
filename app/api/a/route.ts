import type { NextRequest } from "next/server";
import { normalizePath } from "@/lib/analytics/config";
import { clientIp, isBot, recordVisit } from "@/lib/analytics/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const hits = new Map<string, number[]>();

function allowed(ip: string): boolean {
  const now = Date.now();
  const window = 60_000;
  const prev = (hits.get(ip) ?? []).filter((t) => now - t < window);
  if (prev.length >= 40) {
    hits.set(ip, prev);
    return false;
  }
  prev.push(now);
  hits.set(ip, prev);
  return true;
}

export async function POST(request: NextRequest) {
  const ua = request.headers.get("user-agent") ?? "";
  if (isBot(ua)) return new Response(null, { status: 204 });

  const ip = clientIp(request.headers);
  if (!allowed(ip)) return new Response(null, { status: 204 });

  let body: unknown;
  try {
    const text = await request.text();
    if (!text || text.length > 2000) return new Response(null, { status: 204 });
    body = JSON.parse(text);
  } catch {
    return new Response(null, { status: 204 });
  }
  if (!body || typeof body !== "object") return new Response(null, { status: 204 });

  const rec = body as Record<string, unknown>;
  const p = typeof rec.p === "string" ? normalizePath(rec.p) : null;
  if (!p) return new Response(null, { status: 204 });

  const r = typeof rec.r === "string" ? rec.r.slice(0, 300) : "";
  const s = typeof rec.s === "string" ? rec.s : "";
  const w = typeof rec.w === "number" && Number.isFinite(rec.w) ? rec.w : 0;

  try {
    await recordVisit({ path: p, referrer: r, session: s, width: w, ua, ip });
  } catch {
    /* disk full or similar; never fail the page */
  }
  return new Response(null, { status: 204 });
}

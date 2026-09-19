import { TRACK_PATH, isSkippedPath } from "./config";

const SID_KEY = "vf.sid";
const DEDUPE_MS = 800;

let lastPath = "";
let lastAt = 0;

function sessionId(): string {
  try {
    let id = sessionStorage.getItem(SID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SID_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}

function pathFromUrl(url: string): string {
  try {
    const u = url.startsWith("http") ? new URL(url) : new URL(url, location.origin);
    let p = u.pathname || "/";
    if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
    return p;
  } catch {
    return "/";
  }
}

/** Fire-and-forget pageview. Safe to call from instrumentation-client. */
export function trackPageview(url?: string): void {
  try {
    if (typeof navigator !== "undefined" && navigator.doNotTrack === "1") return;
    const p = pathFromUrl(url ?? location.href);
    if (isSkippedPath(p)) return;
    const now = Date.now();
    if (p === lastPath && now - lastAt < DEDUPE_MS) return;
    lastPath = p;
    lastAt = now;

    const body = JSON.stringify({
      p,
      r: typeof document !== "undefined" ? document.referrer : "",
      s: sessionId(),
      w: typeof window !== "undefined" ? window.innerWidth : 0,
    });
    const blob = new Blob([body], { type: "application/json" });
    if (typeof navigator !== "undefined" && navigator.sendBeacon?.(TRACK_PATH, blob)) return;
    void fetch(TRACK_PATH, {
      method: "POST",
      body,
      keepalive: true,
      headers: { "content-type": "application/json" },
    });
  } catch {
    /* analytics must never break the page */
  }
}

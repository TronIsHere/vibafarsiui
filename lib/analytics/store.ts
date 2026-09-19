import "server-only";
import { createHash } from "node:crypto";
import { appendFile, mkdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { formatJalaliNumeric, toJalali, JALALI_MONTHS } from "@/lib/jalali";
import { fa } from "@/lib/utils";
import { BOT_UA, type RangeKey } from "./config";

export type Device = "desktop" | "mobile" | "tablet";

export type Visit = {
  t: number;
  p: string;
  r: string;
  v: string;
  s: string;
  d: Device;
};

export type NamedCount = { name: string; views: number };

export type Stats = {
  views: number;
  visitors: number;
  pages: number;
  referrers: number;
  viewsDelta: number | null;
  visitorsDelta: number | null;
  series: { key: string; label: string; views: number }[];
  topPages: NamedCount[];
  topReferrers: NamedCount[];
  devices: { key: Device; label: string; views: number }[];
  recent: { t: number; p: string; r: string; d: Device }[];
};

const FILE = path.join(/* turbopackIgnore: true */ process.cwd(), "data", "analytics.jsonl");
const OWN_HOSTS = new Set([
  "vibefarsi.ir",
  "www.vibefarsi.ir",
  "vibefarsi.dev",
  "www.vibefarsi.dev",
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
]);

function isOwnHost(host: string): boolean {
  if (OWN_HOSTS.has(host)) return true;
  return /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host);
}
const TZ = "Asia/Tehran";

const DEVICE_LABEL: Record<Device, string> = {
  desktop: "دسکتاپ",
  mobile: "موبایل",
  tablet: "تبلت",
};

let writeChain = Promise.resolve();
let cache: { mtimeMs: number; visits: Visit[] } | null = null;

function enqueue(fn: () => Promise<void>): Promise<void> {
  const run = writeChain.then(fn, fn);
  writeChain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function visitorId(ip: string, ua: string): string {
  const salt = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "vf";
  return createHash("sha256").update(`${ip}|${ua}|${salt}`).digest("hex").slice(0, 16);
}

export function classifyDevice(ua: string, width = 0): Device {
  if (/iPad|Tablet/i.test(ua) || (width >= 768 && width < 1100 && /Mobile/i.test(ua))) return "tablet";
  if (/Mobile|Android|iPhone|webOS|Opera Mini/i.test(ua) || (width > 0 && width < 768)) return "mobile";
  return "desktop";
}

export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "0";
  return headers.get("x-real-ip") || headers.get("cf-connecting-ip") || "0";
}

export function isBot(ua: string): boolean {
  return !ua || BOT_UA.test(ua);
}

function referrerHost(raw: string): string {
  if (!raw) return "";
  try {
    const host = new URL(raw).hostname.replace(/^www\./, "").toLowerCase();
    if (!host || isOwnHost(host)) return "";
    return host.slice(0, 80);
  } catch {
    return "";
  }
}

export type IngestInput = {
  path: string;
  referrer: string;
  session: string;
  width: number;
  ua: string;
  ip: string;
};

export async function recordVisit(input: IngestInput): Promise<void> {
  if (isBot(input.ua)) return;
  const visit: Visit = {
    t: Date.now(),
    p: input.path,
    r: referrerHost(input.referrer),
    v: visitorId(input.ip, input.ua),
    s: input.session.slice(0, 40),
    d: classifyDevice(input.ua, input.width),
  };
  const line = JSON.stringify(visit) + "\n";
  await enqueue(async () => {
    await mkdir(path.dirname(FILE), { recursive: true });
    await appendFile(FILE, line, "utf8");
    if (cache) cache.visits.push(visit);
  });
}

function parseLine(line: string): Visit | null {
  if (!line) return null;
  try {
    const row = JSON.parse(line) as Partial<Visit>;
    if (typeof row.t !== "number" || typeof row.p !== "string" || typeof row.v !== "string") return null;
    return {
      t: row.t,
      p: row.p,
      r: typeof row.r === "string" ? row.r : "",
      v: row.v,
      s: typeof row.s === "string" ? row.s : "",
      d: row.d === "mobile" || row.d === "tablet" || row.d === "desktop" ? row.d : "desktop",
    };
  } catch {
    return null;
  }
}

async function loadVisits(): Promise<Visit[]> {
  let mtimeMs = 0;
  try {
    mtimeMs = (await stat(FILE)).mtimeMs;
  } catch {
    return [];
  }
  if (cache && cache.mtimeMs === mtimeMs) return cache.visits;
  const raw = await readFile(FILE, "utf8");
  const visits: Visit[] = [];
  for (const line of raw.split("\n")) {
    const v = parseLine(line);
    if (v) visits.push(v);
  }
  cache = { mtimeMs, visits };
  return visits;
}

function rangeMs(range: RangeKey): number | null {
  if (range === "1d") return 24 * 60 * 60 * 1000;
  if (range === "7d") return 7 * 24 * 60 * 60 * 1000;
  if (range === "30d") return 30 * 24 * 60 * 60 * 1000;
  return null;
}

function tehranParts(ts: number): { day: string; hour: number } {
  const dtf = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hourCycle: "h23",
  });
  const parts = dtf.formatToParts(new Date(ts));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return { day: `${get("year")}-${get("month")}-${get("day")}`, hour: Number(get("hour")) };
}

function jalaliDayLabel(isoDay: string): string {
  const [y, m, d] = isoDay.split("-").map(Number);
  const j = toJalali(new Date(y, m - 1, d, 12));
  return `${fa(j.jd)} ${JALALI_MONTHS[j.jm - 1]}`;
}

function pctDelta(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return Math.round(((current - previous) / previous) * 100);
}

function countUniques(rows: Visit[]): number {
  const set = new Set<string>();
  for (const row of rows) set.add(row.v);
  return set.size;
}

function visitReferrer(row: Visit): string {
  if (!row.r || isOwnHost(row.r)) return "";
  return row.r;
}

function top(rows: Visit[], pick: (row: Visit) => string, limit: number): NamedCount[] {
  const map = new Map<string, number>();
  for (const row of rows) {
    const key = pick(row);
    if (!key) continue;
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, views]) => ({ name, views }));
}

function buildSeries(rows: Visit[], range: RangeKey, now: number): Stats["series"] {
  if (range === "1d") {
    const series: Stats["series"] = [];
    const index = new Map<string, number>();
    for (let i = 23; i >= 0; i--) {
      const ts = now - i * 60 * 60 * 1000;
      const { day, hour } = tehranParts(ts);
      const key = `${day}T${String(hour).padStart(2, "0")}`;
      index.set(key, series.length);
      series.push({
        key,
        label: `${fa(String(hour).padStart(2, "0"))}:۰۰`,
        views: 0,
      });
    }
    const from = now - 24 * 60 * 60 * 1000;
    for (const row of rows) {
      if (row.t < from) continue;
      const { day, hour } = tehranParts(row.t);
      const i = index.get(`${day}T${String(hour).padStart(2, "0")}`);
      if (i != null) series[i].views += 1;
    }
    return series;
  }

  const days = range === "7d" ? 7 : 30;
  const series: Stats["series"] = [];
  const index = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) {
    const ts = now - i * 24 * 60 * 60 * 1000;
    const key = tehranParts(ts).day;
    index.set(key, series.length);
    series.push({ key, label: jalaliDayLabel(key), views: 0 });
  }
  const from = now - days * 24 * 60 * 60 * 1000;
  for (const row of rows) {
    if (row.t < from) continue;
    const i = index.get(tehranParts(row.t).day);
    if (i != null) series[i].views += 1;
  }
  return series;
}

export async function getStats(range: RangeKey): Promise<Stats> {
  const visits = await loadVisits();
  const now = Date.now();
  const window = rangeMs(range);
  const from = window == null ? 0 : now - window;
  const current = visits.filter((v) => v.t >= from);
  const previous =
    window == null ? [] : visits.filter((v) => v.t >= from - window && v.t < from);

  const views = current.length;
  const visitors = countUniques(current);
  const devicesOrder: Device[] = ["desktop", "mobile", "tablet"];
  const deviceCounts = new Map<Device, number>();
  for (const row of current) deviceCounts.set(row.d, (deviceCounts.get(row.d) ?? 0) + 1);

  const referrerRows = top(current, visitReferrer, 8);
  const direct = current.filter((v) => !visitReferrer(v)).length;
  const topReferrers =
    direct > 0 ? [{ name: "ورود مستقیم", views: direct }, ...referrerRows] : referrerRows;

  return {
    views,
    visitors,
    pages: new Set(current.map((v) => v.p)).size,
    referrers: referrerRows.length,
    viewsDelta: window == null ? null : pctDelta(views, previous.length),
    visitorsDelta: window == null ? null : pctDelta(visitors, countUniques(previous)),
    series: buildSeries(current, range, now),
    topPages: top(current, (v) => v.p, 10),
    topReferrers: topReferrers.slice(0, 8),
    devices: devicesOrder.map((key) => ({
      key,
      label: DEVICE_LABEL[key],
      views: deviceCounts.get(key) ?? 0,
    })),
    recent: [...current]
      .slice(-20)
      .reverse()
      .map((v) => ({ t: v.t, p: v.p, r: visitReferrer(v), d: v.d })),
  };
}

export function startedOnLabel(range: RangeKey): string {
  const window = rangeMs(range);
  if (window == null) return "از ابتدا";
  return `از ${formatJalaliNumeric(new Date(Date.now() - window))}`;
}

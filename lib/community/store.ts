import "server-only";
import { randomBytes } from "node:crypto";
import { mkdir, readdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Submission, SubmissionStatus } from "./types";

/** One JSON file per submission, next to the analytics log (same persistent `data/` dir). */
const ROOT = path.join(/* turbopackIgnore: true */ process.cwd(), "data", "community");
const ITEMS = path.join(ROOT, "items");
export const MEDIA_DIR = path.join(ROOT, "media");

const ID_RE = /^[a-z0-9]{10}$/;
export const MEDIA_RE = /^[a-z0-9]{10}\.(png|jpg|webp)$/;

export function newId(): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = randomBytes(10);
  let id = "";
  for (const b of bytes) id += alphabet[b % alphabet.length];
  return id;
}

export function isValidId(id: string): boolean {
  return ID_RE.test(id);
}

async function writeJson(file: string, data: unknown): Promise<void> {
  const tmp = `${file}.${process.pid}.tmp`;
  await writeFile(tmp, JSON.stringify(data));
  await rename(tmp, file);
}

export async function saveSubmission(item: Submission): Promise<void> {
  await mkdir(ITEMS, { recursive: true });
  await writeJson(path.join(ITEMS, `${item.id}.json`), item);
}

export async function getSubmission(id: string): Promise<Submission | null> {
  if (!isValidId(id)) return null;
  try {
    return JSON.parse(await readFile(path.join(ITEMS, `${id}.json`), "utf8")) as Submission;
  } catch {
    return null;
  }
}

export async function listSubmissions(filter?: {
  status?: SubmissionStatus;
  kinds?: Submission["kind"][];
}): Promise<Submission[]> {
  let names: string[];
  try {
    names = await readdir(ITEMS);
  } catch {
    return [];
  }
  const items = await Promise.all(
    names
      .filter((n) => n.endsWith(".json"))
      .map(async (n) => {
        try {
          return JSON.parse(await readFile(path.join(ITEMS, n), "utf8")) as Submission;
        } catch {
          return null;
        }
      }),
  );
  return items
    .filter((it): it is Submission => !!it)
    .filter((it) => !filter?.status || it.status === filter.status)
    .filter((it) => !filter?.kinds || filter.kinds.includes(it.kind))
    .sort((a, b) => (b.reviewedAt ?? b.createdAt) - (a.reviewedAt ?? a.createdAt));
}

export async function setStatus(id: string, status: SubmissionStatus): Promise<boolean> {
  const item = await getSubmission(id);
  if (!item) return false;
  await saveSubmission({ ...item, status, reviewedAt: Date.now() });
  return true;
}

export async function deleteSubmission(id: string): Promise<void> {
  const item = await getSubmission(id);
  if (!item) return;
  if (item.kind === "showcase" && item.image && MEDIA_RE.test(item.image)) {
    await rm(path.join(MEDIA_DIR, item.image), { force: true });
  }
  await rm(path.join(ITEMS, `${id}.json`), { force: true });
}

export async function saveMedia(name: string, bytes: Uint8Array): Promise<void> {
  if (!MEDIA_RE.test(name)) throw new Error("bad media name");
  await mkdir(MEDIA_DIR, { recursive: true });
  await writeFile(path.join(MEDIA_DIR, name), bytes);
}

export async function readMedia(name: string): Promise<Buffer | null> {
  if (!MEDIA_RE.test(name)) return null;
  try {
    return await readFile(path.join(MEDIA_DIR, name));
  } catch {
    return null;
  }
}

/** Sniffs PNG / JPEG / WebP from magic bytes; the declared MIME type is not trusted. */
export function imageExt(bytes: Uint8Array): "png" | "jpg" | "webp" | null {
  if (bytes.length > 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "png";
  if (bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpg";
  if (
    bytes.length > 12 &&
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP"
  ) {
    return "webp";
  }
  return null;
}

const hits = new Map<string, number[]>();

/** In-memory sliding window per IP: 6 submissions an hour. */
export function submitAllowed(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const prev = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  if (prev.length >= 6) {
    hits.set(ip, prev);
    return false;
  }
  prev.push(now);
  hits.set(ip, prev);
  return true;
}

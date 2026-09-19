import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { SESSION_COOKIE, SESSION_DAYS } from "./config";

function secret(): string {
  return process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "";
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD);
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  const len = Math.max(ba.length, bb.length, 1);
  const pa = Buffer.alloc(len);
  const pb = Buffer.alloc(len);
  ba.copy(pa);
  bb.copy(pb);
  return timingSafeEqual(pa, pb) && ba.length === bb.length;
}

export function passwordMatches(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(password, expected);
}

export function signSession(now = Date.now()): string {
  const exp = now + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = `1.${exp}`;
  const sig = createHmac("sha256", secret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function sessionIsValid(token: string | undefined, now = Date.now()): boolean {
  if (!token || !secret()) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [ver, expRaw, sig] = parts;
  if (ver !== "1") return false;
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp < now) return false;
  const payload = `${ver}.${expRaw}`;
  const expected = createHmac("sha256", secret()).update(payload).digest("hex");
  return safeEqual(sig, expected);
}

export async function isAdminSession(): Promise<boolean> {
  const jar = await cookies();
  return sessionIsValid(jar.get(SESSION_COOKIE)?.value);
}

export async function setAdminCookie(): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, signSession(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function clearAdminCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

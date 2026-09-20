#!/usr/bin/env node
/**
 * Snapshot block + template preview routes, compress to WebP, write public/previews.
 * Templates are cropped to a top-right (RTL start) peek, matching the catalog cards.
 *
 * Usage: npm run previews
 * Needs the Next app on http://localhost:3000 and Google Chrome (macOS default path).
 */
import { mkdir, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);
const sharp = require("sharp");
const { chromium } = require("playwright-core");

const ROOT = path.resolve(import.meta.dirname, "..");
const BASE = process.env.PREVIEW_ORIGIN ?? "http://localhost:3000";
const CHROME =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT = path.join(ROOT, "public/previews");

function slugsFrom(file) {
  const text = require("node:fs").readFileSync(file, "utf8");
  return [...text.matchAll(/\bslug:\s*"([^"]+)"/g)].map((m) => m[1]);
}

async function waitForServer() {
  for (let i = 0; i < 40; i++) {
    try {
      const res = await fetch(BASE, { redirect: "manual" });
      if (res.ok || res.status === 307 || res.status === 308) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`No server at ${BASE}. Start it with npm run dev.`);
}

async function compress(png, { maxWidth, maxHeight }) {
  return sharp(png)
    .resize({
      width: maxWidth,
      height: maxHeight,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 72, effort: 6, smartSubsample: true })
    .toBuffer();
}

/**
 * Catalog peeks:
 * - start: top-right (RTL) corner — sidebars / full-bleed layouts
 * - center: middle of the page — centered cards (auth, receipt, …)
 * - top: top-center — hero / pricing pages
 */
const PEEK_MODE = {
  auth: "center",
  onboarding: "center",
  "error-pages": "center",
  receipt: "center",
  ride: "center",
  "startup-landing": "top",
  pricing: "top",
};

async function peekCompress(png, mode = "start") {
  const meta = await sharp(png).metadata();
  const w = meta.width ?? 1280;
  const h = meta.height ?? 900;

  if (mode === "center" || mode === "top") {
    // Rough middle (or top-middle) extract, then trim empty canvas so the UI fills the card.
    const cropW = Math.min(Math.max(1, Math.round(w * (mode === "top" ? 0.78 : 0.46))), w);
    const cropH = Math.min(Math.max(1, Math.round(h * (mode === "top" ? 0.7 : 0.82))), h);
    const left = Math.max(0, Math.min(w - cropW, Math.round((w - cropW) / 2)));
    const top =
      mode === "top"
        ? Math.max(0, Math.min(h - cropH, Math.round(h * 0.04)))
        : Math.max(0, Math.min(h - cropH, Math.round((h - cropH) / 2)));

    // extract+trim cannot be chained in this sharp build; buffer between steps.
    let buf = await sharp(png)
      .extract({ left, top, width: cropW, height: cropH })
      .png()
      .toBuffer();

    try {
      buf = await sharp(buf).trim({ background: "#000000", threshold: 16 }).png().toBuffer();
    } catch {
      /* keep untrimmed if the canvas has no clear edge */
    }

    return sharp(buf)
      .resize({
        width: 720,
        height: 480,
        fit: "cover",
        position: "centre",
      })
      .webp({ quality: 72, effort: 6, smartSubsample: true })
      .toBuffer();
  }

  const cropW = Math.min(Math.round(w * 0.62), w);
  const cropH = Math.min(Math.round(h * 0.55), h);
  return sharp(png)
    .extract({ left: w - cropW, top: 0, width: cropW, height: cropH })
    .resize({
      width: 720,
      height: 480,
      fit: "cover",
      position: "right top",
    })
    .webp({ quality: 72, effort: 6, smartSubsample: true })
    .toBuffer();
}

async function shot(page, url, selector) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45_000 });
  await page.waitForSelector(selector, { timeout: 20_000 });
  await page.addStyleTag({
    content:
      "nextjs-portal,[data-nextjs-toast],[data-next-badge-root]{display:none!important}",
  });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 600));
  const el = page.locator(selector).first();
  return el.screenshot({ type: "png", animations: "disabled" });
}

async function shotPage(page, url) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await page.waitForSelector("body", { timeout: 20_000 });
  await page.addStyleTag({
    content:
      "nextjs-portal,[data-nextjs-toast],[data-next-badge-root]{display:none!important}",
  });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 800));
  return page.screenshot({ type: "png", animations: "disabled", fullPage: false });
}

async function main() {
  const blocks = slugsFrom(path.join(ROOT, "lib/registry/blocks.ts"));
  const templates = slugsFrom(path.join(ROOT, "lib/registry/templates.ts"));

  await waitForServer();
  await mkdir(path.join(OUT, "blocks"), { recursive: true });
  await mkdir(path.join(OUT, "templates"), { recursive: true });
  await rm(path.join(OUT, "components"), { recursive: true, force: true });

  const browser = await chromium.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--hide-scrollbars", "--font-render-hinting=none"],
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: "dark",
    reducedMotion: "reduce",
    locale: "fa-IR",
  });
  const page = await context.newPage();
  await page.addInitScript(() => {
    document.documentElement.style.caretColor = "transparent";
  });

  let failed = 0;

  const only = process.env.PREVIEW_ONLY
    ? new Set(process.env.PREVIEW_ONLY.split(",").map((s) => s.trim()).filter(Boolean))
    : null;

  for (const slug of blocks) {
    if (only && !only.has(slug)) continue;
    const dest = path.join(OUT, "blocks", `${slug}.webp`);
    try {
      const png = await shot(
        page,
        `${BASE}/preview/block/${slug}?theme=graphite`,
        "[data-preview-root]",
      );
      const webp = await compress(png, { maxWidth: 1280, maxHeight: 720 });
      await writeFile(dest, webp);
      console.log(`block     ${slug}  ${(webp.length / 1024).toFixed(1)}kb`);
    } catch (err) {
      failed++;
      console.error(`block     ${slug}  FAIL  ${err.message}`);
    }
  }

  for (const slug of templates) {
    if (only && !only.has(slug)) continue;
    const dest = path.join(OUT, "templates", `${slug}.webp`);
    const mode = PEEK_MODE[slug] ?? "start";
    try {
      const png = await shotPage(page, `${BASE}/preview/${slug}?theme=graphite`);
      const webp = await peekCompress(png, mode);
      await writeFile(dest, webp);
      console.log(`template  ${slug}  (${mode})  ${(webp.length / 1024).toFixed(1)}kb`);
    } catch (err) {
      failed++;
      console.error(`template  ${slug}  FAIL  ${err.message}`);
    }
  }

  await browser.close();

  const templateCount = only
    ? templates.filter((s) => only.has(s)).length
    : templates.length;
  const blockCount = only ? blocks.filter((s) => only.has(s)).length : blocks.length;
  const total = blockCount + templateCount;
  console.log(`\nWrote ${total - failed}/${total} snapshots under public/previews`);
  if (failed) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

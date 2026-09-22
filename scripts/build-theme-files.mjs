// Regenerates the copyable design-system files in registry/themes/*.css from
// app/globals.css, so the tokens users copy always match what the site renders.
//
//   node scripts/build-theme-files.mjs
//
// globals.css splits each system in two (palette on [data-theme], language on
// [data-ds] scopes, graphite's language as the shared default). The copyable
// file merges both into one complete block, and swaps next/font variables for
// plain family names that a Google Fonts <link> or @import provides.

import fs from "node:fs";
import path from "node:path";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const css = fs.readFileSync(path.join(root, "app/globals.css"), "utf8");

const HEADERS = {
  graphite: "گرافیت، مینیمال فنی و تم پیش‌فرض. این بلوک را در :root بگذارید.",
  turquoise: "فیروزه، شیشه‌ای. تیترها با Noto Kufi Arabic هستن.",
  saffron: "زعفران، نئوبروتالیسم. تیترها با Lalezar هستن.",
  pomegranate: "انار، خمیری. متن و تیتر با Vazirmatn هستن.",
  lapis: "لاجورد، ترمینال. متن و تیتر با IBM Plex Sans Arabic هستن.",
  paper: "کاغذ، مجله‌ای. تیترها با Noto Naskh Arabic هستن.",
};

const FONTS = {
  "--font-iransans": '"IRANSans", "Vazirmatn"',
  "--font-lalezar": '"Lalezar"',
  "--font-naskh": '"Noto Naskh Arabic"',
  "--font-vazirmatn": '"Vazirmatn"',
  "--font-kufi": '"Noto Kufi Arabic"',
  "--font-plex-arabic": '"IBM Plex Sans Arabic"',
};

/** Declarations of the first rule whose selector text equals `selector`. */
function block(selector) {
  const at = css.indexOf(`${selector} {`);
  if (at < 0) throw new Error(`Missing rule: ${selector}`);
  const open = css.indexOf("{", at);
  const close = css.indexOf("\n}", open);
  return declarations(css.slice(open + 1, close));
}

function declarations(body) {
  const out = new Map();
  const clean = body.replace(/\/\*[\s\S]*?\*\//g, "");
  for (const part of clean.split(";")) {
    const i = part.indexOf(":");
    if (i < 0) continue;
    const name = part.slice(0, i).trim();
    if (!name) continue;
    out.set(name, part.slice(i + 1).trim().replace(/\s+/g, " "));
  }
  return out;
}

function fonts(value) {
  return value.replace(/var\((--font-[a-z-]+)\)/g, (m, v) => FONTS[v] ?? m);
}

const graphiteLanguage = block(':root,\n[data-theme],\n[data-theme="graphite"][data-ds]');
const COLOR_ORDER = [...block('[data-theme="graphite"]').keys()];

for (const slug of Object.keys(HEADERS)) {
  const palette = block(`[data-theme="${slug}"]`);
  const language = new Map(graphiteLanguage);
  if (slug !== "graphite") {
    for (const [k, v] of block(`[data-theme="${slug}"][data-ds],\n:where([data-theme="${slug}"]) [data-ds]`)) language.set(k, v);
  }
  // IRANSans is the body font the project already loads; only systems that
  // change type ship --type-* tokens. --density is Tailwind's --spacing.
  for (const k of ["--type-body", "--type-display"]) {
    if (language.get(k) === graphiteLanguage.get(k)) language.delete(k);
  }

  const lines = [`/* ${HEADERS[slug]} */`, slug === "graphite" ? ":root {" : `[data-theme="${slug}"] {`];
  lines.push(`  color-scheme: ${palette.get("color-scheme")};`, "", "  /* رنگ */");
  for (const k of COLOR_ORDER) {
    if (k === "color-scheme") continue;
    // A language block may redraw a color for previews (saffron's full-ink lines); that value wins.
    const v = language.get(k) ?? palette.get(k) ?? block('[data-theme="graphite"]').get(k);
    language.delete(k);
    lines.push(`  ${k}: ${v};`);
  }
  lines.push("", "  /* زبان طراحی: فونت، فرم، خط، عمق، حرکت و تراکم */");
  for (const [k, v] of language) {
    const name = k === "--density" ? "--spacing" : k;
    lines.push(`  ${name}: ${fonts(v)};`);
  }
  lines.push("}", "");
  fs.writeFileSync(path.join(root, `registry/themes/${slug}.css`), lines.join("\n"));
  console.log(`registry/themes/${slug}.css`);
}

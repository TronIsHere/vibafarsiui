/**
 * Safari/WebKit still lays Arabic-script glyphs on SVG <textPath> without
 * shaping or bidi. Pre-shape to presentation forms, then emit LTR visual
 * order so a forced `unicode-bidi: bidi-override; direction: ltr` looks
 * correct in Safari and in Blink/Gecko.
 */

type Forms = { isol: string; init?: string; medi?: string; fina?: string };

/** Dual-joining and right-joining Arabic/Persian letters → presentation forms. */
const FORMS: Record<string, Forms> = {
  ا: { isol: "ﺍ", fina: "ﺎ" },
  أ: { isol: "ﺃ", fina: "ﺄ" },
  إ: { isol: "ﺇ", fina: "ﺈ" },
  آ: { isol: "ﺁ", fina: "ﺂ" },
  ب: { isol: "ﺏ", init: "ﺑ", medi: "ﺒ", fina: "ﺐ" },
  پ: { isol: "ﭖ", init: "ﭘ", medi: "ﭙ", fina: "ﭗ" },
  ت: { isol: "ﺕ", init: "ﺗ", medi: "ﺘ", fina: "ﺖ" },
  ث: { isol: "ﺙ", init: "ﺛ", medi: "ﺜ", fina: "ﺚ" },
  ج: { isol: "ﺝ", init: "ﺟ", medi: "ﺠ", fina: "ﺞ" },
  چ: { isol: "ﭺ", init: "ﭼ", medi: "ﭽ", fina: "ﭻ" },
  ح: { isol: "ﺡ", init: "ﺣ", medi: "ﺤ", fina: "ﺢ" },
  خ: { isol: "ﺥ", init: "ﺧ", medi: "ﺨ", fina: "ﺦ" },
  د: { isol: "ﺩ", fina: "ﺪ" },
  ذ: { isol: "ﺫ", fina: "ﺬ" },
  ر: { isol: "ﺭ", fina: "ﺮ" },
  ز: { isol: "ﺯ", fina: "ﺰ" },
  ژ: { isol: "ﮊ", fina: "ﮋ" },
  س: { isol: "ﺱ", init: "ﺳ", medi: "ﺴ", fina: "ﺲ" },
  ش: { isol: "ﺵ", init: "ﺷ", medi: "ﺸ", fina: "ﺶ" },
  ص: { isol: "ﺹ", init: "ﺻ", medi: "ﺼ", fina: "ﺺ" },
  ض: { isol: "ﺽ", init: "ﺿ", medi: "ﻀ", fina: "ﺾ" },
  ط: { isol: "ﻁ", init: "ﻃ", medi: "ﻄ", fina: "ﻂ" },
  ظ: { isol: "ﻅ", init: "ﻇ", medi: "ﻈ", fina: "ﻆ" },
  ع: { isol: "ﻉ", init: "ﻋ", medi: "ﻌ", fina: "ﻊ" },
  غ: { isol: "ﻍ", init: "ﻏ", medi: "ﻐ", fina: "ﻎ" },
  ف: { isol: "ﻑ", init: "ﻓ", medi: "ﻔ", fina: "ﻒ" },
  ق: { isol: "ﻕ", init: "ﻗ", medi: "ﻘ", fina: "ﻖ" },
  ک: { isol: "ﮎ", init: "ﮐ", medi: "ﮑ", fina: "ﮏ" },
  ك: { isol: "ﻙ", init: "ﻛ", medi: "ﻜ", fina: "ﻚ" },
  گ: { isol: "ﮒ", init: "ﮔ", medi: "ﮕ", fina: "ﮓ" },
  ل: { isol: "ﻝ", init: "ﻟ", medi: "ﻠ", fina: "ﻞ" },
  م: { isol: "ﻡ", init: "ﻣ", medi: "ﻤ", fina: "ﻢ" },
  ن: { isol: "ﻥ", init: "ﻧ", medi: "ﻨ", fina: "ﻦ" },
  و: { isol: "ﻭ", fina: "ﻮ" },
  ه: { isol: "ﻩ", init: "ﻫ", medi: "ﻬ", fina: "ﻪ" },
  ة: { isol: "ﺓ", fina: "ﺔ" },
  ی: { isol: "ﯼ", init: "ﯾ", medi: "ﯿ", fina: "ﯽ" },
  ي: { isol: "ﻱ", init: "ﻳ", medi: "ﻴ", fina: "ﻲ" },
  ئ: { isol: "ﺉ", init: "ﺋ", medi: "ﺌ", fina: "ﺊ" },
  ؤ: { isol: "ﺅ", fina: "ﺆ" },
  ء: { isol: "ء" },
};

const ZWNJ = "\u200C";
const ZWJ = "\u200D";

function normalizeLetter(ch: string) {
  if (ch === "ي") return "ی";
  if (ch === "ك") return "ک";
  return ch;
}

function isJoinable(ch: string) {
  const f = FORMS[normalizeLetter(ch)];
  return Boolean(f && (f.init || f.medi || f.fina));
}

function joinsNext(ch: string) {
  const f = FORMS[normalizeLetter(ch)];
  return Boolean(f?.init || f?.medi);
}

/** Logical Arabic/Persian → presentation forms (joining preserved without a shaper). */
export function reshapeArabic(input: string): string {
  const chars = Array.from(input).map(normalizeLetter);
  let out = "";
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i];
    const forms = FORMS[ch];
    if (!forms) {
      out += ch;
      continue;
    }
    const prev = chars[i - 1];
    const next = chars[i + 1];
    const prevJoins = prev && prev !== ZWNJ && joinsNext(prev) && isJoinable(ch);
    const nextJoins = next && next !== ZWNJ && joinsNext(ch) && isJoinable(next);
    // ZWJ forces a join even across a gap the font would skip.
    const forcePrev = prev === ZWJ;
    const forceNext = next === ZWJ;
    const linkPrev = prevJoins || forcePrev;
    const linkNext = nextJoins || forceNext;

    if (linkPrev && linkNext && forms.medi) out += forms.medi;
    else if (linkPrev && forms.fina) out += forms.fina;
    else if (linkNext && forms.init) out += forms.init;
    else out += forms.isol;
  }
  return out.replaceAll(ZWJ, "");
}

const RTL_RE =
  /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
const LTR_RE = /[A-Za-z0-9\u0660-\u0669\u06F0-\u06F9]/;

type RunKind = "rtl" | "ltr" | "neutral";

function runKind(ch: string): RunKind {
  if (RTL_RE.test(ch)) return "rtl";
  if (LTR_RE.test(ch)) return "ltr";
  return "neutral";
}

/**
 * RTL-base visual order for an already-reshaped string. LTR islands (Latin,
 * digits) keep their internal order; RTL runs are reversed.
 */
export function rtlVisualOrder(reshaped: string): string {
  const chars = Array.from(reshaped);
  if (chars.length === 0) return "";

  type Run = { kind: RunKind; text: string };
  const runs: Run[] = [];
  for (const ch of chars) {
    const kind = runKind(ch);
    const last = runs[runs.length - 1];
    if (last && last.kind === kind) last.text += ch;
    else runs.push({ kind, text: ch });
  }

  // Neutrals pick LTR only when sandwiched by LTR (or at an LTR-only edge).
  for (let i = 0; i < runs.length; i++) {
    if (runs[i].kind !== "neutral") continue;
    const prev = runs.slice(0, i).reverse().find((r) => r.kind !== "neutral");
    const next = runs.slice(i + 1).find((r) => r.kind !== "neutral");
    runs[i].kind =
      prev?.kind === "ltr" && next?.kind === "ltr"
        ? "ltr"
        : prev?.kind === "ltr" && !next
          ? "ltr"
          : next?.kind === "ltr" && !prev
            ? "ltr"
            : "rtl";
  }

  // Merge adjacent runs of the same resolved kind.
  const merged: Run[] = [];
  for (const run of runs) {
    const last = merged[merged.length - 1];
    if (last && last.kind === run.kind) last.text += run.text;
    else merged.push({ ...run });
  }

  // RTL paragraph: reverse run order; reverse characters inside RTL runs.
  return merged
    .reverse()
    .map((run) => (run.kind === "rtl" ? Array.from(run.text).reverse().join("") : run.text))
    .join("");
}

/** Logical Persian/Arabic (and mixed) copy → string safe for LTR SVG textPath. */
export function forSvgTextPath(logical: string): string {
  return rtlVisualOrder(reshapeArabic(logical));
}

export type PathGlyph = {
  ch: string;
  x: number;
  y: number;
  rotate: number;
};

/**
 * Lay pre-shaped visual characters along an SVG path. Avoids <textPath>, which
 * Safari still fails to shape/bidi and whose negative startOffset is a no-op.
 * `offset` shifts the run along the path; for open paths only glyphs whose
 * center falls on [0, pathLength] are returned.
 */
export function layoutGlyphsOnPath(
  path: SVGPathElement,
  chars: string[],
  widths: number[],
  offset: number,
  closed: boolean,
): PathGlyph[] {
  const pathLen = path.getTotalLength();
  if (!pathLen || chars.length === 0) return [];

  let cursor = -offset;
  const out: PathGlyph[] = [];

  for (let i = 0; i < chars.length; i++) {
    const width = widths[i] ?? 0;
    const mid = cursor + width / 2;
    cursor += width;

    let d = mid;
    if (closed) {
      d = ((d % pathLen) + pathLen) % pathLen;
    } else if (mid < 0 || mid > pathLen) {
      continue;
    } else {
      d = Math.max(0, Math.min(pathLen, mid));
    }

    const p = path.getPointAtLength(d);
    const delta = Math.min(0.75, pathLen / 100);
    const d2 = closed
      ? (d + delta) % pathLen
      : Math.max(0, Math.min(pathLen, d + delta));
    const p2 = path.getPointAtLength(d2);
    const rotate = (Math.atan2(p2.y - p.y, p2.x - p.x) * 180) / Math.PI;
    out.push({ ch: chars[i], x: p.x, y: p.y, rotate });
  }

  return out;
}

/** Measure each character of a visual string with the live SVG text element. */
export function measureGlyphWidths(measureEl: SVGTextElement, visual: string): number[] {
  measureEl.textContent = visual;
  const chars = Array.from(visual);
  const widths: number[] = [];
  for (let i = 0; i < chars.length; i++) {
    try {
      widths.push(measureEl.getExtentOfChar(i).width);
    } catch {
      widths.push(measureEl.getComputedTextLength() / Math.max(1, chars.length));
    }
  }
  return widths;
}

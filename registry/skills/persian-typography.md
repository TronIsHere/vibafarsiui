# Persian typography guide (راهنمای تایپوگرافی فارسی)

A reference for humans and coding agents: which fonts to use and how to load
them, sizes and spacing that read well in Persian, digits, mixed Persian and
Latin text, and the CSS that keeps letters joined. Drop it in the repo and
link it from `CLAUDE.md` or `AGENTS.md`, or read it once before styling a
Persian interface.

## 1. Choosing a font

| Font | License | Where it fits | Notes |
|---|---|---|---|
| Vazirmatn | SIL OFL, free | UI, docs, body text | Nine weights, Latin included, on Google Fonts; the safe default. |
| Shabnam / Sahel / Samim | SIL OFL, free | Body and UI alternatives | Same author family as Vazir; good Persian digits; Latin is weaker. |
| IRANSans / IRANSansX | Commercial | Corporate and banking products | Needs a license per site; commonly requested by Iranian clients. |
| Yekan Bakh | Commercial | Product UI | Popular in startups; license required. |
| Dana | Commercial | Editorial and product | Wide weight range; license required. |
| Lalezar | SIL OFL, free | Display only | Headlines and posters; never body text. |

Rules:

- One text family per product, one optional display family. Do not mix three.
- Never fall back to Inter, Roboto, Geist or `system-ui` alone for Persian;
  they either lack the glyphs or shape them poorly and the browser mixes
  fonts mid-word.
- A font stack for Persian still needs a Latin-capable font for embedded
  Latin runs (Vazirmatn covers both; for others add a Latin font after it).
- Ask the client whether they hold an IRANSans license before shipping it.

## 2. Loading fonts

Next.js with Google Fonts:

```ts
// app/fonts.ts
import { Vazirmatn } from "next/font/google";

export const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});
```

```tsx
// app/layout.tsx
<html lang="fa" dir="rtl" className={vazirmatn.variable}>
```

```css
/* globals.css (Tailwind v4) */
@theme inline {
  --font-sans: var(--font-vazirmatn), "Vazirmatn", ui-sans-serif, system-ui, sans-serif;
}
```

Self-hosted (IRANSans or any licensed font):

```ts
import localFont from "next/font/local";

export const iranSans = localFont({
  src: [
    { path: "../fonts/IRANSansX-Regular.woff2", weight: "400" },
    { path: "../fonts/IRANSansX-Medium.woff2", weight: "500" },
    { path: "../fonts/IRANSansX-Bold.woff2", weight: "700" },
  ],
  variable: "--font-iransans",
  display: "swap",
});
```

- Ship `woff2`; subset to the Arabic script block plus Latin if the tool
  allows.
- Preload only the regular weight; the rest can load with `swap`.
- Three weights (400, 500, 700) cover almost every UI; add 600 for dense
  dashboards.
- Set a metric-compatible fallback (`size-adjust`, `ascent-override`) or
  accept a small layout shift; Persian fallback fonts differ a lot in height.

## 3. Sizes and spacing

| Element | Size | Line height |
|---|---|---|
| Body / UI | 15–17px (16px default) | 1.7–1.9 |
| Long reading | 17–18px | 1.9–2.0 |
| Small labels, captions | 12–13px | 1.6 |
| Headings | any | 1.2–1.35, never below 1.15 |
| Buttons, inputs | 14–16px (16px on iOS to avoid zoom) | 1 line, vertically centred |

- Persian needs more line height than Latin: ascenders, descenders and dots
  stack above and below the baseline. 1.5 that looks fine in English is
  cramped in Persian.
- `letter-spacing: 0`, always. Tracking breaks letter joining and changes the
  shape of words. Tailwind's `tracking-tight` on a Persian headline is a bug.
- Word spacing can go slightly up for justified text, but avoid `text-justify`
  in UI; use `text-start`.
- No `uppercase`, `capitalize` or small-caps; they do nothing for Persian and
  look wrong on the Latin words next to it.
- Do not fake bold or italic (`font-synthesis`); use shipped weights. Italic
  Persian barely exists; prefer weight or color for emphasis.

## 4. Digits

- Persian digits ۰۱۲۳۴۵۶۷۸۹ (U+06F0–U+06F9) in everything the user reads.
  Arabic-Indic ٠١٢٣ (U+0660–U+0669) look different in ۴ ۵ ۶ and are wrong in
  Persian text.
- Convert at the display layer (`fa()` from VibeFarsi `lib/utils.ts`);
  keep Latin digits in values, URLs, codes and version numbers.
- Tables and prices: `font-variant-numeric: tabular-nums` (`tabular-nums` in
  Tailwind) so columns line up.
- Thousands «٬» (U+066C), decimal «٫» (U+066B), percent «٪» (U+066A) after
  the number: «۱۲٬۴۵۰٫۵ تومان»، «۲۰٪».
- Phone, card and IBAN digits are Persian on screen, Latin in the value,
  and the control is `dir="ltr"`.

## 5. Mixed Persian and Latin

- The bidi algorithm handles a Latin word inside a Persian sentence («با
  Next.js ساختیم») without help.
- Codes, SKUs, URLs and file names inside Persian text go in `<bdi>` or an
  element with `dir="ltr"`, so punctuation and digits do not jump:
  `<bdi dir="ltr">SKU-2048</bdi>`.
- Never set `dir="ltr"` on a whole Persian paragraph to "fix" one token.
- Latin brand names keep their case; do not translit unless the brand does.
- Parentheses and quotes around Latin runs: use Persian «گیومه» outside,
  Latin quotes inside if needed.

## 6. ZWNJ and spacing in HTML

- ZWNJ (نیم‌فاصله, U+200C) joins compounds visually without a space:
  می‌شود، کتاب‌ها، بزرگ‌تر. In HTML write the character or `&zwnj;`.
- Search and copy: ZWNJ is a real character; normalize it when matching user
  input (`replace(/‌/g, "")`), keep it when rendering.
- Tailwind `whitespace-nowrap` and `break-words` are fine; `break-all` is not
  (it splits joined letters).
- Truncate with `line-clamp-*` or `truncate`; never `slice()` a Persian string
  for display.
- Punctuation hugs the word: no space before «،» «؟» «!» «؛», one space after.

## 7. Alignment and direction inside components

- `text-start` not `text-right`; components then work in both directions.
- Icons next to text: `gap-2` in a flex row, no margin-left/right classes.
- Number and text in the same cell: `tabular-nums` on the number, `dir="auto"`
  on the cell if content can be either script.
- Inputs: the field is RTL by default; set `dir="ltr"` only for Latin-shaped
  values.

## 8. Quick checks

1. Zoom the page to 200%: are dots and letters still attached? If not, a
   fallback font is rendering somewhere; check `font-family` on that element.
2. Select a word: does the whole word highlight as one run? Broken joining
   means ZWNJ or letter-spacing problems.
3. Compare a price column: do the digits line up? If not, add `tabular-nums`.
4. Look at a headline with `tracking-tight`: remove it.
5. Open on a phone: inputs at 16px, body at 16px, line height ≥ 1.7.

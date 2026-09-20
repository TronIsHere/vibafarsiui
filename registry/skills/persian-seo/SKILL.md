---
name: persian-seo
description: >
  Technical and on-page SEO for Persian (Farsi) websites: lang and hreflang
  for fa-IR, RTL-safe metadata, Persian titles and descriptions, slug and URL
  strategy for Persian content, ZWNJ and keyword variants, Open Graph and
  JSON-LD in Persian, sitemaps, fonts and Core Web Vitals for Persian pages.
  Use when writing metadata, structured data, blog content or URL structure
  for an Iranian site, or when the user says سئو، سئوی فارسی، متادیتا، عنوان
  صفحه، اسلاگ، گوگل. Examples target Next.js but the rules are generic.
---

# Persian SEO (سئوی فارسی)

Search engines handle Persian well; sites do not. The usual failures are
`lang="en"` on a Persian page, `og:locale` left at `en_US`, English-only
titles, ZWNJ leaking into URLs, and machine-translated copy. Fix the
mechanics first (sections 1–5), then the content (6–8).

## 1. Document language and direction

```html
<html lang="fa" dir="rtl">
```

- `lang="fa"` (or `fa-IR`) on `<html>`; it drives hyphenation, font
  selection, screen readers and language detection.
- Mixed pages: mark Latin blocks with `lang="en"` on the element, not on the
  page.
- `hreflang`: `fa` or `fa-IR` for the Persian version, `x-default` to the
  primary language. Only add `hreflang` when a real alternate exists.

## 2. Metadata

- `<title>`: Persian, front-loaded with the page's subject, brand at the end:
  «کامپوننت‌های راست‌چین برای React · وایب‌فارسی». Keep it short; Persian
  titles are truncated by pixel width like any other, so aim for the length
  of a normal sentence, not a paragraph.
- `description`: one or two Persian sentences that answer the query, ~120–150
  characters, no «؛» lists, no keyword stuffing.
- `og:locale` is `fa_IR`; `og:title` and `og:description` in Persian;
  `og:image` with Persian text rendered in a Persian font (not a system
  fallback).
- `twitter:card` `summary_large_image` with the same Persian text.
- Canonical URLs are absolute and match the served URL byte-for-byte
  (including percent-encoding decisions from section 3).

Next.js:

```ts
export const metadata = {
  title: "کامپوننت‌های راست‌چین برای React · وایب‌فارسی",
  description: "کامپوننت‌های راست‌چین رایگان برای Next.js و React با فونت و اعداد فارسی.",
  alternates: { canonical: "/components" },
  openGraph: { locale: "fa_IR", type: "website", title: "…", description: "…" },
};
```

## 3. URLs and slugs

Two valid strategies; pick one per site and never mix:

| Strategy | Example | Pros | Cons |
|---|---|---|---|
| Persian slug | `/blog/راهنمای-تقویم-شمسی` | readable in results, matches query text | percent-encoded when shared (`%D8%B1…`), longer |
| Transliterated Latin slug | `/blog/rahnama-taghvim-shamsi` | stable, short, safe everywhere | not readable to the user in Persian |

Rules for both:

- Never put ZWNJ (U+200C) in a URL. Replace it with a hyphen when slugifying:
  «می‌شود» → `می-شود` or `mishavad`.
- Normalize Arabic ي/ك to Persian ی/ک before slugifying so two spellings do
  not create two URLs.
- Latin digits in URLs, always.
- Hyphens, not underscores; no trailing slashes inconsistency.
- Encode once; do not double-encode `%`.
- Keep slugs stable after publishing; changing the title must not change the
  URL. Redirect (301) if it must.

## 4. Structured data (JSON-LD)

- Every object gets `"inLanguage": "fa-IR"`.
- Dates in JSON-LD are ISO 8601 Gregorian (`2026-09-20`) even when the page
  shows «۲۹ شهریور ۱۴۰۵».
- Prices use `priceCurrency: "IRR"` with the numeric value in rial, or state
  toman explicitly in text; do not put «تومان» in a numeric field.
- `BreadcrumbList` names in Persian, matching the visible breadcrumb.
- `FAQPage` questions and answers in the same register as the page.
- Organization `name` Persian with `alternateName` for the Latin brand.

## 5. Sitemaps, robots, indexing

- Sitemap URLs must be the canonical form (encoded the same way as served).
- `robots.txt` allows the Persian font files and CSS; blocking `/fonts` breaks
  rendering in the crawler screenshot.
- Paginated listings: real links to next pages, not only infinite scroll.
- Avoid a separate "mobile site"; one responsive RTL page.

## 6. Keyword research in Persian

- Users search in several spellings of the same phrase. Treat these as one
  keyword and write the correct form: with/without ZWNJ («می‌شود» / «می شود»),
  Persian/Arabic letters, plural forms («کامپوننت» / «کامپوننت‌ها»), Latin and
  Persian brand names («React» / «ری‌اکت»).
- Do not stuff variants into the copy; search engines normalize most of them.
  One correct spelling in the title and headings is enough.
- Common intent modifiers: «قیمت»، «خرید»، «آموزش»، «رایگان»، «دانلود»،
  «بهترین»، «چیست». Match the page to the intent, not the word.
- English technical terms are searched in English («Next.js», «Tailwind»);
  keep them Latin in titles.
- Persian numbers in queries are usually Latin; in the title use Persian
  digits for readability, the URL keeps Latin.

## 7. Content that ranks

- Write in the register of the reader (see `persian-formal` and
  `persian-conversational`). Machine-translated English structure («در دنیای
  امروز…») is easy to spot and does not hold readers.
- Answer the query in the first paragraph; do not bury it after a history
  lesson.
- Headings (`h2`/`h3`) are questions or claims in Persian; the `h1` matches
  the title's subject.
- Internal links use descriptive Persian anchor text, not «اینجا کلیک کنید».
- Author, date («به‌روزرسانی: ۲۹ شهریور ۱۴۰۵») and a real about page build
  trust; do not invent author names or credentials.
- Images: `alt` in Persian, filenames Latin, WebP/AVIF, width and height set.

## 8. Performance for Persian pages

- Fonts are the biggest cost. Subset to Arabic script plus Latin, preload the
  regular weight, `font-display: swap`, self-host if the user's audience has
  unreliable access to external CDNs.
- Avoid layout shift from font fallback: set `size-adjust` or use a metric-
  compatible fallback; Persian fallback fonts differ wildly in x-height.
- Do not lazy-load the hero text font; do lazy-load decorative ones.
- Test on slow mobile; a large share of Iranian traffic is Android over
  mobile networks.

## 9. Checklist

1. `lang="fa" dir="rtl"`, `og:locale` `fa_IR`.
2. Persian title and description, subject first, brand last.
3. One slug strategy, no ZWNJ in URLs, Latin digits, stable after publish.
4. JSON-LD with `inLanguage`, ISO dates, numeric prices.
5. Canonical and sitemap URLs identical to served URLs.
6. Copy written in Persian for the reader, not translated; answer first.
7. Fonts subset and preloaded; no font-triggered layout shift.

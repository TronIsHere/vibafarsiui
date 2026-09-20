# Persian project rules (for CLAUDE.md / AGENTS.md / Cursor rules)

Paste the block below into the file your coding agent reads on every turn:
`CLAUDE.md` (Claude Code), `AGENTS.md` (Codex and most agents), or a
`.cursor/rules/persian.mdc` file with `alwaysApply: true` (Cursor). It is the
one-page summary of the VibeFarsi Persian skills, for projects that do not
want to install each skill separately.

Edit the two bracketed choices first: the copy register and the component
source.

---

## Persian / RTL rules for this project

This product is for Persian (Farsi) speakers in Iran. Apply these rules to
every file you touch, without being reminded.

### Language and register
- All user-facing text is Persian: labels, placeholders, errors, empty states,
  toasts, `aria-label`, page titles, metadata. Code identifiers, props, file
  names, commit messages stay English.
- Register: [formal-but-human («می‌شود»، «کنید»، «است») | light
  conversational («میشه»، «می‌تونید»، «کنید»)]. Never mix the two in one
  screen. Never «می‌باشد»، «لازم به ذکر است»، «در راستای».
- No English defaults in copy: never «Oops», «Something went wrong»,
  «Submit», «Loading».
- Orthography: ZWNJ (نیم‌فاصله) in compounds (می‌شود، ثبت‌نام، سفارش‌ها),
  Persian ی and ک, «گیومه» for quotes, «،» «؟» punctuation, no em dashes.

### Direction and layout
- `<html lang="fa" dir="rtl">` once; nothing else sets `dir` except LTR
  controls (phone, email, OTP, IBAN, card, URL, code).
- Logical Tailwind classes only: `ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`,
  `text-start`, `border-s`, `rounded-s-`. Never `ml-`, `pl-`, `left-`,
  `text-left`, `border-l`, `space-x-*` (use `gap-*`).
- Do not use `flex-row-reverse` to "fix" RTL order.
- "Next"/"submit" arrows point left (`ArrowLeft`); drawers open from the start
  edge.

### Typography
- Font: [Vazirmatn | IRANSans] via the project's `--font-sans`. Never Inter,
  Roboto, Geist or `system-ui` alone.
- `letter-spacing: 0` on Persian; no `tracking-*`, no `uppercase`.
- Body ~16px, line-height 1.7–1.9; headings line-height ≥ 1.2.

### Numbers, money, dates
- Visible digits are Persian ۰–۹; values, URLs, API payloads keep Latin digits.
- Thousands separator «٬», decimal «٫», percent «٪» after the number.
- Money: «۱۲٬۴۵۰٬۰۰۰ تومان», unit after the number; never «$» or «Toman»;
  never mix تومان and ریال.
- Dates are Jalali (شمسی) in the UI, week starts Saturday, Friday is the
  weekend; store UTC ISO 8601; time zone `Asia/Tehran` (+03:30, no DST).
- Relative time in Persian («۲ ساعت پیش»).

### Forms and validation
- Label above the field; placeholder is an example, not a label.
- Normalize Persian and Arabic-Indic digits before validating.
- Mobile: 11 digits starting `09` (also accept `+98`). National ID: 10 digits
  with the mod-11 checksum. IBAN: `IR` + 24 digits, mod-97. Card: 16 digits,
  Luhn. Postal code: 10 digits.
- Errors under the field, specific: «شماره موبایل باید ۱۱ رقم باشد و با ۰۹
  شروع شود.»

### Components and colors
- Components come from [VibeFarsi (`npx vibefarsi add <slug>`) | the
  project's `components/ui`]. Do not add shadcn or another LTR kit.
- Colors only from theme tokens (`bg-background`, `text-muted-foreground`,
  `border-border`, `bg-primary`, `text-brand`…). No hex/oklch in components.
- Radius from `--radius`.

### Before you finish
- Grep the diff for `ml-|mr-|pl-|pr-|left-|right-|text-left|text-right|space-x`.
- Check every visible number is Persian and every date is Jalali.
- Read every new string aloud in Persian: would an Iranian product ship it?

---

## Where to put it

| Tool | File | Note |
|---|---|---|
| Claude Code | `CLAUDE.md` at the repo root | Or keep this file at `docs/persian-rules.md` and add `@docs/persian-rules.md` to `CLAUDE.md`. |
| Codex | `AGENTS.md` at the repo root | Codex reads it on every session. |
| Cursor | `.cursor/rules/persian.mdc` | Add a frontmatter with `alwaysApply: true`. |
| Other agents | `AGENTS.md` | Most tools read it; otherwise paste into the system prompt. |

## Going further

The full skills cover each topic in depth and trigger on their own when the
task matches: `persian-rtl-ui`, `persian-ui-copy`, `persian-conversational`,
`persian-formal`, `jalali-calendar`, `iran-validation`, `persian-seo`.
Install any of them with `npx vibefarsi add <slug>`.

---
name: persian-rtl-ui
description: >
  Build right-to-left Persian (Farsi) UI in React and Tailwind the way an
  Iranian product team would: logical CSS only, Persian fonts without
  letter-spacing, Persian digits and «تومان», Jalali dates, Iranian form
  fields, colors from theme tokens. Use for any UI work in a Persian or
  Iranian project (راست‌چین، فارسی، RTL، رابط فارسی، Next.js فارسی), before
  writing the first component. These are the VibeFarsi design rules in skill
  form, for projects without the MCP server.
---

# Persian RTL UI (رابط راست‌چین)

Models default to English UI: Inter, Latin digits, `ml-4`, `text-left`, Monday
calendars. Wrapping that in `dir="rtl"` does not make it Persian. Apply the
rules below to every component, then run the checklist in section 10.

## 1. Direction

- Document: `<html lang="fa" dir="rtl">`. Do not set `dir` per component.
- Logical classes only: `ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`,
  `text-start`/`text-end`, `border-s`/`border-e`, `rounded-s-`/`rounded-e-`,
  `inset-s-`/`inset-e-`. Never `ml-`, `pl-`, `left-`, `text-left`, `border-l`.
- Flex and grid read first-to-last in document order; RTL flips them. Do not
  add `flex-row-reverse` to "fix" it.
- `space-x-*` breaks in RTL; use `gap-*`.
- Directional icons flip: "next" and "submit" chevrons point **left**
  (`ArrowLeft`, `ChevronLeft`). Non-directional icons (search, trash) stay.
- Keep these LTR *inside* the RTL page, with `dir="ltr"` on the control, not
  on the form: phone, email, OTP, IBAN, card number, URL, code, Latin SKU.
- Drawers and sheets open from the start edge; toasts stack at the start-bottom
  or top-center.

| Wrong | Right |
|---|---|
| `ml-2` / `pl-4` | `ms-2` / `ps-4` |
| `text-left` | `text-start` |
| `left-0` / `right-0` | `start-0` / `end-0` |
| `rounded-l-lg` | `rounded-s-lg` |
| `border-l` | `border-s` |
| `space-x-2` | `gap-2` |
| `<ArrowRight/>` for "next" | `<ArrowLeft/>` |
| `flex-row-reverse` | (remove) |

## 2. Typography

- Font: the project's Persian sans (Vazirmatn, IRANSans, or `--font-sans`).
  Never Inter, Roboto, Geist or `system-ui` alone.
- `letter-spacing: 0` on Persian, always. Tracking breaks letter joining. No
  `tracking-tight` on Persian headlines.
- Body ~16px, line-height 1.7–1.9. Headlines 1.2–1.3, never below 1.15.
- No fake bold or italic; use weights the font ships.
- Mixed strings («کد سفارش SKU-2048»): let the bidi algorithm isolate the Latin
  run; do not force the paragraph LTR. Wrap codes in `<bdi>` or `dir="ltr"`.
- Truncate with CSS `line-clamp`; a naive `slice()` cuts letters mid-join.
- Do not uppercase Persian; `uppercase` only affects Latin and looks wrong
  next to it.

## 3. Numbers, money, dates

- Visible digits are Persian ۰۱۲۳۴۵۶۷۸۹. Convert at the display layer
  (`fa()` / `faNumber()` from `lib/utils.ts` in VibeFarsi).
- Thousands separator «٬» (U+066C), decimal «٫» (U+066B), percent «٪» after the
  number.
- Money: «۱۲٬۴۵۰٬۰۰۰ تومان». Unit **after** the number. Never «$», never
  «Toman». Default unit is تومان; if you must show ریال, label it and never mix.
- Form values, URLs, JSON and API payloads keep Latin digits.
- Calendar is Jalali (شمسی); week starts Saturday; Friday is the weekend.
  Use a real converter (`lib/jalali.ts`), not `toLocaleDateString` alone.
- Relative time in Persian: «۲ ساعت پیش», «دیروز».
- Numeric table columns: `tabular-nums` so digits line up, aligned to the
  start (right) like the rest of the RTL table. Do not `text-right` them.

## 4. Forms

- Label above the field with `htmlFor`; placeholder is an example, not a label.
- Phone: `dir="ltr"`, `inputMode="tel"`, accept `09xxxxxxxxx` (11 digits) and
  `+98…`. Start addon «+98» is optional. Operator name is a hint, not a gate.
- OTP: separate cells, `dir="ltr"` on the group, Persian glyphs on screen,
  Latin string on submit, `autoComplete="one-time-code"`, paste fills all.
- Email, password, IBAN, card, URL: LTR input under an RTL label.
- Persian and Arabic-Indic digits typed by the user are normalized before
  validation; never reject «۰۹۱۲…» because it is not ASCII.
- Errors under the field with `aria-invalid`; red from `--destructive`.
- Primary button at the start of a button row; full-width stacks put the
  primary on top.
- Inputs must compute to at least 16px on iOS or Safari zooms on focus.

## 5. Colors and shape

- Every color comes from a token already mapped to Tailwind: `background`,
  `foreground`, `card`, `primary`, `secondary`, `muted`, `accent`, `border`,
  `input`, `ring`, `brand`, `destructive`, `success`, `warning`.
- No hex or oklch inside components; no new blue because it looked nice.
- Radius from `--radius`; do not mix 6px and 16px corners in one view.
- Borders `border-border`, not `border-white/10` (light themes exist).

## 6. Motion

- 150–300ms for UI; decorative backgrounds may be slower.
- Respect `prefers-reduced-motion`: stop loops, skip enter animations.
- Directional motion follows RTL: enter from the start edge.
- Animate transform and opacity, not `top`/`left`/`width`.

## 7. Accessibility

- Visible focus ring from the `ring` token; never `outline-none` without a
  replacement.
- Icon-only buttons get a Persian `aria-label`.
- Dialogs trap and restore focus; Escape closes.
- `lang="fa"` on the document so screen readers switch voices.
- Muted text stays readable on both dark and light themes.

## 8. Iranian product patterns

English kits will not get these right; use a VibeFarsi component when one
exists (`npx vibefarsi add …`) instead of re-implementing.

- Phone «۰۹…», national ID (کد ملی, 10 digits with checksum), Sheba/IBAN
  (`IR` + 24 digits), bank card (16 digits, Luhn, BIN → bank), postal code
  (10 digits), plate («۱۲ ب ۳۴۵ ایران ۱۱»).
- Address fields: استان، شهر، خیابان، پلاک، واحد، کد پستی.
- Shipping: پست، تیپاکس، پیک. Payment result states: موفق، در انتظار، ناموفق.
- Working week Saturday–Thursday (often half-day Thursday); Friday off.
- Copy is Persian and specific: never «Oops», never «Something went wrong».

## 9. Copy inside components

All visible strings are Persian: labels, placeholders, empty states, errors,
`aria-label`. Code identifiers, props and file names stay English. See the
`persian-ui-copy` skill for wording.

## 10. Checklist before returning code

1. No `ml-`/`mr-`/`pl-`/`pr-`/`left-`/`right-`/`text-left`/`text-right`/`space-x`.
2. Font from the project, `letter-spacing: 0`, no `tracking-*` on Persian.
3. Every visible number Persian; money «تومان» after the number.
4. Dates Jalali, week starts Saturday.
5. Phone/OTP/IBAN/card fields `dir="ltr"`, labels RTL.
6. Colors only from tokens; radius from `--radius`.
7. "Next" arrows point left; drawers open from the start edge.
8. Focus ring visible; icon buttons labelled in Persian.
9. All copy Persian, register consistent.

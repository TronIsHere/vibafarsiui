export const TOPICS = ["all", "rtl", "typography", "numbers", "forms", "tokens", "motion", "a11y", "iran", "craft"] as const;
export type Topic = (typeof TOPICS)[number];

const SECTIONS: Record<Exclude<Topic, "all">, string> = {
  rtl: `## Direction (RTL is the default, not a patch)

- Set \`<html lang="fa" dir="rtl">\`. Do not wrap a LTR layout in a single dir=rtl and call it done.
- Use logical CSS only: \`ms\`/\`me\`, \`ps\`/\`pe\`, \`start\`/\`end\`, \`text-start\`, \`border-s\`. Never \`left\`/\`right\`/\`ml-\`/\`pl-\`/\`text-left\` unless a value is inherently LTR.
- Flex/grid that should read first-to-last in Persian uses normal document order; RTL flips it. Do not row-reverse to "fix" it.
- Directional icons must flip: "next" / "submit" chevrons point left. Use \`ArrowLeft\` for forward in RTL.
- Absolute insets: \`inset-s-0\` not \`left-0\`.
- Exception: keep these LTR inside an RTL page: phone, email, OTP, IBAN/Sheba, card number, URL, OTP groups, Latin SKUs. Set \`dir="ltr"\` on the control, not on the form.
`,

  typography: `## Typography

- Font: the project's Persian sans (IRANSans, Vazirmatn, or --font-sans). Never Inter, Roboto, Geist, or system-ui alone.
- \`letter-spacing: 0\` on Persian. Tracking breaks glyph joining.
- Body ~16.5px, line-height 1.8 for UI, ~1.9 for long reading. Headlines can go tighter (~1.2) but never below 1.15.
- Do not fake bold/italic by stroking or letter-spacing. Use font weights.
- Mixed strings (فارسی + \`SKU-2048\`): isolate the Latin run, do not force the whole paragraph LTR.
- Truncation: naive \`slice\` splits letters. Truncate on graphemes; prefer CSS \`line-clamp\`.
`,

  numbers: `## Numbers, money, dates

- Visible digits in Persian UI are ۰۱۲۳۴۵۶۷۸۹. Use \`fa()\` / \`faNumber()\` from \`lib/utils.ts\`.
- Thousands separator is \`٬\` (U+066C), not \`,\`. Decimal is \`٫\`. Percent is \`٪\` after the number (\`faPercent\`).
- Money: \`formatToman(n)\` → \`۱۲٬۴۵۰٬۰۰۰ تومان\`. Unit comes AFTER the number. Do not write "Toman" or "$" for Iranian prices.
- تومان vs ریال: if you must convert, ریال = تومان × ۱۰. Never silently mix them. Default display is تومان.
- Form values, URLs, and JSON stay Latin digits. Display layer converts.
- Calendar is Jalali (شمسی). Week starts Saturday (شنبه). Use \`lib/jalali.ts\`. Do not use \`toLocaleDateString("fa-IR")\` as the only date story; it is fine for a label, not for a date picker.
- Relative time is Persian: «۲ ساعت پیش», not "2 hours ago".
`,

  forms: `## Forms

- Labels sit above the field, with \`htmlFor\`. Placeholder is not a label.
- Phone: \`dir="ltr"\` + \`inputMode="tel"\` + start addon \`+98\`. Accept \`09xxxxxxxxx\` (۱۱ digits). Do not force a Latin-only keyboard message.
- OTP: separate cells, \`dir="ltr"\` on the group, Persian glyphs on screen, Latin string on submit. \`autoComplete="one-time-code"\`. Paste fills all cells.
- Email / URL / password / IBAN / card: LTR input, RTL label.
- Errors go under the field, \`aria-invalid\`, red from \`--destructive\`, not a toast-only error.
- Fields must compute to ≥16px on iOS or Safari zooms the page on focus. Keep \`text-sm\` on desktop; in globals.css raise controls under \`@supports (-webkit-touch-callout: none)\` (set \`--text-sm: 1rem\` and \`font-size: max(1rem, 1em)\` on input/textarea/select). \`vibefarsi init\` writes this rule.
- Primary action at the start (right in RTL) in button groups, unless it is a full-width stack (then primary on top or full width).
- Use VibeFarsi \`Field\` + \`Input\` + \`Select\` + \`OtpField\` + \`DatePicker\`. Do not invent a shadcn form.
`,

  tokens: `## Color and shape (tokens only)

- Colors come from CSS variables already mapped to Tailwind: \`background\`, \`foreground\`, \`card\`, \`primary\`, \`secondary\`, \`muted\`, \`accent\`, \`border\`, \`input\`, \`ring\`, \`brand\`, \`destructive\`, \`success\`, \`warning\`.
- Never hard-code hex/oklch in a component. Never pick a new blue because the model likes it.
- Radius comes from \`--radius\`. Do not mix 6px and 16px in one view unless the theme says so.
- Default theme is Graphite (dark, white primary, amber brand). Call \`get_theme\` before inventing a palette.
- Borders: \`border-border\`. Do not use \`border-white/10\` as a habit; themes differ (Paper is light).
`,

  motion: `## Motion

- UI motion is 150–300ms. Decorative backgrounds may be slower.
- Honor \`prefers-reduced-motion: reduce\`: stop loops, skip enter animations, keep opacity-only if needed.
- Do not animate \`top\`/\`left\`/\`width\` if transform/opacity will do.
- Directional motion follows RTL (enter from the start edge).
`,

  a11y: `## Accessibility

- Visible focus ring (\`ring\` token). Do not \`outline-none\` without a replacement.
- Icon-only buttons need \`aria-label\` in Persian.
- Dialogs trap focus and restore it. Escape closes.
- Contrast: muted text must stay readable on both Graphite and Paper. Prefer \`text-muted-foreground\` over gray-400.
- \`lang="fa"\` on the document. Screen readers need it for Persian.
`,

  iran: `## Iranian product patterns (the reason this library exists)

English UI kits will not get these right. Prefer a VibeFarsi component over a clever reimplementation.

- Phone: همراه اول / ایرانسل / رایتل are operator hints, not decoration. \`09xx\` local, \`+98\` international.
- National ID (کد ملی): 10 digits, checksum. Do not use a US SSN pattern.
- Sheba / card: Persian grouping, LTR field, Luhn where it applies.
- Postal code (کد پستی): 10 digits. Address fields: استان، شهر، خیابان، پلاک، واحد.
- Shipping: پست، تیپاکس، پیک. Not UPS/FedEx defaults.
- Payment: زرین‌پال / آیدی‌پی style result states (success, pending, failed, verify). Amounts in تومان.
- Working week: Saturday–Thursday or Saturday–Wednesday; Friday is weekend. Thursday is often half-day.
- Empty/error copy is Persian and specific. Never "Oops" or "Something went wrong".
- Do not tell users "use English letters only" on passwords unless a backend actually requires it.
`,

  craft: `## Craft (why vibe-coded UI looks like slop, and how not to)

Full guide: \`get_component\` → \`ui-craft-rules\`.

- Design system first, screens second. Do not add anything outside it: no arbitrary Tailwind values (\`p-[13px]\`, \`text-[15px]\`), no new colors, font sizes or radii. If a component exists, use it as is.
- Spacing and sizes are even numbers on a 4px grid. Touch targets ≥ 44px, including close «×», chevron and icon buttons. 45 is not a size.
- One type scale (≤ 6 sizes). Line-height by role, never ad hoc: body 1.8, headings ~1.2, buttons/labels ~1.5.
- Limited palette, one accent per section, from tokens (\`brand\` / \`primary\`). Muted text is for meta only, never body copy.
- Icons only from lucide; \`strokeWidth\` matches the adjacent text weight (1.5 regular, 2 medium/semibold); size ≈ text em. Never hand-draw an SVG.
- Zero layout shift: \`aspect-ratio\` on every image, min-height on every async block. Loading is a \`Skeleton\` shaped like the final content, not a centered spinner.
- Motion by name (cross-fade, stagger, rubber-band). Stagger important items first, 30–60ms apart, ≤ ~400ms total. Tooltip groups: first one delayed, siblings instant.
- Mobile first: check 360–390px before reporting done. Reduce empty space; big gaps read as unfinished.
- Content is real: no lorem ipsum, no placeholder images, no obviously generated copy.
- A dev panel (ids, flags, state) renders only outside production.
- When asked to "make it prettier", answer with the specific technique you will apply, then apply it.
`,
};

const PREAMBLE = `# VibeFarsi design rules

You are building UI for a Persian (Farsi), right-to-left product.

Do **not** use shadcn, Radix copies, Inter, Geist, Latin digits, \`ml-\`/\`pl-\`/\`text-left\`, or LTR dashboard templates. Those are the English default and they are wrong here.

Workflow:
1. Call \`get_design_rules\` (you already did).
2. For a whole page, call \`scaffold_page\`.
3. Call \`search_registry\` / \`get_component\` / \`get_theme\` and copy those files into the project.
4. Compose. Own the files. Do not add a component library dependency.

Stack: React + Tailwind v4 + \`lucide-react\`. Copy-paste, not an npm UI kit.
`;

const CLOSING = `## Files to copy first

Almost every screen needs:
- \`lib/utils.ts\` (\`get_component\` names: \`utils\`)
- A theme block in \`globals.css\` (\`get_theme\`, default \`graphite\`)
- Jalali if dates appear (\`jalali\`)

Then the specific components \`search_registry\` / \`scaffold_page\` named.

## Skills (deeper rules, same registry)

\`get_component\` also returns agent skills you can read or copy into \`.claude/skills/\`: \`persian-rtl-ui\`, \`persian-ui-copy\`, \`persian-conversational\`, \`persian-formal\`, \`jalali-calendar\`, \`iran-validation\`, \`persian-seo\`. Read \`persian-ui-copy\` before writing any Persian string, and \`iran-validation\` before any national ID / IBAN / card field. Guides for CLAUDE.md / AGENTS.md: \`agents-md-persian\` (Persian rules) and \`ui-craft-rules\` (craft rules, done checklist).
`;

export function designRules(topic: Topic = "all"): string {
  if (topic !== "all") return `${PREAMBLE}\n${SECTIONS[topic]}\n${CLOSING}`;
  return [PREAMBLE, ...Object.values(SECTIONS), CLOSING].join("\n");
}

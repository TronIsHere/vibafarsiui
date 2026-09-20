# UI craft rules for vibe-coded interfaces (قوانین کرافت رابط)

Why vibe-coded UI looks like slop, and the specific habits that fix it.
Adapted to the VibeFarsi stack (React, Tailwind v4, `lucide-react`, Persian
RTL). These are best practices, not scripture. The Persian and RTL rules live
in `agents-md-persian` and `persian-rtl-ui`; this guide is about craft on top
of them.

`vibefarsi init` copies this file to `docs/ui-craft-rules.md` and writes the
agent block from section 2 into `AGENTS.md`.

## 1. Rulebook

### Working with the agent

| Do | Don't |
|---|---|
| Name the technique: «icon button with a cross-fade», «stagger the cards, 40ms apart», «rubber-band on overscroll». | Say «make it prettier» or «make it modern». It usually gets worse. |
| Define the design system first (tokens, type scale, spacing, components), then build screens on it. A clean system is 90% of the work. | Dump the whole product on the agent in one prompt. Go screen by screen, section by section. |
| Constrain what the agent may add: no arbitrary values, no new colors, no new font sizes, no restyling of an existing component. | Let the agent invent a class, a shade or a padding whenever a component already exists. |
| Review every AI output before it ships. | Trust a one-shot. Motion, performance and edge states need iteration. |
| Build a dev panel early (ids, state, flags) that only renders outside production. | Keep asking the agent to add and remove debug UI. |

### Layout and loading

- Reserve space before content arrives. Images get `aspect-ratio` (or
  `width` and `height`); lists, cards and async blocks get a fixed or
  minimum height. Layout shift (CLS) is one of the worst experiences a user
  can have.
- Loading states are skeletons that match the final layout, not a lone
  spinner. Like the mirror in an elevator: the wait feels shorter and the
  user learns what is coming. Use `Skeleton` from VibeFarsi.
- Assume 80%+ of visitors are on a phone. Check every screen at 360–390px
  before calling it done; that is where things collide.
- Reduce empty space rather than adding it. Big gaps read as unfinished, not
  as premium.

### Typography

- Limit the whole product to one type scale (about six sizes). Body is one
  size; no `text-[13px]` improvisation.
- Line-height is a function of font size and role, not a per-element
  decision. Persian scripts with tall ascenders need more room than Latin,
  so VibeFarsi ships body 1.8 for UI, ~1.9 for long reading, headings ~1.2
  (never below 1.15), buttons and labels ~1.5. Pick the scale, test it with
  the actual font, then stop touching it.
- Headings tight, body and subtitles looser. Never the same line-height for
  both.
- Gray text on white has low contrast. Use `text-muted-foreground` for meta
  and helper text only, never for body copy.
- Persian rules still apply: `letter-spacing: 0`, no `uppercase`, no
  `tracking-*`.

### Color

- Limit the number of colors per page and per section. Fewer colors read as
  more professional and tire the eye less.
- Each section has one accent whose job is to attract attention. It may be
  the brand color or not, but it is one color, from the theme tokens
  (`brand`, `primary`), never a fresh hex.
- Everything else is `background`, `foreground`, `muted`, `border`, `card`.

### Icons

- One icon set per product: `lucide-react` in the VibeFarsi stack. Never let
  the agent hand-draw an SVG or pull a second pack «for this one icon».
- Match the icon stroke to the adjacent text weight: `strokeWidth={1.5}`
  next to regular text, `2` next to medium/semibold, `2.5` only in bold
  display contexts. Icon size ≈ the text's em (16px icon with 14–16px text).
- Directional icons flip in RTL (`ArrowLeft` means «next»).

### Touch and pixel discipline

- Every tappable control is at least 44×44px (48 also fine). Close «×» and
  chevron «›» buttons are the usual offenders. 45 is not a size.
- Prefer even numbers for spacing, sizes and radii so the layout stays on a
  4px grid and pixel-aligned: 8, 12, 16, 24, 32, 40, 44, 48.
- Radius comes from `--radius`; do not mix 6px and 16px corners in one view.

### Motion and micro-interactions

- Use named patterns: cross-fade on icon buttons, stagger for lists,
  rubber-band on overscroll, shared-element or shader page transitions.
- Stagger by importance: the item the user needs first appears first.
  Step 30–60ms, total ≤ ~400ms, honor `prefers-reduced-motion`.
- Tooltips in a button group: the first one opens after a short delay
  (~500ms) because the pointer may just be passing through; once one is
  open, siblings open immediately (skip the delay). VibeFarsi's `Tooltip`
  is CSS-only; use `Popover` with a shared «open» state when you need this.
- UI motion is 150–300ms; animate `transform` and `opacity`, not `top`,
  `left` or `width`.

### Content

- Content must not look unfinished or fully AI-written. Real photos, real
  product names, real numbers, short animations where they teach something.
- No lorem ipsum in anything the user will see. Persian copy follows
  `persian-ui-copy`.

## 2. Agent block

Paste into `CLAUDE.md`, `AGENTS.md` or `.cursor/rules/*.mdc`
(`alwaysApply: true`). `vibefarsi init` writes this for you.

---

## UI craft rules for this project

Design system first, screens second. Every rule below is a constraint, not a
suggestion.

- Do not add anything outside the system: no arbitrary Tailwind values
  (`p-[13px]`, `text-[15px]`, `#hex`), no new font sizes, no new colors, no
  new radii. Use tokens (`bg-background`, `text-muted-foreground`, `bg-brand`,
  `--radius`) and existing components. If a component exists, use it as is.
- Spacing and sizes are even numbers on a 4px grid. Touch targets ≥ 44px
  (close, chevron and icon buttons included).
- One type scale (≤ 6 sizes). Line-height by role: body 1.8, headings ~1.2,
  buttons/labels ~1.5. Never set an ad-hoc line-height.
- Limited palette, one accent per section, taken from theme tokens.
- Icons only from `lucide-react`; `strokeWidth` matches the adjacent text
  weight (1.5 regular, 2 medium/semibold); size ≈ text em. No hand-drawn SVG.
- Reserve space for everything async: `aspect-ratio` on images, min-heights
  on lists and cards. Zero layout shift.
- Loading = `Skeleton` in the final layout, not a spinner in the middle.
- Motion by name (cross-fade, stagger, rubber-band), 150–300ms,
  `transform`/`opacity` only, honors `prefers-reduced-motion`. Stagger
  important items first. Tooltip groups: first delayed, siblings instant.
- Text on `muted-foreground` is for meta only; body text uses `foreground`.
- Mobile first: verify at 360–390px before reporting done.
- Content is real: no lorem ipsum, no placeholder images, no obviously
  generated copy.
- A `DevPanel` (ids, flags, state) renders only when
  `process.env.NODE_ENV !== "production"`.
- When asked to «make it prettier», reply with the specific technique you
  will apply instead, then apply it.

Full guide: `docs/ui-craft-rules.md`. Persian/RTL rules: `docs/agents-md-persian.md`.

---

## 3. Done checklist

Run before saying a screen is finished:

1. No arbitrary values in the diff: grep for `\[[0-9]+px\]`, `#[0-9a-f]{3,6}`, `text-\[`, `leading-\[`.
2. Every image has `aspect-ratio` or `width`/`height`; every async block reserves height. Reload with throttled network: nothing jumps.
3. Loading state is a skeleton shaped like the final content.
4. Font sizes used on the page ≤ 6; line-heights follow the role scale.
5. One accent color in each section; all colors are tokens.
6. Icons: single set, stroke matches text weight, directional icons flip in RTL.
7. Every tappable control ≥ 44px; sizes and spacing are even.
8. Motion named and timed (150–300ms), `prefers-reduced-motion` respected, stagger order matches importance.
9. Muted text is meta only; body text passes contrast on both Graphite and Paper.
10. Checked at 360–390px: nothing collides, nothing overflows.
11. Copy is real and Persian; no placeholders.
12. Dev panel hidden in production build.

Plus the Persian checks from `agents-md-persian`: logical classes only,
Persian digits, Jalali dates, LTR only on phone/OTP/IBAN/card fields.

## Where to put it

| Tool | File | Note |
|---|---|---|
| Claude Code | `CLAUDE.md` | `init` writes the block to `AGENTS.md` and adds `@AGENTS.md` to `CLAUDE.md`. |
| Codex and most agents | `AGENTS.md` | Read on every session. |
| Cursor | `.cursor/rules/vibefarsi.mdc` | Frontmatter with `alwaysApply: true`. |
| MCP users | `get_design_rules` with `topic: "craft"` | Same rules, served by the VibeFarsi MCP server. |

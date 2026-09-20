import type { DocBase, ThemeDoc } from "./types";

const SHARED_RULES = [
  "RTL layout with dir=\"rtl\". Use logical properties (ms/me/ps/pe/start/end), never left/right.",
  "Font from the project (IRANSans or Vazirmatn). Never apply letter-spacing on Persian text.",
  "Visible numbers use Persian digits (۰–۹), thousands separator «٬» (U+066C), and the unit «تومان» after the number.",
  "Colors only from theme tokens: bg-background, text-foreground, bg-primary, text-muted-foreground, border-border, and similar. Do not invent colors.",
  "Icons from lucide-react. Directional icons (arrows, chevrons) flip in RTL: \"next\" points left.",
  "Accessibility: correct ARIA roles, a visible focus ring, and full keyboard support.",
  "Form controls (input, textarea, select) must compute to at least 16px on iOS, or Safari zooms the page on focus; keep text-sm on desktop and raise it under @supports (-webkit-touch-callout: none).",
  "Motion is short (150–300ms) and disabled under prefers-reduced-motion.",
  "All visible UI copy (labels, placeholders, empty states, errors) is Persian (Farsi). Code identifiers stay English.",
];

const KIND_LABEL = {
  component: "component",
  animation: "animation",
  background: "background",
  template: "template",
  lib: "module",
  block: "block",
} as const;

function titleFromSlug(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Builds the English prompt a user pastes into Cursor / Claude Code for an item. */
export function buildPrompt(
  item: DocBase,
  kind: keyof typeof KIND_LABEL = "component",
) {
  const what = KIND_LABEL[kind];
  const name = titleFromSlug(item.slug);
  const lines = [
    `Build a React + Tailwind CSS ${what} named "${name}" (${item.slug}).`,
    "",
    "This item requires:",
    ...item.promptBullets.map((b) => `• ${b}`),
    "",
    "Persian / RTL rules for all output:",
    ...SHARED_RULES.map((b) => `• ${b}`),
    "",
    `Output: ${item.file.split("/").pop()} in TypeScript, no extra dependencies except lucide-react, plus a short usage example.`,
  ];
  return lines.join("\n");
}

/** Builds the English prompt for applying a theme. Pass CSS for the docs page. */
export function buildThemePrompt(item: ThemeDoc, css?: string) {
  const lines = [
    `Apply the "${item.nameEn}" (${item.slug}) design system to my project.`,
    "",
  ];
  if (css) {
    lines.push("Put these tokens in globals.css exactly:", "", css, "");
  }
  lines.push(
    "Rules:",
    ...item.promptBullets.map((b) => `• ${b}`),
    "• Components must read color only from these tokens. No hardcoded hex inside components.",
    "• Corner radius comes from --radius.",
  );
  return lines.join("\n");
}

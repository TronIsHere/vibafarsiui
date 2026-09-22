import { rewriteUserSource, type RegistryItem } from "./registry.js";
import { readText, writeFile, type Project } from "./project.js";

const START = (id: string) => `/* --- vibefarsi:${id} --- */`;
const END = (id: string) => `/* --- vibefarsi:${id}-end --- */`;

export function upsertBlock(source: string, id: string, body: string) {
  const start = START(id);
  const end = END(id);
  const block = `${start}\n${body.trim()}\n${end}`;
  const re = new RegExp(`${escapeRe(start)}[\\s\\S]*?${escapeRe(end)}`);
  if (re.test(source)) return source.replace(re, block);
  const trimmed = source.replace(/\s*$/, "");
  return `${trimmed}${trimmed ? "\n\n" : ""}${block}\n`;
}

function escapeRe(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function hasBlock(source: string, id: string) {
  return source.includes(START(id));
}

export const TAILWIND_THEME = `@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-success: var(--success);
  --color-warning: var(--warning);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-brand: var(--brand);
  --color-brand-foreground: var(--brand-foreground);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  /* Design language: type, shape, line, depth and motion of the active system. */
  --radius-control: var(--shape-control);
  --radius-field: var(--shape-field);
  --radius-surface: var(--shape-surface);
  --radius-overlay: var(--shape-overlay);
  --border-width-line: var(--line);
  --border-width-line-field: var(--line-field);
  --color-field: var(--field);
  --shadow-control: var(--depth-control);
  --shadow-press: var(--depth-press);
  --shadow-field: var(--depth-field);
  --shadow-surface: var(--depth-surface);
  --shadow-overlay: var(--depth-overlay);
  --ease-motion: var(--motion-ease);
  --font-display: var(--type-display);
}

@layer base {
  body {
    font-size: 16.5px;
    line-height: 1.8;
    letter-spacing: 0;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    font-family: var(--type-body, inherit);
    background-image: var(--backdrop, none);
  }

  h1, h2, h3, h4 {
    font-family: var(--type-display, inherit);
    font-weight: var(--type-display-weight, 700);
    /* Single-weight display faces (Lalezar) must not be faux-bolded. */
    font-synthesis-weight: none;
  }

  /* iOS Safari zooms into any focused field smaller than 16px; only iOS matches this query. */
  @supports (-webkit-touch-callout: none) {
    input, textarea, select {
      --text-xs: 1rem;
      --text-sm: 1rem;
      font-size: max(1rem, 1em);
    }
  }
}`;

export function fontTheme(variable: string) {
  return `@theme inline {
  --font-sans: var(${variable}), "IRANSans", "IRANSansX", "Vazirmatn", ui-sans-serif, system-ui, sans-serif;
}`;
}

export function googleFontImport() {
  return `@import url("https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700&display=swap");`;
}

const LOCAL_FAMILIES = new Set(["IRANSans", "IRANSansX"]);
const SINGLE_WEIGHT = new Set(["Lalezar"]);

/** Google Fonts families a design system names in its --type-* tokens (Lalezar, Noto Naskh Arabic…). */
export function themeFontFamilies(css: string) {
  const out = new Set<string>();
  for (const m of css.matchAll(/--type-(?:body|display):([^;]+);/g)) {
    // Only the lead family; the rest of the stack is the fallback.
    const lead = m[1].match(/"([^"]+)"/)?.[1];
    if (lead && !LOCAL_FAMILIES.has(lead)) out.add(lead);
  }
  return [...out];
}

function themeFontImport(families: string[]) {
  const q = families
    .map((f) => `family=${f.replaceAll(" ", "+")}${SINGLE_WEIGHT.has(f) ? "" : ":wght@400;500;600;700"}`)
    .join("&");
  return `@import url("https://fonts.googleapis.com/css2?${q}&display=swap");`;
}

function insertImport(current: string, line: string) {
  const next = current.replace(/^(@import\s+["']tailwindcss["'];\s*)/m, `$1\n${line}\n`);
  return next.includes(line) ? next : `${line}\n${current}`;
}

export function applyCss(project: Project, id: string, body: string, dryRun: boolean) {
  const current = readText(project.paths.css) ?? '@import "tailwindcss";\n';
  const next = upsertBlock(current, id, body);
  if (next === current) return false;
  writeFile(project.paths.css, next, dryRun);
  return true;
}

export function applyItemCss(project: Project, item: RegistryItem, dryRun: boolean) {
  if (!item.css?.trim()) return false;
  return applyCss(project, item.name, item.css, dryRun);
}

export function applyThemeTokens(
  project: Project,
  themeSlug: string,
  css: string,
  fontVar: string,
  dryRun: boolean,
  opts: { googleCss?: boolean } = {},
) {
  let current = readText(project.paths.css) ?? '@import "tailwindcss";\n';
  if (!current.includes('@import "tailwindcss"') && !current.includes("@import 'tailwindcss'") && !current.includes("tailwindcss")) {
    current = `@import "tailwindcss";\n\n${current}`;
  }
  if (opts.googleCss && !current.includes("fonts.googleapis.com") && !current.includes(googleFontImport())) {
    current = insertImport(current, googleFontImport());
  }
  // Display faces a design system needs (headings in Lalezar, Noto Naskh…) load by family name.
  const families = themeFontFamilies(css).filter((f) => !current.includes(`family=${f.replaceAll(" ", "+")}`));
  if (families.length) current = insertImport(current, themeFontImport(families));
  current = upsertBlock(current, `theme-${themeSlug}`, rewriteUserSource(css));
  current = upsertBlock(current, "tailwind-map", TAILWIND_THEME);
  current = upsertBlock(current, "font", fontTheme(fontVar));
  writeFile(project.paths.css, current, dryRun);
}

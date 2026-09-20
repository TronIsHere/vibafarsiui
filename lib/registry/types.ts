export type PropDoc = { name: string; type: string; default?: string; desc: string };

export type DocBase = {
  slug: string;
  name: string;
  desc: string;
  /** Path of the source file shown on the docs page, relative to the repo root. */
  file: string;
  /** npm packages beyond react/next/tailwind. */
  deps?: string[];
  /** Other registry items this one imports. */
  registryDeps?: string[];
  usage: string;
  props?: PropDoc[];
  notes?: string[];
  /** Component-specific requirements merged into the generated English prompt. */
  promptBullets: string[];
  /** Extra CSS (keyframes/utilities) that must be added to globals.css. */
  css?: string;
  /** Two columns wide on the landing grid. */
  wide?: boolean;
};

export type ComponentCat = "form" | "display" | "feedback" | "nav" | "overlay" | "data";
export type ComponentDoc = DocBase & { cat: ComponentCat };
export type AnimationDoc = DocBase;
export type BackgroundDoc = DocBase & {
  /** Rendered with WebGL through the `shader` primitive instead of CSS. */
  engine?: "webgl";
};
export type TemplateDoc = DocBase & { tags: string[]; pages: number };
export type BlockDoc = DocBase & { tags: string[] };
export type ThemeDoc = {
  slug: string;
  name: string;
  nameEn: string;
  desc: string;
  radius: string;
  swatches: [string, string, string, string];
  light?: boolean;
  file: string;
  promptBullets: string[];
};

export type SkillFormat = "skill" | "guide" | "external";
export type SkillIcon =
  | "chat"
  | "letter"
  | "input"
  | "rtl"
  | "calendar"
  | "shield"
  | "search"
  | "book"
  | "type"
  | "pen"
  | "upload"
  | "wallet"
  | "sms";
export type SkillDoc = {
  slug: string;
  name: string;
  nameEn: string;
  desc: string;
  /** skill = SKILL.md folder agents auto-load; guide = plain .md you link from CLAUDE.md; external = lives in another repo. */
  format: SkillFormat;
  icon: SkillIcon;
  /** Markdown source in this repo. Absent for external skills. */
  file?: string;
  tags: string[];
  /** When the skill kicks in, in Persian, for the docs page. */
  useWhen: string[];
  /** Illustrative before/after for one prompt. */
  example?: { prompt: string; without: string; with: string };
  repo?: string;
  author?: { name: string; url: string };
  license?: string;
  /** Install commands for external skills. */
  install?: { label: string; cmd: string }[];
};

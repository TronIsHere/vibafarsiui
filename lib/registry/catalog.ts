import { animations } from "./animations";
import { backgrounds } from "./backgrounds";
import { blocks } from "./blocks";
import { components } from "./components";
import { libs } from "./libs";
import { buildPrompt, buildThemePrompt } from "./prompt";
import { templates } from "./templates";
import { themes } from "./themes";
import type { DocBase, ThemeDoc } from "./types";

export const REGISTRY_TYPES = ["component", "animation", "background", "template", "block", "theme", "lib"] as const;
export type RegistryType = (typeof REGISTRY_TYPES)[number];

export type CatalogItem = {
  type: RegistryType;
  slug: string;
  name: string;
  nameEn?: string;
  desc: string;
  file: string;
  target: string;
  url: string;
  deps: string[];
  registryDeps: string[];
  tags: string[];
  category?: string;
  aliases: string[];
  prompt?: string;
};

export type Catalog = {
  name: "vibefarsi";
  homepage: string;
  schema: string;
  items: CatalogItem[];
};

export const EXTRA_ALIASES: Record<string, string[]> = {
  button: ["btn", "cta", "دکمه"],
  input: ["text field", "موبایل", "تلفن", "phone", "ایمیل", "فیلد"],
  textarea: ["توضیحات", "پیام"],
  select: ["dropdown", "شهر", "استان"],
  combobox: ["autocomplete", "typeahead", "جست‌وجوی شهر"],
  "otp-field": ["otp", "sms", "کد تایید", "کد تأیید", "verification"],
  "number-field": ["quantity", "تعداد", "stepper input"],
  "checkbox-group": ["checkbox", "چک باکس"],
  "radio-group": ["radio", "رادیو"],
  switch: ["toggle", "کلید"],
  slider: ["range"],
  rating: ["stars", "ستاره"],
  "file-upload": ["upload", "آپلود", "پیوست"],
  calendar: ["jalali", "شمسی", "تاریخ"],
  "date-picker": ["datepicker", "انتخاب تاریخ"],
  command: ["palette", "cmdk", "پالت"],
  dialog: ["modal", "مودال"],
  "alert-dialog": ["confirm", "تایید", "تأیید"],
  "dropdown-menu": ["menu", "منو"],
  tooltip: ["hover"],
  sheet: ["drawer", "کشو", "bottom sheet"],
  tabs: ["تب"],
  pagination: ["pager", "صفحه بندی", "صفحه‌بندی"],
  breadcrumb: ["crumbs", "مسیر"],
  stepper: ["wizard", "مراحل", "گام"],
  sidebar: ["nav", "ناوبری"],
  toast: ["notification", "اعلان", "snackbar"],
  alert: ["banner", "هشدار"],
  progress: ["bar", "نوار پیشرفت"],
  skeleton: ["placeholder", "loading"],
  "empty-state": ["empty", "خالی", "404"],
  badge: ["chip", "tag", "نشان"],
  avatar: ["userpic", "آواتار"],
  table: ["datatable", "جدول"],
  stat: ["kpi", "metric", "آمار"],
  price: ["toman", "تومان", "ریال", "money", "قیمت"],
  timeline: ["activity", "خط زمان"],
  accordion: ["faq", "پرسش"],
  kbd: ["shortcut", "کیبورد"],
  "prompt-input": ["chat input", "composer", "پرامپت"],
  card: ["panel", "کارت"],
  utils: ["fa", "digits", "toman", "format"],
  jalali: ["شمسی", "jalaali", "persian date"],
  auth: ["login", "signup", "ورود", "ثبت نام", "ثبت‌نام", "otp login"],
  "shop-dashboard": ["admin", "داشبورد", "فروش"],
  invoice: ["فاکتور", "پیش فاکتور", "receipt"],
  "ai-chat": ["chatgpt", "گفتگو", "گفت‌وگو"],
  settings: ["پروفایل", "تنظیمات"],
  pricing: ["plans", "پلن", "تعرفه"],
  "startup-landing": ["landing", "لندینگ", "marketing"],
  blog: ["article", "مقاله", "پست"],
  hero: ["هیرو"],
  testimonials: ["نظرات", "social proof"],
  graphite: ["default", "پیش فرض", "پیش‌فرض"],
  paper: ["light", "روشن"],
};

function collectionPath(type: RegistryType): string {
  if (type === "lib") return "lib";
  return `${type}s`;
}

function targetFor(type: RegistryType, file: string): string {
  const name = file.split("/").pop()!;
  if (type === "component") return `components/ui/${name}`;
  if (type === "animation") return `components/animations/${name}`;
  if (type === "background") return `components/backgrounds/${name}`;
  if (type === "template") return `components/templates/${name}`;
  if (type === "block") return `components/blocks/${name}`;
  if (type === "theme") return "app/globals.css";
  return file;
}

function aliasesFor(type: RegistryType, item: { slug: string; name: string; nameEn?: string }): string[] {
  const extra = EXTRA_ALIASES[item.slug] ?? [];
  return Array.from(new Set([item.slug, item.name, item.nameEn, item.slug.replace(/-/g, " "), ...extra].filter(Boolean) as string[]));
}

function fromDoc(type: Exclude<RegistryType, "theme">, item: DocBase, extra: Partial<CatalogItem> = {}): CatalogItem {
  return {
    type,
    slug: item.slug,
    name: item.name,
    desc: item.desc,
    file: item.file,
    target: targetFor(type, item.file),
    url: `/r/${collectionPath(type)}/${item.slug}.json`,
    deps: item.deps ?? [],
    registryDeps: item.registryDeps ?? [],
    tags: extra.tags ?? [],
    category: extra.category,
    aliases: aliasesFor(type, item),
    prompt: buildPrompt(item, type),
    ...extra,
  };
}

function fromTheme(item: ThemeDoc): CatalogItem {
  return {
    type: "theme",
    slug: item.slug,
    name: item.name,
    nameEn: item.nameEn,
    desc: item.desc,
    file: item.file,
    target: "app/globals.css",
    url: `/r/themes/${item.slug}.json`,
    deps: [],
    registryDeps: [],
    tags: [item.nameEn, item.light ? "light" : "dark", `radius-${item.radius}`],
    aliases: aliasesFor("theme", item),
    prompt: buildThemePrompt(item),
  };
}

export function buildCatalog(homepage = "https://vibefarsi.dev"): Catalog {
  const items: CatalogItem[] = [
    ...libs.map((i) => fromDoc("lib", i)),
    ...components.map((i) => fromDoc("component", i, { category: i.cat, tags: [i.cat] })),
    ...animations.map((i) => fromDoc("animation", i)),
    ...backgrounds.map((i) => fromDoc("background", i)),
    ...templates.map((i) => fromDoc("template", i, { tags: i.tags })),
    ...blocks.map((i) => fromDoc("block", i, { tags: i.tags })),
    ...themes.map(fromTheme),
  ];
  return {
    name: "vibefarsi",
    homepage,
    schema: "https://vibefarsi.dev/schema/registry-item.json",
    items,
  };
}

export function findCatalogItem(catalog: Catalog, type: RegistryType, slug: string) {
  return catalog.items.find((i) => i.type === type && i.slug === slug);
}

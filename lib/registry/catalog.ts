import { animations } from "./animations";
import { backgrounds } from "./backgrounds";
import { blocks } from "./blocks";
import { components } from "./components";
import { libs } from "./libs";
import { buildPrompt, buildThemePrompt } from "./prompt";
import { templates } from "./templates";
import { hostedSkills, skillTarget } from "./skills";
import { themes } from "./themes";
import type { DocBase, SkillDoc, ThemeDoc } from "./types";

export const REGISTRY_TYPES = ["component", "animation", "background", "template", "block", "theme", "lib", "skill"] as const;
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
  // skills
  "persian-conversational": ["محاوره", "محاوره‌ای", "خودمونی", "عامیانه", "colloquial", "casual persian", "کپشن", "لحن دوستانه"],
  "persian-formal": ["رسمی", "اداری", "نامه", "نامه اداری", "پروپوزال", "قرارداد", "formal", "official letter"],
  "persian-ui-copy": ["microcopy", "ui copy", "متن دکمه", "پیام خطا", "لیبل", "ترجمه رابط", "فارسی‌سازی", "واژه‌نامه"],
  "persian-rtl-ui": ["rtl", "راست چین", "راست‌چین", "design rules", "قوانین طراحی", "logical properties", "tailwind rtl"],
  "jalali-calendar": ["jalali", "شمسی", "تقویم", "تاریخ", "هجری خورشیدی", "شنبه", "نوروز", "asia/tehran", "date"],
  "iran-validation": ["validation", "اعتبارسنجی", "کد ملی", "شبا", "iban", "شماره کارت", "luhn", "موبایل", "کد پستی", "پلاک"],
  "persian-seo": ["seo", "سئو", "متادیتا", "metadata", "hreflang", "اسلاگ", "slug", "json-ld", "گوگل"],
  "agents-md-persian": ["claude.md", "agents.md", "cursor rules", "قوانین", "rules", "system prompt", "راهنما"],
  "ui-craft-rules": ["craft", "slop", "vibe coding", "وایب کدینگ", "وایب‌کدینگ", "design system", "دیزاین سیستم", "skeleton", "layout shift", "touch target", "stagger"],
  "persian-typography": ["typography", "تایپوگرافی", "فونت", "font", "vazirmatn", "iransans", "نیم‌فاصله", "zwnj", "line-height"],
  "persian-writing": ["نگارش", "ویرایش", "humanize", "غلط‌گیری", "docx", "pdf", "ali2000hos"],
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
  float: ["portal", "overlay", "fixed"],
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
  shader: ["webgl", "glsl", "شیدر", "canvas", "shader canvas"],
  silk: ["satin", "ساتن", "پارچه"],
  fog: ["smoke", "mist", "دود", "مه"],
  nebula: ["clouds", "domain warp", "ابر"],
  contour: ["topographic", "map", "توپوگرافی", "نقشه"],
  voronoi: ["cells", "ورونوی", "سلول"],
  "warp-grid": ["distorted grid", "liquid grid", "شبکه"],
  godrays: ["light rays", "beams", "پرتو", "نور"],
  "water-ripple": ["ripples", "water", "آب", "موج", "cursor"],
  dither: ["bayer", "retro", "pixel", "دیتر"],
  halftone: ["dots", "print", "ترام", "هافتون"],
  waves: ["lines", "sine", "موج", "خط"],
  plasma: ["پلاسما", "demoscene", "sine"],
  truchet: ["تروشه", "tiles", "maze", "کاشی", "هزارتو"],
  "hex-grid": ["hexagon", "honeycomb", "شش ضلعی", "شش‌ضلعی", "لانه زنبوری"],
  marble: ["مرمر", "stone", "veins", "سنگ"],
  metaballs: ["lava lamp", "goo", "blob", "گوی", "چسبناک"],
  kaleidoscope: ["کلایدوسکوپ", "mirror", "mandala", "آینه"],
  "cursor-trail": ["cursor", "comet", "trail", "رد ماوس", "دنباله", "ماوس"],
  particles: ["dust", "floating", "ذرات", "غبار", "particle"],
  moire: ["مواره", "interference", "rings", "تداخل"],
  scanlines: ["crt", "retro", "tv", "اسکن لاین", "اسکن‌لاین", "تلویزیون"],
  "iso-cubes": ["isometric", "cubes", "3d", "ایزومتریک", "مکعب"],
  "liquid-gradient": ["chroma flow", "fluid", "gradient", "گرادیان", "سیال", "cursor"],
  paper: ["light", "روشن"],
  "national-id-input": ["national id", "کد ملی", "کدملی", "شماره ملی", "melli code"],
  "card-number-input": ["card number", "شماره کارت", "کارت بانکی", "bank card", "bin", "شماره‌ی کارت"],
  "plate-input": ["plate", "پلاک", "پلاک خودرو", "license plate", "ماشین", "خودرو"],
  "date-range-picker": ["jalali-range-picker", "range picker", "بازه تاریخ", "بازه‌ی تاریخ", "از تاریخ تا تاریخ", "range calendar"],
  "time-picker": ["jalali-time-picker", "timepicker", "ساعت", "انتخاب ساعت", "زمان", "clock"],
  "amount-input": ["amount", "مبلغ", "money input", "تومان", "به حروف"],
  persian: ["validation", "اعتبارسنجی", "iranian", "کد ملی", "شبا", "پلاک"],
  "number-to-words": ["عدد به حروف", "به حروف", "words", "tomanToWords", "مبلغ به حروف"],
  "search-input": ["search", "جست‌وجو", "جستجو", "سرچ", "search box", "searchbar"],
  "tags-input": ["tags", "برچسب", "تگ", "chips input", "keywords", "کلیدواژه"],
  "multi-select": ["multiselect", "چند انتخابی", "چندگزینه‌ای", "select multiple", "checkbox dropdown"],
  toggle: ["toggle group", "pressed", "دکمه فشاری", "فیلتر", "segmented buttons"],
  "segmented-control": ["segmented", "segment", "بخشی", "سوییچ چندحالته", "ios control"],
  separator: ["divider", "hr", "جداکننده", "خط", "یا"],
  spinner: ["loader", "loading", "بارگذاری", "لودینگ", "چرخنده"],
  collapsible: ["collapse", "show more", "نمایش بیشتر", "بازشو", "expand"],
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

function fromDoc(type: Exclude<RegistryType, "theme" | "skill">, item: DocBase, extra: Partial<CatalogItem> = {}): CatalogItem {
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

function fromSkill(item: SkillDoc & { file: string }): CatalogItem {
  return {
    type: "skill",
    slug: item.slug,
    name: item.name,
    nameEn: item.nameEn,
    desc: item.desc,
    file: item.file,
    target: skillTarget(item),
    url: `/r/skills/${item.slug}.json`,
    deps: [],
    registryDeps: [],
    tags: [item.format, ...item.tags],
    aliases: aliasesFor("skill", item),
  };
}

export function buildCatalog(homepage = "https://vibefarsi.ir"): Catalog {
  const items: CatalogItem[] = [
    ...libs.map((i) => fromDoc("lib", i)),
    ...components.map((i) => fromDoc("component", i, { category: i.cat, tags: [i.cat] })),
    ...animations.map((i) => fromDoc("animation", i)),
    ...backgrounds.map((i) => fromDoc("background", i, { tags: i.engine ? ["webgl", "shader", "شیدر"] : [] })),
    ...templates.map((i) => fromDoc("template", i, { tags: i.tags })),
    ...blocks.map((i) => fromDoc("block", i, { tags: i.tags })),
    ...themes.map(fromTheme),
    ...hostedSkills.map(fromSkill),
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

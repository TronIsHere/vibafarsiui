export * from "./types";
export * from "./components";
export * from "./animations";
export * from "./backgrounds";
export * from "./templates";
export * from "./blocks";
export * from "./themes";
export * from "./prompt";
export * from "./libs";
export * from "./catalog";

import { components } from "./components";
import { animations } from "./animations";
import { backgrounds } from "./backgrounds";
import { templates } from "./templates";
import { blocks } from "./blocks";
import { themes } from "./themes";

export type SectionKey = "components" | "blocks" | "templates" | "animations" | "backgrounds" | "themes";

export const sections: { key: SectionKey; label: string; desc: string; count: number }[] = [
  { key: "components", label: "کامپوننت‌ها", desc: "دکمه، فرم، جدول؛ از پایه راست‌چین", count: components.length },
  { key: "blocks", label: "بلاک‌ها", desc: "بخش‌های آماده: هیرو، قیمت، پرسش‌های متداول", count: blocks.length },
  { key: "animations", label: "انیمیشن‌ها", desc: "حرکت با CSS و React؛ بدون کتابخانه‌ی اضافه", count: animations.length },
  { key: "backgrounds", label: "پس‌زمینه‌ها", desc: "الگو و نور کم‌کنتراست؛ متن خوانا می‌ماند", count: backgrounds.length },
  { key: "templates", label: "قالب‌ها", desc: "صفحه‌های کامل، از همین قطعه‌ها", count: templates.length },
  { key: "themes", label: "سیستم‌های طراحی", desc: "توکن رنگ و شعاع؛ هر وقت بخواهید عوض می‌شود", count: themes.length },
];

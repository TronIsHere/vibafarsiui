import type { DocBase } from "./types";

/** Shared helpers the registry depends on. Not shown as docs pages; served at /r/lib/*.json */
export const libs: DocBase[] = [
  {
    slug: "utils",
    name: "ابزارهای فارسی",
    desc: "ارقام فارسی، تومان، درصد، حجم فایل و اتصال کلاس‌ها. تقریباً هر کامپوننت به این فایل نیاز دارد.",
    file: "lib/utils.ts",
    usage: `import { cn, fa, faNumber, formatToman, faPercent, faFileSize, en } from "@/lib/utils"

formatToman(1_250_000) // ۱۲٬۲۵۰٬۰۰۰ تومان
fa(1405)               // ۱۴۰۵`,
    promptBullets: [
      "fa converts Latin digits to Persian; faNumber adds the thousands separator «٬»; formatToman puts the unit after the number.",
      "en parses user input (Persian or Arabic-Indic digits to Latin). cn concatenates classes with no clsx dependency.",
      "Never show Latin digits in Persian UI copy; keep Latin digits in URLs and form values.",
    ],
  },
  {
    slug: "jalali",
    name: "تقویم شمسی",
    desc: "تبدیل میلادی ↔ شمسی، نام ماه و روز هفته، بدون وابستگی. پیش‌نیاز تقویم و خط زمان.",
    file: "lib/jalali.ts",
    usage: `import { toJalali, toGregorian, JALALI_MONTHS, JALALI_WEEKDAYS } from "@/lib/jalali"

const { jy, jm, jd } = toJalali(new Date())
JALALI_WEEKDAYS[0] // شنبه`,
    promptBullets: [
      "Week starts on Saturday, not Monday. Charts and calendars must follow that.",
      "toJalali / toGregorian with no date library. Valid years 1 to 3177.",
      "Take month and weekday names from this file; do not translate them.",
    ],
  },
];

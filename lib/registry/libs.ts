import type { DocBase } from "./types";

/** Shared helpers the registry depends on. Not shown as docs pages; served at /r/lib/*.json */
export const libs: DocBase[] = [
  {
    slug: "utils",
    name: "ابزارهای فارسی",
    desc: "اعداد فارسی، تومان، درصد، حجم فایل و اتصال کلاس‌ها. تقریباً هر کامپوننتی به این فایل نیاز داره.",
    file: "lib/utils.ts",
    usage: `import { cn, fa, faNumber, formatToman, faPercent, faFileSize, en } from "@/lib/utils"

formatToman(1_250_000) // ۱٬۲۵۰٬۰۰۰ تومان
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
    desc: "تبدیل میلادی به شمسی و برعکس، نام ماه و روز هفته، بدون وابستگی. پیش‌نیاز تقویم و خط زمانه.",
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
  {
    slug: "persian",
    name: "اعتبارسنجی ایرانی",
    desc: "اعتبارسنجی موبایل، شبا، کد ملی و شماره‌ی کارت با جدول بانک‌ها، پلاک خودرو و زمان نسبی. پیش‌نیاز فیلدهای ایرانیه.",
    file: "lib/persian.ts",
    usage: `import { isNationalId, cardBank, isIban, ibanBank, parsePlate, formatPlate } from "@/lib/persian"

isNationalId("0499370899") // true
cardBank("6037 9911")      // ملی
formatPlate(parsePlate("12ب345-11")) // ۱۲ ب ۳۴۵ ایران ۱۱`,
    promptBullets: [
      "Every function accepts Persian or Latin digits; normalize with en() before validating.",
      "Bank names come from two tables: IBAN bank code (digits 5–7) and card BIN (first 6 digits); bankLabel() adds «بانک» unless the name already has it.",
      "Plate helpers: PLATE_LETTERS with class labels, parsePlate / stringifyPlate («12ب345-11») / formatPlate («۱۲ ب ۳۴۵ ایران ۱۱»).",
    ],
  },
  {
    slug: "number-to-words",
    name: "عدد به حروف",
    desc: "۱٬۲۵۰٬۰۰۰ را به «یک میلیون و دویست و پنجاه هزار تومان» تبدیل می‌کنه، برای فاکتور، چک و تأیید پرداخت.",
    file: "lib/number-to-words.ts",
    usage: `import { numberToWords, tomanToWords, rialToWords } from "@/lib/number-to-words"

tomanToWords(1_250_000) // یک میلیون و دویست و پنجاه هزار تومان
numberToWords("۱۴۰۵")   // هزار و چهارصد و پنج`,
    promptBullets: [
      "Groups of three digits with scales هزار، میلیون، میلیارد، تریلیون; join groups with « و »; «هزار» alone for 1000, «یک میلیون» for 1e6.",
      "Accept number, bigint, or a string with Persian digits and «٬» separators; negative → «منفی»; decimals → «ممیز» then digit by digit.",
      "amountToWords(n, unit) appends the unit; tomanToWords and rialToWords are shortcuts.",
    ],
  },
];

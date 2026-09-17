/**
 * Iranian-specific validation and formatting: mobile numbers, شبا (IBAN), کد ملی.
 * Dependency-free; accepts Persian or Latin digits everywhere.
 */
import { en, fa } from "./utils";

/* ---------- mobile ---------- */

/** Normalizes «۰۹۱۲…», «+98912…», «0098912…» to the 10-digit form «912…». */
export function normalizeIranMobile(input: string): string {
  let d = en(input).replace(/\D/g, "");
  if (d.startsWith("0098")) d = d.slice(4);
  else if (d.startsWith("98") && d.length > 10) d = d.slice(2);
  if (d.startsWith("0")) d = d.slice(1);
  return d.slice(0, 10);
}

export function isIranMobile(input: string): boolean {
  return /^9\d{9}$/.test(normalizeIranMobile(input));
}

/** «912 345 6789» — three groups, always LTR. */
export function formatIranMobile(input: string): string {
  const d = normalizeIranMobile(input);
  return [d.slice(0, 3), d.slice(3, 6), d.slice(6, 10)].filter(Boolean).join(" ");
}

const OPERATORS: [RegExp, string][] = [
  [/^(91\d|99[0-6])/, "همراه اول"],
  [/^(93[0-9]|90[1-5])/, "ایرانسل"],
  [/^92[0-2]/, "رایتل"],
  [/^998/, "شاتل موبایل"],
  [/^999/, "سامانتل"],
];

export function mobileOperator(input: string): string | null {
  const d = normalizeIranMobile(input);
  if (d.length < 3) return null;
  return OPERATORS.find(([re]) => re.test(d))?.[1] ?? null;
}

/* ---------- شبا / IBAN ---------- */

/** Keeps «IR» + up to 24 digits, upper-cased, digits normalized. */
export function normalizeIban(input: string): string {
  const raw = en(input).toUpperCase().replace(/[^0-9A-Z]/g, "");
  const digits = raw.replace(/^IR/, "").replace(/\D/g, "").slice(0, 24);
  return "IR" + digits;
}

/** Standard IBAN mod-97 check for IR accounts (IR + 24 digits). */
export function isIban(input: string): boolean {
  const iban = normalizeIban(input);
  if (!/^IR\d{24}$/.test(iban)) return false;
  const rearranged = iban.slice(4) + "1827" + iban.slice(2, 4); // I=18, R=27
  let rem = 0;
  for (const ch of rearranged) rem = (rem * 10 + Number(ch)) % 97;
  return rem === 1;
}

/** «IR12 0170 0000 0010 2345 6789 01» */
export function formatIban(input: string): string {
  const iban = normalizeIban(input);
  return iban.replace(/(.{4})/g, "$1 ").trim();
}

const BANKS: Record<string, string> = {
  "010": "بانک مرکزی", "011": "صنعت و معدن", "012": "ملت", "013": "رفاه کارگران", "014": "مسکن", "015": "سپه", "016": "کشاورزی",
  "017": "ملی", "018": "تجارت", "019": "صادرات", "020": "توسعه صادرات", "021": "پست بانک", "022": "توسعه تعاون", "051": "مؤسسه توسعه",
  "053": "کارآفرین", "054": "پارسیان", "055": "اقتصاد نوین", "056": "سامان", "057": "پاسارگاد", "058": "سرمایه", "059": "سینا",
  "060": "قرض‌الحسنه مهر ایران", "061": "شهر", "062": "آینده", "064": "گردشگری", "066": "دی", "069": "ایران زمین", "070": "رسالت",
  "078": "خاورمیانه", "079": "مؤسسه ملل",
};

/** Bank name from the 3-digit bank code inside the IBAN, or null. */
export function ibanBank(input: string): string | null {
  const iban = normalizeIban(input);
  if (iban.length < 7) return null;
  return BANKS[iban.slice(4, 7)] ?? null;
}

/* ---------- کد ملی ---------- */

export function isNationalId(input: string): boolean {
  const d = en(input).replace(/\D/g, "");
  if (!/^\d{10}$/.test(d) || /^(\d)\1{9}$/.test(d)) return false;
  const check = Number(d[9]);
  const sum = d.slice(0, 9).split("").reduce((s, ch, i) => s + Number(ch) * (10 - i), 0);
  const r = sum % 11;
  return r < 2 ? check === r : check === 11 - r;
}

/* ---------- card ---------- */

/** «۶۰۳۷ ۹۹۱۱ ۲۲۳۳ ۴۴۵۵» — Persian digits, four groups. */
export function formatCardNumber(input: string): string {
  const d = en(input).replace(/\D/g, "").slice(0, 16);
  return fa(d.replace(/(.{4})/g, "$1 ").trim());
}

/** Luhn check for 16-digit bank cards. */
export function isCardNumber(input: string): boolean {
  const d = en(input).replace(/\D/g, "");
  if (d.length !== 16) return false;
  let sum = 0;
  for (let i = 0; i < 16; i++) {
    let n = Number(d[i]);
    if (i % 2 === 0) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
  }
  return sum % 10 === 0;
}

/* ---------- relative time ---------- */

/** «همین حالا»، «۵ دقیقه پیش»، «۳ ساعت پیش»، «دیروز»، «۴ روز پیش» */
export function timeAgo(date: Date, now = new Date()): string {
  const s = Math.max(0, Math.round((now.getTime() - date.getTime()) / 1000));
  if (s < 60) return "همین حالا";
  const m = Math.round(s / 60);
  if (m < 60) return `${fa(m)} دقیقه پیش`;
  const h = Math.round(m / 60);
  if (h < 24) return `${fa(h)} ساعت پیش`;
  const d = Math.round(h / 24);
  if (d === 1) return "دیروز";
  if (d < 30) return `${fa(d)} روز پیش`;
  const mo = Math.round(d / 30);
  return mo < 12 ? `${fa(mo)} ماه پیش` : `${fa(Math.round(mo / 12))} سال پیش`;
}

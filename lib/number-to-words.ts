/**
 * Persian number-to-words: 1_250_000 → «یک میلیون و دویست و پنجاه هزار».
 * Dependency-free; accepts number, bigint, or a string with Persian/Latin digits
 * and «٬» or «,» separators, so it can sit directly behind a text field.
 */

const ONES = ["", "یک", "دو", "سه", "چهار", "پنج", "شش", "هفت", "هشت", "نه"];
const TEENS = ["ده", "یازده", "دوازده", "سیزده", "چهارده", "پانزده", "شانزده", "هفده", "هجده", "نوزده"];
const TENS = ["", "", "بیست", "سی", "چهل", "پنجاه", "شصت", "هفتاد", "هشتاد", "نود"];
const HUNDREDS = ["", "صد", "دویست", "سیصد", "چهارصد", "پانصد", "ششصد", "هفتصد", "هشتصد", "نهصد"];
/** Each step is ×1000. «هزار» is special-cased below («هزار», not «یک هزار»). */
const SCALES = ["", "هزار", "میلیون", "میلیارد", "تریلیون", "کوادریلیون", "کوینتیلیون", "سکستیلیون"];

const AND = " و ";

const toLatinDigits = (s: string) =>
  s.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660));

/** Words for 0 … 999 (empty string for 0). */
function group(n: number): string {
  const parts: string[] = [];
  const h = Math.floor(n / 100);
  const rest = n % 100;
  if (h) parts.push(HUNDREDS[h]);
  if (rest >= 10 && rest < 20) parts.push(TEENS[rest - 10]);
  else {
    const t = Math.floor(rest / 10);
    const o = rest % 10;
    if (t) parts.push(TENS[t]);
    if (o) parts.push(ONES[o]);
  }
  return parts.join(AND);
}

/** Splits «-12.50» style input into sign, integer digits and fractional digits. */
function parse(input: number | bigint | string): { negative: boolean; int: string; frac: string } | null {
  let s = typeof input === "number" ? (Number.isFinite(input) ? String(input) : "") : String(input);
  s = toLatinDigits(s).replace(/[٬,_\s]/g, "").replace("٫", ".").trim();
  // Expand exponent notation from large JS numbers (1e21 …).
  if (/e/i.test(s)) s = BigInt(Math.trunc(Number(s))).toString();
  const m = /^([-+]?)(\d*)(?:\.(\d*))?$/.exec(s);
  if (!m || (!m[2] && !m[3])) return null;
  return { negative: m[1] === "-", int: (m[2] || "0").replace(/^0+(?=\d)/, ""), frac: (m[3] ?? "").replace(/0+$/, "") };
}

/** Whole-number digits → words. Assumes a non-empty string of Latin digits. */
function integerWords(digits: string): string {
  if (/^0+$/.test(digits)) return "صفر";
  const groups: string[] = [];
  for (let end = digits.length; end > 0; end -= 3) groups.unshift(digits.slice(Math.max(0, end - 3), end));
  if (groups.length > SCALES.length) throw new RangeError("Number too large for numberToWords");
  const parts: string[] = [];
  groups.forEach((g, i) => {
    const n = Number(g);
    if (!n) return;
    const scale = SCALES[groups.length - 1 - i];
    if (scale === "هزار" && n === 1) parts.push("هزار");
    else parts.push(scale ? `${group(n)} ${scale}` : group(n));
  });
  return parts.join(AND);
}

/**
 * numberToWords(1250000)      → «یک میلیون و دویست و پنجاه هزار»
 * numberToWords("۱٬۲۵۰٬۰۰۰")  → same; Persian digits and «٬» are fine
 * numberToWords(-42)          → «منفی چهل و دو»
 * numberToWords(12.5)         → «دوازده ممیز پنج»
 * Returns "" for input that is not a number.
 */
export function numberToWords(input: number | bigint | string): string {
  const p = parse(input);
  if (!p) return "";
  let words = integerWords(p.int);
  if (p.frac) words += ` ممیز ${p.frac.split("").map((d) => (d === "0" ? "صفر" : ONES[Number(d)])).join(" ")}`;
  return p.negative && words !== "صفر" ? `منفی ${words}` : words;
}

/** «یک میلیون و دویست و پنجاه هزار تومان». Fractions are dropped; amounts are whole. */
export function amountToWords(input: number | bigint | string, unit = "تومان"): string {
  const p = parse(input);
  if (!p) return "";
  const words = integerWords(p.int);
  return `${p.negative && words !== "صفر" ? "منفی " : ""}${words} ${unit}`.trim();
}

/** Toman shortcut used by invoices and checkout summaries. */
export const tomanToWords = (input: number | bigint | string) => amountToWords(input, "تومان");

/** Rial shortcut for bank-facing forms. */
export const rialToWords = (input: number | bigint | string) => amountToWords(input, "ریال");

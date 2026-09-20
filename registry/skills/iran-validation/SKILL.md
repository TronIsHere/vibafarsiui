---
name: iran-validation
description: >
  Validate and format Iranian identifiers correctly: national ID (کد ملی)
  checksum, mobile numbers (۰۹…), landlines with area codes, IBAN / Sheba
  (شبا) mod-97, bank card numbers with Luhn and BIN-to-bank lookup, postal
  code (کد پستی), vehicle plates (پلاک), and Persian/Arabic digit
  normalization. Use for any signup, KYC, checkout, address or payment form in
  an Iranian product, or when the user mentions اعتبارسنجی، کد ملی، شبا،
  شماره کارت، شماره موبایل، کد پستی، پلاک. Replaces US-style patterns (SSN,
  ZIP, 10-digit phones) that models reach for by default.
---

# Iranian validation (اعتبارسنجی ایرانی)

Models validate Iranian fields with American shapes: 9-digit "SSN", 5-digit
ZIP, `(555) 123-4567`. Every one of these is wrong here. The exact rules are
below; when VibeFarsi is in the project, prefer its `lib/persian.ts` helpers
(`isNationalId`, `isIban`, `ibanBank`, `cardBank`, `parsePlate`) over
re-implementing.

## 0. Normalize digits first (every field)

Users type on Persian and Arabic keyboards. Map both digit sets to ASCII
before any check, and strip spaces, dashes and ZWNJ:

```ts
export function en(s: string) {
  return s
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))   // Persian ۰–۹
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))   // Arabic-Indic ٠–٩
    .replace(/[\s‌_-]/g, "");
}
```

Display the value back with Persian digits; submit the ASCII string.

## 1. National ID (کد ملی)

- Exactly 10 digits. Reject all-same-digit values (`0000000000`, `1111111111`).
- Checksum: weight the first nine digits 10 down to 2, sum, `r = sum % 11`.
  If `r < 2` the check digit (10th) must equal `r`; otherwise it must equal
  `11 - r`.

```ts
export function isNationalId(input: string) {
  const s = en(input);
  if (!/^\d{10}$/.test(s) || /^(\d)\1{9}$/.test(s)) return false;
  const check = +s[9];
  const sum = [...s.slice(0, 9)].reduce((acc, d, i) => acc + +d * (10 - i), 0);
  const r = sum % 11;
  return r < 2 ? check === r : check === 11 - r;
}
```

- Leading zeros are significant; keep the value as a string, never a number.
- Label «کد ملی», `inputMode="numeric"`, `dir="ltr"`, max length 10.
- Error copy: «کد ملی باید ۱۰ رقم باشد» / «کد ملی معتبر نیست».
- Legal entities use a different 11-digit «شناسه ملی»; do not validate it with
  the personal algorithm.

## 2. Mobile numbers (شماره موبایل)

- Local form: 11 digits starting with `09` (`09123456789`). International:
  `+989123456789` or `00989…`. Accept all three; store E.164 (`+98…`) or the
  local form consistently.
- Regex after normalization: `^(?:\+98|0098|0)?9\d{9}$`.
- Operator from the prefix is a *hint* (for an icon or label), never a gate:
  `091x` همراه اول, `093x` ایرانسل, `092x` رایتل; other ranges exist and new
  ones appear. Do not reject unknown prefixes.
- Field: `dir="ltr"`, `inputMode="tel"`, `autoComplete="tel"`, label
  «شماره موبایل», placeholder «۰۹۱۲۳۴۵۶۷۸۹».
- Display grouped as «۰۹۱۲ ۳۴۵ ۶۷۸۹».

## 3. Landlines (تلفن ثابت)

- 11 digits: `0` + 2-digit area code + 8 digits (e.g. Tehran `021`, Karaj
  `026`, Isfahan `031`, Mashhad `051`, Shiraz `071`, Tabriz `041`).
- Regex: `^0[1-9]\d{9}$`. Do not apply the mobile rule to landlines.
- Label «تلفن ثابت»; show as «۰۲۱-۱۲۳۴۵۶۷۸».

## 4. IBAN / Sheba (شماره شبا)

- Format: `IR` + 2 check digits + 22 digits = 26 characters. Users often type
  it without `IR`; accept 24 digits and prepend `IR`.
- Validate with ISO 13616 mod-97: move the first four characters to the end,
  replace `I`→`18`, `R`→`27`, and the resulting big number mod 97 must be 1.
  Use `BigInt` or chunked modulo, not `Number`.

```ts
export function isIban(input: string) {
  const s = en(input).toUpperCase().replace(/^IR/, "");
  if (!/^\d{24}$/.test(s)) return false;
  // BBAN + "IR" as 18 27 + the two check digits, then mod 97
  const rearranged = `${s.slice(2)}1827${s.slice(0, 2)}`;
  let rem = 0;
  for (const ch of rearranged) rem = (rem * 10 + +ch) % 97;
  return rem === 1;
}
```

- Bank code is the 3 digits right after the check digits (`IR12 **017** …`).
  Map it to a bank name from a table for a label («بانک ملی»); when the code
  is unknown, show nothing rather than a guess.
- Field: `dir="ltr"`, monospace, grouped in fours for display
  «IR۱۲ ۰۱۷۰ ۰۰۰۰ …», label «شماره شبا», helper «با IR یا بدون آن».

## 5. Bank cards (شماره کارت)

- 16 digits, Luhn checksum. Grouped «۶۰۳۷ ۹۹۱۱ ۲۳۴۵ ۶۷۸۹» on screen.
- BIN (first 6 digits) identifies the bank; use it for a logo or name, not for
  acceptance. A few stable ones: `603799` ملی، `589210` سپه، `627353` تجارت،
  `610433` ملت، `603769` صادرات، `621986` سامان، `502229` پاسارگاد،
  `622106` پارسیان. Keep the full table in one file; do not type BINs from
  memory in components.
- Never store full card numbers; show only the last four for saved cards.
- Field: `dir="ltr"`, `inputMode="numeric"`, `autoComplete="cc-number"`,
  auto-insert spaces, paste accepts Persian digits.

```ts
export function luhn(input: string) {
  const s = en(input);
  if (!/^\d{16}$/.test(s)) return false;
  let sum = 0;
  for (let i = 0; i < 16; i++) {
    let d = +s[i];
    if (i % 2 === 0) { d *= 2; if (d > 9) d -= 9; }
    sum += d;
  }
  return sum % 10 === 0;
}
```

## 6. Postal code (کد پستی)

- 10 digits, often written as two groups «۱۲۳۴۵-۶۷۸۹۰». Accept with or
  without the dash; store 10 ASCII digits.
- Validate length and digits only. Do not invent structural rules.
- Label «کد پستی»، `inputMode="numeric"`, `dir="ltr"`.

## 7. Vehicle plates (پلاک خودرو)

- Standard private plate: 2 digits, a Persian letter, 3 digits, then the
  2-digit region code shown under «ایران»: «۱۲ ب ۳۴۵ ایران ۱۱».
- Letter set is a fixed list (ب، ج، د، س، ص، ط، ع، ق، ل، م، ن، و، هـ، ی and a
  few special classes). Use a select for the letter, not free text.
- Canonical string for storage: `12ب345-11`. Display with Persian digits and
  spaces.
- Motorcycle and other plate types differ; ask before assuming.

## 8. Address fields

Order and labels: استان → شهر → خیابان / محله → پلاک → واحد → کد پستی.
Province and city come from a list (select or combobox), not free text.
«پلاک» here is the building number, not a vehicle plate.

## 9. Error copy (Persian, specific)

| Field | Message |
|---|---|
| کد ملی | «کد ملی معتبر نیست.» |
| موبایل | «شماره موبایل باید ۱۱ رقم باشد و با ۰۹ شروع شود.» |
| شبا | «شماره شبا ۲۴ رقم بعد از IR دارد.» / «شماره شبا معتبر نیست.» |
| کارت | «شماره کارت باید ۱۶ رقم باشد.» / «شماره کارت معتبر نیست.» |
| کد پستی | «کد پستی باید ۱۰ رقم باشد.» |

Show errors under the field after blur or submit, never on the first keystroke.

## 10. Checklist

1. Digits normalized (Persian and Arabic-Indic) before every check.
2. National ID: 10 digits, not all same, checksum.
3. Mobile: `09` + 9 digits, operator only as a hint.
4. IBAN: `IR` + 24 digits, mod-97.
5. Card: 16 digits, Luhn, BIN for label only, never stored.
6. Postal code: 10 digits only.
7. Every field `dir="ltr"` with an RTL label and a Persian error message.

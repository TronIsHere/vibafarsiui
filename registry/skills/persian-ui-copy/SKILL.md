---
name: persian-ui-copy
description: >
  Write Persian (Farsi) UI microcopy: button labels, field labels and
  placeholders, validation and error messages, empty states, loading and
  success toasts, confirmations, notifications. Use whenever generating or
  translating any user-facing string for an Iranian product (متن دکمه، پیام
  خطا، لیبل فرم، ترجمه‌ی رابط کاربری، فارسی‌سازی). Includes an English→Persian
  UI glossary so «Login» becomes «ورود» and «Submit» becomes «ثبت», never a
  literal translation.
---

# Persian UI copy (متن رابط کاربری)

Interface strings are short, so every wrong word is loud. Models produce two
failure types: literal translations («ارسال نمایید» for Submit) and mismatched
register (a bureaucratic error under a friendly form). This skill fixes both.

## 1. Choose the product register once

| Register | Use for | Verb style |
|---|---|---|
| Formal-but-human (default) | Banking, B2B, admin panels, government, health | می‌شود، کنید، است |
| Light conversational | Consumer apps, shops, social, onboarding | میشه، می‌تونید، کنید |

Hold it across the whole product. «ذخیره شد» next to «پروفایلت آماده‌ست» in the
same screen is the mixing error. Imperatives («ذخیره کنید»، «بزنید») are the same
in both registers.

## 2. Glossary (English → Persian UI)

| English | Persian | Note |
|---|---|---|
| Login / Sign in | ورود | not «لاگین» |
| Sign up / Register | ثبت‌نام | with ZWNJ |
| Log out | خروج | |
| Submit | ثبت / ارسال | «ثبت» for forms that save, «ارسال» for messages |
| Save | ذخیره | |
| Cancel | انصراف | «لغو» for cancelling an order |
| Delete | حذف | |
| Edit | ویرایش | |
| Continue / Next | ادامه / بعدی | |
| Back / Previous | بازگشت / قبلی | |
| Done / Finish | تمام / پایان | |
| Retry | تلاش دوباره | |
| Search | جست‌وجو | with ZWNJ; «جستجو» is common but less correct |
| Filter / Sort | فیلتر / مرتب‌سازی | |
| Settings | تنظیمات | |
| Profile / Account | پروفایل / حساب کاربری | |
| Dashboard | داشبورد | |
| Notifications | اعلان‌ها | |
| Cart / Checkout | سبد خرید / پرداخت | |
| Order / Orders | سفارش / سفارش‌ها | |
| Add to cart | افزودن به سبد | |
| Buy now | خرید | |
| Price / Total | قیمت / جمع کل | |
| Discount / Coupon | تخفیف / کد تخفیف | |
| Email / Password | ایمیل / رمز عبور | |
| Phone number | شماره موبایل | «شماره تلفن» only for landlines |
| Verification code | کد تأیید | |
| Resend code | ارسال دوباره‌ی کد | |
| Address / Postal code | آدرس / کد پستی | |
| Upload / Download | آپلود / دانلود | «بارگذاری» is fine for formal |
| Loading… | در حال بارگذاری… | |
| Help / Support | راهنما / پشتیبانی | |
| Terms / Privacy | قوانین و مقررات / حریم خصوصی | |
| Yes / No | بله / خیر | avoid on buttons; see section 5 |
| OK | باشه (light) / تأیید (formal) | |

## 3. Buttons and actions

- One verb, no «کلیک کنید»: «ذخیره»، «ادامه»، «پرداخت». The label is the
  outcome, not the gesture.
- Primary action first in the reading order (right side in RTL), secondary
  «انصراف» after it.
- Destructive actions name the object: «حذف سفارش» not «حذف»، and the confirm
  dialog repeats it.
- Persian labels run longer than English. Leave room; never truncate a button.

## 4. Forms

- Label above the field, always visible; placeholder is an example, not a
  label: label «شماره موبایل», placeholder «مثلاً ۰۹۱۲۳۴۵۶۷۸۹».
- Required fields: mark optional ones with «(اختیاری)» instead of starring
  everything.
- Error text sits under the field and says what to change:
  «شماره موبایل باید ۱۱ رقم باشد و با ۰۹ شروع شود.»
  Never «خطا!»، never «مقدار نامعتبر است»، never «Oops».
- Helper text is one short sentence: «کد تأیید به این شماره پیامک می‌شود.»
- Password rules are listed before the user fails them.
- Do not tell users «فقط با حروف انگلیسی» unless the backend truly requires it.

## 5. Confirmations and dialogs

- Title asks the real question: «سفارش حذف شود؟»
- Buttons carry the action, not yes/no: «حذف کن» / «منصرف شدم» (light) or
  «حذف» / «انصراف» (formal).
- One sentence of consequence if it matters: «این کار قابل بازگشت نیست.»

## 6. Empty, loading, success, failure

| State | Pattern | Example |
|---|---|---|
| Empty | what goes here + the next action | «هنوز سفارشی ثبت نکرده‌اید. اولین سفارش را از فروشگاه شروع کنید.» |
| Loading | «در حال …» + ellipsis | «در حال ارسال…» |
| Success toast | short past tense | «ذخیره شد»، «کد ارسال شد» |
| Failure toast | what failed + what to do | «اتصال برقرار نشد. دوباره تلاش کنید.» |
| Offline | plain | «اینترنت قطع است.» |
| 404 | plain + a way out | «این صفحه وجود ندارد. به خانه برگردید.» |

Never «مشکلی پیش آمد» alone; say which thing and what next.

## 7. Numbers, money, dates inside copy

- Persian digits: «۳ کالا»، «۲ ساعت پیش». Thousands with «٬»: «۱٬۲۵۰٬۰۰۰».
- Unit after the number: «۱۲٬۰۰۰ تومان». Never «$», never «Toman».
- Percent after the number with «٪»: «۲۰٪ تخفیف».
- Dates Jalali: «۲۹ شهریور ۱۴۰۵»، relative «دیروز»، «۳ روز پیش».
- Plurals with numbers stay singular: «۳ کالا» not «۳ کالاها».
- Counts of one: «۱ پیام جدید» is fine; «یک پیام جدید» reads warmer.

## 8. Wording hygiene

- Address the user with «شما» verbs; the verb carries it, so do not repeat
  «شما» in every sentence. No «کاربر گرامی».
- No تعارف in UI («لطفاً» once per screen at most; «خواهشمندیم» never).
- No exclamation marks on errors; at most one «!» on a celebration.
- ZWNJ everywhere it belongs: می‌شود، ثبت‌نام، اعلان‌ها، سفارش‌ها.
- Persian «،» «؟» and «گیومه»; no em dashes.
- Latin brand names stay Latin («Google»، «PayPing»); Persian brands stay
  Persian («زرین‌پال»).
- Keep one term per concept across the product: pick «سفارش» or «خرید», not
  both for the same object.

## 9. Before / after

| Prompt | ❌ | ✅ |
|---|---|---|
| Submit button on a signup form | ارسال نمایید | ثبت‌نام |
| Invalid phone | شماره تلفن وارد شده نامعتبر می‌باشد | شماره موبایل باید ۱۱ رقم باشد و با ۰۹ شروع شود. |
| Empty orders list | هیچ داده‌ای یافت نشد | هنوز سفارشی ثبت نکرده‌اید. |
| Delete confirm | آیا مطمئن هستید؟ بله / خیر | سفارش حذف شود؟ حذف / انصراف |
| Saved toast | عملیات با موفقیت انجام شد | ذخیره شد |
| Price | 12,000 Toman | ۱۲٬۰۰۰ تومان |

## 10. Checklist

1. Register chosen and consistent across the screen.
2. Every label from the glossary or a deliberate deviation.
3. Errors say what to fix; empty states say what to do next.
4. Persian digits, units after numbers, Jalali dates.
5. ZWNJ, Persian punctuation, no exclamation on errors.

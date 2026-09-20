<div dir="rtl">

# مشارکت در وایب‌فارسی

</div>

> Stack, contribution rules, and how to add a registry item. The rest of this file is in Persian; commands stay in English.

<div dir="rtl">

این فایل برای کسی است که می‌خواهد PR بدهد. هدف این است که قبل از باز کردن PR مشخص باشد از چه چیزی استفاده می‌کنیم، چه چیزی عمداً نداریم، و یک تغییر جدید کجا باید بنشیند.

## استک و نسخه‌ها

سایت، رجیستری، CLI و MCP همه در همین مخزن هستند.

| لایه | تکنولوژی | نسخه / نکته |
| --- | --- | --- |
| سایت و رجیستری | Next.js (App Router) | `16.3.5` |
| UI | React + React DOM | `19.2.8` |
| استایل | Tailwind CSS | `v4` (`@tailwindcss/postcss`) |
| زبان | TypeScript | `^5`، `strict` |
| آیکون در رجیستری | `lucide-react` | تقریباً تنها وابستگی npm مجاز برای کامپوننت‌ها |
| هایلایت کد در سایت | `shiki` | فقط برای سایت، نه برای فایل‌های رجیستری |
| اعتبارسنجی / اسکیما | `zod` | سایت و MCP |
| پروتکل MCP | `@modelcontextprotocol/server` | `^2` |
| CLI | TypeScript خالص، بدون فریم‌ورک | پکیج npm: `vibefarsi` |
| MCP جدا | `mcp/` → `@vibefarsi/mcp` | Node `>=20` |
| پیش‌نمایش اسکرین‌شات | `playwright-core` | اسکریپت `npm run previews` |
| استقرار | Liara (`liara.json`)، پلتفرم Next، پورت `3000` | |

پیش‌نیاز برای تست و بیلد: همان `engines` داخل پکیج‌ها. CLI با Node `>=18`، MCP با Node `>=20`. نسخهٔ دقیق روی لپ‌تاپ مهم نیست؛ همان بازه را پاس کنید.

### عمداً نداریم

این‌ها را به رجیستری اضافه نکنید مگر اینکه بحث جداگانه و توافق روی PR باشد:

- `framer-motion` / Motion
- GSAP
- Radix UI به‌عنوان وابستگی عمومی
- `clsx` / `class-variance-authority` / `tailwind-merge` (تابع `cn` داخل `lib/utils.ts` است)
- کتابخانهٔ تاریخ میلادی مثل `date-fns` یا `dayjs` (تقویم شمسی در `lib/jalali.ts` است)
- رنگ هگز خام در کامپوننت‌ها؛ فقط توکن‌های تم (`background`، `foreground`، `brand`، …)

انیمیشن‌ها و بیشتر پس‌زمینه‌ها با CSS و React نوشته می‌شوند. بعضی پس‌زمینه‌ها موتور `webgl` دارند و از طریق primitive شیدر سایت رندر می‌شوند؛ خودِ فایل رجیستری هنوز باید سبک و بدون پکیج سنگین بماند.

## ساختار مخزن

```
registry/ سورس کامپوننت‌ها، بلاک‌ها، انیمیشن‌ها، پس‌زمینه‌ها، قالب‌ها، تم‌ها، مهارت‌ها
lib/registry/ متادیتا: نام، توضیح، پرامپت، deps، catalog
components/demos/ پیش‌نمایش زندهٔ هر آیتم در سایت
app/r/ API رجیستری برای CLI و MCP
packages/cli/ npx vibefarsi
mcp/ @vibefarsi/mcp
app/ خودِ سایت مستندات
```

منبع حقیقت برای هر آیتم دو جاست:

۱. فایل در `registry/...`
۲. ورودی متادیتا در `lib/registry/*.ts`

اگر فقط یکی را عوض کنید، سایت، CLI یا MCP ناقص می‌ماند.

## اجرای محلی

```bash
npm install
npm run dev # سایت + رجیستری روی http://localhost:3000
npm run lint
```

CLI از سورس:

```bash
npm run build:cli
npm run vibefarsi -- list --registry http://localhost:3000/r
```

MCP از سورس:

```bash
npm install --prefix mcp
npm run mcp
# رجیستری محلی:
VIBEFARSI_URL=http://localhost:3000 npm run mcp
```

رمز ادمین اختیاری در `.env.local` از روی `.env.example` (`ADMIN_PASSWORD`).

## قوانین محصول برای PR

- راست‌چین واقعی: ویژگی‌های منطقی CSS (`ps`/`pe`/`ms`/`me`/`text-start`)، نه `left`/`right` برای چیدمان.
- اعداد در UI فارسی؛ لاتین فقط در URL، مقدار فرم و کد.
- آیکون جهت‌دار در RTL برعکس معنی می‌دهد (`ArrowLeft` یعنی «بعدی»).
- رنگ فقط از توکن تم.
- `letter-spacing` روی متن فارسی نگذارید؛ `uppercase` هم نه.
- انیمیشن‌ها `prefers-reduced-motion` را رعایت کنند.
- وابستگی npm جدید در رجیستری تقریباً همیشه فقط `lucide-react` است. اگر چیز دیگری لازم است، در توضیح PR بگویید چرا و در فیلد `deps` متادیتا ثبتش کنید.

جزئیات کرافت رابط در [`registry/skills/ui-craft-rules.md`](registry/skills/ui-craft-rules.md) و قوانین فارسی/راست‌چین در مهارت‌های `registry/skills/` است.

## اضافه کردن یک آیتم جدید

مثال برای انیمیشن (کامپوننت و بلاک همین الگو را دارند):

۱. فایل را در `registry/animations/<slug>.tsx` بنویسید.
۲. متادیتا را در `lib/registry/animations.ts` اضافه کنید: `slug`، `name`، `desc`، `usage`، `promptBullets`، در صورت نیاز `props`، `css`، `deps`، `registryDeps`.
۳. دمو را در `components/demos/animations.tsx` وصل کنید تا صفحهٔ docs پیش‌نمایش داشته باشد.
۴. با `npm run dev` صفحهٔ `/animations/<slug>` و خروجی JSON در `/r/animations/<slug>.json` را چک کنید.
۵. اگر CSS جدا (مثلاً `@keyframes`) لازم است، همان را در فیلد `css` متادیتا بگذارید تا CLI به `globals.css` اضافه کند.

برای کامپوننت UI مسیر فایل `registry/ui/` و متادیتا `lib/registry/components.ts` است؛ مقصد نصب کاربر `components/ui` می‌ماند.

## شاخه و PR

۱. از آخرین `dev` (یا شاخه‌ای که maintainer گفته) شاخه بزنید.
۲. یک موضوع در هر PR؛ مثلاً فقط یک انیمیشن، یا فقط باگ Safari.
۳. در بدنهٔ PR بنویسید:
   - چه چیزی عوض شد و چرا
   - روی چه مرورگری تست کردید (Safari برای SVG/`textPath` مهم است)
   - آیا وابستگی npm جدید اضافه شده
۴. قبل از ارسال: `npm run lint` و در صورت تغییر رجیستری، پیش‌نمایش docs را یک‌بار ببینید.

Issue باز کردن برای باگ یا پیشنهاد هم خوب است؛ برای تغییر بزرگ اول Issue بهتر از PR مستقیم است.

## لایسنس

با ارسال PR موافقت می‌کنید که مشارکت‌تان تحت لایسنس MIT همین مخزن منتشر شود.

</div>

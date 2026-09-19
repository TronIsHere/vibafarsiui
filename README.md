<div dir="rtl">

# وایب‌فارسی

**کامپوننت‌های فارسی، برای توسعه‌دهنده‌ها و وایب‌کدرها.**

ابزارهای هوش مصنوعی و کتابخانه‌های انگلیسی به انگلیسی فکر می‌کنند: فونت Inter می‌گذارند، ارقام را لاتین می‌نویسند و دکمه را چپ‌چین می‌کنند. وایب‌فارسی یک رجیستری از قطعه‌های React + Tailwind است که از پایه راست‌چین‌اند؛ فونت، ارقام فارسی، تومان و تقویم شمسی داخل خود قطعه است.

وایب‌فارسی پکیج npm نیست؛ فایل هر قطعه داخل پروژه‌ی خودتان نوشته می‌شود و از همان لحظه مال شماست. هر قطعه دو خروجی دارد: کد TypeScript که در پروژه می‌گذارید، و یک پرامپت انگلیسی که قوانین راست‌چین و فارسی داخلش است و به Cursor یا Claude می‌دهید. سرور MCP هم دارد تا ادیتور خودش این قوانین و کدها را بخواند و لازم نباشد چیزی یادآوری کنید.

سایت و مستندات: [vibefarsi.dev](https://vibefarsi.dev)

Next.js و Vite · Tailwind v4 · بدون وابستگی اضافه · رایگان و متن‌باز

</div>

> Persian RTL components for React + Tailwind. Copy the file, run `npx vibefarsi add`, or let Cursor / Claude Code pull it over MCP. The rest of this README is in Persian; the commands are not.

<div dir="rtl">

## چرا راست‌چین کردن کل صفحه کافی نیست

- **راست‌چین واقعی.** چیدمان و آیکون‌ها از پایه راست‌چین‌اند و فقط از ویژگی‌های منطقی CSS استفاده می‌شود (مثلاً `text-start` به‌جای `text-left`).
- **تایپوگرافی فارسی.** وزن فونت و ارتفاع خط برای فارسی تنظیم شده؛ `letter-spacing` صفر است تا حروف از هم جدا نشوند.
- **اعداد و تقویم شمسی.** ارقام فارسی، جداکننده‌ی هزارگان، تومان و تاریخ شمسی داخل خود قطعه است. هفته از شنبه شروع می‌شود.
- **رنگ از توکن.** هر رنگ از یک متغیر CSS می‌آید. تم تیره پیش‌فرض است؛ با یک دستور عوضش می‌کنید.

## شروع سریع

روی یک پروژه‌ی Next.js یا Vite که Tailwind v4 دارد:

</div>

```bash
npx vibefarsi init
```

<div dir="rtl">

`init` یک‌بار اجرا می‌شود و این‌ها را می‌نویسد:

- <code dir="ltr">lang="fa" dir="rtl"</code> روی <code dir="ltr">&lt;html&gt;</code>؛ در Next.js داخل `app/layout.tsx` و در Vite داخل `index.html`
- فونت Vazirmatn؛ در Next.js از `next/font/google` با `app/fonts.ts`، در بقیه‌ی پروژه‌ها import از Google Fonts داخل CSS
- توکن‌های تم گرافیت و نگاشت Tailwind در `globals.css`
- `lib/utils.ts` (ارقام فارسی، `formatToman`، `cn`) و `lib/jalali.ts` (تبدیل شمسی) از رجیستری
- `vibefarsi.json` و مسیر <code dir="ltr">@/*</code> در tsconfig

بعد قطعه‌ها را اضافه کنید:

</div>

```bash
npx vibefarsi add button calendar price
npx vibefarsi list
```

<div dir="rtl">

وابستگی‌های رجیستری خودکار می‌آیند (`calendar` خودش `lib/jalali.ts` را می‌آورد) و پکیج‌های npm لازم نصب می‌شوند. مقصد فایل‌ها:

| نوع | مسیر |
| --- | --- |
| کامپوننت | `components/ui` |
| بلاک | `components/blocks` |
| انیمیشن | `components/animations` |
| پس‌زمینه | `components/backgrounds` |
| قالب | `components/templates` |
| تم | `app/globals.css` |

فلگ‌های پرکاربرد:

| فلگ | کار |
| --- | --- |
| <code dir="ltr">--font iransans</code> | اگر `IRANSans-Reg.woff` در پوشه‌ی `fonts` یا `public` باشد، همان را به‌جای Vazirmatn وصل می‌کند |
| <code dir="ltr">--theme saffron</code> | تم دیگری به‌جای گرافیت. بعداً هم با `npx vibefarsi add saffron` عوضش کنید |
| <code dir="ltr">--registry &lt;url&gt;</code> | رجیستری دیگری، مثلاً <code dir="ltr">http://localhost:3000/r</code> وقتی روی خود مخزن کار می‌کنید |
| <code dir="ltr">--dry-run</code> | فقط نشان می‌دهد چه فایل‌هایی نوشته می‌شوند؛ چیزی تغییر نمی‌کند |
| <code dir="ltr">--overwrite</code> | فایل‌های موجود را جایگزین می‌کند |
| <code dir="ltr">--no-install</code> | پکیج‌های npm را نصب نمی‌کند |

نصب دستی هم ممکن است: فایل را از سایت کپی کنید و `globals.css` را طبق [مستندات](https://vibefarsi.dev/docs) تنظیم کنید.

## MCP

سرور MCP وایب‌فارسی قوانین طراحی فارسی و کد قطعه‌ها را مستقیم به Cursor، Claude Code و Codex می‌دهد. یک‌بار آدرس <code dir="ltr">https://vibefarsi.ir/mcp</code> را اضافه کنید؛ بعد مثل همیشه پرامپت بدهید.

</div>

```json
{
  "mcpServers": {
    "vibefarsi": {
      "url": "https://vibefarsi.ir/mcp"
    }
  }
}
```

<div dir="rtl">

| ادیتور | کجا |
| --- | --- |
| Cursor | <code dir="ltr">.cursor/mcp.json</code> در پروژه، یا [افزودن به Cursor](https://cursor.com/en/install-mcp?name=vibefarsi&config=eyJ1cmwiOiJodHRwczovL3ZpYmVmYXJzaS5pci9tY3AifQ==) |
| Claude Code | <code dir="ltr">claude mcp add --transport http vibefarsi https://vibefarsi.ir/mcp</code> |
| Codex | <code dir="ltr">codex mcp add vibefarsi --url https://vibefarsi.ir/mcp</code> |

اگر بخواهید سرور روی سیستم خودتان اجرا شود: <code dir="ltr">npx -y @vibefarsi/mcp</code>.

ابزارهایی که مدل در اختیار دارد:

| ابزار | کار |
| --- | --- |
| `get_design_rules` | قوانین راست‌چین، فونت، ارقام و توکن |
| `search_registry` | جست‌وجو در قطعه‌ها؛ فارسی یا انگلیسی |
| `get_component` | کد و پرامپت همان قطعه، با وابستگی‌هایش |
| `get_theme` | توکن‌های رنگ و شعاع گوشه |
| `scaffold_page` | از توضیح صفحه، یک ترکیب آماده |

یک پرامپت معمولی مثل «یک صفحه‌ی پرداخت با خلاصه‌ی سبد و فرم آدرس بساز» این مسیر را می‌رود:

</div>

```
get_design_rules()
scaffold_page("صفحه‌ی پرداخت")
get_component(["input", "price", "button"])
```

<div dir="rtl">

خروجی همان بار اول درست است: فونت پروژه، چیدمان راست‌چین، مبلغ‌ها با ارقام فارسی و تومان، و رنگ‌ها از توکن‌های تم، نه رنگ دلخواه مدل.

## چه چیزهایی دارد

| بخش | تعداد | شامل |
| --- | --- | --- |
| [کامپوننت‌ها](https://vibefarsi.dev/components) | ۵۳ | دکمه، فرم، جدول داده، تقویم شمسی، شماره‌ی موبایل، کد تأیید، شماره‌ی شبا، قیمت به تومان |
| [بلاک‌ها](https://vibefarsi.dev/blocks) | ۸ | هیرو، ویژگی‌ها، ردیف قیمت، پرسش‌های متداول، آمار، نظر مشتریان، کارت ورود، فراخوان پایانی |
| [انیمیشن‌ها](https://vibefarsi.dev/animations) | ۲۴ | حرکت با CSS و React؛ بدون کتابخانه‌ی اضافه |
| [پس‌زمینه‌ها](https://vibefarsi.dev/backgrounds) | ۲۰ | الگو و نور کم‌کنتراست؛ متن خوانا می‌ماند |
| [قالب‌ها](https://vibefarsi.dev/templates) | ۱۶ | صفحه‌های کامل، از همین قطعه‌ها |
| [سیستم‌های طراحی](https://vibefarsi.dev/themes) | ۶ | گرافیت (پیش‌فرض)، فیروزه، زعفران، انار، لاجورد، کاغذ (روشن) |

## توسعه روی همین مخزن

سایت، رجیستری، CLI و سرور MCP همه در همین مخزن‌اند. همه‌چیز از پوشه‌ی `registry` می‌آید؛ سایت همان فایل‌ها را نشان می‌دهد و مسیر <code dir="ltr">/r</code> همان‌ها را به CLI و MCP می‌دهد.

</div>

```
registry/         ui/  blocks/  animations/  backgrounds/  templates/  themes/
lib/registry/     names, descriptions, prompts, catalog builder
app/r/            GET /r  (catalog)    GET /r/{type}/{slug}.json  (item)
packages/cli/     npx vibefarsi
mcp/              @vibefarsi/mcp
app/  components/ the site
```

```bash
npm install
npm run dev        # site + registry at http://localhost:3000
```

<div dir="rtl">

اجرای CLI از سورس:

</div>

```bash
npm run build:cli
npm run vibefarsi -- init --cwd ../my-app --registry http://localhost:3000/r
```

<div dir="rtl">

اجرای سرور MCP از سورس:

</div>

```bash
npm install --prefix mcp
npm run mcp        # stdio server via tsx
npm run mcp:smoke
```

<div dir="rtl">

سرور MCP رجیستری را از `VIBEFARSI_URL` می‌خواند (پیش‌فرض <code dir="ltr">https://vibefarsi.ir</code>)؛ برای رجیستری محلی آن را روی <code dir="ltr">http://localhost:3000</code> بگذارید. `VIBEFARSI_ROOT` هم برای وقتی است که فایل‌های رجیستری جای دیگری باشند.

روی npm هر دو پکیج هست: `npx vibefarsi` و <code dir="ltr">npx -y @vibefarsi/mcp</code>. دستورهای بالا برای وقتی است که روی سورس همین مخزن کار می‌کنید.

## لایسنس

MIT. پلن پولی نیست و هیچ قطعه‌ای قفل نیست؛ می‌خواهیم ساخت رابط فارسی خوب ساده باشد.

</div>

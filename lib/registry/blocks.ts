import type { BlockDoc } from "./types";

const bl = (slug: string) => `registry/blocks/${slug}.tsx`;

export const blocks: BlockDoc[] = [
  {
    slug: "hero", name: "هیرو", file: bl("hero"), tags: ["لندینگ", "شروع"], deps: ["lucide-react"], registryDeps: ["button", "badge", "avatar"],
    desc: "تیتر بزرگ وسط‌چین با دو دکمه و یک خط اثبات اجتماعی، روی شبکه‌ی محو.",
    usage: `import { HeroBlock } from "@/components/blocks/hero"

<HeroBlock
  badge="نسخه‌ی ۲ منتشر شد"
  title={<>فروشگاه‌تان را امروز باز کنید، <span className="text-brand">نه ماه بعد</span></>}
  description="درگاه بانکی، پست، فاکتور شمسی و هوش مصنوعی فارسی، همه از روز اول آماده."
  primary={{ label: "ساخت فروشگاه رایگان" }}
  proof={{ people: [{ name: "سارا" }, { name: "علی" }, { name: "نگار" }], text: "بیش از ۲ هزار فروشگاه" }}
/>`,
    props: [{ name: "title", type: "ReactNode", desc: "تیتر. می‌تونید یک کلمه را با text-brand برجسته کنید." }, { name: "proof", type: "{ people; text }", desc: "آواتارها و متن اثبات اجتماعی." }],
    promptBullets: ["Headline 48–60px with line-height 1.2, description at most ~65 characters per line, two rounded buttons.", "Grid background with a radial mask from the top; no large image needed."],
  },
  {
    slug: "features", name: "ویژگی‌ها", file: bl("features"), tags: ["لندینگ"], registryDeps: [],
    desc: "شبکه‌ی سه یا چهارتایی از ویژگی‌ها با کاشی آیکون و جداکننده‌ی یک‌پیکسلی.",
    usage: `import { FeaturesBlock } from "@/components/blocks/features"

<FeaturesBlock eyebrow="چرا دکان" title="همه‌چیز برای فروش آنلاین" features={[{ icon: Zap, title: "سریع", description: "…" }]} />`,
    props: [{ name: "columns", type: "3 | 4", default: "3", desc: "تعداد ستون در دسکتاپ." }],
    promptBullets: ["Divider trick: grid with gap-px and bg-border, each cell bg-card; no double borders.", "Icon in a 40px tile; description with line-height 1.8."],
  },
  {
    slug: "pricing", name: "ردیف قیمت", file: bl("pricing"), tags: ["قیمت", "تبدیل"], deps: ["lucide-react"], registryDeps: ["button", "badge", "price", "tabs"],
    desc: "سه پلن با قیمت تومانی، تب ماهانه/سالانه با دو ماه رایگان و پلن پیشنهادی برجسته.",
    usage: `import { PricingBlock } from "@/components/blocks/pricing"

<PricingBlock plans={[
  { name: "شروع", monthly: 0, description: "برای امتحان", features: ["۱۰ محصول"] },
  { name: "حرفه‌ای", monthly: 290_000, description: "برای رشد", features: ["نامحدود", "دامنه"], highlighted: true },
]} />`,
    promptBullets: ["Yearly price = monthly × 10 (two months free) and unit «تومان / سال».", "Highlighted plan with a stronger border and a «پیشنهادی» badge; its button is default, the others outline."],
  },
  {
    slug: "faq", name: "پرسش‌های متداول", file: bl("faq"), tags: ["لندینگ", "پشتیبانی"], registryDeps: ["accordion"],
    desc: "پرسش‌های متداول با معرفی در ستون راست و آکاردئون در ستون چپ، که اولین پرسش بازه.",
    usage: `import { FaqBlock } from "@/components/blocks/faq"

<FaqBlock items={[{ id: "1", title: "رایگان است؟", content: "بله…" }]} />`,
    promptBullets: ["Two columns 2/5 and 3/5 on desktop; stacked on mobile.", "Accordion with the chevron on the left and a grid-rows height animation."],
  },
  {
    slug: "stats", name: "آمار", file: bl("stats"), tags: ["اثبات"], registryDeps: [],
    desc: "نوار چهار عدد کلیدی با جداکننده‌ی نازک. اعداد را از قبل فارسی بدید.",
    usage: `import { StatsBlock } from "@/components/blocks/stats"

<StatsBlock items={[{ value: "۲٬۴۰۰+", label: "فروشگاه فعال" }, { value: "۹۹٫۹٪", label: "دسترس‌پذیری" }]} />`,
    promptBullets: ["Figures use tabular-nums and Persian digits; label under the number, optional small caption.", "Only real numbers you have; do not invent stats."],
  },
  {
    slug: "testimonials", name: "نظر مشتریان", file: bl("testimonials"), tags: ["اثبات"], registryDeps: ["avatar", "rating"],
    desc: "سه ستون کارت نقل‌قول با «گیومه»، ستاره و آواتار.",
    usage: `import { TestimonialsBlock } from "@/components/blocks/testimonials"

<TestimonialsBlock items={[{ name: "نگار کریمی", role: "مدیر فروشگاه", quote: "…", rating: 5 }]} />`,
    promptBullets: ["Quotes inside Persian guillemets «»; semantic figure/blockquote/figcaption.", "Stars are read-only and small, above the quote."],
  },
  {
    slug: "auth-card", name: "کارت ورود", file: bl("auth-card"), tags: ["فرم", "کد تأیید"], registryDeps: ["phone-input", "otp-field", "button"],
    desc: "کارت ورود با موبایل و کد تأیید که مستقله و روی هر پس‌زمینه‌ای می‌نشینه.",
    usage: `import { AuthCard } from "@/components/blocks/auth-card"

<div className="flex min-h-dvh items-center justify-center"><AuthCard onVerified={(phone) => login(phone)} /></div>`,
    promptBullets: ["«دریافت کد» stays disabled until the phone number is valid; 90-second resend countdown.", "Card max 384px, soft shadow, no image."],
  },
  {
    slug: "cta", name: "فراخوان پایانی", file: bl("cta"), tags: ["تبدیل"], deps: ["lucide-react"], registryDeps: ["button"],
    desc: "بنر گرم با یک دکمه که درخشش‌اش از توکن برند می‌آد.",
    usage: `import { CtaBlock } from "@/components/blocks/cta"

<CtaBlock title="همین امروز شروع کنید" description="بدون کارت بانکی، در کمتر از ده دقیقه." action="ساخت حساب رایگان" note="بدون تعهد، هر وقت خواستید لغو کنید" />`,
    promptBullets: ["radial-gradient of brand color at the top of the banner at ~20% opacity; one large rounded button.", "Short copy: headline, one sentence, one button, one trust note."],
  },
  {
    slug: "banner", name: "نوار اعلان", file: bl("banner"), tags: ["لندینگ", "اعلان"], deps: ["lucide-react"], registryDeps: [],
    desc: "نوار یک‌خطی بالای هدر برای خبر یا تخفیف، با یک لینک و دکمه‌ی بستن که یادش می‌مونه.",
    usage: `import { AnnouncementBanner } from "@/components/blocks/banner"

<AnnouncementBanner message="تا پایان مهر، پلن حرفه‌ای ۳۰٪ تخفیف داره." action={{ label: "دیدن پلن‌ها", href: "/pricing" }} storageKey="mehr-sale" />`,
    props: [{ name: "storageKey", type: "string", desc: "اگر بدید، بستن نوار در localStorage ذخیره میشه و دفعه‌ی بعد نشون داده نمیشه." }, { name: "tone", type: '"brand" | "neutral"', default: '"brand"', desc: "رنگ برند یا معکوس متن." }],
    promptBullets: ["One line, centered, brand background; the link has an arrow pointing left (forward in RTL).", "Dismiss button at the inline end; optional localStorage memory."],
  },
  {
    slug: "navbar", name: "نوار بالا", file: bl("navbar"), tags: ["لندینگ", "ناوبری"], deps: ["lucide-react"], registryDeps: ["button", "sheet"],
    desc: "هدر چسبان با لوگو در راست، لینک‌ها در وسط و دو دکمه در چپ، که در موبایل به یک کشو از سمت راست تبدیل میشه.",
    usage: `import { Navbar } from "@/components/blocks/navbar"

<Navbar
  logo="دکان"
  links={[{ label: "ویژگی‌ها", href: "#features" }, { label: "قیمت", href: "#pricing", active: true }, { label: "وبلاگ", href: "/blog" }]}
  primary={{ label: "شروع رایگان" }}
  secondary={{ label: "ورود" }}
/>`,
    props: [{ name: "links", type: "NavLink[]", desc: "لینک فعال با aria-current علامت می‌خوره." }, { name: "sticky", type: "boolean", default: "true", desc: "چسبیدن به بالای صفحه با پس‌زمینه‌ی مات." }],
    promptBullets: ["Sticky header with backdrop-blur; logo first in reading order (right), actions last (left).", "Below md the links move into a Sheet from the right; the trigger is an icon button labelled «باز کردن منو»."],
  },
  {
    slug: "logo-cloud", name: "لوگوی مشتریان", file: bl("logo-cloud"), tags: ["لندینگ", "اثبات"], registryDeps: [],
    desc: "یک ردیف آرام از اسم یا لوگوی مشتری‌ها زیر هیرو، کم‌رنگ و با هاور پررنگ.",
    usage: `import { LogoCloud } from "@/components/blocks/logo-cloud"

<LogoCloud logos={[{ name: "دیجی‌کالا" }, { name: "اسنپ" }, { name: "تپسی" }, { name: "کافه‌بازار" }]} />`,
    props: [{ name: "logos", type: "{ name; node? }[]", desc: "اگر node ندید، اسم با فونت سیاه رندر میشه." }],
    promptBullets: ["Muted wordmarks at 60% opacity that turn full on hover; wrap on mobile with generous gaps.", "No carousel; a static row reads calmer."],
  },
  {
    slug: "feature-split", name: "ویژگی دو ستونه", file: bl("feature-split"), tags: ["لندینگ"], deps: ["lucide-react"], registryDeps: [],
    desc: "ردیف‌های متن و عکس که جای‌شون یکی‌درمیان عوض میشه، با تیتر کوچک، توضیح و چند تیک.",
    usage: `import { FeatureSplit } from "@/components/blocks/feature-split"

<FeatureSplit items={[
  { eyebrow: "فاکتور", title: "فاکتور شمسی، بدون افزونه", description: "…", bullets: ["مالیات بر ارزش افزوده", "چاپ A5"] },
  { eyebrow: "ارسال", title: "پست و پیک با یک کلیک", description: "…" },
]} />`,
    props: [{ name: "media", type: "ReactNode", desc: "عکس یا ویدئوی هر ردیف؛ نباشه، جاگیر گرادیانی کشیده میشه." }],
    promptBullets: ["Two equal columns; odd rows swap order with CSS order, not by reordering the DOM.", "Media box is 4:3 with a hairline border; bullets use a brand check."],
  },
  {
    slug: "bento", name: "شبکه‌ی بنتو", file: bl("bento"), tags: ["لندینگ", "بنتو"], registryDeps: [],
    desc: "شبکه‌ی شش‌ستونی از کارت‌های نابرابر که هر کدام یک تصویر بالا و یک تیتر و یک خط پایین دارن.",
    usage: `import { BentoGrid } from "@/components/blocks/bento"

<BentoGrid title="همه‌چیز در یک پنل" cells={[
  { title: "گزارش فروش", description: "…", span: 4, visual: <Chart /> },
  { title: "درگاه بانکی", description: "…", span: 2 },
]} />`,
    props: [{ name: "span", type: "2 | 3 | 4", default: "2", desc: "تعداد ستون از شش ستون در دسکتاپ." }, { name: "visual", type: "ReactNode", desc: "هر چیز تصویری برای بالای کارت." }],
    promptBullets: ["Six-column grid; mix 4+2, 3+3 and 2+2+2 rows; every card has the same border and radius.", "Visual area is fixed-height and clips its content at the bottom edge."],
  },
  {
    slug: "steps", name: "مراحل کار", file: bl("steps"), tags: ["لندینگ"], registryDeps: [],
    desc: "سه قدم شماره‌دار با اعداد فارسی که در دسکتاپ با یک خط نقطه‌چین به هم وصل میشن.",
    usage: `import { StepsBlock } from "@/components/blocks/steps"

<StepsBlock eyebrow="چطور کار می‌کند" title="در سه قدم بفروشید" steps={[
  { title: "ثبت‌نام", description: "با شماره‌ی موبایل، بدون کارت بانکی." },
  { title: "محصول بگذارید", description: "عکس و قیمت، بقیه با ما." },
  { title: "بفروشید", description: "درگاه و پست از روز اول وصله." },
]} />`,
    props: [{ name: "icon", type: "Component", desc: "به‌جای شماره، آیکون نشون میده." }],
    promptBullets: ["Numbers are Persian digits inside a 48px circle with tabular-nums; a dashed line sits behind the circles on md+.", "Center-aligned text, at most ~40 words per step."],
  },
  {
    slug: "team", name: "تیم", file: bl("team"), tags: ["درباره‌ی ما"], registryDeps: ["avatar"],
    desc: "کارت اعضای تیم با آواتار، نقش، یک خط معرفی و لینک‌های کوتاه.",
    usage: `import { TeamBlock } from "@/components/blocks/team"

<TeamBlock members={[{ name: "سارا محمدی", role: "هم‌بنیان‌گذار", links: [{ label: "لینکدین", href: "#" }] }]} />`,
    promptBullets: ["Four-up on desktop, two-up on mobile; Avatar falls back to the initial when there is no photo.", "Role in muted small text; links as plain underlined words, not icons."],
  },
  {
    slug: "contact", name: "تماس با ما", file: bl("contact"), tags: ["فرم", "پشتیبانی"], deps: ["lucide-react"], registryDeps: ["input", "textarea", "button"],
    desc: "فرم نام، موبایل و پیام در راست و کارت آدرس با ساعت کاری و جای نقشه در چپ.",
    usage: `import { ContactBlock } from "@/components/blocks/contact"

<ContactBlock
  info={{ address: "تهران، خیابان ولیعصر، پلاک ۱۲۰", phone: "021-88000000", hours: "شنبه تا چهارشنبه، ۹ تا ۱۸" }}
  onSubmit={async (v) => { await fetch("/api/contact", { method: "POST", body: JSON.stringify(v) }) }}
/>`,
    props: [{ name: "map", type: "ReactNode", desc: "iframe نقشه یا عکس؛ نباشه، جاگیر شطرنجی کشیده میشه." }, { name: "onSubmit", type: "(values) => Promise", desc: "بعد از resolve، پیام «ثبت شد» نمایش داده میشه." }],
    promptBullets: ["3/5 form, 2/5 info card; phone field is ltr with a numeric keyboard; message textarea 5 rows.", "Address list uses dl with sr-only dt and icons; phone number rendered ltr with tabular-nums."],
  },
  {
    slug: "newsletter", name: "خبرنامه", file: bl("newsletter"), tags: ["تبدیل", "فرم"], registryDeps: ["input", "button"],
    desc: "یک فیلد و یک دکمه در یک کارت نرم، برای ایمیل یا شماره‌ی موبایل، با پیام موفقیت.",
    usage: `import { NewsletterBlock } from "@/components/blocks/newsletter"

<NewsletterBlock channel="sms" title="خبر انتشار را پیامک کنیم؟" onSubscribe={(phone) => subscribe(phone)} />`,
    props: [{ name: "channel", type: '"email" | "sms"', default: '"email"', desc: "نوع فیلد، کیبورد موبایل و placeholder را عوض می‌کنه." }],
    promptBullets: ["Field and button side by side on sm+, stacked on mobile; the field is ltr for both email and phone.", "A one-line opt-out reassurance under the form."],
  },
  {
    slug: "product-grid", name: "شبکه‌ی محصول", file: bl("product-grid"), tags: ["فروشگاه", "قیمت"], deps: ["lucide-react"], registryDeps: ["price", "rating", "badge", "button"],
    desc: "کارت‌های محصول چهارتایی با قیمت تومانی، درصد تخفیف، امتیاز و دکمه‌ی افزودن به سبد.",
    usage: `import { ProductGrid } from "@/components/blocks/product-grid"

<ProductGrid title="پرفروش‌ها" products={[
  { id: "1", name: "هدفون بی‌سیم", price: 2_450_000, original: 2_900_000, rating: 4.5, reviews: 128, badge: "پرفروش" },
]} onAdd={(p) => addToCart(p)} />`,
    props: [{ name: "original", type: "number", desc: "قیمت قبل از تخفیف؛ درصدش خودکار حساب میشه." }, { name: "outOfStock", type: "boolean", desc: "کارت را کم‌رنگ می‌کنه و دکمه را غیرفعال." }],
    promptBullets: ["Square image area with the badge at the inline-end corner; name clamps to two lines.", "Price at the bottom start, add-to-cart icon button at the bottom end; «ناموجود» overlay when out of stock."],
  },
  {
    slug: "blog-grid", name: "مقالات", file: bl("blog-grid"), tags: ["محتوا", "شمسی"], registryDeps: ["badge", "avatar", "jalali"],
    desc: "سه کارت مقاله با دسته، تاریخ شمسی، زمان مطالعه و نویسنده.",
    usage: `import { BlogGrid } from "@/components/blocks/blog-grid"

<BlogGrid posts={[{ href: "/blog/rtl", title: "راست‌چین کردن Next.js", excerpt: "…", category: "آموزش", date: new Date(), readingTime: 6, author: { name: "علی رضایی" } }]} />`,
    props: [{ name: "date", type: "Date", desc: "با formatJalali به «۲۵ شهریور ۱۴۰۵» تبدیل میشه." }, { name: "readingTime", type: "number", desc: "دقیقه؛ با اعداد فارسی نشون داده میشه." }],
    promptBullets: ["16:10 cover with a slow zoom on hover; category as a brand badge; excerpt clamps to two lines.", "Footer row: author avatar and name, then a time element with a Jalali date."],
  },
  {
    slug: "comparison", name: "جدول مقایسه", file: bl("comparison"), tags: ["قیمت", "جدول"], deps: ["lucide-react"], registryDeps: ["badge", "button"],
    desc: "امکانات در ستون راست و پلن‌ها در بالا، با تیک و خط تیره در خانه‌ها و پلن پیشنهادی هایلایت.",
    usage: `import { ComparisonTable } from "@/components/blocks/comparison"

<ComparisonTable
  plans={[{ name: "شروع", price: "رایگان" }, { name: "حرفه‌ای", price: "۲۹۰ هزار تومان / ماه", highlighted: true }]}
  rows={[{ feature: "تعداد محصول", values: ["۱۰", "نامحدود"] }, { feature: "دامنه‌ی اختصاصی", values: [false, true] }]}
/>`,
    props: [{ name: "values", type: "(boolean | string)[]", desc: "true تیک سبز، false خط تیره، رشته همون‌طور که هست." }],
    promptBullets: ["Real table with th scope=row/col; feature column is the first (right) column.", "Highlighted plan's whole column gets a secondary tint; footer row holds the buttons; horizontal scroll under 640px."],
  },
  {
    slug: "dashboard-stats", name: "کارت‌های آمار", file: bl("dashboard-stats"), tags: ["داشبورد", "آمار"], registryDeps: ["stat"],
    desc: "چهار کارت شاخص برای بالای داشبورد، با درصد تغییر و یک روند میله‌ای کوچک.",
    usage: `import { DashboardStats } from "@/components/blocks/dashboard-stats"

<DashboardStats items={[
  { label: "فروش امروز", value: "۱۲٬۴۵۰٬۰۰۰", unit: "تومان", delta: 12.5, trend: [4, 6, 5, 8, 7, 9, 11] },
  { label: "سفارش‌ها", value: "۸۴", delta: -3.2, trend: [9, 8, 8, 7, 9, 8, 7] },
]} />`,
    props: [{ name: "trend", type: "number[]", desc: "چند عدد برای میله‌های کوچک؛ آخرین میله رنگ برند می‌گیره." }],
    promptBullets: ["Four equal cards; Stat component for the number and delta; bars are aria-hidden and relative to the max.", "Numbers are pre-formatted Persian strings with «٬» thousands separator."],
  },
  {
    slug: "signup-card", name: "کارت ثبت‌نام", file: bl("signup-card"), tags: ["فرم", "ایمیل"], registryDeps: ["input", "password-input", "checkbox", "button"],
    desc: "ثبت‌نام با نام، ایمیل و رمز عبور با سنجش قدرت، تیک قوانین و لینک ورود.",
    usage: `import { SignupCard } from "@/components/blocks/signup-card"

<div className="flex min-h-dvh items-center justify-center"><SignupCard onSubmit={(v) => register(v)} /></div>`,
    props: [{ name: "onSubmit", type: "(values) => Promise", desc: "تا resolve بشه دکمه «در حال ساخت…» می‌مونه." }],
    promptBullets: ["Email and password fields are ltr; PasswordInput with the strength meter and minLength 8.", "Submit stays disabled until the terms checkbox is checked; sign-in link at the bottom."],
  },
  {
    slug: "footer", name: "پابرگ", file: bl("footer"), tags: ["لندینگ", "ناوبری"], registryDeps: ["jalali"],
    desc: "پابرگ با ستون برند در راست، چند ستون لینک و خط کپی‌رایت با سال شمسی.",
    usage: `import { FooterBlock } from "@/components/blocks/footer"

<FooterBlock
  logo="دکان"
  description="فروشگاه‌ساز فارسی برای کسب‌وکارهای کوچک."
  columns={[{ title: "محصول", links: [{ label: "قیمت", href: "/pricing" }] }, { title: "شرکت", links: [{ label: "درباره‌ی ما", href: "/about" }] }]}
  seals={<img src="/enamad.png" alt="نماد اعتماد الکترونیکی" width={64} height={64} />}
/>`,
    props: [{ name: "seals", type: "ReactNode", desc: "جای نماد اعتماد، ساماندهی یا آیکون شبکه‌های اجتماعی." }, { name: "copyright", type: "string", desc: "پیش‌فرض «© ۱۴۰۵ تمام حقوق محفوظ است.» با سال شمسی جاری." }],
    promptBullets: ["Five-column grid on lg: brand blurb spans two, then link columns; two columns on mobile.", "Bottom bar with a Jalali year from toJalali(new Date()); each column is a nav with aria-label."],
  },
];

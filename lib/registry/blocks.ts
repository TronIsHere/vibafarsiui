import type { BlockDoc } from "./types";

const bl = (slug: string) => `registry/blocks/${slug}.tsx`;

export const blocks: BlockDoc[] = [
  {
    slug: "hero", name: "هیرو", file: bl("hero"), tags: ["لندینگ", "شروع"], deps: ["lucide-react"], registryDeps: ["button", "badge", "avatar"],
    desc: "تیتر بزرگ وسط‌چین، دو دکمه و یک خط اثبات اجتماعی؛ روی شبکه‌ی محو.",
    usage: `import { HeroBlock } from "@/components/blocks/hero"

<HeroBlock
  badge="نسخه‌ی ۲ منتشر شد"
  title={<>فروشگاه‌تان را امروز باز کنید، <span className="text-brand">نه ماه بعد</span></>}
  description="درگاه بانکی، پست، فاکتور شمسی و هوش مصنوعی فارسی؛ همه آماده."
  primary={{ label: "ساخت فروشگاه رایگان" }}
  proof={{ people: [{ name: "سارا" }, { name: "علی" }, { name: "نگار" }], text: "بیش از ۲ هزار فروشگاه" }}
/>`,
    props: [{ name: "title", type: "ReactNode", desc: "تیتر؛ می‌توانید یک کلمه را با text-brand برجسته کنید." }, { name: "proof", type: "{ people; text }", desc: "آواتارها و متن اثبات اجتماعی." }],
    promptBullets: ["Headline 48–60px with line-height 1.2, description at most ~65 characters per line, two rounded buttons.", "Grid background with a radial mask from the top; no large image needed."],
  },
  {
    slug: "features", name: "ویژگی‌ها", file: bl("features"), tags: ["لندینگ"], registryDeps: [],
    desc: "شبکه‌ی سه یا چهارتایی با کاشی آیکون و جداکننده‌ی یک‌پیکسلی (gap-px روی پس‌زمینه‌ی border).",
    usage: `import { FeaturesBlock } from "@/components/blocks/features"

<FeaturesBlock eyebrow="چرا دکان" title="همه‌چیز برای فروش آنلاین" features={[{ icon: Zap, title: "سریع", description: "…" }]} />`,
    props: [{ name: "columns", type: "3 | 4", default: "3", desc: "تعداد ستون در دسکتاپ." }],
    promptBullets: ["Divider trick: grid with gap-px and bg-border, each cell bg-card; no double borders.", "Icon in a 40px tile; description with line-height 1.8."],
  },
  {
    slug: "pricing", name: "ردیف قیمت", file: bl("pricing"), tags: ["قیمت", "تبدیل"], deps: ["lucide-react"], registryDeps: ["button", "badge", "price", "tabs"],
    desc: "سه پلن با تومان، تب ماهانه/سالانه (دو ماه رایگان) و پلن پیشنهادی برجسته.",
    usage: `import { PricingBlock } from "@/components/blocks/pricing"

<PricingBlock plans={[
  { name: "شروع", monthly: 0, description: "برای امتحان", features: ["۱۰ محصول"] },
  { name: "حرفه‌ای", monthly: 290_000, description: "برای رشد", features: ["نامحدود", "دامنه"], highlighted: true },
]} />`,
    promptBullets: ["Yearly price = monthly × 10 (two months free) and unit «تومان / سال».", "Highlighted plan with a stronger border and a «پیشنهادی» badge; its button is default, the others outline."],
  },
  {
    slug: "faq", name: "پرسش‌های متداول", file: bl("faq"), tags: ["لندینگ", "پشتیبانی"], registryDeps: ["accordion"],
    desc: "معرفی در ستون راست، آکاردئون در ستون چپ؛ اولین پرسش باز.",
    usage: `import { FaqBlock } from "@/components/blocks/faq"

<FaqBlock items={[{ id: "1", title: "رایگان است؟", content: "بله…" }]} />`,
    promptBullets: ["Two columns 2/5 and 3/5 on desktop; stacked on mobile.", "Accordion with the chevron on the left and a grid-rows height animation."],
  },
  {
    slug: "stats", name: "آمار", file: bl("stats"), tags: ["اثبات"], registryDeps: [],
    desc: "نوار چهار عدد کلیدی با جداکننده‌ی نازک؛ اعداد را از قبل فارسی بدهید.",
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
    desc: "موبایل → کد تأیید در یک کارت مستقل؛ روی هر پس‌زمینه‌ای بگذارید.",
    usage: `import { AuthCard } from "@/components/blocks/auth-card"

<div className="flex min-h-dvh items-center justify-center"><AuthCard onVerified={(phone) => login(phone)} /></div>`,
    promptBullets: ["«دریافت کد» stays disabled until the phone number is valid; 90-second resend countdown.", "Card max 384px, soft shadow, no image."],
  },
  {
    slug: "cta", name: "فراخوان پایانی", file: bl("cta"), tags: ["تبدیل"], deps: ["lucide-react"], registryDeps: ["button"],
    desc: "بنر گرم با یک دکمه؛ درخشش از توکن برند می‌آید.",
    usage: `import { CtaBlock } from "@/components/blocks/cta"

<CtaBlock title="همین امروز شروع کنید" description="بدون کارت بانکی، در کمتر از ده دقیقه." action="ساخت حساب رایگان" note="بدون تعهد؛ هر وقت خواستید لغو کنید" />`,
    promptBullets: ["radial-gradient of brand color at the top of the banner at ~20% opacity; one large rounded button.", "Short copy: headline, one sentence, one button, one trust note."],
  },
];

"use client";

import { Shield, Sparkles, Zap } from "lucide-react";
import { HeroBlock } from "@/registry/blocks/hero";
import { FeaturesBlock } from "@/registry/blocks/features";
import { PricingBlock } from "@/registry/blocks/pricing";
import { FaqBlock } from "@/registry/blocks/faq";
import { StatsBlock } from "@/registry/blocks/stats";
import { TestimonialsBlock } from "@/registry/blocks/testimonials";
import { AuthCard } from "@/registry/blocks/auth-card";
import { CtaBlock } from "@/registry/blocks/cta";

/** Full-width block demos; the landing scales them down, the docs show them at size. */
export const blockDemos: Record<string, React.ReactNode> = {
  hero: (
    <HeroBlock
      badge="نسخه‌ی ۲ منتشر شد"
      title={<>فروشگاه‌تان را امروز باز کنید، <span className="text-brand">نه ماه بعد</span></>}
      description="درگاه بانکی، پست، فاکتور شمسی و هوش مصنوعی که به زبان مشتری‌های شما حرف می‌زند؛ همه آماده."
      primary={{ label: "ساخت فروشگاه رایگان" }}
      proof={{ people: [{ name: "سارا" }, { name: "علی" }, { name: "نگار" }, { name: "رضا" }], text: "فروشگاه‌های فعال روی دکان" }}
    />
  ),
  features: (
    <FeaturesBlock
      eyebrow="چرا دکان"
      title="همه‌چیز برای فروش آنلاین"
      features={[
        { icon: Zap, title: "سریع راه می‌افتد", description: "در کمتر از ده دقیقه فروشگاه‌تان بالا است؛ بدون کدنویسی." },
        { icon: Shield, title: "پرداخت امن", description: "درگاه‌های بانکی ایران با تأیید دومرحله‌ای و رسید پیامکی." },
        { icon: Sparkles, title: "هوش مصنوعی فارسی", description: "توضیح محصول و پاسخ به مشتری را خودش می‌نویسد." },
      ]}
    />
  ),
  pricing: (
    <PricingBlock
      plans={[
        { name: "شروع", monthly: 0, description: "برای امتحان کردن", features: ["۱۰ محصول", "دامنه‌ی رایگان", "پشتیبانی تلگرامی"] },
        { name: "حرفه‌ای", monthly: 290_000, description: "برای کسب‌وکار در حال رشد", features: ["محصول نامحدود", "دامنه‌ی اختصاصی", "گزارش فروش", "پشتیبانی تلفنی"], highlighted: true },
        { name: "سازمانی", monthly: 990_000, description: "برای تیم‌های بزرگ", features: ["چند فروشگاه", "API اختصاصی", "مدیر حساب"] },
      ]}
    />
  ),
  faq: (
    <FaqBlock
      items={[
        { id: "1", title: "برای شروع به کارت بانکی نیاز دارم؟", content: "نه. پلن شروع رایگان است و تا وقتی نخواهید ارتقا دهید، چیزی پرداخت نمی‌کنید." },
        { id: "2", title: "درگاه پرداخت چطور وصل می‌شود؟", content: "با وارد کردن ترمینال بانک‌تان در تنظیمات؛ حدود پنج دقیقه طول می‌کشد." },
        { id: "3", title: "می‌توانم دامنه‌ی خودم را وصل کنم؟", content: "بله، در پلن حرفه‌ای و بالاتر. راهنمای قدم‌به‌قدم داخل پنل هست." },
      ]}
    />
  ),
  stats: <StatsBlock items={[{ value: "۲٬۴۰۰+", label: "فروشگاه فعال" }, { value: "۹۹٫۹٪", label: "دسترس‌پذیری", hint: "۱۲ ماه گذشته" }, { value: "۴٫۸", label: "امتیاز کاربران", hint: "از ۵" }, { value: "۲۴/۷", label: "پشتیبانی" }]} />,
  testimonials: (
    <TestimonialsBlock
      items={[
        { name: "نگار کریمی", role: "مدیر فروشگاه لوازم خانگی", quote: "فاکتور شمسی و درگاه بانکی همان روز اول کار کرد. قبلش دو هفته با افزونه‌ها کلنجار می‌رفتم.", rating: 5 },
        { name: "علی رضایی", role: "توسعه‌دهنده‌ی فرانت‌اند", quote: "برای مشتری‌هایم استفاده می‌کنم؛ راست‌چین بودن را یک بار برای همیشه حل کرده.", rating: 5 },
        { name: "مینا صادقی", role: "طراح محصول", quote: "کامپوننت‌ها همان چیزی‌اند که در فیگما می‌کشم، بدون این‌که برای فارسی دست‌کاری کنم.", rating: 4 },
      ]}
    />
  ),
  "auth-card": <div className="flex justify-center px-6 py-12"><AuthCard /></div>,
  cta: <CtaBlock title="همین امروز شروع کنید" description="بدون کارت بانکی، در کمتر از ده دقیقه. هر وقت خواستید لغو کنید." action="ساخت حساب رایگان" note="بیش از ۲ هزار فروشگاه با دکان کار می‌کنند" />,
};

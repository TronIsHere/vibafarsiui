export type PageRecipe = {
  id: string;
  title: string;
  aliases: string[];
  summary: string;
  template?: string;
  theme?: string;
  components: string[];
  libs: string[];
  layout: string;
  copy: string[];
  avoid: string[];
};

export const RECIPES: PageRecipe[] = [
  {
    id: "checkout",
    title: "پرداخت و ثبت سفارش",
    aliases: ["checkout", "cart", "payment", "سبد", "پرداخت", "سفارش", "درگاه"],
    summary: "سبد → آدرس (پلاک و کد پستی) → پست/پیک → مبلغ تومان → رفتن به درگاه.",
    theme: "graphite",
    components: ["input", "select", "combobox", "radio-group", "number-field", "price", "button", "badge", "alert"],
    libs: ["utils"],
    layout: `Centered single column, max 36rem.
1. Cart summary: name, quantity (number-field if editable), unit price and line total via formatToman.
2. Address: province (combobox), city, street, plaque, unit, 10-digit postal code. Plaque and postal code dir=ltr.
3. Shipping: radio-group cards for پست / تیپاکس / پیک with estimated time.
4. Grand total + tax + amount due (price). Full-width «پرداخت و ثبت سفارش» button.`,
    copy: ["سبد خرید", "آدرس تحویل", "روش ارسال", "قابل پرداخت", "پرداخت و ثبت سفارش", "پلاک", "کد پستی"],
    avoid: ["Shopify-style ZIP", "USD", "left-aligned order summary", "FedEx/UPS as carriers"],
  },
  {
    id: "auth",
    title: "ورود با موبایل و کد تأیید",
    aliases: ["auth", "login", "signup", "otp", "ورود", "ثبت نام", "ثبت‌نام", "احراز"],
    summary: "ورود دو مرحله‌ای با موبایل +98 و کد پیامکی شش‌رقمی.",
    template: "auth",
    components: ["input", "otp-field", "button", "stepper"],
    libs: ["utils"],
    layout: `Centered card. Two-step stepper.
Step 1: number with +98 and dir=ltr, «ارسال کد» button.
Step 2: six-cell OtpField, resend countdown with Persian digits, «تغییر شماره» link.`,
    copy: ["ورود", "شماره‌ی موبایل", "ارسال کد تأیید", "کد پیامک‌شده را وارد کنید", "ارسال مجدد تا ۰:۴۵"],
    avoid: ["email-first login as the only path", "LTR OTP", "Latin countdown"],
  },
  {
    id: "dashboard",
    title: "داشبورد فروش",
    aliases: ["dashboard", "admin", "داشبورد", "پنل", "آمار فروش"],
    summary: "سایدبار راست، آمار تومان، هفته‌ی ش–ج، جدول سفارش.",
    template: "shop-dashboard",
    components: ["sidebar", "stat", "table", "badge", "avatar", "progress", "button", "input"],
    libs: ["utils", "jalali"],
    layout: `Right sidebar with groups. Main: 4 stat cards, weekly chart ش–ج, recent-orders table with تومان and status badges.`,
    copy: ["نمای کلی", "فروش امروز", "سفارش‌های باز", "هدف ماه", "پرداخت‌شده", "در انتظار"],
    avoid: ["Mon–Sun week", "dollar ticks", "left sidebar cloned from shadcn blocks"],
  },
  {
    id: "settings",
    title: "تنظیمات حساب",
    aliases: ["settings", "profile", "تنظیمات", "پروفایل", "امنیت"],
    summary: "پروفایل و اعلان‌ها با ناوبری راست و کلیدهای فارسی.",
    template: "settings",
    components: ["sidebar", "input", "switch", "button", "avatar", "radio-group"],
    libs: ["utils"],
    layout: `Settings nav on the right. Each section a card: profile, security, notifications. Switch rows with title and helper. Save at the bottom of the card.`,
    copy: ["حساب", "امنیت", "اعلان‌ها", "ذخیره تغییرات", "پیامک سفارش‌ها"],
    avoid: ["left settings rail", "English section ids as visible titles"],
  },
  {
    id: "invoice",
    title: "فاکتور و پیش‌فاکتور",
    aliases: ["invoice", "receipt", "فاکتور", "پیش فاکتور", "پیش‌فاکتور"],
    summary: "پیش‌فاکتور قابل چاپ با تاریخ شمسی و جمع تومان.",
    template: "invoice",
    components: ["table", "badge", "button"],
    libs: ["utils", "jalali"],
    layout: `Seller header plus invoice number and Jalali date. Line-item table. Total, tax, amount due. print: hide buttons.`,
    copy: ["پیش‌فاکتور", "شماره", "تاریخ", "جمع کل", "مالیات بر ارزش افزوده", "قابل پرداخت"],
    avoid: ["Gregorian-only dates", "Latin item indices like 1. flipping the table LTR"],
  },
  {
    id: "landing",
    title: "لندینگ محصول",
    aliases: ["landing", "marketing", "hero", "لندینگ", "صفحه فرود", "صفحهٔ فرود"],
    summary: "هیرو راست‌چین، پلن تومان، پرسش‌های متداول.",
    template: "startup-landing",
    components: ["button", "badge", "card", "accordion", "price", "block/hero", "block/features", "block/faq"],
    libs: ["utils"],
    layout: `RTL hero, two CTAs, customer bar, three features, three تومان plans, FAQ accordion.`,
    copy: ["شروع کنید", "مشاهده‌ی قیمت", "پرسش‌های متداول"],
    avoid: ["centered English SaaS hero with Inter", "per-month written as /mo"],
  },
  {
    id: "pricing",
    title: "قیمت‌گذاری",
    aliases: ["pricing", "plans", "قیمت", "پلن", "تعرفه"],
    summary: "سه پلن با تب ماهانه/سالانه و قیمت تومان.",
    template: "pricing",
    components: ["tabs", "price", "button", "badge"],
    libs: ["utils"],
    layout: `Monthly/yearly tabs, three cards, middle plan highlighted with a «محبوب» badge. Prices in تومان.`,
    copy: ["ماهانه", "سالانه", "محبوب", "شروع"],
    avoid: ["$29/mo", "strikethrough without Persian digits"],
  },
  {
    id: "blog",
    title: "مطلب وبلاگ",
    aliases: ["blog", "article", "post", "وبلاگ", "مقاله"],
    summary: "مطلب با تایپوگرافی خواندنی، فهرست مطالب و تاریخ شمسی.",
    template: "blog",
    components: ["avatar", "badge", "breadcrumb"],
    libs: ["utils", "jalali"],
    layout: `Narrow text column (~65 characters) with line-height 1.9. Sticky table of contents. Jalali date and Persian reading time.`,
    copy: ["زمان مطالعه", "فهرست مطالب", "نویسنده"],
    avoid: ["letter-spacing on headings", "max-w-prose with Latin metrics only"],
  },
  {
    id: "chat",
    title: "گفت‌وگوی هوش مصنوعی",
    aliases: ["chat", "ai", "چت", "گفتگو", "گفت‌وگو", "assistant"],
    summary: "حباب کاربر راست، فراخوانی ابزار، جعبه‌ی پرامپت فارسی.",
    template: "ai-chat",
    components: ["prompt-input", "avatar", "badge", "kbd"],
    libs: ["utils"],
    layout: `User bubble on the right (secondary). Model reply with an avatar. Tool card with a mono function name. prompt-input stuck to the bottom.`,
    copy: ["بنویسید…", "ارسال", "توقف"],
    avoid: ["user bubbles on the left", "Enter sending during IME composition"],
  },
  {
    id: "shop",
    title: "فروشگاه و سبد",
    aliases: ["shop", "store", "product", "فروشگاه", "محصول", "digikala"],
    summary: "صفحه‌ی محصول با تومان، موجودی و افزودن به سبد.",
    components: ["badge", "price", "button", "number-field", "select", "tabs", "rating", "table"],
    libs: ["utils"],
    layout: `Gallery on the right or top, title and تومان price, variant select, quantity, add to cart. Tabs for description / specs. Reviews with rating.`,
    copy: ["افزودن به سبد", "تومان", "موجود", "ناموجود", "مشخصات"],
    avoid: ["Shopify product template", "Add to cart in English"],
  },
  {
    id: "booking",
    title: "رزرو نوبت",
    aliases: ["booking", "appointment", "رزرو", "نوبت", "کلینیک", "سالن"],
    summary: "رزرو روی تقویم شمسی؛ هفته از شنبه.",
    components: ["calendar", "date-picker", "select", "button", "badge", "stepper", "input"],
    libs: ["utils", "jalali"],
    layout: `Pick a service → Jalali calendar with bookable days → free slots for that day → confirm with name and mobile.`,
    copy: ["انتخاب روز", "ساعت مراجعه", "تأیید نوبت", "شنبه"],
    avoid: ["fullcalendar default (Monday start)", "AM/PM without ۲۴h option"],
  },
  {
    id: "wallet",
    title: "کیف پول",
    aliases: ["wallet", "balance", "withdraw", "کیف پول", "برداشت", "شبا"],
    summary: "موجودی تومان، برداشت به شبا، جدول تراکنش شمسی.",
    components: ["stat", "price", "table", "button", "input", "badge", "alert"],
    libs: ["utils"],
    layout: `Balance via formatToman. Top-up / withdraw buttons. Withdraw to Sheba (LTR). Transaction table with Jalali dates and status.`,
    copy: ["موجودی", "افزایش موجودی", "برداشت", "شماره‌ی شبا", "تراکنش‌ها"],
    avoid: ["Stripe balance copy", "USD cents"],
  },
];

export function findRecipe(goal: string): PageRecipe | undefined {
  const q = goal.trim().toLowerCase().replace(/\u200c/g, "");
  return RECIPES.find((r) => r.id === q || r.title === goal.trim() || r.aliases.some((a) => q.includes(a.toLowerCase()) || a.toLowerCase().includes(q)));
}

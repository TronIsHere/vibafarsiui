import type { SkillDoc } from "./types";

const sk = (slug: string) => `registry/skills/${slug}/SKILL.md`;
const guide = (slug: string) => `registry/skills/${slug}.md`;

/**
 * Agent skills and guides curated for Persian projects. A skill is a SKILL.md
 * folder that Claude Code, Cursor and Codex load on their own when the task
 * matches its description; a guide is a plain markdown file you link from
 * CLAUDE.md / AGENTS.md. Both are served at /r/skills/{slug}.json.
 */
export const skills: SkillDoc[] = [
  {
    slug: "persian-conversational",
    name: "فارسی محاوره‌ای",
    nameEn: "Conversational Persian",
    format: "skill",
    icon: "chat",
    file: sk("persian-conversational"),
    tags: ["نوشتن", "محاوره", "شبکه‌های اجتماعی"],
    desc: "به مدل یاد میده فارسی خودمونی بنویسه، همان‌طور که توی چت و اینستاگرام می‌نویسیم: میشه، می‌خوام، رو، دیگه. با جدول تبدیل فعل‌ها، دو سطح نرم و خودمونی، و تله‌ی هکسره.",
    useWhen: [
      "کپشن اینستاگرام و پست تلگرام",
      "پیام‌های آنبوردینگ و اعلان‌های اپ مصرفی",
      "جواب پشتیبانی توی چت",
      "هر متنی که گفتید «خودمونی باشه»",
    ],
    example: {
      prompt: "یه پیام خوش‌آمد برای اولین ورود کاربر بنویس",
      without: "کاربر گرامی، به اپلیکیشن ما خوش آمدید. لطفاً جهت شروع، پروفایل خود را تکمیل نمایید.",
      with: "سلام! خوش اومدی. اول پروفایلت رو کامل کن، بعدش بریم سراغ سفارش اول.",
    },
  },
  {
    slug: "persian-formal",
    name: "فارسی رسمی و اداری",
    nameEn: "Formal Persian",
    format: "skill",
    icon: "letter",
    file: sk("persian-formal"),
    tags: ["نوشتن", "رسمی", "نامه‌ی اداری"],
    desc: "فارسی رسمی ولی آدمیزادی: است به‌جای می‌باشد، جمله‌های کوتاه و ادعای مشخص. قالب نامه‌ی اداری، ایمیل رسمی و متن فاکتور و قرارداد هم داخلشه.",
    useWhen: [
      "نامه به سازمان، اداره یا دانشگاه",
      "پروپوزال و قرارداد برای مشتری",
      "ایمیل رسمی و متن فاکتور",
      "متن سایت شرکتی و صفحه‌ی درباره‌ی ما",
    ],
    example: {
      prompt: "متن معرفی شرکت برای صفحه‌ی درباره‌ی ما",
      without: "شرکت ما در راستای ارائه‌ی خدمات نوین، با بهره‌گیری از تیمی مجرب، همواره در تلاش می‌باشد تا تجربه‌ای بی‌نظیر رقم بزند.",
      with: "از ۱۳۹۸ برای فروشگاه‌های آنلاین سایت می‌سازیم. تا امروز ۴۰ فروشگاه تحویل داده‌ایم و هر پروژه یک مدیر مشخص دارد که پاسخگوی شماست.",
    },
  },
  {
    slug: "persian-ui-copy",
    name: "متن رابط کاربری",
    nameEn: "Persian UI Copy",
    format: "skill",
    icon: "input",
    file: sk("persian-ui-copy"),
    tags: ["نوشتن", "فرم", "پیام خطا"],
    desc: "دکمه، لیبل، پیام خطا، حالت خالی و توست به فارسی درست. با واژه‌نامه‌ی رابط کاربری تا Login بشه «ورود» و Submit بشه «ثبت»، نه «ارسال نمایید».",
    useWhen: [
      "ساخت هر فرم یا صفحه‌ای که متن داره",
      "پیام خطا و اعتبارسنجی",
      "حالت خالی، لودینگ و توست",
      "ترجمه‌ی رابط انگلیسی به فارسی",
    ],
    example: {
      prompt: "پیام خطا برای شماره موبایل نامعتبر",
      without: "خطا! شماره تلفن وارد شده نامعتبر می‌باشد.",
      with: "شماره موبایل باید ۱۱ رقم باشد و با ۰۹ شروع شود.",
    },
  },
  {
    slug: "persian-rtl-ui",
    name: "رابط راست‌چین",
    nameEn: "Persian RTL UI",
    format: "skill",
    icon: "rtl",
    file: sk("persian-rtl-ui"),
    tags: ["React", "Tailwind", "راست‌چین"],
    desc: "همان قوانین طراحی وایب‌فارسی، به شکل یک مهارت: راست‌چین با کلاس‌های منطقی، فونت فارسی بدون letter-spacing، اعداد فارسی و تومان، فرم ایرانی و رنگ فقط از توکن. برای پروژه‌هایی که MCP ندارن.",
    useWhen: [
      "ساخت هر صفحه یا کامپوننت React با Tailwind",
      "تبدیل قالب چپ‌چین به راست‌چین",
      "وقتی مدل ml- و text-left می‌نویسه",
      "پروژه‌هایی که سرور MCP ندارن",
    ],
    example: {
      prompt: "یک کارت محصول با قیمت و دکمه‌ی خرید بساز",
      without: '<div className="flex ml-4 text-left"> … $12,000 … <ArrowRight />',
      with: '<div className="flex ms-4 text-start"> … ۱۲٬۰۰۰ تومان … <ArrowLeft />',
    },
  },
  {
    slug: "jalali-calendar",
    name: "تقویم شمسی",
    nameEn: "Jalali Calendar",
    format: "skill",
    icon: "calendar",
    file: sk("jalali-calendar"),
    tags: ["تاریخ", "شمسی", "Intl"],
    desc: "هفته از شنبه شروع میشه، سال با نوروز، و ساعت تهران +۳:۳۰ بدون تغییر تابستانی. این مهارت به مدل میگه تاریخ را چطور ذخیره کنه، چطور نشان بده و تعطیلی‌ها را از کجا بیاره.",
    useWhen: [
      "تقویم، انتخاب تاریخ و بازه‌ی زمانی",
      "گزارش و نمودار ماهانه",
      "نوبت‌دهی و مهلت پرداخت",
      "هر جا Date به کاربر نشان داده میشه",
    ],
    example: {
      prompt: "تاریخ ثبت سفارش را نشان بده",
      without: "Sep 20, 2026 (Sunday)",
      with: "یکشنبه ۲۹ شهریور ۱۴۰۵",
    },
  },
  {
    slug: "iran-validation",
    name: "اعتبارسنجی ایرانی",
    nameEn: "Iranian Validation",
    format: "skill",
    icon: "shield",
    file: sk("iran-validation"),
    tags: ["فرم", "کد ملی", "شبا", "کارت بانکی"],
    desc: "الگوریتم کد ملی، شبا با mod 97، شماره کارت با Luhn و BIN بانک، موبایل ۰۹ و پلاک خودرو، همه با پذیرش اعداد فارسی و عربی. تا مدل به‌جای الگوی آمریکایی، الگوی ایرانی بنویسه.",
    useWhen: [
      "فرم ثبت‌نام و احراز هویت",
      "فیلد شبا، کارت و کد ملی",
      "فرم آدرس و کد پستی",
      "هر ورودی که کاربر با کیبورد فارسی تایپ می‌کنه",
    ],
    example: {
      prompt: "کد ملی را اعتبارسنجی کن",
      without: "/^\\d{9}$/ و یک الگوی شبیه SSN آمریکا",
      with: "۱۰ رقم، همه یکسان نباشن، جمع وزنی ۱۰ تا ۲ به پیمانه‌ی ۱۱ با رقم کنترل",
    },
  },
  {
    slug: "persian-seo",
    name: "سئوی فارسی",
    nameEn: "Persian SEO",
    format: "skill",
    icon: "search",
    file: sk("persian-seo"),
    tags: ["سئو", "متادیتا", "Next.js"],
    desc: "lang و hreflang درست، عنوان و توضیح کوتاه فارسی، اسلاگ‌های باثبات، نیم‌فاصله در متن و نه در آدرس، و JSON-LD با inLanguage. مثال‌ها برای Next.js نوشته شدن ولی قوانین به هر سایتی می‌خوره.",
    useWhen: [
      "متادیتا و عنوان صفحه‌ها",
      "ساختار URL و اسلاگ",
      "JSON-LD و Open Graph",
      "تولید محتوای بلاگ فارسی برای جست‌وجو",
    ],
    example: {
      prompt: "متادیتای صفحه‌ی محصول را بنویس",
      without: '<html lang="en"> … og:locale: "en_US" … title: "Product | Site"',
      with: '<html lang="fa" dir="rtl"> … og:locale: "fa_IR" … عنوان فارسی با اسم محصول و قیمت به تومان',
    },
  },
  {
    slug: "agents-md-persian",
    name: "قوانین فارسی برای CLAUDE.md",
    nameEn: "Persian rules for AGENTS.md",
    format: "guide",
    icon: "book",
    file: guide("agents-md-persian"),
    tags: ["راهنما", "CLAUDE.md", "AGENTS.md", "Cursor"],
    desc: "یک بلوک آماده که داخل CLAUDE.md، AGENTS.md یا rules کرسر می‌گذارید تا هر پرامپت بعدی با فارسی، راست‌چین، اعداد فارسی و تقویم شمسی شروع بشه. خلاصه‌ی بقیه‌ی مهارت‌ها در یک صفحه.",
    useWhen: [
      "شروع پروژه‌ی جدید",
      "وقتی نمی‌خواید هفت تا مهارت جدا نصب کنید",
      "تیم‌هایی که با چند ابزار مختلف کار می‌کنن",
    ],
    example: {
      prompt: "یک دکمه‌ی خرید بساز",
      without: '<button className="ml-2">Buy now</button>',
      with: '<button className="ms-2">خرید</button>',
    },
  },
  {
    slug: "ui-craft-rules",
    name: "قوانین کرافت رابط",
    nameEn: "UI Craft Rules",
    format: "guide",
    icon: "ruler",
    file: guide("ui-craft-rules"),
    tags: ["راهنما", "وایب‌کدینگ", "دیزاین سیستم", "AGENTS.md"],
    desc: "چرا خروجی وایب‌کدینگ شبیه بقیه میشه و چطور جلوش را بگیرید: به‌جای «قشنگش کن» اسم تکنیک را بگید، به مدل اجازه‌ی مقدار دلخواه ندید، فاصله‌ی خط و اندازه‌ی فونت را محدود کنید، جای عکس را قبل از لود رزرو کنید و دکمه‌ها را ۴۴ پیکسل بزنید. همراه با یک بلوک آماده برای AGENTS.md و چک‌لیست پایان کار. init خودش این را داخل پروژه می‌نویسه.",
    useWhen: [
      "شروع هر پروژه‌ای که با مدل ساخته میشه",
      "وقتی خروجی مدل شبیه همه‌ی سایت‌های دیگه‌ست",
      "بازبینی صفحه قبل از تحویل",
      "وقتی مدل padding و رنگ از خودش اضافه می‌کنه",
    ],
    example: {
      prompt: "این کارت‌ها را قشنگ‌تر کن",
      without: "کارت‌ها با گرادیان تازه، سایه‌ی بزرگ، سه اندازه‌ی فونت جدید و p-[13px]",
      with: "کارت‌ها یکی‌یکی با ۴۰ میلی‌ثانیه فاصله ظاهر میشن، عکس‌ها aspect-ratio دارن، یک رنگ تأکید از توکن brand و فاصله‌ها روی شبکه‌ی ۴ پیکسلی",
    },
  },
  {
    slug: "persian-typography",
    name: "راهنمای تایپوگرافی فارسی",
    nameEn: "Persian Typography Guide",
    format: "guide",
    icon: "type",
    file: guide("persian-typography"),
    tags: ["راهنما", "فونت", "نیم‌فاصله"],
    desc: "کدام فونت رایگانه و کدام لایسنس می‌خواد، اندازه و فاصله‌ی خط برای فارسی، اعداد در جدول، متن ترکیبی فارسی و انگلیسی و نیم‌فاصله در HTML. هم برای مدل، هم برای خودتون.",
    useWhen: [
      "انتخاب و لود فونت در Next.js",
      "متن ترکیبی فارسی و لاتین",
      "جدول‌های عددی و قیمت",
      "وقتی حروف به هم نمی‌چسبن یا اعداد لاتین می‌مونن",
    ],
    example: {
      prompt: "تیتر صفحه‌ی اصلی را بزرگ و فشرده کن",
      without: 'className="text-5xl tracking-tight uppercase"',
      with: 'className="text-5xl leading-[1.2]" و فونت وزن ۷۰۰ بدون letter-spacing',
    },
  },
  {
    slug: "parspack-s3-upload",
    name: "آپلود تصویر به پارس‌پک",
    nameEn: "ParsPack S3 Upload",
    format: "guide",
    icon: "upload",
    file: guide("parspack-s3-upload"),
    tags: ["راهنما", "S3", "پارس‌پک", "آپلود"],
    desc: "آپلود سرورساید تصویر به فضای ابری پارس‌پک با AWS SDK، path-style URL، اعتبارسنجی MIME و مسیر API در Next.js App Router. آماده برای تحویل به مدل یا توسعه‌دهنده.",
    useWhen: [
      "آپلود تصویر پروفایل، محصول یا گالری",
      "اتصال به S3 سازگار با پارس‌پک",
      "وقتی URL عمومی اشتباه ساخته میشه",
      "تنظیم next/image برای هاست پارس‌پک",
    ],
    example: {
      prompt: "آپلود تصویر را به پارس‌پک وصل کن",
      without: "آپلود مستقیم از مرورگر به bucket با virtual-host URL",
      with: "POST /api/upload → PutObject با forcePathStyle و URL به شکل endpoint/bucket/key",
    },
  },
  {
    slug: "zarinpal-payment",
    name: "درگاه پرداخت زرین‌پال",
    nameEn: "Zarinpal Payment Gateway",
    format: "guide",
    icon: "wallet",
    file: guide("zarinpal-payment"),
    tags: ["راهنما", "پرداخت", "زرین‌پال", "تومان"],
    desc: "پیاده‌سازی کامل زرین‌پال از request تا verify: تبدیل تومان به ریال، سند پرداخت pending، کال‌بک idempotent و چک‌لیست امنیتی. برای Next.js و هر بک‌اند Node.",
    useWhen: [
      "خرید اشتراک، اعتبار یا محصول",
      "اتصال درگاه بانکی ایرانی",
      "کال‌بک و تأیید پرداخت",
      "تست در سندباکس زرین‌پال",
    ],
    example: {
      prompt: "پرداخت زرین‌پال را پیاده کن",
      without: "مبلغ را از کلاینت بگیر و بعد از Status=OK محصول را فعال کن",
      with: "مبلغ سرورساید، authority در DB، verify با code ۱۰۰/۱۰۱، بعد grant",
    },
  },
  {
    slug: "kavenegar-otp",
    name: "پیامک و OTP کاوه‌نگار",
    nameEn: "Kavenegar SMS / OTP",
    format: "guide",
    icon: "sms",
    file: guide("kavenegar-otp"),
    tags: ["راهنما", "پیامک", "OTP", "کاوه‌نگار"],
    desc: "ارسال OTP با Verify Lookup کاوه‌نگار: قالب تأییدشده، نرمال‌سازی شماره ۰۹، بررسی return.status و نمونه TypeScript آماده. کلید API فقط سمت سرور.",
    useWhen: [
      "ورود با کد یک‌بارمصرف",
      "تأیید شماره موبایل ایرانی",
      "ارسال پیامک قالبی کاوه‌نگار",
      "وقتی مدل API خارجی SMS می‌نویسه",
    ],
    example: {
      prompt: "OTP را با کاوه‌نگار بفرست",
      without: "SMS خام با متن آزاد و شماره به فرمت +98",
      with: "verify/lookup با template تأییدشده و receptor به شکل ۰۹xxxxxxxxx",
    },
  },
  {
    slug: "persian-writing",
    name: "نگارش فارسی",
    nameEn: "persian-writing",
    format: "external",
    icon: "pen",
    tags: ["نوشتن", "ویرایش", "Word و PDF", "سئو"],
    desc: "مهارت کامل نگارش فارسی از مخزن persian-writing: تشخیص لحن، حذف نشانه‌های متن ماشینی، املا و نیم‌فاصله، اسکریپت ویرایش و غلط‌گیری، و ساخت فایل Word و PDF راست‌چین. مهارت‌های نوشتاری همین صفحه از روی همین کار الهام گرفتن.",
    useWhen: [
      "مقاله، پایان‌نامه و گزارش",
      "ویرایش و غلط‌گیری متن موجود",
      "فایل Word و PDF فارسی",
      "سئو و کپی‌رایتینگ",
    ],
    repo: "https://github.com/ali2000hos/persian-writing",
    author: { name: "ali2000hos", url: "https://github.com/ali2000hos" },
    license: "MIT",
    install: [
      { label: "Claude Code", cmd: "git clone https://github.com/ali2000hos/persian-writing ~/.claude/skills/persian-writing" },
      { label: "پلاگین Claude Code", cmd: "/plugin marketplace add ali2000hos/persian-writing" },
    ],
  },
];

/** Skills whose file lives in this repo (served by /r and the CLI). */
export const hostedSkills = skills.filter((s): s is SkillDoc & { file: string } => Boolean(s.file));

/** Where the CLI writes a skill inside the user's project. */
export function skillTarget(item: Pick<SkillDoc, "slug" | "format">): string {
  if (item.format === "guide") return `docs/${item.slug}.md`;
  return `.claude/skills/${item.slug}/SKILL.md`;
}

export const SKILL_FORMAT_LABEL: Record<SkillDoc["format"], string> = {
  skill: "مهارت",
  guide: "راهنما",
  external: "مهارت خارجی",
};

import { absUrl } from "@/lib/site";

export const PRODUCT_FAQ: { id: string; q: string; a: string }[] = [
  {
    id: "free",
    q: "وایب‌فارسی رایگانه؟",
    a: "بله. پلن پولی نداریم و هیچ کامپوننتی قفل نیست. کد را کپی می‌کنید و مال خودتون میشه.",
  },
  {
    id: "npm",
    q: "این یک پکیج npm از کامپوننت‌هاست؟",
    a: "نه. npx vibefarsi فایل‌ها را داخل پروژه‌تون می‌نویسه و بعد از آن دیگه import از node_modules در کار نیست. پکیج npm فقط برای CLI و MCP هست.",
  },
  {
    id: "stack",
    q: "با Next.js و Vite کار می‌کنه؟",
    a: "بله، روی React با Tailwind v4. CLI در Next.js فایل layout و در Vite فایل html را راست‌چین و فارسی می‌کنه.",
  },
  {
    id: "shadcn",
    q: "با shadcn چه فرقی داره؟",
    a: "shadcn برای چیدمان چپ‌چین و متن لاتین ساخته شده. وایب‌فارسی از پایه راست‌چینه و اعداد فارسی، تومان، تقویم شمسی، شبا و کد ملی داخل خود کامپوننت‌هاش هست. یک dir=rtl روی صفحه این‌ها را درست نمی‌کنه.",
  },
  {
    id: "install",
    q: "چطور نصب کنم؟",
    a: "دو دستور: اول npx vibefarsi@latest init و بعد npx vibefarsi add button calendar. راهنمای کامل در صفحه‌ی شروع سریع هست.",
  },
  {
    id: "mcp",
    q: "سرور MCP به چه کاری می‌آد؟",
    a: "ابزارهای هوش مصنوعی به انگلیسی فکر می‌کنن و کامپوننت چپ‌چین می‌سازن. سرور MCP قوانین فارسی و کد رجیستری را به Cursor و Claude Code میده. آدرسش https://vibefarsi.ir/mcp هست.",
  },
];

export function faqJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "fa-IR",
    url: absUrl("/#faq"),
    mainEntity: PRODUCT_FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

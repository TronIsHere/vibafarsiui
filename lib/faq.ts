import { absUrl } from "@/lib/site";

export const PRODUCT_FAQ: { id: string; q: string; a: string }[] = [
  {
    id: "free",
    q: "وایب‌فارسی رایگان است؟",
    a: "بله. پلن پولی نداریم و هیچ کامپوننتی قفل نیست. کد را کپی می‌کنید و مال خودتان می‌شود.",
  },
  {
    id: "npm",
    q: "این یک پکیج npm از کامپوننت‌هاست؟",
    a: "نه. npx vibefarsi فایل‌ها را داخل پروژه‌تان می‌نویسد؛ بعد از آن import از node_modules در کار نیست. پکیج npm فقط برای CLI و MCP است.",
  },
  {
    id: "stack",
    q: "با Next.js و Vite کار می‌کند؟",
    a: "بله، روی React با Tailwind v4. CLI در Next.js فایل layout و در Vite فایل html را راست‌چین و فارسی می‌کند.",
  },
  {
    id: "shadcn",
    q: "با shadcn چه فرقی دارد؟",
    a: "shadcn برای چیدمان چپ‌چین و متن لاتین است. وایب‌فارسی از پایه راست‌چین است: اعداد فارسی، تومان، تقویم شمسی، شبا و کد ملی داخل خود کامپوننت‌هاست. یک dir=rtl روی صفحه این‌ها را درست نمی‌کند.",
  },
  {
    id: "install",
    q: "چطور نصب کنم؟",
    a: "دو دستور: npx vibefarsi init بعد npx vibefarsi add button calendar. راهنمای کامل در صفحه‌ی شروع سریع است.",
  },
  {
    id: "mcp",
    q: "سرور MCP برای چیست؟",
    a: "ابزارهای هوش مصنوعی به انگلیسی فکر می‌کنند و کامپوننت چپ‌چین می‌سازند. سرور MCP قوانین فارسی و کد رجیستری را به Cursor و Claude Code می‌دهد. آدرس آن https://vibefarsi.ir/mcp است.",
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

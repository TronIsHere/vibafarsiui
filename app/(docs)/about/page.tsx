import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/shared/json-ld";
import {
  GITHUB_URL,
  GITHUB_REPO,
  NPM_URL,
  SITE_NAME,
  SPONSOR_URL,
  absUrl,
  pageMetadata,
} from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "درباره‌ی وایب‌فارسی · کامپوننت راست‌چین React",
  description:
    "وایب‌فارسی مجموعه‌ی کامپوننت راست‌چین برای React و Next.js است. متن‌باز و رایگان؛ کد روی گیت‌هاب، پشتیبانی از همان‌جا.",
  path: "/about",
});

function aboutJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: `درباره‌ی ${SITE_NAME}`,
    url: absUrl("/about"),
    inLanguage: "fa-IR",
    mainEntity: { "@id": absUrl("/#organization") },
  };
}

export default function AboutPage() {
  return (
    <article className="max-w-2xl space-y-10">
      <JsonLd data={aboutJsonLd()} />
      <header>
        <p className="text-xs text-muted-foreground">درباره</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">وایب‌فارسی چیست؟</h1>
        <p className="mt-3 leading-8 text-muted-foreground">
          وایب‌فارسی مجموعه‌ی کامپوننت راست‌چین برای React و Next.js است. برای محصول فارسی
          ساخته شده: اعداد فارسی، تومان، تقویم شمسی، شبا و کد ملی داخل خود کامپوننت‌هاست، نه با
          یک dir روی کل صفحه.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">چطور کار می‌کند</h2>
        <p className="leading-8 text-muted-foreground">
          پکیج npm از خودِ دکمه و جدول نیست. CLI فایل را داخل پروژه‌تان می‌نویسد؛ از آن لحظه کد
          مال شماست و هر طور خواستید عوضش می‌کنید. پرامپت انگلیسی و سرور MCP هم همان قوانین را به
          Cursor و Claude Code می‌دهند تا خروجی چپ‌چین ساخته نشود.
        </p>
        <p className="leading-8 text-muted-foreground">
          رایگان و متن‌باز است. پلن پولی نداریم.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-bold">نگهداری و تماس</h2>
        <p className="leading-8 text-muted-foreground">
          کد و مسئله‌ها روی گیت‌هاب است:{" "}
          <a href={GITHUB_URL} className="text-foreground underline-offset-4 hover:underline" dir="ltr">
            {GITHUB_REPO}
          </a>
          . پکیج CLI روی npm با نام{" "}
          <a href={NPM_URL} className="text-foreground underline-offset-4 hover:underline" dir="ltr">
            vibefarsi
          </a>{" "}
          منتشر می‌شود. برای حمایت از ادامه کار از{" "}
          <a href={SPONSOR_URL} className="text-foreground underline-offset-4 hover:underline">
            همین پیوند
          </a>{" "}
          استفاده کنید.
        </p>
      </section>

      <p>
        <Link href="/docs" className="text-sm font-medium underline-offset-4 hover:underline">
          از شروع سریع نصب کنید
        </Link>
      </p>
    </article>
  );
}

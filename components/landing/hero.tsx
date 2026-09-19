import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { WordRotate } from "@/registry/animations/word-rotate";
import {
  animations,
  backgrounds,
  blocks,
  components,
  templates,
  themes,
} from "@/lib/registry";
import { Section } from "./frame";
import { HeroStage } from "./hero-stage";
import { HeroStats } from "./hero-stats";

const facts = [
  { v: components.length, l: "کامپوننت" },
  { v: blocks.length, l: "بلاک" },
  { v: animations.length, l: "انیمیشن" },
  { v: backgrounds.length, l: "پس‌زمینه" },
  { v: templates.length, l: "قالب" },
  { v: themes.length, l: "سیستم طراحی" },
];

export function Hero() {
  return (
    <Section className="overflow-hidden">
      <div className="px-5 py-14 sm:px-10 sm:py-16 lg:py-20">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11.5px] text-muted-foreground">
            <span className="size-1.5 animate-pulse-soft rounded-full bg-brand" />
            v0.1 · پیش‌نمایش عمومی · رایگان و متن‌باز
          </span>
        </div>

        <h1
          className="mt-6 max-w-3xl text-[2.5rem] font-bold leading-[1.18] sm:text-[3.2rem] sm:leading-[1.14] xl:text-[3.5rem] animate-fade-up"
          style={{ animationDelay: "60ms" }}
        >
          کامپوننت‌های <span className="text-brand">فارسی</span>،
          <br />
          برای{" "}
          <WordRotate
            words={["توسعه‌دهنده‌ها", "وایب‌کدرها", "طراح‌ها", "هوش مصنوعی"]}
            interval={2600}
            className="text-foreground"
          />
        </h1>

        <p
          className="mt-6 max-w-2xl text-base text-muted-foreground sm:text-[17px] animate-fade-up"
          style={{ animationDelay: "120ms" }}
        >
            همه‌ی کامپوننت‌ها از پایه راست‌چین هستن و فونت و اعداد فارسی هم داخل
            خودشون هست. می‌تونید فایل را کپی کنید و در پروژه بگذارید، یا پرامپت
            انگلیسی‌اش را به Cursor یا Claude بدید تا همان را در پروژه‌تون بسازه.
            قوانین فارسی داخل پرامپت هست، پس لازم نیست چیزی یادآوری کنید.
        </p>

        <div
          className="mt-8 flex flex-wrap items-center gap-2.5 animate-fade-up"
          style={{ animationDelay: "180ms" }}
        >
          <Link
            href="/components"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            کامپوننت‌ها را ببینید
            <ArrowLeft className="size-4" />
          </Link>
          <Link
            href="/docs"
            className="inline-flex h-11 items-center rounded-full border border-border bg-card px-6 text-sm font-semibold transition-colors hover:bg-accent"
          >
            در دو دقیقه شروع کنید
          </Link>
        </div>

        <div
          className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground animate-fade-up"
          style={{ animationDelay: "220ms" }}
        >
          {[
            "Next.js و Vite",
            "Tailwind v4",
            "بدون وابستگی اضافه",
            "کد + پرامپت + MCP",
          ].map((t) => (
            <span key={t} className="inline-flex items-center gap-1.5">
              <span className="size-1 rounded-full bg-foreground/40" />
              {t}
            </span>
          ))}
        </div>

        <div
          className="mt-10 animate-fade-up"
          style={{ animationDelay: "260ms" }}
        >
          <HeroStats items={facts} />
        </div>
      </div>

      <div className="border-t border-border">
        <HeroStage />
      </div>
    </Section>
  );
}

import Link from "next/link";
import { Button } from "@/registry/ui/button";
import { Logo } from "@/components/shared/logo";
import { GithubIcon } from "@/components/shared/icons";
import { Section } from "./frame";

export function MonoFooter() {
  return (
    <>
      <Section>
        <div className="flex flex-col items-start justify-between gap-6 px-5 py-12 sm:flex-row sm:items-center sm:px-8 sm:py-16">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">رایگان. برای فارسی‌زبان‌ها.</h2>
            <p className="mt-2 max-w-lg text-sm text-muted-foreground sm:text-[15px]">
              پلن پولی نیست و هیچ قطعه‌ای قفل نیست. می‌خواهیم ساخت رابط فارسی خوب ساده باشد.
            </p>
          </div>
          <div className="flex gap-2">
            <Button className="cursor-pointer rounded-full px-5">شروع کنید</Button>
            <Button variant="secondary" className="cursor-pointer rounded-full px-5">
              <GithubIcon />
              گیت‌هاب
            </Button>
          </div>
        </div>
      </Section>
      <footer className="border-b border-border">
        <div className="flex flex-col gap-4 px-5 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <Logo />
          <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="پاورقی">
            {[["مستندات", "/docs"], ["کامپوننت‌ها", "/components"], ["بلاک‌ها", "/blocks"], ["انیمیشن‌ها", "/animations"], ["پس‌زمینه‌ها", "/backgrounds"], ["قالب‌ها", "/templates"], ["سیستم‌های طراحی", "/themes"], ["MCP", "/docs#mcp"]].map(([l, h]) => (
              <Link key={l} href={h} className="cursor-pointer transition-colors hover:text-foreground">
                {l}
              </Link>
            ))}
          </nav>
          <span>© ۱۴۰۵ وایب‌فارسی</span>
        </div>
      </footer>
    </>
  );
}

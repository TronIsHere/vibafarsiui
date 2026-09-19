import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { fa } from "@/lib/utils";

export default function DocsNotFound() {
  return (
    <article className="max-w-xl">
      <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11.5px] text-muted-foreground">
        <span className="size-1.5 animate-pulse-soft rounded-full bg-brand" />
        خطای {fa(404)}
      </span>
      <h1 className="mt-6 text-3xl font-bold sm:text-4xl">این صفحه وجود ندارد</h1>
      <p className="mt-5 text-base text-muted-foreground sm:text-[17px]">
        شاید لینک قدیمی باشد یا آدرس اشتباه تایپ شده. از جست‌وجوی بالای صفحه یا
        فهرست کنار صفحه ادامه بدید.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-2.5">
        <Link
          href="/"
          className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          صفحه‌ی اصلی
          <ArrowLeft className="size-4" />
        </Link>
        <Link
          href="/components"
          className="inline-flex h-11 cursor-pointer items-center rounded-full border border-border bg-card px-6 text-sm font-semibold transition-colors hover:bg-accent"
        >
          کامپوننت‌ها را ببینید
        </Link>
      </div>
    </article>
  );
}

"use client";

import * as React from "react";
import { ArrowLeft, Clock } from "lucide-react";
import { Avatar } from "@/registry/ui/avatar";
import { Input } from "@/registry/ui/input";
import { Button } from "@/registry/ui/button";
import { Reveal } from "@/registry/animations/reveal";
import { cn, fa } from "@/lib/utils";
import { Photo, Shell } from "./shell";

type Cat = "مالیات" | "مدیریت مالی" | "آموزش" | "اخبار محصول";
const CATS: ("همه" | Cat)[] = ["همه", "مالیات", "مدیریت مالی", "آموزش", "اخبار محصول"];

const POSTS: { t: string; ex: string; cat: Cat; date: string; min: number; author: string; photo?: string }[] = [
  { t: "راهنمای کامل سامانه‌ی مودیان برای کسب‌وکارهای کوچک", ex: "از گرفتن کلید امضا تا ارسال اولین صورت‌حساب، قدم‌به‌قدم و با عکس.", cat: "مالیات", date: "۲۸ شهریور ۱۴۰۵", min: 12, author: "نسرین طاهری", photo: "blog-tax" },
  { t: "نسخه‌ی ۳ منتشر شد: تطبیق خودکار بانک", ex: "تراکنش‌ها هر شب وارد میشن و با فاکتورها جفت میشن.", cat: "اخبار محصول", date: "۲۰ شهریور ۱۴۰۵", min: 4, author: "تیم حسابینو" },
  { t: "جریان نقدی را چطور هر هفته بخونیم؟", ex: "سه عدد که هر صاحب کسب‌وکاری باید دوشنبه‌ها نگاه کنه.", cat: "مدیریت مالی", date: "۱۴ شهریور ۱۴۰۵", min: 7, author: "بهرام صادقی", photo: "blog-cash" },
  { t: "ارزش افزوده‌ی فصل تابستان: چک‌لیست ۱۰ دقیقه‌ای", ex: "قبل از ۱۵ مهر این موارد را بررسی کنید تا جریمه نشید.", cat: "مالیات", date: "۱۰ شهریور ۱۴۰۵", min: 6, author: "نسرین طاهری" },
  { t: "انبارگردانی پایان سال بدون تعطیل کردن فروشگاه", ex: "با شمارش چرخشی موجودی را همیشه دقیق نگه دارید.", cat: "آموزش", date: "۲ شهریور ۱۴۰۵", min: 9, author: "مهدی کریمی", photo: "blog-stock" },
  { t: "قیمت‌گذاری در تورم: کی و چقدر گرون کنیم؟", ex: "یک روش ساده بر اساس حاشیه‌ی سود و سرعت فروش هر کالا.", cat: "مدیریت مالی", date: "۲۵ مرداد ۱۴۰۵", min: 8, author: "بهرام صادقی" },
  { t: "ساخت فاکتور با لوگو و مهر در پنج دقیقه", ex: "قالب فاکتور را یک بار تنظیم کنید و همیشه استفاده کنید.", cat: "آموزش", date: "۱۸ مرداد ۱۴۰۵", min: 3, author: "مهدی کریمی" },
];

const cover = (i: number) =>
  [
    "radial-gradient(90% 90% at 80% 10%, color-mix(in oklch, var(--brand) 60%, transparent), transparent 60%), var(--secondary)",
    "linear-gradient(135deg, color-mix(in oklch, var(--brand) 40%, var(--card)), var(--card))",
    "repeating-linear-gradient(45deg, color-mix(in oklch, var(--foreground) 7%, transparent) 0 2px, transparent 2px 12px), var(--secondary)",
  ][i % 3];

/** وبلاگ با مطلب ویژه، فیلتر دسته و خبرنامه. */
export function BlogPage() {
  const [cat, setCat] = React.useState<(typeof CATS)[number]>("همه");
  const [joined, setJoined] = React.useState(false);
  const [featured, ...rest] = POSTS;
  const list = cat === "همه" ? rest : POSTS.filter((p) => p.cat === cat);

  return (
    <Shell active="/blog">
      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 sm:pt-20">
        <h1 className="text-4xl font-black">وبلاگ حسابینو</h1>
        <p className="mt-3 text-muted-foreground">مالیات، مدیریت مالی و آموزش، به زبان ساده.</p>

        {cat === "همه" && (
          <a href="#" className="group mt-10 grid overflow-hidden rounded-3xl border border-border bg-card lg:grid-cols-2">
            <div className="relative min-h-60 overflow-hidden" style={{ background: cover(0) }}>
              {featured.photo && <Photo name={featured.photo} alt="" eager className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]" />}
              <span className="absolute bottom-5 start-5 rounded-full bg-background/80 px-3 py-1 text-xs backdrop-blur">مطلب ویژه</span>
            </div>
            <div className="flex flex-col justify-center p-7 sm:p-10">
              <p className="text-xs font-semibold text-brand">{featured.cat}</p>
              <h2 className="mt-3 text-2xl font-black leading-snug transition-colors group-hover:text-brand sm:text-3xl">{featured.t}</h2>
              <p className="mt-3 leading-7 text-muted-foreground">{featured.ex}</p>
              <div className="mt-6 flex items-center gap-3 text-sm">
                <Avatar name={featured.author} size="sm" />
                <span>{featured.author}</span>
                <span className="text-muted-foreground">· {featured.date}</span>
              </div>
            </div>
          </a>
        )}

        <div role="group" aria-label="دسته‌ها" className="mt-12 flex gap-2 overflow-x-auto pb-1">
          {CATS.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={cat === c}
              onClick={() => setCat(c)}
              className={cn(
                "h-9 shrink-0 cursor-pointer rounded-full border px-4 text-sm transition-colors",
                cat === c ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <ul className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => (
            <li key={p.t}>
              <Reveal delay={(i % 3) * 60}>
                <a href="#" className="group block">
                  <div className="aspect-[16/10] overflow-hidden rounded-2xl border border-border" style={{ background: cover(i + 1) }}>
                    {p.photo && <Photo name={p.photo} alt="" className="transition-transform duration-700 group-hover:scale-[1.03]" />}
                  </div>
                  <p className="mt-4 text-xs font-semibold text-brand">{p.cat}</p>
                  <h3 className="mt-2 text-lg font-bold leading-snug transition-colors group-hover:text-brand">{p.t}</h3>
                  <p className="mt-2 text-sm leading-7 text-muted-foreground">{p.ex}</p>
                  <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    {p.date}
                    <span aria-hidden>·</span>
                    <Clock className="size-3" />
                    {fa(p.min)} دقیقه
                  </p>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="grid items-center gap-6 rounded-3xl border border-border bg-gradient-to-l from-brand/15 to-card p-7 sm:p-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-black">خبرنامه‌ی هفتگی</h2>
            <p className="mt-2 leading-7 text-muted-foreground">هر شنبه یک مطلب کاربردی و مهلت‌های مالیاتی همون هفته. بدون تبلیغ.</p>
          </div>
          {joined ? (
            <p role="status" className="text-sm font-semibold text-success">
              ثبت شد. شنبه‌ی بعد اولین ایمیل را می‌گیرید.
            </p>
          ) : (
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                setJoined(true);
              }}
            >
              <Input type="email" required dir="ltr" placeholder="you@company.ir" aria-label="ایمیل" className="h-11" />
              <Button type="submit" className="h-11 shrink-0">
                عضویت
                <ArrowLeft />
              </Button>
            </form>
          )}
        </div>
      </section>
    </Shell>
  );
}

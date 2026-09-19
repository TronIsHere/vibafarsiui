"use client";

import * as React from "react";
import { Award, CheckCircle2, Clock, Infinity as InfinityIcon, Lock, MessageCircle, Play, PlayCircle, Users } from "lucide-react";
import { Breadcrumb } from "@/registry/ui/breadcrumb";
import { Badge } from "@/registry/ui/badge";
import { Button } from "@/registry/ui/button";
import { Avatar } from "@/registry/ui/avatar";
import { Rating } from "@/registry/ui/rating";
import { Price } from "@/registry/ui/price";
import { Progress } from "@/registry/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/ui/tabs";
import { Accordion } from "@/registry/ui/accordion";
import { cn, fa, faNumber } from "@/lib/utils";

type Lesson = { title: string; min: number; done?: boolean; free?: boolean };
const chapters: { title: string; lessons: Lesson[] }[] = [
  { title: "شروع کار", lessons: [{ title: "معرفی دوره و پیش‌نیازها", min: 6, done: true, free: true }, { title: "نصب و ساخت اولین پروژه", min: 14, done: true, free: true }, { title: "ساختار پوشه‌ها در App Router", min: 18, done: true }] },
  { title: "مسیرها و صفحه‌ها", lessons: [{ title: "صفحه‌ی داینامیک و پارامترها", min: 22, done: true }, { title: "لایه‌بندی و ناوبری راست‌چین", min: 19, done: true }, { title: "بارگذاری، خطا و ۴۰۴ فارسی", min: 16, done: true }, { title: "متادیتا و سئوی فارسی", min: 21, done: true }] },
  { title: "داده و سرور", lessons: [{ title: "Server Components در عمل", min: 27 }, { title: "Server Actions و فرم ثبت‌نام پیامکی", min: 31 }, { title: "کش و بازاعتبارسنجی", min: 24 }] },
  { title: "استقرار", lessons: [{ title: "تاریخ شمسی و ارقام فارسی در تولید", min: 17 }, { title: "استقرار روی سرور ایرانی", min: 25 }] },
];
const reviews = [
  { name: "مریم احمدی", stars: 5, text: "بعد از سه دوره‌ی انگلیسی که نصفه ماندند، این یکی را تا آخر رفتم. مثال‌ها همان چیزهایی است که در پروژه‌ی واقعی لازم می‌شود." },
  { name: "علی رضایی", stars: 4, text: "فصل استقرار کوتاه است و کاش درباره‌ی دامنه‌ی ir بیشتر می‌گفت. باقی فصل‌ها دقیق و به‌روز." },
];
const all = chapters.flatMap((c) => c.lessons);
const doneCount = all.filter((l) => l.done).length;
const totalMin = all.reduce((s, l) => s + l.min, 0);

/** صفحه‌ی دوره: ویدئو، سرفصل‌ها با پیشرفت، نظرات و کارت خرید چسبان. */
export function CoursePage() {
  const [active, setActive] = React.useState("ساختار پوشه‌ها در App Router");
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <Breadcrumb items={[{ label: "خانه", href: "#" }, { label: "برنامه‌نویسی وب", href: "#" }, { label: "Next.js" }]} />
        <div className="mt-6 grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div>
              <div className="flex flex-wrap items-center gap-2"><Badge variant="brand" className="rounded-full border border-brand/30 px-2 text-[11px]">پرفروش</Badge><Badge variant="secondary" className="text-[11px]">به‌روزشده در شهریور ۱۴۰۵</Badge></div>
              <h1 className="mt-3 text-2xl font-bold leading-snug sm:text-3xl">آموزش جامع Next.js به زبان فارسی؛ از صفر تا استقرار</h1>
              <p className="mt-3 text-muted-foreground">با تمرکز روی چیزهایی که در پروژه‌ی ایرانی لازم می‌شود: راست‌چین، تاریخ شمسی، پیامک و سرور داخلی.</p>
              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
                <span className="flex items-center gap-2"><Avatar name="امیر کریمی" size="sm" /><span>امیر کریمی</span></span>
                <span className="flex items-center gap-1.5"><Rating value={5} readOnly size="sm" /><span className="text-muted-foreground">{fa(4.8).replace(".", "٫")} ({faNumber(340)} نظر)</span></span>
                <span className="flex items-center gap-1 text-muted-foreground"><Users className="size-4" />{faNumber(2_180)} دانشجو</span>
              </div>
            </div>

            <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-card" style={{ backgroundImage: "radial-gradient(60% 80% at 50% 100%, oklch(from var(--brand) l c h / 18%), transparent 70%)" }}>
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <button type="button" aria-label="پخش" className="flex size-16 cursor-pointer items-center justify-center rounded-full bg-foreground text-background shadow-xl transition-transform hover:scale-105"><Play className="ms-1 size-6 fill-current" /></button>
                <p className="text-sm font-medium">{active}</p>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4"><div className="flex items-center gap-3 text-xs"><span className="tabular-nums">۰۴:۱۲</span><div className="h-1 flex-1 overflow-hidden rounded-full bg-foreground/20"><div className="h-full w-[23%] rounded-full bg-brand" /></div><span className="tabular-nums text-muted-foreground">۱۸:۰۰</span></div></div>
            </div>

            <Tabs defaultValue="syllabus" variant="underline">
              <TabsList aria-label="بخش‌های دوره"><TabsTrigger value="syllabus">سرفصل‌ها</TabsTrigger><TabsTrigger value="about">توضیحات</TabsTrigger><TabsTrigger value="reviews">نظرات</TabsTrigger></TabsList>
              <TabsContent value="syllabus">
                <div className="mb-4 mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground"><span>{fa(chapters.length)} فصل</span><span>{fa(all.length)} درس</span><span>{fa(Math.round(totalMin / 60))} ساعت و {fa(totalMin % 60)} دقیقه</span></div>
                <Accordion defaultOpen={["0"]} items={chapters.map((c, i) => ({
                  id: String(i),
                  title: <span className="flex w-full items-center justify-between gap-2 pe-2"><span>{c.title}</span><span className="text-xs text-muted-foreground">{fa(c.lessons.filter((l) => l.done).length)}/{fa(c.lessons.length)}</span></span>,
                  content: (
                    <ul className="divide-y divide-border">
                      {c.lessons.map((l) => {
                        const locked = !l.done && !l.free && doneCount < all.indexOf(l);
                        return (
                          <li key={l.title}>
                            <button type="button" disabled={locked} onClick={() => setActive(l.title)} className={cn("flex w-full cursor-pointer items-center gap-3 px-1 py-2.5 text-start text-sm transition-colors hover:bg-accent/50 disabled:cursor-not-allowed disabled:opacity-60", active === l.title && "font-semibold")}>
                              {l.done ? <CheckCircle2 className="size-4 shrink-0 text-success" /> : locked ? <Lock className="size-4 shrink-0 text-muted-foreground" /> : <PlayCircle className="size-4 shrink-0 text-muted-foreground" />}
                              <span className="flex-1">{l.title}</span>
                              {l.free && !l.done && <Badge variant="brand" className="text-[11px]">رایگان</Badge>}
                              <span className="flex items-center gap-1 text-xs text-muted-foreground tabular-nums"><Clock className="size-3" />{fa(l.min)} دقیقه</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  ),
                }))} />
              </TabsContent>
              <TabsContent value="about">
                <div className="prose-sm mt-4 max-w-none space-y-3 text-sm leading-7 text-foreground/90">
                  <p>این دوره برای کسی است که React را می‌داند و می‌خواهد با Next.js یک محصول واقعی بسازد و منتشر کند. هر فصل با یک پروژه‌ی کوچک تمام می‌شود و در فصل آخر همان پروژه روی سرور ایرانی مستقر می‌شود.</p>
                  <p>چیزهایی که جای دیگر پیدا نمی‌کنید: راست‌چین کردن درست با logical properties، تقویم شمسی بدون کتابخانه، ارسال پیامک کد تأیید و مشکلات فونت فارسی در تولید.</p>
                  <p className="font-medium text-foreground">پیش‌نیاز: آشنایی با React و TypeScript در حد ساخت یک فرم ساده.</p>
                </div>
              </TabsContent>
              <TabsContent value="reviews">
                <ul className="mt-4 space-y-4">
                  {reviews.map((r) => (
                    <li key={r.name} className="rounded-xl border border-border bg-card p-4">
                      <div className="flex items-center gap-3"><Avatar name={r.name} size="sm" /><div><p className="text-sm font-semibold">{r.name}</p><Rating value={r.stars} readOnly size="sm" /></div></div>
                      <p className="mt-3 text-sm leading-7 text-foreground/90">{r.text}</p>
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="mt-4"><MessageCircle />نوشتن نظر</Button>
              </TabsContent>
            </Tabs>
          </div>

          <aside>
            <div className="sticky top-6 space-y-4">
              <div className="rounded-2xl border border-border bg-card p-5">
                <Price amount={1_490_000} original={2_400_000} size="lg" />
                <p className="mt-1 text-xs text-muted-foreground">تا پایان هفته با این قیمت</p>
                <Button className="mt-4 w-full" size="lg">ثبت‌نام در دوره</Button>
                <Button variant="ghost" className="mt-2 w-full">پیش‌نمایش رایگان</Button>
                <ul className="mt-5 space-y-2.5 text-sm">
                  {[[InfinityIcon, "دسترسی همیشگی و به‌روزرسانی رایگان"], [Award, "گواهی پایان دوره"], [MessageCircle, "پاسخ به پرسش‌ها تا ۴۸ ساعت"], [Users, "گروه تلگرامی دانشجوها"]].map(([I, t]) => { const Icon = I as React.ComponentType<{ className?: string }>; return <li key={String(t)} className="flex items-center gap-2 text-foreground/90"><Icon className="size-4 text-brand" />{String(t)}</li>; })}
                </ul>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <Progress value={doneCount} max={all.length} label="پیشرفت شما" showValue />
                <p className="mt-2 text-xs text-muted-foreground">{fa(doneCount)} از {fa(all.length)} درس را دیده‌اید. درس بعدی: «Server Components در عمل».</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

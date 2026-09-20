"use client";

import * as React from "react";
import { Briefcase, Building2, MapPin, Clock3 } from "lucide-react";
import { Badge } from "@/registry/ui/badge";
import { Button } from "@/registry/ui/button";
import { Combobox } from "@/registry/ui/combobox";
import { Field, Input } from "@/registry/ui/input";
import { NationalIdInput } from "@/registry/ui/national-id-input";
import { PhoneInput } from "@/registry/ui/phone-input";
import { SearchInput } from "@/registry/ui/search-input";
import { SegmentedControl } from "@/registry/ui/segmented-control";
import { Sheet } from "@/registry/ui/sheet";
import { TagsInput } from "@/registry/ui/tags-input";
import { Textarea } from "@/registry/ui/textarea";
import { cn, fa, formatToman } from "@/lib/utils";
import { formatJalali } from "@/lib/jalali";

type Job = {
  id: string;
  title: string;
  company: string;
  city: string;
  type: "full" | "part" | "remote";
  salaryMin: number;
  salaryMax: number;
  tags: string[];
  posted: Date;
  desc: string;
};

const cities = ["همه شهرها", "تهران", "اصفهان", "شیراز", "مشهد", "دورکاری"];
const jobs: Job[] = [
  {
    id: "1",
    title: "توسعه‌دهنده فرانت‌اند React",
    company: "دکان",
    city: "تهران",
    type: "full",
    salaryMin: 45_000_000,
    salaryMax: 70_000_000,
    tags: ["React", "TypeScript", "RTL"],
    posted: new Date(Date.now() - 2 * 864e5),
    desc: "ساخت رابط‌های فارسی برای فروشگاه‌های آنلاین. تجربه با Next.js و طراحی راست‌چین لازم است.",
  },
  {
    id: "2",
    title: "کارشناس پشتیبانی مشتریان",
    company: "پیامک‌یار",
    city: "دورکاری",
    type: "remote",
    salaryMin: 22_000_000,
    salaryMax: 30_000_000,
    tags: ["پشتیبانی", "CRM"],
    posted: new Date(Date.now() - 864e5),
    desc: "پاسخ به تیکت‌ها و تماس‌های مشتریان در شیفت‌های مشخص. لحن محترمانه و سرعت عمل مهم است.",
  },
  {
    id: "3",
    title: "طراح محصول",
    company: "نوین بانک",
    city: "تهران",
    type: "full",
    salaryMin: 55_000_000,
    salaryMax: 85_000_000,
    tags: ["Figma", "پژوهش"],
    posted: new Date(Date.now() - 5 * 864e5),
    desc: "طراحی جریان‌های کیف پول و پرداخت. آشنایی با الگوهای بانکی ایران امتیاز محسوب می‌شود.",
  },
  {
    id: "4",
    title: "انباردار پاره‌وقت",
    company: "ارسال‌چی",
    city: "اصفهان",
    type: "part",
    salaryMin: 12_000_000,
    salaryMax: 16_000_000,
    tags: ["انبار", "لجستیک"],
    posted: new Date(),
    desc: "چیدمان و آماده‌سازی سفارش‌ها در شیفت عصر. محل کار در شهرک صنعتی جی.",
  },
];

const typeLabel = { full: "تمام‌وقت", part: "پاره‌وقت", remote: "دورکاری" } as const;

/** فرصت شغلی: فهرست آگهی با فیلتر شهر و نوع همکاری، جزئیات و فرم درخواست با کد ملی. */
export function JobsPage() {
  const [city, setCity] = React.useState("همه شهرها");
  const [kind, setKind] = React.useState("all");
  const [q, setQ] = React.useState("");
  const [selected, setSelected] = React.useState<Job | null>(jobs[0]);
  const [applyOpen, setApplyOpen] = React.useState(false);
  const [nidOk, setNidOk] = React.useState(false);
  const [skills, setSkills] = React.useState<string[]>(["React"]);

  const list = jobs.filter((j) => {
    if (city !== "همه شهرها" && j.city !== city) return false;
    if (kind !== "all" && j.type !== kind) return false;
    if (q && !`${j.title}${j.company}${j.tags.join("")}`.includes(q)) return false;
    return true;
  });

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-5">
          <div className="me-auto">
            <p className="text-lg font-bold">کارجو</p>
            <p className="text-xs text-muted-foreground">{fa(jobs.length)} فرصت فعال این هفته</p>
          </div>
          <SearchInput value={q} onChange={setQ} placeholder="عنوان، شرکت یا مهارت…" className="w-full sm:w-64" />
          <Button size="sm" variant="outline">ثبت آگهی رایگان</Button>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-5">
        <aside className="space-y-4 lg:col-span-1">
          <Field label="شهر">
            <Combobox options={cities} value={city} onChange={setCity} className="w-full" />
          </Field>
          <div>
            <p className="mb-2 text-sm font-medium">نوع همکاری</p>
            <SegmentedControl
              fullWidth
              size="sm"
              aria-label="نوع همکاری"
              value={kind}
              onChange={setKind}
              options={[
                { value: "all", label: "همه" },
                { value: "full", label: "تمام" },
                { value: "part", label: "پاره" },
                { value: "remote", label: "دور" },
              ]}
            />
          </div>
        </aside>

        <ul className="space-y-3 lg:col-span-2">
          {list.map((j) => (
            <li key={j.id}>
              <button
                type="button"
                onClick={() => setSelected(j)}
                className={cn(
                  "w-full cursor-pointer rounded-2xl border border-border bg-card p-4 text-start transition-colors hover:bg-accent/40",
                  selected?.id === j.id && "border-primary/40 bg-accent/50",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="font-semibold leading-6">{j.title}</h2>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Building2 className="size-3.5" />{j.company}</span>
                      <span className="inline-flex items-center gap-1"><MapPin className="size-3.5" />{j.city}</span>
                      <span className="inline-flex items-center gap-1"><Briefcase className="size-3.5" />{typeLabel[j.type]}</span>
                    </p>
                  </div>
                  <Badge variant="secondary">{formatJalali(j.posted, { year: false })}</Badge>
                </div>
                <p className="mt-3 text-sm font-medium tabular-nums">
                  {formatToman(j.salaryMin)} تا {formatToman(j.salaryMax)}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {j.tags.map((t) => <Badge key={t} variant="outline">{t}</Badge>)}
                </div>
              </button>
            </li>
          ))}
          {list.length === 0 && (
            <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              فرصتی با این فیلترها نیست.
            </p>
          )}
        </ul>

        {selected && (
          <section className="h-fit rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-6 lg:col-span-2">
            <Badge variant="brand">{typeLabel[selected.type]}</Badge>
            <h1 className="mt-2 text-xl font-bold leading-7">{selected.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{selected.company} · {selected.city}</p>
            <p className="mt-4 text-sm font-semibold tabular-nums">
              {formatToman(selected.salaryMin)} – {formatToman(selected.salaryMax)}
              <span className="ms-1 text-xs font-normal text-muted-foreground">ناخالص ماهانه</span>
            </p>
            <p className="mt-4 text-sm leading-7 text-foreground">{selected.desc}</p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Clock3 className="size-4" />منتشر شده در {formatJalali(selected.posted, { weekday: true })}</li>
              <li className="flex items-center gap-2"><MapPin className="size-4" />محل کار: {selected.city}</li>
            </ul>
            <Button className="mt-6 w-full" onClick={() => setApplyOpen(true)}>ارسال درخواست</Button>
          </section>
        )}
      </div>

      <Sheet open={applyOpen} onOpenChange={setApplyOpen} title="ارسال درخواست">
        <div className="space-y-4">
          {selected && <p className="text-xs text-muted-foreground">{selected.title} در {selected.company}</p>}
          <Field label="نام و نام خانوادگی" htmlFor="jn"><Input id="jn" placeholder="مثلاً: سارا محمدی" /></Field>
          <div className="space-y-1.5"><span className="text-sm font-medium">کد ملی</span><NationalIdInput onChange={(_, ok) => setNidOk(ok)} /></div>
          <div className="space-y-1.5"><span className="text-sm font-medium">شماره‌ی موبایل</span><PhoneInput /></div>
          <Field label="مهارت‌ها"><TagsInput value={skills} onChange={setSkills} placeholder="مهارت را بنویسید و Enter بزنید" /></Field>
          <Field label="درباره‌ی خودتان" htmlFor="jc"><Textarea id="jc" rows={4} maxLength={500} showCount placeholder="چرا برای این نقش مناسبید؟" /></Field>
          <div className="flex gap-2 pt-2">
            <Button disabled={!nidOk} onClick={() => setApplyOpen(false)}>ثبت درخواست</Button>
            <Button variant="ghost" onClick={() => setApplyOpen(false)}>انصراف</Button>
          </div>
        </div>
      </Sheet>
    </div>
  );
}

"use client";

import { ArrowUpLeft } from "lucide-react";
import { Avatar } from "@/registry/ui/avatar";
import { Counter } from "@/registry/animations/counter";
import { Reveal } from "@/registry/animations/reveal";
import { fa } from "@/lib/utils";
import { Art, Photo, Shell, useHref } from "./shell";

const TEAM = [
  { name: "نیما رستگار", role: "هم‌بنیان‌گذار و مدیر خلاقیت" },
  { name: "مهسا کاظمی", role: "هم‌بنیان‌گذار و مدیر فنی" },
  { name: "آرش فرهادی", role: "سرپرست طراحی محصول" },
  { name: "لیلا نوروزی", role: "طراح برند" },
  { name: "پویا شریفی", role: "برنامه‌نویس ارشد فرانت‌اند" },
  { name: "سحر امینی", role: "پژوهشگر تجربه‌ی کاربری" },
  { name: "کیان مرادی", role: "برنامه‌نویس موبایل" },
  { name: "ترانه صدری", role: "مدیر پروژه" },
];

const VALUES = [
  { t: "اول گوش می‌دیم", b: "هیچ طرحی قبل از حرف زدن با کاربر واقعی شروع نمیشه." },
  { t: "فارسی را جدی می‌گیریم", b: "راست‌چین، نیم‌فاصله و تاریخ شمسی برای ما جزئیات نیستن، پایه‌ان." },
  { t: "کم ولی کامل", b: "هر سال فقط دوازده پروژه قبول می‌کنیم تا هر کدوم تیم کامل داشته باشه." },
];

const ROLES = [
  { t: "طراح محصول ارشد", type: "تمام‌وقت · تهران" },
  { t: "برنامه‌نویس React Native", type: "تمام‌وقت · دورکاری" },
  { t: "کارآموز طراحی برند", type: "پاره‌وقت · تهران" },
];

/** درباره‌ی استودیو، تیم و فرصت‌های شغلی. */
export function AboutPage() {
  const href = useHref();
  return (
    <Shell active="/about">
      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 sm:pt-24">
        <p className="text-sm text-muted-foreground">درباره‌ی ما</p>
        <h1 className="mt-3 max-w-4xl text-4xl font-black leading-[1.3] sm:text-6xl">
          چهارده ساله که محصول‌هایی می‌سازیم که <span className="text-brand">فارسی فکر می‌کنن</span>، نه فقط فارسی نوشته شدن.
        </h1>
      </section>

      <section className="mx-auto mt-14 max-w-6xl px-4 sm:px-6">
        <div className="aspect-[16/9] overflow-hidden rounded-3xl border border-border sm:aspect-[21/9]">
          <Photo name="studio" alt="دفتر استودیو نقش در یک خانه‌ی قدیمی تهران" eager />
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2">
        <p className="text-xl leading-10 text-foreground/85">
          نقش در ۱۳۹۱ با دو نفر و یک میز در یک زیرزمین شروع شد. امروز ۳۸ نفریم و هنوز همون قاعده‌ی روز اول را داریم: هر چیزی که می‌سازیم باید برای کاربر ایرانی طبیعی باشه، از جهت متن تا شکل تاریخ.
        </p>
        <dl className="grid grid-cols-2 gap-6">
          {[
            { v: 1391, l: "سال شروع", plain: true },
            { v: 38, l: "نفر در تیم" },
            { v: 124, l: "پروژه" },
            { v: 12, l: "پروژه در سال" },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl border border-border p-5">
              <dt className="text-sm text-muted-foreground">{s.l}</dt>
              <dd className="mt-1 text-4xl font-black">
                <Counter to={s.v} from={s.plain ? 1380 : 0} format={s.plain ? fa : undefined} />
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="border-y border-border bg-card/40">
        <div className="mx-auto grid max-w-6xl gap-px px-4 sm:px-6 md:grid-cols-3">
          {VALUES.map((v, i) => (
            <Reveal key={v.t} delay={i * 80} className="py-12 md:px-6 md:first:ps-0">
              <h2 className="text-xl font-bold">{v.t}</h2>
              <p className="mt-3 leading-7 text-muted-foreground">{v.b}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
        <h2 className="text-3xl font-black sm:text-4xl">تیم</h2>
        <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
          {TEAM.map((m, i) => (
            <li key={m.name}>
              <Art variant={i} className="grid aspect-square place-items-center rounded-3xl border border-border">
                <Avatar name={m.name} size="lg" className="size-20 bg-background/70 text-2xl backdrop-blur" />
              </Art>
              <p className="mt-4 font-bold">{m.name}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{m.role}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="rounded-3xl border border-border p-7 sm:p-10">
          <h2 className="text-2xl font-black">با ما کار کنید</h2>
          <p className="mt-2 text-muted-foreground">دنبال آدم‌هایی هستیم که از جزئیات لذت می‌برن.</p>
          <ul className="mt-8 divide-y divide-border border-t border-border">
            {ROLES.map((r) => (
              <li key={r.t}>
                <a href={href("/contact")} className="group flex items-center justify-between gap-4 py-5">
                  <span>
                    <span className="block font-semibold">{r.t}</span>
                    <span className="mt-0.5 block text-sm text-muted-foreground">{r.type}</span>
                  </span>
                  <ArrowUpLeft className="size-5 text-muted-foreground transition-transform group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:text-foreground" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Shell>
  );
}

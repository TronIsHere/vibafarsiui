"use client";

import { Reveal } from "@/registry/animations/reveal";
import { GirihBackground } from "@/registry/backgrounds/girih";
import { Photo, Shell, useHref } from "./shell";

const CHAPTERS = [
  { y: "۱۳۷۸", t: "یک آشپزخانه و شش میز", b: "فرخنده رحمانی با دستورهای مادرش یک ناهارخوری کوچک نزدیک ارگ کریم‌خان باز کرد.", photo: "kebab", alt: "چلوکباب برگ با گوجه‌ی کبابی" },
  { y: "۱۳۸۹", t: "حیاط و حوض", b: "خونه‌ی قدیمی بغلی را خریدیم و حیاطش شد محبوب‌ترین جای رستوران.", photo: "courtyard", alt: "حیاط رستوران با حوض فیروزه‌ای و تخت‌های سنتی" },
  { y: "۱۳۹۷", t: "شعبه‌ی دوم", b: "قصرالدشت، با همون آشپزها و همون دیگ‌های مسی.", photo: "fesenjan", alt: "خورش فسنجان با دانه‌ی انار" },
  { y: "۱۴۰۳", t: "نارنج در تهران", b: "شیرازی‌های تهران سال‌ها خواسته بودن. بالاخره اومدیم.", photo: "hero", alt: "سفره‌ی کامل ایرانی" },
];

const VALUES = [
  { t: "زعفران واقعی", b: "زعفران را مستقیم از یک خانواده در قائنات می‌خریم." },
  { t: "برنج دودی شمال", b: "هر فصل از یک شالیزار در آستانه‌ی اشرفیه." },
  { t: "بدون فریزر", b: "خورش‌ها هر روز صبح بار گذاشته میشن و شب تموم میشن." },
];

/** داستان رستوران در چهار فصل و مواد اولیه. */
export function AboutPage() {
  const href = useHref();
  return (
    <Shell active="/about">
      <section className="relative isolate overflow-hidden">
        <GirihBackground size={72} className="-z-10 opacity-60" />
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-28">
          <p className="text-sm font-semibold text-brand">داستان ما</p>
          <h1 className="mt-4 text-4xl font-black leading-[1.4] sm:text-6xl">بیست و هفت سال، یک دستور پخت</h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-9 text-muted-foreground">نارنج از یک آشپزخانه‌ی خانگی شروع شد و هنوز هم همون‌طور آشپزی می‌کنه، آروم و با حوصله.</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <ol className="space-y-16">
          {CHAPTERS.map((c, i) => (
            <li key={c.y}>
              <Reveal className="grid items-center gap-8 md:grid-cols-2">
                <div className={i % 2 ? "md:order-2" : undefined}>
                  <p className="text-6xl font-black text-foreground/10">{c.y}</p>
                  <h2 className="-mt-4 text-2xl font-black">{c.t}</h2>
                  <p className="mt-3 leading-8 text-muted-foreground">{c.b}</p>
                </div>
                <div className="aspect-[4/3] overflow-hidden rounded-[2rem] border border-border">
                  <Photo name={c.photo} alt={c.alt} />
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="text-center text-3xl font-black">از کجا میاد؟</h2>
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {VALUES.map((v) => (
            <li key={v.t} className="rounded-3xl border border-border p-7 text-center">
              <span className="mx-auto block size-2 rotate-45 bg-brand" />
              <h3 className="mt-5 text-lg font-bold">{v.t}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{v.b}</p>
            </li>
          ))}
        </ul>
        <div className="mt-12 text-center">
          <a href={href("/reserve")} className="inline-flex h-12 items-center rounded-full bg-brand px-7 text-sm font-semibold text-brand-foreground">
            یک میز برای ما نگه دارید
          </a>
        </div>
      </section>
    </Shell>
  );
}

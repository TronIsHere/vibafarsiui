"use client";

import { Droplets, Leaf, Recycle, Sun } from "lucide-react";
import { Avatar } from "@/registry/ui/avatar";
import { Reveal } from "@/registry/animations/reveal";
import { Dunes, Photo, Shell, useHref } from "./shell";

const HOSTS = [
  { n: "رضا و مریم تقوی", r: "میزبان‌ها و مرمت‌کننده‌های خونه" },
  { n: "ننه‌خاتون", r: "نون‌پز و آشپز صبحانه" },
  { n: "حسین مصری", r: "راهنمای کویر و شترداری" },
];

const GREEN = [
  { i: Sun, t: "آب گرم خورشیدی", b: "آب گرم همه‌ی حمام‌ها از پنل‌های روی پشت‌بام تأمین میشه." },
  { i: Droplets, t: "آب انبار", b: "آب باران زمستون را برای آبیاری باغ نگه می‌داریم." },
  { i: Recycle, t: "بدون پلاستیک یک‌بارمصرف", b: "بطری شیشه‌ای و کوزه در همه‌ی اتاق‌ها." },
  { i: Leaf, t: "خرید از روستا", b: "نون، لبنیات و سبزی صبحانه از همسایه‌ها خریده میشه." },
];

/** داستان مرمت، میزبان‌ها و سفر مسئولانه. */
export function AboutPage() {
  const href = useHref();
  return (
    <Shell active="/about">
      <section className="relative isolate overflow-hidden border-b border-border">
        <Photo name="room-hoz" alt="" eager className="absolute inset-0 -z-20" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-background/65" />
        <div className="mx-auto max-w-4xl px-4 pt-24 pb-32 text-center sm:px-6">
          <p className="text-sm text-muted-foreground">درباره‌ی کاهگل</p>
          <h1 className="mt-4 text-4xl font-black leading-[1.35] sm:text-6xl">خونه‌ای که قرار بود خراب بشه</h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="space-y-6 text-lg leading-9 text-foreground/85">
          <p>
            سال ۱۳۹۵ که برای اولین بار به روستای مصر اومدیم، این خونه نیمه‌ویران بود و قرار بود جاش یک ساختمان سیمانی بسازن. صاحبش راضی شد به ما بفروشه به این شرط که شکلش عوض نشه.
          </p>
          <p>
            دو سال طول کشید. با استادکارهای روستا، دیوارها را با همون کاهگل قدیمی اندود کردیم، ارسی‌ها را از نو ساختیم و بادگیر را دوباره راه انداختیم. حالا خونه تابستون‌ها بدون کولر خنکه، همون‌طور که صد و پنجاه سال پیش بود.
          </p>
        </div>
      </section>

      <section className="border-y border-border bg-card/40 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-3xl font-black">میزبان‌ها</h2>
          <ul className="mt-8 grid gap-5 sm:grid-cols-3">
            {HOSTS.map((h, i) => (
              <li key={h.n}>
                <Reveal delay={i * 80}>
                  <Dunes tone={i + 1} className="grid aspect-[4/3] place-items-center rounded-[2rem] border border-border">
                    <Avatar name={h.n} size="lg" className="relative size-20 bg-background/70 text-2xl backdrop-blur" />
                  </Dunes>
                  <p className="mt-4 font-bold">{h.n}</p>
                  <p className="text-sm text-muted-foreground">{h.r}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-3xl font-black">سفر مسئولانه</h2>
        <p className="mt-3 max-w-2xl leading-8 text-muted-foreground">کویر شکننده‌ست. این چهار کار را هر روز انجام میدیم تا بعد از ما هم همین‌طور بمونه.</p>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GREEN.map((g) => (
            <li key={g.t} className="rounded-3xl border border-border p-6">
              <g.i className="size-6 text-success" />
              <h3 className="mt-4 font-bold">{g.t}</h3>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">{g.b}</p>
            </li>
          ))}
        </ul>
        <div className="mt-14 text-center">
          <a href={href("/book")} className="inline-flex h-12 items-center rounded-full bg-foreground px-7 text-sm font-semibold text-background">
            بیایید و خودتون ببینید
          </a>
        </div>
      </section>
    </Shell>
  );
}

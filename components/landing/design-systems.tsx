"use client";

import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { Card } from "@/registry/ui/card";
import { Input } from "@/registry/ui/input";
import { Switch } from "@/registry/ui/switch";
import { cn, fa } from "@/lib/utils";
import { themes } from "@/lib/registry";
import { useTheme } from "@/lib/theme-store";
import { Section } from "./frame";
import { SectionHead } from "./section-head";

/** Real registry components, so each card shows the system's type, shape, depth and press. */
function ThemePreview({ slug }: { slug: string }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <p className="font-display text-lg leading-tight font-(--type-display-weight) [font-synthesis-weight:none]">
          سبد خرید
        </p>
        <Switch defaultChecked aria-label="ارسال سریع" />
      </div>
      <Input className="mt-3" placeholder="کد تخفیف" aria-label="کد تخفیف" name={`code-${slug}`} />
      <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm">
        <span className="text-muted-foreground">جمع</span>
        <span className="font-bold">۲٬۴۸۰٬۰۰۰ تومان</span>
      </div>
      <div className="mt-3 flex gap-2">
        <Button size="sm" className="flex-1">
          پرداخت
        </Button>
        <Button size="sm" variant="outline">
          بعداً
        </Button>
      </div>
    </Card>
  );
}

const SPEC = [
  { key: "type", label: "فونت" },
  { key: "shape", label: "فرم" },
  { key: "depth", label: "عمق" },
  { key: "motion", label: "حرکت" },
] as const;

export function DesignSystems({ standalone }: { standalone?: boolean }) {
  const { theme, setTheme } = useTheme();

  const head = (
    <SectionHead
      eyebrow={<>{fa(themes.length)} سیستم طراحی</>}
      title={standalone ? "سیستم‌های طراحی" : "یک کتابخانه، چند سیستم طراحی"}
      desc="هر سیستم طراحی یک زبان کامله، نه فقط یک پالت رنگ. فونت، فرم گوشه‌ها، ضخامت خط، سایه، حس کلیک و سرعت حرکت هم با تم عوض میشه. با دکمه‌ی «اعمال» رنگ سایت و زبان همه‌ی پیش‌نمایش‌ها عوض میشه و انتخابتون در مرورگر می‌مونه. روی اسم هر تم بزنید تا توکن‌ها و پرامپتش را ببینید."
      href="/themes"
      standalone={standalone}
    />
  );

  const grid = (
    <ul
      className={cn(
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        standalone && "overflow-hidden rounded-xl border border-border",
      )}
    >
      {themes.map((t, i) => {
        const active = theme === t.slug;
        return (
          <li
            key={t.slug}
            data-theme={t.slug}
            data-ds=""
            className={cn(
              "bg-background p-5 text-foreground",
              "border-b border-border",
              i % 2 === 0 ? "sm:border-e" : "",
              "lg:border-e lg:[&:nth-child(3n)]:border-e-0",
              i >= themes.length - 3 ? "lg:border-b-0" : "",
            )}
          >
            <ThemePreview slug={t.slug} />
            <div className="mt-4 flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold">
                    <Link
                      href={`/themes/${t.slug}`}
                      className="inline-flex items-center gap-1 underline-offset-4 hover:underline"
                    >
                      {t.name}
                      <ArrowLeft className="size-3 text-muted-foreground" />
                    </Link>
                  </h3>
                  <span className="rounded-control border-line border-border px-1.5 text-[11px] leading-5 text-muted-foreground">
                    {t.style}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {t.desc}
                </p>
              </div>
              <div className="flex shrink-0 -space-x-1 space-x-reverse">
                {t.swatches.map((c, j) => (
                  <span
                    key={j}
                    className="size-4 rounded-full border border-foreground/20"
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
            <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-[11px] leading-5">
              {SPEC.map((row) => (
                <div key={row.key} className="contents">
                  <dt className="text-muted-foreground">{row.label}</dt>
                  <dd>{t.language[row.key]}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-[11px] text-muted-foreground" dir="ltr">
                {t.nameEn} · {t.styleEn}
              </span>
              <button
                type="button"
                onClick={() => setTheme(t.slug)}
                aria-pressed={active}
                className={cn(
                  "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-control border-line px-3 text-xs font-medium transition-colors duration-(--motion) ease-motion",
                  active
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-foreground hover:bg-accent",
                )}
              >
                {active && <Check className="size-3.5" />}
                {active ? "فعال روی سایت" : "اعمال روی سایت"}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );

  if (standalone)
    return (
      <div>
        {head}
        {grid}
      </div>
    );
  return (
    <Section id="themes">
      {head}
      {grid}
    </Section>
  );
}

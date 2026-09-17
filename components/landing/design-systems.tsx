"use client";

import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { Switch } from "@/registry/ui/switch";
import { cn, fa } from "@/lib/utils";
import { themes } from "@/lib/registry";
import { useTheme } from "@/lib/theme-store";
import { Section } from "./frame";
import { SectionHead } from "./section-head";

function ThemePreview() {
  return (
    <div className="rounded-xl border border-border bg-card p-4 text-card-foreground">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">سبد خرید</span>
        <Switch defaultChecked aria-label="نمونه" />
      </div>
      <div className="mt-3 space-y-2">
        {[70, 50].map((w, j) => (
          <div key={j} className="flex items-center gap-2">
            <span className="size-6 rounded-md bg-secondary" />
            <span
              className="h-2 rounded bg-secondary"
              style={{ width: `${w}%` }}
            />
          </div>
        ))}
      </div>
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
    </div>
  );
}

export function DesignSystems({ standalone }: { standalone?: boolean }) {
  const { theme, setTheme } = useTheme();

  const head = (
    <SectionHead
      eyebrow={<>{fa(themes.length)} سیستم طراحی</>}
      title={standalone ? "سیستم‌های طراحی" : "یک کتابخانه، چند سیستم طراحی"}
      desc="رنگ، شعاع گوشه و کنتراست از توکن CSS می‌آیند. دکمه‌ی اعمال کل سایت را عوض می‌کند؛ انتخاب در مرورگر می‌ماند. روی نام هر تم بزنید تا توکن‌ها و پرامپتش را ببینید."
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
            className={cn(
              "bg-background p-5 text-foreground",
              "border-b border-border",
              i % 2 === 0 ? "sm:border-e" : "",
              "lg:border-e lg:[&:nth-child(3n)]:border-e-0",
              i >= themes.length - 3 ? "lg:border-b-0" : "",
            )}
          >
            <ThemePreview />
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
                  <span className="  text-[11px] text-muted-foreground">
                    {t.nameEn}
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
            <div className="mt-4 flex items-center justify-between">
              <span className="  text-[11px] text-muted-foreground">
                radius {t.radius}
              </span>
              <button
                type="button"
                onClick={() => setTheme(t.slug)}
                aria-pressed={active}
                className={cn(
                  "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors duration-200",
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

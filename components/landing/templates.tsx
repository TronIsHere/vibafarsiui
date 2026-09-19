"use client";

import Link from "next/link";
import { cn, fa as faN } from "@/lib/utils";
import { templates } from "@/lib/registry";
import { templateComponents } from "@/components/demos/templates";
import { Section } from "./frame";
import { SectionFoot, SectionHead } from "./section-head";

const PEEK_H = "h-64";

/** Crop a closer sneak peek of the top-right (RTL start), not a dollhouse of the whole page. */
function ScaledPreview({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn("relative overflow-hidden bg-background", PEEK_H)} aria-hidden inert>
      <div
        className="pointer-events-none absolute top-0 [&_.min-h-dvh]:min-h-0! [&_.h-dvh]:h-auto!"
        style={{
          right: 0,
          width: 720,
          transform: "scale(0.7)",
          transformOrigin: "top right",
        }}
      >
        {children}
      </div>
      <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-card to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-card to-transparent" />
    </div>
  );
}

export function Templates({ standalone }: { standalone?: boolean }) {
  const head = (
    <SectionHead
      eyebrow={<>{faN(templates.length)} قالب</>}
      title={standalone ? "قالب‌ها" : "صفحه‌های کامل، از همین قطعه‌ها"}
      desc="قالب‌ها با همین کامپوننت‌ها و توکن‌ها ساخته شده‌اند. تم را عوض کنید، همه‌ی صفحه‌ها با هم عوض می‌شوند. هر کدام را تمام‌صفحه باز کنید و کدش را بردارید."
      href="/templates"
      standalone={standalone}
    />
  );
  const grid = (
    <ul className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4", standalone ? "xl:grid-cols-3" : "p-3 sm:p-4 xl:grid-cols-4")}>
      {templates.map((t) => {
        const Preview = templateComponents[t.slug];
        return (
          <li key={t.slug}>
            <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors duration-200 hover:border-foreground/25 focus-within:ring-2 focus-within:ring-ring/60">
              {/* preview is inert and outside any anchor (nested <a> would break hydration) */}
              <ScaledPreview>{Preview ? <Preview /> : null}</ScaledPreview>
              <Link href={`/templates/${t.slug}`} aria-label={`باز کردن قالب ${t.name}`} className={cn("absolute inset-x-0 top-0 outline-none", PEEK_H)} />
              <Link href={`/templates/${t.slug}`} className="block border-t border-border px-4 py-3 outline-none">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold">{t.name}</h3>
                  <span className="font-mono text-[11px] text-muted-foreground" dir="ltr">{t.slug}</span>
                </div>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{t.desc}</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {t.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">{tag}</span>
                  ))}
                </div>
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
  if (standalone) return <div>{head}{grid}</div>;
  return (
    <Section id="templates">
      {head}
      {grid}
      <SectionFoot href="/templates" label="همه‌ی قالب‌ها" note="پیش‌نمایش زنده و کد کامل هر صفحه." />
    </Section>
  );
}

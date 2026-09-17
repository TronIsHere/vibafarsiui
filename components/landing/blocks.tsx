"use client";

import Link from "next/link";
import { cn, fa } from "@/lib/utils";
import { blocks } from "@/lib/registry";
import { blockDemos } from "@/components/demos/blocks";
import { Section } from "./frame";
import { SectionFoot, SectionHead } from "./section-head";

/** Blocks are full sections, so the cards show the real block scaled to fit. */
function ScaledPreview({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative h-56 overflow-hidden bg-background" aria-hidden inert>
      <div className="pointer-events-none absolute inset-x-0 top-0 origin-top" style={{ width: "200%", transform: "scale(0.5)", transformOrigin: "top right" }} aria-hidden>
        <div className="w-full">{children}</div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent" />
    </div>
  );
}

export function Blocks({ standalone }: { standalone?: boolean }) {
  const head = (
    <SectionHead
      eyebrow={<>{fa(blocks.length)} بلاک</>}
      title={standalone ? "بلاک‌ها" : "بلاک‌ها: بخش‌های آماده‌ی صفحه"}
      desc={standalone
        ? "هیرو، ردیف قیمت، پرسش‌های متداول، آمار و کارت ورود. هر کدام یک بخش کامل است؛ چندتایشان را پشت هم بگذارید."
        : "هیرو، قیمت، پرسش‌های متداول، آمار، کارت ورود. هر کدام یک بخش کامل است. چندتایشان را پشت هم بگذارید؛ صفحه آماده است."}
      href="/blocks"
      standalone={standalone}
    />
  );
  const grid = (
    <ul className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4", standalone ? "" : "p-3 sm:p-4")}>
      {blocks.map((b) => (
        <li key={b.slug}>
          <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors duration-200 hover:border-foreground/25 focus-within:ring-2 focus-within:ring-ring/60">
            {/* preview is inert and outside any anchor (nested <a> would break hydration) */}
            <ScaledPreview>{blockDemos[b.slug]}</ScaledPreview>
            <Link href={`/blocks/${b.slug}`} aria-label={`باز کردن بلاک ${b.name}`} className="absolute inset-x-0 top-0 h-56 outline-none" />
            <Link href={`/blocks/${b.slug}`} className="block border-t border-border px-4 py-3 outline-none">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold">{b.name}</h3>
                <span className="font-mono text-[11px] text-muted-foreground" dir="ltr">{b.slug}</span>
              </div>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{b.desc}</p>
              <div className="mt-2 flex flex-wrap gap-1">{b.tags.map((t) => <span key={t} className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted-foreground">{t}</span>)}</div>
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
  if (standalone) return <div>{head}{grid}</div>;
  return (
    <Section id="blocks">
      {head}
      {grid}
      <SectionFoot href="/blocks" label="همه‌ی بلاک‌ها" note="چند بلاک پشت هم، یک صفحه. هر کدام کد و پرامپت خودش را دارد." />
    </Section>
  );
}

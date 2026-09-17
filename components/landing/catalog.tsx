"use client";

import { useState } from "react";
import { cn, fa } from "@/lib/utils";
import { componentCats, components, type ComponentCat } from "@/lib/registry";
import { componentCardDemos, componentDemos } from "@/components/demos/components";
import { Section } from "./frame";
import { ItemCard, SectionFoot, SectionHead } from "./section-head";

export function Catalog({ standalone }: { standalone?: boolean }) {
  const [active, setActive] = useState<ComponentCat | "all">("all");
  const visible = active === "all" ? components : components.filter((i) => i.cat === active);

  const filters = (
    <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="دسته‌ها">
      {componentCats.map((c) => (
        <button
          key={c.key}
          type="button"
          role="tab"
          aria-selected={active === c.key}
          onClick={() => setActive(c.key)}
          className={cn(
            "cursor-pointer rounded-full border px-3 py-1 text-[13px] transition-colors duration-200",
            active === c.key ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground",
          )}
        >
          {c.label}
        </button>
      ))}
    </div>
  );

  const grid = (
    <ul className={cn("grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4", standalone ? "xl:grid-cols-3" : "p-3 sm:p-4 xl:grid-cols-4")}>
      {visible.map((it) => (
        <li key={it.slug} className={cn(it.wide && "sm:col-span-2")}>
          <ItemCard href={`/components/${it.slug}`} name={it.name} slug={it.slug} desc={it.desc}>
            <div className="flex w-full min-w-0 items-center justify-center">{(standalone ? componentDemos : componentCardDemos)[it.slug]}</div>
          </ItemCard>
        </li>
      ))}
    </ul>
  );

  const head = (
    <SectionHead
      eyebrow={<>{fa(visible.length)} از {fa(components.length)} کامپوننت</>}
      title={standalone ? "کامپوننت‌ها" : "هر کارت یک کامپوننت زنده است"}
      desc={standalone
        ? "دکمه، ورودی، جدول، تقویم شمسی و بقیه. هر کارت زنده است؛ روی نام بزنید تا کد، پرامپت و راهنما را ببینید."
        : "تصویر نیست؛ خود قطعه است. روی نام بزنید تا کد، پرامپت و راهنما را ببینید."}
      href="/components"
      standalone={standalone}
      aside={filters}
    />
  );

  if (standalone) return <div>{head}{grid}</div>;
  return (
    <Section id="catalog">
      {head}
      {grid}
      <SectionFoot href="/components" label="همه‌ی کامپوننت‌ها" note="هر کدام کد، پرامپت و راهنمای راست‌چین دارد." />
    </Section>
  );
}

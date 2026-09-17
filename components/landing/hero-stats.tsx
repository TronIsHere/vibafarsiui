"use client";

import { Counter } from "@/registry/animations/counter";
import { fa } from "@/lib/utils";

/** Counts up on load — each number is a real registry length, not a marketing figure. */
export function HeroStats({ items }: { items: { v: number; l: string }[] }) {
  return (
    <dl className="grid grid-cols-3 gap-x-6 gap-y-4 sm:flex sm:flex-wrap sm:gap-x-8">
      {items.map((f, i) => (
        <div key={f.l} className="flex items-baseline gap-2">
          <dt className="sr-only">{f.l}</dt>
          <dd className="  text-base font-semibold text-foreground">
            <Counter to={f.v} duration={900 + i * 120} format={(n) => fa(n)} />
          </dd>
          <dd className="text-xs text-muted-foreground">{f.l}</dd>
        </div>
      ))}
      <div className="flex items-baseline gap-2">
        <dd className="  text-base font-semibold text-brand">۱۰۰٪</dd>
        <dd className="text-xs text-muted-foreground">رایگان</dd>
      </div>
    </dl>
  );
}

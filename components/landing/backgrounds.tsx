"use client";

import Link from "next/link";
import { cn, fa } from "@/lib/utils";
import { backgrounds } from "@/lib/registry";
import { backgroundDemos } from "@/components/demos/backgrounds";
import { Section } from "./frame";
import { SectionFoot, SectionHead } from "./section-head";

export function Backgrounds({ standalone }: { standalone?: boolean }) {
  const head = (
    <SectionHead
      eyebrow={<>{fa(backgrounds.length)} پس‌زمینه</>}
      title={standalone ? "پس‌زمینه‌ها" : "پس‌زمینه‌هایی که متن را خفه نمی‌کنند"}
      desc="کم‌کنتراست و آرام، تا خط فارسی خوانا بماند. هر کدام یک کامپوننت کوچک است؛ داخل والد relative بگذارید."
      href="/backgrounds"
      standalone={standalone}
    />
  );
  const grid = (
    <ul
      className={cn(
        "grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3",
        standalone ? "" : "p-3 sm:p-4 xl:grid-cols-4",
      )}
    >
      {backgrounds.map((b) => (
        <li key={b.slug}>
          <Link
            href={`/backgrounds/${b.slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors duration-200 hover:border-foreground/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
          >
            <div className="relative h-44 overflow-hidden bg-card">
              {backgroundDemos[b.slug]}
            </div>
            <div className="border-t border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold">{b.name}</h3>
                <span className="  text-[11px] text-muted-foreground" dir="ltr">
                  {b.slug}
                </span>
              </div>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {b.desc}
              </p>
            </div>
          </Link>
        </li>
      ))}
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
    <Section id="backgrounds">
      {head}
      {grid}
      <SectionFoot
        href="/backgrounds"
        label="همه‌ی پس‌زمینه‌ها"
        note="با عوض شدن تم، رنگ‌شان هم عوض می‌شود."
      />
    </Section>
  );
}

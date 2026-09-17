"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionItem { id: string; title: React.ReactNode; content: React.ReactNode }

export interface AccordionProps {
  items: AccordionItem[];
  /** Allow several panels open at once. */
  multiple?: boolean;
  defaultOpen?: string[];
  className?: string;
}

/** آکاردئون. Chevron at the inline-end; height animates with CSS grid, no measuring. */
export function Accordion({ items, multiple, defaultOpen = [], className }: AccordionProps) {
  const [open, setOpen] = React.useState<string[]>(defaultOpen);
  const toggle = (id: string) =>
    setOpen((o) => (o.includes(id) ? o.filter((x) => x !== id) : multiple ? [...o, id] : [id]));

  return (
    <div className={cn("divide-y divide-border rounded-xl border border-border bg-card", className)}>
      {items.map((it) => {
        const isOpen = open.includes(it.id);
        return (
          <div key={it.id}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`acc-${it.id}`}
                onClick={() => toggle(it.id)}
                className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-start text-sm font-medium transition-colors hover:bg-accent/40"
              >
                {it.title}
                <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform duration-200", isOpen && "rotate-180")} />
              </button>
            </h3>
            <div id={`acc-${it.id}`} className={cn("grid transition-[grid-template-rows] duration-200 ease-out", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
              <div className="overflow-hidden">
                <div className="px-4 pb-4 text-sm leading-7 text-muted-foreground">{it.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

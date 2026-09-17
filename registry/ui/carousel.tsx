"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, fa } from "@/lib/utils";

export interface CarouselProps {
  children: React.ReactNode[];
  /** Fraction of the viewport each slide takes (1 = one per view, 0.5 = two). */
  slideWidth?: number;
  showDots?: boolean;
  className?: string;
}

/**
 * اسلایدر. Native RTL scroll-snap: the first slide sits at the right and «بعدی» scrolls left.
 * In RTL, scrollLeft counts down from 0 into negatives, so we work with |scrollLeft|.
 */
export function Carousel({ children, slideWidth = 1, showDots = true, className }: CarouselProps) {
  const track = React.useRef<HTMLDivElement>(null);
  const [index, setIndex] = React.useState(0);
  const count = React.Children.count(children);

  const step = () => (track.current ? track.current.clientWidth * slideWidth : 0);

  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    setIndex(Math.min(count - 1, Math.round(Math.abs(el.scrollLeft) / step())));
  };

  const go = (i: number) => {
    const el = track.current;
    if (!el) return;
    const target = Math.max(0, Math.min(count - 1, i));
    el.scrollTo({ left: -target * step(), behavior: "smooth" }); // negative = toward the left in RTL
  };

  const nav = "absolute top-1/2 z-10 flex size-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-border bg-background/80 text-foreground shadow backdrop-blur transition-opacity hover:bg-accent disabled:opacity-30";

  return (
    <div className={cn("relative", className)} role="region" aria-roledescription="carousel" aria-label="اسلایدر">
      <div
        ref={track}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {React.Children.map(children, (child, i) => (
          <div className="shrink-0 snap-start px-1.5" style={{ width: `${slideWidth * 100}%` }} role="group" aria-roledescription="slide" aria-label={`${fa(i + 1)} از ${fa(count)}`}>
            {child}
          </div>
        ))}
      </div>
      <button type="button" aria-label="قبلی" onClick={() => go(index - 1)} disabled={index === 0} className={cn(nav, "start-2")}><ChevronRight className="size-4" /></button>
      <button type="button" aria-label="بعدی" onClick={() => go(index + 1)} disabled={index >= count - 1} className={cn(nav, "end-2")}><ChevronLeft className="size-4" /></button>
      {showDots && (
        <div className="mt-3 flex justify-center gap-1.5">
          {Array.from({ length: count }, (_, i) => (
            <button key={i} type="button" aria-label={`اسلاید ${fa(i + 1)}`} aria-current={i === index} onClick={() => go(i)} className={cn("h-1.5 cursor-pointer rounded-full transition-all", i === index ? "w-5 bg-foreground" : "w-1.5 bg-foreground/30 hover:bg-foreground/50")} />
          ))}
        </div>
      )}
    </div>
  );
}

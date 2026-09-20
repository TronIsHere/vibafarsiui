"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { cn, faNumber, mulberry32 } from "@/lib/utils";

export type NumberWheelProps = {
  /** Target value the reel lands on. */
  value: number;
  /** Snap interval (e.g. 100 → …٬۰۰۰ / …٬۱۰۰ / …٬۲۰۰). */
  step?: number;
  /** Visible rows above and below the highlight. */
  sideItemsCount?: number;
  /** Row height in px. */
  itemsSize?: number;
  /** Scroll duration in ms. */
  duration?: number;
  /** Delay before the reel starts, in ms. */
  delay?: number;
  /** Show a star that fills as the reel approaches the target. */
  withStar?: boolean;
  className?: string;
  onComplete?: () => void;
};

function buildSteps(target: number, step: number, pad = 4): number[] {
  const rounded = Math.round(target / step) * step;
  const start = Math.max(0, rounded - step * pad);
  const end = rounded + step * pad;
  const out: number[] = [];
  for (let n = start; n <= end; n += step) out.push(n);
  return out;
}

/**
 * چرخ عدد. A vertical reel that scrolls to `value` with Persian digits.
 * Optional star fills as it approaches the highlight, then sparkles burst.
 */
export function NumberWheel({
  value,
  step = 100,
  sideItemsCount = 2,
  itemsSize = 36,
  duration = 1800,
  delay = 200,
  withStar = true,
  className,
  onComplete,
}: NumberWheelProps) {
  const rounded = Math.round(value / step) * step;
  const steps = React.useMemo(() => buildSteps(rounded, step), [rounded, step]);
  const targetIndex = steps.indexOf(rounded);
  const strip = React.useRef<HTMLDivElement>(null);
  const [index, setIndex] = React.useState(0);
  const [done, setDone] = React.useState(false);
  const onCompleteRef = React.useRef(onComplete);
  onCompleteRef.current = onComplete;

  React.useEffect(() => {
    setDone(false);
    setIndex(0);
    if (strip.current) {
      strip.current.style.transform = `translateY(${sideItemsCount * itemsSize}px)`;
    }
    const startAt = performance.now() + delay;
    let raf = 0;
    let finished = false;
    const tick = (t: number) => {
      if (t < startAt) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const p = Math.min(1, (t - startAt) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const pos = eased * targetIndex;
      if (strip.current) {
        strip.current.style.transform = `translateY(${sideItemsCount * itemsSize - pos * itemsSize}px)`;
      }
      setIndex(Math.round(pos));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else if (!finished) {
        finished = true;
        setDone(true);
        onCompleteRef.current?.();
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [targetIndex, duration, delay, sideItemsCount, itemsSize]);

  const fill = targetIndex === 0 ? 100 : (index / targetIndex) * 100;
  const height = itemsSize * (sideItemsCount * 2 + 1);

  return (
    <div
      className={cn("relative w-32 select-none", className)}
      style={{ height }}
      role="img"
      aria-label={faNumber(rounded)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-background to-transparent"
        style={{ height: itemsSize * sideItemsCount }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-background to-transparent"
        style={{ height: itemsSize * sideItemsCount }}
      />

      <div className="absolute inset-0 overflow-hidden">
        <div
          ref={strip}
          className="will-change-transform"
          style={{ transform: `translateY(${sideItemsCount * itemsSize}px)` }}
        >
          {steps.map((n, i) => (
            <div
              key={n}
              className={cn(
                "flex items-center justify-start ps-9 text-sm tabular-nums",
                i === index ? "font-semibold text-foreground" : "text-muted-foreground",
              )}
              style={{ height: itemsSize }}
              dir="ltr"
            >
              {faNumber(n)}
            </div>
          ))}
        </div>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 z-20 flex items-center rounded-md border border-border bg-accent/35 ps-2"
        style={{ top: sideItemsCount * itemsSize, height: itemsSize }}
      >
        {withStar && (
          <span className="relative inline-flex size-4 shrink-0">
            <Star className="size-4 fill-current text-muted-foreground/40" />
            <Star
              className="absolute inset-0 size-4 fill-current text-warning"
              style={{ clipPath: `inset(${100 - fill}% 0 0 0)` }}
            />
            {done &&
              Array.from({ length: 8 }, (_, i) => {
                const rand = mulberry32(i * 7919 + 13);
                const a = (i / 8) * Math.PI * 2;
                return (
                  <span
                    key={i}
                    className="absolute left-1/2 top-1/2 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-warning"
                    style={{
                      ["--burst-x" as string]: `${Math.cos(a) * (18 + rand() * 10)}px`,
                      ["--burst-y" as string]: `${Math.sin(a) * (18 + rand() * 10)}px`,
                      animation: `particle-burst 0.7s ease-out ${rand() * 0.12}s both`,
                    }}
                  />
                );
              })}
          </span>
        )}
      </div>
    </div>
  );
}

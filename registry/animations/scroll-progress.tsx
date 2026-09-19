"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** پیشرفت خواندن. A thin bar that fills from the right as the page (or the scrollable box in `targetRef`) scrolls. Fixed to the top by default; pass `sticky top-0` when it lives inside a scroll box. */
export function ScrollProgress({ targetRef, className }: { targetRef?: React.RefObject<HTMLElement | null>; className?: string }) {
  const [p, setP] = React.useState(0);
  React.useEffect(() => {
    const el = targetRef?.current;
    const src: HTMLElement | Window = el ?? window;
    const read = () => {
      const top = el ? el.scrollTop : window.scrollY;
      const max = el ? el.scrollHeight - el.clientHeight : document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? Math.min(1, top / max) : 0);
    };
    read();
    src.addEventListener("scroll", read, { passive: true });
    return () => src.removeEventListener("scroll", read);
  }, [targetRef]);
  return (
    <div role="progressbar" aria-label="پیشرفت خواندن" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(p * 100)} className={cn("pointer-events-none fixed inset-x-0 top-0 z-50 h-1", className)}>
      <div className="h-full origin-right bg-brand" style={{ transform: `scaleX(${p})` }} />
    </div>
  );
}

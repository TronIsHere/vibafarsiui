"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** هایلایت متن. A marker stroke sweeps under the phrase from the right once it scrolls into view. */
export function HighlightText({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [on, setOn] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { setOn(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <span
      ref={ref}
      className={cn("box-decoration-clone rounded-[0.2em] bg-no-repeat px-[0.12em] transition-[background-size] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]", className)}
      style={{
        backgroundImage: "linear-gradient(oklch(from var(--brand) l c h / 45%), oklch(from var(--brand) l c h / 45%))",
        backgroundPosition: "100% 100%", // anchored to the right, so it grows from the RTL start
        backgroundSize: `${on ? 100 : 0}% 0.5em`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </span>
  );
}

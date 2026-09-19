"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface AnimatedBeamProps {
  containerRef: React.RefObject<HTMLElement | null>;
  fromRef: React.RefObject<HTMLElement | null>;
  toRef: React.RefObject<HTMLElement | null>;
  /** Bend of the curve in px; positive bows it downward. */
  curvature?: number;
  duration?: number;
  delay?: number;
  /** Send the light from `to` back to `from`. */
  reverse?: boolean;
  className?: string;
}

/** پرتو اتصال. Draws a curve between two elements inside a `relative isolate` container and sends a pulse of light along it; the line sits behind the endpoints. Needs the `beam-travel` keyframes. */
export function AnimatedBeam({ containerRef, fromRef, toRef, curvature = 0, duration = 4, delay = 0, reverse = false, className }: AnimatedBeamProps) {
  const [d, setD] = React.useState("");
  const [size, setSize] = React.useState({ w: 0, h: 0 });
  React.useEffect(() => {
    const c = containerRef.current, a = fromRef.current, b = toRef.current;
    if (!c || !a || !b) return;
    const update = () => {
      const cr = c.getBoundingClientRect(), ar = a.getBoundingClientRect(), br = b.getBoundingClientRect();
      const x1 = ar.left - cr.left + ar.width / 2, y1 = ar.top - cr.top + ar.height / 2;
      const x2 = br.left - cr.left + br.width / 2, y2 = br.top - cr.top + br.height / 2;
      setSize({ w: cr.width, h: cr.height });
      setD(`M ${x1},${y1} Q ${(x1 + x2) / 2},${(y1 + y2) / 2 + curvature} ${x2},${y2}`);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(c);
    return () => ro.disconnect();
  }, [containerRef, fromRef, toRef, curvature]);
  // pathLength=100 makes the dash math independent of the real length: the 28-unit dash travels from just before the start to just past the end.
  const travel = { strokeDasharray: "28 100", animation: `beam-travel ${duration}s cubic-bezier(0.4,0,0.2,1) ${delay}s infinite ${reverse ? "reverse" : "normal"}` };
  return (
    <svg aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10 overflow-visible", className)} width={size.w} height={size.h} viewBox={`0 0 ${size.w || 1} ${size.h || 1}`} fill="none">
      <path d={d} stroke="var(--foreground)" strokeOpacity="0.14" strokeWidth="2" />
      <path d={d} pathLength={100} stroke="var(--brand)" strokeOpacity="0.35" strokeWidth="6" strokeLinecap="round" style={travel} />
      <path d={d} pathLength={100} stroke="var(--brand)" strokeWidth="2" strokeLinecap="round" style={travel} />
    </svg>
  );
}

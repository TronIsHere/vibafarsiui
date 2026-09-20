"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type RadialIntroItem = {
  id: string;
  name: string;
  src: string;
};

export type RadialIntroProps = {
  items: RadialIntroItem[];
  stageSize?: number;
  imageSize?: number;
  /** Seconds for one full orbit once spinning. */
  duration?: number;
  className?: string;
};

type Phase = "idle" | "lift" | "place" | "spin";

/**
 * معرفی شعاعی. Avatars gather at the centre, lift in, fan out to equal
 * angles, then orbit forever while staying upright. Needs `radial-orbit`
 * and `radial-counter` keyframes.
 */
export function RadialIntro({
  items,
  stageSize = 280,
  imageSize = 52,
  duration = 28,
  className,
}: RadialIntroProps) {
  const [phase, setPhase] = React.useState<Phase>("idle");
  const step = 360 / Math.max(items.length, 1);

  React.useEffect(() => {
    const t1 = window.setTimeout(() => setPhase("lift"), 120);
    const t2 = window.setTimeout(() => setPhase("place"), 520);
    const t3 = window.setTimeout(() => setPhase("spin"), 1100);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, []);

  const radius = (stageSize - imageSize) / 2 - 4;
  const ease = "520ms cubic-bezier(0.16, 1, 0.3, 1)";

  return (
    <div
      className={cn("relative overflow-visible", className)}
      style={{ width: stageSize, height: stageSize, ["--orbit-r" as string]: `${radius}px` }}
      role="img"
      aria-label={items.map((i) => i.name).join("، ")}
    >
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-border"
        style={{ width: radius * 2, height: radius * 2 }}
      />
      {items.map((item, i) => {
        const angle = i * step;
        const placed = phase === "place" || phase === "spin";
        const spinning = phase === "spin";
        const lifted = phase !== "idle";
        return (
          <div
            key={item.id}
            className="absolute inset-0 will-change-transform"
            style={{
              zIndex: items.length - i,
              ["--start-angle" as string]: `${angle}deg`,
              transform: placed ? `rotate(${angle}deg)` : "rotate(0deg)",
              transition: spinning ? undefined : `transform ${ease}`,
              animation: spinning ? `radial-orbit ${duration}s linear infinite` : undefined,
            }}
          >
            <img
              src={item.src}
              alt=""
              draggable={false}
              className="absolute left-1/2 top-1/2 aspect-square rounded-full object-cover shadow-md will-change-transform"
              style={{
                width: imageSize,
                height: imageSize,
                opacity: lifted || i === 0 ? 1 : 0,
                ["--start-angle" as string]: `${angle}deg`,
                transform: placed
                  ? `translate(-50%, calc(-50% - ${radius}px)) rotate(${-angle}deg)`
                  : lifted
                    ? "translate(-50%, -50%) rotate(0deg)"
                    : "translate(-50%, -50%) scale(0.85) rotate(0deg)",
                transition: spinning
                  ? undefined
                  : `transform ${ease}, opacity 280ms ease`,
                animation: spinning ? `radial-counter ${duration}s linear infinite` : undefined,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

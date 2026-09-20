import type { CSSProperties } from "react";
import { cn, mulberry32 } from "@/lib/utils";

const COLORS = [
  "var(--brand)",
  "var(--foreground)",
  "var(--success)",
  "var(--warning)",
  "var(--destructive)",
];

export type ConfettiProps = {
  count: number;
  spreadX: number;
  peakMin: number;
  peakMax: number;
  fallMin: number;
  fallMax: number;
  rotateMax: number;
  durationMin: number;
  durationMax: number;
  delayMax: number;
  sizeMin: number;
  sizeMax: number;
  colors: string[];
  seed: number;
  className: string;
};

export function Confetti({
  count = 60,
  spreadX = 200,
  peakMin = 130,
  peakMax = 370,
  fallMin = 40,
  fallMax = 160,
  rotateMax = 1080,
  durationMin = 1,
  durationMax = 2.5,
  delayMax = 0.6,
  sizeMin = 6,
  sizeMax = 12,
  colors = COLORS,
  seed = 0,
  className,
}: Partial<ConfettiProps>) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 -z-10", className)}
    >
      {Array.from({ length: count }, (_, i) => {
        const rand = mulberry32(seed * 9973 + i * 7919 + 1);

        const style = {
          background: colors[i % colors.length],
          borderRadius: i % 3 ? 2 : 999,
          width: `${(rand() + rand() * 0.5) * (sizeMax - sizeMin) + sizeMin}px`,
          height: `${((rand() + rand() * 0.5) * (sizeMax - sizeMin) + sizeMin) * 0.6}px`,
          "--spread-x": `${(rand() + rand() + rand() - 1.5) * spreadX}px`,
          "--peak-y": `${-(peakMin + rand() * (peakMax - peakMin))}px`,
          "--fall-y": `${fallMin + rand() * (fallMax - fallMin)}px`,
          "--rotate": `${(rand() - 0.5) * rotateMax}deg`,
          "--rotate-mid": `${(rand() - 0.5) * rotateMax * (0.4 + rand() * 0.3)}deg`,
          "--duration": `${durationMin + rand() * (durationMax - durationMin)}s`,
          "--delay": `${rand() * delayMax}s`,
          "--size": `${sizeMin + rand() * (sizeMax - sizeMin)}px`,
          animation: `confetti var(--duration) linear var(--delay) both`,
        } as CSSProperties;

        return (
          <span
            key={i}
            className="absolute top-1/2 -translate-y-1/2 left-1/2 block"
            style={style}
          />
        );
      })}
    </div>
  );
}

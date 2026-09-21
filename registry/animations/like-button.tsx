"use client";

import * as React from "react";
import { Heart } from "lucide-react";
import { cn, faNumber, mulberry32 } from "@/lib/utils";

/**
 * دکمه‌ی پسندیدن. The heart fills and pops, eight particles spray outward —
 * on like only; unliking just drains the colour — and the count nudges up with
 * the new number popping in. The spray is seeded, so every like looks a little
 * different. Needs the `like-pop`, `like-burst` and `digit-pop` keyframes.
 */
export function LikeButton({
  liked: likedProp,
  defaultLiked = false,
  count,
  onChange,
  className,
}: {
  liked?: boolean;
  defaultLiked?: boolean;
  /** Likes by everyone else; the user's own like is added on top. */
  count?: number;
  onChange?: (liked: boolean) => void;
  className?: string;
}) {
  const [inner, setInner] = React.useState(defaultLiked);
  const liked = likedProp ?? inner;
  const [burst, setBurst] = React.useState(0);

  const toggle = () => {
    const next = !liked;
    setInner(next);
    onChange?.(next);
    if (next) setBurst((n) => n + 1);
  };

  const rnd = mulberry32(burst * 7 + 1);
  const particles = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2 + rnd() * 0.6;
    const r = 14 + rnd() * 10;
    return { x: Math.cos(a) * r, y: Math.sin(a) * r, s: 0.6 + rnd() * 0.8, d: rnd() * 80 };
  });

  return (
    <button
      type="button"
      aria-pressed={liked}
      onClick={toggle}
      className={cn(
        "relative inline-flex h-9 cursor-pointer items-center gap-2 rounded-full border px-3.5 text-sm font-medium transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        liked ? "border-rose-500/40 bg-rose-500/10 text-rose-500" : "border-border hover:bg-accent",
        className,
      )}
    >
      <span className="relative grid place-items-center">
        {/* The pop lives on a wrapper, not the svg: transforming an inline svg makes Chromium rasterise it at 1×. */}
        <span key={burst} className="flex" style={liked ? { animation: "like-pop 0.4s cubic-bezier(0.34,1.56,0.64,1)" } : undefined}>
          <Heart className="size-4 transition-[fill] duration-300" style={{ fill: liked ? "currentColor" : "transparent" }} />
        </span>
        {liked && burst > 0 && (
          <span key={`burst-${burst}`} aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 size-0">
            {particles.map((p, i) => (
              <i
                key={i}
                className="absolute rounded-full bg-current"
                style={{
                  width: 4 * p.s,
                  height: 4 * p.s,
                  left: -2 * p.s,
                  top: -2 * p.s,
                  ["--px" as string]: `${p.x.toFixed(1)}px`,
                  ["--py" as string]: `${p.y.toFixed(1)}px`,
                  animation: `like-burst 600ms ease-out ${p.d.toFixed(0)}ms both`,
                }}
              />
            ))}
          </span>
        )}
      </span>
      {count != null && (
        <span className="inline-grid tabular-nums">
          <span key={liked ? "on" : "off"} className="col-start-1 row-start-1" style={{ ["--pop-y" as string]: liked ? 1 : -1, animation: "digit-pop 0.35s cubic-bezier(0.34,1.45,0.64,1) both" }}>
            {faNumber(count + (liked ? 1 : 0))}
          </span>
        </span>
      )}
    </button>
  );
}

import { cn } from "@/lib/utils";

export interface OrbitItem { node: React.ReactNode; radius: number; duration?: number; delay?: number }

/** مدار. Items circle a centre; each keeps upright thanks to the counter-rotation in the keyframe. */
export function Orbit({ center, items, size = 160, className }: { center: React.ReactNode; items: OrbitItem[]; size?: number; className?: string }) {
  const radii = Array.from(new Set(items.map((i) => i.radius)));
  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      {radii.map((r) => (
        <span key={r} aria-hidden className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-border" style={{ width: r * 2, height: r * 2 }} />
      ))}
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">{center}</span>
      {items.map((it, i) => (
        <span
          key={i}
          className="absolute left-1/2 top-1/2 -ml-3 -mt-3"
          style={{ ["--orbit-r" as string]: `${it.radius}px`, animation: `orbit ${it.duration ?? 8}s linear ${it.delay ?? 0}s infinite` }}
        >
          {it.node}
        </span>
      ))}
    </div>
  );
}

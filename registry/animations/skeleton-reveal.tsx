import { cn } from "@/lib/utils";

/**
 * ظهور از اسکلت. Two layers share one grid cell. While `loading` the skeleton
 * pulses; when data arrives it blurs out as the real content un-blurs in and
 * settles up by a few pixels. Nothing shifts, because both layers were always
 * in the same slot. Needs the `pulse-soft` keyframes.
 */
export function SkeletonReveal({
  loading,
  skeleton,
  children,
  duration = 400,
  className,
}: {
  loading: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
  duration?: number;
  className?: string;
}) {
  const fade = (on: boolean): React.CSSProperties => ({
    opacity: on ? 1 : 0,
    filter: on ? "blur(0)" : "blur(2px)",
    transition: `opacity ${duration}ms ease-in-out, filter ${duration}ms ease-in-out, transform ${duration}ms cubic-bezier(0.22,1,0.36,1)`,
  });
  return (
    <div className={cn("grid", className)} aria-busy={loading}>
      <div aria-hidden className="col-start-1 row-start-1 will-change-[opacity,filter]" style={fade(loading)}>
        <div style={loading ? { animation: "pulse-soft 1.2s ease-in-out infinite" } : undefined}>{skeleton}</div>
      </div>
      <div inert={loading} className="col-start-1 row-start-1 will-change-[transform,opacity,filter]" style={{ ...fade(!loading), transform: loading ? "translateY(4px)" : "translateY(0)" }}>
        {children}
      </div>
    </div>
  );
}

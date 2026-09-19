import { cn } from "@/lib/utils";

/** جرقه. Little four-point stars twinkle around the children; positions are stable across renders (no Math.random). Needs the `sparkle` keyframes. */
export function Sparkles({ children, count = 7, className }: { children: React.ReactNode; count?: number; className?: string }) {
  return (
    <span className={cn("relative inline-block", className)}>
      {Array.from({ length: count }, (_, i) => {
        const r = (n: number) => ((i * 9973 + n * 7919) % 100) / 100;
        return (
          <svg
            key={i}
            aria-hidden
            viewBox="0 0 24 24"
            className="pointer-events-none absolute size-3 text-brand"
            style={{ left: `${r(1) * 110 - 5}%`, top: `${r(2) * 110 - 15}%`, animation: `sparkle ${1.6 + r(3)}s ease-in-out ${r(4) * 2}s infinite` }}
          >
            <path fill="currentColor" d="M12 0c.6 6.9 5.1 11.4 12 12-6.9.6-11.4 5.1-12 12-.6-6.9-5.1-11.4-12-12 6.9-.6 11.4-5.1 12-12z" />
          </svg>
        );
      })}
      <span className="relative">{children}</span>
    </span>
  );
}

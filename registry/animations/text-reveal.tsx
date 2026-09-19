import { cn } from "@/lib/utils";

/** ظهور ماسکی. Each line wipes in from the right behind a mask, one after another. Needs the `wipe-in` keyframes. */
export function TextReveal({ lines, stagger = 140, duration = 900, className }: { lines: string[]; stagger?: number; duration?: number; className?: string }) {
  return (
    <span className={cn("inline-block", className)} aria-label={lines.join(" ")}>
      {lines.map((line, i) => (
        <span key={i} aria-hidden className="block" style={{ animation: `wipe-in ${duration}ms cubic-bezier(0.16,1,0.3,1) ${i * stagger}ms both` }}>
          {line}
        </span>
      ))}
    </span>
  );
}

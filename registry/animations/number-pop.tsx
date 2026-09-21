import { cn, faNumber } from "@/lib/utils";

/**
 * ظهور رقم‌ها. Every time `value` changes, each digit re-enters with a blurred
 * pop. The stagger starts from the ones digit — the right edge of the number —
 * so a Persian price reads as settling from its end. Needs the `digit-pop` keyframes.
 */
export function NumberPop({
  value,
  format = faNumber,
  unit,
  stagger = 30,
  from = "bottom",
  className,
}: {
  value: number;
  format?: (n: number) => string;
  unit?: React.ReactNode;
  /** Milliseconds between neighbouring digits. */
  stagger?: number;
  from?: "bottom" | "top";
  className?: string;
}) {
  const text = format(value);
  const chars = Array.from(text);
  const last = chars.length - 1;
  return (
    <span className={cn("inline-flex items-baseline gap-1 tabular-nums", className)} aria-live="polite" aria-label={`${text}${unit ? ` ${unit}` : ""}`}>
      {/* dir=ltr keeps the most-significant digit on the left inside an RTL line; the key remounts the digits on every change. */}
      <span key={text} dir="ltr" aria-hidden className="inline-flex items-baseline" style={{ ["--pop-y" as string]: from === "bottom" ? 1 : -1 }}>
        {chars.map((ch, i) => (
          <span
            key={i}
            className="inline-block will-change-[transform,opacity,filter]"
            style={{ animation: "digit-pop 0.5s cubic-bezier(0.34,1.45,0.64,1) both", animationDelay: `${(last - i) * stagger}ms` }}
          >
            {ch}
          </span>
        ))}
      </span>
      {unit && <span className="text-[0.6em] font-medium text-muted-foreground">{unit}</span>}
    </span>
  );
}

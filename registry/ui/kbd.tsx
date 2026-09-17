import { cn } from "@/lib/utils";

/** کلید میانبر. Always LTR so «⌘ K» reads the way it's typed. */
export function Kbd({
  keys,
  className,
}: {
  keys: string[];
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)} dir="ltr">
      {keys.map((k, i) => (
        <kbd
          key={i}
          className="rounded-md border border-border bg-card px-1.5 py-0.5   text-[11px] leading-5 text-foreground/80 shadow-[0_1px_0_0_var(--border)]"
        >
          {k}
        </kbd>
      ))}
    </span>
  );
}

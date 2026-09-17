import { cn } from "@/lib/utils";

/** اسکلت. Pulses by default; `shimmer` sweeps a highlight from right to left. */
export function Skeleton({ className, shimmer, ...props }: React.HTMLAttributes<HTMLDivElement> & { shimmer?: boolean }) {
  return (
    <div
      aria-hidden
      className={cn(
        "rounded-md bg-secondary",
        shimmer
          ? "relative overflow-hidden before:absolute before:inset-0 before:animate-shine before:bg-gradient-to-l before:from-transparent before:via-foreground/10 before:to-transparent"
          : "animate-pulse-soft",
        className,
      )}
      {...props}
    />
  );
}

/** A ready-made "list row" skeleton: avatar + two lines. */
export function SkeletonRow({ shimmer }: { shimmer?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <Skeleton shimmer={shimmer} className="size-10 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton shimmer={shimmer} className="h-2.5 w-3/4" />
        <Skeleton shimmer={shimmer} className="h-2 w-1/2" />
      </div>
    </div>
  );
}

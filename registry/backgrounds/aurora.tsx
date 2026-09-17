import { cn } from "@/lib/utils";

/** شفق. Three blurred blobs drifting slowly. Needs the `aurora` keyframes. */
export function AuroraBackground({ className }: { className?: string }) {
  const blob = "absolute rounded-full blur-3xl";
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <span className={cn(blob, "-left-1/4 -top-1/3 size-[70%] bg-foreground/15")} style={{ animation: "aurora 14s ease-in-out infinite alternate" }} />
      <span className={cn(blob, "-right-1/4 top-0 size-[60%] bg-brand/20")} style={{ animation: "aurora 14s ease-in-out -5s infinite alternate" }} />
      <span className={cn(blob, "bottom-[-30%] left-1/4 size-[60%] bg-foreground/10")} style={{ animation: "aurora 14s ease-in-out -9s infinite alternate" }} />
    </div>
  );
}

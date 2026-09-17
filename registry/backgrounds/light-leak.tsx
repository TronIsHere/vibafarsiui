import { cn } from "@/lib/utils";

/** نشت نور. A warm diagonal band of light drifting across, like film light-leak. Needs the `leak` keyframes. */
export function LightLeakBackground({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div
        className="absolute inset-y-[-40%] left-1/3 w-1/3 blur-2xl"
        style={{
          background: "linear-gradient(90deg, transparent, oklch(from var(--brand) l c h / 28%), oklch(from var(--brand) l c h / 12%), transparent)",
          animation: "leak 12s ease-in-out infinite",
        }}
      />
    </div>
  );
}

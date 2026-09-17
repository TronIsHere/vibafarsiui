import { cn } from "@/lib/utils";

/** تیک موفقیت. The circle pops in, then the check draws itself. Needs the `pop` and `draw` keyframes. */
export function SuccessCheck({ size = 72, label, className }: { size?: number; label?: React.ReactNode; className?: string }) {
  return (
    <div className={cn("inline-flex flex-col items-center gap-3", className)} role="status">
      <svg width={size} height={size} viewBox="0 0 72 72" style={{ animation: "pop 0.5s cubic-bezier(0.16,1,0.3,1) both" }}>
        <circle cx="36" cy="36" r="34" fill="var(--success)" opacity="0.15" />
        <circle cx="36" cy="36" r="34" fill="none" stroke="var(--success)" strokeWidth="2" />
        <path d="M22 37 L32 47 L51 27" fill="none" stroke="var(--success)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="48" strokeDashoffset="48" style={{ animation: "draw 0.5s ease-out 0.35s forwards" }} />
      </svg>
      {label && <p className="text-sm font-medium" style={{ animation: "word-in 0.5s ease-out 0.6s both" }}>{label}</p>}
    </div>
  );
}

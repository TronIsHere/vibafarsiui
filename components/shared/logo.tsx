import { cn } from "@/lib/utils";

/** Eight-point star (شمسه) — a nod to Persian tile geometry. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={cn("size-7", className)}
      aria-hidden
    >
      <defs>
        <linearGradient
          id="vf-g"
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="color-mix(in oklch, var(--brand) 70%, white)" />
          <stop offset="1" stopColor="var(--brand)" />
        </linearGradient>
      </defs>
      <rect
        x="6"
        y="6"
        width="20"
        height="20"
        rx="4"
        stroke="url(#vf-g)"
        strokeWidth="1.8"
      />
      <rect
        x="6"
        y="6"
        width="20"
        height="20"
        rx="4"
        stroke="url(#vf-g)"
        strokeWidth="1.8"
        transform="rotate(45 16 16)"
        opacity="0.85"
      />
      <circle cx="16" cy="16" r="3.2" fill="url(#vf-g)" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex h-8 items-center gap-2.5 leading-none", className)}>
      <LogoMark />
      <span className="inline-flex items-center text-[17px] font-bold leading-none">
        وایب‌فارسی
        <span className="ms-1.5 text-[12px] font-medium leading-none text-muted-foreground">
          UI
        </span>
      </span>
    </span>
  );
}

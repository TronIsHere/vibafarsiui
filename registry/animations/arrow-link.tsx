import { cn } from "@/lib/utils";

/**
 * لینک با فلش. A «بیشتر بخوانید» link whose chevron points along the reading
 * direction — left in RTL. On hover it slides that way, its two arms spread and
 * a shaft draws in behind them, so the chevron becomes a full arrow. Pure CSS;
 * keyboard focus and touch simply show the resting state.
 */
export function ArrowLink({
  children,
  href,
  className,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { children: React.ReactNode }) {
  const arm = "origin-[10px_8px] [transform-box:view-box] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:duration-200";
  return (
    <a
      href={href ?? "#"}
      className={cn("group inline-flex cursor-pointer items-center gap-1 text-sm font-medium text-foreground ltr:[--flip:1] rtl:[--flip:-1]", className)}
      {...props}
    >
      {children}
      <span className="inline-flex transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-[calc(3px*var(--flip))] group-hover:duration-200">
        <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ transform: "scaleX(var(--flip))" }} aria-hidden>
          <path d="M3.5 8H10" className="transition-[stroke-dashoffset] duration-300 [stroke-dasharray:7] [stroke-dashoffset:7] group-hover:duration-200 group-hover:[stroke-dashoffset:0]" />
          <path d="M6 4L10 8" className={cn(arm, "group-hover:rotate-[-8deg]")} />
          <path d="M10 8L6 12" className={cn(arm, "group-hover:rotate-[8deg]")} />
        </svg>
      </span>
    </a>
  );
}

import { cn } from "@/lib/utils";

/**
 * جابه‌جایی صفحه. Pages share one grid cell; the active one is visible and the
 * rest wait on either side. Going forward the new page enters from the "next"
 * side of the reading direction — the left in RTL — while the old one slides out
 * the other way, both through a light blur. Height follows the tallest page.
 */
export function PageSlide({
  index,
  pages,
  distance = 12,
  className,
}: {
  index: number;
  pages: React.ReactNode[];
  distance?: number;
  className?: string;
}) {
  const ease = "cubic-bezier(0.22,1,0.36,1)";
  return (
    <div className={cn("relative grid ltr:[--fwd:1] rtl:[--fwd:-1]", className)}>
      {pages.map((page, i) => {
        const active = i === index;
        // Pages after the active one wait on the "next" side, earlier ones on the "previous" side.
        const side = i > index ? 1 : i < index ? -1 : 0;
        return (
          <div
            key={i}
            inert={!active}
            aria-hidden={!active}
            className="col-start-1 row-start-1 will-change-[transform,opacity,filter]"
            style={{
              opacity: active ? 1 : 0,
              transform: `translateX(calc(${side * distance}px * var(--fwd)))`,
              filter: active ? "blur(0)" : "blur(3px)",
              transition: `opacity 250ms ease-out, transform 250ms ${ease}, filter 250ms ${ease}`,
              transitionDelay: active ? "40ms" : "0ms",
            }}
          >
            {page}
          </div>
        );
      })}
    </div>
  );
}

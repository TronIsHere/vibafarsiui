import { cn } from "@/lib/utils";

const FROM = {
  start: "ltr:[--px:-16px] rtl:[--px:16px] [--py:0px]",
  end: "ltr:[--px:16px] rtl:[--px:-16px] [--py:0px]",
  bottom: "[--px:0px] [--py:16px]",
  top: "[--px:0px] [--py:-16px]",
};

/**
 * ظهور پنل. A panel that slides into its region through a cross-blur; closed it
 * is invisible and inert, so nothing behind it is focusable by accident.
 * `from="start"` enters from the reading edge — the right in RTL.
 */
export function PanelReveal({
  open,
  from = "start",
  children,
  className,
}: {
  open: boolean;
  from?: keyof typeof FROM;
  children: React.ReactNode;
  className?: string;
}) {
  const ease = "cubic-bezier(0.22,1,0.36,1)";
  const dur = open ? 400 : 350;
  return (
    <div
      inert={!open}
      aria-hidden={!open}
      className={cn("will-change-[transform,opacity,filter]", FROM[from], className)}
      style={{
        transform: open ? "translate(0, 0)" : "translate(var(--px), var(--py))",
        opacity: open ? 1 : 0,
        filter: open ? "blur(0)" : "blur(2px)",
        transition: `transform ${dur}ms ${ease}, opacity ${dur}ms ${ease}, filter ${dur}ms ${ease}`,
      }}
    >
      {children}
    </div>
  );
}

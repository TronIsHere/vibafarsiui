import { cn } from "@/lib/utils";

export interface DockItem { icon: React.ComponentType<{ className?: string }>; label: string; onClick?: () => void }

/** داک. Icons magnify near the pointer; neighbours scale a little via :has(), no JS. The pill is tall enough to contain the magnified icon. */
export function Dock({ items, className }: { items: DockItem[]; className?: string }) {
  return (
    <div className={cn("flex h-20 items-end gap-2 rounded-2xl border border-border bg-card px-3 pb-2", className)} role="toolbar">
      {items.map((it) => (
        <button
          key={it.label}
          type="button"
          aria-label={it.label}
          title={it.label}
          onClick={it.onClick}
          className="flex size-10 origin-bottom cursor-pointer items-center justify-center rounded-xl bg-secondary text-foreground/80 transition-transform duration-200 hover:scale-[1.4] [&:has(+_:hover)]:scale-[1.18] [:hover+&]:scale-[1.18]"
        >
          <it.icon className="size-4" />
        </button>
      ))}
    </div>
  );
}

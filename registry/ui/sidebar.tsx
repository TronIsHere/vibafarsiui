"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn, fa } from "@/lib/utils";

export interface SidebarItemProps {
  icon?: React.ComponentType<{ className?: string }>;
  label: React.ReactNode;
  href?: string;
  active?: boolean;
  badge?: number | string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export function SidebarItem({ icon: Icon, label, href = "#", active, badge, onClick }: SidebarItemProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "flex items-center gap-2 rounded-md px-2.5 py-2 text-sm transition-colors",
        active ? "bg-accent font-medium text-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
      )}
    >
      <span className="flex min-w-0 items-center gap-2.5">
        {Icon && <Icon className="size-4 shrink-0" />}
        <span className="truncate">{label}</span>
        {badge !== undefined && (
          <span className="shrink-0 rounded-full bg-foreground px-1.5 text-[10px] font-semibold leading-4 text-background">
            {typeof badge === "number" ? fa(badge) : badge}
          </span>
        )}
      </span>
    </a>
  );
}

export function SidebarGroup({ title, collapsible, defaultOpen = true, children }: { title?: React.ReactNode; collapsible?: boolean; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="space-y-0.5">
      {title && (
        <button
          type="button"
          onClick={() => collapsible && setOpen((o) => !o)}
          className={cn("flex w-full items-center justify-between px-2.5 pb-1 pt-3 text-[11px] font-medium text-muted-foreground", collapsible && "cursor-pointer hover:text-foreground")}
        >
          {title}
          {collapsible && <ChevronDown className={cn("size-3 transition-transform", !open && "rotate-90")} />}
        </button>
      )}
      {open && children}
    </div>
  );
}

/** نوار کناری. A navigation column that sits at the inline-start (right in RTL). */
export function Sidebar({ header, footer, className, children }: { header?: React.ReactNode; footer?: React.ReactNode; className?: string; children: React.ReactNode }) {
  return (
    <aside className={cn("flex w-60 flex-col rounded-xl border border-border bg-card p-2", className)}>
      {header && <div className="border-b border-border px-2.5 pb-3 pt-1">{header}</div>}
      <nav className="flex-1 space-y-0.5 py-1">{children}</nav>
      {footer && <div className="border-t border-border px-2.5 pt-3">{footer}</div>}
    </aside>
  );
}

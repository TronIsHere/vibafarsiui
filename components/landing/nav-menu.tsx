"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavGroup } from "./nav-links";

/**
 * Top-bar dropdown for a nav group. Opens on hover (with a short close delay so the
 * pointer can cross the gap) and on click, closes on Escape, outside focus or a link click.
 */
export function NavMenu({ group }: { group: NavGroup }) {
  const [open, setOpen] = React.useState(false);
  const root = React.useRef<HTMLDivElement>(null);
  const trigger = React.useRef<HTMLButtonElement>(null);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const pointerType = React.useRef("");
  const id = React.useId();

  const show = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hide = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };

  React.useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      trigger.current?.focus();
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  React.useEffect(() => () => clearTimeout(closeTimer.current), []);

  return (
    <div
      ref={root}
      className="relative"
      onPointerEnter={(e) => e.pointerType === "mouse" && show()}
      onPointerLeave={(e) => e.pointerType === "mouse" && hide()}
      onBlur={(e) => {
        if (!root.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={trigger}
        type="button"
        onPointerDown={(e) => (pointerType.current = e.pointerType)}
        onClick={() => {
          // With a mouse, hover already opened it, so a click should not snap it shut.
          if (pointerType.current === "mouse") show();
          else setOpen((v) => !v);
          pointerType.current = "";
        }}
        aria-expanded={open}
        aria-controls={id}
        className={cn(
          "inline-flex h-8 cursor-pointer items-center gap-1 rounded-md px-2 text-[13px] leading-none transition-colors duration-200 hover:text-foreground",
          open ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {group.label}
        <ChevronDown
          aria-hidden
          className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {/* pt-2 is an invisible hover bridge between the trigger and the panel */}
      <div
        id={id}
        hidden={!open}
        className="absolute start-0 top-full z-50 pt-2"
      >
        <ul className="grid w-[30rem] grid-cols-2 gap-1 rounded-overlay border border-border bg-popover p-2 text-popover-foreground shadow-overlay animate-fade-up [animation-duration:160ms] [backdrop-filter:var(--surface-filter)]">
          {group.items.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex cursor-pointer flex-col gap-1 rounded-md px-3 py-2.5 transition-colors duration-200 hover:bg-accent focus-visible:bg-accent"
              >
                <span className="text-[13px] font-medium leading-none text-foreground">{l.label}</span>
                {l.desc && (
                  <span className="text-xs leading-5 text-muted-foreground">{l.desc}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

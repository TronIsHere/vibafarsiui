"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/registry/ui/button";
import { Sheet } from "@/registry/ui/sheet";
import { cn } from "@/lib/utils";

export interface NavLink { label: string; href: string; active?: boolean }

export interface NavbarProps {
  logo: React.ReactNode;
  /** Where the logo points. */
  homeHref?: string;
  links: NavLink[];
  primary?: { label: string; href?: string };
  secondary?: { label: string; href?: string };
  /** Sticks to the top with a blurred background. */
  sticky?: boolean;
  className?: string;
}

/** نوار بالا. Logo on the right, links in the middle, actions on the left; a sheet from the right on mobile. */
export function Navbar({ logo, homeHref = "/", links, primary = { label: "شروع رایگان" }, secondary = { label: "ورود" }, sticky = true, className }: NavbarProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <header className={cn("z-40 border-b border-border bg-background/80 backdrop-blur", sticky && "sticky top-0", className)}>
        <nav aria-label="اصلی" className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6">
          <a href={homeHref} className="flex items-center gap-2 text-base font-bold">{logo}</a>
          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <li key={l.label}>
                <a href={l.href} aria-current={l.active ? "page" : undefined} className={cn("rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent", l.active ? "text-foreground" : "text-muted-foreground")}>{l.label}</a>
              </li>
            ))}
          </ul>
          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" size="sm">{secondary.label}</Button>
            <Button size="sm">{primary.label}</Button>
          </div>
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="باز کردن منو" onClick={() => setOpen(true)}><Menu /></Button>
        </nav>
      </header>
      {/* A sibling of the header: backdrop-blur would otherwise trap the fixed sheet inside it. */}
      <Sheet open={open} onOpenChange={setOpen} title={logo}>
        <ul className="flex flex-col p-2">
          {links.map((l) => (
            <li key={l.label}><a href={l.href} className="block rounded-md px-3 py-2.5 text-sm hover:bg-accent" onClick={() => setOpen(false)}>{l.label}</a></li>
          ))}
        </ul>
        <div className="mt-auto flex flex-col gap-2 border-t border-border p-4">
          <Button>{primary.label}</Button>
          <Button variant="outline">{secondary.label}</Button>
        </div>
      </Sheet>
    </>
  );
}
